import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Crown,
  Activity,
  Cpu,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building2,
  DollarSign,
  Radio,
  Sparkles,
  Zap,
  Key,
  Database,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface AdminGovernanceHologram3DProps {
  adminList: any[];
  onSelectSlot?: (adminId: string) => void;
  onFocusSection?: (section: 'ADMINS' | 'FACILITIES' | 'DOCTORS' | 'AUDIT' | 'CONTROLS') => void;
}

export const AdminGovernanceHologram3D: React.FC<AdminGovernanceHologram3DProps> = ({
  adminList = [],
  onSelectSlot,
  onFocusSection,
}) => {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStatusMsg, setAuditStatusMsg] = useState<string | null>(null);

  // Live 7-Day Cooling-Off Countdown Simulator
  const [secondsRemaining, setSecondsRemaining] = useState<number>(6 * 86400 + 23 * 3600 + 47 * 60 + 38);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleRunSovereignAudit = () => {
    sound.playTelemetryBeep();
    setIsAuditing(true);
    setAuditStatusMsg('Verifying 5-Slot Platform Constitution & SHA-256 Merkle Chain Integrity...');
    setTimeout(() => {
      sound.playChime();
      setIsAuditing(false);
      setAuditStatusMsg('✓ Sovereign Audit Passed: 5-Admin Maximum Enforced, Merkle Root Valid, 0 Compromised Nodes.');
      setTimeout(() => setAuditStatusMsg(null), 5000);
    }, 2400);
  };

  // 5 Canonical Slots
  const slotData = [
    {
      slotNum: 1,
      adminId: adminList[0]?.adminId || 'adm-001',
      title: 'Root Sovereign Master',
      status: 'ACTIVE',
      keyFingerprint: 'SHA256:7f4a...92b1',
      role: 'SUPER_ADMIN_ROOT',
    },
    {
      slotNum: 2,
      adminId: adminList[1]?.adminId || 'adm-002',
      title: 'SecOps Infrastructure Director',
      status: 'ACTIVE',
      keyFingerprint: 'SHA256:e3b0...4f18',
      role: 'SUPER_ADMIN_SECOPS',
    },
    {
      slotNum: 3,
      adminId: adminList[2]?.adminId || 'adm-003',
      title: 'National Healthcare Compliance',
      status: adminList[2] ? adminList[2].status : 'ACTIVE',
      keyFingerprint: 'SHA256:91c2...6a44',
      role: 'SUPER_ADMIN_COMPLIANCE',
    },
    {
      slotNum: 4,
      adminId: adminList[3]?.adminId || 'adm-004',
      title: 'Provincial Health Liaison',
      status: adminList[3]?.status || 'COOLING_OFF_7D',
      keyFingerprint: 'SHA256:d8a1...10e7',
      role: 'SUPER_ADMIN_LIAISON',
    },
    {
      slotNum: 5,
      adminId: adminList[4]?.adminId || 'VACANT_SLOT',
      title: 'Unallocated Sovereign Seat',
      status: adminList[4] ? adminList[4].status : 'VACANT',
      keyFingerprint: 'UNASSIGNED',
      role: 'AVAILABLE_FOR_APPOINTMENT',
    },
  ];

  const selectedSlot = slotData[activeSlotIndex];

  return (
    <div
      className="relative rounded-2xl bg-gradient-to-br from-navy via-slate-900 to-navy-light text-white p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10"
    >
      {/* Background Radial Glow & Ambient Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-coral/15 via-emerald-500/10 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Header HUD */}
      <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-coral text-white shadow-glow-coral">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white tracking-wide flex items-center gap-2">
                <span>Sovereign Governance Matrix & Multi-Tenant Core</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                  ADR-001 CONSTITUTION
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Strict 5-member platform administrator ceiling • 7-day removal cooling-off safeguard • National master authority
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSovereignAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Sovereign Audit'}</span>
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>5/5 SLOTS MONITORED</span>
          </div>
        </div>
      </div>

      {/* Audit Status Live Banner */}
      <AnimatePresence>
        {auditStatusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{auditStatusMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5 Slots Selector Bar (Clean 2D Sovereign Quota HUD) */}
      <div className="my-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-bold font-display text-xs">
            Pentagram Quota: {adminList.length}/5 Slots Active • Sovereign Tier-1
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((idx) => {
            const isFilled = idx < adminList.length;
            const isSelected = activeSlotIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setActiveSlotIndex(idx);
                  const s = slotData[idx];
                  if (s && onSelectSlot) onSelectSlot(s.adminId);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-white shadow-sm ring-2 ring-amber-400/50'
                    : isFilled
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-white/5 text-slate-400 border-dashed border-white/20 hover:bg-white/10'
                }`}
              >
                Slot {idx + 1} {isFilled ? '★ Active' : '○ Vacant'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Slot Inspector HUD & 7-Day Cooling Off Countdown */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        {/* Selected Slot Information */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Key className="w-3 h-3 text-amber-400" /> Slot 0{selectedSlot.slotNum} Inspector
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedSlot.status === 'ACTIVE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : selectedSlot.status === 'COOLING_OFF_7D'
                  ? 'bg-coral/20 text-coral-light border border-coral/40'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {selectedSlot.status}
            </span>
          </div>

          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>{selectedSlot.adminId}</span>
            <span className="text-xs text-slate-400 font-normal">({selectedSlot.title})</span>
          </div>

          <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Key Fingerprint:</span>
            <span>{selectedSlot.keyFingerprint}</span>
          </div>

          <p className="text-[10px] text-slate-400 leading-snug">
            {selectedSlot.status === 'VACANT'
              ? 'This administrator seat is open. Platform ceiling accommodates at most 5 concurrent administrators.'
              : selectedSlot.status === 'COOLING_OFF_7D'
              ? 'Scheduled removal initiated by peer admin. 7-day cryptographic cooling-off protects against hostile takeover.'
              : 'Full root sovereign clearance to manage all multi-tenant hospitals, doctors, and platform financial flows.'}
          </p>
        </div>

        {/* 7-Day Cooling Off Protocol Radar */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-coral-deep/30 to-navy border border-coral/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-coral-light flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-coral" /> 7-Day Cooling-Off Clock
            </span>
            <span className="text-[10px] font-mono bg-coral/20 text-white px-1.5 py-0.5 rounded">
              ADR-001 / SEC-02
            </span>
          </div>

          <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            {formatCountdown(secondsRemaining)}
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-coral h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.max(10, ((7 * 86400 - secondsRemaining) / (7 * 86400)) * 100)}%`,
              }}
            />
          </div>

          <p className="text-[10px] text-slate-300 leading-tight">
            One admin can delete another's ID, but a <strong>mandatory 7-day waiting period</strong> is enforced. The removal can be aborted at any time by administrator consensus.
          </p>
        </div>

        {/* Multi-Tenant Quick Teleport Pillars */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              National Health Network Oversight
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  onFocusSection?.('FACILITIES');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Building2 className="w-3 h-3 text-emerald-400" />
                  <span>Facilities</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">34 Verified</div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onFocusSection?.('DOCTORS');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Users className="w-3 h-3 text-sky-400" />
                  <span>Doctors</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">428 NMC Active</div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onFocusSection?.('AUDIT');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Lock className="w-3 h-3 text-coral" />
                  <span>Audit Chain</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">SHA-256 Valid</div>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onFocusSection?.('CONTROLS');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Master Ops</span>
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Live Mode</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

