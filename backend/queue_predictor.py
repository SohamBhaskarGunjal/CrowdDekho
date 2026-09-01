"""
Lightweight queue prediction.

Two modes:
  1. ML mode (Linear Regression by default, Random Forest optional) trained
     on recent historical/simulated observations when enough data exists.
  2. Fallback: a simple mathematical queue model
         predicted_queue(t) = current_queue + (arrival_rate - service_rate) * t
     used when there isn't enough history to fit a model.

This intentionally avoids deep learning per the project brief.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
import numpy as np
import pandas as pd

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

from utils.config import PREDICTION_HORIZONS_MIN

MIN_ROWS_FOR_ML = 8


@dataclass
class PredictionResult:
    horizons_minutes: List[int]
    predicted_values: List[float]
    method: str  # "linear_regression" | "random_forest" | "math_fallback"
    data_source_label: str  # e.g. "Simulated Data" or "Camera-derived Data"


def _build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Turn a raw history dataframe (timestamp_min, people_count[, arrivals, served])
    into a supervised-learning feature frame:
        X = [timestamp_min, rolling_arrival_rate, rolling_service_rate]
        y = people_count
    """
    feat = df.copy().sort_values("timestamp_min").reset_index(drop=True)
    if "arrivals" not in feat.columns:
        feat["arrivals"] = feat["people_count"].diff().clip(lower=0).fillna(0)
    if "served" not in feat.columns:
        feat["served"] = (-feat["people_count"].diff()).clip(lower=0).fillna(0)
    feat["rolling_arrival_rate"] = feat["arrivals"].rolling(3, min_periods=1).mean()
    feat["rolling_service_rate"] = feat["served"].rolling(3, min_periods=1).mean()
    return feat


def _math_fallback(
    current_queue: int, arrival_rate: float, service_rate_total: float, horizons: List[int]
) -> List[float]:
    net_rate = arrival_rate - service_rate_total
    return [max(0.0, current_queue + net_rate * h) for h in horizons]


def predict_queue(
    history_df: pd.DataFrame,
    current_queue: int,
    arrival_rate: float,
    service_rate_total: float,
    method: str = "linear_regression",
    horizons: Optional[List[int]] = None,
    data_source_label: str = "Simulated Data",
) -> PredictionResult:
    """
    Predict queue size at each horizon (minutes into the future).

    Falls back to the transparent mathematical model when there isn't
    enough historical data to responsibly fit an ML model, or if the
    fit quality looks degenerate.
    """
    horizons = horizons or PREDICTION_HORIZONS_MIN

    if history_df is None or len(history_df) < MIN_ROWS_FOR_ML:
        values = _math_fallback(current_queue, arrival_rate, service_rate_total, horizons)
        return PredictionResult(horizons, values, "math_fallback", data_source_label)

    try:
        feat = _build_features(history_df)
        X = feat[["timestamp_min", "rolling_arrival_rate", "rolling_service_rate"]].values
        y = feat["people_count"].values

        if method == "random_forest":
            model = RandomForestRegressor(n_estimators=100, max_depth=4, random_state=42)
        else:
            model = LinearRegression()

        model.fit(X, y)

        last_ts = feat["timestamp_min"].iloc[-1]
        last_arr = feat["rolling_arrival_rate"].iloc[-1]
        last_srv = feat["rolling_service_rate"].iloc[-1]

        future_X = np.array([[last_ts + h, last_arr, last_srv] for h in horizons])
        preds = model.predict(future_X)
        preds = [max(0.0, float(p)) for p in preds]

        # Sanity check: if predictions look wildly implausible (e.g. negative
        # trend runaway or NaN), fall back to the math model.
        if any(np.isnan(preds)) or max(preds) > current_queue + 1000:
            values = _math_fallback(current_queue, arrival_rate, service_rate_total, horizons)
            return PredictionResult(horizons, values, "math_fallback", data_source_label)

        method_label = "random_forest" if method == "random_forest" else "linear_regression"
        return PredictionResult(horizons, preds, method_label, data_source_label)

    except Exception:
        values = _math_fallback(current_queue, arrival_rate, service_rate_total, horizons)
        return PredictionResult(horizons, values, "math_fallback", data_source_label)


def prediction_table(result: PredictionResult) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "Time Ahead": [f"{h} min" for h in result.horizons_minutes],
            "Predicted People": [round(v) for v in result.predicted_values],
        }
    )
