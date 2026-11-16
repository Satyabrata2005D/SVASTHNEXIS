import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Shield, CheckCircle2, RotateCw, Heart, Wifi, CreditCard, Sparkles } from 'lucide-react';
import { sound } from '@/services/soundEffects';

interface AbhaCardProps {
  patientName?: string;
  abhaId?: string;
  abhaAddress?: string;
  bloodGroup?: string;
  dob?: string;
  gender?: string;
  insuranceName?: string;
  policyNumber?: string;
}

export const AbhaCard: React.FC<AbhaCardProps> = ({
  patientName = 'Rahul Verma',
  abhaId = '91-4209-8812-3904',
  abhaAddress = 'rahul.verma@abdm',
  bloodGroup = 'O+ POSITIVE',
  dob = '14-Aug-1984 (42Y)',
  gender = 'Male',
  insuranceName = 'Star Health Comprehensive (Cashless)',
  policyNumber = 'SH-CARD-991823-BLR',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    sound.playClick();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative perspective-1000 w-full max-w-md mx-auto select-none">
      {/* Ambient Floating Glow behind Card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-coral/25 via-emerald-500/20 to-navy/30 rounded-3xl blur-xl opacity-75 -z-10 animate-pulse-glow" />

      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full rounded-2xl cursor-pointer"
        onClick={handleFlip}
      >
        {/* ============================================================== */}
        {/* FRONT OF THE CARD */}
        {/* ============================================================== */}
        <div
          className={`w-full p-5 rounded-2xl bg-gradient-to-br from-navy via-navy-light to-navy text-white shadow-2xl border border-white/20 relative overflow-hidden flex flex-col justify-between min-h-[230px] ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Shimmer Light Streak across card */}
          <div className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shimmer" />

          {/* Holographic Watermark Circle */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-coral/10 blur-xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

          {/* Top Row: National Emblem / Header & Chip */}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral to-coral-deep flex items-center justify-center text-white shadow-md font-display font-black text-sm">
                SN
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-coral font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> ABDM DIGITAL HEALTH ID
                </span>
                <span className="text-xs font-display font-bold text-white tracking-wide block">
                  NATIONAL HEALTH AUTHORITY • INDIA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                title="Flip to view policy details"
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Middle Row: Smart Chip & QR Code */}
          <div className="flex items-center justify-between my-3 relative z-10">
            {/* Holographic EMV Chip */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-sm relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-px bg-amber-800/40 my-auto" />
                <div className="absolute inset-x-2 h-full border-x border-amber-800/40" />
              </div>
              <Wifi className="w-4 h-4 text-slate-400 rotate-90" />
            </div>

            {/* Touchless Kiosk QR Code */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 shadow-xs">
              <QrCode className="w-6 h-6 text-white" />
              <div className="text-left text-[9px] font-mono leading-tight">
                <span className="text-slate-300 block">KIOSK SCAN</span>
                <span className="text-emerald-400 font-bold">TOKEN READY</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Patient Identity & ABHA Number */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-lg text-white tracking-wide">
                {patientName}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-coral/20 text-coral border border-coral/30">
                {bloodGroup}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="tracking-widest font-bold text-white text-sm">{abhaId}</span>
              <span className="text-[10px] text-slate-400">{dob}</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
              <span className="truncate max-w-[180px]">{abhaAddress}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> DPDP VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BACK OF THE CARD (FLIPPED STATE) */}
        {/* ============================================================== */}
        <div
          className={`absolute inset-0 w-full p-5 rounded-2xl bg-gradient-to-br from-navy-dark via-navy to-slate-900 text-white shadow-2xl border border-white/20 flex flex-col justify-between ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Black Magnetic Stripe */}
          <div className="absolute top-4 inset-x-0 h-9 bg-black/80 border-y border-white/10" />

          {/* Card Back Content */}
          <div className="mt-11 space-y-3 relative z-10 text-xs">
            {/* Insurance Policy Box */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-coral" /> LINKED HEALTH INSURANCE
              </span>
              <div className="flex items-center justify-between font-bold text-white text-[11px]">
                <span>{insuranceName}</span>
                <span className="text-emerald-400 text-[10px]">CASHLESS ACTIVE</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">Policy: {policyNumber}</p>
            </div>

            {/* Emergency & Organ Donor Info */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-slate-400 block font-mono">EMERGENCY CONTACT</span>
                <strong className="text-white block mt-0.5">Mrs. S. Verma (Wife)</strong>
                <span className="text-coral font-mono">+91 98450 88219</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-slate-400 block font-mono">ORGAN DONOR PLEDGE</span>
                <strong className="text-emerald-400 block mt-0.5">YES • REGISTERED</strong>
                <span className="text-slate-400 font-mono">NOTTO ID: 44021</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-white/10 relative z-10">
            <span>Powered by SvasthNexis National Grid</span>
            <span className="text-coral cursor-pointer hover:underline" onClick={handleFlip}>
              Tap to flip front ↺
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

