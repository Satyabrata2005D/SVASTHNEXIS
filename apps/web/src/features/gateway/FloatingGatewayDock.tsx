import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  ShieldAlert,
  Zap,
  Building2,
  UserCheck,
  ChevronUp,
  Volume2,
  VolumeX,
  PhoneCall,
  Activity,
} from 'lucide-react';

interface FloatingGatewayDockProps {
  onSelectSection: (section: string) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onEmergencyTrigger: () => void;
}

export const FloatingGatewayDock: React.FC<FloatingGatewayDockProps> = ({
  onSelectSection,
  isAudioMuted,
  onToggleAudio,
  onEmergencyTrigger,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
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

        {/* Section 1: Admin */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectSection('ADMIN');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-coral" />
          <span className="hidden md:inline">1. Admin</span>
        </button>

        {/* Section 2: Office Workers */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectSection('STAFF_HUB');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">2. Office Workers</span>
        </button>

        {/* Section 3: Hospital & Doctor */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectSection('HOSPITAL');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">3. Hospital & Dr</span>
        </button>

        {/* Section 4: Patient */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectSection('PATIENT');
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">4. Patient</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            onToggleAudio();
          }}
          title={isAudioMuted ? 'Turn on audio feedback' : 'Mute audio feedback'}
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
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

