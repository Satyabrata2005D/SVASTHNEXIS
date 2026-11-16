import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { MedicalParticles } from '@/components/ui/MedicalParticles';
import { TiltCard } from '@/components/ui/TiltCard';
import { InteractiveCommandCenter } from './InteractiveCommandCenter';
import { HolographicCore3D } from './HolographicCore3D';
import { LucrativeHeroBanner } from './LucrativeHeroBanner';
import { HospitalNetworkTrustBar } from './HospitalNetworkTrustBar';
import { EnterpriseArchitectureSection } from './EnterpriseArchitectureSection';
import { HealthcareFAQSection } from './HealthcareFAQSection';
import { EnterpriseFooter } from './EnterpriseFooter';
import { FloatingGatewayDock } from './FloatingGatewayDock';
import { OmniSearchModal } from './OmniSearchModal';
import { EmergencyDispatchModal } from './EmergencyDispatchModal';
import { PatientAuthModal } from './PatientAuthModal';
import { ProviderAuthModal } from './ProviderAuthModal';
import { OfficeWorkerAuthModal } from './OfficeWorkerAuthModal';
import { AdminAuthModal } from './AdminAuthModal';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  ShieldAlert,
  Crown,
  Key,
  Users,
  Building2,
  BedDouble,
  Stethoscope,
  UserCheck,
  HeartHandshake,
  Briefcase,
  Headphones,
  DollarSign,
  FlaskConical,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Activity,
  PhoneCall,
  Video,
  CreditCard,
  FileText,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Heart,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  Search,
} from 'lucide-react';

export const LoginGateway: React.FC = () => {
  const navigate = useNavigate();

  // Search & Emergency Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Global Keyboard Shortcut: ⌘K to open Omni-Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playClick();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  // Active Login Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Audio state
  const [isAudioMuted, setIsAudioMuted] = useState(sound.isMuted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsAudioMuted(muted);
  };

  // Sub-mode selectors for Section 2 and Section 3
  const [officeWorkerSubMode, setOfficeWorkerSubMode] = useState<'STAFF_HUB' | 'CUSTOMER_CARE'>('STAFF_HUB');
  const [providerSubMode, setProviderSubMode] = useState<'HOSPITAL' | 'DOCTOR'>('HOSPITAL');

  const handleOpenLogin = (mode: string, defaultId: string) => {
    sound.playClick();
    if (mode === 'ADMIN') {
      setIsAdminModalOpen(true);
      return;
    }
    if (mode === 'PATIENT') {
      setIsPatientModalOpen(true);
      return;
    }
    if (mode === 'HOSPITAL' || mode === 'DOCTOR') {
      setProviderSubMode(mode as 'HOSPITAL' | 'DOCTOR');
      setIsProviderModalOpen(true);
      return;
    }
    if (mode === 'STAFF_HUB' || mode === 'CUSTOMER_CARE') {
      setOfficeWorkerSubMode(mode as 'STAFF_HUB' | 'CUSTOMER_CARE');
      setIsOfficeModalOpen(true);
      return;
    }
    setActiveModal(mode);
    setLoginId(defaultId);
    setLoginPassword('••••••••••••');
  };

  const handleExecuteLogin = (targetPath: string, role: string, userId: string) => {
    sound.playChime();
    api.setAuth(role, userId);
    setActiveModal(null);
    setIsAdminModalOpen(false);
    setIsPatientModalOpen(false);
    setIsProviderModalOpen(false);
    setIsOfficeModalOpen(false);
    navigate(targetPath);
  };

  const handleSelectFromCore = (sectionId: string) => {
    if (sectionId === 'ADMIN') {
      handleOpenLogin('ADMIN', 'adm-001');
    } else if (sectionId === 'OFFICE' || sectionId === 'STAFF_HUB') {
      handleOpenLogin(officeWorkerSubMode, officeWorkerSubMode === 'STAFF_HUB' ? 'usr-staff-lab' : 'usr-cc-001');
    } else if (sectionId === 'PROVIDER' || sectionId === 'HOSPITAL') {
      handleOpenLogin(providerSubMode, providerSubMode === 'HOSPITAL' ? 'usr-admin-citycare' : 'usr-doc-sharma');
    } else if (sectionId === 'PATIENT') {
      handleOpenLogin('PATIENT', 'usr-pat-001');
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory text-navy flex flex-col justify-between selection:bg-coral-soft selection:text-coral-deep relative overflow-hidden">
      {/* Interactive Medical Nanoparticle Network Canvas */}
      <MedicalParticles density={45} className="opacity-70" />

      {/* Dynamic Animated Ambient Glow Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-coral/15 rounded-full blur-3xl animate-blob pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[34rem] h-[34rem] bg-emerald-500/10 rounded-full blur-3xl animate-blob-delayed pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-10 w-[30rem] h-[30rem] bg-navy/10 rounded-full blur-3xl animate-blob pointer-events-none -z-10" />

      {/* Top Banner Navigation with Live ECG Heartbeat & Audio HUD */}
      <header className="bg-white/85 backdrop-blur-xl border-b border-soft-grey sticky top-0 z-30 px-6 py-3.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sound.playClick()}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-coral to-coral-deep flex items-center justify-center text-white shadow-md font-display font-black text-xl tracking-tight cursor-pointer"
            >
              S
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-navy">
                  SVASTHNEXIS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-coral-soft text-coral-deep border border-coral/30">
                  Total Hospital Management System
                </span>
              </div>
              <p className="text-[11px] text-slate font-medium">
                Unified 4-Section Healthcare Ecosystem • ABDM Verified
              </p>
            </div>
          </div>

          {/* Animated Clinical Status, Audio Toggle & Emergency Badge */}
          <div className="flex items-center gap-4">
            {/* Omni-Search Spotlight Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setIsSearchOpen(true);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-light-grey/90 border border-soft-grey hover:border-slate/40 text-xs font-semibold text-slate transition-all shadow-2xs hover:text-navy cursor-pointer"
              title="Global directory search (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate" />
              <span>Search directory...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.2 bg-white rounded border border-soft-grey shadow-2xs font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Audio Feedback Toggle */}
            <button
              onClick={toggleSound}
              title={isAudioMuted ? 'Turn on clinical audio telemetry' : 'Mute clinical audio'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                isAudioMuted
                  ? 'bg-warm-light-grey text-slate border-soft-grey hover:text-navy'
                  : 'bg-emerald-soft text-emerald-800 border-emerald-300 shadow-2xs'
              }`}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
              <span className="text-[10px] uppercase font-mono font-bold">
                {isAudioMuted ? 'AUDIO OFF' : 'AUDIO ON'}
              </span>
            </button>

            {/* Live ECG Scanner Animation */}
            <div
              onClick={() => sound.playTelemetryBeep()}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-light-grey/90 border border-soft-grey cursor-pointer hover:border-coral transition-colors"
              title="Click to probe heart telemetry"
            >
              <Heart className="w-4 h-4 text-coral animate-pulse" />
              <EcgPulse color="#FF5B47" width={110} height={22} />
              <span className="text-[10px] font-mono font-bold text-slate">72 BPM NORMAL</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>National Health Grid LIVE</span>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sound.playChime();
                setIsEmergencyOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-coral-soft border border-coral/30 text-coral-deep text-xs font-bold shadow-2xs cursor-pointer hover:bg-coral hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>EMERGENCY 108</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* High-Tech National Health Telemetry Ribbon */}
      <div className="bg-[#171C2C] text-white px-6 py-1.5 text-[11px] font-mono border-b border-white/10 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto whitespace-nowrap gap-6 no-scrollbar">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ABDM GATEWAY: OPERATIONAL
            </span>
            <span className="text-white/30">•</span>
            <span className="text-slate-300">
              MERKLE BLOCK: <strong className="text-white font-mono">#184,924 (SHA-256)</strong>
            </span>
            <span className="text-white/30">•</span>
            <span className="text-slate-300">
              ICU NETWORK: <strong className="text-emerald-400">42 BEDS FREE</strong>
            </span>
            <span className="text-white/30">•</span>
            <span className="text-slate-300">
              EDGE LATENCY: <strong className="text-amber-400">24ms</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-coral font-bold flex items-center gap-1">
              <Shield className="w-3 h-3 text-coral" /> DPDP ZERO-LEAK ACTIVE
            </span>
            <span className="text-white/30">•</span>
            <button
              onClick={() => {
                sound.playClick();
                setIsSearchOpen(true);
              }}
              className="text-white/80 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Press ⌘K to search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Hero */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full space-y-12 relative z-10">
        {/* Lucrative Animated Hero with Floating Characters & Live Glassmorphic KPIs */}
        <LucrativeHeroBanner
          onScrollToLogin={handleSelectFromCore}
          onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
        />

        {/* Hospital Network Trust Bar & National Accreditations */}
        <HospitalNetworkTrustBar />

        {/* 4 HEALTHCARE SECTORS QUICK LAUNCH */}
        <motion.div
          id="login-portals"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative scroll-mt-6"
        >
          <div className="text-center mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-soft-grey shadow-2xs">
              ✦ Unified Healthcare Access Portals • Select Sector to Launch ✦
            </span>
          </div>
          <HolographicCore3D onSelectSection={handleSelectFromCore} />
        </motion.div>

        {/* 4 PRIMARY LOGIN SECTIONS (3D TILT CARDS WITH DYNAMIC SPOTLIGHT) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* ========================================================================= */}
          {/* SECTION 1: ADMIN LOGIN MODE */}
          {/* ========================================================================= */}
          <TiltCard
            glowColor="rgba(245, 158, 11, 0.28)"
            borderColor="rgba(23, 28, 44, 0.5)"
            className="glass-card flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-500/15 via-coral/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-coral to-navy text-white flex items-center justify-center shadow-glow-coral"
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    SOVEREIGN TIER-1
                  </span>
                  <Badge variant="critical">MAX 5 ADMINS</Badge>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" /> SECTION 01
                </span>
                <h3 className="text-xl font-display font-bold text-navy mt-0.5">
                  ADMIN LOGIN
                </h3>
                <p className="text-xs text-slate mt-1 leading-relaxed">
                  Platform-wide executive governance. Controls everything on the website.
                </p>
                <div className="p-2.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between text-[11px] mt-2">
                  <span className="text-slate font-medium">Platform Quota</span>
                  <span className="font-mono font-bold text-amber-800 bg-amber-soft px-2 py-0.5 rounded-md border border-amber-300/50">2/5 Active Seats</span>
                </div>
              </div>

              {/* 3 Governance Control Pills */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold text-slate">
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  5-Seat Quota
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  7-Day Safeguard
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey text-amber-800">
                  Merkle Audit
                </span>
              </div>

              {/* Detailed Governance Feature Rows */}
              <div className="space-y-1.5 pt-2 border-t border-soft-grey text-xs text-slate">
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Strict 5-Member Platform Quota (ADR-001 Constitution)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-coral shrink-0" />
                  <span>Mandatory 7-Day Cooling-Off Period on Admin Removal</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-navy shrink-0" />
                  <span>SHA-256 Merkle Ledger across 34 Hospitals & Settlements</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <Button
                variant="primary"
                className="w-full justify-between bg-gradient-to-r from-navy via-slate-900 to-navy-light hover:from-slate-900 hover:to-navy text-white shimmer-button shadow-md"
                onClick={() => {
                  sound.playClick();
                  setIsAdminModalOpen(true);
                }}
              >
                <span>Enter Sovereign Admin Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                type="button"
                onClick={() => handleExecuteLogin('/admin', 'SUPER_ADMIN', 'adm-001')}
                className="w-full text-center text-[10px] font-bold text-slate hover:text-navy hover:underline transition-colors py-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>⚡ Instant 1-Click Launch</span>
              </button>
            </div>
          </TiltCard>

          {/* ========================================================================= */}
          {/* SECTION 2: OFFICE WORKERS LOGIN MODE */}
          {/* ========================================================================= */}
          <TiltCard
            glowColor="rgba(255, 91, 71, 0.28)"
            borderColor="rgba(255, 91, 71, 0.45)"
            className="glass-card flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-coral/15 via-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-coral to-amber-600 text-white flex items-center justify-center shadow-glow-coral"
                >
                  {officeWorkerSubMode === 'STAFF_HUB' ? (
                    <Briefcase className="w-6 h-6 text-white" />
                  ) : (
                    <Headphones className="w-6 h-6 text-white" />
                  )}
                </motion.div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    {officeWorkerSubMode === 'STAFF_HUB' ? 'TIER-2 CLEARANCE' : 'HOTLINE READY'}
                  </span>
                  <Badge variant="warning">OFFICE WORKERS</Badge>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-coral font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-coral" /> SECTION 02
                </span>
                <h3 className="text-xl font-display font-bold text-navy mt-0.5">
                  OFFICE WORKERS LOGIN
                </h3>
                <p className="text-xs text-slate mt-1 leading-relaxed">
                  Operational employee management, hospital cost audits & customer support.
                </p>
              </div>

              {/* Sub-mode Tab Switcher */}
              <div className="p-1 rounded-xl bg-warm-light-grey border border-soft-grey flex text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setOfficeWorkerSubMode('STAFF_HUB');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    officeWorkerSubMode === 'STAFF_HUB'
                      ? 'bg-white text-navy shadow-xs border border-soft-grey font-extrabold'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-navy" />
                  <span>Staff Portal / Hub</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setOfficeWorkerSubMode('CUSTOMER_CARE');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    officeWorkerSubMode === 'CUSTOMER_CARE'
                      ? 'bg-white text-coral-deep shadow-xs border border-soft-grey font-extrabold'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-coral-deep" />
                  <span>Customer Care</span>
                </button>
              </div>

              {/* Operations SLA status */}
              <div className="p-2.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between text-[11px] mt-2">
                <span className="text-slate font-medium">Operations SLA</span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-soft px-2 py-0.5 rounded-md border border-emerald-300/50">100% Zero-Leak</span>
              </div>

              {/* 3 Operational Access Modes Pill */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold text-slate">
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  {officeWorkerSubMode === 'STAFF_HUB' ? 'LIS & Pharmacy' : 'Live Telephony'}
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  {officeWorkerSubMode === 'STAFF_HUB' ? 'Tariff Auditor' : 'Instant Refund'}
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey text-coral-deep">
                  {officeWorkerSubMode === 'STAFF_HUB' ? 'Cyber SOC' : 'CAT-07 Shield'}
                </span>
              </div>

              {/* Feature bullet items */}
              {officeWorkerSubMode === 'STAFF_HUB' ? (
                <div className="space-y-1.5 pt-2 border-t border-soft-grey text-xs text-slate">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-coral shrink-0" />
                    <span>Pathologist LIS Digital Sign-Off & Pharmacy Stock (CAT-10)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-navy shrink-0" />
                    <span>Cyber SOC Radar & Tamper-Evident SHA-256 Block Chain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hospital Tariff Benchmark Studio & Direct Admin Escalation</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2 border-t border-soft-grey text-xs text-slate">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-coral shrink-0" />
                    <span>48kHz WebRTC Telephony Desk with Live Audio Waveforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Idempotent Payment Reversals & Doctor No-Show Triage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>CAT-07 Mandatory RBAC Barrier: HTTP 403 Clinical Chart Lock</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 pt-0 space-y-2">
              <Button
                variant="primary"
                className={`w-full justify-between text-white shimmer-button shadow-md ${
                  officeWorkerSubMode === 'STAFF_HUB'
                    ? 'bg-gradient-to-r from-navy via-slate-900 to-navy-light hover:from-slate-900 hover:to-navy'
                    : 'bg-gradient-to-r from-coral via-coral-deep to-rose-600 hover:from-coral-deep hover:to-rose-700'
                }`}
                onClick={() => {
                  sound.playClick();
                  setIsOfficeModalOpen(true);
                }}
              >
                <span>
                  {officeWorkerSubMode === 'STAFF_HUB'
                    ? 'Enter Staff Operations Hub'
                    : 'Enter Customer Care Desk'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <button
                type="button"
                onClick={() =>
                  officeWorkerSubMode === 'STAFF_HUB'
                    ? handleExecuteLogin('/staff', 'STAFF_HUB', 'usr-staff-lab')
                    : handleExecuteLogin('/support', 'CUSTOMER_CARE', 'usr-cc-001')
                }
                className="w-full text-center text-[10px] font-bold text-slate hover:text-navy hover:underline transition-colors py-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>⚡ Instant 1-Click Launch</span>
              </button>
            </div>
          </TiltCard>

          {/* ========================================================================= */}
          {/* SECTION 3: HOSPITAL AND DOCTOR LOGIN MODE */}
          {/* ========================================================================= */}
          <TiltCard
            glowColor="rgba(16, 185, 129, 0.28)"
            borderColor="rgba(16, 185, 129, 0.45)"
            className="glass-card flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-emerald-500/15 via-teal-600/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-glow-emerald"
                >
                  {providerSubMode === 'HOSPITAL' ? (
                    <Building2 className="w-6 h-6 text-white" />
                  ) : (
                    <Stethoscope className="w-6 h-6 text-white" />
                  )}
                </motion.div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {providerSubMode === 'HOSPITAL' ? 'NABH LEVEL-5' : 'NMC RMP VERIFIED'}
                  </span>
                  <Badge variant="success">HOSPITAL & DR</Badge>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" /> SECTION 03
                </span>
                <h3 className="text-xl font-display font-bold text-navy mt-0.5">
                  HOSPITAL & DOCTOR
                </h3>
                <p className="text-xs text-slate mt-1 leading-relaxed">
                  Institutional hospital administration & doctor clinical practice workspace.
                </p>
              </div>

              {/* Sub-mode Tab Switcher */}
              <div className="p-1 rounded-xl bg-warm-light-grey border border-soft-grey flex text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setProviderSubMode('HOSPITAL');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    providerSubMode === 'HOSPITAL'
                      ? 'bg-white text-emerald-800 shadow-xs border border-soft-grey font-extrabold'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hospital Authority</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setProviderSubMode('DOCTOR');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    providerSubMode === 'DOCTOR'
                      ? 'bg-white text-cyan-800 shadow-xs border border-soft-grey font-extrabold'
                      : 'text-slate hover:text-navy'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Doctor Practice</span>
                </button>
              </div>

              {/* Live OPD Queue status */}
              <div className="p-2.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between text-[11px] mt-2">
                <span className="text-slate font-medium">Live OPD Queue</span>
                <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-300/50">Token #42 Active</span>
              </div>

              {/* 3 Clinical Access Modes Pill */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold text-slate">
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  {providerSubMode === 'HOSPITAL' ? '250 Beds/ICU' : 'OPD Queue'}
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  {providerSubMode === 'HOSPITAL' ? '32 TPAs Active' : 'AI Copilot'}
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey text-emerald-700">
                  {providerSubMode === 'HOSPITAL' ? 'WHO Checklist' : 'DSC Signed'}
                </span>
              </div>

              {/* Feature bullet items */}
              {providerSubMode === 'HOSPITAL' ? (
                <div className="space-y-1.5 pt-2 border-t border-soft-grey text-xs text-slate">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Inpatient Bed Lifecycle & Emergency Trauma OT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Hospital Tariffs, Cashless Pre-Auth & TPA Desk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-navy shrink-0" />
                    <span>Doctor Verification Roster & Department Quotas</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2 border-t border-soft-grey text-xs text-slate">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Immutable FHIR R4 SOAP notes with DSC signature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>AI Clinical Copilot & ECG anomaly detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>WebRTC HD Teleconsultation & e-Prescription</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 pt-0 space-y-2">
              <Button
                variant="primary"
                className={`w-full justify-between text-white shimmer-button shadow-md ${
                  providerSubMode === 'HOSPITAL'
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900'
                    : 'bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 hover:from-cyan-800 hover:to-blue-950'
                }`}
                onClick={() => {
                  sound.playClick();
                  setIsProviderModalOpen(true);
                }}
              >
                <span>
                  {providerSubMode === 'HOSPITAL'
                    ? 'Enter Hospital Authority Portal'
                    : 'Enter Doctor Clinical Workspace'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <button
                type="button"
                onClick={() =>
                  providerSubMode === 'HOSPITAL'
                    ? handleExecuteLogin('/hospital', 'HOSPITAL', 'usr-admin-citycare')
                    : handleExecuteLogin('/doctor', 'DOCTOR_RMP', 'usr-doc-sharma')
                }
                className="w-full text-center text-[10px] font-bold text-slate hover:text-navy hover:underline transition-colors py-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>⚡ Instant 1-Click Launch</span>
              </button>
            </div>
          </TiltCard>

          {/* ========================================================================= */}
          {/* SECTION 4: PATIENT LOGIN MODE */}
          {/* ========================================================================= */}
          <TiltCard
            glowColor="rgba(255, 91, 71, 0.28)"
            borderColor="rgba(255, 91, 71, 0.45)"
            className="glass-card flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-coral-deep/15 via-rose-500/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-coral to-rose-600 text-white flex items-center justify-center shadow-glow-coral"
                >
                  <UserCheck className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> ABDM VERIFIED
                  </span>
                  <Badge variant="info">PATIENT & FAMILY</Badge>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-coral font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3" /> SECTION 04
                </span>
                <h3 className="text-xl font-display font-bold text-navy mt-0.5">
                  PATIENT LOGIN
                </h3>
                <p className="text-xs text-slate mt-1 leading-relaxed">
                  Personal health locker, symptom-based doctor booking & teleconsultation.
                </p>
              </div>

              {/* ABHA Vitals Sync status */}
              <div className="p-2.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between text-[11px] mt-2">
                <span className="text-slate font-medium">ABHA Vitals Sync</span>
                <span className="font-mono font-bold text-coral-deep bg-coral-soft px-2 py-0.5 rounded-md border border-coral/30">72 BPM • Normotensive</span>
              </div>

              {/* 3 Citizen Access Modes Pill */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono font-bold text-slate">
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  14-Digit ABHA
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey">
                  Mobile OTP
                </span>
                <span className="py-1 px-1.5 rounded-lg bg-warm-light-grey border border-soft-grey text-coral-deep">
                  1-Tap Passkey
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-soft-grey text-xs text-slate">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-coral shrink-0" />
                  <span>Upload & store past prescriptions/reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>AI Symptom Agent finds best doctor/dept</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-navy shrink-0" />
                  <span>Cash, UPI, Card, Net Banking & Wallets</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2">
              <Button
                variant="primary"
                className="w-full justify-between bg-gradient-to-r from-coral to-coral-deep hover:from-coral-deep hover:to-rose-600 text-white shimmer-button shadow-md"
                onClick={() => {
                  sound.playClick();
                  setIsPatientModalOpen(true);
                }}
              >
                <span>Enter Patient Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                type="button"
                onClick={() => handleExecuteLogin('/patient', 'PATIENT', 'usr-pat-001')}
                className="w-full text-center text-[10px] font-bold text-slate hover:text-navy hover:underline transition-colors py-1 flex items-center justify-center gap-1"
              >
                <span>⚡ Instant 1-Click Launch</span>
              </button>
            </div>
          </TiltCard>
        </motion.div>

        {/* ========================================================================= */}
        {/* INTERACTIVE CLINICAL COMMAND CENTER SHOWCASE (BEDS, AI, SOC, TELEHEALTH) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InteractiveCommandCenter />
        </motion.div>

        {/* Feature Overview Strip with Animated Hover Glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card rounded-2xl border border-soft-grey p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-warm-light-grey text-navy shrink-0 shadow-2xs">
              <Shield className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                India DPDP & ABDM Compliant
              </h4>
              <p className="text-xs text-slate mt-1 leading-relaxed">
                Consent gates guarantee patient data privacy. Doctors can only see past documents if explicit consent is granted.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-warm-light-grey text-navy shrink-0 shadow-2xs">
              <Video className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                Hybrid Physical & Online Care
              </h4>
              <p className="text-xs text-slate mt-1 leading-relaxed">
                Seamless scheduling for physical hospital visits or recorded Zoom/Meet sessions with downloadable video for patient safety.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-warm-light-grey text-navy shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                AI Clinical & Patient Assistant
              </h4>
              <p className="text-xs text-slate mt-1 leading-relaxed">
                Patients receive intelligent symptom-to-specialist routing; doctors get dual-view AI report highlights and automated SOAP notes.
              </p>
            </div>
          </div>
        </motion.div>
        {/* Enterprise Architecture & Compliance Matrix */}
        <EnterpriseArchitectureSection />

        {/* Interactive FAQ & Operational Inquiries Accordion */}
        <HealthcareFAQSection />
      </main>

      {/* Enterprise Interactive Footer */}
      <EnterpriseFooter
        onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Interactive Login Modal */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={`Login: ${activeModal.replace('_', ' ')} Mode`}
          description="Authenticate to access your role-based workspace"
          footer={
            <>
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (activeModal === 'ADMIN') handleExecuteLogin('/admin', 'SUPER_ADMIN', loginId);
                  else if (activeModal === 'STAFF_HUB') handleExecuteLogin('/staff', 'STAFF_HUB', loginId);
                  else if (activeModal === 'CUSTOMER_CARE') handleExecuteLogin('/support', 'CUSTOMER_CARE', loginId);
                  else if (activeModal === 'HOSPITAL') handleExecuteLogin('/hospital', 'HOSPITAL', loginId);
                  else if (activeModal === 'DOCTOR') handleExecuteLogin('/doctor', 'DOCTOR_RMP', loginId);
                  else if (activeModal === 'PATIENT') handleExecuteLogin('/patient', 'PATIENT', loginId);
                }}
              >
                Sign In & Enter Workspace
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate block">Pre-Configured Demo Account</span>
                <span className="font-mono font-bold text-navy text-xs">{loginId}</span>
              </div>
              <Badge variant="success">CREDENTIALS PRE-LOADED</Badge>
            </div>

            <Input
              label="User ID / Identity Identifier"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />

            <Input
              label="Password / Token"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            {activeModal === 'ADMIN' && (
              <div className="p-2.5 rounded-md bg-amber-soft border border-amber-300 text-amber-900 text-[11px] leading-relaxed">
                <strong>Governance Rule:</strong> Maximum 5 administrator accounts allowed in this ecosystem. Any removal of an administrator requires a mandatory 7-day cooling-off period.
              </div>
            )}

            {activeModal === 'PATIENT' && (
              <div className="p-2.5 rounded-md bg-emerald-soft border border-emerald-300 text-emerald-900 text-[11px] leading-relaxed">
                <strong>ABHA Linked:</strong> Encrypted ABDM M1/M2/M3 vault enabled. Citizen records, diagnostic reports, and digital prescriptions sync securely.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Floating Spatial Gateway Command Dock */}
      <FloatingGatewayDock
        onSelectSection={handleSelectFromCore}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleSound}
        onEmergencyTrigger={() => {
          sound.playChime();
          setIsEmergencyOpen(true);
        }}
      />

      {/* Global Omni-Search Spotlight Modal (⌘K) */}
      <OmniSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onEmergencyTrigger={() => {
          setIsSearchOpen(false);
          setIsEmergencyOpen(true);
        }}
      />

      {/* National 108 Emergency Care & Trauma Dispatch Modal */}
      <EmergencyDispatchModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* High-Fidelity Patient ABDM Authentication Modal */}
      <PatientAuthModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccessLogin={handleExecuteLogin}
      />

      {/* Institutional Hospital & Doctor Clinical Provider Modal */}
      <ProviderAuthModal
        isOpen={isProviderModalOpen}
        initialMode={providerSubMode}
        onClose={() => setIsProviderModalOpen(false)}
        onSuccessLogin={handleExecuteLogin}
      />

      {/* Enterprise Office Workers & Customer Care Auth Modal */}
      <OfficeWorkerAuthModal
        isOpen={isOfficeModalOpen}
        initialMode={officeWorkerSubMode}
        onClose={() => setIsOfficeModalOpen(false)}
        onSuccessLogin={handleExecuteLogin}
      />

      {/* Sovereign Platform Super-Admin Governance Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccessLogin={handleExecuteLogin}
      />
    </div>
  );
};
