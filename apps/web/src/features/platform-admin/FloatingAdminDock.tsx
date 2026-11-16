import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Crown,
  Users,
  Sliders,
  Building2,
  FileCheck,
  Lock,
  ShieldAlert,
} from 'lucide-react';

interface FloatingAdminDockProps {
  onFocusHologram: () => void;
  onFocusAdminQuota: () => void;
  onFocusMasterControls: () => void;
  onFocusHospitals: () => void;
  onFocusDoctors: () => void;
  onFocusAudit: () => void;
  onTriggerEmergencyLockdown: () => void;
}

export const FloatingAdminDock: React.FC<FloatingAdminDockProps> = ({
  onFocusHologram,
  onFocusAdminQuota,
  onFocusMasterControls,
  onFocusHospitals,
  onFocusDoctors,
  onFocusAudit,
  onTriggerEmergencyLockdown,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
        {/* Hologram Core */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onFocusHologram();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-coral text-white font-bold text-xs shadow-lg hover:shadow-glow-coral transition-all cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Sovereign Core</span>
        </motion.button>

        {/* 5-Slot Admin Quota */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusAdminQuota();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">5-Slot Quota</span>
        </button>

        {/* Master Controls */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusMasterControls();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Master Ops</span>
        </button>

        {/* Hospital Facilities */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusHospitals();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Hospitals</span>
        </button>

        {/* Doctor Registry */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusDoctors();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <FileCheck className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden lg:inline">Doctor Registry</span>
        </button>

        {/* Merkle Audit */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusAudit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-coral" />
          <span className="hidden sm:inline">SHA-256 Audit</span>
        </button>

        {/* Emergency Lockdown Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onTriggerEmergencyLockdown();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-coral text-white hover:bg-coral-deep text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-coral animate-pulse" />
          <span>Lockdown</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

