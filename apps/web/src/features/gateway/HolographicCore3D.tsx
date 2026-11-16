import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Building2, UserCheck, Zap, Sparkles } from 'lucide-react';
import { sound } from '@/services/soundEffects';

export const HolographicCore3D: React.FC<{ onSelectSection: (id: string) => void }> = ({ onSelectSection }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    {
      id: 'ADMIN',
      label: 'Admin Governance',
      sub: '5 Quota • 7-Day Lock',
      icon: <Shield className="w-5 h-5 text-white" />,
      color: 'from-navy via-slate-800 to-navy',
      accent: 'border-navy shadow-glow-navy',
      badge: 'Tier-1 Root',
    },
    {
      id: 'OFFICE',
      label: 'Staff & Support Hub',
      sub: 'SOC Cyber • LIS • Tariffs',
      icon: <Zap className="w-5 h-5 text-white" />,
      color: 'from-coral via-coral-deep to-red-600',
      accent: 'border-coral shadow-glow-coral',
      badge: 'Zero-Trust SOC',
    },
    {
      id: 'PROVIDER',
      label: 'Hospital & Doctor',
      sub: '250 Beds • 4 OTs • RMP',
      icon: <Building2 className="w-5 h-5 text-white" />,
      color: 'from-emerald-600 via-teal-700 to-emerald-900',
      accent: 'border-emerald-500 shadow-glow-emerald',
      badge: 'Clinical Core',
    },
    {
      id: 'PATIENT',
      label: 'Patient & Family',
      sub: 'ABHA Link • 72h Consent',
      icon: <UserCheck className="w-5 h-5 text-white" />,
      color: 'from-coral-deep via-rose-600 to-purple-900',
      accent: 'border-coral shadow-glow-coral',
      badge: 'Citizen ABHA',
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-4 space-y-4">
      {/* 4 Interactive Sector Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {nodes.map((node) => {
          const isSelected = activeNode === node.id;
          return (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => {
                sound.playClick();
                setActiveNode(node.id);
              }}
              onClick={() => {
                sound.playChime();
                onSelectSection(node.id);
              }}
              className={`p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border-2 transition-all cursor-pointer shadow-md flex items-center gap-3 ${
                isSelected
                  ? `${node.accent} bg-white ring-2 ring-coral/40 scale-[1.02]`
                  : 'border-soft-grey hover:border-slate/40'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-md shrink-0`}>
                {node.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display font-extrabold text-xs text-navy truncate">
                    {node.label}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                    {node.badge}
                  </span>
                </div>
                <span className="text-[11px] text-slate font-medium block truncate">
                  {node.sub}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
