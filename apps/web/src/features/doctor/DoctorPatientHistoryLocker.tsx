import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { sound } from '@/services/soundEffects';
import {
  FileText,
  ShieldCheck,
  Lock,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  FolderOpen,
  Calendar,
  User,
  Building2,
  Stethoscope,
} from 'lucide-react';

interface PatientPastRecord {
  id: string;
  category: 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY';
  title: string;
  doctorOrHospital: string;
  date: string;
  diagnosisOrTest: string;
  summary: string;
  fileSize: string;
  findings: string[];
}

interface DoctorPatientHistoryLockerProps {
  patientName: string;
  patientAbha: string;
  hasConsent: boolean;
  onOpenDualView: () => void;
}

export const DoctorPatientHistoryLocker: React.FC<DoctorPatientHistoryLockerProps> = ({
  patientName,
  patientAbha,
  hasConsent,
  onOpenDualView,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<PatientPastRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY'>('LAB_REPORT');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Patient's Historical Medical Vault (Pre-uploaded by patient)
  const [pastRecords, setPastRecords] = useState<PatientPastRecord[]>([
    {
      id: 'rec-001',
      category: 'PRESCRIPTION',
      title: 'General Medicine Prescription & Antihypertensive Regimen',
      doctorOrHospital: 'Dr. Rajesh Varma • CityCare OPD',
      date: '2026-08-14',
      diagnosisOrTest: 'Essential Stage-1 Hypertension',
      summary: 'Prescribed Telmisartan 40mg once daily after breakfast. Dietary sodium restriction advised.',
      fileSize: '1.2 MB PDF',
      findings: [
        'BP at consultation: 142/90 mmHg',
        'Started on Telmisartan 40mg OD',
        'Advised home BP charting for 2 weeks',
      ],
    },
    {
      id: 'rec-002',
      category: 'LAB_REPORT',
      title: 'Comprehensive Lipid Profile & Fasting Blood Sugar',
      doctorOrHospital: 'CityCare Central Diagnostic Laboratory',
      date: '2026-09-02',
      diagnosisOrTest: 'Lipid Panel + FBS',
      summary: 'Total Cholesterol 218 mg/dL, Triglycerides 185 mg/dL, Fasting Sugar 98 mg/dL (Normal).',
      fileSize: '2.4 MB PDF',
      findings: [
        'Total Cholesterol: 218 mg/dL (Borderline High)',
        'Triglycerides: 185 mg/dL (Elevated)',
        'HDL-C: 44 mg/dL (Normal)',
        'LDL-C: 137 mg/dL (High)',
      ],
    },
    {
      id: 'rec-003',
      category: 'LAB_REPORT',
      title: 'Complete Blood Count (CBC) with ESR',
      doctorOrHospital: 'Apollo Diagnostics LIS Gateway',
      date: '2026-10-18',
      diagnosisOrTest: 'Hemogram & Platelets',
      summary: 'Hemoglobin 13.8 g/dL, WBC 9,400 /uL, Platelets 2.8 Lakhs/uL. Normal inflammatory markers.',
      fileSize: '850 KB PDF',
      findings: [
        'Hemoglobin: 13.8 g/dL (Normal Range)',
        'WBC Count: 9,400 /uL (Normal)',
        'ESR 1st Hour: 12 mm (Normal)',
      ],
    },
    {
      id: 'rec-004',
      category: 'DISCHARGE_SUMMARY',
      title: 'Hospital Daycare Discharge: Acute Gastroenteritis',
      doctorOrHospital: 'CityCare Super Specialty Hospital',
      date: '2025-11-20',
      diagnosisOrTest: 'Acute Viral Gastroenteritis with Dehydration',
      summary: 'Admitted for 18 hours IV fluid rehydration and antiemetics. Recovered fully, vitals stable.',
      fileSize: '3.1 MB PDF',
      findings: [
        'IV Ringer Lactate 2 Liters administered',
        'Stool microscopy negative for ova/cysts',
        'Discharged on oral ORS & probiotics',
      ],
    },
  ]);

  const filteredRecords = pastRecords.filter((r) => {
    if (activeCategory === 'ALL') return true;
    return r.category === activeCategory;
  });

  const handleUploadNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;
    const newRecord: PatientPastRecord = {
      id: `rec-${Date.now()}`,
      category: uploadCategory,
      title: uploadTitle,
      doctorOrHospital: 'Dr. Ananya Sharma (Cardiology Consultation)',
      date: new Date().toISOString().split('T')[0],
      diagnosisOrTest: 'Consultation Diagnostic Document',
      summary: 'Uploaded during active consultation session. Synchronized to patient Aegis Care vault.',
      fileSize: '1.8 MB PDF',
      findings: ['Uploaded by Doctor RMP', 'Consent verified', 'Cryptographically verified'],
    };
    setPastRecords([newRecord, ...pastRecords]);
    setUploadSuccess(`Successfully uploaded "${uploadTitle}" to ${patientName}'s personal health locker.`);
    setUploadTitle('');
    setIsUploadModalOpen(false);
  };

  return (
    <Card className="overflow-hidden border border-soft-grey shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-coral-soft text-coral-deep flex items-center justify-center font-bold">
            <FolderOpen className="w-5 h-5 text-coral-deep" />
          </div>
          <div>
            <CardTitle>Patient Past Health Locker & Prescription Timeline</CardTitle>
            <p className="text-xs text-slate mt-0.5">
              Historical records pre-uploaded by patient, gated by India DPDP cryptographic consent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasConsent ? (
            <Badge variant="success">DPDP CONSENT VERIFIED • 72H</Badge>
          ) : (
            <Badge variant="critical">CONSENT LOCKED</Badge>
          )}

          {hasConsent && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                sound.playClick();
                setIsUploadModalOpen(true);
              }}
            >
              <Upload className="w-3.5 h-3.5 mr-1 text-coral" /> Upload for Patient
            </Button>
          )}
        </div>
      </CardHeader>

      <div className="p-5 space-y-4">
        {/* Upload Success Alert */}
        {uploadSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <button onClick={() => setUploadSuccess(null)} className="text-slate hover:text-navy">
              Dismiss
            </button>
          </div>
        )}

        {/* Consent Gate Check */}
        {!hasConsent ? (
          <div className="p-8 rounded-xl bg-red-50/70 border-2 border-dashed border-coral-deep/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-coral-deep mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6 text-coral-deep" />
            </div>
            <h4 className="font-display font-bold text-navy text-sm">
              Past Health Records Locked by Patient Privacy Policy
            </h4>
            <p className="text-xs text-slate max-w-lg mx-auto">
              Under India DPDP Act 2023, patient <strong>{patientName}</strong> has withheld explicit consent to share past historical records. 
              Only the current active consultation data is accessible.
            </p>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-soft-grey">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {[
                  { id: 'ALL', label: 'All Records', count: pastRecords.length },
                  { id: 'PRESCRIPTION', label: 'Past Prescriptions', count: pastRecords.filter((r) => r.category === 'PRESCRIPTION').length },
                  { id: 'LAB_REPORT', label: 'Diagnostic Tests', count: pastRecords.filter((r) => r.category === 'LAB_REPORT').length },
                  { id: 'DISCHARGE_SUMMARY', label: 'Hospital Discharges', count: pastRecords.filter((r) => r.category === 'DISCHARGE_SUMMARY').length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveCategory(tab.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeCategory === tab.id
                        ? 'bg-navy text-white shadow-xs'
                        : 'bg-warm-light-grey text-slate hover:text-navy'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1 text-[10px] font-mono opacity-80">({tab.count})</span>
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  sound.playClick();
                  onOpenDualView();
                }}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>AI Dual-View Analyzer</span>
              </Button>
            </div>

            {/* Historical Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-xl bg-warm-light-grey/60 border border-soft-grey hover:border-coral transition-all space-y-2.5 flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-soft-grey text-slate uppercase">
                        {record.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate" />
                        {record.date}
                      </span>
                    </div>

                    <h4 className="font-bold text-navy text-xs group-hover:text-coral transition-colors leading-snug">
                      {record.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate">
                      <Stethoscope className="w-3.5 h-3.5 text-coral shrink-0" />
                      <span>{record.doctorOrHospital}</span>
                    </div>

                    <p className="text-[11px] text-slate bg-white p-2.5 rounded-md border border-soft-grey leading-relaxed">
                      {record.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-soft-grey flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate">{record.fileSize}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedRecord(record);
                        }}
                        className="px-2.5 py-1 rounded-md bg-white border border-soft-grey hover:border-navy text-navy font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Eye className="w-3 h-3 text-coral" />
                        <span>Inspect Document</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* MODAL: INSPECT DOCUMENT WITH LASER SCANNER */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Document Inspector — ${selectedRecord.title}`}
          description={`Issued by ${selectedRecord.doctorOrHospital} on ${selectedRecord.date}`}
          footer={
            <Button variant="secondary" onClick={() => setSelectedRecord(null)}>
              Close Inspector
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Laser scanning simulation */}
            <div className="p-4 rounded-xl bg-slate-900 text-white relative overflow-hidden space-y-3 font-mono">
              <motion.div
                animate={{ y: [0, 160, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-coral to-transparent shadow-[0_0_12px_#FF5B47] pointer-events-none"
              />

              <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-[11px]">
                <span className="text-emerald-400 font-bold">● DIGITALLY VERIFIED DOCUMENT</span>
                <span className="text-slate-400">ABDM FHIR R4 COMPLIANT</span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <p>PATIENT: {patientName} (ABHA: {patientAbha})</p>
                <p>DIAGNOSIS/INVESTIGATION: {selectedRecord.diagnosisOrTest}</p>
                <p>FACILITY/CLINIC: {selectedRecord.doctorOrHospital}</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coral block">
                  Clinical Document Findings & Reference Bounds:
                </span>
                {selectedRecord.findings.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-warm-light-grey border border-soft-grey text-slate">
              <span>Cryptographic Hash: <code className="text-navy font-bold">sha256-4c91...88b2</code></span>
              <a
                href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                target="_blank"
                rel="noreferrer"
                className="text-coral hover:underline font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original PDF</span>
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: UPLOAD NEW DOCUMENT FOR PATIENT */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title={`Upload Clinical Document for ${patientName}`}
          description="Directly sync a new diagnostic report, consultation note, or clinical summary to the patient's personal Aegis Care health locker."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUploadNewRecord}>
                Upload & Sync to Patient Locker
              </Button>
            </>
          }
        >
          <form onSubmit={handleUploadNewRecord} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-navy block mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Cardiology OPD Follow-up Summary & ECG Analysis"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>

            <div>
              <label className="font-bold text-navy block mb-1">Document Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              >
                <option value="LAB_REPORT">Diagnostic Lab / Imaging Report</option>
                <option value="PRESCRIPTION">Electronic Prescription Summary</option>
                <option value="DISCHARGE_SUMMARY">Discharge / Procedural Summary</option>
              </select>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-soft-grey text-center space-y-2 bg-warm-light-grey/40">
              <Upload className="w-6 h-6 text-slate mx-auto" />
              <span className="text-xs font-bold text-navy block">Choose File or Drag PDF / DICOM</span>
              <span className="text-[10px] text-slate block">Supports PDF, JPG, PNG up to 25MB • ABDM Encrypted</span>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
};

