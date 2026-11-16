import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sound } from '@/services/soundEffects';
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Mail,
  RefreshCw,
  ArrowRight,
  Database,
  Lock,
  CreditCard,
  Building2,
  FileText,
  UserCheck,
} from 'lucide-react';

interface EscalatedIssue {
  id: string;
  ticketId: string;
  sourceAgent: string;
  patientName: string;
  issueCategory: 'PAYMENT_FAILURE' | 'DOCTOR_NO_SHOW' | 'HOSPITAL_DOC_FAILURE';
  description: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING_STAFF_ACTION' | 'RESOLVED_BY_STAFF' | 'ESCALATED_TO_ADMIN';
  escalatedAt: string;
}

interface StaffCustomerCareEscalationDeskProps {
  onOpenMailAdminModal: (defaultSubject: string, defaultBody: string) => void;
}

export const StaffCustomerCareEscalationDesk: React.FC<StaffCustomerCareEscalationDeskProps> = ({
  onOpenMailAdminModal,
}) => {
  const [resolutionFeedback, setResolutionFeedback] = useState<string | null>(null);

  const [escalatedTickets, setEscalatedTickets] = useState<EscalatedIssue[]>([
    {
      id: 'esc-001',
      ticketId: 'TCK-8821',
      sourceAgent: 'Customer Care Agent (usr-cc-001)',
      patientName: 'Rahul Verma',
      issueCategory: 'HOSPITAL_DOC_FAILURE',
      description: 'PDF scan of CBC & Lipid report corrupted during upload from CityCare Hospital LIS gateway. Customer Care lacks direct DB access.',
      severity: 'HIGH',
      status: 'PENDING_STAFF_ACTION',
      escalatedAt: '12 mins ago',
    },
    {
      id: 'esc-002',
      ticketId: 'TCK-8822',
      sourceAgent: 'Customer Care Agent (usr-cc-002)',
      patientName: 'Priya Nair',
      issueCategory: 'PAYMENT_FAILURE',
      description: 'Razorpay UPI payment debited from patient bank account, but hospital appointment slot remained in PENDING status due to network drop.',
      severity: 'CRITICAL',
      status: 'PENDING_STAFF_ACTION',
      escalatedAt: '35 mins ago',
    },
    {
      id: 'esc-003',
      ticketId: 'TCK-8823',
      sourceAgent: 'Customer Care Agent (usr-cc-001)',
      patientName: 'Amit Patel',
      issueCategory: 'DOCTOR_NO_SHOW',
      description: 'Specialist emergency surgery in OT caused OPD consultation cancellation. Patient requested immediate re-booking with senior consultant.',
      severity: 'MEDIUM',
      status: 'PENDING_STAFF_ACTION',
      escalatedAt: '1 hour ago',
    },
  ]);

  const handleResolveLocally = (ticket: EscalatedIssue) => {
    sound.playChime();
    setEscalatedTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: 'RESOLVED_BY_STAFF' } : t))
    );
    if (ticket.issueCategory === 'HOSPITAL_DOC_FAILURE') {
      setResolutionFeedback(`Document re-synced from CityCare quarantine bucket for ${ticket.patientName}. Visible on patient portal.`);
    } else if (ticket.issueCategory === 'PAYMENT_FAILURE') {
      setResolutionFeedback(`UPI transaction hash reconciled with NPCI. Appointment slot confirmed for ${ticket.patientName}.`);
    } else {
      setResolutionFeedback(`Emergency re-booking authorized with Dr. Vikram Sethi for ${ticket.patientName}.`);
    }
  };

  const handleEscalateToAdmin = (ticket: EscalatedIssue) => {
    sound.playClick();
    onOpenMailAdminModal(
      `CRITICAL LEVEL-3 ESCALATION: ${ticket.ticketId} — ${ticket.issueCategory}`,
      `Staff Hub unable to resolve ticket ${ticket.ticketId} due to platform policy boundaries. \n\nPatient: ${ticket.patientName}\nCategory: ${ticket.issueCategory}\nDetails: ${ticket.description}\n\nSuper-Admin authorization required to proceed.`
    );
  };

  return (
    <Card className="overflow-hidden border border-soft-grey shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-coral-soft text-coral-deep flex items-center justify-center font-bold">
            <LifeBuoy className="w-5 h-5 text-coral-deep" />
          </div>
          <div>
            <CardTitle>Customer Care Level-2 Escalation Desk</CardTitle>
            <p className="text-xs text-slate mt-0.5">
              Resolve operational bottlenecks escalated from Customer Support; forward Super-Admin level overrides via encrypted mail
            </p>
          </div>
        </div>

        <Badge variant="warning">{escalatedTickets.filter((t) => t.status === 'PENDING_STAFF_ACTION').length} PENDING ACTION</Badge>
      </CardHeader>

      <div className="p-5 space-y-4">
        {/* Feedback Alert */}
        {resolutionFeedback && (
          <div className="p-3.5 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resolutionFeedback}</span>
            </div>
            <button onClick={() => setResolutionFeedback(null)} className="text-slate hover:text-navy">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {escalatedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                ticket.status === 'RESOLVED_BY_STAFF'
                  ? 'bg-emerald-soft/30 border-emerald-500/40'
                  : 'bg-warm-light-grey/70 border-soft-grey hover:border-coral'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-navy">{ticket.ticketId}</span>
                  <Badge variant={ticket.severity === 'CRITICAL' ? 'critical' : ticket.severity === 'HIGH' ? 'warning' : 'neutral'}>
                    {ticket.severity}
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate uppercase block">Patient</span>
                  <span className="font-bold text-navy text-xs">{ticket.patientName}</span>
                </div>

                <div className="p-2 rounded bg-white border border-soft-grey text-[11px] text-slate leading-relaxed">
                  {ticket.description}
                </div>

                <div className="text-[10px] font-mono text-slate">
                  From: {ticket.sourceAgent} • {ticket.escalatedAt}
                </div>
              </div>

              <div className="pt-2 border-t border-soft-grey flex flex-col gap-1.5">
                {ticket.status === 'RESOLVED_BY_STAFF' ? (
                  <div className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white font-bold text-center text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolved by Staff Hub</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleResolveLocally(ticket)}
                      className="w-full py-1.5 px-3 rounded-lg bg-navy hover:bg-navy/90 text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Execute Staff Resolution</span>
                    </button>
                    <button
                      onClick={() => handleEscalateToAdmin(ticket)}
                      className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-red-50 border border-soft-grey hover:border-coral-deep text-coral-deep text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-coral" />
                      <span>Mail Super-Admin</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

