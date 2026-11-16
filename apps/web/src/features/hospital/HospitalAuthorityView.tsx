import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TiltCard } from '@/components/ui/TiltCard';
import { HospitalFleetAndOtSuite } from './HospitalFleetAndOtSuite';
import { DoctorVerificationModal } from './DoctorVerificationModal';
import { FloatingHospitalDock } from './FloatingHospitalDock';
import { HospitalBed3DMatrix } from './HospitalBed3DMatrix';
import { EmpanelledInsuranceGrid } from './EmpanelledInsuranceGrid';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  Building2,
  BedDouble,
  Activity,
  Ambulance,
  Scissors,
  Droplet,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Stethoscope,
  Plus,
  Edit2,
  Shield,
  FileText,
  Upload,
  Phone,
  Lock,
  Eye,
  Check,
  X,
  Clock,
  Layers,
} from 'lucide-react';

export const HospitalAuthorityView: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const [beds, setBeds] = useState<any[]>([]);
  const [otBookings, setOtBookings] = useState<any[]>([]);
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [bloodStock, setBloodStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab: OVERVIEW | FLEET_AND_OT | BOOKINGS | DOCTOR_APPROVALS | SURGERIES | TESTS | DEPARTMENTS
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DEPARTMENTS' | 'DOCTOR_APPROVALS' | 'SURGERIES' | 'TESTS' | 'BOOKINGS' | 'BEDS' | 'FLEET_AND_OT'>('OVERVIEW');

  // 1. Clinical Departments State
  const [departments, setDepartments] = useState<string[]>([
    'Cardiology & Cardiac Surgery',
    'General Medicine & Infectious Diseases',
    'Neurology & Neurosurgery',
    'Orthopaedics & Joint Replacement',
    'Paediatrics & Neonatology',
    'Oncology & Chemotherapy',
    'Emergency & Trauma Care',
    'Obstetrics & Gynaecology',
  ]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);

  // 2. Doctor Registration Verification Queue State
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([
    {
      id: 'doc-kavita-03',
      fullName: 'Dr. Kavita Deshmukh',
      degrees: 'MBBS, MS (General Surgery), MCh (Surgical Oncology)',
      specialty: 'Surgical Oncology',
      casesHandled: 1850,
      surgeriesCount: 520,
      publications: ['Early Biomarkers in Pancreatic Neoplasia, Indian J Surg Oncol 2024'],
      consultationFee: '₹900',
      clinicAffiliation: 'Deshmukh Onco Clinic, Indiranagar',
      status: 'PENDING_HOSPITAL_VERIFICATION',
      submittedAt: 'Today, 08:30 AM',
    },
  ]);
  const [selectedDoctorToVerify, setSelectedDoctorToVerify] = useState<any | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);

  // 3. Surgery Pricing Catalog State
  const [surgeryCatalog, setSurgeryCatalog] = useState<any[]>([
    { id: 'surg-01', name: 'Coronary Artery Bypass Graft (CABG)', code: 'SURG-CABG-01', price: 280000, category: 'Cardiothoracic' },
    { id: 'surg-02', name: 'Total Knee Arthroplasty (TKR)', code: 'SURG-ORTHO-02', price: 190000, category: 'Orthopaedics' },
    { id: 'surg-03', name: 'Laparoscopic Appendectomy', code: 'SURG-GEN-03', price: 45000, category: 'General Surgery' },
    { id: 'surg-04', name: 'Phacoemulsification Cataract Surgery', code: 'SURG-OPHTH-04', price: 28000, category: 'Ophthalmology' },
    { id: 'surg-05', name: 'Inguinal Hernioplasty with Mesh', code: 'SURG-GEN-05', price: 38000, category: 'General Surgery' },
  ]);
  const [editingSurgery, setEditingSurgery] = useState<any | null>(null);
  const [editSurgeryPrice, setEditSurgeryPrice] = useState<number>(0);

  // 4. Diagnostic Test Pricing Catalog State
  const [testCatalog, setTestCatalog] = useState<any[]>([
    { id: 'test-01', name: 'Complete Blood Count (CBC) with ESR', code: 'LAB-CBC-01', price: 350, turnaround: '2 Hours' },
    { id: 'test-02', name: 'Lipid Profile Comprehensive Panel', code: 'LAB-LIPID-02', price: 650, turnaround: '4 Hours' },
    { id: 'test-03', name: 'Thyroid Profile (T3, T4, TSH)', code: 'LAB-THY-03', price: 550, turnaround: '3 Hours' },
    { id: 'test-04', name: 'MRI Brain with Contrast (3.0 Tesla)', code: 'RAD-MRI-04', price: 6500, turnaround: 'Same Day' },
    { id: 'test-05', name: 'HRCT Chest (High Resolution)', code: 'RAD-CT-05', price: 4200, turnaround: 'Same Day' },
    { id: 'test-06', name: 'Echocardiogram (2D Echo with Doppler)', code: 'CARD-ECHO-06', price: 1800, turnaround: 'Instant' },
  ]);
  const [editingTest, setEditingTest] = useState<any | null>(null);
  const [editTestPrice, setEditTestPrice] = useState<number>(0);

  // 6. Patient Booking Requests Inbox State
  const [bookingRequests, setBookingRequests] = useState<any[]>([
    {
      id: 'req-apt-8812',
      patientName: 'Rahul Verma',
      patientPhone: '+91 98450 88219',
      purpose: 'Flu infection symptoms, acute fever & persistent body ache',
      doctorRequested: 'Dr. Rajesh Varma (General Medicine)',
      consultationType: 'Physical Visit at Hospital',
      requestedDate: 'Tomorrow, 10:00 AM',
      hasConsentForRecords: true,
      recordsCount: 2,
      status: 'PENDING_HOSPITAL_REVIEW',
    },
    {
      id: 'req-apt-8813',
      patientName: 'Priya Nair',
      patientPhone: '+91 97410 44102',
      purpose: 'Hypertension follow-up & ECG evaluation',
      doctorRequested: 'Dr. Ananya Sharma (Cardiology)',
      consultationType: 'Online Zoom/Meet Video Session',
      requestedDate: 'Today, 03:30 PM',
      hasConsentForRecords: false,
      recordsCount: 0,
      status: 'PENDING_HOSPITAL_REVIEW',
    },
  ]);
  const [viewingPatientRecords, setViewingPatientRecords] = useState<any | null>(null);

  // 7. Hospital Upload Prescription / Lab Report Modal State
  const [isUploadForPatientOpen, setIsUploadForPatientOpen] = useState(false);
  const [uploadPatientId, setUploadPatientId] = useState('usr-pat-001');
  const [uploadDocType, setUploadDocType] = useState<'PRESCRIPTION' | 'LAB_REPORT'>('PRESCRIPTION');
  const [uploadDocTitle, setUploadDocTitle] = useState('Official Hospital Discharge Summary & Prescription');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Ward and Bed management
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedBed, setSelectedBed] = useState<any | null>(null);
  const [patientIdToAdmit, setPatientIdToAdmit] = useState('usr-pat-001');
  const [admittingDiagnosis, setAdmittingDiagnosis] = useState('Acute Unstable Angina');
  const [isAdmitting, setIsAdmitting] = useState(false);
  const [admissionSuccess, setAdmissionSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stateRes, bedsRes, otRes, ambRes, bloodRes] = await Promise.all([
        api.getState(),
        api.getBeds(),
        api.getOtBookings(),
        api.getAmbulances(),
        api.getBloodStock(),
      ]);
      setState(stateRes);
      setBeds(Array.isArray(bedsRes) ? bedsRes : (bedsRes?.beds || stateRes?.beds || []));
      setOtBookings(Array.isArray(otRes) ? otRes : (otRes?.otBookings || stateRes?.otBookings || []));
      setAmbulances(Array.isArray(ambRes) ? ambRes : (ambRes?.dispatches || stateRes?.ambulanceDispatches || []));
      setBloodStock(Array.isArray(bloodRes) ? bloodRes : (bloodRes?.bloodStock || stateRes?.bloodStock || []));
    } catch (err) {
      console.error('Failed to load hospital authority state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.setAuth('HOSPITAL', 'usr-admin-citycare');
    fetchData();
  }, []);

  // Department Add
  const handleAddDepartment = () => {
    if (!newDepartmentName) return;
    setDepartments([...departments, newDepartmentName]);
    setNewDepartmentName('');
    setIsAddDeptModalOpen(false);
  };

  // Doctor Verification & Approval Handler
  const handleApproveDoctor = (doctor: any) => {
    setPendingDoctors((prev) => (Array.isArray(prev) ? prev.filter((d) => d.id !== doctor.id) : []));
    setVerificationSuccess(
      `Doctor ${doctor.fullName} (${doctor.specialty}) credentials verified and approved! Doctor profile is now published and visible on CityCare Hospital profile.`
    );
    setSelectedDoctorToVerify(null);
  };

  // Surgery Price Update
  const handleUpdateSurgeryPrice = () => {
    if (!editingSurgery) return;
    setSurgeryCatalog((prev) =>
      Array.isArray(prev)
        ? prev.map((s) => (s.id === editingSurgery.id ? { ...s, price: Number(editSurgeryPrice) } : s))
        : []
    );
    setEditingSurgery(null);
  };

  // Diagnostic Test Price Update
  const handleUpdateTestPrice = () => {
    if (!editingTest) return;
    setTestCatalog((prev) =>
      Array.isArray(prev)
        ? prev.map((t) => (t.id === editingTest.id ? { ...t, price: Number(editTestPrice) } : t))
        : []
    );
    setEditingTest(null);
  };

  // Accept Patient Booking Request (Triggers Payment Notification to Patient)
  const handleAcceptBooking = (booking: any) => {
    setBookingRequests((prev) =>
      Array.isArray(prev)
        ? prev.map((b) =>
            b.id === booking.id ? { ...b, status: 'ACCEPTED_WAITING_FOR_PAYMENT' } : b
          )
        : []
    );
    alert(
      `Booking request accepted for ${booking.patientName}! Payment notification has been dispatched to patient's Aegis Care portal.`
    );
  };

  // Decline Patient Booking Request
  const handleDeclineBooking = (booking: any) => {
    setBookingRequests((prev) => (Array.isArray(prev) ? prev.filter((b) => b.id !== booking.id) : []));
    alert(`Booking request declined for ${booking.patientName}. Patient notified.`);
  };

  // Upload Document for Patient
  const handleUploadDocumentForPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadSuccessMsg(
      `Successfully uploaded "${uploadDocTitle}" for Patient ${uploadPatientId}. It is now visible on their patient portal.`
    );
    setIsUploadForPatientOpen(false);
  };

  // Bed Admission
  const handleAdmitPatient = async () => {
    if (!selectedBed) return;
    try {
      setIsAdmitting(true);
      await api.admitPatient({
        patientId: patientIdToAdmit,
        bedId: selectedBed.id,
        admittingDoctorId: 'usr-doc-sharma',
        primaryDiagnosis: admittingDiagnosis,
      });
      setAdmissionSuccess(`Patient admitted to Bed ${selectedBed.bedNumber}. Ward census and bed telemetry updated.`);
      setSelectedBed(null);
      fetchData();
    } catch (err: any) {
      alert(`Admission failed: ${err.message}`);
    } finally {
      setIsAdmitting(false);
    }
  };

  const bedsList = Array.isArray(beds) ? beds : [];
  const safeBookingRequests = Array.isArray(bookingRequests) ? bookingRequests : [];
  const filteredBeds = Array.isArray(bedsList)
    ? bedsList.filter((b) => {
        if (!b) return false;
        if (selectedWard === 'ALL') return true;
        return b.ward === selectedWard || b.wardType === selectedWard || b.wardCategory === selectedWard;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <HeroBanner
        title="CityCare Hospital Authority Operations Console"
        subtitle="Clinical departments, doctor credential approvals, surgery & diagnostic pricing catalogs, insurance TPAs, live bed/ICU/OT census, and patient booking request inbox."
        badgeText="AUTHORITY ACTIVE • CITYCARE HOSPITAL"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsUploadForPatientOpen(true)}>
              <Upload className="w-4 h-4 mr-1.5" /> Upload Rx / Test for Patient
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchData} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Live Data
            </Button>
          </div>
        }
      />

      {/* Pop-up Alert: Pending Doctor Verification Notification */}
      {pendingDoctors.length > 0 && (
        <div className="p-4 rounded-xl bg-coral-soft border-2 border-coral text-navy shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-coral text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-coral-deep font-mono uppercase tracking-wider">
                  ACTION REQUIRED
                </span>
                <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
              </div>
              <h4 className="text-sm font-bold font-display text-navy">
                {pendingDoctors.length} Doctor Awaiting Hospital Credential Verification & Approval
              </h4>
              <p className="text-xs text-slate">
                {pendingDoctors[0].fullName} ({pendingDoctors[0].specialty}) registered on the Doctor Portal. Verify credentials to approve and display them on your hospital profile.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setSelectedDoctorToVerify(pendingDoctors[0])}
            className="shrink-0"
          >
            <Eye className="w-4 h-4 mr-1" /> Review & Approve Profile
          </Button>
        </div>
      )}

      {/* Doctor Verification Success Alert */}
      {verificationSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{verificationSuccess}</span>
          </div>
          <button onClick={() => setVerificationSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Document Success Alert */}
      {uploadSuccessMsg && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* EXECUTIVE KPI STRIP WITH 3D MAGNETIC TILT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <TiltCard
          glowColor="rgba(255, 91, 71, 0.2)"
          borderColor="rgba(255, 91, 71, 0.35)"
          className="glass-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate">Bed Census</span>
            <BedDouble className="w-4 h-4 text-coral animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            <AnimatedCounter value={210} suffix=" / 250" />
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>40 Beds Free</span>
          </div>
        </TiltCard>

        <TiltCard
          glowColor="rgba(201, 65, 50, 0.2)"
          borderColor="rgba(201, 65, 50, 0.35)"
          className="glass-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate">ICU Capacity</span>
            <Activity className="w-4 h-4 text-coral-deep animate-bounce" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            <AnimatedCounter value={18} suffix=" / 22" />
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">4 Ventilators Free</div>
        </TiltCard>

        <TiltCard
          glowColor="rgba(16, 185, 129, 0.2)"
          borderColor="rgba(16, 185, 129, 0.35)"
          className="glass-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate">108 Fleet Radar</span>
            <Ambulance className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">3 Fleet</div>
          <div className="text-[11px] text-coral-deep font-semibold mt-1">1 STEMI En Route</div>
        </TiltCard>

        <TiltCard
          glowColor="rgba(16, 185, 129, 0.2)"
          borderColor="rgba(16, 185, 129, 0.35)"
          className="glass-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate">OT Suites</span>
            <Scissors className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">4 Active</div>
          <div className="text-[11px] text-slate font-medium mt-1">12 Surgeries Today</div>
        </TiltCard>

        <TiltCard
          glowColor="rgba(23, 28, 44, 0.18)"
          borderColor="rgba(23, 28, 44, 0.35)"
          className="glass-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate">Booking Inbox</span>
            <Clock className="w-4 h-4 text-navy" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            {safeBookingRequests.filter((b) => b && b.status === 'PENDING_HOSPITAL_REVIEW').length}
          </div>
          <div className="text-[11px] text-coral-deep font-semibold mt-1">Pending Approval</div>
        </TiltCard>

        <TiltCard
          glowColor="rgba(16, 185, 129, 0.2)"
          borderColor="rgba(16, 185, 129, 0.35)"
          className="glass-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate">Cashless Ins.</span>
            <Shield className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">6 TPAs</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">94% Pre-Auth Ratio</div>
        </TiltCard>
      </div>

      {/* MODULE TAB NAVIGATION */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-soft-grey p-1.5 shadow-xs flex flex-wrap gap-1 text-xs font-bold">
        {[
          { id: 'OVERVIEW', label: '1. Inpatient Beds & Census' },
          { id: 'FLEET_AND_OT', label: '2. 108 Fleet & OT Suites' },
          { id: 'BOOKINGS', label: `3. Booking Inbox (${bookingRequests.length})` },
          { id: 'DOCTOR_APPROVALS', label: `4. Doctor Approvals (${pendingDoctors.length})` },
          { id: 'SURGERIES', label: `5. Surgery Catalog (${surgeryCatalog.length})` },
          { id: 'TESTS', label: `6. Test Pricing (${testCatalog.length})` },
          { id: 'DEPARTMENTS', label: `7. Departments (${departments.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(t.id as any);
            }}
            className={`relative px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === t.id
                ? 'text-white font-extrabold shadow-sm'
                : 'text-slate hover:text-navy hover:bg-warm-light-grey'
            }`}
          >
            {activeTab === t.id && (
              <motion.div
                layoutId="hospitalModuleTabHighlight"
                className="absolute inset-0 bg-navy rounded-xl shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: INPATIENT BEDS & WARD MANAGEMENT */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* 3D BED MATRIX & 5-CATEGORY DIGITAL TWIN ARCHITECTURE */}
          <HospitalBed3DMatrix onAdmitPatientSuccess={(msg) => setAdmissionSuccess(msg)} />

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Inpatient Bed & Ward Operations Grid</CardTitle>
                <p className="text-xs text-slate mt-0.5">Live color-coded telemetry of facility wings and clinical bed states</p>
              </div>

              <div className="flex items-center gap-1.5 bg-warm-light-grey p-1 rounded-md border border-soft-grey">
                {['ALL', 'ICU', 'HDU', 'GENERAL_WARD'].map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWard(w)}
                    className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all ${
                      selectedWard === w
                        ? 'bg-white text-navy shadow-xs border border-soft-grey'
                        : 'text-slate hover:text-navy'
                    }`}
                  >
                    {w.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </CardHeader>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium mb-4 pb-3 border-b border-soft-grey text-slate">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>Available ({bedsList.filter((b) => b && b.status === 'AVAILABLE').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-navy" />
                <span>Occupied ({bedsList.filter((b) => b && b.status === 'OCCUPIED').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500" />
                <span>Cleaning ({bedsList.filter((b) => b && b.status === 'CLEANING').length})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBeds.map((bed: any) => {
                const isAvailable = bed.status === 'AVAILABLE';
                const isOccupied = bed.status === 'OCCUPIED';

                return (
                  <motion.div
                    key={bed.id}
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    onClick={() => isAvailable && setSelectedBed(bed)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isAvailable
                        ? 'bg-emerald-soft/60 border-emerald-500/50 hover:bg-emerald-soft hover:shadow-glow-emerald cursor-pointer'
                        : isOccupied
                        ? 'bg-navy/5 border-navy/20'
                        : 'bg-warm-light-grey border-soft-grey'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-navy">{bed.bedNumber}</span>
                      <span className="relative flex h-2.5 w-2.5">
                        {isAvailable && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            isAvailable ? 'bg-emerald-500' : isOccupied ? 'bg-navy' : 'bg-amber-500'
                          }`}
                        />
                      </span>
                    </div>
                    <p className="text-[10px] text-slate font-medium truncate">{bed.ward || 'General'}</p>
                    <p className="text-[10px] font-bold text-navy mt-1 truncate">{bed.status}</p>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: PATIENT BOOKING REQUESTS INBOX */}
      {activeTab === 'BOOKINGS' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Incoming Patient Appointment Booking Requests</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Review patient reason, contact number, and previous medical documents (if consented). Accept to dispatch payment notice.
              </p>
            </div>
            <Badge variant="warning">{bookingRequests.length} Requests</Badge>
          </CardHeader>

          <div className="divide-y divide-soft-grey">
            {bookingRequests.map((req) => (
              <div key={req.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-navy">{req.patientName}</span>
                    <Badge variant="neutral">{req.consultationType}</Badge>
                    <span className="text-xs text-slate font-medium">
                      Phone: <strong>{req.patientPhone}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-navy font-semibold">
                    Purpose / Chief Complaint: <span className="text-slate font-normal">{req.purpose}</span>
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate">
                    <span>Requested Doctor: <strong className="text-navy">{req.doctorRequested}</strong></span>
                    <span>•</span>
                    <span>Slot: <strong>{req.requestedDate}</strong></span>
                  </div>

                  {/* Document Access Status */}
                  <div className="pt-1 flex items-center gap-2">
                    {req.hasConsentForRecords ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-emerald-soft border border-emerald-500/30 text-emerald-800 text-[10px] font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Consent Granted: Patient attached 2 previous records
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-red-50 border border-coral-deep/30 text-coral-deep text-[10px] font-bold">
                        <Lock className="w-3 h-3 text-coral-deep" />
                        Consent Withheld: No previous medical records shared by patient
                      </span>
                    )}

                    {req.hasConsentForRecords && (
                      <button
                        onClick={() => setViewingPatientRecords(req)}
                        className="text-[11px] font-bold text-coral hover:underline"
                      >
                        Inspect Patient Records & Reports
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'PENDING_HOSPITAL_REVIEW' ? (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptBooking(req)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept & Notify for Payment
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeclineBooking(req)}
                      >
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                    </>
                  ) : (
                    <Badge variant="success">ACCEPTED — WAITING FOR PAYMENT</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: CLINICAL DEPARTMENTS MANAGEMENT */}
      {activeTab === 'DEPARTMENTS' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Hospital Clinical Departments & Specialties</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Configure departments offered at CityCare Hospital. Doctors register under these departments.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsAddDeptModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Add Department
            </Button>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {departments.map((dept, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-navy">{dept}</span>
                </div>
                <Badge variant="neutral">ACTIVE</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: SURGERY PRICING CATALOG */}
      {activeTab === 'SURGERIES' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Hospital Surgery Catalog & Pricing Master</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Transparent published prices for all operative surgical procedures performed at CityCare Hospital
              </p>
            </div>
            <Badge variant="neutral">{surgeryCatalog.length} Procedures</Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-warm-light-grey text-slate text-[11px] font-bold uppercase tracking-wider border-b border-soft-grey">
                  <th className="py-3 px-4">Procedure Code</th>
                  <th className="py-3 px-4">Surgery Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Standard Tariff</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {surgeryCatalog.map((surg) => (
                  <tr key={surg.id} className="hover:bg-warm-light-grey/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">{surg.code}</td>
                    <td className="py-3.5 px-4 font-bold text-navy">{surg.name}</td>
                    <td className="py-3.5 px-4 text-slate">{surg.category}</td>
                    <td className="py-3.5 px-4 font-bold font-mono text-emerald-800 text-sm">
                      ₹{surg.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingSurgery(surg);
                          setEditSurgeryPrice(surg.price);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" /> Update Price
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 5: DIAGNOSTIC TEST PRICING CATALOG */}
      {activeTab === 'TESTS' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Diagnostic Laboratory & Radiology Test Pricing</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Editable master list of test costs with turnaround time SLAs
              </p>
            </div>
            <Badge variant="neutral">{testCatalog.length} Tests Active</Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-warm-light-grey text-slate text-[11px] font-bold uppercase tracking-wider border-b border-soft-grey">
                  <th className="py-3 px-4">Test Code</th>
                  <th className="py-3 px-4">Investigation Name</th>
                  <th className="py-3 px-4">Turnaround SLA</th>
                  <th className="py-3 px-4">Published Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {testCatalog.map((test) => (
                  <tr key={test.id} className="hover:bg-warm-light-grey/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy">{test.code}</td>
                    <td className="py-3.5 px-4 font-bold text-navy">{test.name}</td>
                    <td className="py-3.5 px-4 text-slate">{test.turnaround}</td>
                    <td className="py-3.5 px-4 font-bold font-mono text-emerald-800 text-sm">
                      ₹{test.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingTest(test);
                          setEditTestPrice(test.price);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" /> Update Price
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 6: DOCTOR CREDENTIAL APPROVAL QUEUE */}
      {activeTab === 'DOCTOR_APPROVALS' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Doctor Registration & Verification Queue</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Doctors registering on SvasthNexis are verified by hospital authority before becoming visible to patients
              </p>
            </div>
            <Badge variant="warning">{pendingDoctors.length} Awaiting Verification</Badge>
          </CardHeader>

          {pendingDoctors.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate">
              No doctor registrations pending verification. All doctor profiles are approved.
            </div>
          ) : (
            <div className="divide-y divide-soft-grey">
              {pendingDoctors.map((doc) => (
                <div key={doc.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-navy">{doc.fullName}</span>
                      <Badge variant="warning">PENDING VERIFICATION</Badge>
                    </div>
                    <p className="text-xs text-coral-deep font-semibold">{doc.specialty}</p>
                    <p className="text-[11px] text-slate">{doc.degrees}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate pt-1">
                      <span>Cases: <strong>{doc.casesHandled}+</strong></span>
                      <span>•</span>
                      <span>Surgeries: <strong>{doc.surgeriesCount}+</strong></span>
                      <span>•</span>
                      <span>Fee: <strong>{doc.consultationFee}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleApproveDoctor(doc)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve & Publish Doctor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* COMPREHENSIVE EMPANELLED INSURANCE PROVIDERS & CASHLESS CLAIM DESKS */}
      <EmpanelledInsuranceGrid />

      {/* TAB 7: 108 EMERGENCY FLEET & OT SURGICAL SUITES */}
      {activeTab === 'FLEET_AND_OT' && (
        <HospitalFleetAndOtSuite />
      )}

      {/* MODAL 1: DOCTOR CREDENTIAL DOSSIER VERIFICATION */}
      <DoctorVerificationModal
        doctor={selectedDoctorToVerify}
        onClose={() => setSelectedDoctorToVerify(null)}
        onApprove={handleApproveDoctor}
      />

      {/* MODAL 2: ADD DEPARTMENT */}
      {isAddDeptModalOpen && (
        <Modal
          isOpen={isAddDeptModalOpen}
          onClose={() => setIsAddDeptModalOpen(false)}
          title="Add New Clinical Department"
          description="Register a new medical department to CityCare Hospital."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsAddDeptModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddDepartment}>
                Add Department
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="e.g. Dermatology & Cosmetology"
            />
          </div>
        </Modal>
      )}

      {/* MODAL 3: EDIT SURGERY PRICE */}
      {editingSurgery && (
        <Modal
          isOpen={!!editingSurgery}
          onClose={() => setEditingSurgery(null)}
          title={`Update Surgery Price: ${editingSurgery.name}`}
          description={`Procedure Code: ${editingSurgery.code}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEditingSurgery(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateSurgeryPrice}>
                Save Updated Price
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Standard Surgery Tariff (INR)"
              type="number"
              value={editSurgeryPrice}
              onChange={(e) => setEditSurgeryPrice(Number(e.target.value))}
            />
          </div>
        </Modal>
      )}

      {/* MODAL 4: EDIT TEST PRICE */}
      {editingTest && (
        <Modal
          isOpen={!!editingTest}
          onClose={() => setEditingTest(null)}
          title={`Update Test Price: ${editingTest.name}`}
          description={`Test Code: ${editingTest.code}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEditingTest(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateTestPrice}>
                Save Updated Price
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Published Test Price (INR)"
              type="number"
              value={editTestPrice}
              onChange={(e) => setEditTestPrice(Number(e.target.value))}
            />
          </div>
        </Modal>
      )}

      {/* MODAL 5: UPLOAD PRESCRIPTION OR TEST REPORT FOR PATIENT */}
      {isUploadForPatientOpen && (
        <Modal
          isOpen={isUploadForPatientOpen}
          onClose={() => setIsUploadForPatientOpen(false)}
          title="Upload Prescription / Test Report for Patient"
          description="Directly publish doctor prescriptions or diagnostic test results to a patient's portal account."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsUploadForPatientOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUploadDocumentForPatient}>
                Upload & Publish to Patient Portal
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Patient ID / ABHA Identifier"
              value={uploadPatientId}
              onChange={(e) => setUploadPatientId(e.target.value)}
            />

            <div>
              <label className="font-bold text-navy block mb-1">Document Type</label>
              <select
                value={uploadDocType}
                onChange={(e) => setUploadDocType(e.target.value as any)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              >
                <option value="PRESCRIPTION">Official Hospital Digital Prescription</option>
                <option value="LAB_REPORT">Validated Laboratory / Diagnostic Report</option>
              </select>
            </div>

            <Input
              label="Document Title"
              value={uploadDocTitle}
              onChange={(e) => setUploadDocTitle(e.target.value)}
            />

            <div className="border-2 border-dashed border-soft-grey rounded-lg p-5 text-center bg-warm-light-grey/40 space-y-1">
              <Upload className="w-5 h-5 text-slate mx-auto mb-1" />
              <p className="font-bold text-navy">Simulated Attachment File (PDF/Report)</p>
              <p className="text-[10px] text-slate">Will be immediately visible on patient portal</p>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 6: INSPECT PATIENT RECORDS (IF CONSENTED) */}
      {viewingPatientRecords && (
        <Modal
          isOpen={!!viewingPatientRecords}
          onClose={() => setViewingPatientRecords(null)}
          title={`Patient Medical Records: ${viewingPatientRecords.patientName}`}
          description={`Consent Status: GRANTED • Purpose: ${viewingPatientRecords.purpose}`}
          footer={
            <Button variant="secondary" onClick={() => setViewingPatientRecords(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-[11px]">
              ✓ The patient granted explicit consent to share previous health records with your hospital for this consultation.
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy block">Previous Prescription — General Medicine</span>
                  <span className="text-[10px] text-slate">Date: 2026-08-14 • Dr. Rajesh Varma</span>
                </div>
                <Badge variant="neutral">PRESCRIPTION</Badge>
              </div>

              <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy block">Past Lipid Profile & CBC Blood Report</span>
                  <span className="text-[10px] text-slate">Date: 2026-09-02 • CityCare Diagnostics</span>
                </div>
                <Badge variant="neutral">LAB REPORT</Badge>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 7: INPATIENT ADMISSION */}
      <Modal
        isOpen={!!selectedBed}
        onClose={() => setSelectedBed(null)}
        title={`Admit Patient to Bed ${selectedBed?.bedNumber}`}
        description="Assign inpatient bed and register primary attending physician."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedBed(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAdmitPatient} isLoading={isAdmitting}>
              Confirm Inpatient Admission
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Patient ID"
            value={patientIdToAdmit}
            onChange={(e) => setPatientIdToAdmit(e.target.value)}
          />
          <Input
            label="Primary Admission Diagnosis"
            value={admittingDiagnosis}
            onChange={(e) => setAdmittingDiagnosis(e.target.value)}
          />
        </div>
      </Modal>

      {/* FLOATING OPERATIONAL COMMAND DOCK (PERSISTENT AT BOTTOM CENTER) */}
      <FloatingHospitalDock
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        onTriggerCodeBlue={() => {
          alert('🚨 HOSPITAL CODE BLUE ACTIVATED! Crash cart, ICU intensivist team, and Trauma Bay 1 alerted.');
        }}
      />
    </div>
  );
};
