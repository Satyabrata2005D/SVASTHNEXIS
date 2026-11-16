import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { sound } from '@/services/soundEffects';
import {
  FileText,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Printer,
  X,
  Share2,
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: any | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  const isPrescription = document.category === 'PRESCRIPTION';

  return (
    <Modal
      isOpen={!!document}
      onClose={onClose}
      title={document.title}
      description={`Issued on ${document.date} • ${document.facility || 'CityCare Diagnostics'}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>SHA-256 Verified Immutable Record</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                sound.playClick();
                window.print();
              }}
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-navy hover:bg-navy/90 text-white"
              onClick={() => {
                sound.playChime();
                alert(`Downloaded verified PDF: ${document.title}`);
                onClose();
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download Encrypted PDF
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Document Header Banner */}
        <div className="p-4 rounded-xl bg-warm-light-grey/80 border border-soft-grey flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm text-navy">
                {document.facility || 'CityCare Healthcare Infrastructure'}
              </span>
              <Badge variant={isPrescription ? 'warning' : 'success'}>
                {document.category}
              </Badge>
            </div>
            <p className="text-[11px] text-slate">
              Consulting RMP: <strong>{document.doctor}</strong> | Patient: <strong>Rahul Verma (42Y / M)</strong>
            </p>
            <p className="text-[10px] font-mono text-slate">
              ABHA ID: 91-4209-8812-3904 | Document Hash: 0x8f2a...c014
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate block uppercase">STATUS</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED & SIGNED
            </span>
          </div>
        </div>

        {/* Prescription Document Content */}
        {isPrescription ? (
          <div className="p-5 rounded-xl bg-white border border-soft-grey space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-coral-deep font-display font-black text-xl border-b border-soft-grey pb-2">
              <span className="font-serif italic text-2xl font-bold">Rx</span>
              <span className="text-xs font-sans font-bold text-navy">Medical Prescription & Clinical Order</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate block">Clinical Diagnosis</span>
                <span className="font-bold text-navy text-xs">
                  Acute Viral Upper Respiratory Tract Infection (Flu) + Essential Hypertension
                </span>
              </div>

              <div className="border border-soft-grey rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-warm-light-grey border-b border-soft-grey text-[10px] font-mono uppercase text-slate">
                    <tr>
                      <th className="p-2.5">Medication & Strength</th>
                      <th className="p-2.5">Dosage</th>
                      <th className="p-2.5">Frequency</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Dietary Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-grey text-navy">
                    <tr>
                      <td className="p-2.5 font-bold">Paracetamol 650mg</td>
                      <td className="p-2.5">1 Tablet</td>
                      <td className="p-2.5 font-mono">1-0-1 (TID PRN)</td>
                      <td className="p-2.5">5 Days</td>
                      <td className="p-2.5 text-slate">After Meals</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Telmisartan 40mg</td>
                      <td className="p-2.5">1 Tablet</td>
                      <td className="p-2.5 font-mono">1-0-0 (OD)</td>
                      <td className="p-2.5">30 Days</td>
                      <td className="p-2.5 text-slate">Morning after breakfast</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Levocetirizine + Montelukast</td>
                      <td className="p-2.5">1 Tablet</td>
                      <td className="p-2.5 font-mono">0-0-1 (HS)</td>
                      <td className="p-2.5">5 Days</td>
                      <td className="p-2.5 text-slate">At bedtime</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-emerald-soft/50 border border-emerald-500/20 text-[11px] text-emerald-950">
                <strong>General Advice:</strong> Hydrate with warm liquids (at least 2.5L/day), steam inhalation twice daily, and monitor fever daily. Review in 5 days if temperature exceeds 101°F.
              </div>
            </div>

            {/* Doctor Signature Seal */}
            <div className="pt-3 border-t border-soft-grey flex items-center justify-between text-[11px]">
              <div>
                <p className="font-bold text-navy">{document.doctor}</p>
                <p className="text-slate font-mono text-[10px]">RMP Reg: KMC-77412 • Karnataka Medical Council</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] border border-emerald-300">
                  DIGITALLY SIGNED PKI-256
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Laboratory Report Content */
          <div className="p-5 rounded-xl bg-white border border-soft-grey space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-soft-grey pb-2">
              <div>
                <span className="font-display font-extrabold text-sm text-navy block">
                  Comprehensive Diagnostic Profile
                </span>
                <span className="text-[10px] font-mono text-slate">Accredited by NABL & CAP • Specimen: Venous Blood</span>
              </div>
              <Badge variant="neutral">LAB REF: LAB-88192-BLR</Badge>
            </div>

            <div className="border border-soft-grey rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-light-grey border-b border-soft-grey text-[10px] font-mono uppercase text-slate">
                  <tr>
                    <th className="p-2.5">Investigation Parameter</th>
                    <th className="p-2.5">Observed Value</th>
                    <th className="p-2.5">Biological Reference Range</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-grey text-navy">
                  <tr>
                    <td className="p-2.5 font-bold">Total Cholesterol</td>
                    <td className="p-2.5 font-mono font-bold text-coral-deep">218.0</td>
                    <td className="p-2.5 font-mono text-slate">&lt; 200.0</td>
                    <td className="p-2.5 text-slate">mg/dL</td>
                    <td className="p-2.5"><Badge variant="critical">Borderline High</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Serum Triglycerides</td>
                    <td className="p-2.5 font-mono font-bold text-coral-deep">185.0</td>
                    <td className="p-2.5 font-mono text-slate">&lt; 150.0</td>
                    <td className="p-2.5 text-slate">mg/dL</td>
                    <td className="p-2.5"><Badge variant="warning">High</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">HDL Cholesterol (Good)</td>
                    <td className="p-2.5 font-mono font-bold text-navy">44.0</td>
                    <td className="p-2.5 font-mono text-slate">&gt; 40.0</td>
                    <td className="p-2.5 text-slate">mg/dL</td>
                    <td className="p-2.5"><Badge variant="success">Normal</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">LDL Cholesterol (Calculated)</td>
                    <td className="p-2.5 font-mono font-bold text-coral-deep">137.0</td>
                    <td className="p-2.5 font-mono text-slate">&lt; 100.0</td>
                    <td className="p-2.5 text-slate">mg/dL</td>
                    <td className="p-2.5"><Badge variant="warning">Suboptimal</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Hemoglobin (Hb)</td>
                    <td className="p-2.5 font-mono font-bold text-navy">13.8</td>
                    <td className="p-2.5 font-mono text-slate">13.0 - 17.0</td>
                    <td className="p-2.5 text-slate">g/dL</td>
                    <td className="p-2.5"><Badge variant="success">Normal</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-warm-light-grey text-[11px] text-slate space-y-1">
              <strong className="text-navy">Pathologist Commentary:</strong>
              <p>
                Lipid levels exhibit mild atherogenic dyslipidemia. Dietary modification with low saturated fats and regular aerobic exercise recommended. Correlation with clinical cardiovascular history advised.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

