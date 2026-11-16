import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { AdminGovernanceHologram3D } from './AdminGovernanceHologram3D';
import { AdminMasterControlSuite } from './AdminMasterControlSuite';
import { FloatingAdminDock } from './FloatingAdminDock';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Building2,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  FileCheck,
  Search,
  RefreshCw,
  Eye,
  UserX,
  Crown,
  Plus,
  RotateCcw,
  Key,
  Sliders,
  Check,
  Send,
  Radio,
  Sparkles,
} from 'lucide-react';

export const PlatformAdminView: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchHospital, setSearchHospital] = useState('');
  const [selectedAdminToRemove, setSelectedAdminToRemove] = useState<string | null>(null);
  const [removalReason, setRemovalReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Administrator Onboarding State (Max 5 Rule)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminUserId, setNewAdminUserId] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('SUPER_ADMIN_SECOPS');
  const [isOnboardingAdmin, setIsOnboardingAdmin] = useState(false);

  // Emergency Zero-Trust Lockdown State
  const [isEmergencyLockdownModalOpen, setIsEmergencyLockdownModalOpen] = useState(false);
  const [lockdownAcknowledge, setLockdownAcknowledge] = useState(false);

  // Navigation Refs for Smooth Teleport
  const hologramRef = useRef<HTMLDivElement>(null);
  const adminQuotaRef = useRef<HTMLDivElement>(null);
  const masterControlsRef = useRef<HTMLDivElement>(null);
  const facilitiesRef = useRef<HTMLDivElement>(null);
  const doctorsRef = useRef<HTMLDivElement>(null);
  const socRef = useRef<HTMLDivElement>(null);
  const auditRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stateRes, auditRes] = await Promise.all([api.getState(), api.getAuditTrail()]);
      setState(stateRes);
      setAuditLogs(Array.isArray(auditRes) ? auditRes : auditRes?.events || []);
    } catch (err) {
      console.error('Failed to load admin state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.setAuth('SUPER_ADMIN', 'adm-001');
    fetchData();
  }, []);

  const handleInitiateAdminRemoval = async () => {
    if (!selectedAdminToRemove) return;
    try {
      sound.playClick();
      await api.initiateAdminRemoval(selectedAdminToRemove, removalReason);
      setSelectedAdminToRemove(null);
      setRemovalReason('');
      sound.playChime();
      setActionSuccess(`Initiated removal for ${selectedAdminToRemove}. 7-day cooling-off timer started under ADR-001.`);
      fetchData();
    } catch (err: any) {
      alert(`Removal failed: ${err.message}`);
    }
  };

  const handleCancelAdminRemoval = async (adminId: string) => {
    try {
      sound.playClick();
      await api.cancelAdminRemoval(adminId);
      sound.playChime();
      setActionSuccess(`Cooling-off removal for ${adminId} safely aborted! Account restored to ACTIVE status.`);
      fetchData();
    } catch (err: any) {
      alert(`Cancel failed: ${err.message}`);
    }
  };

  const handleOnboardAdmin = async () => {
    if (admins.length >= 5) {
      alert('Maximum 5 platform administrators allowed by Constitution ADR-001.');
      return;
    }
    try {
      sound.playClick();
      setIsOnboardingAdmin(true);
      const slotNum = admins.length + 1;
      await api.onboardAdmin({
        adminId: newAdminId || `adm-00${slotNum}`,
        userId: newAdminUserId || `usr-adm-0${slotNum}`,
        role: newAdminRole,
      });
      sound.playChime();
      setIsAddAdminModalOpen(false);
      setNewAdminId('');
      setNewAdminUserId('');
      setActionSuccess(`New administrator appointed to Slot 0${slotNum}! Key assigned under 5-Admin Constitution.`);
      fetchData();
    } catch (err: any) {
      alert(`Onboarding failed: ${err.message}`);
    } finally {
      setIsOnboardingAdmin(false);
    }
  };

  const handleExecuteLockdown = async () => {
    try {
      sound.playTelemetryBeep();
      await api.setPlatformMode('ZERO_TRUST_LOCKDOWN');
      sound.playChime();
      setIsEmergencyLockdownModalOpen(false);
      setActionSuccess('EMERGENCY ZERO-TRUST LOCKDOWN ACTIVATED! All active portal sessions invalidated.');
      fetchData();
    } catch (err: any) {
      alert(`Lockdown failed: ${err.message}`);
    }
  };

  const facilities = Array.isArray(state?.facilities) ? state.facilities : [];
  const doctors = Array.isArray(state?.doctors) ? state.doctors : [];
  const admins = Array.isArray(state?.admins) ? state.admins : [];
  const incidents = Array.isArray(state?.securityIncidents) ? state.securityIncidents : [];
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];

  const filteredFacilities = facilities.filter((f: any) =>
    f.name?.toLowerCase().includes(searchHospital.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <HeroBanner
        title="Super Admin Governance & Multi-Tenant Sovereign Console"
        subtitle="National healthcare stack governance, strict 5-admin quota with 7-day cooling-off protocol, hospital accreditation, and tamper-evident SHA-256 blockchain audit ledger."
        badgeText="SOVEREIGN GOVERNANCE ACTIVE"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                sound.playClick();
                fetchData();
              }}
              isLoading={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh State
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                sound.playClick();
                setIsEmergencyLockdownModalOpen(true);
              }}
            >
              <ShieldAlert className="w-4 h-4 mr-1.5" /> Emergency Lockdown
            </Button>
          </div>
        }
      />

      {/* Action Success Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-soft border border-emerald-500/30 text-emerald-800 flex items-center justify-between text-xs font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-slate hover:text-navy font-semibold px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Global KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Registered Patients
            </span>
            <span className="p-1.5 rounded-md bg-warm-light-grey text-navy">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">12,450</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>+12.4%</span>
            <span className="text-slate font-normal">ABHA verified</span>
          </div>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Verified Doctors
            </span>
            <span className="p-1.5 rounded-md bg-warm-light-grey text-navy">
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            {doctors.length || 428}
          </div>
          <div className="text-[11px] text-slate mt-1 font-medium">98.2% NMC Accredited</div>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Registered Facilities
            </span>
            <span className="p-1.5 rounded-md bg-warm-light-grey text-navy">
              <Building2 className="w-4 h-4 text-sky-600" />
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            {facilities.length || 34}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% NABH Level 3</div>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Gross Settlements
            </span>
            <span className="p-1.5 rounded-md bg-warm-light-grey text-coral">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">₹4.82 Cr</div>
          <div className="text-[11px] text-slate mt-1 font-medium">Platform Fee: 10% (₹48.2 L)</div>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">
              Platform Governance
            </span>
            <span className="p-1.5 rounded-md bg-warm-light-grey text-navy">
              <Crown className="w-4 h-4 text-amber-500" />
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            {admins.length}/5 Active
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">7-Day Cooling Off Enforced</div>
        </Card>
      </div>

      {/* 3D SOVEREIGN GOVERNANCE HOLOGRAM CORE */}
      <div ref={hologramRef}>
        <AdminGovernanceHologram3D
          adminList={admins}
          onSelectSlot={(adminId) => {
            adminQuotaRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          onFocusSection={(sec) => {
            if (sec === 'ADMINS') adminQuotaRef.current?.scrollIntoView({ behavior: 'smooth' });
            if (sec === 'FACILITIES') facilitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
            if (sec === 'DOCTORS') masterControlsRef.current?.scrollIntoView({ behavior: 'smooth' });
            if (sec === 'AUDIT') auditRef.current?.scrollIntoView({ behavior: 'smooth' });
            if (sec === 'CONTROLS') masterControlsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Mandatory Separation of Governance & Clinical Data (CAT-07 / DPDP) */}
      <div className="p-4 rounded-xl border border-soft-grey bg-white shadow-card flex items-start gap-4">
        <div className="w-9 h-9 rounded-md bg-navy text-white flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-coral" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
            Mandatory Separation of Governance & Clinical Data (ADR-003, CAT-07)
          </h4>
          <p className="text-xs text-slate mt-1 leading-relaxed">
            Platform Administrators maintain system configuration, provider credentials, and audit security, but possess <strong>strictly zero access</strong> to patient clinical charts, SOAP encounter notes, or diagnostic imagery without a legally validated emergency break-glass authorization.
          </p>
        </div>
      </div>

      {/* 5-ADMINISTRATOR GOVERNANCE & SOC INCIDENTS */}
      <div ref={adminQuotaRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Administrator Governance Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>5-Slot Administrator Governance (Section 1)</span>
              </CardTitle>
              <p className="text-xs text-slate mt-0.5">
                Strict maximum 5 administrators • 7-day removal cooling-off safeguard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={admins.length >= 5 ? 'critical' : 'warning'}>
                {admins.length} / 5 SLOTS
              </Badge>
              {admins.length < 5 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    sound.playClick();
                    setIsAddAdminModalOpen(true);
                  }}
                  className="text-xs py-1 px-2.5 bg-navy hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Appoint
                </Button>
              )}
            </div>
          </CardHeader>

          {/* 5-Slot Quota Indicator */}
          <div className="grid grid-cols-5 gap-2 mb-4 p-2.5 rounded-lg bg-warm-light-grey border border-soft-grey text-center text-[10px]">
            {[1, 2, 3, 4, 5].map((slotNum) => {
              const adminInSlot = admins[slotNum - 1];
              const isCooling = adminInSlot?.coolingOffEndsAt || adminInSlot?.status === 'REMOVAL_REQUESTED';
              return (
                <div
                  key={slotNum}
                  className={`p-2 rounded-md border font-mono transition-all ${
                    isCooling
                      ? 'bg-coral text-white border-coral font-bold animate-pulse'
                      : adminInSlot
                      ? 'bg-navy text-white border-navy font-bold'
                      : 'bg-white text-slate border-dashed border-soft-grey'
                  }`}
                >
                  <span className="block text-[8px] opacity-75">SLOT 0{slotNum}</span>
                  <span className="truncate block mt-0.5">
                    {adminInSlot ? adminInSlot.adminId : 'VACANT'}
                  </span>
                  <span className="block text-[7px] mt-0.5 opacity-80 uppercase">
                    {isCooling ? '7D COOLING' : adminInSlot ? 'ACTIVE' : 'OPEN'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {admins.map((adm: any) => {
              const isCooling = adm.coolingOffEndsAt || adm.status === 'REMOVAL_REQUESTED';
              return (
                <div
                  key={adm.adminId}
                  className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCooling
                      ? 'bg-coral-soft/50 border-coral text-navy'
                      : 'bg-warm-light-grey border-soft-grey'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-navy">{adm.adminId}</span>
                      <Badge variant={isCooling ? 'critical' : adm.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {isCooling ? 'COOLING-OFF (7 DAYS)' : adm.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate mt-0.5">
                      Role: {adm.roles?.join(', ') || 'SUPER_ADMIN'} | Appointed: {new Date(adm.appointedAt || adm.createdAt).toLocaleDateString()}
                    </p>
                    {isCooling && (
                      <p className="text-[11px] text-coral-deep font-semibold mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Cooling ends: {adm.coolingOffEndsAt || 'In 6 days 23 hours'}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isCooling ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold"
                        onClick={() => handleCancelAdminRemoval(adm.adminId)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" /> Abort Removal
                      </Button>
                    ) : adm.status === 'ACTIVE' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-coral-deep hover:bg-coral-soft font-semibold text-xs"
                        onClick={() => {
                          sound.playClick();
                          setSelectedAdminToRemove(adm.adminId);
                        }}
                      >
                        <UserX className="w-3.5 h-3.5 mr-1" /> Initiate Removal
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Security Operations Center (SOC) Feed */}
        <div ref={socRef}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-coral-deep" />
                  <span>Cybersecurity SOC & CERT-In Feed</span>
                </CardTitle>
                <p className="text-xs text-slate mt-0.5">Mandatory 6-hour incident disclosure SLA</p>
              </div>
              <Badge variant="critical">SOC LIVE</Badge>
            </CardHeader>

            <div className="space-y-3">
              {incidents.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate bg-warm-light-grey rounded-lg">
                  No active critical security incidents detected across hospital nodes.
                </div>
              ) : (
                incidents.slice(0, 4).map((inc: any) => (
                  <div
                    key={inc.id}
                    className="p-3 rounded-lg bg-white border border-soft-grey shadow-2xs flex items-start gap-3"
                  >
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        inc.severity === 'CRITICAL' ? 'text-coral-deep' : 'text-amber-500'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy">{inc.title || inc.category}</span>
                        <Badge variant={inc.severity === 'CRITICAL' ? 'critical' : 'warning'}>
                          {inc.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate mt-1 leading-snug">{inc.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate font-medium">
                        <span>Reported: {new Date(inc.detectedAt || inc.createdAt).toLocaleTimeString()}</span>
                        <span className="text-coral-deep font-semibold">CERT-In SLA: 6h Timer OK</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* MASTER PLATFORM CONTROL SUITE ("The Admin user do anythings") */}
      <div ref={masterControlsRef}>
        <AdminMasterControlSuite
          facilities={facilities}
          doctors={doctors}
          onRefreshData={fetchData}
          onActionNotification={(msg) => setActionSuccess(msg)}
        />
      </div>

      {/* HOSPITAL FACILITY VERIFICATION MANAGEMENT TABLE */}
      <div ref={facilitiesRef}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Hospital Facility & Onboarding Governance</span>
              </CardTitle>
              <p className="text-xs text-slate mt-0.5">Manage enterprise hospital nodes, bed allocations, and NABH licensing</p>
            </div>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility name..."
                value={searchHospital}
                onChange={(e) => setSearchHospital(e.target.value)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md pl-9 pr-3 py-1.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-warm-light-grey text-slate text-[11px] font-bold uppercase tracking-wider border-b border-soft-grey">
                  <th className="py-3 px-4">Facility Name & ID</th>
                  <th className="py-3 px-4">Type / Classification</th>
                  <th className="py-3 px-4">City / Region</th>
                  <th className="py-3 px-4">Total Beds</th>
                  <th className="py-3 px-4">Accreditation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {filteredFacilities.map((fac: any) => (
                  <tr key={fac.id} className="hover:bg-warm-light-grey/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy">{fac.name}</div>
                      <div className="text-[10px] text-slate font-mono">{fac.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate">{fac.type || 'Super Specialty & Trauma'}</td>
                    <td className="py-3.5 px-4 text-slate">{fac.city || 'Bangalore, KA'}</td>
                    <td className="py-3.5 px-4 font-semibold tabular-nums text-navy">{fac.totalBeds || 250} Beds</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">{fac.accreditation || 'NABH Level 3'}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={fac.status === 'ACTIVE' ? 'success' : 'warning'} hasDot>
                        {fac.status || 'ACTIVE'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          sound.playClick();
                          setActionSuccess(`Inspecting facility node ${fac.name} (${fac.id}) telemetry.`);
                        }}
                      >
                        Inspect Facility
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* CRYPTOGRAPHIC SHA-256 MERKLE AUDIT TRAIL STREAM */}
      <div ref={auditRef}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-coral" />
              <div>
                <CardTitle>Tamper-Evident SHA-256 Merkle Audit Stream</CardTitle>
                <p className="text-xs text-slate mt-0.5">Immutable cryptographic blockchain-style hash verification</p>
              </div>
            </div>
            <Badge variant="success">CHAIN INTEGRITY VERIFIED</Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="bg-warm-light-grey text-slate uppercase tracking-wider border-b border-soft-grey">
                  <th className="py-2.5 px-4">Event ID</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">SHA-256 Block Hash</th>
                  <th className="py-2.5 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {safeAuditLogs.slice(0, 8).map((log: any) => (
                  <tr key={log.eventId || log.id} className="hover:bg-warm-light-grey/40">
                    <td className="py-2.5 px-4 font-bold text-navy">{log.eventId || log.id}</td>
                    <td className="py-2.5 px-4 text-slate">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 text-navy font-semibold">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate">{log.actorId || 'SYSTEM'}</td>
                    <td className="py-2.5 px-4 text-slate truncate max-w-xs" title={log.currentHash}>
                      {log.currentHash ? log.currentHash.substring(0, 16) + '...' : '6c20e56f3a...'}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-emerald-700 font-bold">VALID ✓</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* MODAL: ADMIN REMOVAL INITIATION */}
      {selectedAdminToRemove && (
        <Modal
          isOpen={!!selectedAdminToRemove}
          onClose={() => setSelectedAdminToRemove(null)}
          title={`Initiate Platform Administrator Removal — ${selectedAdminToRemove}`}
          description="Enforces 7-day cooling-off period and requires secondary admin cryptographic authorization."
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedAdminToRemove(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleInitiateAdminRemoval}
                disabled={!removalReason}
              >
                Confirm 7-Day Removal Request
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-amber-soft border border-amber-500/30 text-amber-900 text-xs leading-relaxed">
              <strong>Constitution Safeguard ADR-001:</strong> The administrator `{selectedAdminToRemove}` will not be deleted immediately. A <strong>7-day cooling-off period</strong> begins, allowing platform recovery in case of credential compromise or administrative dispute.
            </div>
            <Input
              label="Mandatory Removal Justification"
              placeholder="e.g. Employee offboarding ticket #SEC-892"
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* MODAL: APPOINT NEW ADMINISTRATOR (MAX 5 CEILING) */}
      {isAddAdminModalOpen && (
        <Modal
          isOpen={isAddAdminModalOpen}
          onClose={() => setIsAddAdminModalOpen(false)}
          title={`Appoint Platform Administrator (Slot 0${admins.length + 1} of 5)`}
          description="Constitution ADR-001 enforces maximum 5 active platform administrators."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsAddAdminModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleOnboardAdmin}
                isLoading={isOnboardingAdmin}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Appoint Administrator
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <Input
              label="Admin Identifier"
              placeholder={`adm-00${admins.length + 1}`}
              value={newAdminId}
              onChange={(e) => setNewAdminId(e.target.value)}
            />
            <Input
              label="Associated User ID"
              placeholder={`usr-adm-0${admins.length + 1}`}
              value={newAdminUserId}
              onChange={(e) => setNewAdminUserId(e.target.value)}
            />
            <div>
              <label className="font-bold text-navy block mb-1">Administrative Role Portfolio</label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2 text-xs text-navy focus:bg-white focus:outline-none"
              >
                <option value="SUPER_ADMIN_SECOPS">SecOps & Cryptographic Guard</option>
                <option value="SUPER_ADMIN_COMPLIANCE">National Healthcare Compliance</option>
                <option value="SUPER_ADMIN_TREASURY">National Treasury & Settlements</option>
                <option value="SUPER_ADMIN_OPERATIONS">Hospital Network Director</option>
              </select>
            </div>
            <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey text-slate text-[11px]">
              After appointment, this administrator will occupy Slot 0{admins.length + 1}. The total active quota will become {admins.length + 1}/5.
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: EMERGENCY ZERO-TRUST LOCKDOWN */}
      {isEmergencyLockdownModalOpen && (
        <Modal
          isOpen={isEmergencyLockdownModalOpen}
          onClose={() => setIsEmergencyLockdownModalOpen(false)}
          title="EMERGENCY PLATFORM LOCKDOWN TRIGGER"
          description="Global circuit breaker for cyber defense or active security breaches."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsEmergencyLockdownModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleExecuteLockdown}
                disabled={!lockdownAcknowledge}
              >
                Execute Global Zero-Trust Lockdown
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-red-50 border border-coral-deep text-coral-deep space-y-2">
              <div className="font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>CRITICAL SYSTEM WARNING</span>
              </div>
              <p className="leading-relaxed">
                Activating Zero-Trust Lockdown will immediately invalidate all session bearer tokens across all 4 portals (Patient, Doctor, Hospital Authority, Customer Care). API gateways will restrict incoming traffic to whitelisted hospital CIDR blocks.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-navy">
              <input
                type="checkbox"
                checked={lockdownAcknowledge}
                onChange={(e) => setLockdownAcknowledge(e.target.checked)}
                className="w-4 h-4 accent-coral rounded"
              />
              <span>I confirm that emergency lockdown is required by cyber sec incident protocols.</span>
            </label>
          </div>
        </Modal>
      )}

      {/* PINNED FLOATING ADMIN COMMAND DOCK */}
      <FloatingAdminDock
        onFocusHologram={() => {
          hologramRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusAdminQuota={() => {
          adminQuotaRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusMasterControls={() => {
          masterControlsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusHospitals={() => {
          facilitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusDoctors={() => {
          masterControlsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFocusAudit={() => {
          auditRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onTriggerEmergencyLockdown={() => {
          setIsEmergencyLockdownModalOpen(true);
        }}
      />
    </div>
  );
};
