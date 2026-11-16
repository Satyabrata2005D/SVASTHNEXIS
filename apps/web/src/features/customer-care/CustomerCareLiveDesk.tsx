import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  Mic,
  MicOff,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  Building2,
  ArrowRight,
  AlertCircle,
  Volume2,
} from 'lucide-react';

interface CustomerCareLiveDeskProps {
  onResolveActiveCallIssue: (msg: string) => void;
  onTransferToStaffHub: (notes: string) => void;
}

export const CustomerCareLiveDesk: React.FC<CustomerCareLiveDeskProps> = ({
  onResolveActiveCallIssue,
  onTransferToStaffHub,
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [activeSpeechSpeaker, setActiveSpeechSpeaker] = useState<'PATIENT' | 'AGENT'>('PATIENT');

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setActiveSpeechSpeaker((prev) => (prev === 'PATIENT' ? 'AGENT' : 'PATIENT'));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleAnswerCall = () => {
    sound.playChime();
    setIsIncomingCall(false);
    setIsCallActive(true);
    setCallDurationSec(1);
  };

  const handleEndCall = () => {
    sound.playClick();
    setIsCallActive(false);
    setIsIncomingCall(false);
    onResolveActiveCallIssue('Call ended. Automated confirmation SMS and digital payment receipt dispatched to patient.');
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-navy to-slate-900 border border-slate-800 text-white p-5 shadow-xl space-y-4">
      {/* Top Telephony Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral to-coral-deep flex items-center justify-center text-white shadow-md">
            <PhoneCall className={`w-5 h-5 ${isIncomingCall ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white">
                Live Support Telephony & Patient Hotline Desk
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                WEBRTC OPUS 48KHZ
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inbound omnichannel hotline for payment failures, appointment rescheduling, and report access.
            </p>
          </div>
        </div>

        {isCallActive && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE CALL: {formatTimer(callDurationSec)}</span>
          </div>
        )}
      </div>

      {/* Main Calling Box */}
      {isIncomingCall && !isCallActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-slate-900/90 border-2 border-coral/50 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-coral-soft flex items-center justify-center text-coral-deep font-bold text-lg">
                RV
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-coral" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Inbound Patient Call: Rahul Verma</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  +91 98450 88219
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Reason: <em>"UPI payment debited ₹800 via Razorpay but appointment slot marked pending"</em>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAnswerCall}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Answer Call</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Active Call In-Progress HUD */}
      {isCallActive && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Caller Stream Tile */}
            <div
              className={`p-4 rounded-xl bg-slate-900/80 border-2 transition-all space-y-2 flex flex-col justify-between ${
                activeSpeechSpeaker === 'PATIENT' ? 'border-coral shadow-glow-coral' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <User className="w-4 h-4 text-coral" />
                  <span>Rahul Verma (Calling)</span>
                </span>
                {activeSpeechSpeaker === 'PATIENT' && (
                  <span className="px-2 py-0.5 rounded-full bg-coral text-white text-[10px] font-bold animate-pulse">
                    Speaking...
                  </span>
                )}
              </div>

              {/* Simulated Speech Waveform */}
              <div className="flex items-center justify-center gap-1 py-3">
                {[18, 36, 12, 45, 24, 52, 38, 16, 42, 28, 14, 30].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={
                      activeSpeechSpeaker === 'PATIENT'
                        ? { height: [h * 0.4, h, h * 0.4] }
                        : { height: 6 }
                    }
                    transition={{ repeat: Infinity, duration: 0.8 + (i % 4) * 0.2 }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-coral to-coral-deep"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 italic">
                "Hello, I paid ₹800 through UPI 15 minutes ago, but the hospital portal still says appointment pending."
              </div>
            </div>

            {/* Support Agent (You) Stream Tile */}
            <div
              className={`p-4 rounded-xl bg-slate-900/80 border-2 transition-all space-y-2 flex flex-col justify-between ${
                activeSpeechSpeaker === 'AGENT' ? 'border-emerald-500 shadow-glow-emerald' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Support Officer (Agent usr-cc-001)</span>
                </span>
                {activeSpeechSpeaker === 'AGENT' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold animate-pulse">
                    Transmitting...
                  </span>
                )}
              </div>

              {/* Simulated Speech Waveform Agent */}
              <div className="flex items-center justify-center gap-1 py-3">
                {[14, 28, 42, 20, 48, 32, 16, 38, 22, 44, 26, 12].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={
                      activeSpeechSpeaker === 'AGENT'
                        ? { height: [h * 0.4, h, h * 0.4] }
                        : { height: 6 }
                    }
                    transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2 }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-teal-400"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>

              <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 italic">
                "Checking your NPCI transaction hash right now, Mr. Verma. Validating idempotency to confirm your booking."
              </div>
            </div>
          </div>

          {/* In-Call Quick Action Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {/* Force Settle & Confirm Slot */}
              <button
                onClick={() => {
                  sound.playChime();
                  onResolveActiveCallIssue('Payment confirmed on live call: NPCI hash validated, appointment slot confirmed for Rahul Verma.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Force Settle & Confirm Slot</span>
              </button>

              {/* Transfer to Staff Hub */}
              <button
                onClick={() => {
                  sound.playClick();
                  onTransferToStaffHub('Patient on live hotline (Rahul Verma): Gateway timeout requires database clearance.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <PhoneForwarded className="w-3.5 h-3.5 text-coral" />
                <span>Transfer to Staff Hub</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsMuted(!isMuted);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={handleEndCall}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Finished State */}
      {!isIncomingCall && !isCallActive && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
          <span className="text-xs text-slate-400">Telephony queue is quiet. No active patient calls.</span>
          <div>
            <button
              onClick={() => {
                sound.playClick();
                setIsIncomingCall(true);
              }}
              className="text-xs text-coral hover:underline font-bold"
            >
              Simulate Inbound Patient Hotline Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

