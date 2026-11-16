import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  Globe,
  BedDouble,
  Stethoscope,
  CreditCard,
  ShieldCheck,
  Ambulance,
  Activity,
  Layers,
  Cpu,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  Shield,
  FileCheck,
} from 'lucide-react';

export interface ArchitecturePillar {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  category: string;
  badge: string;
  metric: string;
  description: string;
  accentColor: string;
  borderColor: string;
  pillColor: string;
  techSpecs: {
    protocol: string;
    throughput: string;
    security: string;
    standard: string;
  };
  features: string[];
}

export const HospitalNetworkTrustBar: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('abdm-grid');

  const pillars: ArchitecturePillar[] = [
    {
      id: 'abdm-grid',
      icon: Globe,
      title: 'National ABHA Interop Grid',
      category: 'ABDM 2.0 Federated Core',
      badge: 'M1 • M2 • M3',
      metric: 'FHIR R4 JSON • Sub-50ms',
      description:
        'Universal health data exchange federating citizen ABHA lockers with hospital EMR systems nationwide under NHA standards.',
      accentColor: 'text-emerald-700',
      borderColor: 'border-emerald-300 hover:border-emerald-500',
      pillColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      techSpecs: {
        protocol: 'REST / HL7 FHIR R4',
        throughput: '< 50ms Consent Sync',
        security: 'ABDM OAuth 2.0 PKCE',
        standard: 'NHA ABDM Milestone 1-3',
      },
      features: [
        'Instant 14-Digit ABHA Generation & Aadhaar/Mobile OTP linking',
        'Cryptographic biometric consent artifact validation',
        'Structured FHIR R4 JSON diagnostic and e-prescription payloads',
      ],
    },
    {
      id: 'icu-twin',
      icon: BedDouble,
      title: 'Smart ICU & Bed Articulation Twin',
      category: 'Clinical Hardware Telemetry',
      badge: '60 FPS Vector',
      metric: 'Real-Time Articulation',
      description:
        'Motorized bed articulation digital twin with real-time bedside hemodynamic ECG monitoring and smart triage routing.',
      accentColor: 'text-teal-700',
      borderColor: 'border-teal-300 hover:border-teal-500',
      pillColor: 'bg-teal-50 text-teal-800 border-teal-300',
      techSpecs: {
        protocol: 'WebSocket / Canvas 60 FPS',
        throughput: '60 Updates / sec',
        security: 'Isolated Clinical LAN',
        standard: 'IEC 60601-2-52 Compliant',
      },
      features: [
        'Motorized Head (0°-65°) and Knee (0°-35°) articulation controls',
        'Real-time bedside Lead-II ECG waveform visualizer',
        'Automated trauma bed hold and sequential sterilization workflows',
      ],
    },
    {
      id: 'lis-copilot',
      icon: Stethoscope,
      title: 'Pathology LIS & Clinical Copilot',
      category: 'Doctor Practice & Laboratory',
      badge: 'CAT-10 Certified',
      metric: 'Pathologist Digital DSC',
      description:
        'Automated lab specimen tracking, strict CAT-10 pathologist sign-off gates, and AI clinical diagnostic assistance.',
      accentColor: 'text-sky-700',
      borderColor: 'border-sky-300 hover:border-sky-500',
      pillColor: 'bg-sky-50 text-sky-800 border-sky-300',
      techSpecs: {
        protocol: 'HL7 v2.5 / LOINC / SNOMED',
        throughput: 'Instant Digital Release',
        security: 'DSC Class-3 Digital Sign',
        standard: 'ISO 15189 / NABL Standard',
      },
      features: [
        'CAT-10 Gate: Blocks result release until Pathologist signs with DSC',
        'Immutable FHIR R4 SOAP notes with amendment audit trails',
        'Drug-allergy and contraindication safety cross-checks',
      ],
    },
    {
      id: 'tpa-billing',
      icon: CreditCard,
      title: 'Cashless TPA & Tariff Engine',
      category: 'Financial Operations',
      badge: 'CAT-01 Concurrency',
      metric: '₹0 Leakage Guarantee',
      description:
        'Distributed mutex locking preventing double-booking, automated cashless pre-authorization, and tariff benchmarking.',
      accentColor: 'text-amber-800',
      borderColor: 'border-amber-300 hover:border-amber-500',
      pillColor: 'bg-amber-50 text-amber-800 border-amber-300',
      techSpecs: {
        protocol: 'Transactional Outbox / ACID',
        throughput: 'Zero Race Conditions',
        security: 'Tamper-Evident Ledger',
        standard: 'IRDAI Cashless Protocol',
      },
      features: [
        'CAT-01: 20 simultaneous hold requests resolve to exactly 1 winner',
        'Automated cashless insurance pre-auth and document indexing',
        'Transparent procedure tariff comparison across hospital tiers',
      ],
    },
    {
      id: 'cyber-soc',
      icon: ShieldCheck,
      title: 'Zero-Trust Cyber SOC & Merkle Audit',
      category: 'Security & Governance',
      badge: 'DPDP Act 2023',
      metric: 'SHA-256 Merkle Ledger',
      description:
        'Cryptographic audit ledger and CAT-07 strict role barriers blocking support staff from clinical records with 100% compliance.',
      accentColor: 'text-indigo-700',
      borderColor: 'border-indigo-300 hover:border-indigo-500',
      pillColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      techSpecs: {
        protocol: 'SHA-256 Hash Chain',
        throughput: 'Zero Log Drops',
        security: 'Zero-Knowledge Vault',
        standard: 'DPDP Act 2023 / ISO 27001',
      },
      features: [
        'CAT-07: HTTP 403 Forbidden barrier on patient clinical charts for support',
        'Cryptographic Merkle tree hash chain linking all system actions',
        'ADR-001 Sovereign 5-Admin quota with mandatory 7-day cooling clock',
      ],
    },
    {
      id: 'emergency-108',
      icon: Ambulance,
      title: '108 Trauma & Rapid Emergency Grid',
      category: 'Critical Care Response',
      badge: 'Golden-Hour Priority',
      metric: 'Live GPS ALS Telemetry',
      description:
        'Computer-aided emergency dispatch with live ambulance telemetry streaming patient vitals to the trauma surgeon before arrival.',
      accentColor: 'text-rose-700',
      borderColor: 'border-rose-300 hover:border-rose-500',
      pillColor: 'bg-rose-50 text-rose-800 border-rose-300',
      techSpecs: {
        protocol: 'WebRTC / Real-Time Telemetry',
        throughput: '< 1s Latency Stream',
        security: 'TLS 1.3 Encrypted',
        standard: 'AIS-125 ALS Compliant',
      },
      features: [
        'One-touch national 108 emergency SOS dispatch triggers',
        'Live transit vital stream (SpO2, Pulse, BP) directly to Trauma OT',
        'Pre-hospital blood bank crossmatch and surgical bay reservation',
      ],
    },
  ];

  const badges = [
    {
      label: 'NHA ABDM Milestone M1, M2 & M3',
      sub: 'National Digital Health Mission Certified Interoperability',
    },
    {
      label: 'NABH Digital Level-5 Standards',
      sub: 'Hospital Operating System Quality & Governance Benchmark',
    },
    {
      label: 'DPDP Act 2023 & ISO 27001',
      sub: 'Zero-Knowledge Consent & Cryptographic Security Architecture',
    },
    {
      label: 'FHIR R4 JSON & HL7 Compliant',
      sub: 'Universal Semantic Electronic Health Record Standard',
    },
  ];

  const selectedPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];
  const SelectedIcon = selectedPillar.icon;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6 space-y-4">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-soft-grey pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
            <span>SvasthNexis Core Architecture & System Capabilities</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-md bg-warm-light-grey text-slate border border-soft-grey">
              ADR-001 Constitution
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-slate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Interactive Architectural Blueprint • Click any pillar to inspect specs</span>
        </div>
      </div>

      {/* 6 Core Architectural Pillar Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {pillars.map((p) => {
          const IconComp = p.icon;
          const isSelected = p.id === selectedPillarId;

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -2, scale: 1.02 }}
              onClick={() => {
                sound.playClick();
                setSelectedPillarId(p.id);
              }}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer select-none ${
                isSelected
                  ? 'bg-white shadow-md border-coral ring-2 ring-coral/20'
                  : 'bg-white/80 backdrop-blur-md border-soft-grey shadow-2xs hover:bg-white hover:border-soft-grey-dark'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-coral-soft text-coral-deep' : 'bg-warm-light-grey text-slate'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${p.pillColor}`}
                  >
                    {p.badge}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate truncate uppercase tracking-wider">
                  {p.category}
                </div>
                <div className="font-display font-bold text-xs text-navy leading-snug mt-0.5 truncate">
                  {p.title}
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 border-t border-soft-grey/60 flex items-center justify-between text-[9px] font-mono">
                <span className={`font-bold ${p.accentColor}`}>{p.metric}</span>
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${
                    isSelected ? 'translate-x-0.5 text-coral' : 'text-slate-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Selected Pillar Technical Deep-Dive Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPillar.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-warm-white via-white to-warm-light-grey border border-soft-grey shadow-xs space-y-3.5"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-soft-grey pb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-soft text-coral-deep flex items-center justify-center shrink-0 shadow-2xs">
                <SelectedIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-coral">
                    {selectedPillar.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-soft text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE CAPABILITY
                  </span>
                </div>
                <h4 className="text-base font-display font-bold text-navy mt-0.5">
                  {selectedPillar.title}
                </h4>
                <p className="text-xs text-slate mt-0.5 leading-relaxed max-w-2xl">
                  {selectedPillar.description}
                </p>
              </div>
            </div>

            {/* Quick Tech Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono shrink-0">
              <div className="p-2 rounded-xl bg-white border border-soft-grey shadow-2xs">
                <span className="text-slate block text-[9px]">PROTOCOL</span>
                <span className="font-bold text-navy truncate block">
                  {selectedPillar.techSpecs.protocol}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-soft-grey shadow-2xs">
                <span className="text-slate block text-[9px]">SLA / LATENCY</span>
                <span className="font-bold text-emerald-700 truncate block">
                  {selectedPillar.techSpecs.throughput}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-soft-grey shadow-2xs">
                <span className="text-slate block text-[9px]">SECURITY</span>
                <span className="font-bold text-navy truncate block">
                  {selectedPillar.techSpecs.security}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-soft-grey shadow-2xs">
                <span className="text-slate block text-[9px]">BENCHMARK</span>
                <span className="font-bold text-coral-deep truncate block">
                  {selectedPillar.techSpecs.standard}
                </span>
              </div>
            </div>
          </div>

          {/* Key Deliverables & Project Features Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            {selectedPillar.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 border border-soft-grey/80 text-xs text-navy"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* National Compliance & Certification Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
        {badges.map((b) => (
          <div
            key={b.label}
            className="p-2.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-center gap-2.5 shadow-2xs hover:bg-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-soft text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-xs text-navy block truncate">
                {b.label}
              </span>
              <span className="text-[10px] text-slate block truncate">{b.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
