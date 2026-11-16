import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { TiltCard } from '@/components/ui/TiltCard';
import { StaffTariffAuditorStudio } from './StaffTariffAuditorStudio';
import { StaffCustomerCareEscalationDesk } from './StaffCustomerCareEscalationDesk';
import { FloatingStaffDock } from './FloatingStaffDock';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  FlaskConical,
  Pill,
  Barcode,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ShieldCheck,
  Send,
  Building2,
  Stethoscope,
  DollarSign,
  ShieldAlert,
  Mail,
  FileText,
  UserCheck,
  CreditCard,
  Eye,
  Check,
  Zap,
  Activity,
  Layers,
  LifeBuoy,
} from 'lucide-react';

export const StaffOperationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCTORS_AUDIT' | 'HOSPITAL_TARIFFS' | 'PATIENT_RECORDS' | 'CYBER_SOC' | 'LAB_PHARMACY'>('OVERVIEW');
  const [state, setState] = useState<any>(null);
  const [formulary, setFormulary] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Doctor & Appointment Audit State
  const [doctorsAuditList, setDoctorsAuditList] = useState<any[]>([
    {
      id: 'doc-sharma-01',
      name: 'Dr. Ananya Sharma',
      specialty: 'Cardiology',
      councilNumber: 'KMC-77412',
      appointmentsCompleted: 142,
      lastAppointmentNotes: 'Post-CABG recovery review, stable hemodynamics',
      moneyTransacted: '₹1,13,600',
      verificationStatus: 'VERIFIED',
    },
    {
      id: 'doc-varma-02',
      name: 'Dr. Rajesh Varma',
      specialty: 'General Medicine',
      councilNumber: 'KMC-55821',
      appointmentsCompleted: 218,
      lastAppointmentNotes: 'Viral URTI flu symptomatic management, prescription issued',
      moneyTransacted: '₹1,30,800',
      verificationStatus: 'VERIFIED',
    },
  ]);

  // 2. Hospital Rate & Tariff Verification State
  const [hospitalTariffs, setHospitalTariffs] = useState<any[]>([
    {
      hospital: 'CityCare Super Specialty Hospital',
      category: 'SURGERY',
      item: 'Coronary Artery Bypass Graft (CABG)',
      standardRate: '₹2,80,000',
      auditStatus: 'VERIFIED_COMPLIANT',
      benchmarkVariance: 'Normal (-2% vs City Median)',
    },
    {
      hospital: 'CityCare Super Specialty Hospital',
      category: 'SURGERY',
      item: 'Total Knee Arthroplasty (TKR)',
      standardRate: '₹1,90,000',
      auditStatus: 'VERIFIED_COMPLIANT',
      benchmarkVariance: 'Normal (+1% vs City Median)',
    },
    {
      hospital: 'CityCare Super Specialty Hospital',
      category: 'LAB_TEST',
      item: 'Complete Blood Count (CBC)',
      standardRate: '₹350',
      auditStatus: 'VERIFIED_COMPLIANT',
      benchmarkVariance: 'Fair (NPPA Cap Compliant)',
    },
    {
      hospital: 'CityCare Super Specialty Hospital',
      category: 'LAB_TEST',
      item: 'Lipid Profile Comprehensive Panel',
      standardRate: '₹650',
      auditStatus: 'VERIFIED_COMPLIANT',
      benchmarkVariance: 'Fair (NPPA Cap Compliant)',
    },
    {
      hospital: 'CityCare Super Specialty Hospital',
      category: 'DOCTOR_FEE',
      item: 'Specialist In-Person Consultation (Cardiology)',
      standardRate: '₹800',
      auditStatus: 'VERIFIED_COMPLIANT',
      benchmarkVariance: 'Within Tariff Cap',
    },
  ]);

  // 3. Patient Records Archive State
  const [patientRecordsArchive, setPatientRecordsArchive] = useState<any[]>([
    {
      patientId: 'usr-pat-001',
      name: 'Rahul Verma',
      abhaId: '91-4209-8812-3904',
      recordsStored: 4,
      presentDiagnosis: 'Viral URTI (Flu) + Essential Hypertension',
      pastRecords: 'Lipid Profile (2026-09-02), Chest X-Ray (2025-10-12)',
      integrityHash: 'sha256-4b82c...9e',
      verificationStatus: 'STORED_&_VERIFIED',
    },
  ]);

  // 4. Cybersecurity & Data Leak SOC State
  const [securityLogs, setSecurityLogs] = useState<any[]>([
    {
      id: 'soc-evt-101',
      timestamp: '10 mins ago',
      type: 'PAYMENT_SECURITY_AUDIT',
      status: 'SECURE',
      details: 'UPI Webhook idempotency hash validated. Zero double-debits detected.',
    },
    {
      id: 'soc-evt-102',
      timestamp: '25 mins ago',
      type: 'DPDP_DATA_LEAK_PREVENTION',
      status: 'BLOCKED',
      details: 'Customer Care agent unauthorized chart query blocked with HTTP 403 (CAT-07).',
    },
    {
      id: 'soc-evt-103',
      timestamp: '1 hour ago',
      type: 'CRYPTO_LEDGER_INTEGRITY',
      status: 'VALID',
      details: 'Audit trail SHA-256 block chain verified across 48 total transactions.',
    },
  ]);

  // 5. High-Level Escalation to Admin Modal State
  const [isMailAdminOpen, setIsMailAdminOpen] = useState(false);
  const [mailSubject, setMailSubject] = useState('Critical Hospital Tariff Override Request — CityCare Hospital');
  const [mailBody, setMailBody] = useState('Requesting super-admin authorization for cross-facility tariff threshold update.');
  const [mailSuccess, setMailSuccess] = useState<string | null>(null);

  // LIS State
  const [selectedLabResultToValidate, setSelectedLabResultToValidate] = useState<any | null>(null);
  const [pathologistLicense, setPathologistLicense] = useState('KMC-PATH-88219');
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  // Pharmacy Dispense State
  const [dispenseMedication, setDispenseMedication] = useState<any | null>(null);
  const [dispenseQuantity, setDispenseQuantity] = useState(10);
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispenseSuccess, setDispenseSuccess] = useState<string | null>(null);

  // Section Navigation Refs
  const tariffsSectionRef = useRef<HTMLDivElement>(null);
  const recordsSectionRef = useRef<HTMLDivElement>(null);
  const labSectionRef = useRef<HTMLDivElement>(null);

  const handleOpenMailWithData = (subject: string, body: string) => {
    sound.playClick();
    setMailSubject(subject);
    setMailBody(body);
    setIsMailAdminOpen(true);
  };

  const handleTriggerSocScan = () => {
    sound.playTelemetryBeep();
    setActiveTab('CYBER_SOC');
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stateRes, formularyRes] = await Promise.all([api.getState(), api.getFormulary()]);
      setState(stateRes);
      setFormulary(Array.isArray(formularyRes) ? formularyRes : (formularyRes?.formulary || stateRes?.formulary || []));
    } catch (err) {
      console.error('Failed to load staff state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.setAuth('STAFF_HUB', 'usr-staff-lab');
    fetchData();
  }, []);

  // Send Mail to Platform Admin
  const handleSendMailToAdmin = () => {
    setMailSuccess(
      `Escalation dispatched to Platform Admin Console! Subject: "${mailSubject}". Super-Admin authorization requested.`
    );
    setIsMailAdminOpen(false);
  };

  // CAT-10 Pathologist Validation Handler
  const handleValidateResult = async () => {
    if (!selectedLabResultToValidate) return;
    try {
      await api.validateLabResult(selectedLabResultToValidate.id, 'Validated and signed by Pathologist.');
      setValidationSuccess(`Lab Result ${selectedLabResultToValidate.id} verified & signed. Publication to patient portal unlocked.`);
      setSelectedLabResultToValidate(null);
      fetchData();
    } catch (err: any) {
      alert(`Validation failed: ${err.message}`);
    }
  };

  // Pharmacy Dispense Handler
  const handleDispenseMedication = async () => {
    if (!dispenseMedication) return;
    try {
      setIsDispensing(true);
      await api.dispenseMedication({
        prescriptionId: 'rx-demo-001',
        medicationName: dispenseMedication.medicationName || dispenseMedication.name,
        quantity: Number(dispenseQuantity),
        batchNumber: dispenseMedication.batchNumber || 'BATCH-2026-A1',
      });
      setDispenseSuccess(
        `Dispensed ${dispenseQuantity} units of ${dispenseMedication.medicationName || dispenseMedication.name}. Stock atomically decremented.`
      );
      setDispenseMedication(null);
      fetchData();
    } catch (err: any) {
      alert(`Dispense Failed (Stock Insufficient): ${err.message}`);
    } finally {
      setIsDispensing(false);
    }
  };

  const safeFormulary = Array.isArray(formulary) ? formulary : [];
  const labResults = Array.isArray(state?.labResults) ? state.labResults : [
    {
      id: 'res-101',
      testName: 'Complete Blood Count (CBC)',
      patientId: 'usr-pat-001',
      value: 'Hb: 13.8 g/dL',
      unit: 'g/dL',
      referenceRange: '12.0 - 15.5',
      isValidated: true,
      pathologistSignature: 'Dr. V. Rao, MD (Pathology)',
    },
    {
      id: 'res-102',
      testName: 'Lipid Profile (Total Cholesterol)',
      patientId: 'usr-pat-001',
      value: '218 mg/dL',
      unit: 'mg/dL',
      referenceRange: '< 200 mg/dL',
      isValidated: false,
      isCritical: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <HeroBanner
        title="Office Workers — Staff Portal & Employee Operations Hub"
        subtitle="Operational office hub: verify doctor credentials, audit hospital test/doctor/surgery pricing, manage patient medical records, monitor data leaks & cyber threats, and escalate to Admin."
        badgeText="EMPLOYEE HUB ACTIVE • SECURE OFFICE"
        badgeVariant="warning"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsMailAdminOpen(true)}
              className="bg-navy hover:bg-navy/90 text-white"
            >
              <Mail className="w-4 h-4 mr-1.5 text-coral" /> Compose Mail to Admin
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchData} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Live Hub
            </Button>
          </div>
        }
      />

      {/* Mail Sent to Admin Alert */}
      {mailSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mailSuccess}</span>
          </div>
          <button onClick={() => setMailSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* Validation Success Alert */}
      {validationSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{validationSuccess}</span>
          </div>
          <button onClick={() => setValidationSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* Dispense Success Alert */}
      {dispenseSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dispenseSuccess}</span>
          </div>
          <button onClick={() => setDispenseSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* TOP HUB KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Doctor Audits</span>
            <Stethoscope className="w-4 h-4 text-coral" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">2 Verified</div>
          <div className="text-[11px] text-slate font-medium mt-1">360 Appointments Audited</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Hospital Tariffs</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">100% Compliant</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Surgery & Test Costs Verified</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Cyber SOC Defense</span>
            <ShieldAlert className="w-4 h-4 text-navy" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">0 Leaks Detected</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Payment & DPDP Secure</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Money Transacted</span>
            <CreditCard className="w-4 h-4 text-coral-deep" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">₹2,44,400</div>
          <div className="text-[11px] text-slate font-medium mt-1">Zero Reconciliation Discrepancy</div>
        </Card>
      </div>

      {/* MODULE TABS */}
      <div className="bg-white rounded-xl border border-soft-grey p-1.5 shadow-2xs flex flex-wrap gap-1 text-xs font-bold">
        {[
          { id: 'OVERVIEW', label: '1. Hub Overview' },
          { id: 'DOCTORS_AUDIT', label: '2. Doctor & Appointment Audit' },
          { id: 'HOSPITAL_TARIFFS', label: '3. Hospital Surgery & Test Tariffs' },
          { id: 'PATIENT_RECORDS', label: '4. Patient Records Archive' },
          { id: 'CYBER_SOC', label: '5. Cyber Threat & Data Leak SOC' },
          { id: 'LAB_PHARMACY', label: '6. Pathologist Sign-Off & Pharmacy' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === t.id
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate hover:text-navy hover:bg-warm-light-grey'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Customer Care Escalation Desk */}
          <StaffCustomerCareEscalationDesk onOpenMailAdminModal={handleOpenMailWithData} />

          {/* Hospital Tariff Benchmark Studio */}
          <StaffTariffAuditorStudio />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Office Responsibilities Summary</CardTitle>
                  <p className="text-xs text-slate mt-0.5">Staff Portal & Employee Hub duties</p>
                </div>
                <Badge variant="warning">OFFICE WORKERS</Badge>
              </CardHeader>
              <div className="space-y-3 text-xs text-slate">
                <div className="p-3 rounded-lg bg-warm-light-grey/80 border border-soft-grey">
                  <strong className="text-navy block mb-0.5">1. Doctor List & Appointment Verification:</strong>
                  Verify registered doctors, medical council licenses, appointment schedules, and post-appointment completion notes.
                </div>
                <div className="p-3 rounded-lg bg-warm-light-grey/80 border border-soft-grey">
                  <strong className="text-navy block mb-0.5">2. Hospital Rate & Tariff Verification:</strong>
                  Audit test costs, doctor costs, and surgery costs in particular hospitals to prevent pricing inflation.
                </div>
                <div className="p-3 rounded-lg bg-warm-light-grey/80 border border-soft-grey">
                  <strong className="text-navy block mb-0.5">3. Patient Records & Health Storage:</strong>
                  Verify and store previous and present health records and test details securely under DPDP compliance.
                </div>
                <div className="p-3 rounded-lg bg-warm-light-grey/80 border border-soft-grey">
                  <strong className="text-navy block mb-0.5">4. Cyber Threat & Leak Monitoring:</strong>
                  Monitor data leaks, cyber threats, secure payment status, and escalate high-level issues to Admin.
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>High-Level Administrative Escalation Channel</CardTitle>
                  <p className="text-xs text-slate mt-0.5">Direct mail tool to Platform Super-Admin</p>
                </div>
                <Mail className="w-4 h-4 text-coral" />
              </CardHeader>
              <div className="space-y-3 text-xs">
                <p className="text-slate leading-relaxed">
                  When an issue exceeds Staff Hub resolution authority (e.g. platform policy changes, tenant suspensions, cryptographic ledger overrides), staff members can mail the Super-Admin directly.
                </p>
                <Button
                  variant="primary"
                  className="w-full justify-center bg-navy hover:bg-navy/90 text-white"
                  onClick={() => setIsMailAdminOpen(true)}
                >
                  <Mail className="w-4 h-4 mr-1.5 text-coral" /> Compose Official Escalation Mail to Admin
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR & APPOINTMENT AUDIT */}
      {activeTab === 'DOCTORS_AUDIT' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Doctor Credential Verification & Appointment Audits</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Audit doctor registrations, licenses, completed consultations, and money transacted
              </p>
            </div>
            <Badge variant="neutral">{doctorsAuditList.length} Doctors Audited</Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-warm-light-grey text-slate text-[11px] font-bold uppercase tracking-wider border-b border-soft-grey">
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Medical Council License</th>
                  <th className="py-3 px-4">Completed Appointments</th>
                  <th className="py-3 px-4">Post-Appointment Notes Sample</th>
                  <th className="py-3 px-4">Transacted Amount</th>
                  <th className="py-3 px-4 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {doctorsAuditList.map((doc) => (
                  <tr key={doc.id} className="hover:bg-warm-light-grey/40">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy">{doc.name}</div>
                      <div className="text-[10px] text-slate">{doc.specialty}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">{doc.councilNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-navy">{doc.appointmentsCompleted} Completed</td>
                    <td className="py-3.5 px-4 text-slate italic max-w-xs truncate">{doc.lastAppointmentNotes}</td>
                    <td className="py-3.5 px-4 font-bold font-mono text-emerald-800">{doc.moneyTransacted}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge variant="success">VERIFIED ✓</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: HOSPITAL TARIFFS (SURGERY, TEST, DOCTOR COSTS) */}
      {activeTab === 'HOSPITAL_TARIFFS' && (
        <div ref={tariffsSectionRef} className="space-y-6">
          <StaffTariffAuditorStudio />
        </div>
      )}

      {/* TAB 4: PATIENT RECORDS ARCHIVE */}
      {activeTab === 'PATIENT_RECORDS' && (
        <div ref={recordsSectionRef}>
          <Card>
          <CardHeader>
            <div>
              <CardTitle>Patient Health Records & Test Archive</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Structured verification and long-term storage of previous and present health records
              </p>
            </div>
            <Badge variant="neutral">DPDP COMPLIANT</Badge>
          </CardHeader>

          <div className="divide-y divide-soft-grey">
            {patientRecordsArchive.map((p) => (
              <div key={p.patientId} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy">{p.name}</span>
                    <Badge variant="info">ABHA: {p.abhaId}</Badge>
                    <span className="text-[11px] text-slate font-medium">({p.recordsStored} Encrypted Documents)</span>
                  </div>
                  <p className="text-xs text-navy font-semibold">
                    Present Diagnosis: <span className="text-emerald-800">{p.presentDiagnosis}</span>
                  </p>
                  <p className="text-[11px] text-slate">
                    Historical Archive: {p.pastRecords}
                  </p>
                  <p className="text-[10px] font-mono text-slate">
                    Integrity Block: {p.integrityHash}
                  </p>
                </div>

                <Badge variant="success">STORED & VERIFIED</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      )}

      {/* TAB 5: CYBER THREAT & DATA LEAK SOC */}
      {activeTab === 'CYBER_SOC' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Cybersecurity, Data Leak & Payment Protection Monitor</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Real-time security operations center (SOC) telemetry and DPDP privacy boundary enforcement
              </p>
            </div>
            <Badge variant="success">SOC ACTIVE</Badge>
          </CardHeader>

          <div className="divide-y divide-soft-grey">
            {securityLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-navy">{log.id}</span>
                    <Badge variant={log.status === 'BLOCKED' ? 'critical' : 'success'}>
                      {log.type}
                    </Badge>
                    <span className="text-[11px] text-slate">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate">{log.details}</p>
                </div>
                <Badge variant="neutral">{log.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 6: PATHOLOGIST SIGN-OFF & PHARMACY */}
      {activeTab === 'LAB_PHARMACY' && (
        <div ref={labSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pathologist Digital Signature Gatekeeper</CardTitle>
                <p className="text-xs text-slate mt-0.5">CAT-10: Laboratory reports must be digitally authorized before release</p>
              </div>
            </CardHeader>

            <div className="divide-y divide-soft-grey">
              {labResults.map((r: any) => (
                <div key={r.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy block">{r.testName}</span>
                    <span className="text-slate">{r.value} ({r.referenceRange})</span>
                  </div>
                  {r.isValidated ? (
                    <Badge variant="success">VALIDATED ✓</Badge>
                  ) : (
                    <Button size="sm" variant="primary" onClick={() => setSelectedLabResultToValidate(r)}>
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Sign Result
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Hospital Pharmacy Stock Ledger</CardTitle>
                <p className="text-xs text-slate mt-0.5">Real-time inventory levels with atomic decrement upon dispense</p>
              </div>
            </CardHeader>

            <div className="divide-y divide-soft-grey">
              {safeFormulary.slice(0, 4).map((m: any) => (
                <div key={m.id || m.name} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy block">{m.medicationName || m.name}</span>
                    <span className="text-slate font-mono">Batch: {m.batchNumber || 'BATCH-2026-A1'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy block">{m.quantityAvailable || 100} Units</span>
                    <Button size="sm" variant="secondary" onClick={() => setDispenseMedication(m)}>
                      Dispense
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: COMPOSE MAIL TO ADMIN */}
      {isMailAdminOpen && (
        <Modal
          isOpen={isMailAdminOpen}
          onClose={() => setIsMailAdminOpen(false)}
          title="Compose High-Level Issue Mail to Platform Super-Admin"
          description="Escalate policy overrides, hospital pricing threshold approvals, or critical compliance incidents."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsMailAdminOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendMailToAdmin}>
                <Send className="w-4 h-4 mr-1.5" /> Dispatch Mail to Super-Admin
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Escalation Subject"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
            />

            <div>
              <label className="font-bold text-navy block mb-1">Detailed Operational Request</label>
              <textarea
                rows={4}
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>

            <div className="p-3 rounded-md bg-amber-soft border border-amber-300 text-amber-900 text-[11px] leading-relaxed">
              <strong>Admin Escalation Protocol:</strong> Only Platform Super-Admins have clearance to alter global system parameters or approve multi-tenant overrides.
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: VALIDATE LAB RESULT */}
      {selectedLabResultToValidate && (
        <Modal
          isOpen={!!selectedLabResultToValidate}
          onClose={() => setSelectedLabResultToValidate(null)}
          title={`Pathologist Digital Authorization — ${selectedLabResultToValidate.testName}`}
          description="Signs and publishes laboratory results to patient portal and attending physician."
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedLabResultToValidate(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleValidateResult}>
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Apply Digital Signature
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <Input
              label="Pathologist RMP License Number"
              value={pathologistLicense}
              onChange={(e) => setPathologistLicense(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* MODAL: DISPENSE PHARMACY */}
      {dispenseMedication && (
        <Modal
          isOpen={!!dispenseMedication}
          onClose={() => setDispenseMedication(null)}
          title={`Dispense: ${dispenseMedication.medicationName || dispenseMedication.name}`}
          description="Executes atomic inventory decrement."
          footer={
            <>
              <Button variant="secondary" onClick={() => setDispenseMedication(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDispenseMedication} isLoading={isDispensing}>
                Confirm Dispense
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <Input
              label="Units to Dispense"
              type="number"
              value={dispenseQuantity}
              onChange={(e) => setDispenseQuantity(Number(e.target.value))}
            />
          </div>
        </Modal>
      )}

      {/* Persistent Floating Staff Command Dock */}
      <FloatingStaffDock
        onFocusSoc={() => {
          setActiveTab('CYBER_SOC');
          sound.playClick();
        }}
        onFocusTariffs={() => {
          setActiveTab('HOSPITAL_TARIFFS');
          tariffsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusRecords={() => {
          setActiveTab('PATIENT_RECORDS');
          recordsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusLab={() => {
          setActiveTab('LAB_PHARMACY');
          labSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenMailAdmin={() => setIsMailAdminOpen(true)}
        onTriggerSocScan={handleTriggerSocScan}
      />
    </div>
  );
};
