import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Sparkles,
  Video,
  FileText,
  ShieldCheck,
  Building2,
  Stethoscope,
  Volume2,
  Mic,
  Activity,
  Layers,
} from 'lucide-react';

interface FloatingDoctorDockProps {
  onLaunchVideo: () => void;
  onJumpToHistory: () => void;
  onVoiceDictation: () => void;
  onSignPrescription: () => void;
  onTogglePractice: () => void;
  activePractice: 'HOSPITAL' | 'PRIVATE_CLINIC';
  isSigned: boolean;
  onCallNextPatient: () => void;
}

export const FloatingDoctorDock: React.FC<FloatingDoctorDockProps> = ({
  onLaunchVideo,
  onJumpToHistory,
  onVoiceDictation,
  onSignPrescription,
  onTogglePractice,
  activePractice,
  isSigned,
  onCallNextPatient,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
        {/* Practice Switcher Pill */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onTogglePractice();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            activePractice === 'HOSPITAL'
              ? 'bg-gradient-to-r from-coral to-coral-deep text-white shadow-md'
              : 'bg-emerald-600 text-white shadow-md'
          }`}
          title="Switch Practice: CityCare Hospital vs Sharma Clinic"
        >
          {activePractice === 'HOSPITAL' ? <Building2 className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
          <span>{activePractice === 'HOSPITAL' ? 'CityCare Hospital' : 'Sharma Clinic'}</span>
        </motion.button>

        {/* Launch Telehealth Zoom / Google Meet */}
        <button
          onClick={() => {
            sound.playClick();
            onLaunchVideo();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Video className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Telehealth Video</span>
        </button>

        {/* AI Voice Dictation */}
        <button
          onClick={() => {
            sound.playTelemetryBeep();
            onVoiceDictation();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
          title="AI Voice Scribe dictation into SOAP note"
        >
          <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden md:inline">Voice Scribe</span>
        </button>

        {/* Patient Past Records Locker */}
        <button
          onClick={() => {
            sound.playClick();
            onJumpToHistory();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Past Vault</span>
        </button>

        {/* Call Next Patient in Queue */}
        <button
          onClick={() => {
            sound.playChime();
            onCallNextPatient();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
          title="Announce next patient in queue"
        >
          <Volume2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden lg:inline">Call Next</span>
        </button>

        {/* Cryptographic Prescription Sign Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playChime();
            onSignPrescription();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all ${
            isSigned
              ? 'bg-emerald-600 text-white shadow-glow-emerald cursor-default'
              : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:shadow-glow-emerald cursor-pointer'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isSigned ? 'Signed & Synced' : 'Sign Rx'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

