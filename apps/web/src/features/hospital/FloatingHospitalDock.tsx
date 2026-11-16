import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  AlertTriangle,
  BedDouble,
  Ambulance,
  UserCheck,
  Tag,
  Inbox,
  ChevronUp,
  Scissors,
  Droplet,
} from 'lucide-react';

interface FloatingHospitalDockProps {
  onSelectTab: (tab: any) => void;
  onTriggerCodeBlue: () => void;
}

export const FloatingHospitalDock: React.FC<FloatingHospitalDockProps> = ({
  onSelectTab,
  onTriggerCodeBlue,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/90 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
        {/* Code Blue Emergency Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playChime();
            onTriggerCodeBlue();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold text-xs shadow-lg hover:shadow-glow-coral transition-all cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
          <span className="font-mono">CODE BLUE</span>
        </motion.button>

        {/* Ward Bed Matrix */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('OVERVIEW');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <BedDouble className="w-3.5 h-3.5 text-coral" />
          <span className="hidden sm:inline">Bed Matrix</span>
        </button>

        {/* 108 Fleet & OT Suites */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('FLEET_AND_OT');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Ambulance className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">108 Fleet & OT</span>
        </button>

        {/* Doctor Credential Approvals */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('DOCTOR_APPROVALS');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Doctor Approvals</span>
        </button>

        {/* Surgery & Test Pricing */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('SURGERIES');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Tag className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Tariffs</span>
        </button>

        {/* Booking Requests Inbox */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('BOOKINGS');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Inbox className="w-3.5 h-3.5 text-emerald-300" />
          <span className="hidden sm:inline">Bookings</span>
        </button>

        {/* Scroll To Top */}
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

