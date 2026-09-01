"""
Deterministic, explainable recommendation engine.

Every recommendation is produced by a plain if/else rule, and every
rule carries a human-readable reason string. Nothing here is hidden
inside a trained model -- this is intentional per the project spec:
"Do not hide recommendations inside an opaque AI model."
"""

from dataclasses import dataclass
from typing import List, Optional

from utils.config import AlertThresholds, DEFAULT_ALERT_THRESHOLDS
from services.waiting_time import CounterState


@dataclass
class Recommendation:
    action: str
    reason: str
    severity: str  # "info" | "warning" | "critical"


@dataclass
class Alert:
    message: str
    severity: str  # "warning" | "critical"


def generate_alerts(
    current_queue: int,
    predicted_queue_20min: float,
    growth_rate_per_min: float,
    thresholds: AlertThresholds = DEFAULT_ALERT_THRESHOLDS,
) -> List[Alert]:
    alerts: List[Alert] = []

    if predicted_queue_20min > thresholds.capacity:
        alerts.append(
            Alert(
                message=f"⚠️ Queue is likely to exceed {thresholds.capacity} people within the next 20 minutes.",
                severity="warning",
            )
        )

    if current_queue > thresholds.critical_capacity or predicted_queue_20min > thresholds.critical_capacity:
        alerts.append(
            Alert(
                message="🔴 Critical: Queue may exceed safe capacity within 10 minutes.",
                severity="critical",
            )
        )

    if growth_rate_per_min > thresholds.growth_rate_warning:
        alerts.append(
            Alert(
                message=f"📈 Rapid buildup detected: queue growing at ~{growth_rate_per_min:.1f} people/min.",
                severity="warning",
            )
        )

    return alerts


def recommend_action(
    current_queue: int,
    predicted_queue: float,
    arrival_rate: float,
    total_service_rate: float,
    counters: Optional[List[CounterState]] = None,
    thresholds: AlertThresholds = DEFAULT_ALERT_THRESHOLDS,
) -> Recommendation:
    """
    Rule order (first match wins), mirroring the spec:
      1. All counters overloaded -> activate additional staff/counter (critical)
      2. Predicted queue exceeds capacity -> preventive: open additional counter
      3. Queue currently exceeds capacity -> open additional counter now
      4. Counter imbalance -> redirect customers
      5. Queue increasing (arrival > service) -> open additional counter
      6. Queue decreasing / stable -> staffing sufficient
    """
    # Rule 1: all counters overloaded
    if counters:
        overloaded = [c for c in counters if c.active and c.people > thresholds.capacity / max(len(counters), 1) * 1.5]
        if len(overloaded) == len(counters) and len(counters) > 0:
            return Recommendation(
                action="Activate additional staff / open a new counter immediately.",
                reason="All active counters are simultaneously overloaded beyond a safe per-counter share of capacity.",
                severity="critical",
            )

    # Rule 2: predicted queue will exceed capacity soon
    if predicted_queue > thresholds.capacity:
        return Recommendation(
            action="Open an additional counter.",
            reason=f"Predicted queue ({predicted_queue:.0f}) exceeds the configured capacity "
                   f"({thresholds.capacity}) within the prediction window.",
            severity="warning",
        )

    # Rule 3: queue already over capacity right now
    if current_queue > thresholds.capacity:
        return Recommendation(
            action="Open an additional counter.",
            reason=f"Current queue ({current_queue}) already exceeds the configured capacity "
                   f"({thresholds.capacity}).",
            severity="critical",
        )

    # Rule 4: counter imbalance -> suggest redirect
    if counters and len(counters) >= 2:
        sorted_counters = sorted(counters, key=lambda c: c.people, reverse=True)
        busiest, quietest = sorted_counters[0], sorted_counters[-1]
        if busiest.people - quietest.people >= thresholds.counter_imbalance:
            return Recommendation(
                action=f"Redirect customers to {quietest.name}.",
                reason=f"{busiest.name} has {busiest.people} people while {quietest.name} has only "
                       f"{quietest.people} — a difference of {busiest.people - quietest.people}, "
                       f"above the configured imbalance threshold ({thresholds.counter_imbalance}).",
                severity="warning",
            )

    # Rule 5: arrival rate outpacing service rate -> queue will grow
    if arrival_rate > total_service_rate:
        return Recommendation(
            action="Open an additional counter.",
            reason=f"Arrival rate ({arrival_rate:.1f}/min) is currently higher than the combined "
                   f"service rate of active counters ({total_service_rate:.1f}/min).",
            severity="warning",
        )

    # Rule 6: queue stable or decreasing
    return Recommendation(
        action="Current staffing level is sufficient.",
        reason=f"Arrival rate ({arrival_rate:.1f}/min) is at or below the combined service rate "
               f"({total_service_rate:.1f}/min), and the queue is not near capacity.",
        severity="info",
    )
