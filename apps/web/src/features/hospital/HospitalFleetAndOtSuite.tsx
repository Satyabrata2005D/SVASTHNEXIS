import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sound } from '@/services/soundEffects';
import {
  Ambulance,
  Scissors,
  Droplet,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  PhoneCall,
  Activity,
  Heart,
  Shield,
  Layers,
} from 'lucide-react';

export const HospitalFleetAndOtSuite: React.FC = () => {
  // 1. Live 108 Emergency Ambulance Dispatches
  const [ambulances, setAmbulances] = useState([
    {
      id: 'AMB-1081',
      type: 'Advanced Cardiac Life Support (ACLS)',
      driver: 'Ramesh Gowda',
      paramedic: 'Sister Stella (EMT-P)',
      status: 'EN_ROUTE_TO_HOSPITAL',
      location: 'Koramangala 80ft Road (1.4 km away)',
      etaMinutes: 4,
      patientCondition: 'Acute STEMI (Heart Attack) • Telemetry Streaming',
      spo2: '94%',
      hr: '112 bpm',
    },
    {
      id: 'AMB-1082',
      type: 'Basic Life Support (BLS)',
      driver: 'Mahesh Kumar',
      paramedic: 'Anand Rao (EMT-B)',
      status: 'DISPATCHED_TO_SCENE',
      location: 'Sarjapur Junction (4.8 km away)',
      etaMinutes: 11,
      patientCondition: 'Road Traffic Accident • Multiple Fractures',
      spo2: '98%',
      hr: '96 bpm',
    },
    {
      id: 'AMB-1083',
      type: 'Neonatal Intensive Care (NICU)',
      driver: 'Suresh Babu',
      paramedic: 'Dr. Priya (Neonatologist)',
      status: 'STATIONED_READY',
      location: 'CityCare Emergency Bay 1',
      etaMinutes: 0,
      patientCondition: 'Standby for Critical Inter-Hospital Transfer',
      spo2: '100%',
      hr: '0 bpm',
    },
  ]);

  // 2. Laminar Flow Operating Theatres (OT) Suite
  const [otSuites, setOtSuites] = useState([
    {
      id: 'OT-01',
      name: 'Cardiothoracic Modular OT',
      surgeon: 'Dr. Kavita Deshmukh',
      specialty: 'Cardiac Surgery',
      procedure: 'Off-Pump Coronary Artery Bypass (CABG)',
      patient: 'S. Kulkarni (58M)',
      phase: 'TIME_OUT_COMPLETED',
      progressPct: 65,
      startTime: '08:00 AM',
      estDuration: '4h 30m',
      checklist: { signIn: true, timeOut: true, signOut: false },
    },
    {
      id: 'OT-02',
      name: 'Robotic Orthopaedic OT',
      surgeon: 'Dr. Vikram Sethi',
      specialty: 'Joint Replacement',
      procedure: 'Bilateral Computer-Navigated Total Knee Arthroplasty',
      patient: 'M. Chenappa (64F)',
      phase: 'IN_SURGERY',
      progressPct: 40,
      startTime: '09:15 AM',
      estDuration: '2h 45m',
      checklist: { signIn: true, timeOut: true, signOut: false },
    },
    {
      id: 'OT-03',
      name: 'Neuro-Navigation OT',
      surgeon: 'Dr. Arvind Swaminathan',
      specialty: 'Neurosurgery',
      procedure: 'Microsurgical Clipping of Aneurysm',
      patient: 'K. Varma (49M)',
      phase: 'CLOSING_SIGN_OUT',
      progressPct: 90,
      startTime: '07:30 AM',
      estDuration: '5h 00m',
      checklist: { signIn: true, timeOut: true, signOut: true },
    },
    {
      id: 'OT-04',
      name: 'Minimal Access Laparoscopic OT',
      surgeon: 'Dr. Preeti Sharma',
      specialty: 'General Surgery',
      procedure: 'Laparoscopic Cholecystectomy',
      patient: 'Next Patient in Pre-Op Holding',
      phase: 'STERILIZATION_UV',
      progressPct: 100,
      startTime: '11:00 AM',
      estDuration: '1h 15m',
      checklist: { signIn: false, timeOut: false, signOut: false },
    },
  ]);

  // 3. Blood Bank Cold-Chain Reserve Matrix
  const [bloodStock, setBloodStock] = useState([
    { group: 'O+', units: 28, status: 'SUFFICIENT', req: 'Universal Red Cell Demand' },
    { group: 'O-', units: 3, status: 'CRITICAL_SHORTAGE', req: 'Emergency Trauma Reserve' },
    { group: 'A+', units: 19, status: 'SUFFICIENT', req: 'Scheduled Surgeries' },
    { group: 'A-', units: 4, status: 'LOW_STOCK', req: 'Donor Drive Triggered' },
    { group: 'B+', units: 24, status: 'SUFFICIENT', req: 'Adequate Stock' },
    { group: 'B-', units: 5, status: 'LOW_STOCK', req: 'Requisition Placed' },
    { group: 'AB+', units: 12, status: 'SUFFICIENT', req: 'Universal Plasma Donor' },
    { group: 'AB-', units: 2, status: 'CRITICAL_SHORTAGE', req: 'Urgent Rare Match Needed' },
  ]);

  // Radar sweep animation angle
  const [radarAngle, setRadarAngle] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarAngle((a) => (a + 4) % 360);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* SECTION 1: EMERGENCY 108 GPS FLEET RADAR & AMBULANCE TRACKING */}
      {/* ============================================================== */}
      <Card className="glass-card border border-white/60 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-coral-soft text-coral-deep shadow-2xs">
              <Ambulance className="w-5 h-5 text-coral animate-bounce" />
            </div>
            <div>
              <CardTitle>108 Emergency Ambulance GPS Fleet & Trauma Radar</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Real-time satellite GPS tracking of mobile intensive care units with in-transit cardiac telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-soft text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SATELLITE GPS ACTIVE
            </span>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rotating Radar Circle Visualizer */}
          <div className="lg:col-span-4 rounded-2xl bg-navy text-white p-5 flex flex-col items-center justify-center relative overflow-hidden border border-white/10 shadow-inner">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-light mb-3 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-coral animate-pulse" />
              TRAUMA CORRIDOR RADAR • 10 KM RADIUS
            </span>

            {/* Radar Screen */}
            <div className="relative w-52 h-52 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
              {/* Concentric rings */}
              <div className="absolute w-40 h-40 rounded-full border border-emerald-500/20" />
              <div className="absolute w-28 h-28 rounded-full border border-emerald-500/20" />
              <div className="absolute w-14 h-14 rounded-full border border-emerald-500/20" />
              <div className="absolute w-2 h-2 rounded-full bg-emerald-400" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 h-px bg-emerald-500/25" />
              <div className="absolute inset-y-0 w-px bg-emerald-500/25" />

              {/* Rotating Sweep Beam */}
              <div
                className="absolute inset-0 origin-center pointer-events-none"
                style={{
                  transform: `rotate(${radarAngle}deg)`,
                  background: 'conic-gradient(from 0deg, rgba(255, 91, 71, 0.4) 0deg, transparent 65deg)',
                }}
              />

              {/* Active Vehicle Blips */}
              {/* AMB-1081 */}
              <div className="absolute top-14 right-16 flex flex-col items-center">
                <span className="w-3 h-3 rounded-full bg-coral animate-ping" />
                <span className="text-[9px] font-mono font-bold text-coral bg-black/60 px-1 rounded mt-0.5">
                  AMB-1081 (4m)
                </span>
              </div>

              {/* AMB-1082 */}
              <div className="absolute bottom-12 left-10 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-1 rounded mt-0.5">
                  AMB-1082
                </span>
              </div>

              {/* Hospital Base */}
              <div className="absolute text-[8px] font-mono text-emerald-400 bottom-2 text-center w-full">
                BASE: CITYCARE TRAUMA
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-between text-[11px] font-mono text-slate-light">
              <span>Traffic Clearance: <strong>Green Corridor</strong></span>
              <span className="text-emerald-400 font-bold">100% Signal</span>
            </div>
          </div>

          {/* Right: Active Dispatches List */}
          <div className="lg:col-span-8 space-y-3">
            {ambulances.map((amb) => {
              const isEmergency = amb.status === 'EN_ROUTE_TO_HOSPITAL';
              return (
                <motion.div
                  key={amb.id}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEmergency
                      ? 'bg-gradient-to-r from-coral-soft/50 via-white to-coral-soft/30 border-coral/40 shadow-md ring-1 ring-coral/30'
                      : 'bg-white border-soft-grey shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-soft-grey">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                          isEmergency ? 'bg-coral text-white shadow-xs' : 'bg-warm-light-grey text-navy'
                        }`}
                      >
                        {amb.id.replace('AMB-', '')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy text-sm">{amb.id}</span>
                          <span className="text-xs text-slate font-medium">• {amb.type}</span>
                        </div>
                        <p className="text-[11px] text-slate">
                          Driver: <strong>{amb.driver}</strong> | Paramedic: <strong>{amb.paramedic}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                          isEmergency
                            ? 'bg-coral text-white shadow-xs'
                            : amb.status.includes('DISPATCHED')
                            ? 'bg-amber-soft text-amber-900 border border-amber-300'
                            : 'bg-emerald-soft text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {amb.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate uppercase block">GPS Location</span>
                      <span className="font-semibold text-navy flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
                        {amb.location}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate uppercase block">Patient Case</span>
                      <span className="font-semibold text-coral-deep mt-0.5 block truncate">
                        {amb.patientCondition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                      <div className="text-right">
                        <span className="text-[10px] text-slate block uppercase">ETA Hospital</span>
                        <span className="text-base font-extrabold text-navy">
                          {amb.etaMinutes > 0 ? `${amb.etaMinutes} Mins` : 'At Base'}
                        </span>
                      </div>
                      {isEmergency && (
                        <div className="p-2 rounded-xl bg-navy text-white text-[10px] text-center">
                          <span className="text-emerald-400 font-bold block">{amb.spo2} SpO2</span>
                          <span className="text-coral font-bold block">{amb.hr}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ============================================================== */}
      {/* SECTION 2: OPERATING THEATRE (OT) SUITES & WHO SURGICAL CHECK */}
      {/* ============================================================== */}
      <Card className="glass-card border border-white/60 shadow-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-soft text-emerald-700 shadow-2xs">
              <Scissors className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Laminar Flow Operating Theatres (OT) Surgical Suite</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Real-time surgical progress monitoring, robotic navigation, and WHO Surgical Safety Checklist milestones.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-navy bg-warm-light-grey px-3 py-1 rounded-full border border-soft-grey">
              3 ACTIVE • 1 STERILIZING
            </span>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otSuites.map((ot) => {
            const isSterilizing = ot.phase === 'STERILIZATION_UV';
            return (
              <motion.div
                key={ot.id}
                whileHover={{ y: -4, scale: 1.015 }}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  isSterilizing
                    ? 'bg-warm-light-grey/60 border-soft-grey'
                    : 'bg-white border-soft-grey shadow-md hover:border-emerald-500 hover:shadow-glow-emerald'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-navy">{ot.id}</span>
                    <Badge variant={isSterilizing ? 'neutral' : ot.progressPct > 80 ? 'warning' : 'success'}>
                      {ot.phase.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-xs text-navy">{ot.name}</h4>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">{ot.procedure}</p>
                    <p className="text-[10px] text-slate mt-0.5">
                      Surgeon: <strong>{ot.surgeon}</strong> ({ot.specialty})
                    </p>
                    <p className="text-[10px] text-slate">Patient: {ot.patient}</p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate mb-1">
                      <span>Procedure Progress</span>
                      <strong className="text-navy">{ot.progressPct}%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-soft-grey rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-coral rounded-full transition-all duration-500"
                        style={{ width: `${ot.progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* WHO Surgical Safety Checklist */}
                  <div className="p-2.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey space-y-1 text-[10px] font-mono">
                    <span className="text-slate font-bold block uppercase text-[9px]">
                      WHO SURGICAL SAFETY CHECKLIST
                    </span>
                    <div className="flex items-center justify-between">
                      <span className={ot.checklist.signIn ? 'text-emerald-700 font-bold' : 'text-slate'}>
                        {ot.checklist.signIn ? '✓ Sign-In' : '○ Sign-In'}
                      </span>
                      <span className={ot.checklist.timeOut ? 'text-emerald-700 font-bold' : 'text-slate'}>
                        {ot.checklist.timeOut ? '✓ Time-Out' : '○ Time-Out'}
                      </span>
                      <span className={ot.checklist.signOut ? 'text-emerald-700 font-bold' : 'text-slate'}>
                        {ot.checklist.signOut ? '✓ Sign-Out' : '○ Sign-Out'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-soft-grey flex items-center justify-between text-[10px] text-slate font-mono">
                  <span>Started: {ot.startTime}</span>
                  <span>Est: {ot.estDuration}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* ============================================================== */}
      {/* SECTION 3: BLOOD BANK & COLD-CHAIN RESERVE MATRIX */}
      {/* ============================================================== */}
      <Card className="glass-card border border-white/60 shadow-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-coral-soft text-coral-deep shadow-2xs">
              <Droplet className="w-5 h-5 text-coral" />
            </div>
            <div>
              <CardTitle>Blood Bank & Cryo-Preserved Component Reserve</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Continuous temperature-monitored (+2°C to +6°C) whole blood, PRBC, and fresh frozen plasma inventory.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              sound.playChime();
              alert('Triggered Emergency Blood Drive Notification to registered blood donor network in 5 km radius.');
            }}
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-coral" /> Trigger Donor Network Ping
          </Button>
        </CardHeader>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodStock.map((b) => {
            const isCritical = b.status === 'CRITICAL_SHORTAGE';
            const isLow = b.status === 'LOW_STOCK';

            return (
              <motion.div
                key={b.group}
                whileHover={{ y: -3, scale: 1.03 }}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isCritical
                    ? 'bg-red-50/80 border-coral text-coral-deep shadow-sm ring-1 ring-coral/40'
                    : isLow
                    ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                    : 'bg-white border-soft-grey text-navy shadow-2xs hover:border-emerald-500'
                }`}
              >
                <div className="font-display font-black text-2xl mb-1">{b.group}</div>
                <div className="text-xl font-mono font-bold tabular-nums">
                  {b.units} <span className="text-[10px] font-normal text-slate">Units</span>
                </div>
                <span
                  className={`mt-2 block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    isCritical
                      ? 'bg-coral text-white'
                      : isLow
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-soft text-emerald-800'
                  }`}
                >
                  {b.status.replace(/_/g, ' ')}
                </span>
                <p className="text-[9px] text-slate mt-1.5 leading-tight truncate">{b.req}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

