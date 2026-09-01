import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Clock, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Building2, 
  Stethoscope, 
  Landmark, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  BellRing,
  RefreshCw
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function CustomerDisplayView() {
  const { counters, activeCameraCounter, setActiveTab } = useQueue();
  const [sector, setSector] = useState('bank'); // 'bank' | 'hospital' | 'service'
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [latestCall, setLatestCall] = useState({ token: 'A-104', counter: 'Counter 1', dept: 'Cash & Deposits' });
  const [callingAnim, setCallingAnim] = useState(false);

  // Sector Presets
  const sectorData = {
    bank: {
      name: 'City National Bank & Trust',
      subtitle: 'Main Branch • Customer Waiting Information Display',
      icon: Landmark,
      color: 'blue',
      counters: [
        { id: 1, name: 'Counter 1', dept: 'Cash & Deposits', currentToken: 'A-104', officer: 'Sarah Jenkins', status: 'Serving' },
        { id: 2, name: 'Counter 2', dept: 'New Accounts & Loans', currentToken: 'B-208', officer: 'Michael Chang', status: 'Serving' },
        { id: 3, name: 'Counter 3', dept: 'Forex & Wire Transfer', currentToken: 'C-012', officer: 'David Miller', status: 'Serving' },
        { id: 4, name: 'Counter 4', dept: 'Express Card & KYC', currentToken: 'D-045', officer: 'Emma Watson', status: 'Serving' },
      ],
      waitingList: [
        { token: 'A-105', dept: 'Cash & Deposits', estWait: '2 mins', priority: 'Standard', status: 'Next Up' },
        { token: 'B-209', dept: 'New Accounts', estWait: '4 mins', priority: 'VIP Customer', status: 'Waiting' },
        { token: 'A-106', dept: 'Cash & Deposits', estWait: '6 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'C-013', dept: 'Wire Transfer', estWait: '9 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'D-046', dept: 'Express KYC', estWait: '11 mins', priority: 'Senior Citizen', status: 'Waiting' },
        { token: 'A-107', dept: 'Cash & Deposits', estWait: '14 mins', priority: 'Standard', status: 'In Queue' },
        { token: 'B-210', dept: 'New Accounts', estWait: '17 mins', priority: 'Standard', status: 'In Queue' },
        { token: 'C-014', dept: 'Wire Transfer', estWait: '20 mins', priority: 'Standard', status: 'In Queue' },
      ],
      notice: '🔔 Welcome to City National Bank. Please keep your account number and ID slip ready. For senior citizen priority assistance, approach Counter 4.'
    },
    hospital: {
      name: 'Apex Memorial Specialty Hospital',
      subtitle: 'Outpatient Department (OPD) • Live Patient Token Display',
      icon: Stethoscope,
      color: 'emerald',
      counters: [
        { id: 1, name: 'Consultation 1', dept: 'General Medicine', currentToken: 'M-102', officer: 'Dr. Robert Hayes', status: 'In Session' },
        { id: 2, name: 'Consultation 2', dept: 'Pediatrics & Child Care', currentToken: 'P-055', officer: 'Dr. Elena Rostova', status: 'In Session' },
        { id: 3, name: 'Diagnostic Room', dept: 'Blood & X-Ray Triage', currentToken: 'D-310', officer: 'Technician Alex', status: 'In Session' },
        { id: 4, name: 'Pharmacy Desk', dept: 'Prescription Dispense', currentToken: 'Rx-88', officer: 'Pharmacist Linda', status: 'Ready' },
      ],
      waitingList: [
        { token: 'M-103', dept: 'General Medicine', estWait: '3 mins', priority: 'Emergency Triage', status: 'Next Up' },
        { token: 'P-056', dept: 'Pediatrics', estWait: '5 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'D-311', dept: 'Diagnostics', estWait: '8 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'M-104', dept: 'General Medicine', estWait: '12 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'Rx-89', dept: 'Pharmacy', estWait: '15 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'P-057', dept: 'Pediatrics', estWait: '18 mins', priority: 'Standard', status: 'In Queue' },
        { token: 'D-312', dept: 'Diagnostics', estWait: '22 mins', priority: 'Standard', status: 'In Queue' },
      ],
      notice: '🏥 Apex Hospital OPD: Free digital health checkups available at Desk 3. Please wear masks in diagnostic waiting zones.'
    },
    service: {
      name: 'Government Citizen Service Center',
      subtitle: 'Passport, Driving License & Aadhaar Seva Kendra',
      icon: Building2,
      color: 'purple',
      counters: [
        { id: 1, name: 'Counter 1', dept: 'Passport & Visa Verification', currentToken: 'PS-401', officer: 'Officer K. Sharma', status: 'Serving' },
        { id: 2, name: 'Counter 2', dept: 'Driving License Biometrics', currentToken: 'DL-118', officer: 'Officer Anita Verma', status: 'Serving' },
        { id: 3, name: 'Counter 3', dept: 'Aadhaar & Citizen ID Updates', currentToken: 'AD-902', officer: 'Officer R. Kapoor', status: 'Serving' },
        { id: 4, name: 'Counter 4', dept: 'Document Attestation & Dispatch', currentToken: 'DC-077', officer: 'Officer S. Mehta', status: 'Serving' },
      ],
      waitingList: [
        { token: 'PS-402', dept: 'Passport Verification', estWait: '2 mins', priority: 'Tatkaal / Urgent', status: 'Next Up' },
        { token: 'DL-119', dept: 'Driving License', estWait: '5 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'AD-903', dept: 'Aadhaar Update', estWait: '7 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'PS-403', dept: 'Passport Verification', estWait: '11 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'DC-078', dept: 'Document Dispatch', estWait: '14 mins', priority: 'Standard', status: 'Waiting' },
        { token: 'DL-120', dept: 'Driving License', estWait: '18 mins', priority: 'Standard', status: 'In Queue' },
      ],
      notice: '🏛️ Citizen Seva: Original documents required for Biometrics verification. Digital tokens are tracked in real-time.'
    }
  };

  const currentSector = sectorData[sector];
  const SectorIcon = currentSector.icon;

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate calling next customer
  const callNextCustomer = (counterName, deptName) => {
    const randomTokens = sector === 'bank' 
      ? ['A-105', 'B-209', 'C-013', 'D-046'] 
      : sector === 'hospital' 
        ? ['M-103', 'P-056', 'D-311', 'Rx-89']
        : ['PS-402', 'DL-119', 'AD-903', 'DC-078'];
    const nextT = randomTokens[Math.floor(Math.random() * randomTokens.length)];
    
    setLatestCall({ token: nextT, counter: counterName, dept: deptName });
    setCallingAnim(true);
    setTimeout(() => setCallingAnim(false), 3500);

    // Audio chime simulation if not muted
    if (!isMuted && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.7);
      } catch (e) {}
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#070e1e] flex flex-col justify-between space-y-4 select-none">
      {/* Top TV Controls Bar (For Staff / Quick Switch) */}
      <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3 shadow-lg">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Back to Dashboard Button */}
          <button
            onClick={() => setActiveTab('Dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Tv className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Display Mode:
            </span>
          </div>

          {/* Sector Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl">
            <button
              onClick={() => setSector('bank')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                sector === 'bank' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-blue-400'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>🏦 Bank</span>
            </button>

            <button
              onClick={() => setSector('hospital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                sector === 'hospital' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>🏥 Hospital OPD</span>
            </button>

            <button
              onClick={() => setSector('service')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                sector === 'service' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-purple-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>🏛️ Service Center</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
            title={isMuted ? 'Unmute Audio Chime' : 'Mute Audio Chime'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'Muted' : 'Chime On'}</span>
          </button>

          {/* Fullscreen TV Mode Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit TV Fullscreen' : 'Open TV Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Public Waiting Display Board (TV Screen Frame) */}
      <div className="flex-1 bg-[#070e1e] text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-blue-500/10 blur-[100px] pointer-events-none" />

        {/* Display Board Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <SectorIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                {currentSector.name}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">
                {currentSector.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-black font-mono tracking-wider text-emerald-400">
                {currentTime}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">
                {currentDate}
              </div>
            </div>
          </div>
        </div>

        {/* Live Calling Alert Banner (When a Token is Called) */}
        <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between gap-4 ${
          callingAnim 
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.3)] scale-[1.01]'
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Latest Token Called:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black font-mono text-emerald-400">
                  TOKEN {latestCall.token}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="text-base md:text-lg font-bold text-white">
                  Proceed to {latestCall.counter} ({latestCall.dept})
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Now Calling</span>
          </div>
        </div>

        {/* Main 2-Column Split: NOW SERVING (Left) vs UPCOMING WAITING QUEUE (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* LEFT 7-Cols: NOW SERVING COUNTERS */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="text-lg font-extrabold tracking-wide uppercase text-white">
                  Now Serving (Counters)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                4 Active Desks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSector.counters.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => callNextCustomer(c.name, c.dept)}
                  className="bg-slate-900/90 hover:bg-slate-850 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition" />
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider">
                      {c.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {c.status}
                    </span>
                  </div>

                  <div className="my-2 text-center py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                      Token Number
                    </span>
                    <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white group-hover:text-emerald-400 transition">
                      {c.currentToken}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                    <span className="font-semibold text-slate-300">{c.dept}</span>
                    <span className="text-slate-500 text-[11px]">{c.officer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT 5-Cols: CUSTOMER WAITING LIST (QUEUE) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-extrabold tracking-wide uppercase text-white">
                  Upcoming Waiting Queue
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400">
                {currentSector.waitingList.length} in queue
              </span>
            </div>

            {/* Waiting List Table Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-lg">
              <div className="grid grid-cols-12 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800 px-2">
                <div className="col-span-3">Token</div>
                <div className="col-span-4">Service</div>
                <div className="col-span-3 text-center">Est. Wait</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              <div className="divide-y divide-slate-800/60 mt-1 max-h-[380px] overflow-y-auto pr-1">
                {currentSector.waitingList.map((item, idx) => (
                  <div 
                    key={item.token}
                    className={`grid grid-cols-12 items-center py-2.5 px-2 rounded-xl transition ${
                      idx === 0 
                        ? 'bg-blue-600/15 border border-blue-500/30' 
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="col-span-3 flex items-center gap-1.5">
                      <span className={`text-base font-black font-mono ${
                        idx === 0 ? 'text-blue-400' : 'text-white'
                      }`}>
                        {item.token}
                      </span>
                    </div>

                    <div className="col-span-4">
                      <span className="text-xs font-semibold text-slate-200 block truncate">
                        {item.dept}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.priority}
                      </span>
                    </div>

                    <div className="col-span-3 text-center font-mono text-xs font-bold text-amber-400">
                      {item.estWait}
                    </div>

                    <div className="col-span-2 text-right">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Next Up'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Scrolling Information Ticker */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-blue-600/30 text-blue-400 font-bold uppercase tracking-wider shrink-0 border border-blue-500/30">
            Notice
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="animate-marquee inline-block font-sans text-slate-300">
              {currentSector.notice}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
