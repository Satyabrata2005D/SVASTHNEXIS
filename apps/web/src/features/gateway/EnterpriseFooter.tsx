import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '@/services/soundEffects';
import {
  ShieldCheck,
  PhoneCall,
  Activity,
  Building2,
  Stethoscope,
  User,
  Heart,
  Radio,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface EnterpriseFooterProps {
  onOpenEmergencyModal: () => void;
  onOpenSearch: () => void;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({
  onOpenEmergencyModal,
  onOpenSearch,
}) => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#111522] text-white pt-12 pb-8 border-t border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Top Operational Status Banner */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold text-white block">
                ALL 32 HOSPITAL CLUSTERS & BED NETWORKS OPERATIONAL
              </span>
              <span className="text-[11px] text-slate-400">
                Live Edge Latency: 24ms • 99.99% Uptime SLA • Merkle Root Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onOpenSearch();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Search Directory (⌘K)
            </button>
            <button
              onClick={() => {
                sound.playChime();
                onOpenEmergencyModal();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-coral hover:bg-coral-deep text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>108 Trauma Emergency</span>
            </button>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Column 1: Ecosystem Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-coral-deep flex items-center justify-center text-white font-black text-sm">
                S
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                SVASTHNEXIS
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Total Hospital Management System unifying Ayushman Bharat records, doctor consultations, 250-bed telemetry, and zero-trust data protection for India.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 & ISO 27001 Certified</span>
            </div>
          </div>

          {/* Column 2: Clinical Portals */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white block pb-1 border-b border-white/10">
              Clinical Workspaces
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/doctor');
                  }}
                  className="hover:text-coral transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Stethoscope className="w-3 h-3 text-emerald-500" />
                  <span>Doctor Workspace (Dr. Ananya)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/patient');
                  }}
                  className="hover:text-coral transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <User className="w-3 h-3 text-coral" />
                  <span>Patient Health Locker (Rahul Verma)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/hospital');
                  }}
                  className="hover:text-coral transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3 h-3 text-sky-400" />
                  <span>Hospital Bed & OT Matrix (CityCare)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Operations & Admin */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white block pb-1 border-b border-white/10">
              Operations & Governance
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/staff');
                  }}
                  className="hover:text-coral transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Activity className="w-3 h-3 text-amber-500" />
                  <span>Staff Portal & LIS Pathology</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/support');
                  }}
                  className="hover:text-coral transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Customer Care & Ticket Triage</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate('/admin');
                  }}
                  className="hover:text-coral transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  <span>Super Admin Sovereign Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: National Health Grid */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white block pb-1 border-b border-white/10">
              National Health Grid
            </span>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px] text-slate-400">
              <div className="font-bold text-white flex items-center gap-1">
                <span>NHA ABDM Milestone Certified</span>
              </div>
              <p className="text-[10px] leading-tight">
                M1 (Registry), M2 (ABHA Creation), M3 (FHIR R4 Health Records exchange).
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-400 pt-1">
              CERT-In Incident Disclosure SLA: 6 Hours
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} SvasthNexis Total Hospital Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>DPDP ACT 2023 COMPLIANT</span>
            <span>•</span>
            <span>NABH LEVEL-5 BENCHMARK</span>
            <span>•</span>
            <span>FHIR R4 HL7 PROTOCOL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

