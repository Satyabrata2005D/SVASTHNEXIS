import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import {
  ShieldAlert,
  Lock,
  FileCheck2,
  PhoneCall,
  Clock,
  Sparkles,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Zap,
  Radio,
  Building2,
  Layers,
} from 'lucide-react';

export const EnterpriseArchitectureSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GOVERNANCE' | 'RBAC' | 'PATHOLOGIST' | 'ABDM' | 'TRAUMA'>('GOVERNANCE');

  const tabs = [
    { id: 'GOVERNANCE', label: '5-Admin Sovereign Quota', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'RBAC', label: 'Zero-Trust RBAC (CAT-07)', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'PATHOLOGIST', label: 'Digital Sign Guard (CAT-10)', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    { id: 'ABDM', label: 'ABDM & FHIR R4 JSON', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'TRAUMA', label: '108 Emergency Bypass (CAT-12)', icon: <PhoneCall className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-10 space-y-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-coral bg-coral-soft px-3 py-1 rounded-full border border-coral/30">
          ARCHITECTURE • GOVERNANCE • SAFETY STANDARDS
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy">
          Built on Rigorous Clinical & Sovereign Safeguards
        </h2>
        <p className="text-xs sm:text-sm text-slate leading-relaxed">
          SvasthNexis enforces hard algorithmic boundaries across all 4 sectors. 
          Audited under India DPDP Act 2023, ABDM guidelines, and CERT-In compliance protocols.
        </p>
      </div>

      {/* Tabs Control */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-white/80 backdrop-blur-xl border border-soft-grey shadow-sm max-w-3xl mx-auto">
        {tabs.map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(t.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-navy text-white shadow-md'
                  : 'text-slate hover:text-navy hover:bg-warm-light-grey'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Detail Content Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg bg-white/95 backdrop-blur-2xl max-w-4xl mx-auto">
        {/* Tab 1: 5-Admin Sovereign Quota */}
        {activeTab === 'GOVERNANCE' && (
          <motion.div
            key="gov"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-soft-grey">
              <div>
                <span className="text-[10px] font-mono text-coral font-bold uppercase">ADR-001 CONSTITUTION</span>
                <h3 className="text-lg font-display font-extrabold text-navy">
                  Strict 5-Member Platform Administrator Quota
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-soft px-3 py-1 rounded-full border border-amber-300">
                2 / 5 SLOTS ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate leading-relaxed">
              <div className="p-4 rounded-2xl bg-warm-light-grey/80 border border-soft-grey space-y-2">
                <div className="flex items-center gap-2 font-bold text-navy text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sovereign Platform Ceiling</span>
                </div>
                <p>
                  No single entity can flood the system with unauthorized master accounts. The platform strictly enforces a mathematical ceiling of 5 platform administrators.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-warm-light-grey/80 border border-soft-grey space-y-2">
                <div className="flex items-center gap-2 font-bold text-navy text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>7-Day Cryptographic Cooling-Off Period</span>
                </div>
                <p>
                  Removing an administrator account triggers a mandatory 7-day cooling-off protocol. The removal can be aborted at any time by another administrator to prevent rogue takeovers.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Zero-Trust RBAC Shield */}
        {activeTab === 'RBAC' && (
          <motion.div
            key="rbac"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-soft-grey">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">CAT-07 CYBERSECURITY PROTOCOL</span>
                <h3 className="text-lg font-display font-extrabold text-navy">
                  Zero-Trust Clinical Chart Wall (HTTP 403 Forbidden)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-soft px-3 py-1 rounded-full border border-emerald-300">
                DPDP 2023 ZERO-LEAK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate leading-relaxed">
              <div className="p-4 rounded-2xl bg-warm-light-grey/80 border border-soft-grey space-y-2">
                <div className="flex items-center gap-2 font-bold text-navy text-sm">
                  <Lock className="w-4 h-4 text-coral" />
                  <span>Complete Clinical Redaction for Support</span>
                </div>
                <p>
                  Customer care staff and non-clinical employees troubleshoot payments, doctor no-shows, and hospital tariffs, but possess <strong className="text-navy">strictly zero access</strong> to diagnoses, prescriptions, and lab charts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-warm-light-grey/80 border border-soft-grey space-y-2">
                <div className="flex items-center gap-2 font-bold text-navy text-sm">
                  <Radio className="w-4 h-4 text-navy" />
                  <span>Immutable SHA-256 Merkle Chain Audit</span>
                </div>
                <p>
                  Every query attempt is recorded in a tamper-evident audit ledger. Unauthorized access attempts trigger automatic security notifications to the CERT-In incident handler.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Pathologist Digital Signature Guard */}
        {activeTab === 'PATHOLOGIST' && (
          <motion.div
            key="path"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-soft-grey">
              <div>
                <span className="text-[10px] font-mono text-purple-700 font-bold uppercase">CAT-10 DIAGNOSTIC INTEGRITY</span>
                <h3 className="text-lg font-display font-extrabold text-navy">
                  Pathologist Signature Enforcement on Lab Results
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                100% CLINICAL FIDELITY
              </span>
            </div>

            <p className="text-xs text-slate leading-relaxed">
              Unvalidated laboratory diagnostic results are strictly blocked from publishing to patient ABHA records. A registered pathologist must cryptographically review, calibrate, and sign with their digital certificate before records unlock.
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-soft/60 border border-emerald-300 text-xs font-mono text-emerald-950 flex items-center justify-between">
              <span>LIS_STATUS: SIGNED_BY_PATHOLOGIST (RMP: KMC-77412)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> VERIFIED
              </span>
            </div>
          </motion.div>
        )}

        {/* Tab 4: ABDM & FHIR R4 JSON */}
        {activeTab === 'ABDM' && (
          <motion.div
            key="abdm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-soft-grey">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">SECTION 16 ABHA INTEROP</span>
                <h3 className="text-lg font-display font-extrabold text-navy">
                  FHIR R4 JSON Document Bundling & Scoped Consent
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-navy bg-slate-100 px-3 py-1 rounded-full border border-soft-grey">
                HL7 FHIR R4
              </span>
            </div>

            <p className="text-xs text-slate leading-relaxed">
              Patient health records are converted into valid FHIR R4 JSON Document Bundles. 
              Doctors request scoped 72-hour consent; patients maintain full control to revoke consent at any second, immediately revoking document read permissions.
            </p>

            <div className="p-3 rounded-2xl bg-warm-light-grey border border-soft-grey text-xs font-mono text-slate-800 overflow-x-auto">
              <code>{`{ "resourceType": "Bundle", "type": "document", "identifier": { "system": "abdm.gov.in/records", "value": "rec-pat-001" }, "entry": [ ... ] }`}</code>
            </div>
          </motion.div>
        )}

        {/* Tab 5: 108 Emergency Bypass */}
        {activeTab === 'TRAUMA' && (
          <motion.div
            key="trauma"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-soft-grey">
              <div>
                <span className="text-[10px] font-mono text-coral font-bold uppercase">CAT-12 RESUSCITATION BYPASS</span>
                <h3 className="text-lg font-display font-extrabold text-navy">
                  Zero-Wait Trauma Intake & Automated Bed Hold
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-coral-deep bg-coral-soft px-3 py-1 rounded-full border border-coral/30">
                PRIORITY RED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-coral-soft/50 border border-coral/30 space-y-2 text-xs text-slate">
              <div className="font-bold text-coral-deep text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-coral" />
                <span>Automatic Administrative Exemption</span>
              </div>
              <p>
                In life-threatening trauma encounters, patient registration directly bypasses normal appointment queues and advance financial billing holds, alerting the on-duty emergency resuscitation team in under 500 milliseconds.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

