import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Building2,
  Stethoscope,
  ShieldCheck,
  Award,
  CheckCircle2,
  KeyRound,
  FileCheck2,
  Lock,
  ArrowRight,
  X,
  Activity,
  BedDouble,
  Clock,
  Sparkles,
  RefreshCw,
  QrCode,
  Users,
  Video,
  FileText,
  BadgeAlert,
  ChevronRight,
} from 'lucide-react';

interface ProviderAuthModalProps {
  isOpen: boolean;
  initialMode?: 'HOSPITAL' | 'DOCTOR';
  onClose: () => void;
  onSuccessLogin: (destination: string, role: string, loginId: string) => void;
}

export type ProviderTrack = 'HOSPITAL' | 'DOCTOR';

export const ProviderAuthModal: React.FC<ProviderAuthModalProps> = ({
  isOpen,
  initialMode = 'HOSPITAL',
  onClose,
  onSuccessLogin,
}) => {
  const [activeTrack, setActiveTrack] = useState<ProviderTrack>(initialMode);

  // Form States
  const [hospitalId, setHospitalId] = useState('usr-admin-citycare');
  const [hospitalPin, setHospitalPin] = useState('••••••••••••');
  const [doctorRegNumber, setDoctorRegNumber] = useState('KMC-2018-88419');
  const [doctorPin, setDoctorPin] = useState('••••••••••••');

  const [dscTokenAttached, setDscTokenAttached] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteLogin = () => {
    sound.playTelemetryBeep();
    setIsVerifying(true);

    setTimeout(() => {
      sound.playChime();
      setIsVerifying(false);
      if (activeTrack === 'HOSPITAL') {
        onSuccessLogin('/hospital', 'HOSPITAL', hospitalId);
      } else {
        onSuccessLogin('/doctor', 'DOCTOR_RMP', 'usr-doc-sharma');
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
        {/* LEFT COLUMN: OFFICIAL CLINICAL CREDENTIAL / ACCREDITATION BADGE */}
        {/* ===================================================================== */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#0c182a] via-[#10223b] to-[#0a1526] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Institutional Top Heading */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-300">
                {activeTrack === 'HOSPITAL'
                  ? 'NABH LEVEL-5 ACCREDITED • ABDM HFR'
                  : 'NATIONAL MEDICAL COMMISSION • NMC RMP'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              {activeTrack === 'HOSPITAL'
                ? 'Institutional Hospital Authority Portal'
                : 'Doctor Clinical Practice & Teleconsultation'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeTrack === 'HOSPITAL'
                ? 'Multi-speciality bed management, OT scheduling, tariff audits, doctor affiliations, and cashless TPA insurance desk.'
                : 'Cryptographically signed clinical encounters, SOAP notes, live OPD token queues, and AI-assisted diagnostic telemetry.'}
            </p>
          </div>

          {/* DYNAMIC CREDENTIAL BADGE CARD */}
          <div className="my-6 relative z-10">
            {activeTrack === 'HOSPITAL' ? (
              /* HOSPITAL AUTHORITY SMART ACCREDITATION CARD */
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900/95 via-[#0e2722] to-[#0d1d2c] border border-emerald-500/30 p-5 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono tracking-wider text-emerald-300 font-bold uppercase">
                        FACILITY ID: IN-KA-BLR-0042
                      </div>
                      <div className="text-xs font-bold text-white font-display">
                        CityCare Super-Speciality
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    NABH LEVEL-5
                  </span>
                </div>

                {/* Hospital Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] text-slate-400 uppercase">Inpatient Beds</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">248 / 250</div>
                    <div className="text-[9px] text-slate-300">42 Free (Ward/ICU)</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[9px] text-slate-400 uppercase">Surgical OTs</div>
                    <div className="text-base font-bold text-cyan-400 mt-0.5">4 Active</div>
                    <div className="text-[9px] text-slate-300">WHO Checklist Safe</div>
                  </div>
                </div>

                {/* Footer Telemetry */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400">32 Cashless TPAs Active</span>
                  <span className="text-slate-300">Trauma Level-1 Unit</span>
                </div>
              </div>
            ) : (
              /* DOCTOR RMP SMART LICENSE CARD */
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900/95 via-[#10243d] to-[#0f1f2e] border border-cyan-500/30 p-5 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono tracking-wider text-cyan-300 font-bold uppercase">
                        NMC RMP VERIFIED
                      </div>
                      <div className="text-xs font-bold text-white font-display">
                        Dr. Ananya Sharma, MD, DM
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    DSC VALID
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">REGISTRATION:</span>
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      KMC-2018-88419 (Karnataka)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">SPECIALITY:</span>
                    <span className="text-slate-200 font-medium">Interventional Cardiology</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">LIVE OPD QUEUE:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      Token #42 (Rahul Verma)
                    </span>
                  </div>
                </div>

                {/* Footer Telemetry */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400">Dual-Practice Active</span>
                  <span className="text-slate-300">18 Consults Today</span>
                </div>
              </div>
            )}
          </div>

          {/* Security / Statutory Seal */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-400 pt-3 border-t border-white/10">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>DPDP Act 2023 Compliant • FIPS-140-2 DSC Hardware Token Enabled</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: PROVIDER AUTHENTICATION CHANNELS */}
        {/* ===================================================================== */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Top Title & Tab Switcher */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl ${
                    activeTrack === 'HOSPITAL'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-cyan-50 text-cyan-700'
                  }`}
                >
                  {activeTrack === 'HOSPITAL' ? (
                    <Building2 className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <Stethoscope className="w-5 h-5 text-cyan-700" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-navy">
                    {activeTrack === 'HOSPITAL'
                      ? 'Hospital Authority Login'
                      : 'Doctor Clinical Workspace Login'}
                  </h4>
                  <p className="text-xs text-slate">
                    Select your clinical or administrative credential track.
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
                  setActiveTrack('HOSPITAL');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                  activeTrack === 'HOSPITAL'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-slate hover:text-navy hover:bg-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Hospital Authority</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTrack('DOCTOR');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                  activeTrack === 'DOCTOR'
                    ? 'bg-cyan-800 text-white shadow-md'
                    : 'text-slate hover:text-navy hover:bg-white'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Practice (RMP)</span>
              </button>
            </div>
          </div>

          {/* FORM FIELDS FOR HOSPITAL TRACK */}
          {activeTrack === 'HOSPITAL' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Hospital Facility Admin ID / HFR Identifier
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      CITYCARE SUPER-SPECIALITY
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate mt-1">
                  NABH accredited hospital administration account for CityCare Hospital.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Institutional Security Token / Master Passphrase
                </label>
                <input
                  type="password"
                  value={hospitalPin}
                  onChange={(e) => setHospitalPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all"
                />
              </div>

              {/* Pre-Loaded Quick Capabilities Pill */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate space-y-1.5">
                <div className="flex items-center justify-between text-emerald-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pre-Configured Executive Scope
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">
                    ALL WARDS ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Controls 250 inpatient beds, 4 operating suites, emergency trauma dispatch, hospital tariff overrides, and doctor verification rosters.
                </p>
              </div>
            </div>
          )}

          {/* FORM FIELDS FOR DOCTOR TRACK */}
          {activeTrack === 'DOCTOR' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Doctor National Medical Commission (NMC) Registration / ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={doctorRegNumber}
                    onChange={(e) => setDoctorRegNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-600 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      DR. ANANYA SHARMA
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate mt-1 flex items-center justify-between">
                  <span>Authorized Registered Medical Practitioner (RMP)</span>
                  <span className="text-cyan-800 font-bold font-mono">Speciality: Cardiology</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Digital Signature Certificate (DSC) Passphrase
                </label>
                <input
                  type="password"
                  value={doctorPin}
                  onChange={(e) => setDoctorPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-600 transition-all"
                />
              </div>

              {/* Hardware DSC Token Status */}
              <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-xs text-slate space-y-1.5">
                <div className="flex items-center justify-between text-cyan-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-cyan-700" /> Digital Signature Certificate (Class 3)
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-cyan-300 text-emerald-700 font-bold">
                    ✓ USB TOKEN CONNECTED
                  </span>
                </div>
                <p className="text-[11px] text-cyan-900 leading-relaxed">
                  Cryptographically signs clinical encounter notes, e-prescriptions, and diagnostic orders with legal validity under IT Act Section 5.
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
                activeTrack === 'HOSPITAL'
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900'
                  : 'bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 hover:from-cyan-800 hover:to-blue-950'
              }`}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span>
                    Verifying {activeTrack === 'HOSPITAL' ? 'Hospital NABH Credentials' : 'Doctor DSC Signature'}...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {activeTrack === 'HOSPITAL'
                      ? 'Authenticate & Enter Hospital Authority Portal'
                      : 'Authorize DSC & Enter Doctor Clinical Workspace'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate px-1">
              <span>National Medical Council Helpline: 1800-11-7788</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="text-slate hover:text-navy font-semibold underline"
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

