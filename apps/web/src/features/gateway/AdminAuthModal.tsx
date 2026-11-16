import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Crown,
  ShieldAlert,
  ShieldCheck,
  Key,
  Lock,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Database,
  Activity,
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (destination: string, role: string, loginId: string) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [adminId, setAdminId] = useState('adm-001');
  const [adminPassphrase, setAdminPassphrase] = useState('••••••••••••');
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // 7-Day Cooling Off Simulated Clock
  const [secondsRemaining, setSecondsRemaining] = useState(6 * 86400 + 23 * 3600 + 47 * 60 + 11);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const formatCountdown = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const slots = [
    {
      slotNum: 1,
      id: 'adm-001',
      title: 'Root Sovereign Master',
      role: 'SUPER_ADMIN_ROOT',
      status: 'ACTIVE',
      keyFingerprint: 'SHA256:7f4a...92b1',
    },
    {
      slotNum: 2,
      id: 'adm-002',
      title: 'SecOps Infrastructure Director',
      role: 'SUPER_ADMIN_SECOPS',
      status: 'ACTIVE',
      keyFingerprint: 'SHA256:e3b0...4f18',
    },
    {
      slotNum: 3,
      id: 'adm-003',
      title: 'National Healthcare Compliance',
      role: 'SUPER_ADMIN_COMPLIANCE',
      status: 'ACTIVE',
      keyFingerprint: 'SHA256:91c2...6a44',
    },
    {
      slotNum: 4,
      id: 'adm-004',
      title: 'Provincial Health Liaison',
      role: 'SUPER_ADMIN_LIAISON',
      status: 'COOLING_OFF_7D',
      keyFingerprint: 'SHA256:d8a1...10e7',
    },
    {
      slotNum: 5,
      id: 'adm-vacant',
      title: 'Unallocated Sovereign Seat',
      role: 'AVAILABLE_FOR_APPOINTMENT',
      status: 'VACANT',
      keyFingerprint: 'UNASSIGNED',
    },
  ];

  const handleExecuteLogin = () => {
    sound.playTelemetryBeep();
    setIsVerifying(true);

    setTimeout(() => {
      sound.playChime();
      setIsVerifying(false);
      onSuccessLogin('/admin', 'SUPER_ADMIN', adminId);
    }, 850);
  };

  const currentSlot = slots[selectedSlot];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-navy flex items-center justify-center transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ===================================================================== */}
        {/* LEFT COLUMN: SOVEREIGN CONSTITUTION & PLATFORM ROOT BADGE */}
        {/* ===================================================================== */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#0b1320] via-[#131d2e] to-[#080d16] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/15 rounded-full blur-3xl pointer-events-none" />

          {/* Institutional Top Heading */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-300">
                SOVEREIGN GOVERNANCE • ADR-001 CONSTITUTION
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              Platform Super-Admin Sovereign Console
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tier-1 root governance governing 34 connected hospitals, 420 NMC accredited doctors, multi-tenant billing, and platform-wide security policies.
            </p>
          </div>

          {/* SOVEREIGN ROOT MASTER KEYCARD BADGE */}
          <div className="my-6 relative z-10">
            <div className="relative rounded-2xl bg-gradient-to-tr from-slate-950 via-[#1b2537] to-[#111824] border border-amber-500/30 p-5 shadow-2xl overflow-hidden group">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    <Crown className="w-4 h-4 text-slate-950" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono tracking-wider text-amber-300 font-bold uppercase">
                      ROOT SOVEREIGN SEAT
                    </div>
                    <div className="text-xs font-bold text-white font-display">
                      Administrator 01 (Master)
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                  SLOT 1 / 5
                </span>
              </div>

              {/* Cryptographic Key Details */}
              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">KEY FINGERPRINT:</span>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {currentSlot.keyFingerprint}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">MERKLE ROOT:</span>
                  <span className="text-[11px] text-emerald-400 font-bold">#184,924 (VALID)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">7D COOLING SAFEGUARD:</span>
                  <span className="text-[11px] text-coral-light font-bold">
                    {formatCountdown(secondsRemaining)}
                  </span>
                </div>
              </div>

              {/* Footer Telemetry */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400">2/5 Slots Active</span>
                <span className="text-slate-300">₹4.82 Cr Gross Settlements</span>
              </div>
            </div>
          </div>

          {/* Statutory Constitutional Shield */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-400 pt-3 border-t border-white/10">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>ADR-001: Strict 5-Admin Platform Ceiling • 7-Day Removal Cooling-Off Lock</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: SOVEREIGN AUTHENTICATION & SLOTS SELECTION */}
        {/* ===================================================================== */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Top Title & Constitutional Rules */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Crown className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-navy">
                    Executive Sovereign Access
                  </h4>
                  <p className="text-xs text-slate">
                    Cryptographic keycard verification for platform-wide administration.
                  </p>
                </div>
              </div>
            </div>

            {/* 5-Slot Sovereign Quota Bar */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span className="flex items-center gap-1.5 font-display">
                  <Crown className="w-3.5 h-3.5 text-amber-600" /> Constitutional 5-Seat Quota
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  2/5 Active Seats
                </span>
              </div>

              {/* 5 Slots Selector */}
              <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-mono font-bold">
                {slots.map((s, idx) => {
                  const isSelected = selectedSlot === idx;
                  return (
                    <button
                      key={s.slotNum}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedSlot(idx);
                        if (s.id !== 'adm-vacant') setAdminId(s.id);
                      }}
                      className={`py-2 px-1 rounded-xl transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-navy text-white border-navy shadow-sm ring-2 ring-amber-400/40'
                          : s.status === 'ACTIVE'
                          ? 'bg-white text-navy border-soft-grey hover:bg-slate-50'
                          : s.status === 'COOLING_OFF_7D'
                          ? 'bg-coral-soft/50 text-coral-deep border-coral/30 hover:bg-coral-soft'
                          : 'bg-white/40 text-slate-400 border-dashed border-soft-grey'
                      }`}
                    >
                      <div className="text-[10px] leading-tight">Slot {s.slotNum}</div>
                      <div className="text-[9px] mt-0.5 opacity-80">
                        {s.status === 'ACTIVE'
                          ? 'Active'
                          : s.status === 'COOLING_OFF_7D'
                          ? '7d Cool'
                          : 'Vacant'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Sovereign Administrator Identifier
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                    {currentSlot.title}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate mt-1 flex items-center justify-between">
                <span>Platform Governance Keyholder</span>
                <span className="font-mono text-slate-400">Slot 0{currentSlot.slotNum}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Master Cryptographic Passphrase
              </label>
              <input
                type="password"
                value={adminPassphrase}
                onChange={(e) => setAdminPassphrase(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
              />
            </div>

            {/* FIDO2 Hardware Key Status */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate space-y-1.5">
              <div className="flex items-center justify-between text-amber-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-amber-700" /> Tier-1 Hardware Security Key (FIDO2)
                </span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-emerald-700 font-bold">
                  ✓ YUBIKEY DETECTED
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Platform master governance is protected by hardware security token verification and mandatory 7-day cooling-off delays on admin removals.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-soft-grey space-y-2">
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleExecuteLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-navy via-slate-900 to-navy-light hover:from-slate-900 hover:to-navy text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span>Verifying Sovereign Platform Keycard...</span>
                </>
              ) : (
                <>
                  <span>Authorize Sovereign Access & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate px-1">
              <span>National Healthcare SOC Root Security Office</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="text-slate hover:text-navy font-semibold underline cursor-pointer"
              >
                Back to Portal Gateway
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

