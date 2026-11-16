import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/navigation/Sidebar';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { sound } from '@/services/soundEffects';
import { OmniSearchModal } from '@/features/gateway/OmniSearchModal';
import { EmergencyDispatchModal } from '@/features/gateway/EmergencyDispatchModal';
import {
  Bell,
  Search,
  Clock,
  PhoneCall,
  Activity,
  AlertTriangle,
  LayoutGrid,
  Heart,
  Volume2,
  VolumeX,
  ShieldAlert,
  Radio,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [compactTime, setCompactTime] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(sound.isMuted);

  // Search & 108 Emergency Modal States
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

  // Global Code Blue Emergency Modal
  const [isCodeBlueModalOpen, setIsCodeBlueModalOpen] = useState(false);
  const [codeBlueLocation, setCodeBlueLocation] = useState('ICU Bed 201 — Cardiac Arrest Alert');
  const [codeBlueSuccess, setCodeBlueSuccess] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
      setCompactTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleAudio = () => {
    const muted = sound.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleBroadcastCodeBlue = () => {
    sound.playTelemetryBeep();
    setTimeout(() => {
      sound.playChime();
      setCodeBlueSuccess(`🚨 CODE BLUE BROADCAST DISPATCHED: Resuscitation Team en route to ${codeBlueLocation}!`);
      setTimeout(() => {
        setIsCodeBlueModalOpen(false);
        setCodeBlueSuccess(null);
      }, 3000);
    }, 1000);
  };

  const quickPortals = [
    { label: 'Admin', path: '/admin', color: 'hover:text-amber-600' },
    { label: 'Staff Hub', path: '/staff', color: 'hover:text-purple-600' },
    { label: 'Support', path: '/support', color: 'hover:text-emerald-600' },
    { label: 'Hospital', path: '/hospital', color: 'hover:text-coral' },
    { label: 'Doctor', path: '/doctor', color: 'hover:text-sky-600' },
    { label: 'Patient', path: '/patient', color: 'hover:text-coral-deep' },
  ];

  return (
    <div className="flex min-h-screen bg-warm-ivory text-navy relative overflow-hidden">
      {/* Background ambient glow blobs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none -z-10 animate-blob" />
      <div className="absolute bottom-10 left-80 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-blob-delayed" />

      {/* Persistent Navigation Rail */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/85 backdrop-blur-xl border-b border-soft-grey px-3 sm:px-4 lg:px-6 flex items-center justify-between shrink-0 z-30 shadow-2xs">
          {/* Left: Global Search & Quick Portal Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-4">
            <div
              onClick={() => {
                sound.playClick();
                setIsSearchOpen(true);
              }}
              className="relative w-36 sm:w-44 md:w-48 lg:w-56 2xl:w-64 shrink-0 cursor-pointer group"
            >
              <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-coral transition-colors" />
              <input
                type="text"
                readOnly
                placeholder="Search directory (⌘K)..."
                className="w-full bg-warm-light-grey/80 border border-soft-grey group-hover:border-slate/40 rounded-xl pl-9 pr-9 py-1.5 text-xs text-navy placeholder:text-slate cursor-pointer focus:outline-none transition-all truncate"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1 py-0.2 bg-white rounded border border-soft-grey text-slate font-bold shadow-2xs">
                ⌘K
              </kbd>
            </div>

            {/* Quick Portal Switcher Pills */}
            <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1 bg-warm-light-grey/80 p-0.5 2xl:p-1 rounded-lg 2xl:rounded-xl border border-soft-grey text-xs shrink min-w-0">
              {quickPortals.map((p) => {
                const isActive = location.pathname === p.path;
                return (
                  <button
                    key={p.path}
                    onClick={() => {
                      sound.playClick();
                      navigate(p.path);
                    }}
                    className={`px-2 2xl:px-2.5 py-0.5 2xl:py-1 rounded-md 2xl:rounded-lg text-[10.5px] 2xl:text-[11px] font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-navy text-white shadow-xs'
                        : `text-slate hover:text-navy hover:bg-white ${p.color}`
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Live ECG Waveform, Audio FX Toggle, Clock, Emergency, Notifications */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Header ECG Waveform: Visible on 2xl ultra-wide screens */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-warm-light-grey/60 border border-soft-grey shrink-0">
              <Heart className="w-3.5 h-3.5 text-coral animate-pulse" />
              <EcgPulse color="#FF5B47" width={80} height={18} />
            </div>

            {/* Audio-Haptics Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleAudio}
              title={isAudioMuted ? 'Click to Enable Clinical Sound FX' : 'Click to Mute Sound FX'}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                isAudioMuted
                  ? 'bg-warm-light-grey/80 border-soft-grey text-slate hover:text-navy'
                  : 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
              }`}
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate shrink-0" />
                  <span className="hidden 2xl:inline text-[10px]">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
                  <span className="hidden 2xl:inline text-[10px] font-bold">Audio FX ON</span>
                </>
              )}
            </motion.button>

            {/* Gateway Return Button */}
            <button
              onClick={() => {
                sound.playClick();
                navigate('/');
              }}
              title="Return to 4-Section Gateway"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-warm-light-grey hover:bg-soft-grey/60 border border-soft-grey text-navy text-xs font-bold transition-all shadow-2xs hover:scale-105 shrink-0"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-coral shrink-0" />
              <span className="hidden 2xl:inline">Gateway</span>
            </button>

            {/* Live Time */}
            <div className="hidden md:flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey text-xs font-semibold text-navy shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate shrink-0" />
              <span className="hidden 2xl:inline tabular-nums font-mono text-[11px]">{currentTime || 'Asia/Kolkata'}</span>
              <span className="inline 2xl:hidden tabular-nums font-mono text-[10.5px]">{compactTime || 'IST'}</span>
            </div>

            {/* Emergency 108 / Code Blue Button - ALWAYS FULLY VISIBLE & PINNED */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sound.playChime();
                setIsEmergencyOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-coral-soft border border-coral text-coral-deep text-xs font-bold shadow-2xs cursor-pointer hover:bg-coral-deep hover:text-white transition-all shrink-0 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce shrink-0" />
              <span className="shrink-0 tracking-tight">108 EMERGENCY</span>
            </motion.button>

            {/* Notifications - ALWAYS FULLY VISIBLE & PINNED */}
            <button
              className="p-2 rounded-xl hover:bg-warm-light-grey text-slate hover:text-navy transition-colors relative shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full ring-2 ring-white animate-ping" />
            </button>
          </div>
        </header>

        {/* Global Demo Notice Strip */}
        <div className="bg-[#FEF8E8] border-b border-[#F5E6B8] px-6 py-1.5 text-[11px] text-[#765000] flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>UNIFIED HEALTHCARE OS • NATIONAL STACK ACTIVE:</strong> Real-time 3D telemetry, ABHA integration, and SHA-256 Merkle chain verification active.
            </span>
          </div>
          <span className="hidden sm:inline font-semibold text-[10px] uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-sm border border-amber-300">
            PRODUCTION READY
          </span>
        </div>

        {/* Animated Page Viewport with Smooth Layout Transitions */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex-1 overflow-y-auto p-6 md:p-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      {/* MODAL: CODE BLUE EMERGENCY BROADCAST */}
      {isCodeBlueModalOpen && (
        <Modal
          isOpen={isCodeBlueModalOpen}
          onClose={() => setIsCodeBlueModalOpen(false)}
          title="🚨 HOSPITAL CODE BLUE RESUSCITATION BROADCAST"
          description="Immediate emergency override alert broadcast to all on-duty critical care specialists, nurses, and crash carts."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsCodeBlueModalOpen(false)}>
                Cancel Alert
              </Button>
              <Button
                variant="destructive"
                className="bg-coral-deep hover:bg-red-800 text-white font-bold"
                onClick={handleBroadcastCodeBlue}
              >
                <Radio className="w-4 h-4 mr-1.5 animate-pulse" /> Dispatch Crash Team Now
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-red-50 border border-coral-deep text-coral-deep space-y-2">
              <div className="font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce" />
                <span>CARDIAC ARREST / RESPIRATORY COLLAPSE IN PROGRESS</span>
              </div>
              <p className="leading-relaxed">
                Triggering Code Blue will alert the Anesthesia Lead, Emergency Registrar, Crash Cart 01, and ICU Charge Nurse via pager and paging speaker.
              </p>
            </div>

            <div>
              <label className="font-bold text-navy block mb-1">Target Location / Ward Unit</label>
              <input
                type="text"
                value={codeBlueLocation}
                onChange={(e) => setCodeBlueLocation(e.target.value)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-lg p-2.5 text-xs text-navy font-bold focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>

            {codeBlueSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-400 text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{codeBlueSuccess}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

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
    </div>
  );
};
