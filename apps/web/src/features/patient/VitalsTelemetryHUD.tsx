import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { sound } from '@/services/soundEffects';
import confetti from 'canvas-confetti';
import {
  Heart,
  Activity,
  Droplet,
  Pill,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const VitalsTelemetryHUD: React.FC = () => {
  // Interactive Meds Tracker
  const [meds, setMeds] = useState([
    { id: 'med-1', name: 'Telmisartan 40mg', time: '08:00 AM', taken: true, meal: 'After Breakfast' },
    { id: 'med-2', name: 'Atorvastatin 10mg', time: '02:00 PM', taken: false, meal: 'After Lunch' },
    { id: 'med-3', name: 'Vitamin D3 60k IU', time: '08:30 PM', taken: false, meal: 'After Dinner' },
  ]);

  // Interactive Hydration
  const [waterGlasses, setWaterGlasses] = useState(6);
  const targetGlasses = 8;

  const toggleMed = (id: string) => {
    sound.playClick();
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.taken;
          if (nextState) {
            sound.playChime();
          }
          return { ...m, taken: nextState };
        }
        return m;
      })
    );
  };

  const addWater = () => {
    sound.playClick();
    if (waterGlasses < 12) {
      setWaterGlasses((w) => w + 1);
      if (waterGlasses + 1 === targetGlasses) {
        sound.playChime();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }
  };

  const removeWater = () => {
    sound.playClick();
    if (waterGlasses > 0) setWaterGlasses((w) => w - 1);
  };

  const takenCount = meds.filter((m) => m.taken).length;
  const adherencePct = Math.round((takenCount / meds.length) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* 1. Live Heart Rate & ECG Rhythm */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-card rounded-2xl p-4 border border-white/60 shadow-md relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-coral-soft text-coral-deep shadow-2xs">
              <Heart className="w-4 h-4 text-coral animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate block font-bold">
                PULSE / ECG
              </span>
              <span className="text-xs font-bold text-navy">Normal Sinus</span>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-soft px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            SYNCED
          </span>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <div className="text-3xl font-display font-black text-navy tabular-nums flex items-baseline gap-1">
            <AnimatedCounter value={72} />
            <span className="text-xs font-normal text-slate">BPM</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Optimal
          </span>
        </div>

        <div className="p-2 rounded-xl bg-warm-light-grey/80 border border-soft-grey">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate mb-1">
            <span>LEAD II CONTINUOUS</span>
            <span className="text-coral font-bold">LIVE TELEMETRY</span>
          </div>
          <EcgPulse color="#FF5B47" width={180} height={20} />
        </div>
      </motion.div>

      {/* 2. Blood Pressure & SpO2 Metrics */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-card rounded-2xl p-4 border border-white/60 shadow-md relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-soft text-emerald-700 shadow-2xs">
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate block font-bold">
                HEMODYNAMICS
              </span>
              <span className="text-xs font-bold text-navy">BP & Oxygenation</span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate">Today 07:30 AM</span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-2">
          <div className="p-2.5 rounded-xl bg-white/80 border border-soft-grey shadow-2xs">
            <span className="text-[9px] font-mono text-slate block uppercase">Blood Pressure</span>
            <div className="text-xl font-display font-black text-navy tabular-nums">120/80</div>
            <span className="text-[9px] text-emerald-700 font-bold">Normotensive</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/80 border border-soft-grey shadow-2xs">
            <span className="text-[9px] font-mono text-slate block uppercase">Blood SpO2</span>
            <div className="text-xl font-display font-black text-emerald-700 tabular-nums">99%</div>
            <span className="text-[9px] text-emerald-700 font-bold">Adequate O2</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate font-medium pt-1 border-t border-soft-grey">
          <span>Fasting Blood Glucose:</span>
          <strong className="text-navy font-mono">96 mg/dL (Normal)</strong>
        </div>
      </motion.div>

      {/* 3. Daily Medication Schedule & Adherence */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-card rounded-2xl p-4 border border-white/60 shadow-md relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-soft text-amber-800 shadow-2xs">
              <Pill className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate block font-bold">
                PRESCRIPTION SCHEDULE
              </span>
              <span className="text-xs font-bold text-navy">Daily Pills ({takenCount}/{meds.length})</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-coral-deep bg-coral-soft px-2 py-0.5 rounded-full">
            {adherencePct}% Done
          </span>
        </div>

        {/* Interactive Medication Checklist */}
        <div className="space-y-1.5 my-1">
          {meds.map((m) => (
            <div
              key={m.id}
              onClick={() => toggleMed(m.id)}
              className={`p-2 rounded-xl cursor-pointer border text-xs flex items-center justify-between transition-all select-none ${
                m.taken
                  ? 'bg-emerald-soft/50 border-emerald-400/40 text-emerald-900 line-through opacity-80'
                  : 'bg-white/80 border-soft-grey text-navy hover:border-coral shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <input
                  type="checkbox"
                  checked={m.taken}
                  onChange={() => {}}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="truncate font-semibold text-[11px]">{m.name}</span>
              </div>
              <span className="text-[9px] font-mono text-slate shrink-0">{m.time}</span>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate flex items-center justify-between pt-1 border-t border-soft-grey">
          <span>Next pill: <strong>02:00 PM</strong></span>
          <span className="text-coral-deep font-semibold">Dr. Sharma's Rx</span>
        </div>
      </motion.div>

      {/* 4. Hydration & Daily Wellness Meter */}
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-card rounded-2xl p-4 border border-white/60 shadow-md relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800 shadow-2xs">
              <Droplet className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate block font-bold">
                HYDRATION GOAL
              </span>
              <span className="text-xs font-bold text-navy">Water Intake</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            {waterGlasses} / {targetGlasses} Glasses
          </span>
        </div>

        {/* Water Progress Visualizer */}
        <div className="my-2 space-y-2">
          <div className="h-3 w-full bg-soft-grey/60 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (waterGlasses / targetGlasses) * 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={removeWater}
              className="w-8 h-8 rounded-full bg-white border border-soft-grey shadow-2xs flex items-center justify-center text-slate hover:text-navy hover:border-coral transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-sm text-navy">{waterGlasses * 250} ml logged</span>
            <button
              onClick={addWater}
              className="w-8 h-8 rounded-full bg-navy text-white shadow-xs flex items-center justify-center hover:bg-navy/90 transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-[10px] text-slate flex items-center justify-between pt-1 border-t border-soft-grey">
          <span>Daily Target: 2,000 ml</span>
          <span className="text-emerald-700 font-bold">
            {waterGlasses >= targetGlasses ? 'Goal Reached! 🎉' : `${(targetGlasses - waterGlasses) * 250}ml to go`}
          </span>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

