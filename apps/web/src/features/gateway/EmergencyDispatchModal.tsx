import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  PhoneCall,
  Ambulance,
  AlertTriangle,
  MapPin,
  Clock,
  Heart,
  Radio,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface EmergencyDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyDispatchModal: React.FC<EmergencyDispatchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dispatchStep, setDispatchStep] = useState<'TRIAGE' | 'DISPATCHED' | 'ARRIVED'>('TRIAGE');
  const [etaSeconds, setEtaSeconds] = useState(240); // 4 minutes

  useEffect(() => {
    if (!isOpen) {
      setDispatchStep('TRIAGE');
      setEtaSeconds(240);
      return;
    }

    sound.playChime();
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 2 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleConfirmDispatch = () => {
    sound.playChime();
    setDispatchStep('DISPATCHED');
  };

  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="National 108 Emergency Care & Trauma Dispatch"
      description="Direct priority tele-routing to nearest level-1 trauma facility"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-slate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono font-bold text-navy">Priority Link 108 Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close HUD
            </Button>
            {dispatchStep === 'TRIAGE' ? (
              <Button
                variant="primary"
                className="bg-coral hover:bg-coral-deep text-white shadow-lg shadow-coral/30"
                onClick={handleConfirmDispatch}
              >
                <span>Confirm Ambulance Dispatch</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
                onClick={onClose}
              >
                <span>Acknowledge Protocol</span>
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Top Emergency Status Banner */}
        <div className="p-3.5 rounded-2xl bg-coral-soft border border-coral/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral text-white flex items-center justify-center shadow-md animate-pulse">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-coral-deep tracking-wider block">
                NATIONAL HEALTH STACK • PRIORITY OVERRIDE
              </span>
              <span className="text-sm font-bold text-navy">
                Trauma Code Red • Zero-Wait Admission
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-coral-deep px-2.5 py-1 rounded-full bg-white/80 border border-coral/20">
            CAT-12 EMERGENCY
          </span>
        </div>

        {/* Live Dispatch Map / Status Card */}
        <div className="glass-card rounded-2xl p-4 border border-soft-grey shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-navy">
              <Ambulance className="w-4 h-4 text-coral animate-bounce" />
              <span>ALS Ambulance Unit #KA-01-EA-108</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-coral">
              <Clock className="w-3.5 h-3.5" />
              <span>ETA: {minutes}:{seconds < 10 ? `0${seconds}` : seconds} MINS</span>
            </div>
          </div>

          {/* Telemetry Progress Bar */}
          <div className="w-full bg-warm-light-grey rounded-full h-2 overflow-hidden border border-soft-grey">
            <motion.div
              className="bg-coral h-full rounded-full"
              initial={{ width: '15%' }}
              animate={{ width: dispatchStep === 'DISPATCHED' ? '65%' : '25%' }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-xl bg-white border border-soft-grey text-center">
              <span className="text-[10px] text-slate block">Nearest Facility</span>
              <span className="font-bold text-navy">CityCare Trauma</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-soft-grey text-center">
              <span className="text-[10px] text-slate block">Reserved Bed</span>
              <span className="font-bold text-emerald-700">ICU Bed #04</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-soft-grey text-center">
              <span className="text-[10px] text-slate block">Blood Ready</span>
              <span className="font-bold text-coral">O+ (2 Units)</span>
            </div>
          </div>
        </div>

        {/* Clinical Safeguards Note */}
        <div className="p-3 rounded-xl bg-emerald-soft border border-emerald-300 text-emerald-950 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Emergency Admission Protocol (CAT-12):</strong> Routine OPD and advance payment requirements are automatically bypassed. Resuscitation bay team alerted via WebSocket.
          </p>
        </div>
      </div>
    </Modal>
  );
};

