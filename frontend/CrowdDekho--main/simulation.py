"""
Simulation engine for generating realistic-looking (but clearly labeled)
queue data. This is used both to power "Demo Mode" and to provide a
history buffer for the predictor when no real camera history exists yet.

All data produced here MUST be treated as "Simulated Data" by callers --
never presented as real-world observations.
"""

from dataclasses import dataclass
from typing import List
import numpy as np
import pandas as pd

from utils.config import SimulationDefaults, DEFAULT_SIM


@dataclass
class SimulationResult:
    df: pd.DataFrame          # columns: timestamp_min, people_count, arrivals, served
    label: str = "Simulated Queue Data"


def simulate_queue(
    initial_queue: int = DEFAULT_SIM.initial_queue,
    arrival_rate: float = DEFAULT_SIM.arrival_rate,
    service_rate: float = DEFAULT_SIM.service_rate,
    num_counters: int = DEFAULT_SIM.num_counters,
    duration_minutes: int = DEFAULT_SIM.duration_minutes,
    step_minutes: int = 1,
    noise_std: float = DEFAULT_SIM.noise_std,
    seed: int = 42,
) -> SimulationResult:
    """
    Discrete-time queue simulation:
        queue[t+1] = max(0, queue[t] + arrivals[t] - served[t])
    where arrivals/served are Poisson-like draws around the configured
    rates, scaled per step, with added Gaussian noise so the resulting
    line is not perfectly linear (as required by the spec).
    """
    rng = np.random.default_rng(seed)
    n_steps = max(int(duration_minutes / step_minutes), 1)

    effective_service = service_rate * max(num_counters, 0)

    timestamps = []
    queue_sizes = []
    arrivals_log = []
    served_log = []

    queue = max(initial_queue, 0)
    for t in range(n_steps + 1):
        timestamps.append(t * step_minutes)
        queue_sizes.append(queue)

        # Draw random arrivals/service around the configured rate for this step.
        lam_arrival = max(arrival_rate * step_minutes, 0.01)
        lam_service = max(effective_service * step_minutes, 0.01)

        arrivals = rng.poisson(lam_arrival)
        served_capacity = rng.poisson(lam_service)
        # Can't serve more people than are currently in queue.
        served = min(served_capacity, queue + arrivals)

        noise = rng.normal(0, noise_std)
        next_queue = queue + arrivals - served + noise
        queue = max(0, round(next_queue))

        arrivals_log.append(arrivals)
        served_log.append(served)

    df = pd.DataFrame(
        {
            "timestamp_min": timestamps,
            "people_count": queue_sizes,
            "arrivals": arrivals_log,
            "served": served_log,
        }
    )
    return SimulationResult(df=df, label="Simulated Queue Data")


def scenario_to_dataframe(scenario: dict, duration_minutes: int = 60, seed: int = 7) -> SimulationResult:
    return simulate_queue(
        initial_queue=scenario["initial_queue"],
        arrival_rate=scenario["arrival_rate"],
        service_rate=scenario["service_rate"],
        num_counters=scenario["num_counters"],
        duration_minutes=duration_minutes,
        seed=seed,
    )
