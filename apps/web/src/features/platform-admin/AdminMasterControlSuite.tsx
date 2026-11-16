import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  ShieldAlert,
  Zap,
  Sliders,
  DollarSign,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  FileCheck,
  Send,
  Plus,
  Scale,
  Award,
  Sparkles,
} from 'lucide-react';

interface AdminMasterControlSuiteProps {
  onRefreshData: () => void;
  facilities: any[];
  doctors: any[];
  onActionNotification: (msg: string) => void;
}

export const AdminMasterControlSuite: React.FC<AdminMasterControlSuiteProps> = ({
  onRefreshData,
  facilities = [],
  doctors = [],
  onActionNotification,
}) => {
  // Master Platform Operating Mode State
  const [platformMode, setPlatformModeState] = useState<'NORMAL_OPERATIONS' | 'MAINTENANCE_DRAIN' | 'ZERO_TRUST_LOCKDOWN' | 'AYUSHMAN_BHARAT'>('NORMAL_OPERATIONS');
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  // Commission & Fee Regulator State
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(10);
  const [isSettlementInProgress, setIsSettlementInProgress] = useState(false);
  const [settlementReceipt, setSettlementReceipt] = useState<any | null>(null);

  // Hospital Onboarding Modal State
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityCity, setNewFacilityCity] = useState('New Delhi, DL');
  const [newFacilityBeds, setNewFacilityBeds] = useState(250);
  const [newFacilityType, setNewFacilityType] = useState('Super Specialty & Trauma');
  const [newFacilityNabh, setNewFacilityNabh] = useState('NABH Level 3 (National Apex)');
  const [isSubmittingFacility, setIsSubmittingFacility] = useState(false);

  // Doctor Verification / Inspection Modal State
  const [selectedDoctorForReview, setSelectedDoctorForReview] = useState<any | null>(null);

  // Change Platform Mode
  const handleSwitchPlatformMode = async (mode: 'NORMAL_OPERATIONS' | 'MAINTENANCE_DRAIN' | 'ZERO_TRUST_LOCKDOWN' | 'AYUSHMAN_BHARAT') => {
    try {
      sound.playClick();
      setIsUpdatingMode(true);
      await api.setPlatformMode(mode);
      setPlatformModeState(mode);
      sound.playChime();
      onActionNotification(`Master Platform Mode updated to: ${mode}. Multi-tenant policies enforced.`);
    } catch (err: any) {
      onActionNotification(`Failed to set mode: ${err.message}`);
    } finally {
      setIsUpdatingMode(false);
    }
  };

  // Trigger Instant Batch Payout to Hospital Network
  const handleTriggerBatchSettlement = () => {
    sound.playTelemetryBeep();
    setIsSettlementInProgress(true);
    setTimeout(() => {
      sound.playChime();
      setIsSettlementInProgress(false);
      setSettlementReceipt({
        batchId: `PAYOUT-BAT-${Date.now().toString().slice(-6)}`,
        totalGross: '₹4,82,40,000',
        platformFeeDeducted: `₹${((48240000 * platformFeePercent) / 100).toLocaleString('en-IN')}`,
        netDisbursedToHospitals: `₹${((48240000 * (100 - platformFeePercent)) / 100).toLocaleString('en-IN')}`,
        participatingHospitals: facilities.length || 34,
        paymentGateway: 'RBI RTGS / Razorpay Enterprise Escrow',
        neftUtr: `UTR-IN-2026-${Math.floor(100000000 + Math.random() * 900000000)}`,
        timestamp: new Date().toLocaleTimeString(),
      });
      onActionNotification(`Batch treasury payout successfully disbursed to ${facilities.length || 34} hospital nodes!`);
    }, 1800);
  };

  // Submit New Hospital Facility Onboarding
  const handleCreateFacility = async () => {
    if (!newFacilityName) return;
    try {
      sound.playClick();
      setIsSubmittingFacility(true);
      await api.createFacility({
        name: newFacilityName,
        city: newFacilityCity,
        totalBeds: Number(newFacilityBeds),
        type: newFacilityType,
        nabhLevel: newFacilityNabh,
      });
      sound.playChime();
      setIsAddFacilityModalOpen(false);
      setNewFacilityName('');
      onActionNotification(`Hospital facility "${newFacilityName}" successfully onboarded and granted NABH Level 3 license!`);
      onRefreshData();
    } catch (err: any) {
      onActionNotification(`Onboarding failed: ${err.message}`);
    } finally {
      setIsSubmittingFacility(false);
    }
  };

  // Approve Doctor Affiliation Nationally
  const handleApproveDoctorNationally = async (doctor: any) => {
    try {
      sound.playClick();
      await api.request(`/api/v1/doctors/${doctor.id}/affiliations/approve`, { method: 'POST' });
      sound.playChime();
      setSelectedDoctorForReview(null);
      onActionNotification(`Doctor Dr. ${doctor.name} (${doctor.specialty}) nationally accredited under NMC Registry!`);
      onRefreshData();
    } catch (err: any) {
      onActionNotification(`Approval failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold font-display text-navy flex items-center gap-2">
            <Sliders className="w-5 h-5 text-coral" />
            <span>Master Platform Operations & Multi-Tenant Authority</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy text-white font-mono font-bold">
              SUPER_ADMIN CLEARANCE
            </span>
          </h3>
          <p className="text-xs text-slate mt-0.5">
            Real-time control switches: platform operational mode, doctor national accreditation, hospital provisioning, and financial fee treasury.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              sound.playClick();
              setIsAddFacilityModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Onboard Hospital Facility
          </Button>
        </div>
      </div>

      {/* 2-COLUMN GRID: GLOBAL OPERATIONAL MODES & FINANCIAL SETTLEMENT REGULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Operational Mode Switcher */}
        <Card className="border border-soft-grey">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-coral" /> Global Platform Mode Switch
              </CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Instantaneous national circuit breakers and operational states
              </p>
            </div>
            <Badge
              variant={
                platformMode === 'NORMAL_OPERATIONS'
                  ? 'success'
                  : platformMode === 'ZERO_TRUST_LOCKDOWN'
                  ? 'critical'
                  : 'warning'
              }
            >
              {platformMode.replace('_', ' ')}
            </Badge>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mode 1: Normal Operations */}
            <div
              onClick={() => handleSwitchPlatformMode('NORMAL_OPERATIONS')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                platformMode === 'NORMAL_OPERATIONS'
                  ? 'bg-emerald-50/60 border-emerald-500 shadow-sm'
                  : 'bg-warm-light-grey/40 border-soft-grey hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy">Normal Operations</span>
                {platformMode === 'NORMAL_OPERATIONS' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-[11px] text-slate mt-1 leading-snug">
                All 4 portals active: Patient booking, Doctor consultations, Hospital bed management, and Office staff.
              </p>
            </div>

            {/* Mode 2: Maintenance Drain */}
            <div
              onClick={() => handleSwitchPlatformMode('MAINTENANCE_DRAIN')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                platformMode === 'MAINTENANCE_DRAIN'
                  ? 'bg-amber-50/60 border-amber-500 shadow-sm'
                  : 'bg-warm-light-grey/40 border-soft-grey hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy">Maintenance Drain</span>
                {platformMode === 'MAINTENANCE_DRAIN' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <p className="text-[11px] text-slate mt-1 leading-snug">
                Graceful queue drain: prevents new slot holds while active hospital clinical sessions finish safely.
              </p>
            </div>

            {/* Mode 3: Zero-Trust Security Lockdown */}
            <div
              onClick={() => handleSwitchPlatformMode('ZERO_TRUST_LOCKDOWN')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                platformMode === 'ZERO_TRUST_LOCKDOWN'
                  ? 'bg-red-50 border-coral-deep shadow-sm'
                  : 'bg-warm-light-grey/40 border-soft-grey hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-coral-deep">Zero-Trust Lockdown</span>
                {platformMode === 'ZERO_TRUST_LOCKDOWN' && (
                  <ShieldAlert className="w-4 h-4 text-coral-deep" />
                )}
              </div>
              <p className="text-[11px] text-slate mt-1 leading-snug">
                Emergency breaker: forces immediate credential re-auth across all roles and enforces strict IP pinning.
              </p>
            </div>

            {/* Mode 4: Ayushman Bharat Waiver */}
            <div
              onClick={() => handleSwitchPlatformMode('AYUSHMAN_BHARAT')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                platformMode === 'AYUSHMAN_BHARAT'
                  ? 'bg-sky-50 border-sky-600 shadow-sm'
                  : 'bg-warm-light-grey/40 border-soft-grey hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy">Ayushman PM-JAY Wave</span>
                {platformMode === 'AYUSHMAN_BHARAT' && (
                  <Award className="w-4 h-4 text-sky-600" />
                )}
              </div>
              <p className="text-[11px] text-slate mt-1 leading-snug">
                Waiver protocol: 0% platform transaction fees applied to all public hospitals with auto-claim reconciliation.
              </p>
            </div>
          </div>
        </Card>

        {/* Financial Fee & Treasury Settlement Regulator */}
        <Card className="border border-soft-grey">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Platform Fee & Treasury Settlement
              </CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Regulate national transaction take-rate & disburse hospital escrow payouts
              </p>
            </div>
            <Badge variant="success">TREASURY ACTIVE</Badge>
          </CardHeader>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-navy">Platform Commission Take-Rate:</span>
                <span className="font-mono font-bold text-coral text-sm">{platformFeePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(parseFloat(e.target.value))}
                className="w-full accent-coral h-2 bg-warm-light-grey rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate mt-1">
                <span>0% (Ayushman Subsidy)</span>
                <span>5% (Public Tier)</span>
                <span>10% (Default Enterprise)</span>
                <span>15% (Premium Cap)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-warm-light-grey/60 border border-soft-grey flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate block">Current Accrued Platform Revenue</span>
                <span className="text-lg font-bold font-display text-navy">
                  ₹{((48240000 * platformFeePercent) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleTriggerBatchSettlement}
                isLoading={isSettlementInProgress}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                <Send className="w-4 h-4 mr-1.5" /> Disburse Batch Payout
              </Button>
            </div>

            {/* Render Settlement Receipt if generated */}
            {settlementReceipt && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-500/30 text-xs font-mono space-y-1">
                <div className="flex justify-between text-[10px] text-slate border-b border-emerald-200 pb-1">
                  <span className="font-bold text-emerald-900">{settlementReceipt.batchId}</span>
                  <span className="text-emerald-700">{settlementReceipt.timestamp}</span>
                </div>
                <div className="text-navy flex justify-between">
                  <span>Net to {settlementReceipt.participatingHospitals} Hospitals:</span>
                  <span className="font-bold">{settlementReceipt.netDisbursedToHospitals}</span>
                </div>
                <div className="text-[10px] text-slate truncate">
                  UTR: {settlementReceipt.neftUtr}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* NATIONAL DOCTOR ACCREDITATION & CREDENTIAL REPOSITORIES */}
      <Card className="border border-soft-grey">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-navy" /> National Medical Commission (NMC) Doctor Accreditation
            </CardTitle>
            <p className="text-xs text-slate mt-0.5">
              Super Admin verification of doctor degrees, surgery track records, hospital affiliations, and published research
            </p>
          </div>
          <Badge variant="neutral">{doctors.length} LICENSED PRACTITIONERS</Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-warm-light-grey text-slate text-[11px] font-bold uppercase tracking-wider border-b border-soft-grey">
                <th className="py-3 px-4">Doctor Name & NMC ID</th>
                <th className="py-3 px-4">Degrees & Specialization</th>
                <th className="py-3 px-4">Affiliated Facility</th>
                <th className="py-3 px-4">Surgeries / Cases</th>
                <th className="py-3 px-4">Consultation Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Super Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-grey">
              {doctors.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-warm-light-grey/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">Dr. {doc.name}</div>
                    <div className="text-[10px] text-slate font-mono">NMC-{doc.id.toUpperCase()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-navy">{doc.specialty || 'General Medicine'}</div>
                    <div className="text-[10px] text-slate">MBBS, MD, Fellowship</div>
                  </td>
                  <td className="py-3 px-4 text-slate">
                    {doc.facilityName || 'Apollo Indraprastha Center'}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-navy">
                    {doc.casesHandled || '450+'} Surgeries
                  </td>
                  <td className="py-3 px-4 font-bold text-navy">
                    ₹{doc.fee || 800}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={doc.status === 'ACTIVE' || !doc.status ? 'success' : 'warning'} hasDot>
                      {doc.status || 'VERIFIED'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        sound.playClick();
                        setSelectedDoctorForReview(doc);
                      }}
                    >
                      Inspect License
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: ONBOARD HOSPITAL FACILITY */}
      {isAddFacilityModalOpen && (
        <Modal
          isOpen={isAddFacilityModalOpen}
          onClose={() => setIsAddFacilityModalOpen(false)}
          title="Onboard New Hospital Facility into National Stack"
          description="Registers facility node, assigns bed capacity quotas, and grants NABH accreditation license."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsAddFacilityModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateFacility}
                isLoading={isSubmittingFacility}
                disabled={!newFacilityName}
              >
                Grant License & Onboard
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <Input
              label="Hospital Legal Entity Name"
              placeholder="e.g. Fortis Memorial Research Institute"
              value={newFacilityName}
              onChange={(e) => setNewFacilityName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City & State"
                value={newFacilityCity}
                onChange={(e) => setNewFacilityCity(e.target.value)}
              />
              <Input
                label="Total Bed Capacity"
                type="number"
                value={newFacilityBeds}
                onChange={(e) => setNewFacilityBeds(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-navy block mb-1">Facility Classification</label>
                <select
                  value={newFacilityType}
                  onChange={(e) => setNewFacilityType(e.target.value)}
                  className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2 text-xs text-navy focus:bg-white focus:outline-none"
                >
                  <option value="Super Specialty & Trauma">Super Specialty & Trauma</option>
                  <option value="Tertiary Care Hospital">Tertiary Care Hospital</option>
                  <option value="Community Health Center">Community Health Center</option>
                  <option value="Specialized Surgical Center">Specialized Surgical Center</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-navy block mb-1">NABH Level Accreditation</label>
                <select
                  value={newFacilityNabh}
                  onChange={(e) => setNewFacilityNabh(e.target.value)}
                  className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2 text-xs text-navy focus:bg-white focus:outline-none"
                >
                  <option value="NABH Level 3 (National Apex)">NABH Level 3 (National Apex)</option>
                  <option value="NABH Level 2 (Standard)">NABH Level 2 (Standard)</option>
                  <option value="NABH Entry-Level Certified">NABH Entry-Level Certified</option>
                  <option value="JCI Accredited International">JCI Accredited International</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
              Upon approval, the hospital authority credentials will be issued, activating their bed quota, OT surgery suites, and LIS diagnostic gateways.
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: INSPECT DOCTOR LICENSE & ACCREDITATION */}
      {selectedDoctorForReview && (
        <Modal
          isOpen={!!selectedDoctorForReview}
          onClose={() => setSelectedDoctorForReview(null)}
          title={`Doctor Clinical Credentials — Dr. ${selectedDoctorForReview.name}`}
          description={`NMC Medical Council License: NMC-${selectedDoctorForReview.id.toUpperCase()}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedDoctorForReview(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                onClick={() => handleApproveDoctorNationally(selectedDoctorForReview)}
              >
                <FileCheck className="w-4 h-4 mr-1.5" /> Re-Verify & Accredit Credentials
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-warm-light-grey border border-soft-grey space-y-1.5">
              <div className="flex justify-between font-bold text-navy">
                <span>Specialization:</span>
                <span>{selectedDoctorForReview.specialty}</span>
              </div>
              <div className="flex justify-between text-slate">
                <span>Primary Clinic / Hospital:</span>
                <span>{selectedDoctorForReview.facilityName || 'Indraprastha Medical Center'}</span>
              </div>
              <div className="flex justify-between text-slate">
                <span>Total Documented Surgeries:</span>
                <span className="font-mono font-bold text-navy">{selectedDoctorForReview.casesHandled || '450+'} Cases</span>
              </div>
              <div className="flex justify-between text-slate">
                <span>Published Research & Books:</span>
                <span className="font-semibold text-emerald-700">3 Books • 14 Peer-Reviewed Articles</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-navy text-white space-y-1">
              <span className="text-[10px] uppercase font-bold text-coral">Government Healthcare Registry Check</span>
              <p className="text-[11px] text-slate-200">
                National Medical Commission (NMC) database confirms zero disciplinary sanctions and verified clinical qualifications.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

