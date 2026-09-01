// API Service for SmartQueue AI
// Easily switchable between Mock / Simulated engine and Real Live Backend (Member 2/3)

const API_BASE_URL = localStorage.getItem('smartqueue_api_url') || 'http://localhost:8000';

export const queueApi = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  },

  // Fetch current counters status
  async getCounters() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/counters`);
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Post new CV detection data from Member 3
  async postDetection(counterId, count, imageSnapshot = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counter_id: counterId,
          people_count: count,
          timestamp: new Date().toISOString(),
          snapshot: imageSnapshot
        })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Request AI Simulation calculation
  async simulateWhatIf(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Simulation endpoint offline');
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
