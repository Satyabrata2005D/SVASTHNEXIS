import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  ShieldAlert,
  DollarSign,
  FileText,
  FlaskConical,
  Pill,
  Mail,
  RefreshCw,
  Activity,
  Layers,
} from 'lucide-react';

interface FloatingStaffDockProps {
  onFocusSoc: () => void;
  onFocusTariffs: () => void;
  onFocusRecords: () => void;
  onFocusLab: () => void;
  onOpenMailAdmin: () => void;
  onTriggerSocScan: () => void;
}

export const FloatingStaffDock: React.FC<FloatingStaffDockProps> = ({
  onFocusSoc,
  onFocusTariffs,
  onFocusRecords,
  onFocusLab,
  onOpenMailAdmin,
  onTriggerSocScan,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
        {/* Run SOC Scan Pill */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playTelemetryBeep();
            onTriggerSocScan();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold text-xs shadow-lg hover:shadow-glow-coral transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-mono">360° SOC Scan</span>
        </motion.button>

        {/* Cyber SOC */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusSoc();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-coral" />
          <span className="hidden md:inline">Cyber SOC</span>
        </button>

        {/* Hospital Tariffs */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusTariffs();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Hospital Tariffs</span>
        </button>

        {/* Patient Vault */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusRecords();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Patient Archive</span>
        </button>

        {/* Pathologist LIS */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusLab();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden lg:inline">Pathologist LIS</span>
        </button>

        {/* Mail Admin Modal Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onOpenMailAdmin();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-navy to-slate-800 border border-white/20 text-white hover:bg-white/10 text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-coral" />
          <span>Mail Admin</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

