"""
Waiting-time estimation and crowd-level classification.

All formulas here are deliberately simple and explainable (no black-box
model) so that a hackathon judge -- or an operator -- can see exactly why
a number was produced.
"""

from dataclasses import dataclass
from typing import List, Dict

from utils.config import CrowdThresholds, DEFAULT_CROWD_THRESHOLDS


@dataclass
class CounterState:
    name: str
    people: int
    service_rate_per_min: float  # people served per minute at this counter
    active: bool = True

    @property
    def estimated_wait_minutes(self) -> float:
        """waiting_time ≈ queue_size / effective_service_rate"""
        if not self.active or self.service_rate_per_min <= 0:
            return float("inf")
        return round(self.people / self.service_rate_per_min, 1)


def effective_service_rate(num_counters: int, service_rate_per_counter: float) -> float:
    """Combined service capacity across all *active* counters."""
    return max(num_counters, 0) * max(service_rate_per_counter, 0.0)


def estimate_overall_wait(queue_size: int, num_counters: int, service_rate_per_counter: float) -> float:
    """Simple system-wide average wait: queue_size / effective_service_rate."""
    rate = effective_service_rate(num_counters, service_rate_per_counter)
    if rate <= 0:
        return float("inf")
    return round(queue_size / rate, 1)


def classify_crowd_level(people_count: int, thresholds: CrowdThresholds = DEFAULT_CROWD_THRESHOLDS) -> str:
    if people_count <= thresholds.low_max:
        return "LOW"
    if people_count <= thresholds.medium_max:
        return "MEDIUM"
    if people_count <= thresholds.high_max:
        return "HIGH"
    return "CRITICAL"


def crowd_level_color(level: str) -> str:
    return {
        "LOW": "#22c55e",       # green
        "MEDIUM": "#eab308",    # amber
        "HIGH": "#f97316",      # orange
        "CRITICAL": "#ef4444",  # red
    }.get(level, "#6b7280")


def build_counter_table(counters: List[CounterState]) -> List[Dict]:
    """Produce the per-counter rows used in the dashboard table / cards."""
    rows = []
    for c in counters:
        rows.append(
            {
                "Counter": c.name,
                "People": c.people,
                "Estimated Wait (min)": c.estimated_wait_minutes,
                "Status": classify_crowd_level(c.people),
            }
        )
    return rows


def distribute_queue_across_counters(total_people: int, num_counters: int, imbalance_seed: int = 0) -> List[int]:
    """
    Split a total queue size across N counters with a bit of realistic
    imbalance (some counters naturally accumulate more people than others).
    This is only used when we don't have per-counter camera data.
    """
    if num_counters <= 0:
        return []
    base = total_people // num_counters
    remainder = total_people % num_counters
    counts = [base] * num_counters
    # Distribute the remainder and add mild deterministic imbalance so the
    # UI doesn't look artificially perfectly even.
    for i in range(remainder):
        counts[i % num_counters] += 1
    # Introduce a small, deterministic skew based on imbalance_seed so re-runs
    # with the same seed are stable for a demo.
    if num_counters > 1:
        skew = (imbalance_seed % 5) - 2  # -2..2
        counts[0] = max(0, counts[0] + skew)
        counts[-1] = max(0, counts[-1] - skew)
    return counts
