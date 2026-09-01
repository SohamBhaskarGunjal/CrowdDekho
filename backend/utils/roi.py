from typing import Tuple, List, Union, Optional

Point = Tuple[int, int]
ROI = Tuple[int, int, int, int]  # (x1, y1, x2, y2)


def get_bbox_center(bbox: Union[List[int], Tuple[int, int, int, int]]) -> Point:
    """
    Calculates the integer center (x, y) of a bounding box.
    bbox format: [x1, y1, x2, y2]
    """
    if not bbox or len(bbox) != 4:
        raise ValueError("Invalid bbox format. Expected [x1, y1, x2, y2].")
    
    x1, y1, x2, y2 = bbox
    center_x = int((x1 + x2) / 2)
    center_y = int((y1 + y2) / 2)
    return (center_x, center_y)


def is_inside_roi(point: Point, roi: Optional[ROI]) -> bool:
    """
    Checks whether a point (x, y) falls inside a rectangular ROI (x1, y1, x2, y2).
    If ROI is None, returns True by default (entire frame treated as ROI).
    """
    if roi is None:
        return True
    
    if len(roi) != 4:
        raise ValueError("Invalid ROI format. Expected (x1, y1, x2, y2).")
        
    x1, y1, x2, y2 = roi
    
    # Standardize bounds if coordinates were swapped
    min_x, max_x = min(x1, x2), max(x1, x2)
    min_y, max_y = min(y1, y2), max(y1, y2)
    
    px, py = point
    return min_x <= px <= max_x and min_y <= py <= max_y