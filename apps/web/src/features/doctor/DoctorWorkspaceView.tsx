import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { TiltCard } from '@/components/ui/TiltCard';
import { DoctorTeleconsultationSuite } from './DoctorTeleconsultationSuite';
import { DoctorPatientHistoryLocker } from './DoctorPatientHistoryLocker';
import { FloatingDoctorDock } from './FloatingDoctorDock';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  FileText,
  Lock,
  CheckCircle2,
  Volume2,
  Clock,
  Sparkles,
  Pill,
  FilePlus,
  RefreshCw,
  Eye,
  ShieldCheck,
  Send,
  Building2,
  Video,
  User,
  BookOpen,
  Award,
  Play,
  Check,
  Edit,
  Radio,
  Mic,
  QrCode,
  Shield,
  Download,
  Share2,
} from 'lucide-react';

export const DoctorWorkspaceView: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const [queueTokens, setQueueTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Dual Practice Location Switcher: Hospital vs Private Clinic
  const [activePracticeLocation, setActivePracticeLocation] = useState<'HOSPITAL' | 'PRIVATE_CLINIC'>('HOSPITAL');

  // 2. Doctor Profile State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState({
    fullName: 'Dr. Ananya Sharma',
    rmpNumber: 'KMC-77412',
    degrees: 'MBBS, MD (General Medicine), DM (Cardiology)',
    specialty: 'Interventional & Preventive Cardiology',
    casesHandled: 4200,
    surgeriesCount: 420,
    publications: 'Contemporary Management of Acute Coronary Syndromes in Urban India (Indian Heart Journal 2024)',
    hospitalName: 'CityCare Super Specialty Hospital',
    clinicName: 'Sharma Advanced Heart Clinic (Koramangala)',
    hospitalFee: 800,
    clinicFee: 700,
  });
  const [profileSubmitSuccess, setProfileSubmitSuccess] = useState<string | null>(null);

  // 3. Active Encounter & Patient State
  const [activePatient, setActivePatient] = useState({
    id: 'usr-pat-001',
    name: 'Rahul Verma',
    age: 42,
    gender: 'Male',
    bloodGroup: 'O+ve',
    abhaId: '91-4209-8812-3904',
    chiefComplaint: 'Flu symptoms, body aches, sore throat, and mild hypertension follow-up',
    hasConsentForRecords: true,
    consultationMode: 'ONLINE_TELEMEDICINE',
  });

  const [vitals, setVitals] = useState({
    bloodPressure: '128/84',
    pulseBpm: '74',
    spO2Percent: '98',
    temperatureFahrenheit: '99.2',
    weightKg: '68',
  });

  const [soap, setSoap] = useState({
    subjective: 'Patient reports flu infection with 2 days of fever (101F), sore throat, and mild dizziness. Currently on Telmisartan for hypertension.',
    objective: 'BP 128/84 mmHg, Pulse 74 bpm, Throat erythematous with mild pharyngeal congestion. Chest clear to auscultation.',
    assessment: '1. Viral Upper Respiratory Tract Infection (Flu). 2. Stage 1 Essential Hypertension (ICD-10: I10), controlled.',
    plan: 'Paracetamol 650mg for fever. Warm salt water gargles. Continue Telmisartan 40mg. Review after 3 days if fever persists.',
  });

  // 4. Digital Prescription State
  const [prescriptionItems, setPrescriptionItems] = useState([
    { name: 'Paracetamol 650mg', dose: '1 Tab', freq: '1-0-1', food: 'After Food (SOS for fever)', days: '5 Days' },
    { name: 'Cetirizine 10mg', dose: '1 Tab', freq: '0-0-1', food: 'At Bedtime', days: '3 Days' },
    { name: 'Telmisartan 40mg', dose: '1 Tab', freq: '1-0-0', food: 'After Breakfast', days: '30 Days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('1 Tab');
  const [newMedFreq, setNewMedFreq] = useState('1-0-1');
  const [newMedFood, setNewMedFood] = useState('After Food');
  const [newMedDays, setNewMedDays] = useState('5 Days');
  const [isSigned, setIsSigned] = useState(false);
  const [signSuccess, setSignSuccess] = useState<string | null>(null);

  // 5. AI Dual-View Diagnostic Report Analyzer State
  const [isDualViewOpen, setIsDualViewOpen] = useState(false);
  const [aiAccepted, setAiAccepted] = useState(false);

  // 6. Online Video Consultation Session State
  const [isOnlineSessionActive, setIsOnlineSessionActive] = useState(false);
  const [zoomMeetLink, setZoomMeetLink] = useState('https://meet.google.com/svas-care-9021');
  const [recordingPlaybackUrl, setRecordingPlaybackUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [isTeleconsultSuiteOpen, setIsTeleconsultSuiteOpen] = useState(false);

  // 7. Voice Scribe Dictation State
  const [isVoiceDictating, setIsVoiceDictating] = useState(false);

  // Section Refs for smooth scrolling navigation
  const historySectionRef = useRef<HTMLDivElement>(null);
  const prescriptionSectionRef = useRef<HTMLDivElement>(null);

  // Calling chime feedback
  const [callingFeedback, setCallingFeedback] = useState<string | null>(null);

  const handleVoiceDictation = () => {
    sound.playTelemetryBeep();
    setIsVoiceDictating(true);
    setTimeout(() => {
      setIsVoiceDictating(false);
      setSoap((prev) => ({
        ...prev,
        subjective: `${prev.subjective} [AI Voice Scribe: Patient confirms 2 days of low-grade fever with mild morning dizzy spells after morning dose of Telmisartan 40mg. Denies chest pain, orthopnea, or pedal edema.]`,
      }));
    }, 2000);
  };

  const handleCallNextPatient = () => {
    sound.playChime();
    setCallingFeedback('📢 Calling Token #104 (Rahul Verma) to Cardiology Consultation Chamber 3...');
    setTimeout(() => setCallingFeedback(null), 5000);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getState();
      setState(res);
      setQueueTokens(Array.isArray(res?.queueTokens) ? res.queueTokens : []);
    } catch (err) {
      console.error('Failed to load doctor workspace state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.setAuth('DOCTOR_RMP', 'usr-doc-sharma');
    fetchData();
  }, []);

  // Submit Profile Update to Hospital Authority
  const handleSubmitProfileToHospital = () => {
    setProfileSubmitSuccess(
      `Profile submitted to ${doctorProfile.hospitalName}! A verification pop-up notification has been triggered on the Hospital Authority portal.`
    );
    setIsProfileModalOpen(false);
  };

  // Add Medication to Prescription
  const handleAddMedication = () => {
    if (!newMedName) return;
    setPrescriptionItems([
      ...prescriptionItems,
      { name: newMedName, dose: newMedDose, freq: newMedFreq, food: newMedFood, days: newMedDays },
    ]);
    setNewMedName('');
  };

  // Digital Signature & Sync Prescription to Patient Portal
  const handleSignPrescription = async () => {
    try {
      sound.playChime();
      setIsSigned(true);
      await api.signEncounter({
        encounterId: 'enc-active-001',
        doctorRmpId: 'usr-doc-sharma',
        rmpLicenseNumber: doctorProfile.rmpNumber,
        notes: `${soap.subjective}\n\n${soap.assessment}\n\n${soap.plan}`,
        vitals,
        diagnosis: 'Viral URTI (Flu) + Essential Hypertension',
        prescription: prescriptionItems,
      });
      setSignSuccess(
        `Digital Prescription signed with RMP License ${doctorProfile.rmpNumber}. It is now immediately published and visible in ${activePatient.name}'s Patient Portal!`
      );
    } catch (err: any) {
      alert(`Signature failed: ${err.message}`);
    }
  };

  // AI SOAP Note Draft
  const handleAiDraftSoap = async () => {
    try {
      const res = await api.aiSoapDraft('enc-active-001', soap.subjective);
      if (res.draft) {
        setSoap((prev) => ({
          ...prev,
          assessment: res.draft.assessment || prev.assessment,
          plan: res.draft.plan || prev.plan,
        }));
      }
    } catch (err: any) {
      alert(`AI Drafting failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <HeroBanner
        title="Doctor Clinical Workspace — Active Patient Encounter"
        subtitle="Manage clinical consultations, review consent-gated patient records with AI dual-view highlights, join recorded teleconsultation sessions, and author signed digital prescriptions."
        badgeText="RMP ACTIVE • KMC-77412"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsProfileModalOpen(true)}>
              <Edit className="w-4 h-4 mr-1.5" /> Edit My Profile & Fees
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchData} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Queue
            </Button>
          </div>
        }
      />

      {/* Calling Feedback Announcer Toast */}
      {callingFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-navy to-sky-700 text-white text-xs font-bold flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-300 animate-bounce" />
            <span>{callingFeedback}</span>
          </div>
          <button onClick={() => setCallingFeedback(null)} className="text-white/80 hover:text-white">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Profile Submission Success Alert */}
      {profileSubmitSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{profileSubmitSuccess}</span>
          </div>
          <button onClick={() => setProfileSubmitSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* Prescription Signed Success Alert */}
      {signSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{signSuccess}</span>
          </div>
          <button onClick={() => setSignSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* PRACTICE LOCATION SWITCHER STRIP */}
      <div className="bg-white rounded-xl border border-soft-grey p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-soft text-emerald-800 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy text-sm">{doctorProfile.fullName}</span>
              <Badge variant="neutral">{doctorProfile.rmpNumber}</Badge>
            </div>
            <p className="text-xs text-slate">{doctorProfile.degrees}</p>
          </div>
        </div>

        {/* Practice Toggle */}
        <div className="flex items-center gap-2 bg-warm-light-grey p-1 rounded-lg border border-soft-grey text-xs font-bold">
          <button
            onClick={() => setActivePracticeLocation('HOSPITAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activePracticeLocation === 'HOSPITAL'
                ? 'bg-white text-navy shadow-xs border border-soft-grey'
                : 'text-slate hover:text-navy'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-coral" />
            <span>CityCare Hospital (Fee: ₹{doctorProfile.hospitalFee})</span>
          </button>

          <button
            onClick={() => setActivePracticeLocation('PRIVATE_CLINIC')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activePracticeLocation === 'PRIVATE_CLINIC'
                ? 'bg-white text-navy shadow-xs border border-soft-grey'
                : 'text-slate hover:text-navy'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Clinic (Fee: ₹{doctorProfile.clinicFee})</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PATIENT ENCOUNTER BANNER & CONSENT GATE */}
      <div className="p-5 rounded-xl bg-white border border-soft-grey shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-soft-grey">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-navy font-display">
                Active Encounter: {activePatient.name}
              </span>
              <span className="text-xs text-slate font-medium">({activePatient.age}y, {activePatient.gender})</span>
              <Badge variant="info">ABHA: {activePatient.abhaId}</Badge>
              <Badge variant="warning">{activePatient.consultationMode.replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-navy font-semibold">
              Chief Complaint: <span className="text-slate font-normal">{activePatient.chiefComplaint}</span>
            </p>
          </div>

          {/* Consent Status & AI Dual-View Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {activePatient.hasConsentForRecords ? (
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
                onClick={() => setIsDualViewOpen(true)}
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> Open AI Dual-View Report Analyzer
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 border border-coral-deep/30 text-coral-deep text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                Records Locked: Patient Withheld Consent
              </span>
            )}

            {/* Online Video Link Button */}
            {activePatient.consultationMode === 'ONLINE_TELEMEDICINE' && (
              <Button
                variant="primary"
                size="sm"
                className="bg-navy hover:bg-navy/90 text-white shadow-2xs"
                onClick={() => {
                  sound.playClick();
                  setIsTeleconsultSuiteOpen(true);
                }}
              >
                <Video className="w-4 h-4 mr-1.5 text-coral" />
                <span>Launch Telehealth HUD (Zoom / Meet)</span>
              </Button>
            )}
          </div>
        </div>

        {/* Live Vitals Bar & Cardiac Rhythm */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate px-1">
            <span className="flex items-center gap-1.5 text-navy">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
              </span>
              Real-time Bedside & Telemetry Tele-Monitoring
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate">LEAD II ECG</span>
              <EcgPulse color="#FF5B47" width={140} height={22} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-2.5 rounded-lg bg-warm-light-grey/80 border border-soft-grey text-center hover:border-coral transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate block">Blood Pressure</span>
              <span className="text-xs font-bold font-mono text-navy">{vitals.bloodPressure} mmHg</span>
            </div>
            <div className="p-2.5 rounded-lg bg-warm-light-grey/80 border border-soft-grey text-center hover:border-coral transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate block">Pulse Rate</span>
              <span className="text-xs font-bold font-mono text-navy">{vitals.pulseBpm} bpm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-warm-light-grey/80 border border-soft-grey text-center hover:border-emerald-600 transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate block">Oxygen SpO2</span>
              <span className="text-xs font-bold font-mono text-emerald-800">{vitals.spO2Percent}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-warm-light-grey/80 border border-soft-grey text-center hover:border-coral-deep transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate block">Temperature</span>
              <span className="text-xs font-bold font-mono text-coral-deep">{vitals.temperatureFahrenheit}°F</span>
            </div>
            <div className="p-2.5 rounded-lg bg-warm-light-grey/80 border border-soft-grey text-center hover:border-navy transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate block">Body Weight</span>
              <span className="text-xs font-bold font-mono text-navy">{vitals.weightKg} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* PATIENT PAST HEALTH LOCKER & PRESCRIPTION TIMELINE (CONSENT-GATED) */}
      <div ref={historySectionRef}>
        <DoctorPatientHistoryLocker
          patientName={activePatient.name}
          patientAbha={activePatient.abhaId}
          hasConsent={activePatient.hasConsentForRecords}
          onOpenDualView={() => setIsDualViewOpen(true)}
        />
      </div>

      {/* TWO-COLUMN WORKSPACE: SOAP NOTES & DIGITAL PRESCRIPTION */}
      <div ref={prescriptionSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Clinical SOAP Documentation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-coral" />
              <div>
                <CardTitle>Clinical SOAP Documentation</CardTitle>
                <p className="text-xs text-slate mt-0.5">Subjective, Objective, Assessment and Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleVoiceDictation}
                title="Dictate symptoms into Subjective note"
              >
                <Mic className="w-3.5 h-3.5 mr-1 text-coral" />
                <span>Voice Scribe</span>
              </Button>
              <Button variant="secondary" size="sm" onClick={handleAiDraftSoap}>
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" /> AI Draft
              </Button>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs">
            {isVoiceDictating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-amber-soft border border-amber-300 text-amber-900 text-xs flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>AI Voice Scribe is listening & transcribing into Subjective...</span>
                </div>
                <EcgPulse color="#D97706" width={90} height={18} />
              </motion.div>
            )}
            <div>
              <label className="font-bold text-navy block mb-1">Subjective (Patient Symptoms & History)</label>
              <textarea
                rows={2}
                value={soap.subjective}
                onChange={(e) => setSoap({ ...soap, subjective: e.target.value })}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>

            <div>
              <label className="font-bold text-navy block mb-1">Objective (Examination & Vitals)</label>
              <textarea
                rows={2}
                value={soap.objective}
                onChange={(e) => setSoap({ ...soap, objective: e.target.value })}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>

            <div>
              <label className="font-bold text-navy block mb-1">Assessment (Diagnosis & ICD-10)</label>
              <textarea
                rows={2}
                value={soap.assessment}
                onChange={(e) => setSoap({ ...soap, assessment: e.target.value })}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>

            <div>
              <label className="font-bold text-navy block mb-1">Plan (Therapeutic & Follow-up)</label>
              <textarea
                rows={2}
                value={soap.plan}
                onChange={(e) => setSoap({ ...soap, plan: e.target.value })}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>
          </div>
        </Card>

        {/* Column 2: Digital Prescription & Medication List */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <div>
                <CardTitle>Digital Prescription Authoring</CardTitle>
                <p className="text-xs text-slate mt-0.5">Author and digitally sign prescription for instant patient portal sync</p>
              </div>
            </div>
            <Badge variant={isSigned ? 'success' : 'warning'}>
              {isSigned ? 'SIGNED & SYNCED' : 'DRAFT'}
            </Badge>
          </CardHeader>

          <div className="space-y-4">
            {/* Medications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-warm-light-grey text-slate text-[10px] font-bold uppercase tracking-wider border-b border-soft-grey">
                    <th className="py-2 px-3">Medication</th>
                    <th className="py-2 px-3">Dose</th>
                    <th className="py-2 px-3">Frequency</th>
                    <th className="py-2 px-3">Timing</th>
                    <th className="py-2 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-grey">
                  {prescriptionItems.map((med, idx) => (
                    <tr key={idx} className="hover:bg-warm-light-grey/40">
                      <td className="py-2 px-3 font-bold text-navy">{med.name}</td>
                      <td className="py-2 px-3 text-slate">{med.dose}</td>
                      <td className="py-2 px-3 font-mono font-bold text-coral-deep">{med.freq}</td>
                      <td className="py-2 px-3 text-slate">{med.food}</td>
                      <td className="py-2 px-3 text-navy">{med.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Medication Mini-Form */}
            <div className="p-3 rounded-lg bg-warm-light-grey/70 border border-soft-grey space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate block">Add New Medication</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="bg-white border border-soft-grey rounded-md p-1.5 text-xs text-navy"
                />
                <input
                  type="text"
                  placeholder="Dose (1 Tab)"
                  value={newMedDose}
                  onChange={(e) => setNewMedDose(e.target.value)}
                  className="bg-white border border-soft-grey rounded-md p-1.5 text-xs text-navy"
                />
                <input
                  type="text"
                  placeholder="Freq (1-0-1)"
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(e.target.value)}
                  className="bg-white border border-soft-grey rounded-md p-1.5 text-xs text-navy"
                />
                <input
                  type="text"
                  placeholder="Days (5 Days)"
                  value={newMedDays}
                  onChange={(e) => setNewMedDays(e.target.value)}
                  className="bg-white border border-soft-grey rounded-md p-1.5 text-xs text-navy"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button size="sm" variant="secondary" onClick={handleAddMedication}>
                  <FilePlus className="w-3.5 h-3.5 mr-1" /> Add Medicine
                </Button>
              </div>
            </div>

            {/* Automated Pharmacology Drug-Drug Interaction Safety Bar */}
            <div className="p-3 rounded-lg bg-emerald-soft/50 border border-emerald-500/30 text-emerald-950 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI Pharmacology Safety Check: Clean Profile</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                No adverse drug-drug interactions detected between Telmisartan (ARB), Paracetamol (Analgesic), and Cetirizine (Antihistamine). Renal & hepatic clearance safe.
              </p>
            </div>

            {/* ABDM Cryptographic Stamp */}
            <div className="p-3 rounded-lg bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between text-xs text-slate">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-white border border-soft-grey flex items-center justify-center text-navy font-mono font-bold text-[10px]">
                  ABDM
                </div>
                <div>
                  <span className="font-bold text-navy block text-[11px]">ABDM FHIR R4 Compliant E-Prescription</span>
                  <span className="font-mono text-[10px] text-slate block truncate max-w-[200px]">Hash: sha256:7b1e89...34ca9</span>
                </div>
              </div>
              <Badge variant="success">DIGITALLY SECURED</Badge>
            </div>

            {/* Digital Signature Action */}
            <div className="pt-2 border-t border-soft-grey flex items-center justify-between">
              <div className="text-[11px] text-slate">
                Applying signature binds RMP license: <strong>{doctorProfile.rmpNumber}</strong>
              </div>

              {isSigned ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-soft border border-emerald-500 text-emerald-900 font-bold text-xs shadow-glow-emerald"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>CRYPTOGRAPHICALLY SIGNED & SYNCED</span>
                </motion.div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSignPrescription}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white shimmer-button"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Sign & Sync to Patient Portal
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* MODAL 1: DOCTOR PROFILE & CREDENTIALS EDITOR */}
      {isProfileModalOpen && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Doctor Professional Profile & Consultation Fees"
          description="Update your degrees, clinical case count, published books, and clinic affiliations. Submitting triggers an approval notification on the hospital portal."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsProfileModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitProfileToHospital}>
                Submit Profile to Hospital Authority
              </Button>
            </>
          }
        >
          <div className="space-y-3.5 text-xs">
            <Input
              label="Doctor Full Name"
              value={doctorProfile.fullName}
              onChange={(e) => setDoctorProfile({ ...doctorProfile, fullName: e.target.value })}
            />

            <Input
              label="Medical Council RMP Number"
              value={doctorProfile.rmpNumber}
              onChange={(e) => setDoctorProfile({ ...doctorProfile, rmpNumber: e.target.value })}
            />

            <Input
              label="Academic Degrees & Fellowships"
              value={doctorProfile.degrees}
              onChange={(e) => setDoctorProfile({ ...doctorProfile, degrees: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Number of Cases Handled"
                type="number"
                value={doctorProfile.casesHandled}
                onChange={(e) => setDoctorProfile({ ...doctorProfile, casesHandled: Number(e.target.value) })}
              />

              <Input
                label="Operative Surgeries Done"
                type="number"
                value={doctorProfile.surgeriesCount}
                onChange={(e) => setDoctorProfile({ ...doctorProfile, surgeriesCount: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Published Books / Scientific Research Papers"
              value={doctorProfile.publications}
              onChange={(e) => setDoctorProfile({ ...doctorProfile, publications: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Private Clinic Practice Name"
                value={doctorProfile.clinicName}
                onChange={(e) => setDoctorProfile({ ...doctorProfile, clinicName: e.target.value })}
              />

              <Input
                label="Hospital Affiliation Name"
                value={doctorProfile.hospitalName}
                onChange={(e) => setDoctorProfile({ ...doctorProfile, hospitalName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Hospital Consultation Fee (INR)"
                type="number"
                value={doctorProfile.hospitalFee}
                onChange={(e) => setDoctorProfile({ ...doctorProfile, hospitalFee: Number(e.target.value) })}
              />

              <Input
                label="Private Clinic Fee (INR)"
                type="number"
                value={doctorProfile.clinicFee}
                onChange={(e) => setDoctorProfile({ ...doctorProfile, clinicFee: Number(e.target.value) })}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: AI DUAL-VIEW REPORT ANALYZER */}
      {isDualViewOpen && (
        <Modal
          isOpen={isDualViewOpen}
          onClose={() => setIsDualViewOpen(false)}
          title={`AI Diagnostic Dual-View Report Analyzer — ${activePatient.name}`}
          description="Side-by-side inspection of patient's original lab report and clinical AI extraction with abnormal highlights."
          footer={
            <Button variant="secondary" onClick={() => setIsDualViewOpen(false)}>
              Close Dual-View
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Original Document with Laser Scan Animation */}
            <div className="p-4 rounded-lg bg-warm-light-grey border border-soft-grey space-y-2 relative overflow-hidden">
              {/* Dynamic Laser Scanning Line */}
              <motion.div
                animate={{ y: [0, 220, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-coral to-transparent shadow-[0_0_10px_#FF5B47] pointer-events-none z-10"
              />

              <div className="flex items-center justify-between pb-2 border-b border-soft-grey relative z-20">
                <span className="font-bold text-navy flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate" />
                  Original Raw Laboratory Report
                </span>
                <Badge variant="neutral">PDF SOURCE • SCANNING</Badge>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate relative z-20">
                <p>PATIENT: Rahul Verma (Age 42)</p>
                <p>TEST: Comprehensive Lipid Profile & CBC</p>
                <p>DATE: 2026-09-02 | LAB: CityCare Central</p>
                <div className="p-3 bg-white rounded border border-soft-grey space-y-1 text-navy mt-2 shadow-2xs">
                  <p>• Total Cholesterol: 218 mg/dL (Ref: &lt; 200)</p>
                  <p>• Triglycerides: 185 mg/dL (Ref: &lt; 150)</p>
                  <p>• HDL-C: 44 mg/dL (Ref: &gt; 40)</p>
                  <p>• LDL-C: 137 mg/dL (Ref: &lt; 100)</p>
                  <p>• Hemoglobin: 13.8 g/dL (Ref: 12.5 - 16.0)</p>
                  <p>• WBC Count: 9,400 /uL (Ref: 4,000 - 11,000)</p>
                </div>
              </div>
            </div>

            {/* Right: AI-Extracted Highlights */}
            <div className="p-4 rounded-lg bg-emerald-soft/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                <span className="font-bold text-navy flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Clinical Highlights & Analysis
                </span>
                <Badge variant="success">EXTRACTED</Badge>
              </div>

              <div className="space-y-2 text-[11px] text-slate">
                <div className="p-2.5 rounded bg-white border border-emerald-500/30 space-y-1">
                  <span className="text-coral-deep font-bold block">
                    ⚠️ ABNORMAL: Borderline Hypercholesterolemia
                  </span>
                  <p className="text-slate">
                    Total Cholesterol (218 mg/dL) and LDL (137 mg/dL) exceed optimal cardiovascular targets.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-white border border-emerald-500/30 space-y-1">
                  <span className="text-emerald-800 font-bold block">
                    ✓ NORMAL: Hematology & Cell Counts
                  </span>
                  <p className="text-slate">
                    Hemoglobin (13.8 g/dL) and WBC (9,400) within normal limits. No active bacterial sepsis.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-warm-light-grey text-navy font-medium">
                  <strong>Clinical Suggestion:</strong> Initiate low saturated fat diet, 30 min daily aerobic exercise. Consider low-dose Atorvastatin if repeat lipid profile in 3 months remains &gt; 200 mg/dL.
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Teleconsultation Suite Modal (Zoom / Google Meet) */}
      <DoctorTeleconsultationSuite
        patientName={activePatient.name}
        patientAbha={activePatient.abhaId}
        doctorName={doctorProfile.fullName}
        doctorRmp={doctorProfile.rmpNumber}
        isOpen={isTeleconsultSuiteOpen}
        onClose={() => setIsTeleconsultSuiteOpen(false)}
        onOpenDualView={() => {
          setIsTeleconsultSuiteOpen(false);
          setIsDualViewOpen(true);
        }}
      />

      {/* Persistent Floating Doctor Command Dock */}
      <FloatingDoctorDock
        onLaunchVideo={() => setIsTeleconsultSuiteOpen(true)}
        onJumpToHistory={() => historySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onVoiceDictation={handleVoiceDictation}
        onSignPrescription={handleSignPrescription}
        onTogglePractice={() => {
          const nextMode = activePracticeLocation === 'HOSPITAL' ? 'PRIVATE_CLINIC' : 'HOSPITAL';
          setActivePracticeLocation(nextMode);
          sound.playClick();
        }}
        activePractice={activePracticeLocation}
        isSigned={isSigned}
        onCallNextPatient={handleCallNextPatient}
      />
    </div>
  );
};
