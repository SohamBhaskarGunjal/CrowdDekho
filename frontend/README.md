# SmartQueue AI — Predictive Queue & Crowd Prediction Dashboard

> Built for AI/ML Hackathon | Role: **Member 1 (Frontend Developer)**

SmartQueue AI is an end-to-end intelligent queue management and crowd forecasting platform designed for hospitals, banks, railway counters, government offices, and service centers.

---

## 🎯 Key Features Implemented (Frontend)

1. **Exact Design Match**:
   - **Header**: Live status badge, counter selector, timestamp, admin profile.
   - **4 Top KPI Cards**: Total People (63), Avg. Waiting Time (26 min), Predicted in 20 min (89), Crowd Status (High).
   - **Live Camera Feed**: Realistic CCTV player with animated AI YOLO person bounding boxes, person counter badge, fullscreen mode, and live webcam support.
   - **Counter Overview Cards**: Real-time progress bars, High/Medium/Low badges, waiting times, and capacity utilization.
   - **Crowd Prediction Area Chart**: Multi-horizon forecasting (10m, 20m, 30m, 60m) with Recharts.
   - **AI Recommendation Engine**: "Open an additional counter at Counter 1" with 3-way comparative metrics (Current vs Predicted vs After Action).
   - **Interactive "What-If" Action Simulator**: Slide parameters to see instant wait time reduction and dynamic recalculation.
   - **Recent Alerts & Quick Actions**: Add Counter, Export CSV/JSON Data, View Reports, and Settings.
   - **System Info & Dark/Light Theme**: Fully responsive with high-contrast dark mode.

---

## 🚀 How to Run the Frontend

```bash
# 1. Open project directory
cd "e:\OneDrive\Desktop\Project\AIML Hack"

# 2. Start the Vite development server
npm run dev
```

The app will launch at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🤝 Team Integration (Member 2 & 3)

- **Member 2 (Backend / ML)**:
  - Run the provided `python backend_demo_server.py` on `http://localhost:8000`.
  - Frontend automatically hooks to `http://localhost:8000/api/counters` and `http://localhost:8000/api/simulate`.

- **Member 3 (Computer Vision)**:
  - YOLO/OpenCV scripts can POST detection counts to `POST /api/detect` with `{ "counter_id": 1, "people_count": 18 }`.
  - The frontend dynamically reflects count changes in real-time.
