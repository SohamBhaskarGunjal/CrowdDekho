import React, { createContext, useContext, useState, useEffect } from 'react';
import { queueApi } from '../services/api';

const QueueContext = createContext();

const INITIAL_COUNTERS = [
  {
    id: 1,
    name: 'Counter 1',
    status: 'High',
    currentPeople: 18,
    waitTime: 30,
    predicted20Min: 30,
    capacity: 90,
    maxCapacity: 20,
    serviceRate: 1.6, // min per person
    staffName: 'Rajesh Kumar',
    category: 'Billing & Token Processing',
    streamActive: true
  },
  {
    id: 2,
    name: 'Counter 2',
    status: 'Low',
    currentPeople: 5,
    waitTime: 8,
    predicted20Min: 8,
    capacity: 25,
    maxCapacity: 20,
    serviceRate: 1.5,
    staffName: 'Priya Sharma',
    category: 'Inquiry & Support',
    streamActive: true
  },
  {
    id: 3,
    name: 'Counter 3',
    status: 'Medium',
    currentPeople: 12,
    waitTime: 20,
    predicted20Min: 20,
    capacity: 60,
    maxCapacity: 20,
    serviceRate: 1.7,
    staffName: 'Anil Verma',
    category: 'Document Verification',
    streamActive: true
  },
  {
    id: 4,
    name: 'Counter 4',
    status: 'Low',
    currentPeople: 3,
    waitTime: 5,
    predicted20Min: 6,
    capacity: 20,
    maxCapacity: 20,
    serviceRate: 1.4,
    staffName: 'Sneha Patel',
    category: 'Express Fast Track',
    streamActive: true
  }
];

const INITIAL_ALERTS = [
  {
    id: 1,
    title: 'High crowd detected at Counter 1',
    time: '10:28 AM',
    level: 'High',
    counter: 1,
    description: 'Queue length exceeded threshold (18 persons waiting). Estimated delay: 30 mins.'
  },
  {
    id: 2,
    title: 'Crowd increasing at Counter 3',
    time: '10:25 AM',
    level: 'Medium',
    counter: 3,
    description: 'Sudden influx detected from main corridor. Capacity at 60%.'
  },
  {
    id: 3,
    title: 'Counter 2 is running smoothly',
    time: '10:20 AM',
    level: 'Low',
    counter: 2,
    description: 'Optimal processing efficiency maintained. Low queue delay (8 mins).'
  }
];

export function QueueProvider({ children }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCounterFilter, setSelectedCounterFilter] = useState('All Counters');
  const [counters, setCounters] = useState(INITIAL_COUNTERS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [predictionHorizon, setPredictionHorizon] = useState('Next 30 Minutes');
  const [isWhatIfModalOpen, setIsWhatIfModalOpen] = useState(false);
  const [isAddCounterModalOpen, setIsAddCounterModalOpen] = useState(false);
  const [activeCameraCounter, setActiveCameraCounter] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('10:30 AM');
  const [modelAccuracy] = useState(92);
  const [systemStatus, setSystemStatus] = useState('Operational');
  const [cameraMode, setCameraMode] = useState('simulation'); // 'simulation' | 'webcam'

  // Sync dark mode class with html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived metrics
  const totalPeople = counters.reduce((sum, c) => sum + c.currentPeople, 0);
  const avgWaitTime = Math.round(counters.reduce((sum, c) => sum + c.waitTime, 0) / counters.length);
  const predictedIn20Min = counters.reduce((sum, c) => sum + c.predicted20Min, 0);
  const highCounterCount = counters.filter(c => c.status === 'High').length;
  const overallCrowdStatus = highCounterCount >= 2 ? 'High' : (counters.some(c => c.status === 'Medium') ? 'Medium' : 'Low');

  // Real-time live fluctuation simulation
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Subtle dynamic noise
      setCounters(prev => prev.map(counter => {
        // randomly adjust by -1, 0, or +1
        const delta = Math.floor(Math.random() * 3) - 1;
        const newCount = Math.max(1, Math.min(25, counter.currentPeople + delta));
        const newWait = Math.round(newCount * counter.serviceRate);
        const newCapacity = Math.min(100, Math.round((newCount / counter.maxCapacity) * 100));
        let newStatus = 'Low';
        if (newCapacity >= 75) newStatus = 'High';
        else if (newCapacity >= 40) newStatus = 'Medium';

        // Forecast based on velocity
        const predicted20 = Math.round(newCount * (newStatus === 'High' ? 1.5 : (newStatus === 'Medium' ? 1.25 : 1.1)));

        return {
          ...counter,
          currentPeople: newCount,
          waitTime: newWait,
          capacity: newCapacity,
          status: newStatus,
          predicted20Min: predicted20
        };
      }));
    }, 7000);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  // Chart data calculation
  const getPredictionChartData = () => {
    const base = totalPeople;
    return [
      { time: 'Now', count: base, label: `${base} people` },
      { time: '10 min', count: Math.round(base * 1.11), label: `${Math.round(base * 1.11)} people` },
      { time: '20 min', count: Math.round(base * 1.41), label: `${Math.round(base * 1.41)} people` },
      { time: '30 min', count: Math.round(base * 1.66), label: `${Math.round(base * 1.66)} people` },
      { time: '60 min', count: Math.round(base * 2.15), label: `${Math.round(base * 2.15)} people` }
    ];
  };

  const addCounter = (counterData) => {
    const newId = counters.length + 1;
    const newCounter = {
      id: newId,
      name: counterData.name || `Counter ${newId}`,
      status: 'Low',
      currentPeople: 0,
      waitTime: 0,
      predicted20Min: 2,
      capacity: 0,
      maxCapacity: 20,
      serviceRate: 1.5,
      staffName: counterData.staffName || 'New Assigned Staff',
      category: counterData.category || 'General Assistance',
      streamActive: true
    };
    setCounters([...counters, newCounter]);
    
    // Add alert
    const newAlert = {
      id: Date.now(),
      title: `${newCounter.name} successfully opened and active`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: 'Low',
      counter: newId,
      description: `Added to relieve load from active queues.`
    };
    setAlerts([newAlert, ...alerts]);
  };

  const removeCounter = (id) => {
    setCounters(counters.filter(c => c.id !== id));
  };

  return (
    <QueueContext.Provider
      value={{
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        selectedCounterFilter,
        setSelectedCounterFilter,
        counters,
        setCounters,
        alerts,
        setAlerts,
        totalPeople,
        avgWaitTime,
        predictedIn20Min,
        highCounterCount,
        overallCrowdStatus,
        isSimulatingLive,
        setIsSimulatingLive,
        predictionHorizon,
        setPredictionHorizon,
        isWhatIfModalOpen,
        setIsWhatIfModalOpen,
        isAddCounterModalOpen,
        setIsAddCounterModalOpen,
        activeCameraCounter,
        setActiveCameraCounter,
        lastUpdated,
        modelAccuracy,
        systemStatus,
        setSystemStatus,
        cameraMode,
        setCameraMode,
        getPredictionChartData,
        addCounter,
        removeCounter
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  return useContext(QueueContext);
}
