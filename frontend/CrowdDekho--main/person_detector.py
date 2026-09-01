import os
from datetime import datetime
from collections import deque
from typing import Dict, Any, List, Tuple, Optional, Union, Set
import cv2
import numpy as np
import torch
from ultralytics import YOLO

from .roi import is_inside_roi, get_bbox_center


class PersonDetector:
    """
    Upgraded YOLO-based Person Detector, ByteTrack Tracker, and Queue Counter module.
    Detects individual people (COCO Class ID 0), tracks them, calculates queue counts,
    entry/exit metrics, queue status, and short-term trends for downstream consumption.
    """
    
    COCO_PERSON_CLASS_ID = 0

    def __init__(
        self,
        model_path: str = "yolo11n.pt",
        confidence: float = 0.25,  # Lowered default for dense crowds
        roi: Optional[Tuple[int, int, int, int]] = None,
        device: Optional[str] = None,
        smoothing_window: int = 5,
        max_history_length: int = 1000,
        tracker_type: str = "bytetrack.yaml",
        status_thresholds: Optional[Dict[str, int]] = None
    ):
        self.confidence = confidence
        self.roi = roi
        self.smoothing_window = max(1, smoothing_window)
        self.max_history_length = max_history_length
        self.tracker_type = tracker_type

        # Default Queue Status Thresholds (Configurable)
        self.status_thresholds = status_thresholds or {
            "low": 5,        # 0 to 4: LOW
            "moderate": 10,   # 5 to 9: MODERATE
            "high": 18       # 10 to 17: HIGH, >=18: CRITICAL
        }

        # Auto-detect compute device
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device

        # Temporal Smoothing & Time-Series History
        self._recent_counts: deque = deque(maxlen=self.smoothing_window)
        self._count_history: List[Dict[str, Union[str, int]]] = []

        # Tracking State for Entry / Exit Calculations
        self._roi_state: Dict[int, bool] = {}  # {track_id: inside_roi_bool}
        self.people_entered_queue: int = 0
        self.people_exited_queue: int = 0
        self._seen_track_ids: Set[int] = set()

        # Load Ultralytics YOLO Model
        self.model = self._load_model(model_path)

    def _load_model(self, model_path: str) -> YOLO:
        """Loads Ultralytics YOLO model with fallback to yolov8n.pt if model_path fails."""
        try:
            model = YOLO(model_path)
            model.to(self.device)
            return model
        except Exception as e:
            fallback_model = "yolov8n.pt"
            print(f"[Warning] Failed to load '{model_path}': {e}")
            print(f"[Info] Falling back to supported lightweight model '{fallback_model}'...")
            try:
                model = YOLO(fallback_model)
                model.to(self.device)
                return model
            except Exception as fallback_err:
                raise RuntimeError(
                    f"Failed to initialize YOLO model. Ensure weights can be downloaded or provide a local path. Details: {fallback_err}"
                )

    def set_roi(self, roi: Optional[Tuple[int, int, int, int]]):
        """Dynamically update the queue Region of Interest (x1, y1, x2, y2)."""
        self.roi = roi

    def reset_tracking(self):
        """Resets tracking states, entry/exit counters, and historical logs."""
        self._roi_state.clear()
        self._seen_track_ids.clear()
        self.people_entered_queue = 0
        self.people_exited_queue = 0
        self._count_history.clear()
        self._recent_counts.clear()

    def get_count_history(self) -> List[Dict[str, Any]]:
        """Returns the timestamped log history for the prediction engine."""
        return list(self._count_history)

    def _calculate_queue_status(self, queue_count: int) -> str:
        """Determines categorical crowd/queue status based on configured thresholds."""
        low = self.status_thresholds.get("low", 5)
        mod = self.status_thresholds.get("moderate", 10)
        high = self.status_thresholds.get("high", 18)

        if queue_count < low:
            return "LOW"
        elif queue_count < mod:
            return "MODERATE"
        elif queue_count < high:
            return "HIGH"
        else:
            return "CRITICAL"

    def _calculate_queue_trend(self) -> str:
        """Calculates current queue movement trend (INCREASING, STABLE, DECREASING) using history slope."""
        if len(self._recent_counts) < 3:
            return "STABLE"

        y = list(self._recent_counts)
        x = np.arange(len(y))
        # Simple linear regression slope
        slope = np.polyfit(x, y, 1)[0]

        if slope > 0.35:
            return "INCREASING"
        elif slope < -0.35:
            return "DECREASING"
        else:
            return "STABLE"

    def process_frame(
        self,
        frame: np.ndarray,
        source_label: str = "stream",
        draw_annotations: bool = True
    ) -> Dict[str, Any]:
        """
        Processes a single OpenCV BGR frame.
        Runs ByteTrack person detection/tracking, checks ROI status, computes entry/exit metrics,
        and returns structured results.
        """
        timestamp = datetime.now().isoformat()

        if frame is None or frame.size == 0:
            return {
                "timestamp": timestamp,
                "current_queue_count": 0,
                "queue_people_count": 0,
                "total_people_count": 0,
                "tracked_people_count": 0,
                "people_entered_queue": self.people_entered_queue,
                "people_exited_queue": self.people_exited_queue,
                "queue_status": "LOW",
                "queue_trend": "STABLE",
                "source": source_label,
                "detections": [],
                "annotated_frame": frame,
                "error": "Empty or invalid frame provided"
            }

        # Run ByteTrack tracking filtered specifically to COCO Person (Class 0)
        try:
            results = self.model.track(
                frame,
                conf=self.confidence,
                classes=[self.COCO_PERSON_CLASS_ID],
                device=self.device,
                persist=True,
                tracker=self.tracker_type,
                verbose=False
            )
        except Exception as e:
            # Fallback to standard inference if tracking module encounters an error
            results = self.model(
                frame,
                conf=self.confidence,
                classes=[self.COCO_PERSON_CLASS_ID],
                device=self.device,
                verbose=False
            )

        detections = []
        raw_queue_count = 0
        total_people_count = 0
        current_frame_track_ids = set()

        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            
            # Extract track IDs if available from ByteTrack
            has_ids = hasattr(boxes, 'id') and boxes.id is not None
            track_ids = boxes.id.cpu().numpy().astype(int).tolist() if has_ids else list(range(len(boxes)))

            for i, box in enumerate(boxes):
                cls_id = int(box.cls[0].item())
                if cls_id != self.COCO_PERSON_CLASS_ID:
                    continue  # Ensure non-person objects are ignored

                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].cpu().numpy().astype(int).tolist()
                center = get_bbox_center(xyxy)
                inside = is_inside_roi(center, self.roi)
                
                track_id = int(track_ids[i]) if i < len(track_ids) else -1
                if track_id != -1:
                    current_frame_track_ids.add(track_id)
                    self._seen_track_ids.add(track_id)

                    # Transition Analysis for Entry/Exit Counting
                    prev_inside = self._roi_state.get(track_id, False)
                    if not prev_inside and inside:
                        self.people_entered_queue += 1
                    elif prev_inside and not inside:
                        self.people_exited_queue += 1
                    
                    self._roi_state[track_id] = inside

                total_people_count += 1
                if inside:
                    raw_queue_count += 1

                detections.append({
                    "class": "person",
                    "track_id": track_id,
                    "confidence": round(conf, 2),
                    "bbox": xyxy,
                    "center": list(center),
                    "inside_queue": inside
                })

        # Temporal Count Smoothing using Moving Median
        self._recent_counts.append(raw_queue_count)
        smoothed_queue_count = int(np.median(self._recent_counts))

        # Status and Trend Calculations
        queue_status = self._calculate_queue_status(smoothed_queue_count)
        queue_trend = self._calculate_queue_trend()

        # Log Time-Series History entry for Prediction Engine
        history_entry = {
            "timestamp": timestamp,
            "queue_count": smoothed_queue_count,
            "total_people": total_people_count,
            "people_entered": self.people_entered_queue,
            "people_exited": self.people_exited_queue
        }
        self._count_history.append(history_entry)
        if len(self._count_history) > self.max_history_length:
            self._count_history.pop(0)

        # Draw Frame Visualization
        annotated_frame = frame.copy() if draw_annotations else frame
        if draw_annotations:
            annotated_frame = self._annotate_frame(
                annotated_frame,
                detections,
                smoothed_queue_count,
                total_people_count,
                queue_status,
                queue_trend
            )

        # Output payload containing legacy keys + new metrics
        return {
            # New Upgraded Interface Keys
            "timestamp": timestamp,
            "current_queue_count": smoothed_queue_count,
            "total_people_count": total_people_count,
            "tracked_people_count": len(self._seen_track_ids),
            "people_entered_queue": self.people_entered_queue,
            "people_exited_queue": self.people_exited_queue,
            "queue_status": queue_status,
            "queue_trend": queue_trend,
            "detections": detections,
            "annotated_frame": annotated_frame,
            # Legacy Backward Compatibility Keys
            "queue_people_count": smoothed_queue_count,
            "source": source_label
        }

    def _annotate_frame(
        self,
        frame: np.ndarray,
        detections: List[Dict[str, Any]],
        queue_count: int,
        total_count: int,
        status: str,
        trend: str
    ) -> np.ndarray:
        """Renders bounding boxes, tracking IDs, ROI frame, and status overlay."""
        # Draw ROI Box if set
        if self.roi is not None:
            rx1, ry1, rx2, ry2 = self.roi
            cv2.rectangle(frame, (rx1, ry1), (rx2, ry2), (255, 191, 0), 2)  # Cyan ROI
            cv2.putText(
                frame, "QUEUE REGION", (rx1 + 5, max(ry1 + 20, 20)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 191, 0), 2
            )

        # Draw Person Boxes & Tracking IDs
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            conf = det["confidence"]
            inside = det["inside_queue"]
            center = det["center"]
            t_id = det["track_id"]

            color = (0, 255, 0) if inside else (0, 165, 255)  # Green inside ROI, Orange outside

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.circle(frame, (center[0], center[1]), 4, (0, 0, 255), -1)

            id_str = f"ID:{t_id} " if t_id != -1 else ""
            label = f"{id_str}{conf:.2f}"
            cv2.putText(
                frame, label, (x1, max(y1 - 5, 15)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1
            )

        # Status Banner
        cv2.rectangle(frame, (10, 10), (320, 120), (0, 0, 0), -1)
        
        # Color Status Text
        status_colors = {
            "LOW": (0, 255, 0),
            "MODERATE": (0, 255, 255),
            "HIGH": (0, 165, 255),
            "CRITICAL": (0, 0, 255)
        }
        stat_color = status_colors.get(status, (255, 255, 255))

        cv2.putText(frame, f"Queue Count: {queue_count}", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 0), 2)
        cv2.putText(frame, f"Total People: {total_count}", (20, 58), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)
        cv2.putText(frame, f"Status: {status}", (20, 81), cv2.FONT_HERSHEY_SIMPLEX, 0.55, stat_color, 2)
        cv2.putText(frame, f"Trend: {trend} | In:{self.people_entered_queue} Out:{self.people_exited_queue}", 
                    (20, 104), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)

        return frame