import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { sound } from '@/services/soundEffects';
import {
  Activity,
  BedDouble,
  ShieldAlert,
  Sparkles,
  Video,
  Radio,
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Terminal,
  Heart,
  Droplet,
  Wifi,
} from 'lucide-react';

export const InteractiveCommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BEDS' | 'AI_TRIAGE' | 'CYBER_SOC' | 'TELEHEALTH'>('BEDS');

  // Tab 1: Live Interactive Bed Simulator
  const [beds, setBeds] = useState([
    { id: 'ICU-01', ward: 'Cardiothoracic ICU', status: 'OCCUPIED', patient: 'R. Sharma (62M)', o2: '98%', bp: '128/82', bpm: 74 },
    { id: 'ICU-02', ward: 'Cardiothoracic ICU', status: 'AVAILABLE', patient: null, o2: '100%', bp: '--/--', bpm: 0 },
    { id: 'EMG-01', ward: 'Trauma Emergency', status: 'OCCUPIED', patient: 'A. Patel (34M)', o2: '95%', bp: '135/90', bpm: 88 },
    { id: 'OT-03', ward: 'Laminar Airflow OT', status: 'OCCUPIED', patient: 'In Surgery: CABG', o2: '99%', bp: '118/76', bpm: 68 },
    { id: 'GEN-104', ward: 'Executive Deluxe', status: 'CLEANING', patient: 'Sanitizing UV-C', o2: '--', bp: '--/--', bpm: 0 },
    { id: 'GEN-105', ward: 'Executive Deluxe', status: 'AVAILABLE', patient: null, o2: '100%', bp: '--/--', bpm: 0 },
  ]);
  const [selectedBed, setSelectedBed] = useState<any>(beds[0]);

  // Tab 2: AI Triage Simulator
  const [symptomInput, setSymptomInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<any>({
    triageLevel: 'EMERGENCY_RED',
    department: 'Cardiology & Cardiac Surgery',
    specialist: 'Dr. Ananya Sharma, MD, DM',
    urgency: 'Immediate In-Person Intervention (< 15 mins)',
    reasoning: 'Acute radiating chest pressure with diaphoretic symptoms strongly indicates possible Acute Coronary Syndrome (ACS).',
    action: '108 Ambulance Alert Dispatched to Indiranagar Area',
  });

  const handleTestSymptom = (text: string) => {
    sound.playClick();
    setSymptomInput(text);
    setIsAiThinking(true);
    setTimeout(() => {
      sound.playChime();
      setIsAiThinking(false);
      if (text.includes('chest') || text.includes('heart')) {
        setAiResult({
          triageLevel: 'EMERGENCY_RED',
          department: 'Cardiology & Cardiac Surgery',
          specialist: 'Dr. Ananya Sharma, MD, DM',
          urgency: 'Immediate In-Person Intervention (< 15 mins)',
          reasoning: 'Symptoms match cardiac ischemia criteria. Priority routing to Emergency Cath Lab.',
          action: '108 Ambulance Alert Dispatched with GPS Telemetry',
        });
      } else if (text.includes('fever') || text.includes('flu')) {
        setAiResult({
          triageLevel: 'ROUTINE_GREEN',
          department: 'General Medicine & Infectious Diseases',
          specialist: 'Dr. Rajesh Varma, MBBS, MD',
          urgency: 'Same-Day Consultation (Next slot: 11:30 AM)',
          reasoning: 'Acute viral upper respiratory symptoms. Recommend CBC, Hydration, and Telehealth / Physical Clinic evaluation.',
          action: 'Digital Slot Held for 10 Minutes with Instant Token',
        });
      } else {
        setAiResult({
          triageLevel: 'URGENT_AMBER',
          department: 'Orthopaedics & Joint Replacement',
          specialist: 'Dr. Vikram Sethi, MS (Ortho)',
          urgency: 'Within 2 Hours (Urgent Ortho Triage)',
          reasoning: 'Acute traumatic joint effusion or ligamentous sprain requiring radiographic evaluation (X-Ray / MRI).',
          action: 'Hospital Ortho Bay Priority Booking Verified',
        });
      }
    }, 750);
  };

  // Tab 3: Cyber SOC Hash Streamer
  const [cryptoBlock, setCryptoBlock] = useState({
    blockIndex: 48921,
    hash: '0x8f7a93c4e12d5b6e7f8019a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    eventsPerSec: 142,
    threatsBlocked: 19,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoBlock((prev) => ({
        blockIndex: prev.blockIndex + 1,
        hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        eventsPerSec: Math.floor(130 + Math.random() * 30),
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.85 ? 1 : 0),
      }));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-3xl glass-card border border-white/60 shadow-xl overflow-hidden backdrop-blur-2xl transition-all">
      {/* Top Header & Interactive Tab Pills */}
      <div className="p-6 border-b border-soft-grey bg-gradient-to-r from-warm-light-grey/80 via-white/70 to-warm-light-grey/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-coral font-bold">
              LIVE INTERACTIVE ECOSYSTEM RADAR
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-navy mt-0.5">
            Real-Time Clinical Operations Center
          </h2>
        </div>

        {/* Dynamic Interactive Segmented Tabs */}
        <div className="p-1 rounded-xl bg-warm-light-grey border border-soft-grey flex flex-wrap gap-1 shadow-inner">
          {[
            { id: 'BEDS', label: '3D Bed Census', icon: <BedDouble className="w-3.5 h-3.5" /> },
            { id: 'AI_TRIAGE', label: 'AI Neural Triage', icon: <Sparkles className="w-3.5 h-3.5 text-coral" /> },
            { id: 'CYBER_SOC', label: 'Cyber SOC & Ledger', icon: <ShieldAlert className="w-3.5 h-3.5 text-navy" /> },
            { id: 'TELEHEALTH', label: 'Telehealth HUD', icon: <Video className="w-3.5 h-3.5 text-emerald-600" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-navy text-white shadow-md'
                  : 'text-slate hover:text-navy hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="commandCenterTabPill"
                  className="absolute inset-0 rounded-lg bg-navy -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content Display */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: 3D Bed Matrix */}
          {activeTab === 'BEDS' && (
            <motion.div
              key="beds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Bed Matrix Grid */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate">
                  <span>Interactive Bed Matrix (Click any pod to inspect live telemetry):</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-coral" /> Occupied
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Sanitizing
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {beds.map((b) => {
                    const isSelected = selectedBed.id === b.id;
                    const isAvailable = b.status === 'AVAILABLE';
                    const isOccupied = b.status === 'OCCUPIED';

                    return (
                      <motion.div
                        key={b.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          sound.playClick();
                          setSelectedBed(b);
                        }}
                        className={`p-4 rounded-xl cursor-pointer border-2 transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-navy shadow-lg bg-white ring-2 ring-navy/20'
                            : 'border-soft-grey bg-white/70 hover:bg-white hover:border-slate'
                        }`}
                      >
                        {/* Live Radar Ping Beacon */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-black text-sm text-navy">{b.id}</span>
                          <span
                            className={`relative flex h-2.5 w-2.5 ${
                              isAvailable ? 'text-emerald-500' : isOccupied ? 'text-coral' : 'text-amber-500'
                            }`}
                          >
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                isAvailable ? 'bg-emerald-400' : isOccupied ? 'bg-coral' : 'bg-amber-400'
                              }`}
                            />
                            <span
                              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                isAvailable ? 'bg-emerald-500' : isOccupied ? 'bg-coral' : 'bg-amber-500'
                              }`}
                            />
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-navy truncate">{b.ward}</p>
                        <p className="text-[10px] text-slate mt-0.5 truncate">
                          {b.patient || 'Vacant & Sterilized'}
                        </p>

                        <div className="mt-3 pt-2 border-t border-soft-grey flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate">SpO2: <strong className="text-navy">{b.o2}</strong></span>
                          <span
                            className={`px-1.5 py-0.5 rounded-sm font-bold uppercase ${
                              isAvailable
                                ? 'bg-emerald-soft text-emerald-800'
                                : isOccupied
                                ? 'bg-coral-soft text-coral-deep'
                                : 'bg-amber-soft text-amber-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Bedside Telemetry Monitor */}
              <div className="rounded-2xl bg-navy text-white p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono font-bold text-xs text-white tracking-widest uppercase">
                        BEDSIDE HUD • {selectedBed.id}
                      </span>
                    </div>
                    <Badge variant={selectedBed.status === 'AVAILABLE' ? 'success' : 'critical'}>
                      {selectedBed.status}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-light block">
                      Assigned Ward
                    </span>
                    <span className="text-base font-display font-bold text-white">{selectedBed.ward}</span>
                    <p className="text-xs text-coral font-medium mt-0.5">
                      {selectedBed.patient ? `Occupant: ${selectedBed.patient}` : 'Ready for Immediate Inpatient Admission'}
                    </p>
                  </div>

                  {/* ECG Rhythm Waveform */}
                  <div className="p-3 rounded-xl bg-navy-dark/80 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-light">
                      <span className="flex items-center gap-1.5 text-coral">
                        <Heart className="w-3 h-3 animate-pulse" /> LEAD II ECG
                      </span>
                      <span className="text-emerald-400 font-bold">{selectedBed.bpm > 0 ? `${selectedBed.bpm} BPM` : 'STANDBY'}</span>
                    </div>
                    <EcgPulse color="#FF5B47" width={260} height={36} />
                  </div>

                  {/* Vitals Readout Strip */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-slate-light block">Oxygen Saturation</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">{selectedBed.o2}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-slate-light block">Blood Pressure</span>
                      <span className="text-lg font-mono font-bold text-amber-300">{selectedBed.bp}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-coral hover:bg-coral-deep text-white text-xs font-bold justify-center"
                    onClick={() => {
                      sound.playChime();
                      alert(`Bed ${selectedBed.id} operations opened in Hospital Authority Console.`);
                    }}
                  >
                    <span>Manage Bed Allocation in Hospital Console</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: AI Neural Triage Engine */}
          {activeTab === 'AI_TRIAGE' && (
            <motion.div
              key="ai_triage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-coral" />
                  <h3 className="font-display font-bold text-navy text-base">
                    Patient Symptom-to-Specialist Neural Router
                  </h3>
                </div>
                <p className="text-xs text-slate leading-relaxed">
                  Test the real-time AI triage engine that powers both the Patient Portal and Hospital Triage Desk. 
                  Click a real clinical scenario below to see instant clinical reasoning and emergency red-flag routing:
                </p>

                {/* Scenario Pills */}
                <div className="space-y-2">
                  {[
                    'Acute crushing chest tightness with left arm numbness and cold sweating',
                    'Fever 102°F with severe body pain, sore throat & dry cough for 2 days',
                    'Twisted right knee with severe swelling and inability to bear weight',
                  ].map((scenario, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTestSymptom(scenario)}
                      className="w-full text-left p-3 rounded-xl bg-white border border-soft-grey hover:border-coral hover:bg-coral-soft/30 transition-all text-xs font-medium text-navy flex items-center justify-between group shadow-2xs"
                    >
                      <span className="truncate pr-2">"{scenario}"</span>
                      <ArrowRight className="w-4 h-4 text-slate group-hover:text-coral group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="Or type custom symptoms (e.g., severe migraine, high BP, skin rash)..."
                    className="w-full px-4 py-2.5 rounded-xl border border-soft-grey bg-white text-xs text-navy focus:outline-none focus:border-coral shadow-2xs"
                    onKeyDown={(e) => e.key === 'Enter' && handleTestSymptom(symptomInput)}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="absolute right-1.5 top-1.5 bg-navy hover:bg-navy/90 text-white text-xs h-7 px-3"
                    onClick={() => handleTestSymptom(symptomInput)}
                    isLoading={isAiThinking}
                  >
                    Diagnose
                  </Button>
                </div>
              </div>

              {/* AI Neural Output Display */}
              <div className="rounded-2xl bg-gradient-to-br from-warm-light-grey via-white to-warm-light-grey border border-soft-grey p-5 shadow-inner flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-soft-grey">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-coral animate-ping" />
                      <span className="text-[10px] font-mono uppercase font-bold text-slate">
                        AI CLINICAL REASONING STREAM
                      </span>
                    </div>
                    <Badge variant={aiResult.triageLevel.includes('RED') ? 'critical' : 'success'}>
                      {aiResult.triageLevel}
                    </Badge>
                  </div>

                  {isAiThinking ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 rounded-full border-3 border-coral border-t-transparent animate-spin" />
                      <p className="text-xs font-mono font-semibold text-slate">
                        Analyzing SNOMED-CT clinical ontologies...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate block">Recommended Department</span>
                        <span className="font-display font-extrabold text-base text-navy">{aiResult.department}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-white border border-soft-grey">
                          <span className="text-[10px] uppercase font-bold text-slate block">Nearest Specialist</span>
                          <span className="font-bold text-navy truncate block">{aiResult.specialist}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-soft-grey">
                          <span className="text-[10px] uppercase font-bold text-slate block">Triage SLA</span>
                          <span className="font-bold text-coral truncate block">{aiResult.urgency}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-coral-soft/50 border border-coral/20">
                        <span className="text-[10px] uppercase font-bold text-coral-deep block">Clinical Rationale</span>
                        <p className="text-[11px] text-navy mt-0.5 leading-relaxed">{aiResult.reasoning}</p>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-soft p-2 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{aiResult.action}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-soft-grey text-right">
                  <span className="text-[10px] font-mono text-slate">ABDM Diagnostic Protocol v2.4 Verified</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Cyber SOC & SHA-256 Ledger */}
          {activeTab === 'CYBER_SOC' && (
            <motion.div
              key="cyber_soc"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Radar Circle Scanner */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-navy text-white border border-white/10 relative overflow-hidden">
                <div className="relative w-44 h-44 rounded-full border-2 border-emerald-500/30 flex items-center justify-center mb-4">
                  {/* Concentric rings */}
                  <div className="absolute w-32 h-32 rounded-full border border-emerald-500/20" />
                  <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20" />
                  <div className="absolute w-2 h-2 rounded-full bg-emerald-400" />
                  {/* Crosshairs */}
                  <div className="absolute inset-x-0 h-px bg-emerald-500/20" />
                  <div className="absolute inset-y-0 w-px bg-emerald-500/20" />
                  {/* Rotating Radar Sweep Line */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="absolute inset-0 origin-center"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.45) 0deg, transparent 60deg)',
                    }}
                  />
                  {/* Blip dots */}
                  <div className="absolute top-10 right-12 w-2 h-2 rounded-full bg-coral animate-ping" />
                  <div className="absolute bottom-12 left-10 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <Badge variant="success">SOC RADAR ACTIVE • 0 THREAT BREACHES</Badge>
                <span className="text-[10px] font-mono text-slate-light mt-2">
                  Scanning 1,480 Encrypted Healthcare Endpoints
                </span>
              </div>

              {/* Cryptographic Ledger Feed */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-navy text-sm">
                      Tamper-Evident SHA-256 Ledger Stream
                    </h4>
                    <p className="text-xs text-slate">
                      Every appointment, prescription, bed transfer and admission is hashed cryptographically.
                    </p>
                  </div>
                  <Badge variant="success">CHAIN VERIFIED: ZERO TAMPERING</Badge>
                </div>

                <div className="p-4 rounded-xl bg-navy-dark text-white font-mono text-xs space-y-2 border border-white/10 shadow-inner">
                  <div className="flex items-center justify-between text-slate-light pb-2 border-b border-white/10 text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Lock className="w-3.5 h-3.5" /> CURRENT LEDGER BLOCK: #{cryptoBlock.blockIndex}
                    </span>
                    <span>{cryptoBlock.eventsPerSec} Events / Sec</span>
                  </div>

                  <p className="text-slate-light text-[10px] break-all leading-tight">
                    <span className="text-coral">MERKLE ROOT HASH:</span> {cryptoBlock.hash}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-center">
                    <div className="p-2 rounded bg-white/5">
                      <span className="text-slate-light block">RBAC Violations</span>
                      <span className="text-emerald-400 font-bold">0 Detected</span>
                    </div>
                    <div className="p-2 rounded bg-white/5">
                      <span className="text-slate-light block">Data Leak Probes</span>
                      <span className="text-amber-400 font-bold">{cryptoBlock.threatsBlocked} Neutralized</span>
                    </div>
                    <div className="p-2 rounded bg-white/5">
                      <span className="text-slate-light block">DPDP Consent Locks</span>
                      <span className="text-white font-bold">100% Enforced</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-warm-light-grey border border-soft-grey flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-coral shrink-0" />
                    <span className="font-semibold text-navy">
                      Need deep cybersecurity packet inspection?
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold text-navy"
                    onClick={() => {
                      sound.playClick();
                      window.location.href = '/staff';
                    }}
                  >
                    Open Staff SOC Hub
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Telehealth HUD Simulator */}
          {activeTab === 'TELEHEALTH' && (
            <motion.div
              key="telehealth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Simulated Video Feeds */}
              <div className="lg:col-span-2 rounded-2xl bg-navy text-white p-4 relative overflow-hidden border border-white/10 min-h-[260px] flex flex-col justify-between">
                {/* Top Overlay Badge */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono">
                    <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
                    <span className="text-coral font-bold">REC 00:08:42 • 1080p HD</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    <Lock className="w-3 h-3" /> AES-256 END-TO-END ENCRYPTED
                  </div>
                </div>

                {/* Simulated Doctor & Patient Views */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="aspect-video rounded-xl bg-slate-800/80 border border-white/10 flex flex-col justify-between p-3 relative overflow-hidden">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded w-fit">
                      Dr. Ananya Sharma (Cardiologist)
                    </span>
                    <div className="text-center py-4">
                      <div className="w-10 h-10 mx-auto rounded-full bg-coral text-white font-bold flex items-center justify-center shadow-lg">
                        DR
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1 block">Live Video Stream 60 FPS</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400">
                      <Wifi className="w-3 h-3" /> 18ms latency
                    </div>
                  </div>

                  <div className="aspect-video rounded-xl bg-slate-800/80 border border-white/10 flex flex-col justify-between p-3 relative overflow-hidden">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded w-fit">
                      Rahul Verma (Patient)
                    </span>
                    <div className="text-center py-4">
                      <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-lg">
                        RV
                      </div>
                      <span className="text-[10px] text-slate-300 mt-1 block">Patient Consent Granted</span>
                    </div>
                    <span className="text-[9px] text-slate-300">Indiranagar, Bengaluru</span>
                  </div>
                </div>

                {/* Bottom Telemetry HUD */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-slate-light">
                  <span>Vitals Overlay: BP 120/80 • SpO2 99% • HR 72 BPM</span>
                  <span className="text-emerald-400">Recording stored for patient legal compliance</span>
                </div>
              </div>

              {/* Live Transcript & AI Summary */}
              <div className="rounded-2xl bg-white border border-soft-grey p-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-soft-grey">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate">
                      REAL-TIME ENCOUNTER TRANSCRIPT
                    </span>
                    <Badge variant="info">AI WHISPER</Badge>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate max-h-[160px] overflow-y-auto pr-1">
                    <p>
                      <strong className="text-navy">Doctor:</strong> "Rahul, have the chest sensations reduced after the sublingual medication?"
                    </p>
                    <p>
                      <strong className="text-emerald-800">Patient:</strong> "Yes Doctor, the tightness is gone, but I feel slight dizziness in the morning."
                    </p>
                    <p>
                      <strong className="text-navy">Doctor:</strong> "Noted. I am adjusting your dosage and issuing an updated digital prescription right now."
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-soft-grey space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold justify-center"
                    onClick={() => {
                      sound.playChime();
                      window.location.href = '/doctor';
                    }}
                  >
                    <span>Open Full Doctor Clinical Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
