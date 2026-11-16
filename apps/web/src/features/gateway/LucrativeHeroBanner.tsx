import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { EcgPulse } from '@/components/ui/EcgPulse';
import {
  Shield,
  Sparkles,
  Heart,
  Activity,
  Building2,
  Stethoscope,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  Radio,
  FileCheck,
  Lock,
  User,
  CreditCard,
  Bed,
  Check,
  Flame,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface LucrativeHeroBannerProps {
  onScrollToLogin?: (sectorId: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const LucrativeHeroBanner: React.FC<LucrativeHeroBannerProps> = ({
  onScrollToLogin,
  onOpenEmergencyModal,
}) => {
  const navigate = useNavigate();
  const [activeCharacterMsg, setActiveCharacterMsg] = useState<'doctor' | 'sentinel' | null>(null);
  const [sentinelMsgIndex, setSentinelMsgIndex] = useState(0);
  const [doctorMsgIndex, setDoctorMsgIndex] = useState(0);

  // Active Interactive Preview Tab
  const [activeTab, setActiveTab] = useState<'DOCTOR' | 'BEDS' | 'CYBER' | 'INSURANCE'>('DOCTOR');

  // Conversational Character Message Cycles
  const sentinelQuotes = [
    'DPDP Zero-Knowledge Guard Active. 100% of audit hashes verified on chain!',
    'SHA-256 Merkle root locked: 0 unauthorized record leaks detected.',
    'Super Admin Sovereign Tier-1: 5-member platform quota monitored.',
  ];

  const doctorQuotes = [
    'Unified Health Grid online. 250 ICU beds synced in real time. Instant OPD triage ready!',
    'ABDM Citizen Health Locker connected. Lead II rhythm at 72 BPM Normal Sinus.',
    'WHO Surgical Safety Checklist enforced across all 4 Operation Theatres.',
  ];

  // =========================================================================
  // TYPEWRITER ANIMATION ENGINE (Matches reference video)
  // =========================================================================
  const phrases = [
    'Unified Healthcare Ecosystem.',
    'Zero-Trust Hospital Network.',
    'National Health Intelligence Grid.',
    'Instant 108 Emergency Care.',
    'Ayushman Bharat Digital Core.',
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetPhrase = phrases[phraseIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && currentText === targetPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      const speed = isDeleting ? 30 : 65;
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? targetPhrase.substring(0, currentText.length - 1)
            : targetPhrase.substring(0, currentText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  const handleScrollToPortals = () => {
    sound.playClick();
    const el = document.getElementById('login-portals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onScrollToLogin?.('PROVIDER');
    }
  };

  const handleInstantLaunch = (path: string, role: string, userId: string) => {
    sound.playChime();
    api.setAuth(role, userId);
    navigate(path);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto pt-2 pb-8 px-4 sm:px-6 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. AMBIENT GLOW MESH & FLOATING BOKEH PARTICLES (From Video) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[880px] h-[480px] bg-gradient-to-b from-[#FFF0ED] via-[#FBF5F2] to-transparent blur-3xl rounded-full opacity-80" />
        <div className="absolute top-1/3 -left-28 w-80 h-80 bg-emerald-100/40 blur-3xl rounded-full" />
        <div className="absolute top-1/4 -right-28 w-80 h-80 bg-coral-soft/50 blur-3xl rounded-full" />

        {/* Floating Pastel Bokeh Dots */}
        <motion.div
          animate={{ y: [-8, 8, -8], x: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-16 left-[12%] w-3 h-3 rounded-full bg-purple-300/60 blur-[0.5px]"
        />
        <motion.div
          animate={{ y: [6, -6, 6], x: [3, -3, 3] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          className="absolute top-28 right-[15%] w-2.5 h-2.5 rounded-full bg-coral/40 blur-[0.5px]"
        />
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-20 left-[20%] w-3.5 h-3.5 rounded-full bg-amber-300/50 blur-[0.5px]"
        />
        <motion.div
          animate={{ y: [8, -8, 8], x: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-28 right-[22%] w-2 h-2 rounded-full bg-emerald-400/50 blur-[0.5px]"
        />
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          className="absolute top-44 left-[45%] w-2 h-2 rounded-full bg-rose-300/50 blur-[0.5px]"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING CHARACTER 1: AEGIS SENTINEL (LEFT) */}
      {/* ========================================================================= */}
      <div className="hidden xl:block absolute left-2 lg:left-6 top-8 z-20">
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: 'easeInOut',
          }}
          className="relative group cursor-pointer"
          onMouseEnter={() => {
            sound.playClick();
            setActiveCharacterMsg('sentinel');
          }}
          onMouseLeave={() => setActiveCharacterMsg(null)}
          onClick={() => {
            sound.playChime();
            setSentinelMsgIndex((prev) => (prev + 1) % sentinelQuotes.length);
            setActiveCharacterMsg('sentinel');
          }}
        >
          {/* Floating Dialogue Speech Bubble */}
          <AnimatePresence>
            {activeCharacterMsg === 'sentinel' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute -top-18 -left-4 w-56 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-300 shadow-xl text-left pointer-events-none z-30"
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-700 uppercase">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Aegis Sentinel v4.8
                  </span>
                  <span className="text-[9px] text-slate font-normal">Click to rotate tip</span>
                </div>
                <p className="text-[11px] font-medium text-navy leading-tight mt-1">
                  "{sentinelQuotes[sentinelMsgIndex]}"
                </p>
                <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-white border-b border-r border-emerald-300 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Character Illustration SVG */}
          <div className="relative w-36 h-44 flex flex-col items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-400/10 filter blur-xl animate-pulse" />
            <svg
              viewBox="0 0 140 160"
              className="w-full h-full drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient id="sentinelMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="shieldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6EE7B7" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <path d="M 50 45 L 35 25" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <circle cx="35" cy="25" r="4" fill="#10B981" />
              <path d="M 90 45 L 105 25" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <circle cx="105" cy="25" r="4" fill="#10B981" />

              <circle cx="70" cy="70" r="42" fill="url(#sentinelMetal)" stroke="#334155" strokeWidth="3" />
              <circle cx="70" cy="70" r="47" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin" style={{ transformOrigin: '70px 70px', animationDuration: '18s' }} />

              <rect x="42" y="58" width="56" height="20" rx="10" fill="#020617" stroke="#10B981" strokeWidth="1.5" />
              <ellipse cx="56" cy="68" rx="6" ry="4" fill="url(#eyeGlow)" />
              <ellipse cx="84" cy="68" rx="6" ry="4" fill="url(#eyeGlow)" />
              <path d="M 46 62 Q 70 60 94 62" stroke="#A7F3D0" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

              <polygon points="70,95 88,105 88,124 70,136 52,124 52,105" fill="url(#shieldCyan)" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 70 108 L 70 122 M 63 115 L 77 115" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

              <ellipse cx="70" cy="142" rx="18" ry="4" fill="#047857" opacity="0.6" />
              <ellipse cx="70" cy="148" rx="10" ry="2.5" fill="#34D399" className="animate-pulse" />
            </svg>

            <div className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-300 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-mono font-bold text-navy">Aegis Sentinel</span>
            </div>

            <motion.div
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                repeat: Infinity,
                duration: 5.5,
                ease: 'easeInOut',
              }}
              className="w-20 h-2 rounded-full bg-slate-800/30 filter blur-sm mt-1"
            />
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING CHARACTER 2: DR. NEXIS (RIGHT) */}
      {/* ========================================================================= */}
      <div className="hidden xl:block absolute right-2 lg:right-6 top-8 z-20">
        <motion.div
          animate={{
            y: [10, -10, 10],
            rotate: [2, -2, 2],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
            delay: 0.4,
          }}
          className="relative group cursor-pointer"
          onMouseEnter={() => {
            sound.playClick();
            setActiveCharacterMsg('doctor');
          }}
          onMouseLeave={() => setActiveCharacterMsg(null)}
          onClick={() => {
            sound.playChime();
            setDoctorMsgIndex((prev) => (prev + 1) % doctorQuotes.length);
            setActiveCharacterMsg('doctor');
          }}
        >
          {/* Floating Dialogue Speech Bubble */}
          <AnimatePresence>
            {activeCharacterMsg === 'doctor' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute -top-18 -right-4 w-60 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-coral/30 shadow-xl text-left pointer-events-none z-30"
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-coral-deep uppercase">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
                    Dr. Nexis (Chief AI RMP)
                  </span>
                  <span className="text-[9px] text-slate font-normal">Click to rotate tip</span>
                </div>
                <p className="text-[11px] font-medium text-navy leading-tight mt-1">
                  "{doctorQuotes[doctorMsgIndex]}"
                </p>
                <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white border-b border-r border-coral/30 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Character Illustration SVG */}
          <div className="relative w-36 h-44 flex flex-col items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-coral-glow/20 filter blur-xl animate-pulse" />
            <svg
              viewBox="0 0 140 160"
              className="w-full h-full drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F1F5F9" />
                </linearGradient>
                <linearGradient id="scrubsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>

              <circle cx="70" cy="46" r="24" fill="url(#hairGrad)" />
              <path d="M 48 44 Q 70 20 92 44 Q 85 28 70 28 Q 55 28 48 44 Z" fill="#1E293B" />
              <circle cx="70" cy="50" r="18" fill="#FBD5B5" />
              <ellipse cx="70" cy="34" rx="8" ry="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="70" cy="34" r="3" fill="#38BDF8" className="animate-ping" />

              <circle cx="64" cy="48" r="2.2" fill="#1E293B" />
              <circle cx="76" cy="48" r="2.2" fill="#1E293B" />
              <path d="M 66 56 Q 70 60 74 56" stroke="#C94132" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              <path d="M 58 64 Q 70 82 82 64" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="70" cy="80" r="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />

              <path d="M 44 86 L 54 68 L 86 68 L 96 86 L 98 138 L 42 138 Z" fill="url(#coatGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
              <polygon points="62,68 78,68 70,82" fill="url(#scrubsGrad)" />

              <rect x="84" y="94" width="28" height="38" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <path d="M 87 113 L 93 113 L 95 106 L 98 120 L 102 110 L 104 113 L 110 113" stroke="#34D399" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="85" cy="112" r="4" fill="#FBD5B5" />

              <rect x="50" y="86" width="10" height="13" rx="1.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
              <rect x="52" y="88" width="6" height="3" fill="#FF5B47" />
              <line x1="52" y1="94" x2="58" y2="94" stroke="#64748B" strokeWidth="1" />

              <ellipse cx="70" cy="144" rx="22" ry="5" fill="#FF5B47" opacity="0.4" />
              <ellipse cx="70" cy="149" rx="12" ry="3" fill="#FDA4AF" className="animate-pulse" />
            </svg>

            <div className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-coral/30 shadow-md">
              <Stethoscope className="w-3.5 h-3.5 text-coral" />
              <span className="text-[10px] font-mono font-bold text-navy">Dr. Nexis (AI MD)</span>
            </div>

            <motion.div
              animate={{
                scale: [1.2, 0.8, 1.2],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: 'easeInOut',
                delay: 0.4,
              }}
              className="w-20 h-2 rounded-full bg-slate-800/30 filter blur-sm mt-1"
            />
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CENTRAL CONTENT HERO STACK */}
      {/* ========================================================================= */}
      <div className="text-center max-w-4xl mx-auto space-y-5 relative z-10">
        {/* Mobile/Tablet Compact Floating Character Indicators */}
        <div className="xl:hidden flex items-center justify-center gap-2.5 pb-1">
          <button
            onClick={() => {
              sound.playClick();
              onScrollToLogin?.('ADMIN');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-300 shadow-xs text-[11px] font-bold text-navy hover:scale-105 transition-transform"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aegis Sentinel</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onScrollToLogin?.('PROVIDER');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-coral/30 shadow-xs text-[11px] font-bold text-navy hover:scale-105 transition-transform"
          >
            <Stethoscope className="w-3.5 h-3.5 text-coral" />
            <span>Dr. Nexis (AI MD)</span>
          </button>
        </div>

        {/* Top Centered Pill Badge (Matches `• INSTITUTIONAL-GRADE VOLATILITY SHIELD`) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0ED] border border-coral/25 shadow-2xs text-[11px] sm:text-xs font-bold text-coral-deep"
        >
          <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
          <span className="tracking-wide uppercase font-mono">
            INSTITUTIONAL-GRADE UNIFIED HEALTHCARE OS • ABDM VERIFIED
          </span>
        </motion.div>

        {/* Master Headline: Static Line 1 + Animated Typewriter Line 2 */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-[#1E293B] leading-[1.12]">
            The Most Powerful
          </h1>

          <div className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-coral leading-[1.15] min-h-[1.3em] flex items-center justify-center">
            <span>{currentText}</span>
            <span className="inline-block w-[3.5px] h-[0.9em] ml-1.5 bg-coral rounded-xs animate-pulse align-middle" />
          </div>
        </div>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-[#64748B] font-normal max-w-2xl mx-auto leading-relaxed"
        >
          SvasthNexis empowers hospital executives, doctors, and citizens to access 
          zero-trust medical records, live ICU telemetry, and instant 108 emergency dispatch.
        </motion.p>

        {/* ========================================================================= */}
        {/* 5. DUAL ACTION BUTTONS (Exact match to video buttons) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-1"
        >
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleScrollToPortals}
            className="px-6 py-3 rounded-full bg-white/95 border border-[#E2E8F0] hover:border-slate/40 text-[#1E293B] font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore Live Portals</span>
            <span className="text-slate group-hover:translate-y-0.5 transition-transform text-sm">↓</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onScrollToLogin?.('PATIENT')}
            className="px-7 py-3 rounded-full bg-coral hover:bg-coral-deep text-white font-bold text-xs sm:text-sm shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Launch Healthcare Gateway</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* ========================================================================= */}
        {/* 5B. INSTANT 1-CLICK ROLE SANDBOX TEST DRIVE (User-Friendly Game Changer) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="pt-2"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-soft-grey shadow-sm">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate px-2">
              ⚡ 1-Click Instant Sandbox:
            </span>

            <button
              onClick={() => handleInstantLaunch('/doctor', 'DOCTOR_RMP', 'usr-doc-sharma')}
              className="px-3 py-1 rounded-xl bg-emerald-soft hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doctor Practice</span>
            </button>

            <button
              onClick={() => handleInstantLaunch('/patient', 'PATIENT', 'usr-pat-001')}
              className="px-3 py-1 rounded-xl bg-coral-soft hover:bg-coral-soft/80 text-coral-deep text-xs font-bold border border-coral/30 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-coral" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => handleInstantLaunch('/hospital', 'HOSPITAL', 'usr-admin-citycare')}
              className="px-3 py-1 rounded-xl bg-navy/5 hover:bg-navy/10 text-navy text-xs font-bold border border-navy/20 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-navy" />
              <span>Hospital Authority</span>
            </button>

            <button
              onClick={() => handleInstantLaunch('/admin', 'SUPER_ADMIN', 'adm-001')}
              className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 shadow-2xs hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Executive Admin</span>
            </button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 6. THREE LARGE STAT METRICS (Exact layout & colors as in Video) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto pt-4 text-center border-t border-[#F1F5F9]/80"
        >
          {/* Stat 1: Registered Patients (Dark Charcoal / Navy) */}
          <div className="space-y-0.5">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#1E293B] tracking-tight tabular-nums">
              <AnimatedCounter value={12847} />
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#64748B]">
              Registered Patients
            </div>
          </div>

          {/* Stat 2: Connected Facilities (Vibrant Coral) */}
          <div className="space-y-0.5">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-coral tracking-tight tabular-nums">
              ₹4.82Cr
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#64748B]">
              Verified Settlements
            </div>
          </div>

          {/* Stat 3: Uptime Reliability (Vivid Emerald with live dot) */}
          <div className="space-y-0.5">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-600 tracking-tight tabular-nums flex items-center justify-center gap-1.5">
              <span>99.9%</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#64748B] flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry Uptime</span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 7. TRUST VERIFICATION ROW (Bottom row from video) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-[11px] sm:text-xs font-semibold text-[#64748B]"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Instant Guest Portal Exploration</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Multi-Tenant Workspaces</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-navy" />
            <span>DPDP Act 2023 & ISO 27001 Certified</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 8. INTERACTIVE LIVE CLINICAL SHOWCASE BENTO TABS (Professional Detailing) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="pt-4 text-left max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-5 border border-white/80 shadow-xl overflow-hidden bg-white/90 backdrop-blur-2xl">
            {/* Showcase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-soft-grey">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-coral block">
                  INTERACTIVE LIVE CLINICAL PREVIEW
                </span>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-navy">
                  Explore Enterprise Clinical Workflows
                </h3>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-warm-light-grey border border-soft-grey text-xs font-bold">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('DOCTOR');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'DOCTOR'
                      ? 'bg-white text-navy shadow-xs border border-soft-grey'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Doctor EHR</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('BEDS');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'BEDS'
                      ? 'bg-white text-navy shadow-xs border border-soft-grey'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <Bed className="w-3.5 h-3.5 text-navy" />
                  <span>250 Bed & ICU</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('CYBER');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'CYBER'
                      ? 'bg-white text-navy shadow-xs border border-soft-grey'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-coral" />
                  <span>Cyber SOC</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('INSURANCE');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'INSURANCE'
                      ? 'bg-white text-navy shadow-xs border border-soft-grey'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cashless TPA</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Doctor EHR Preview */}
            {activeTab === 'DOCTOR' && (
              <motion.div
                key="doctor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-navy">
                    <span>Patient Encounter</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-soft px-2 py-0.5 rounded-full">
                      ACTIVE OPD
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-coral-soft text-coral-deep font-bold flex items-center justify-center text-xs">
                      PT
                    </div>
                    <div>
                      <div className="text-xs font-bold text-navy">Verified Citizen Encounter</div>
                      <div className="text-[10px] font-mono text-slate">ABDM Universal EMR Linked</div>
                    </div>
                  </div>
                  <div className="pt-1 text-[11px] text-slate">
                    Chief Complaint: Flu symptoms, sore throat, hypertension follow-up.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-navy">
                    <span>Lead II ECG Telemetry</span>
                    <span className="text-[10px] font-mono text-coral font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
                      72 BPM
                    </span>
                  </div>
                  <div className="h-10 flex items-center justify-center bg-white rounded-xl p-1 border border-soft-grey">
                    <EcgPulse color="#FF5B47" width={220} height={28} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate">
                    <span>Normal Sinus Rhythm</span>
                    <span className="text-emerald-700 font-bold">BP: 120/80 mmHg</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-navy">
                      <span>AI Dual-View Analyzer</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="text-[11px] text-slate mt-1">
                      Automated FHIR extraction & diagnostic flags. Full doctor oversight required.
                    </div>
                  </div>
                  <button
                    onClick={() => handleInstantLaunch('/doctor', 'DOCTOR_RMP', 'usr-doc-sharma')}
                    className="w-full py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy/90 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Launch Clinical Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Bed Matrix Preview */}
            {activeTab === 'BEDS' && (
              <motion.div
                key="beds"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <div className="p-3.5 rounded-2xl bg-emerald-soft/60 border border-emerald-200">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase block">ICU Beds</span>
                  <div className="text-2xl font-display font-black text-emerald-950 mt-1">42 Available</div>
                  <span className="text-[10px] text-emerald-700">Ventilator Ready • 4.2 Bar O2</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-mono text-sky-800 font-bold uppercase block">Oxygen Beds</span>
                  <div className="text-2xl font-display font-black text-sky-950 mt-1">18 Available</div>
                  <span className="text-[10px] text-sky-700">Central High-Flow Pipeline</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-soft/60 border border-amber-200">
                  <span className="text-[10px] font-mono text-amber-800 font-bold uppercase block">General Ward</span>
                  <div className="text-2xl font-display font-black text-amber-950 mt-1">190 Available</div>
                  <span className="text-[10px] text-amber-700">Single & Twin Sharing</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] font-mono text-purple-800 font-bold uppercase block">Operation Theatres</span>
                  <div className="text-2xl font-display font-black text-purple-950 mt-1">4 Active OTs</div>
                  <span className="text-[10px] text-purple-700">WHO Checklist Enforced</span>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Cyber SOC Preview */}
            {activeTab === 'CYBER' && (
              <motion.div
                key="cyber"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey space-y-1">
                  <span className="text-[10px] font-mono text-slate font-bold uppercase block">Merkle Audit Root</span>
                  <div className="font-mono text-xs font-bold text-navy truncate">0x7f4e92a81b...c92d</div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Tamper-evident ledger locked
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey space-y-1">
                  <span className="text-[10px] font-mono text-slate font-bold uppercase block">DPDP Act 2023 Gate</span>
                  <div className="text-sm font-bold text-emerald-700">Zero Leaks Detected</div>
                  <div className="text-[10px] text-slate leading-tight pt-1">
                    Customer Care strictly blocked from clinical records (HTTP 403 CAT-07).
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-warm-light-grey/60 border border-soft-grey space-y-1">
                  <span className="text-[10px] font-mono text-slate font-bold uppercase block">CERT-In Compliance</span>
                  <div className="text-sm font-bold text-navy">6-Hour Disclosure SLA</div>
                  <div className="text-[10px] text-slate leading-tight pt-1">
                    Continuous SOC monitoring across 32 hospital nodes.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 4: Cashless Insurance Preview */}
            {activeTab === 'INSURANCE' && (
              <motion.div
                key="insurance"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 space-y-3"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-soft-grey font-bold text-navy text-center">
                    Medi Assist TPA
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-soft-grey font-bold text-navy text-center">
                    Paramount Health TPA
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-soft-grey font-bold text-navy text-center">
                    Star Health Insurance
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-soft-grey font-bold text-navy text-center">
                    Hospital Cashless Desk
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate px-1">
                  <span>Fast Cashless Pre-Auth with ICD-10 & tariff auto-snapshot</span>
                  <span className="text-emerald-700 font-bold">100% Cashless Settlements</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
