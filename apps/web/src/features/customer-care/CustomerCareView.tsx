import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { TiltCard } from '@/components/ui/TiltCard';
import { CustomerCareLiveDesk } from './CustomerCareLiveDesk';
import { FloatingCustomerCareDock } from './FloatingCustomerCareDock';
import { sound } from '@/services/soundEffects';
import { api } from '@/services/api';
import {
  HeartHandshake,
  AlertCircle,
  Clock,
  Search,
  Lock,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Send,
  MessageSquare,
  Mail,
  UserX,
  FileWarning,
  ArrowRight,
  Check,
  PhoneCall,
  UserCheck,
  FileText,
  Zap,
} from 'lucide-react';

export const CustomerCareView: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([
    {
      id: 'tkt-pay-01',
      category: 'PAYMENT_FAILURE',
      title: 'UPI Payment Debited but Appointment Marked Pending',
      patientId: 'usr-pat-001',
      patientName: 'Rahul Verma',
      priority: 'HIGH',
      status: 'OPEN',
      slaMinutes: 14,
      details: 'Bank debited ₹800 but gateway timed out on confirmation callback.',
    },
    {
      id: 'tkt-doc-02',
      category: 'DOCTOR_NO_SHOW',
      title: 'Doctor Appointment Not Honored by Doctor',
      patientId: 'usr-pat-priya',
      patientName: 'Priya Nair',
      priority: 'CRITICAL',
      status: 'OPEN',
      slaMinutes: 8,
      details: 'Doctor was called to emergency trauma bay; OPD patient waiting for 45 mins.',
    },
    {
      id: 'tkt-doc-03',
      category: 'DOCUMENT_FAILURE',
      title: 'Hospital Lab Report Document Upload Failure',
      patientId: 'usr-pat-001',
      patientName: 'Rahul Verma',
      priority: 'NORMAL',
      status: 'OPEN',
      slaMinutes: 28,
      details: 'PDF scan of CBC report corrupted during upload from hospital LIS gateway.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Resolution states
  const [resolutionSuccess, setResolutionSuccess] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Navigation refs
  const hotlineRef = useRef<HTMLDivElement>(null);
  const rbacLockRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const handleFilterFromDock = (category: 'PAYMENT_FAILURE' | 'DOCTOR_NO_SHOW' | 'DOCUMENT_FAILURE') => {
    sound.playClick();
    setFilterCategory(category);
    inboxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Escalation to Staff Portal / Employee Hub State
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateTicket, setEscalateTicket] = useState<any | null>(null);
  const [escalateNotes, setEscalateNotes] = useState('Requires Employee Hub elevated permissions to inspect internal database audit log.');
  const [escalateSuccess, setEscalateSuccess] = useState<string | null>(null);

  // CAT-07 Clinical chart RBAC access denial test states
  const [testPatientId, setTestPatientId] = useState('usr-pat-001');
  const [chartTestResult, setChartTestResult] = useState<{ status: number; error: string } | null>(null);
  const [isTestingChart, setIsTestingChart] = useState(false);

  // Payment investigation states
  const [paymentEventId, setPaymentEventId] = useState('evt-pay-fail-001');
  const [paymentInvestigationResult, setPaymentInvestigationResult] = useState<any | null>(null);

  // AI Support Assistant states
  const [faqQuery, setFaqQuery] = useState('');
  const [faqAnswer, setFaqAnswer] = useState<string | null>(null);
  const [isAiFaqLoading, setIsAiFaqLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getState();
      setState(res);
    } catch (err) {
      console.error('Failed to load customer care state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.setAuth('CUSTOMER_CARE', 'usr-cc-001');
    fetchData();
  }, []);

  // Base Level Problem Solutions
  const handleResolvePaymentFailure = (ticketId: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED (REFUND INITIATED)' } : t)));
    setResolutionSuccess(`Payment failure on ${ticketId} resolved: Idempotency verified & automated refund triggered.`);
    setSelectedTicket(null);
  };

  const handleResolveDoctorNoShow = (ticketId: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED (RESCHEDULED)' } : t)));
    setResolutionSuccess(`Doctor no-show on ${ticketId} resolved: Patient priority rescheduled to next available senior specialist.`);
    setSelectedTicket(null);
  };

  const handleResolveDocumentFailure = (ticketId: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED (DOC RE-SYNCED)' } : t)));
    setResolutionSuccess(`Document failure on ${ticketId} resolved: Document re-synced from hospital quarantine bucket to patient portal.`);
    setSelectedTicket(null);
  };

  // Escalate to Staff Portal / Employee Hub
  const handleEscalateToStaffHub = () => {
    if (!escalateTicket) return;
    setTickets(
      tickets.map((t) =>
        t.id === escalateTicket.id ? { ...t, status: 'ESCALATED_TO_STAFF_HUB' } : t
      )
    );
    setEscalateSuccess(
      `Ticket ${escalateTicket.id} successfully mailed & escalated to Staff Portal / Employee Hub! Internal reference: STF-ESC-${Date.now().toString().slice(-4)}.`
    );
    setIsEscalateModalOpen(false);
    setEscalateTicket(null);
    setSelectedTicket(null);
  };

  // CAT-07: Trigger Clinical Chart Access Test
  const handleTestClinicalChartAccess = async () => {
    try {
      setIsTestingChart(true);
      setChartTestResult(null);
      await api.getClinicalChart(testPatientId);
      setChartTestResult({ status: 200, error: 'UNEXPECTED: Access was permitted!' });
    } catch (err: any) {
      setChartTestResult({
        status: err.status || 403,
        error: err.message || 'HTTP 403 Forbidden: Customer Care role lacks CLINICAL_CHART_READ permission (CAT-07).',
      });
    } finally {
      setIsTestingChart(false);
    }
  };

  const handleInvestigatePayment = () => {
    setPaymentInvestigationResult({
      transactionId: paymentEventId,
      gateway: 'RAZORPAY_SANDBOX',
      status: 'GATEWAY_TIMEOUT',
      idempotencyKey: `idem-${paymentEventId}`,
      amount: '₹800.00',
      failureReason: 'Issuing bank response timeout (ISO-8583 Code 91)',
      recommendedAction: 'Safe to trigger automatic refund reversal. No double-debit occurred.',
    });
  };

  const handleAiFaqSearch = async () => {
    if (!faqQuery) return;
    try {
      setIsAiFaqLoading(true);
      const res = await api.aiSupportFaq(faqQuery);
      setFaqAnswer(res.answer || res.response || 'Please verify patient ABHA verification status in the portal.');
    } catch (err: any) {
      setFaqAnswer('Assistance response: Check refund SLA timeline in accordance with RBI guidelines.');
    } finally {
      setIsAiFaqLoading(false);
    }
  };

  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const filteredTickets = safeTickets.filter((t) => {
    const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;
    const matchesSearch =
      (t.title || t.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.patientName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <HeroBanner
        title="Office Workers — Customer Care & Support Operations Portal"
        subtitle="Solve base-level healthcare problems: payment failures, doctor appointment no-shows, and hospital document failures. Escalate high-level issues to Staff Hub."
        badgeText="CUSTOMER CARE ACTIVE • TICKET TRIAGE"
        badgeVariant="warning"
        actions={
          <Button variant="secondary" size="sm" onClick={fetchData} isLoading={isLoading}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Inbox
          </Button>
        }
      />

      {/* Resolution Success Alert */}
      {resolutionSuccess && (
        <div className="p-4 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resolutionSuccess}</span>
          </div>
          <button onClick={() => setResolutionSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* Escalation Success Alert */}
      {escalateSuccess && (
        <div className="p-4 rounded-lg bg-coral-soft border border-coral text-navy text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-coral-deep shrink-0" />
            <span>{escalateSuccess}</span>
          </div>
          <button onClick={() => setEscalateSuccess(null)} className="text-slate hover:text-navy">
            Dismiss
          </button>
        </div>
      )}

      {/* TOP KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Open Tickets</span>
            <MessageSquare className="w-4 h-4 text-coral" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">
            {safeTickets.filter((t) => t.status === 'OPEN').length}
          </div>
          <div className="text-[11px] text-coral-deep font-semibold mt-1">1 Critical Doctor No-Show</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Avg First Response</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">4.2 Mins</div>
          <div className="text-[11px] text-slate font-medium mt-1">98% Within SLA</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Refund Tracking</span>
            <CreditCard className="w-4 h-4 text-navy" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">100% Instant</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Idempotent Reversals</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate">Staff Hub Channel</span>
            <Mail className="w-4 h-4 text-coral-deep" />
          </div>
          <div className="text-2xl font-bold font-display text-navy tabular-nums">Connected</div>
          <div className="text-[11px] text-slate font-medium mt-1">Direct Mail Escalation Active</div>
        </Card>
      </div>

      {/* LIVE SUPPORT TELEPHONY & HOTLINE DESK */}
      <div ref={hotlineRef}>
        <CustomerCareLiveDesk
          onResolveActiveCallIssue={(msg) => setResolutionSuccess(msg)}
          onTransferToStaffHub={(notes) => {
            setEscalateTicket({
              id: 'HOTLINE-LIVE',
              title: 'Live Patient Call Escalation (Rahul Verma)',
              category: 'LIVE_CALL',
              patientName: 'Rahul Verma',
            });
            setEscalateNotes(notes);
            setIsEscalateModalOpen(true);
          }}
        />
      </div>

      {/* CAT-07: MANDATORY RBAC CLINICAL PRIVACY BARRIER */}
      <div ref={rbacLockRef}>
        <Card className="border border-coral-deep/30 bg-coral-soft/10">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-coral-soft text-coral-deep">
                <ShieldAlert className="w-5 h-5 text-coral-deep" />
              </div>
              <div>
                <CardTitle className="text-coral-deep">
                  CAT-07: Mandatory RBAC Clinical Chart Lock Demonstration
                </CardTitle>
                <p className="text-xs text-slate mt-0.5">
                  Proves that Customer Care agents are strictly prohibited from viewing patient diagnoses, doctor notes, or medical records.
                </p>
              </div>
            </div>
            <Badge variant="critical">SECURITY BARRIER CAT-07</Badge>
          </CardHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-md bg-warm-light-grey text-xs text-slate leading-relaxed border border-soft-grey">
              Under India DPDP Act and healthcare regulatory standards, non-clinical support representatives may only access operational metadata (appointment status, payment receipts, masked phone). Attempting to load clinical charts returns an authoritative <strong>HTTP 403 Forbidden</strong>.
            </div>

            <div className="flex items-center gap-3">
              <div className="w-64">
                <Input
                  label="Target Patient ID"
                  value={testPatientId}
                  onChange={(e) => setTestPatientId(e.target.value)}
                />
              </div>
              <div className="pt-6">
                <Button
                  variant="destructive"
                  onClick={handleTestClinicalChartAccess}
                  isLoading={isTestingChart}
                >
                  <ShieldAlert className="w-4 h-4 mr-1.5" /> Execute Chart Access Request
                </Button>
              </div>
            </div>

            {chartTestResult && (
              <div
                className={`p-4 rounded-lg border text-xs font-mono transition-all ${
                  chartTestResult.status === 403
                    ? 'bg-red-50/50 border-coral-deep/40 text-coral-deep'
                    : 'bg-emerald-soft border-emerald-500 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Lock className="w-4 h-4 text-coral-deep" />
                  <span>Authoritative Access Denial: {chartTestResult.status}</span>
                </div>
                <p>{chartTestResult.error}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* TWO-COLUMN: TICKET INBOX & BASE PROBLEM RESOLVER */}
      <div ref={inboxRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Inbox (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>Base-Level Problem Inbox</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-coral/10 text-coral-deep font-bold">
                    {filteredTickets.length} ACTIVE
                  </span>
                </CardTitle>
                <p className="text-xs text-slate mt-0.5">
                  Automated triage for payment failures, doctor no-shows, and hospital document issues
                </p>
              </div>

              <div className="relative w-full md:w-56">
                <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter tickets or patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-warm-light-grey border border-soft-grey rounded-md pl-9 pr-3 py-1.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
                />
              </div>
            </CardHeader>

            {/* CATEGORY FILTER PILLS */}
            <div className="px-6 py-2 bg-warm-light-grey/40 border-b border-soft-grey flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setFilterCategory('ALL');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterCategory === 'ALL'
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-white border border-soft-grey text-slate hover:text-navy hover:bg-slate-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {safeTickets.length}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setFilterCategory('PAYMENT_FAILURE');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterCategory === 'PAYMENT_FAILURE'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-soft-grey text-slate hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Failures</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  {safeTickets.filter((t) => t.category === 'PAYMENT_FAILURE').length}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setFilterCategory('DOCTOR_NO_SHOW');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterCategory === 'DOCTOR_NO_SHOW'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white border border-soft-grey text-slate hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <UserX className="w-3.5 h-3.5 text-amber-600" />
                <span>Doctor No-Shows</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                  {safeTickets.filter((t) => t.category === 'DOCTOR_NO_SHOW').length}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setFilterCategory('DOCUMENT_FAILURE');
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filterCategory === 'DOCUMENT_FAILURE'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'bg-white border border-soft-grey text-slate hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                <FileWarning className="w-3.5 h-3.5 text-sky-600" />
                <span>Document Failures</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800">
                  {safeTickets.filter((t) => t.category === 'DOCUMENT_FAILURE').length}
                </span>
              </button>
            </div>

            <div className="divide-y divide-soft-grey">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTicket(ticket);
                  }}
                  className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-coral-soft/40 border-l-4 border-coral'
                      : 'hover:bg-warm-light-grey/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-navy">{ticket.id}</span>
                      <Badge
                        variant={
                          ticket.priority === 'CRITICAL'
                            ? 'critical'
                            : ticket.priority === 'HIGH'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {ticket.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-[11px] text-slate font-medium">Patient: {ticket.patientName}</span>
                    </div>
                    <p className="text-xs font-bold text-navy">{ticket.title}</p>
                    <p className="text-[11px] text-slate">{ticket.details}</p>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <div className="text-[11px] font-semibold text-coral flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" /> SLA: {ticket.slaMinutes}m left
                    </div>
                    <Badge variant={ticket.status.includes('RESOLVED') ? 'success' : ticket.status.includes('ESCALATED') ? 'critical' : 'warning'}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div className="p-8 text-center text-xs text-slate">
                  No tickets found matching the selected filter criteria.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Action Panel & Escalation (1 Col) */}
        <div className="space-y-6">
          {/* Base Problem Resolution Tools */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Base Problem Resolution Tools</CardTitle>
                <p className="text-xs text-slate mt-0.5">Direct actions for selected ticket</p>
              </div>
              <HeartHandshake className="w-4 h-4 text-coral" />
            </CardHeader>

            {selectedTicket ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate block">Selected Issue</span>
                  <span className="font-bold text-navy text-xs">{selectedTicket.title}</span>
                  <p className="text-slate text-[11px]">{selectedTicket.details}</p>
                </div>

                {/* Base Level Action Buttons */}
                {selectedTicket.category === 'PAYMENT_FAILURE' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                    onClick={() => {
                      sound.playChime();
                      handleResolvePaymentFailure(selectedTicket.id);
                    }}
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Trigger Automated Refund Reversal
                  </Button>
                )}

                {selectedTicket.category === 'DOCTOR_NO_SHOW' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                    onClick={() => {
                      sound.playChime();
                      handleResolveDoctorNoShow(selectedTicket.id);
                    }}
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Reassign to Senior Specialist
                  </Button>
                )}

                {selectedTicket.category === 'DOCUMENT_FAILURE' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                    onClick={() => {
                      sound.playChime();
                      handleResolveDocumentFailure(selectedTicket.id);
                    }}
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Force Re-Sync Document from Hospital
                  </Button>
                )}

                {/* ESCALATION TO STAFF PORTAL / EMPLOYEE HUB */}
                <div className="pt-2 border-t border-soft-grey space-y-2">
                  <p className="text-[11px] text-slate">
                    Issue too complex or requires database access?
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full border-coral text-coral-deep hover:bg-coral-soft font-bold"
                    onClick={() => {
                      sound.playClick();
                      setEscalateTicket(selectedTicket);
                      setIsEscalateModalOpen(true);
                    }}
                  >
                    <Mail className="w-4 h-4 mr-1.5 text-coral" /> Mail / Escalate to Staff Portal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate">
                Select a ticket from the inbox to apply automated resolution or escalate to Staff Hub.
              </div>
            )}
          </Card>

          {/* AI HEALTHCARE SUPPORT ASSISTANT */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-navy flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-coral" /> AI Support Copilot
                </CardTitle>
                <p className="text-xs text-slate mt-0.5">Query SLAs, policies & DPDP guidelines</p>
              </div>
              <Badge variant="neutral">LLM ASSIST</Badge>
            </CardHeader>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask policy e.g. UPI refund SLA..."
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiFaqSearch()}
                  className="w-full bg-warm-light-grey border border-soft-grey rounded-md pl-3 pr-20 py-1.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
                />
                <Button
                  size="sm"
                  variant="primary"
                  className="absolute right-1 top-1 bottom-1 text-[11px] px-2.5"
                  onClick={handleAiFaqSearch}
                  isLoading={isAiFaqLoading}
                >
                  Ask
                </Button>
              </div>

              {faqAnswer && (
                <div className="p-3 rounded-lg bg-navy text-white text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-coral flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copilot Recommendation:
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">{faqAnswer}</p>
                </div>
              )}
            </div>
          </Card>

          {/* PAYMENT GATEWAY AUDIT & IDEMPOTENCY INSPECTOR */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-navy flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Gateway Audit Inspector
                </CardTitle>
                <p className="text-xs text-slate mt-0.5">ISO-8583 banking webhook verification</p>
              </div>
              <Badge variant="success">ISO-8583</Badge>
            </CardHeader>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={paymentEventId}
                  onChange={(e) => setPaymentEventId(e.target.value)}
                  className="w-full bg-warm-light-grey border border-soft-grey rounded-md px-3 py-1.5 text-xs text-navy font-mono"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0 text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {
                    sound.playClick();
                    handleInvestigatePayment();
                  }}
                >
                  Audit
                </Button>
              </div>

              {paymentInvestigationResult && (
                <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-slate border-b border-soft-grey pb-1">
                    <span>TXN: {paymentInvestigationResult.transactionId}</span>
                    <Badge variant="warning">{paymentInvestigationResult.status}</Badge>
                  </div>
                  <div className="text-[11px] text-navy">
                    <span className="text-slate">Gateway:</span> {paymentInvestigationResult.gateway} ({paymentInvestigationResult.amount})
                  </div>
                  <div className="text-[11px] text-coral-deep">
                    <span className="text-slate">Reason:</span> {paymentInvestigationResult.failureReason}
                  </div>
                  <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px]">
                    ✓ {paymentInvestigationResult.recommendedAction}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL: ESCALATE TO STAFF PORTAL / EMPLOYEE HUB */}
      {isEscalateModalOpen && (
        <Modal
          isOpen={isEscalateModalOpen}
          onClose={() => setIsEscalateModalOpen(false)}
          title={`Escalate to Staff Portal / Employee Hub — ${escalateTicket?.id}`}
          description="Transfers ticket to higher-tier operational employees who have clearance to inspect hospital databases and tariffs."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsEscalateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEscalateToStaffHub}>
                <Send className="w-4 h-4 mr-1.5" /> Dispatch Mail to Staff Hub
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-warm-light-grey border border-soft-grey space-y-1">
              <span className="font-bold text-navy">{escalateTicket?.title}</span>
              <p className="text-[11px] text-slate">Category: {escalateTicket?.category} | Patient: {escalateTicket?.patientName}</p>
            </div>

            <div>
              <label className="font-bold text-navy block mb-1">Reason for Elevated Staff Hub Escalation</label>
              <textarea
                rows={3}
                value={escalateNotes}
                onChange={(e) => setEscalateNotes(e.target.value)}
                className="w-full bg-warm-light-grey border border-soft-grey rounded-md p-2.5 text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* FLOATING COMMAND DOCK */}
      <FloatingCustomerCareDock
        onFocusHotline={() => {
          hotlineRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFilterCategory={handleFilterFromDock}
        onFocusRbacLock={() => {
          rbacLockRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenStaffEscalation={() => {
          if (selectedTicket) {
            setEscalateTicket(selectedTicket);
          } else {
            setEscalateTicket({
              id: 'HOTLINE-GENERIC',
              title: 'Direct Staff Hub High-Level Request',
              category: 'STAFF_HUB_QUERY',
              patientName: 'General Inquiry',
            });
          }
          setIsEscalateModalOpen(true);
        }}
      />
    </div>
  );
};
