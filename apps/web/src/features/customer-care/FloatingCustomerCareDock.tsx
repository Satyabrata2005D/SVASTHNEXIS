import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  PhoneCall,
  CreditCard,
  UserCheck,
  FileText,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';

interface FloatingCustomerCareDockProps {
  onFocusHotline: () => void;
  onFilterCategory: (cat: 'PAYMENT_FAILURE' | 'DOCTOR_NO_SHOW' | 'DOCUMENT_FAILURE') => void;
  onFocusRbacLock: () => void;
  onOpenStaffEscalation: () => void;
}

export const FloatingCustomerCareDock: React.FC<FloatingCustomerCareDockProps> = ({
  onFocusHotline,
  onFilterCategory,
  onFocusRbacLock,
  onOpenStaffEscalation,
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto p-1.5 rounded-full bg-navy/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center gap-1 sm:gap-2">
        {/* Hotline Live Desk */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onFocusHotline();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-coral to-coral-deep text-white font-bold text-xs shadow-lg hover:shadow-glow-coral transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span>Hotline HUD</span>
        </motion.button>

        {/* Payment Failure */}
        <button
          onClick={() => {
            sound.playClick();
            onFilterCategory('PAYMENT_FAILURE');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Payment Recovery</span>
        </button>

        {/* Doctor No-Show */}
        <button
          onClick={() => {
            sound.playClick();
            onFilterCategory('DOCTOR_NO_SHOW');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Doctor Dispatch</span>
        </button>

        {/* Document Failure */}
        <button
          onClick={() => {
            sound.playClick();
            onFilterCategory('DOCUMENT_FAILURE');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Document Repair</span>
        </button>

        {/* CAT-07 Chart Lock Shield */}
        <button
          onClick={() => {
            sound.playClick();
            onFocusRbacLock();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-coral" />
          <span className="hidden lg:inline">CAT-07 Shield</span>
        </button>

        {/* Escalate to Staff Hub */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playClick();
            onOpenStaffEscalation();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-navy to-slate-800 border border-white/20 text-white hover:bg-white/10 text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-coral" />
          <span>Escalate to Staff Hub</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

