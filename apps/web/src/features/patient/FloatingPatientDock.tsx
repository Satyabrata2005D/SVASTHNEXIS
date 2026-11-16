import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  PhoneCall,
  Sparkles,
  CreditCard,
  Building2,
  FileText,
  Heart,
  Droplet,
  ChevronUp,
} from 'lucide-react';

interface FloatingPatientDockProps {
  onOpenAi: () => void;
  onOpenAbha: () => void;
  onOpenLocker: () => void;
  onOpenDiscovery: () => void;
  onEmergencyTrigger: () => void;
}

export const FloatingPatientDock: React.FC<FloatingPatientDockProps> = ({
  onOpenAi,
  onOpenAbha,
  onOpenLocker,
  onOpenDiscovery,
  onEmergencyTrigger,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/90 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
        {/* Emergency SOS Pulse Pill */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playChime();
            onEmergencyTrigger();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold text-xs shadow-lg hover:shadow-glow-coral transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span className="font-mono">108 SOS</span>
        </motion.button>

        {/* AI Symptom Navigator */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAi();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          <span className="hidden sm:inline">AI Triage</span>
        </button>

        {/* ABHA Digital Card */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAbha();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">ABHA Card</span>
        </button>

        {/* Book Doctor & Hospitals */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenDiscovery();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Care Discovery</span>
        </button>

        {/* Health Locker */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLocker();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Health Locker</span>
        </button>

        {/* Back to top */}
        <button
          onClick={() => {
            sound.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Scroll to top"
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

