import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { sound } from '@/services/soundEffects';
import {
  Stethoscope,
  Award,
  BookOpen,
  CheckCircle2,
  Building2,
  Shield,
  FileText,
  UserCheck,
  X,
} from 'lucide-react';

interface DoctorVerificationModalProps {
  doctor: any | null;
  onClose: () => void;
  onApprove: (doctor: any) => void;
}

export const DoctorVerificationModal: React.FC<DoctorVerificationModalProps> = ({
  doctor,
  onClose,
  onApprove,
}) => {
  if (!doctor) return null;

  return (
    <Modal
      isOpen={!!doctor}
      onClose={onClose}
      title={`Verify & Credentialize: ${doctor.fullName}`}
      description={`Medical Registration Queue • Submitted ${doctor.submittedAt}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" onClick={onClose}>
            Close Dossier
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                sound.playClick();
                alert(`Requested supplementary surgical logbook documentation from ${doctor.fullName}.`);
                onClose();
              }}
            >
              Request Additional Docs
            </Button>
            <Button
              variant="primary"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              onClick={() => {
                sound.playChime();
                onApprove(doctor);
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Publish Profile
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-soft/50 via-white to-emerald-soft/30 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-display font-black text-xl shadow-md">
              DR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base text-navy">{doctor.fullName}</span>
                <Badge variant="warning">PENDING APPROVAL</Badge>
              </div>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">{doctor.specialty}</p>
              <p className="text-[11px] font-mono text-slate">{doctor.degrees}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate block uppercase">PROPOSED FEE</span>
            <span className="font-mono font-bold text-lg text-navy">{doctor.consultationFee}</span>
          </div>
        </div>

        {/* Clinical Experience & Surgical Logbook */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
            <span className="text-[10px] font-mono text-slate block uppercase">Clinical Cases</span>
            <strong className="text-base font-display font-bold text-navy">{doctor.casesHandled}+</strong>
            <span className="text-[9px] text-emerald-700 block font-semibold">Logged</span>
          </div>

          <div className="p-3 rounded-xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
            <span className="text-[10px] font-mono text-slate block uppercase">Major Surgeries</span>
            <strong className="text-base font-display font-bold text-navy">{doctor.surgeriesCount}+</strong>
            <span className="text-[9px] text-emerald-700 block font-semibold">NMC Verified</span>
          </div>

          <div className="p-3 rounded-xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
            <span className="text-[10px] font-mono text-slate block uppercase">NMC Registry</span>
            <strong className="text-xs font-mono font-bold text-emerald-700 block mt-1">VERIFIED</strong>
            <span className="text-[9px] text-slate block">State Council</span>
          </div>

          <div className="p-3 rounded-xl bg-warm-light-grey/80 border border-soft-grey shadow-2xs">
            <span className="text-[10px] font-mono text-slate block uppercase">NABH Privileges</span>
            <strong className="text-xs font-mono font-bold text-navy block mt-1">TIER 1 RMP</strong>
            <span className="text-[9px] text-slate block">Full Surgical Scope</span>
          </div>
        </div>

        {/* Published Scientific Works */}
        <div className="p-4 rounded-xl bg-white border border-soft-grey space-y-2">
          <span className="font-bold text-navy flex items-center gap-1.5 text-xs">
            <BookOpen className="w-4 h-4 text-coral" />
            Peer-Reviewed Scientific Publications & Books
          </span>
          <div className="space-y-1.5">
            {doctor.publications?.map((pub: string, i: number) => (
              <div key={i} className="p-2.5 rounded-lg bg-warm-light-grey/60 border border-soft-grey text-[11px] text-navy font-medium">
                "{pub}"
              </div>
            ))}
          </div>
        </div>

        {/* Private Clinic Affiliation */}
        <div className="p-3.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate uppercase block">Private Clinic Practice</span>
            <strong className="text-navy text-xs">{doctor.clinicAffiliation}</strong>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-soft px-2 py-1 rounded border border-emerald-300 font-bold">
            DUAL-PRACTICE PERMITTED
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-soft/50 border border-emerald-500/20 text-[11px] text-emerald-950 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Approving this profile automatically maps Dr. {doctor.fullName} to CityCare Hospital's public appointment schedule and OPD consultation desk.
          </span>
        </div>
      </div>
    </Modal>
  );
};

