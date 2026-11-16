import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sound } from '@/services/soundEffects';
import {
  DollarSign,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface TariffItem {
  id: string;
  hospital: string;
  category: 'SURGERY' | 'LAB_TEST' | 'DOCTOR_FEE';
  item: string;
  standardRate: number;
  benchmarkCap: number;
  auditStatus: 'VERIFIED_COMPLIANT' | 'FLAGGED_INFLATION' | 'PENDING_AUDIT';
  lastAuditedBy: string;
}

export const StaffTariffAuditorStudio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SURGERY' | 'LAB_TEST' | 'DOCTOR_FEE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [tariffs, setTariffs] = useState<TariffItem[]>([
    {
      id: 'tar-01',
      hospital: 'CityCare Super Specialty Hospital',
      category: 'SURGERY',
      item: 'Coronary Artery Bypass Graft (CABG)',
      standardRate: 280000,
      benchmarkCap: 295000,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Priya (Staff Hub)',
    },
    {
      id: 'tar-02',
      hospital: 'CityCare Super Specialty Hospital',
      category: 'SURGERY',
      item: 'Total Knee Arthroplasty (TKR)',
      standardRate: 190000,
      benchmarkCap: 200000,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Priya (Staff Hub)',
    },
    {
      id: 'tar-03',
      hospital: 'CityCare Super Specialty Hospital',
      category: 'LAB_TEST',
      item: 'Complete Blood Count (CBC) with ESR',
      standardRate: 350,
      benchmarkCap: 400,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Suresh (Staff Hub)',
    },
    {
      id: 'tar-04',
      hospital: 'CityCare Super Specialty Hospital',
      category: 'LAB_TEST',
      item: 'Lipid Profile Comprehensive Panel',
      standardRate: 650,
      benchmarkCap: 700,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Suresh (Staff Hub)',
    },
    {
      id: 'tar-05',
      hospital: 'CityCare Super Specialty Hospital',
      category: 'LAB_TEST',
      item: 'MRI Brain with Contrast (3.0 Tesla)',
      standardRate: 6500,
      benchmarkCap: 6800,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Suresh (Staff Hub)',
    },
    {
      id: 'tar-06',
      hospital: 'CityCare Super Specialty Hospital',
      category: 'DOCTOR_FEE',
      item: 'Cardiology Super Specialist OPD Consultation',
      standardRate: 800,
      benchmarkCap: 900,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Priya (Staff Hub)',
    },
    {
      id: 'tar-07',
      hospital: 'MetroCare Multispecialty Center',
      category: 'SURGERY',
      item: 'Laparoscopic Cholecystectomy (Gallbladder)',
      standardRate: 62000,
      benchmarkCap: 65000,
      auditStatus: 'VERIFIED_COMPLIANT',
      lastAuditedBy: 'Auditor Deepa (Staff Hub)',
    },
  ]);

  const handleApproveTariff = (tariffId: string, itemName: string) => {
    sound.playChime();
    setTariffs((prev) =>
      prev.map((t) => (t.id === tariffId ? { ...t, auditStatus: 'VERIFIED_COMPLIANT' } : t))
    );
    setActionSuccess(`Tariff for "${itemName}" verified and compliant with National Healthcare Tariff benchmarks.`);
  };

  const handleFlagInflation = (tariffId: string, itemName: string) => {
    sound.playClick();
    setTariffs((prev) =>
      prev.map((t) => (t.id === tariffId ? { ...t, auditStatus: 'FLAGGED_INFLATION' } : t))
    );
    setActionSuccess(`⚠️ Anomaly flagged for "${itemName}". Investigation notice dispatched to Hospital Authority.`);
  };

  const filteredTariffs = tariffs.filter((t) => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch =
      t.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Card className="overflow-hidden border border-soft-grey shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-soft text-emerald-800 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <CardTitle>Hospital Surgery, Diagnostic & Doctor Tariff Auditor</CardTitle>
            <p className="text-xs text-slate mt-0.5">
              Cross-hospital pricing audit against National Ceiling Caps (NPPA) to prevent unfair healthcare inflation
            </p>
          </div>
        </div>

        <Badge variant="success">TARIFF AUDIT ENGINE ACTIVE</Badge>
      </CardHeader>

      <div className="p-5 space-y-4">
        {/* Action Success Toast */}
        {actionSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-soft border border-emerald-500/30 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-slate hover:text-navy">
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-soft-grey">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-warm-light-grey p-1 rounded-lg border border-soft-grey">
            {[
              { id: 'ALL', label: 'All Tariffs' },
              { id: 'SURGERY', label: 'Surgeries' },
              { id: 'LAB_TEST', label: 'Diagnostic Tests' },
              { id: 'DOCTOR_FEE', label: 'Doctor Fees' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-white text-navy shadow-xs border border-soft-grey'
                    : 'text-slate hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search surgery, test or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-warm-light-grey border border-soft-grey text-xs text-navy focus:bg-white focus:outline-none focus:border-coral"
            />
          </div>
        </div>

        {/* Tariffs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-warm-light-grey text-slate text-[10px] font-bold uppercase tracking-wider border-b border-soft-grey">
                <th className="py-2.5 px-3">Hospital Entity</th>
                <th className="py-2.5 px-3">Service / Procedure</th>
                <th className="py-2.5 px-3">Hospital Rate</th>
                <th className="py-2.5 px-3">Benchmark Cap</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Audit Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-grey">
              {filteredTariffs.map((t) => {
                const variancePct = Math.round(((t.standardRate - t.benchmarkCap) / t.benchmarkCap) * 100);
                const isUnderCap = t.standardRate <= t.benchmarkCap;

                return (
                  <tr key={t.id} className="hover:bg-warm-light-grey/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-navy flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-coral shrink-0" />
                        <span>{t.hospital}</span>
                      </div>
                      <span className="text-[10px] text-slate font-mono block mt-0.5">
                        {t.lastAuditedBy}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-navy">{t.item}</div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-soft-grey text-slate uppercase">
                        {t.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-navy text-xs">
                      ₹{t.standardRate.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate text-xs">
                      ₹{t.benchmarkCap.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3 font-mono text-xs">
                      {isUnderCap ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>{variancePct}% (Fair)</span>
                        </span>
                      ) : (
                        <span className="text-coral-deep font-bold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+{variancePct}% (High)</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <Badge variant={t.auditStatus === 'VERIFIED_COMPLIANT' ? 'success' : 'critical'}>
                        {t.auditStatus.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApproveTariff(t.id, t.item)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-emerald-50 border border-soft-grey hover:border-emerald-500 text-emerald-800 text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          Pass Audit
                        </button>
                        <button
                          onClick={() => handleFlagInflation(t.id, t.item)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-red-50 border border-soft-grey hover:border-coral-deep text-coral-deep text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          Flag Inflation
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

