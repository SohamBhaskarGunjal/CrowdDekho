# SmartQueue AI - Sample Backend Server for Member 2 & Member 3
# Can be run with: python backend_demo_server.py
# (Requires: pip install fastapi uvicorn)

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("FastAPI or uvicorn not installed. To run this backend, run: pip install fastapi uvicorn")
    exit(0)

app = FastAPI(title="SmartQueue AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetectionPayload(BaseModel):
    counter_id: int
    people_count: int
    timestamp: str = None
    snapshot: str = None

class SimulationPayload(BaseModel):
    extra_counters: int = 1
    redirect_percent: int = 40
    counter_id: int = 1

# In-memory counter state
COUNTERS = [
    {"id": 1, "name": "Counter 1", "currentPeople": 18, "waitTime": 30, "status": "High", "predicted20Min": 30, "capacity": 90},
    {"id": 2, "name": "Counter 2", "currentPeople": 5, "waitTime": 8, "status": "Low", "predicted20Min": 8, "capacity": 25},
    {"id": 3, "name": "Counter 3", "currentPeople": 12, "waitTime": 20, "status": "Medium", "predicted20Min": 20, "capacity": 60},
    {"id": 4, "name": "Counter 4", "currentPeople": 3, "waitTime": 5, "status": "Low", "predicted20Min": 6, "capacity": 20},
]

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "SmartQueue AI Operational", "model_accuracy": 92}

@app.get("/api/counters")
def get_counters():
    return COUNTERS

@app.post("/api/detect")
def receive_detection(data: DetectionPayload):
    for c in COUNTERS:
        if c["id"] == data.counter_id:
            c["currentPeople"] = data.people_count
            c["waitTime"] = int(data.people_count * 1.6)
            c["capacity"] = min(100, int((data.people_count / 20) * 100))
            c["status"] = "High" if c["capacity"] >= 75 else ("Medium" if c["capacity"] >= 40 else "Low")
            c["predicted20Min"] = int(data.people_count * 1.5)
            break
    return {"status": "updated", "counter_id": data.counter_id, "new_count": data.people_count}

@app.post("/api/simulate")
def simulate_action(sim: SimulationPayload):
    c1 = next((c for c in COUNTERS if c["id"] == sim.counter_id), COUNTERS[0])
    base_people = c1["currentPeople"]
    base_wait = c1["waitTime"]
    
    simulated_people = max(5, int(base_people * (1 - (sim.redirect_percent / 100))))
    simulated_wait = max(4, int(simulated_people * 1.6))
    improvement = int(((base_wait - simulated_wait) / base_wait) * 100)
    
    return {
        "original": {"people": base_people, "wait_mins": base_wait},
        "after_action": {"people": simulated_people, "wait_mins": simulated_wait},
        "reduction_percentage": improvement,
        "recommendation": f"Open {sim.extra_counters} additional counter to reduce wait time by {improvement}%"
    }

if __name__ == "__main__":
    print("🚀 Starting SmartQueue AI Backend on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
