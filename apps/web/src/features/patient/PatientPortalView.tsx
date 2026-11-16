import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { EcgPulse } from '@/components/ui/EcgPulse';
import { TiltCard } from '@/components/ui/TiltCard';
import { AbhaCard } from './AbhaCard';
import { VitalsTelemetryHUD } from './VitalsTelemetryHUD';
import { DocumentViewerModal } from './DocumentViewerModal';
import { FloatingPatientDock } from './FloatingPatientDock';
import { EmpanelledInsuranceGrid } from '../hospital/EmpanelledInsuranceGrid';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  UserCheck,
  QrCode,
  Calendar,
  Clock,
  Shield,
  FileText,
  Search,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Lock,
  ArrowRight,
  Activity,
  Heart,
  Stethoscope,
  Users,
  Building2,
  MapPin,
  Video,
  Download,
  Upload,
  Play,
  Share2,
  Check,
  Radio,
  Wallet,
  Eye,
  Compass,
  Zap,
} from 'lucide-react';

export const PatientPortalView: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Section Refs for smooth scrolling from the Floating Dock
  const aiRef = useRef<HTMLDivElement>(null);
  const abhaRef = useRef<HTMLDivElement>(null);
  const discoveryRef = useRef<HTMLDivElement>(null);
  const lockerRef = useRef<HTMLDivElement>(null);

  // 1. Discovery Mode: Hospital vs Individual Clinic / Doctor
  const [discoveryMode, setDiscoveryMode] = useState<'HOSPITAL' | 'INDIVIDUAL_CLINIC'>('HOSPITAL');

  // 2. Geolocation State
  const [hasLocationPermission, setHasLocationPermission] = useState(true);
  const [userLocation, setUserLocation] = useState('Koramangala 4th Block, Bengaluru (12.9352° N, 77.6245° E)');
  const [isLocating, setIsLocating] = useState(false);

  // 3. AI Symptom Navigator State
  const [aiPrompt, setAiPrompt] = useState('I have a severe flu infection, fever of 101F, body aches and sore throat for 2 days.');
  const [aiResponse, setAiResponse] = useState<any | null>({
    triageLevel: 'ROUTINE OPD',
    recommendedDepartment: 'General Medicine / Infectious Diseases',
    summary: 'Symptoms indicate acute viral upper respiratory tract infection. Recommend fluid replenishment, clinical examination by Dr. Rajesh Varma, and Paracetamol for fever control.',
  });
  const [isAiNavigating, setIsAiNavigating] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Health Locker & Documents State
  const [patientDocuments, setPatientDocuments] = useState<any[]>([
    {
      id: 'doc-past-rx-01',
      title: 'Previous Prescription — Dr. Varma (General Medicine)',
      category: 'PRESCRIPTION',
      date: '2026-08-14',
      doctor: 'Dr. Rajesh Varma',
      facility: 'CityCare General Hospital',
      fileSize: '1.2 MB PDF',
    },
    {
      id: 'doc-past-lab-01',
      title: 'Past Lipid Profile & Complete Blood Count (CBC)',
      category: 'LAB_REPORT',
      date: '2026-09-02',
      doctor: 'CityCare Central Diagnostics',
      facility: 'CityCare Diagnostics',
      fileSize: '2.4 MB PDF',
    },
  ]);
  const [selectedDocToView, setSelectedDocToView] = useState<any | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDocTitle, setUploadDocTitle] = useState('');
  const [uploadDocCategory, setUploadDocCategory] = useState('PRESCRIPTION');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // 5. Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [consultationType, setConsultationType] = useState<'PHYSICAL_HOSPITAL' | 'ONLINE_TELEMEDICINE'>('PHYSICAL_HOSPITAL');
  const [allowDocumentSharing, setAllowDocumentSharing] = useState<boolean>(true);
  const [bookingReason, setBookingReason] = useState('Flu symptoms, body ache, fever evaluation');
  const [isHolding, setIsHolding] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // 6. Hospital Acceptance & Payment Modal State
  const [pendingAppointmentForPayment, setPendingAppointmentForPayment] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [upiId, setUpiId] = useState('rahul.verma@oksbi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [confirmedAppointments, setConfirmedAppointments] = useState<any[]>([
    {
      id: 'apt-prev-001',
      doctorName: 'Dr. Ananya Sharma',
      specialty: 'Cardiology',
      facilityName: 'CityCare General Hospital',
      date: 'Today, 11:30 AM',
      type: 'ONLINE_TELEMEDICINE',
      status: 'CONFIRMED',
      paymentStatus: 'PAID (UPI: ₹800.00)',
      allowRecords: true,
      zoomLink: 'https://meet.google.com/svas-care-9021',
      recordedVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ]);

  // 7. Video Recording Playback Modal State
  const [activeRecordingToWatch, setActiveRecordingToWatch] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getState();
      setState(res);
    } catch (err) {
      console.error('Failed to load patient state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.setAuth('PATIENT', 'usr-pat-001');
    fetchData();
  }, []);

  // Request Location Permission
  const handleEnableLocation = () => {
    sound.playClick();
    setIsLocating(true);
    setTimeout(() => {
      setHasLocationPermission(true);
      setUserLocation('Koramangala 4th Block, Bengaluru (Near 80ft Road)');
      setIsLocating(false);
      sound.playChime();
    }, 600);
  };

  // AI Symptom Navigator
  const handleAiNavigate = async (promptOverride?: string) => {
    const textToQuery = promptOverride || aiPrompt;
    if (!textToQuery) return;
    try {
      sound.playClick();
      setIsAiNavigating(true);
      const res = await api.aiNavigate(textToQuery);
      setAiResponse(res);
      if (res.recommendedDepartment) {
        setSelectedDepartment(res.recommendedDepartment);
      }
      sound.playChime();
    } catch (err: any) {
      alert(`AI Navigation error: ${err.message}`);
    } finally {
      setIsAiNavigating(false);
    }
  };

  // Document Upload
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocTitle) return;
    sound.playChime();
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: uploadDocTitle,
      category: uploadDocCategory,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Patient Self-Uploaded',
      facility: 'Personal Health Locker',
      fileSize: '1.8 MB PDF',
    };
    setPatientDocuments([newDoc, ...patientDocuments]);
    setUploadSuccess(`"${uploadDocTitle}" securely uploaded to your DPDP Health Locker.`);
    setUploadDocTitle('');
    setIsUploadModalOpen(false);
  };

  // Start Slot Hold & Open Booking Modal
  const handleSelectDoctorForBooking = (doctor: any) => {
    sound.playClick();
    setBookingDoctor(doctor);
    const slots = Array.isArray(state?.slots) ? state.slots.filter((s: any) => s.doctorId === doctor.id) : [];
    setSelectedSlot(slots[0] || { id: 'slot-default-01', startTime: '10:00 AM', endTime: '10:30 AM' });
  };

  // Submit Booking Request (Sent to Hospital / Clinic)
  const handleSubmitBookingRequest = async () => {
    if (!bookingDoctor || !selectedSlot) return;
    try {
      sound.playClick();
      setIsSubmittingBooking(true);
      const newApt = {
        id: `apt-${Date.now().toString().slice(-6)}`,
        doctorId: bookingDoctor.id,
        doctorName: bookingDoctor.fullName,
        specialty: bookingDoctor.primarySpecialty || bookingDoctor.specialty,
        facilityName: discoveryMode === 'HOSPITAL' ? 'CityCare General Hospital' : `${bookingDoctor.fullName} Private Clinic`,
        date: 'Tomorrow, 10:00 AM',
        type: consultationType,
        status: 'PENDING_HOSPITAL_ACCEPTANCE',
        paymentStatus: 'UNPAID',
        allowRecords: allowDocumentSharing,
        patientPhone: '+91 98450 88219',
        reason: bookingReason,
        fee: discoveryMode === 'HOSPITAL' ? bookingDoctor.feeHospital : bookingDoctor.feeClinic,
        zoomLink: consultationType === 'ONLINE_TELEMEDICINE' ? 'https://meet.google.com/svas-doc-consult' : null,
        recordedVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      };

      // Create appointment in API
      await api.createAppointment({
        id: newApt.id,
        patientId: 'usr-pat-001',
        doctorId: bookingDoctor.id,
        facilityId: 'fac-citycare-01',
        slotId: selectedSlot.id,
        type: consultationType === 'ONLINE_TELEMEDICINE' ? 'TELECONSULTATION' : 'PHYSICAL_CONSULTATION',
        notes: bookingReason,
      });

      // Grant scoped consent if user allowed
      if (allowDocumentSharing) {
        await api.createConsent({
          patientId: 'usr-pat-001',
          recipientId: bookingDoctor.id,
          purpose: 'CLINICAL_CONSULTATION',
          scopeCategories: ['PRESCRIPTION', 'LAB_REPORT', 'DIAGNOSTIC_SUMMARY'],
          validHours: 72,
        });
      }

      setBookingDoctor(null);
      // Automatically stage the hospital acceptance simulation
      setTimeout(() => {
        sound.playChime();
        setPendingAppointmentForPayment(newApt);
      }, 1200);

      fetchData();
    } catch (err: any) {
      alert(`Booking request failed: ${err.message}`);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Execute Multi-Method Payment to Confirm
  const handleExecutePayment = async () => {
    if (!pendingAppointmentForPayment) return;
    try {
      setIsProcessingPayment(true);
      await api.triggerPaymentWebhook({
        eventId: `pay-evt-${Date.now()}`,
        appointmentId: pendingAppointmentForPayment.id,
        amountMinorUnits: 80000,
        paymentMode: paymentMethod,
        gatewayProvider: 'SVASTHNEXIS_PAY',
        status: 'SUCCESS',
      });

      const confirmed = {
        ...pendingAppointmentForPayment,
        status: 'CONFIRMED',
        paymentStatus: `PAID via ${paymentMethod} (${pendingAppointmentForPayment.fee})`,
      };

      setConfirmedAppointments([confirmed, ...confirmedAppointments]);
      setPendingAppointmentForPayment(null);

      // Trigger Audio Chime & Celebration Confetti Animation
      sound.playChime();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FF5B47', '#10B981', '#171C2C', '#FBC024', '#0EA5E9'],
      });

      fetchData();
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Facilities with Geolocation Coordinates
  const facilitiesList = [
    {
      id: 'fac-citycare-01',
      name: 'CityCare Super Specialty Hospital',
      type: 'Multi-Specialty Tertiary Hospital',
      distanceKm: 1.2,
      locality: 'Koramangala 4th Block',
      bedsCount: 250,
      emergencyReady: true,
      departments: ['Cardiology', 'General Medicine', 'Neurology', 'Orthopaedics', 'Paediatrics'],
    },
    {
      id: 'fac-stjohns-02',
      name: 'St. John’s Medical Institute',
      type: 'Academic Hospital',
      distanceKm: 2.8,
      locality: 'Sarjapur Main Road',
      bedsCount: 600,
      emergencyReady: true,
      departments: ['General Medicine', 'Surgery', 'Oncology', 'Emergency'],
    },
  ];

  // Doctors List
  const doctorsList = [
    {
      id: 'doc-sharma-01',
      fullName: 'Dr. Ananya Sharma',
      degrees: 'MBBS, MD (General Medicine), DM (Cardiology)',
      primarySpecialty: 'Cardiology',
      experienceYears: 14,
      casesHandled: 4200,
      surgeriesCount: 420,
      clinicName: 'Sharma Advanced Heart Clinic',
      hospitalName: 'CityCare Super Specialty Hospital',
      distanceClinicKm: 0.8,
      distanceHospitalKm: 1.2,
      feeHospital: '₹800',
      feeClinic: '₹700',
      rating: '4.9 ★',
      modes: ['Physical Visit', 'Online Zoom / Meet with Recording'],
    },
    {
      id: 'doc-varma-02',
      fullName: 'Dr. Rajesh Varma',
      degrees: 'MBBS, MD (Internal Medicine)',
      primarySpecialty: 'General Medicine',
      experienceYears: 18,
      casesHandled: 6500,
      surgeriesCount: 150,
      clinicName: 'Varma Family Wellness Clinic',
      hospitalName: 'CityCare Super Specialty Hospital',
      distanceClinicKm: 1.5,
      distanceHospitalKm: 1.2,
      feeHospital: '₹600',
      feeClinic: '₹500',
      rating: '4.8 ★',
      modes: ['Physical Visit', 'Online Zoom / Meet with Recording'],
    },
    {
      id: 'doc-sethi-03',
      fullName: 'Dr. Vikram Sethi',
      degrees: 'MBBS, MS (Orthopaedics), MCh',
      primarySpecialty: 'Orthopaedics',
      experienceYears: 16,
      casesHandled: 3900,
      surgeriesCount: 580,
      clinicName: 'Sethi Bone & Joint Institute',
      hospitalName: 'CityCare Super Specialty Hospital',
      distanceClinicKm: 2.1,
      distanceHospitalKm: 1.2,
      feeHospital: '₹750',
      feeClinic: '₹650',
      rating: '4.9 ★',
      modes: ['Physical Visit', 'Online Zoom / Meet with Recording'],
    },
  ];

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch =
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.primarySpecialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'ALL' || doc.primarySpecialty.includes(selectedDepartment) || selectedDepartment.includes(doc.primarySpecialty);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Floating Dynamic Ambient Glow Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-coral/15 rounded-full blur-3xl animate-blob pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl animate-blob-delayed pointer-events-none -z-10" />

      {/* Hero Banner with Live Verification Pills */}
      <HeroBanner
        title="Aegis Care — Patient & Family Healthcare Command Portal"
        subtitle="Your personalized digital health ecosystem: manage your personal health locker, explore nearby care, diagnose symptoms via AI, and access recorded teleconsultations."
        badgeText="ABHA LINKED • INDIA DPDP VERIFIED"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                sound.playClick();
                setIsUploadModalOpen(true);
              }}
            >
              <Upload className="w-4 h-4 mr-1.5" /> Upload Past Record / Rx
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchData}
              isLoading={isLoading}
            >
              <Activity className="w-4 h-4 mr-1.5 text-coral" /> Refresh Locker
            </Button>
          </div>
        }
      />

      {/* Upload Success Alert */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
          <button onClick={() => setUploadSuccess(null)} className="text-slate hover:text-navy cursor-pointer">
            Dismiss
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* SECTION A: SPATIAL OVERVIEW — PATIENT PROFILE & 3D HOLOGRAPHIC ABHA CARD */}
      {/* ========================================================================= */}
      <div ref={abhaRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Patient Profile & Quick Actions */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white/60 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-coral-deep text-white flex items-center justify-center font-display font-black text-2xl shadow-md">
                  RV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-display font-extrabold text-navy">Rahul Verma</h2>
                    <Badge variant="success">ABHA VERIFIED</Badge>
                  </div>
                  <p className="text-xs text-slate font-medium mt-0.5">
                    Age 42 • Male • Blood Group: <strong className="text-navy">O+ Positive</strong>
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-[10px] uppercase font-mono text-slate">Health ID</span>
                <span className="font-mono font-bold text-navy text-sm">91-4209-8812-3904</span>
              </div>
            </div>

            {/* Quick Status Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
                <span className="text-[9px] font-mono text-slate uppercase block">Consent Gates</span>
                <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5" /> 100% Active
                </span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsInsuranceModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-warm-light-grey/80 hover:bg-slate-200 border border-soft-grey shadow-2xs text-left transition-all cursor-pointer group"
                title="View 28 Empanelled Health Insurers & Helplines"
              >
                <span className="text-[9px] font-mono text-slate uppercase block flex items-center justify-between">
                  <span>Insurance</span>
                  <span className="text-[8px] font-bold text-coral group-hover:underline">28 Accepted ↗</span>
                </span>
                <span className="font-bold text-navy text-xs truncate block mt-0.5 group-hover:text-coral">
                  Star Health & 27 More
                </span>
              </button>

              <div className="p-3 rounded-2xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
                <span className="text-[9px] font-mono text-slate uppercase block">Active Rx</span>
                <span className="font-bold text-coral text-xs block mt-0.5">2 Prescriptions</span>
              </div>

              <div className="p-3 rounded-2xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
                <span className="text-[9px] font-mono text-slate uppercase block">Past Consults</span>
                <span className="font-bold text-navy text-xs block mt-0.5">8 Recorded</span>
              </div>
            </div>

            {/* Location Radius & Geolocation Bar */}
            <div className="p-3.5 rounded-2xl bg-white border border-soft-grey shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
                </span>
                <MapPin className="w-4 h-4 text-coral shrink-0" />
                <span className="text-navy font-semibold truncate">{userLocation}</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleEnableLocation}
                isLoading={isLocating}
                className="shrink-0 text-xs py-1"
              >
                Refresh Radius
              </Button>
            </div>
          </div>

          {/* Quick Trigger Actions */}
          <div className="pt-4 mt-4 border-t border-soft-grey flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP Encrypted Local Health Node Active</span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  sound.playClick();
                  lockerRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-slate" /> Health Locker
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-navy hover:bg-navy/90 text-white"
                onClick={() => {
                  sound.playClick();
                  discoveryRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Building2 className="w-3.5 h-3.5 mr-1" /> Care Discovery
              </Button>
            </div>
          </div>
        </div>

        {/* Right: 3D Holographic ABHA Card with Flip Effect */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <AbhaCard />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: DAILY HEALTH & TELEMETRY HUD (VITALS, WATER, MEDS TRACKER) */}
      {/* ========================================================================= */}
      <VitalsTelemetryHUD />

      {/* ========================================================================= */}
      {/* HOSPITAL ACCEPTANCE & PAYMENT REQUIRED ALERT MODAL / BANNER */}
      {/* ========================================================================= */}
      {pendingAppointmentForPayment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-amber-soft/90 border-2 border-amber-400 text-amber-950 shadow-lg space-y-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h4 className="text-sm font-bold font-display uppercase tracking-wider text-amber-900">
                Hospital Accepted Your Booking Request!
              </h4>
            </div>
            <Badge variant="warning">ACTION REQUIRED: COMPLETE PAYMENT</Badge>
          </div>

          <div className="text-xs leading-relaxed text-amber-900">
            <strong>{pendingAppointmentForPayment.facilityName}</strong> has approved your appointment with{' '}
            <strong>{pendingAppointmentForPayment.doctorName}</strong> ({pendingAppointmentForPayment.specialty}).
            Please select your payment method to finalize the booking and receive your{' '}
            {pendingAppointmentForPayment.type === 'ONLINE_TELEMEDICINE'
              ? 'Zoom/Google Meet video link with recording'
              : 'hospital visit pass'}
            .
          </div>

          {/* Inline Multi-Method Payment Gateway Form */}
          <div className="mt-3 p-4 rounded-xl bg-white border border-amber-300 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-soft-grey pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate block">
                Select Payment Method
              </span>
              <span className="font-mono font-bold text-base text-navy">
                Fee Due: {pendingAppointmentForPayment.fee}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { id: 'UPI', label: 'UPI (GPay / PhonePe)' },
                { id: 'CARD', label: 'Credit / Debit Card' },
                { id: 'NET_BANKING', label: 'Net Banking' },
                { id: 'WALLET', label: 'Digital Wallet' },
                { id: 'CASH', label: 'Cash at Hospital' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setPaymentMethod(m.id as any);
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? 'bg-coral-soft border-coral text-coral-deep shadow-2xs ring-1 ring-coral/40'
                      : 'bg-warm-light-grey border-soft-grey text-slate hover:text-navy'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="pt-2">
                <Input
                  label="Enter UPI ID / VPA"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@oksbi"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={handleExecutePayment}
                isLoading={isProcessingPayment}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                <Check className="w-4 h-4 mr-1.5" /> Pay {pendingAppointmentForPayment.fee} & Confirm Appointment
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: AI HEALTH NAVIGATOR 2.0 (FLOATING NEURAL ORB & AUDIO BARS) */}
      {/* ========================================================================= */}
      <div ref={aiRef}>
        <Card className="border-2 border-emerald-500/40 bg-gradient-to-br from-white via-emerald-soft/10 to-white shadow-xl relative overflow-hidden">
          {/* Subtle Glowing Background Orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <CardHeader>
            <div className="flex items-center gap-3">
              {/* Rotating Holographic AI Avatar Orb */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-navy text-white flex items-center justify-center shadow-lg relative"
              >
                <Sparkles className="w-6 h-6 text-white" />
                <div className="absolute -inset-1 rounded-2xl border border-emerald-400/40 animate-ping opacity-30" />
              </motion.div>

              <div>
                <CardTitle>AI Clinical Health Navigator & Triage Engine</CardTitle>
                <p className="text-xs text-slate mt-0.5">
                  Describe symptoms in plain words. Our neural engine categorizes urgency, suggests specialists, and provides immediate guidance.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-soft text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                NEURAL TRIAGE READY
              </span>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {/* Quick Clickable Symptom Scenario Chips */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate block mb-1.5">
                Quick Scenario Prompts (Click to test):
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: '🤒 Flu, 101°F Fever & Body Ache', query: 'I have a severe flu infection, fever of 101F, body aches and sore throat for 2 days.' },
                  { label: '🫀 Chest Heaviness & Left Arm Tingling', query: 'Crushing chest tightness with left arm numbness and cold sweating for 20 minutes.' },
                  { label: '🦵 Twisted Ankle Swelling', query: 'Twisted right ankle during sports, severe swelling and unable to bear weight.' },
                  { label: '⚡ Migraine with Aura', query: 'Pulsating one-sided headache with visual flickering aura and nausea.' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAiPrompt(chip.query);
                      handleAiNavigate(chip.query);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-warm-light-grey hover:bg-coral-soft hover:text-coral-deep border border-soft-grey text-navy text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form with Audio Bars Animation */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your symptoms in natural language (e.g. fever, headache, joint pain, cough)..."
                  rows={2}
                  className="w-full bg-white border border-soft-grey rounded-xl p-3 text-xs text-navy focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                />
              </div>

              <div className="sm:self-end">
                <Button
                  variant="primary"
                  onClick={() => handleAiNavigate()}
                  isLoading={isAiNavigating}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white whitespace-nowrap h-11 px-5 font-bold shadow-md"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Analyze Symptoms</span>
                </Button>
              </div>
            </div>

            {/* AI Diagnostic Response Card */}
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white border border-emerald-500/40 shadow-md space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-soft-grey pb-2.5">
                  <span className="font-bold text-navy flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    AI Clinical Evaluation Summary
                  </span>
                  <Badge variant={aiResponse.triageLevel?.includes('EMERGENCY') ? 'critical' : 'success'}>
                    Triage Priority: {aiResponse.triageLevel || 'ROUTINE OPD'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate">
                  <div className="p-3 rounded-xl bg-warm-light-grey/60 border border-soft-grey">
                    <strong className="text-navy block mb-0.5">Recommended Clinical Department:</strong>
                    <span className="font-bold text-emerald-800 text-sm">
                      {aiResponse.recommendedDepartment || 'General Medicine / Infectious Diseases'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-warm-light-grey/60 border border-soft-grey">
                    <strong className="text-navy block mb-0.5">Triage Rationale:</strong>
                    <p className="text-[11px] leading-relaxed text-navy">
                      {aiResponse.summary || 'Consult physician for flu management. Rest and hydration recommended.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-soft-grey text-[11px]">
                  <span className="text-slate">
                    Matching specialist: <strong>Dr. Rajesh Varma (General Medicine)</strong>
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      discoveryRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-coral-deep font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View matching specialists below</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECTION D: CARE DISCOVERY (HOSPITAL vs INDIVIDUAL CLINIC) */}
      {/* ========================================================================= */}
      <div ref={discoveryRef} className="space-y-4">
        {/* Floating Discovery Selector Bar */}
        <div className="glass-card rounded-2xl border border-soft-grey p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-coral font-mono flex items-center gap-1">
                <Compass className="w-3 h-3" /> CARE DISCOVERY ENGINE
              </span>
              <h3 className="text-xl font-display font-bold text-navy mt-0.5">
                Where would you like to seek medical care?
              </h3>
              <p className="text-xs text-slate mt-0.5">
                Choose between multi-specialty tertiary hospitals or private independent doctor clinics.
              </p>
            </div>

            {/* Sliding Tab Switcher with Framer-Motion LayoutId */}
            <div className="p-1 rounded-2xl bg-warm-light-grey border border-soft-grey flex text-xs font-bold shrink-0 shadow-inner">
              <button
                onClick={() => {
                  sound.playClick();
                  setDiscoveryMode('HOSPITAL');
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  discoveryMode === 'HOSPITAL' ? 'text-navy font-black shadow-xs' : 'text-slate hover:text-navy'
                }`}
              >
                {discoveryMode === 'HOSPITAL' && (
                  <motion.div
                    layoutId="patientDiscoveryTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-soft-grey -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Building2 className="w-4 h-4 text-coral" />
                <span>1. Multi-Specialty Hospital</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setDiscoveryMode('INDIVIDUAL_CLINIC');
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  discoveryMode === 'INDIVIDUAL_CLINIC' ? 'text-navy font-black shadow-xs' : 'text-slate hover:text-navy'
                }`}
              >
                {discoveryMode === 'INDIVIDUAL_CLINIC' && (
                  <motion.div
                    layoutId="patientDiscoveryTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-soft-grey -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>2. Independent Clinic / Doctor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Specialty Filter Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'Cardiology', 'General Medicine', 'Orthopaedics'].map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  sound.playClick();
                  setSelectedDepartment(dept);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDepartment === dept
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-white border border-soft-grey text-slate hover:text-navy'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-soft-grey rounded-xl pl-9 pr-3 py-2 text-xs text-navy focus:outline-none focus:border-coral shadow-2xs"
            />
          </div>
        </div>

        {/* DOCTORS GRID (USING 3D TILT CARDS WITH CURSOR SPOTLIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const distance = discoveryMode === 'HOSPITAL' ? doc.distanceHospitalKm : doc.distanceClinicKm;
            const fee = discoveryMode === 'HOSPITAL' ? doc.feeHospital : doc.feeClinic;
            const facility = discoveryMode === 'HOSPITAL' ? doc.hospitalName : doc.clinicName;

            return (
              <TiltCard
                key={doc.id}
                glowColor="rgba(255, 91, 71, 0.18)"
                borderColor="rgba(255, 91, 71, 0.35)"
                className="glass-card flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold font-display text-navy">{doc.fullName}</h4>
                        <Badge variant="success">VERIFIED</Badge>
                      </div>
                      <p className="text-xs font-bold text-coral-deep mt-0.5">{doc.primarySpecialty}</p>
                      <p className="text-[11px] text-slate">{doc.degrees}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-navy">{fee}</span>
                      <p className="text-[10px] text-slate font-medium">Consult Fee</p>
                    </div>
                  </div>

                  {/* Facility & Distance Beacon */}
                  <div className="p-3 rounded-xl bg-warm-light-grey/80 border border-soft-grey text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate flex items-center gap-1 font-medium truncate max-w-[170px]">
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
                        </span>
                        <MapPin className="w-3.5 h-3.5 text-coral shrink-0" />
                        <span className="truncate">{facility}</span>
                      </span>
                      <span className="font-bold text-coral-deep bg-coral-soft px-2 py-0.5 rounded-md text-[10px] shadow-2xs shrink-0">
                        {distance} km away
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate pt-1.5 border-t border-soft-grey font-mono">
                      <span><strong>{doc.casesHandled}+</strong> Cases</span>
                      <span>•</span>
                      <span><strong>{doc.surgeriesCount}+</strong> Surgeries</span>
                      <span>•</span>
                      <span className="text-amber-600 font-bold">{doc.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate font-medium">
                    <Video className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>In-Person Visit OR Recorded Video Session</span>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-between shimmer-button shadow-md"
                    onClick={() => handleSelectDoctorForBooking(doc)}
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION E: CONFIRMED APPOINTMENTS & RECORDED ONLINE CONSULTATION PLAYER */}
      {/* ========================================================================= */}
      <Card className="shadow-lg border border-soft-grey">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-coral-soft text-coral-deep">
              <Calendar className="w-5 h-5 text-coral" />
            </div>
            <div>
              <CardTitle>My Active Appointments & Teleconsultations</CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Join live video sessions or review safety recordings of completed clinical consultations.
              </p>
            </div>
          </div>
          <Badge variant="neutral">{confirmedAppointments.length} Active</Badge>
        </CardHeader>

        <div className="divide-y divide-soft-grey">
          {confirmedAppointments.map((apt) => (
            <div key={apt.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-warm-light-grey/30 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-bold text-navy">{apt.doctorName}</span>
                  <Badge variant={apt.type === 'ONLINE_TELEMEDICINE' ? 'info' : 'neutral'}>
                    {apt.type === 'ONLINE_TELEMEDICINE' ? 'ONLINE VIDEO (RECORDED)' : 'PHYSICAL VISIT'}
                  </Badge>
                  <span className="text-xs text-slate font-medium">• {apt.facilityName}</span>
                </div>
                <p className="text-xs text-slate">
                  Scheduled: <strong>{apt.date}</strong> | Payment: <span className="text-emerald-700 font-bold">{apt.paymentStatus}</span>
                </p>
                <div className="text-[11px] text-slate flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Document Access: {apt.allowRecords ? 'Granted to Doctor (72h lock)' : 'Withheld by Patient'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {apt.type === 'ONLINE_TELEMEDICINE' && apt.zoomLink && (
                  <a
                    href={apt.zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound.playClick()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-md hover:scale-105"
                  >
                    <Video className="w-4 h-4 animate-pulse" />
                    Join Google Meet / Zoom
                  </a>
                )}

                {apt.recordedVideoUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl shadow-xs"
                    onClick={() => {
                      sound.playClick();
                      setActiveRecordingToWatch(apt);
                    }}
                  >
                    <Play className="w-3.5 h-3.5 mr-1 text-coral" /> Watch Safety Recording
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION F: HEALTH LOCKER & UPLOADED MEDICAL DOCUMENTS */}
      {/* ========================================================================= */}
      <div ref={lockerRef}>
        <Card className="shadow-lg border border-soft-grey">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-coral-soft text-coral-deep">
                <FileText className="w-5 h-5 text-coral-deep" />
              </div>
              <div>
                <CardTitle>My DPDP Health Locker (Past Prescriptions & Lab Reports)</CardTitle>
                <p className="text-xs text-slate mt-0.5">
                  Encrypted storage of your medical records. Only shared with doctors when you explicitly grant consent.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                sound.playClick();
                setIsUploadModalOpen(true);
              }}
            >
              <Upload className="w-3.5 h-3.5 mr-1 text-slate" /> Upload Record
            </Button>
          </CardHeader>

          <div className="divide-y divide-soft-grey">
            {patientDocuments.map((doc) => (
              <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-warm-light-grey/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-navy">{doc.title}</span>
                    <Badge variant={doc.category === 'PRESCRIPTION' ? 'warning' : 'success'}>
                      {doc.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate">
                    Date: {doc.date} | Issued By: {doc.doctor} ({doc.facility}) | {doc.fileSize}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => {
                      sound.playClick();
                      setSelectedDocToView(doc);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1 text-slate" /> View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      sound.playChime();
                      alert(`Downloading verified copy of: ${doc.title}`);
                    }}
                  >
                    <Download className="w-4 h-4 text-slate" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING ACTION HUD / DOCK (PERSISTENT AT BOTTOM CENTER) */}
      {/* ========================================================================= */}
      <FloatingPatientDock
        onOpenAi={() => aiRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenAbha={() => abhaRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenDiscovery={() => discoveryRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenLocker={() => lockerRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onEmergencyTrigger={() => alert('🚨 Emergency 108 Dispatch Alert! Nearest ambulance dispatched to your Koramangala location.')}
      />

      {/* ========================================================================= */}
      {/* MODAL 1: APPOINTMENT BOOKING & SCOPED CONSENT */}
      {/* ========================================================================= */}
      {bookingDoctor && (
        <Modal
          isOpen={!!bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          title={`Book Appointment with ${bookingDoctor.fullName}`}
          description={`Specialty: ${bookingDoctor.primarySpecialty} • Experience: ${bookingDoctor.experienceYears} Years • Fee: ${discoveryMode === 'HOSPITAL' ? bookingDoctor.feeHospital : bookingDoctor.feeClinic}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setBookingDoctor(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitBookingRequest}
                isLoading={isSubmittingBooking}
                className="bg-navy hover:bg-navy/90 text-white font-bold"
              >
                Send Booking Request to {discoveryMode === 'HOSPITAL' ? 'Hospital' : 'Doctor'}
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Consultation Mode */}
            <div>
              <label className="font-bold text-navy block mb-1.5">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setConsultationType('PHYSICAL_HOSPITAL');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    consultationType === 'PHYSICAL_HOSPITAL'
                      ? 'bg-coral-soft border-coral text-navy shadow-xs font-bold ring-1 ring-coral/40'
                      : 'bg-warm-light-grey border-soft-grey text-slate'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-coral mb-1" />
                  <span>Physical In-Person Visit</span>
                  <p className="text-[10px] font-normal text-slate mt-0.5">Visit hospital or clinic in person</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setConsultationType('ONLINE_TELEMEDICINE');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    consultationType === 'ONLINE_TELEMEDICINE'
                      ? 'bg-emerald-soft border-emerald-600 text-navy shadow-xs font-bold ring-1 ring-emerald-500/40'
                      : 'bg-warm-light-grey border-soft-grey text-slate'
                  }`}
                >
                  <Video className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>Online Zoom / Meet Video</span>
                  <p className="text-[10px] font-normal text-slate mt-0.5">Live session with recorded playback</p>
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="font-bold text-navy block mb-1">Available Schedule Slot</label>
              <div className="p-3 rounded-xl bg-warm-light-grey border border-soft-grey flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy">Tomorrow, 10:00 AM - 10:30 AM</span>
                  <p className="text-[10px] text-slate">Slot held atomically under 10-minute lock</p>
                </div>
                <Badge variant="success">SLOT AVAILABLE</Badge>
              </div>
            </div>

            {/* Purpose of Visit */}
            <Input
              label="Chief Complaint / Purpose of Consultation"
              value={bookingReason}
              onChange={(e) => setBookingReason(e.target.value)}
              placeholder="e.g. Flu symptoms, fever, body aches"
            />

            {/* MANDATORY CONSENT TOGGLE */}
            <div className="p-3.5 rounded-xl bg-warm-light-grey border border-soft-grey space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy block">Medical Records Sharing Consent</span>
                  <p className="text-[11px] text-slate">
                    Allow {bookingDoctor.fullName} to view your previous prescriptions and test reports?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAllowDocumentSharing(!allowDocumentSharing);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    allowDocumentSharing ? 'bg-emerald-600' : 'bg-slate/40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      allowDocumentSharing ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {allowDocumentSharing ? (
                <div className="p-2 rounded-lg bg-emerald-soft border border-emerald-500/30 text-[10px] text-emerald-900 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Scoped 72-hour consent granted. Doctor can access past records for this encounter only.</span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-red-50 border border-coral-deep/30 text-[10px] text-coral-deep flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Consent withheld. Doctor will NOT be able to view past prescriptions or lab records.</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: UPLOAD DOCUMENT TO HEALTH LOCKER */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Past Medical Record / Prescription"
          description="Uploaded files are encrypted under India DPDP standards and stored in your private locker."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUploadDocument} className="bg-navy hover:bg-navy/90 text-white font-bold">
                Confirm & Encrypt Upload
              </Button>
            </>
          }
        >
          <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
            <Input
              label="Document Title / Name"
              value={uploadDocTitle}
              onChange={(e) => setUploadDocTitle(e.target.value)}
              placeholder="e.g. Apollo Hospital Prescription or Thyrocare Blood Test"
            />

            <div>
              <label className="font-bold text-navy block mb-1">Document Category</label>
              <select
                value={uploadDocCategory}
                onChange={(e) => setUploadDocCategory(e.target.value)}
                className="w-full bg-white border border-soft-grey rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-coral"
              >
                <option value="PRESCRIPTION">Doctor Prescription (Rx)</option>
                <option value="LAB_REPORT">Laboratory Investigation / Blood Test</option>
                <option value="DIAGNOSTIC_SUMMARY">Radiology (X-Ray / MRI / CT Scan)</option>
                <option value="DISCHARGE_SUMMARY">Hospital Inpatient Discharge Summary</option>
              </select>
            </div>

            <div className="p-6 border-2 border-dashed border-soft-grey rounded-xl text-center space-y-2 bg-warm-light-grey/50">
              <Upload className="w-8 h-8 text-slate mx-auto" />
              <p className="text-xs text-slate">
                Drag and drop your scanned PDF or photo here, or <span className="text-coral font-bold cursor-pointer">browse</span>
              </p>
              <p className="text-[10px] text-slate-light">Supports PDF, JPG, PNG up to 25 MB</p>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SAFETY VIDEO RECORDING PLAYBACK */}
      {/* ========================================================================= */}
      {activeRecordingToWatch && (
        <Modal
          isOpen={!!activeRecordingToWatch}
          onClose={() => setActiveRecordingToWatch(null)}
          title={`Consultation Safety Video Recording — ${activeRecordingToWatch.doctorName}`}
          description="Full encrypted audiovisual recording preserved for patient safety and record auditing."
          footer={
            <Button variant="secondary" onClick={() => setActiveRecordingToWatch(null)}>
              Close Player
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="aspect-video bg-navy rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
              <video
                src={activeRecordingToWatch.recordedVideoUrl}
                controls
                className="w-full h-full object-cover"
                autoPlay
              />
            </div>

            <div className="p-3.5 rounded-xl bg-warm-light-grey border border-soft-grey flex items-center justify-between">
              <div>
                <span className="font-bold text-navy block">{activeRecordingToWatch.doctorName} ({activeRecordingToWatch.specialty})</span>
                <span className="text-[11px] text-slate">Session Date: {activeRecordingToWatch.date}</span>
              </div>
              <Badge variant="success">RECORDING VERIFIED</Badge>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: IN-PORTAL DOCUMENT INSPECTOR / VIEWER */}
      {/* ========================================================================= */}
      <DocumentViewerModal
        document={selectedDocToView}
        onClose={() => setSelectedDocToView(null)}
      />

      {/* ========================================================================= */}
      {/* MODAL 5: EMPANELLED INSURANCE & CASHLESS HELPLINE DIRECTORY */}
      {/* ========================================================================= */}
      {isInsuranceModalOpen && (
        <Modal
          isOpen={isInsuranceModalOpen}
          onClose={() => setIsInsuranceModalOpen(false)}
          title="Empanelled Health Insurers & Cashless Desks"
          description="Approved nationwide network of 28 health insurance underwriters with 24x7 toll-free helplines and direct cashless portals."
          maxWidth="4xl"
          footer={
            <Button variant="secondary" onClick={() => setIsInsuranceModalOpen(false)}>
              Close Directory
            </Button>
          }
        >
          <div className="max-h-[72vh] overflow-y-auto pr-1">
            <EmpanelledInsuranceGrid />
          </div>
        </Modal>
      )}
    </div>
  );
};
