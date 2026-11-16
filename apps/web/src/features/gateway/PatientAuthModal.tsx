import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  ShieldCheck,
  UserCheck,
  CreditCard,
  QrCode,
  Sparkles,
  Smartphone,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Heart,
  Activity,
  FileText,
  Lock,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface PatientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (destination: string, role: string, loginId: string) => void;
}

export type PatientLoginTab = 'ABHA_ID' | 'MOBILE_OTP' | 'PASSKEY_DEMO';

export const PatientAuthModal: React.FC<PatientAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [activeTab, setActiveTab] = useState<PatientLoginTab>('ABHA_ID');

  // Form States
  const [abhaIdInput, setAbhaIdInput] = useState('91-4209-8812-3904');
  const [mobileInput, setMobileInput] = useState('9876543210');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['4', '2', '0', '9', '8', '8']);
  const [countdown, setCountdown] = useState(54);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (otpStep && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    sound.playClick();
    setAuthError(null);
    setOtpStep(true);
    setCountdown(60);
    sound.playTelemetryBeep();
  };

  const handlePreFillDemoOtp = () => {
    sound.playClick();
    setOtpCode(['4', '2', '0', '9', '8', '8']);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleExecuteAuth = () => {
    sound.playTelemetryBeep();
    setIsVerifying(true);
    setAuthError(null);

    setTimeout(() => {
      sound.playChime();
      setIsVerifying(false);
      onSuccessLogin('/patient', 'PATIENT', 'usr-pat-001');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md animate-fade-in">
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
        {/* LEFT COLUMN: OFFICIAL ABDM / ABHA DIGITAL SMART CARD PREVIEW */}
        {/* ===================================================================== */}
        <div className="md:w-5/12 bg-gradient-to-br from-navy via-slate-900 to-[#10192e] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          {/* Ambient Decorative Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-coral/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* National Digital Health Authority Header */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-coral-light">
                NATIONAL HEALTH AUTHORITY • ABDM
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              Ayushman Bharat Digital Health Locker
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authenticate via your 14-digit ABHA ID or Aadhaar-linked mobile for encrypted, zero-leak access to prescriptions, OPD tokens, and lab diagnostics.
            </p>
          </div>

          {/* HOLOGRAPHIC ABHA DIGITAL HEALTH CARD */}
          <div className="my-6 relative z-10">
            <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900/95 via-[#1a2238] to-[#12192c] border border-white/20 p-5 shadow-2xl overflow-hidden group">
              {/* Metallic Card Sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />

              {/* Card Top: Government Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {/* Gold Hologram Chip */}
                  <div className="w-8 h-6 rounded-md bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-200 border border-amber-500/50 shadow-inner flex items-center justify-center">
                    <div className="w-5 h-3 border border-amber-600/40 rounded-xs" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono tracking-wider text-slate-300 font-bold uppercase leading-none">
                      GOVERNMENT OF INDIA
                    </div>
                    <div className="text-[11px] font-bold text-white leading-none mt-0.5">
                      ABHA DIGITAL HEALTH CARD
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  ✓ VERIFIED
                </span>
              </div>

              {/* Patient Info Row */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Citizen Name</div>
                  <div className="text-base font-bold text-white font-display">Rahul Verma</div>
                  <div className="text-xs text-slate-300 mt-0.5 font-mono">
                    42y Male • Blood Group:{' '}
                    <span className="text-coral-light font-bold">O+ Positive</span>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div className="p-1.5 rounded-xl bg-white text-slate-950 shadow-md">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>

              {/* 14-Digit ABHA ID & Address */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">ABHA NUMBER:</span>
                  <span className="text-xs font-mono font-bold tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    91-4209-8812-3904
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-slate-400 font-mono">ABHA ADDRESS:</span>
                  <span className="font-mono text-slate-200">rahul.verma@abdm</span>
                </div>
              </div>

              {/* Bottom Telemetry Pill */}
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Activity className="w-3 h-3 text-emerald-400" /> 72 BPM Sinus
                </span>
                <span className="text-slate-400">72h Scoped Consent Active</span>
              </div>
            </div>
          </div>

          {/* Legal / Compliance Seal */}
          <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-400 pt-3 border-t border-white/10">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>DPDP Act 2023 End-to-End Encrypted • NHA Compliant M1/M2/M3 Gateway</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: CITIZEN AUTHENTICATION CHANNELS */}
        {/* ===================================================================== */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Top Title & Tab Switcher */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-coral-soft text-coral-deep">
                  <UserCheck className="w-5 h-5 text-coral-deep" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-navy">
                    Patient & Family Login
                  </h4>
                  <p className="text-xs text-slate">
                    Choose your preferred authentication method to enter the patient portal.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Channel Selector Pills */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-warm-light-grey border border-soft-grey text-xs font-bold">
              {[
                { id: 'ABHA_ID', label: '14-Digit ABHA', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: 'MOBILE_OTP', label: 'Mobile + OTP', icon: <Smartphone className="w-3.5 h-3.5" /> },
                { id: 'PASSKEY_DEMO', label: '1-Tap Passkey', icon: <Fingerprint className="w-3.5 h-3.5" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(t.id as PatientLoginTab);
                    setAuthError(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
                    activeTab === t.id
                      ? 'bg-navy text-white shadow-md'
                      : 'text-slate hover:text-navy hover:bg-white'
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: 14-DIGIT ABHA ID */}
          {activeTab === 'ABHA_ID' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  14-Digit ABHA Number or ABHA Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={abhaIdInput}
                    onChange={(e) => setAbhaIdInput(e.target.value)}
                    placeholder="e.g. 91-4209-8812-3904 or rahul.verma@abdm"
                    className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ABDM LINKED
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate mt-1 flex items-center justify-between">
                  <span>Enter your National Health ID card number</span>
                  <button
                    type="button"
                    onClick={() => setAbhaIdInput('rahul.verma@abdm')}
                    className="text-coral-deep font-semibold hover:underline"
                  >
                    Switch to rahul.verma@abdm
                  </button>
                </p>
              </div>

              {!otpStep ? (
                <div className="p-4 rounded-2xl bg-warm-light-grey/60 border border-soft-grey space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-navy">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Aadhaar-Linked Verification Protocol</span>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">
                    A secure 6-digit one-time password (OTP) will be dispatched to your UIDAI registered mobile number ending in <strong>•••210</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 rounded-xl bg-navy hover:bg-navy/90 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Aadhaar OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-coral-soft/30 border border-coral/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-coral-deep" /> Enter 6-Digit OTP Code
                    </span>
                    <span className="text-[10px] font-mono text-coral-deep font-bold bg-white px-2 py-0.5 rounded border border-coral/30">
                      ⏱ {countdown > 0 ? `${countdown}s Remaining` : 'Expired'}
                    </span>
                  </div>

                  {/* 6 OTP Input Boxes */}
                  <div className="flex items-center justify-between gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-soft-grey bg-white text-navy focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral shadow-2xs"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={handlePreFillDemoOtp}
                      className="text-[11px] font-bold text-coral-deep hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" /> 1-Tap Fill Test OTP (420988)
                    </button>

                    <button
                      type="button"
                      disabled={countdown > 0}
                      onClick={handleSendOtp}
                      className={`text-[11px] font-semibold ${
                        countdown > 0 ? 'text-slate/60 cursor-not-allowed' : 'text-navy hover:underline'
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MOBILE NUMBER + OTP */}
          {activeTab === 'MOBILE_OTP' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Registered Indian Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-3 rounded-xl border border-soft-grey bg-warm-light-grey text-xs font-mono font-bold text-navy">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-soft-grey bg-warm-light-grey/40 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate mt-1">
                  We'll verify if your mobile is linked to an existing ABHA health record.
                </p>
              </div>

              {!otpStep ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 rounded-xl bg-navy hover:bg-navy/90 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Dispatch SMS Login Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-coral-soft/30 border border-coral/30 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-coral-deep" /> SMS OTP Verified
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ Instant Delivery
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-mob-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-soft-grey bg-white text-navy focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral shadow-2xs"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handlePreFillDemoOtp}
                    className="text-[11px] font-bold text-coral-deep hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" /> Pre-fill Verification OTP (420988)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 1-TAP PASSKEY / BIOMETRIC DEMO (RAHUL VERMA) */}
          {activeTab === 'PASSKEY_DEMO' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-warm-light-grey to-white border border-soft-grey space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-coral text-white flex items-center justify-center shadow-md">
                    <Fingerprint className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-navy">FIDO2 / Biometric Passkey</div>
                    <div className="text-[10px] text-slate">Device Hardware Token Authenticated</div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  PASSKEY READY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-soft-grey space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate">Profile:</span>
                  <strong className="text-navy">Rahul Verma (42y Male)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate">ABHA Card:</span>
                  <span className="font-mono text-emerald-700 font-bold">91-4209-8812-3904</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate">Consent Policy:</span>
                  <span className="text-slate font-medium">72-Hour Scoped Health Locker</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate">Primary Doctor:</span>
                  <span className="text-navy font-medium">Dr. Ananya Sharma (Cardiology)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate leading-relaxed">
                One-tap biometric passkey instantly authorizes access without requiring SMS delivery or manual OTP entry. Ideal for high-speed evaluation.
              </p>
            </div>
          )}

          {/* Action Footer: Login Button */}
          <div className="pt-4 border-t border-soft-grey space-y-2">
            <button
              type="button"
              disabled={isVerifying}
              onClick={handleExecuteAuth}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-coral via-coral-deep to-rose-600 hover:from-coral-deep hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span>Verifying ABHA Security Credentials...</span>
                </>
              ) : (
                <>
                  <span>Verify Credentials & Enter Patient Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate px-1">
              <span>Need help? Call National Health Toll-Free 14442</span>
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

