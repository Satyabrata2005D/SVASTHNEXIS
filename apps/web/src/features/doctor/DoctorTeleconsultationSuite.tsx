import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Sparkles,
  Download,
  Shield,
  Activity,
  Heart,
  MessageSquare,
  Maximize2,
  Users,
  Radio,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface DoctorTeleconsultationSuiteProps {
  patientName: string;
  patientAbha: string;
  doctorName: string;
  doctorRmp: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenDualView: () => void;
}

export const DoctorTeleconsultationSuite: React.FC<DoctorTeleconsultationSuiteProps> = ({
  patientName,
  patientAbha,
  doctorName,
  doctorRmp,
  isOpen,
  onClose,
  onOpenDualView,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [callDurationSec, setCallDurationSec] = useState(245);
  const [activeSpeechTile, setActiveSpeechTile] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [showLiveTranscription, setShowLiveTranscription] = useState(true);

  // Timer simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCallDurationSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Alternate simulated speech
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveSpeechTile((prev) => (prev === 'PATIENT' ? 'DOCTOR' : 'PATIENT'));
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sampleRecordingUrl =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Teleconsultation HUD Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center text-white font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">
                  SvasthNexis Teleconsultation HUD (Zoom / Google Meet Interop)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                  AES-256 ENCRYPTED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Patient: <span className="text-white font-semibold">{patientName}</span> ({patientAbha}) • Doctor: {doctorName} ({doctorRmp})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Recording Indicator */}
            {isRecording && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>REC {formatTime(callDurationSec)}</span>
              </div>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
            >
              Minimize
            </button>
          </div>
        </div>

        {/* Video Canvas Grid (Split-Screen Patient & Doctor Feeds) */}
        <div className="p-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 overflow-hidden">
          {/* Patient Remote Video Feed */}
          <div
            className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 border-2 transition-all flex flex-col justify-between p-4 min-h-[260px] sm:min-h-[320px] ${
              activeSpeechTile === 'PATIENT' ? 'border-coral shadow-glow-coral' : 'border-slate-800'
            }`}
          >
            {/* Top Badges on Patient Video */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-bold font-mono">
                  {patientName} (Remote)
                </span>
                {activeSpeechTile === 'PATIENT' && (
                  <span className="px-2 py-0.5 rounded-full bg-coral text-white text-[10px] font-bold animate-pulse">
                    Speaking...
                  </span>
                )}
              </div>

              {/* Patient Live Vitals Overlay */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-emerald-400">
                <Heart className="w-3.5 h-3.5 text-coral animate-pulse" />
                <span>74 bpm</span>
                <span className="text-slate-500">|</span>
                <span>SpO2 98%</span>
              </div>
            </div>

            {/* Simulated Patient Video Stream / Avatar with Face Tracking Box */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center text-white text-5xl font-extrabold shadow-2xl">
                <span>RV</span>
                {/* Simulated AI Facial Bounding Box */}
                <div className="absolute -inset-2 border border-dashed border-emerald-400/60 rounded-3xl animate-pulse" />
              </div>
            </div>

            {/* Bottom Telemetry Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                HD 1080p • 18ms Latency
              </span>
              <span className="text-slate-400 font-mono">Audio: WebRTC Opus 48kHz</span>
            </div>
          </div>

          {/* Doctor Local Self Feed */}
          <div
            className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 border-2 transition-all flex flex-col justify-between p-4 min-h-[260px] sm:min-h-[320px] ${
              activeSpeechTile === 'DOCTOR' ? 'border-emerald-500 shadow-glow-emerald' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-bold font-mono">
                  {doctorName} (You - RMP)
                </span>
                {activeSpeechTile === 'DOCTOR' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold animate-pulse">
                    Transmitting...
                  </span>
                )}
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                CLINICIAN HUD ACTIVE
              </span>
            </div>

            {/* Doctor Avatar / Camera Stream */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {isVideoOff ? (
                <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <VideoOff className="w-12 h-12 text-slate-600" />
                  <span className="text-xs font-bold">Camera is turned off</span>
                </div>
              ) : (
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-teal-700 via-emerald-600 to-cyan-500 flex items-center justify-center text-white text-5xl font-extrabold shadow-2xl">
                  <span>AS</span>
                  {/* Audio waveform waves */}
                  <div className="absolute -inset-3 border border-emerald-400/40 rounded-full animate-ping" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
              <span className="font-mono text-slate-400">RMP License: {doctorRmp}</span>
              <span className="font-mono text-emerald-400">{isMuted ? 'MIC MUTED' : 'MIC LIVE'}</span>
            </div>
          </div>
        </div>

        {/* Real-time AI Speech Transcription Ticker */}
        {showLiveTranscription && (
          <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-300">
            <span className="px-2 py-0.5 rounded bg-coral/20 text-coral text-[10px] font-bold font-mono shrink-0">
              AI LIVE SCRIBE
            </span>
            <p className="truncate italic">
              {activeSpeechTile === 'DOCTOR'
                ? 'Dr. Ananya Sharma: "I have examined the CBC and Lipid reports. Your white cell count is normal, but your cholesterol is borderline elevated."'
                : 'Rahul Verma: "Yes doctor, I have been feeling slight fatigue and fever for two days, taking paracetamol as needed."'}
            </p>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Audio Mute */}
            <button
              onClick={() => {
                sound.playClick();
                setIsMuted(!isMuted);
              }}
              className={`p-3 rounded-full transition-all ${
                isMuted
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video On/Off */}
            <button
              onClick={() => {
                sound.playClick();
                setIsVideoOff(!isVideoOff);
              }}
              className={`p-3 rounded-full transition-all ${
                isVideoOff
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
              title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* AI Dual-View Trigger in Call */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenDualView();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Present AI Lab Report</span>
            </button>
          </div>

          {/* Download Recording Link (Patient Safety Mandate) */}
          <div className="flex items-center gap-3">
            <a
              href={sampleRecordingUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
              title="Download teleconsultation recording MP4 for patient record"
            >
              <Download className="w-4 h-4 text-coral" />
              <span>Download MP4 Recording</span>
            </a>

            {/* End Call Button */}
            <button
              onClick={() => {
                sound.playChime();
                alert('Teleconsultation completed. Recording synchronized to patient health locker.');
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Consultation</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

