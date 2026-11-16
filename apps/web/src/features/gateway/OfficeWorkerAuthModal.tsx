import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Briefcase,
  Headphones,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  PhoneCall,
  Lock,
  ArrowRight,
  X,
  Sparkles,
  RefreshCw,
  QrCode,
  FileCheck2,
  DollarSign,
  AlertCircle,
  Database,
  Building2,
  CheckCircle2,
  BadgeAlert,
} from 'lucide-react';

interface OfficeWorkerAuthModalProps {
  isOpen: boolean;
  initialMode?: 'STAFF_HUB' | 'CUSTOMER_CARE';
  onClose: () => void;
  onSuccessLogin: (destination: string, role: string, loginId: string) => void;
}

export type OfficeTrack = 'STAFF_HUB' | 'CUSTOMER_CARE';

export const OfficeWorkerAuthModal: React.FC<OfficeWorkerAuthModalProps> = ({
  isOpen,
  initialMode = 'STAFF_HUB',
  onClose,
  onSuccessLogin,
}) => {
  const [activeTrack, setActiveTrack] = useState<OfficeTrack>(initialMode);

  // Form States
  const [staffId, setStaffId] = useState('usr-staff-lab');
  const [staffPass, setStaffPass] = useState('••••••••••••');
  const [ccId, setCcId] = useState('usr-cc-001');
  const [ccPass, setCcPass] = useState('••••••••••••');

  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleExecuteLogin = () => {
    sound.playTelemetryBeep();
    setIsVerifying(true);

    setTimeout(() => {
      sound.playChime();
      setIsVerifying(false);
      if (activeTrack === 'STAFF_HUB') {
        onSuccessLogin('/staff', 'STAFF_HUB', staffId);
      } else {
        onSuccessLogin('/support', 'CUSTOMER_CARE', ccId);
      }
    }, 850);
  };

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
        {/* LEFT COLUMN: ENTERPRISE EMPLOYEE & SUPPORT CREDENTIAL BADGE */}
        {/* ===================================================================== */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#121c2e] via-[#1a283e] to-[#0f1724] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Institutional Top Heading */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-coral-light">
                {activeTrack === 'STAFF_HUB'
                  ? 'ENTERPRISE EMPLOYEE GATEWAY • ISO-27001'
                  : 'CITIZEN SUPPORT OPERATIONS • DPDP CAT-07'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              {activeTrack === 'STAFF_HUB'
                ? 'Staff Operations & Employee Hub'
                : 'Customer Care & Triage Desk'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeTrack === 'STAFF_HUB'
                ? 'Audit hospital pricing benchmarks, perform LIS pathologist sign-offs, manage pharmacy stock, and monitor real-time cyber threats.'
                : 'Base-level problem resolution for payment reversals, doctor no-shows, and hospital document quarantine recoveries with strict non-clinical RBAC barriers.'}
            </p>
          </div>

          {/* DYNAMIC CREDENTIAL BADGE CARD */}
          <div className="my-6 relative z-10">
            {activeTrack === 'STAFF_HUB' ? (
              /* STAFF HUB SECURITY CREDENTIAL */
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900/95 via-[#1c293f] to-[#121c2e] border border-coral/30 p-5 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-coral/20 text-coral-light border border-coral/40 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-coral-light" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono tracking-wider text-slate-300 font-bold uppercase">
                        STAFF ID: EMP-STAFF-8841
                      </div>
                      <div className="text-xs font-bold text-white font-display">
                        Vikram Patel (Operations Lead)
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    TIER-2 CLEARANCE
                  </span>
                </div>

                {/* Staff Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] text-slate-400 uppercase">Hospital Tariffs</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">100% Valid</div>
                    <div className="text-[9px] text-slate-300">₹2,44,400 Reconciled</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] text-slate-400 uppercase">Cyber SOC Grid</div>
                    <div className="text-base font-bold text-cyan-400 mt-0.5">0 Leaks</div>
                    <div className="text-[9px] text-slate-300">CERT-In Active</div>
                  </div>
                </div>

                {/* Footer Telemetry */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400">Pathologist LIS Validated</span>
                  <span className="text-slate-300">Direct Admin Mail Channel</span>
                </div>
              </div>
            ) : (
              /* CUSTOMER CARE OPERATIONAL BADGE */
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900/95 via-[#231a2c] to-[#161224] border border-amber-500/30 p-5 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono tracking-wider text-amber-300 font-bold uppercase">
                        DESK AGENT: CC-AGNT-0104
                      </div>
                      <div className="text-xs font-bold text-white font-display">
                        Priya Nair (Triage Specialist)
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    HOTLINE ONLINE
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">FIRST RESPONSE SLA:</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      4.2 Mins (98% In SLA)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">PAYMENT REVERSAL:</span>
                    <span className="text-slate-200 font-medium font-mono">100% Instant Idempotent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">CLINICAL PRIVACY:</span>
                    <span className="text-coral-light font-bold font-mono">
                      CAT-07 HTTP 403 Enforced
                    </span>
                  </div>
                </div>

                {/* Footer Telemetry */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-amber-400">3 Open Triage Tickets</span>
                  <span className="text-slate-300">WebRTC Opus Telephony</span>
                </div>
              </div>
            )}
          </div>

          {/* Security / Statutory Seal */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-400 pt-3 border-t border-white/10">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>DPDP Act 2023 Compliant • Role-Based Access Control (RBAC) Hardened</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: EMPLOYEE & SUPPORT AUTHENTICATION CHANNELS */}
        {/* ===================================================================== */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Top Title & Tab Switcher */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl ${
                    activeTrack === 'STAFF_HUB'
                      ? 'bg-coral-soft text-coral-deep'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {activeTrack === 'STAFF_HUB' ? (
                    <Briefcase className="w-5 h-5 text-coral-deep" />
                  ) : (
                    <Headphones className="w-5 h-5 text-amber-700" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-navy">
                    {activeTrack === 'STAFF_HUB'
                      ? 'Staff Operations & Employee Hub Login'
                      : 'Customer Care & Triage Desk Login'}
                  </h4>
                  <p className="text-xs text-slate">
                    Select your operational employee or customer support workspace.
                  </p>
                </div>
              </div>
            </div>

            {/* Track Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-warm-light-grey border border-soft-grey text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTrack('STAFF_HUB');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                  activeTrack === 'STAFF_HUB'
                    ? 'bg-navy text-white shadow-md'
                    : 'text-slate hover:text-navy hover:bg-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Staff Operations Hub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTrack('CUSTOMER_CARE');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                  activeTrack === 'CUSTOMER_CARE'
                    ? 'bg-coral text-white shadow-md'
                    : 'text-slate hover:text-navy hover:bg-white'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Customer Care Desk</span>
              </button>
            </div>
          </div>

          {/* FORM FIELDS FOR STAFF HUB TRACK */}
          {activeTrack === 'STAFF_HUB' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Staff Member Employee ID / LIS Clearance
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OPERATIONS & LIS
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate mt-1">
                  Access to tariff audits, pathologist lab validation, and pharmacy stock control.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Enterprise SSO Token / Security Passphrase
                </label>
                <input
                  type="password"
                  value={staffPass}
                  onChange={(e) => setStaffPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                />
              </div>

              {/* Pre-Loaded Quick Capabilities Pill */}
              <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey text-xs text-slate space-y-1.5">
                <div className="flex items-center justify-between text-navy font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Operational Authorizations Active
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-soft-grey">
                    ALL 6 MODULES
                  </span>
                </div>
                <p className="text-[11px] text-slate leading-relaxed">
                  Doctor credential audits, hospital surgery/test tariffs, patient records archive, Cyber Threat SOC radar, pathologist lab sign-offs, and administrative mail escalation.
                </p>
              </div>
            </div>
          )}

          {/* FORM FIELDS FOR CUSTOMER CARE TRACK */}
          {activeTrack === 'CUSTOMER_CARE' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Support Representative ID / Console Login
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ccId}
                    onChange={(e) => setCcId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      SUPPORT TRIAGE
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate mt-1 flex items-center justify-between">
                  <span>Non-Clinical Customer Care Officer</span>
                  <span className="text-coral-deep font-bold font-mono">CAT-07 Shield Active</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Session Access Code / Station PIN
                </label>
                <input
                  type="password"
                  value={ccPass}
                  onChange={(e) => setCcPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                />
              </div>

              {/* CAT-07 Security Barrier Notice */}
              <div className="p-3.5 rounded-2xl bg-coral-soft/30 border border-coral/30 text-xs text-slate space-y-1.5">
                <div className="flex items-center justify-between text-navy font-bold">
                  <span className="flex items-center gap-1.5 text-coral-deep">
                    <ShieldAlert className="w-4 h-4 text-coral-deep" /> CAT-07 Mandatory RBAC Barrier Enforced
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-coral/30 text-coral-deep font-bold">
                    HTTP 403 LOCKED
                  </span>
                </div>
                <p className="text-[11px] text-slate leading-relaxed">
                  Support officers are strictly prohibited from viewing patient diagnoses, doctor notes, or medical records under the DPDP Act 2023. Operational problem resolution tools remain active.
                </p>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-soft-grey space-y-2">
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleExecuteLogin}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 ${
                activeTrack === 'STAFF_HUB'
                  ? 'bg-gradient-to-r from-navy via-slate-900 to-navy-light hover:from-slate-900 hover:to-navy'
                  : 'bg-gradient-to-r from-coral via-coral-deep to-rose-600 hover:from-coral-deep hover:to-rose-700'
              }`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span>
                    Verifying {activeTrack === 'STAFF_HUB' ? 'Employee Credentials' : 'Support Console Session'}...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {activeTrack === 'STAFF_HUB'
                      ? 'Authenticate & Enter Staff Operations Hub'
                      : 'Authorize Session & Enter Customer Care Desk'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate px-1">
              <span>Internal Employee IT Helpdesk: Ext #4040</span>
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

