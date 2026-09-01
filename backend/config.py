"""
Central configuration for the AI Queue & Crowd Prediction System.
All thresholds here are intentionally exposed so they can be tuned
live from the Streamlit sidebar without touching business logic.
"""

from dataclasses import dataclass, field
from typing import Dict


@dataclass
class CrowdThresholds:
    """People-count thresholds used to classify crowd level.

    A queue is classified by comparing the *current people count* against
    these boundaries. Everything below `low_max` is LOW, up to `medium_max`
    is MEDIUM, up to `high_max` is HIGH, and anything above is CRITICAL.
    """
    low_max: int = 10
    medium_max: int = 25
    high_max: int = 40  # anything above this is CRITICAL


@dataclass
class AlertThresholds:
    """Thresholds that drive the alerting engine."""
    capacity: int = 30                 # "safe" queue capacity for a center
    critical_capacity: int = 45        # hard critical ceiling
    growth_rate_warning: float = 1.5   # people/min net growth to trigger a buildup warning
    counter_imbalance: int = 8         # people difference that triggers a redirect suggestion


@dataclass
class SimulationDefaults:
    initial_queue: int = 18
    arrival_rate: float = 5.0     # people per minute
    service_rate: float = 3.0     # people per minute per counter
    num_counters: int = 3
    counter_capacity: int = 25
    avg_service_time: float = 4.0  # minutes per person per counter
    duration_minutes: int = 60
    noise_std: float = 1.5         # stddev of random variation injected into simulation


@dataclass
class YoloConfig:
    model_name: str = "yolov8s.pt"   # smallest/lightest ultralytics model, CPU-friendly
    person_class_id: int = 0         # COCO class id for "person"
    confidence: float = 0.35
    frame_stride: int = 3            # process every Nth frame for speed


DEMO_SCENARIOS: Dict[str, dict] = {
    # NOTE: arrival_rate is total people/min arriving; service_rate is PER
    # COUNTER people/min served, so total service capacity = service_rate *
    # num_counters. These values are chosen so each scenario's queue trend
    # (stable / growing / rapidly growing) actually matches its label.
    "Normal": {
        "initial_queue": 8,
        "arrival_rate": 9.0,
        "service_rate": 3.0,
        "num_counters": 3,
        "description": "Queue is stable; arrivals roughly match total service capacity (9/min vs 9/min).",
    },
    "Busy": {
        "initial_queue": 22,
        "arrival_rate": 11.0,
        "service_rate": 3.0,
        "num_counters": 3,
        "description": "Queue is steadily increasing; arrivals (11/min) outpace total service capacity (9/min).",
    },
    "Critical": {
        "initial_queue": 38,
        "arrival_rate": 15.0,
        "service_rate": 3.0,
        "num_counters": 3,
        "description": "Queue is rapidly increasing; arrivals (15/min) far exceed total service capacity (9/min).",
    },
}

PREDICTION_HORIZONS_MIN = [5, 10, 20, 30]

DEFAULT_CROWD_THRESHOLDS = CrowdThresholds()
DEFAULT_ALERT_THRESHOLDS = AlertThresholds()
DEFAULT_SIM = SimulationDefaults()
DEFAULT_YOLO = YoloConfig()
