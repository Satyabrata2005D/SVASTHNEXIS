import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  HeartHandshake,
  UserCheck,
  Stethoscope,
  FlaskConical,
  Building2,
  Activity,
  LogOut,
  ChevronDown,
  Lock,
  Layers,
  LayoutGrid,
  Heart,
  Wifi,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import { sound } from '@/services/soundEffects';

export interface WorkspaceRole {
  id: string;
  label: string;
  section: string;
  path: string;
  icon: React.ReactNode;
  userId: string;
  badge?: string;
}

export const WORKSPACES: WorkspaceRole[] = [
  // Section 1: Admin
  {
    id: 'SUPER_ADMIN',
    section: 'SECTION 1: ADMIN',
    label: 'Platform Super Admin',
    path: '/admin',
    icon: <ShieldAlert className="w-4 h-4" />,
    userId: 'adm-001',
    badge: 'Gov 5/5',
  },
  // Section 2: Office Workers
  {
    id: 'STAFF_HUB',
    section: 'SECTION 2: OFFICE WORKERS',
    label: 'Staff Portal / Hub',
    path: '/staff',
    icon: <FlaskConical className="w-4 h-4" />,
    userId: 'usr-staff-lab',
    badge: 'LIS & SOC',
  },
  {
    id: 'CUSTOMER_CARE',
    section: 'SECTION 2: OFFICE WORKERS',
    label: 'Customer Care',
    path: '/support',
    icon: <HeartHandshake className="w-4 h-4" />,
    userId: 'usr-cc-001',
    badge: 'Triage',
  },
  // Section 3: Hospital & Doctor
  {
    id: 'HOSPITAL',
    section: 'SECTION 3: HOSPITAL & DR',
    label: 'Hospital Authority',
    path: '/hospital',
    icon: <Building2 className="w-4 h-4" />,
    userId: 'usr-admin-citycare',
    badge: 'CityCare',
  },
  {
    id: 'DOCTOR_RMP',
    section: 'SECTION 3: HOSPITAL & DR',
    label: 'Doctor Workspace',
    path: '/doctor',
    icon: <Stethoscope className="w-4 h-4" />,
    userId: 'usr-doc-sharma',
    badge: 'RMP Active',
  },
  // Section 4: Patient
  {
    id: 'PATIENT',
    section: 'SECTION 4: PATIENT',
    label: 'Patient & Family',
    path: '/patient',
    icon: <UserCheck className="w-4 h-4" />,
    userId: 'usr-pat-001',
    badge: 'ABHA Link',
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitchWorkspace = (workspace: WorkspaceRole) => {
    sound.playClick();
    api.setAuth(workspace.id, workspace.userId);
    navigate(workspace.path);
  };

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-soft-grey flex flex-col shrink-0 min-h-screen select-none relative z-20 shadow-xs">
      {/* Brand Header */}
      <div className="p-4 border-b border-soft-grey flex items-center justify-between">
        <NavLink to="/" onClick={() => sound.playClick()} className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral to-coral-deep flex items-center justify-center text-white shadow-sm font-display font-black text-lg"
          >
            S
          </motion.div>
          <div>
            <span className="font-display font-extrabold text-sm tracking-tight text-navy block group-hover:text-coral transition-colors">
              SVASTHNEXIS
            </span>
            <span className="text-[10px] text-slate font-medium block">
              Unified Healthcare OS
            </span>
          </div>
        </NavLink>
      </div>

      {/* Switch Gateway Button */}
      <div className="p-3 border-b border-soft-grey bg-warm-light-grey/40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playClick();
            navigate('/');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-soft-grey shadow-2xs hover:border-coral hover:shadow-glow-coral text-navy text-xs font-bold transition-all"
        >
          <LayoutGrid className="w-4 h-4 text-coral" />
          <span>4-Section Login Gateway</span>
        </motion.button>
      </div>

      {/* Navigation Links Grouped by 4 Sections with Smooth Framer-Motion Active Layout Pill */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        {/* Section 1 — Premium Admin Governance Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-indigo-50/60 via-white/50 to-white/0 border border-indigo-200/50 p-2.5 space-y-1.5 shadow-sm">
          {/* Top accent bar */}
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 via-navy to-indigo-500" />

          {/* Section Header */}
          <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded bg-navy shadow-sm">
                <Lock className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="text-[9.5px] font-display font-extrabold uppercase tracking-wider text-navy">
                Admin Governance
              </span>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-indigo-600 bg-indigo-100/80 px-1.5 py-0.5 rounded-full border border-indigo-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              SECURE
            </span>
          </div>

          {/* Nav Items */}
          {WORKSPACES.filter((w) => w.section.includes('ADMIN')).map((w) => {
            const isActive = location.pathname.startsWith(w.path);
            return (
              <button
                key={w.id}
                onClick={() => handleSwitchWorkspace(w)}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'text-white font-bold shadow-lg shadow-indigo-600/20'
                    : 'text-slate hover:text-navy hover:bg-white/80 hover:shadow-xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarHighlight"
                    className="absolute inset-0 bg-gradient-to-r from-navy to-indigo-700 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 ${isActive ? 'text-amber-300' : 'text-indigo-500 group-hover:text-navy'}`}>{w.icon}</span>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="leading-tight truncate">{w.label}</span>
                    <span className={`text-[8.5px] font-normal leading-tight ${isActive ? 'text-indigo-200/80' : 'text-slate/60'}`}>
                      National Oversight Panel
                    </span>
                  </div>
                </div>
                {w.badge && (
                  <span
                    className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/15'
                        : 'bg-indigo-100/80 text-indigo-700 border border-indigo-200/60'
                    }`}
                  >
                    {w.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2 — Premium Office Workers Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-amber-50/60 via-white/50 to-white/0 border border-amber-200/50 p-2.5 space-y-1.5 shadow-sm">
          {/* Top accent bar */}
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-amber-400 via-coral to-amber-500" />

          {/* Section Header */}
          <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded bg-coral shadow-sm">
                <Layers className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="text-[9.5px] font-display font-extrabold uppercase tracking-wider text-amber-900">
                Office Workers
              </span>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded-full border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          {/* Nav Items */}
          {WORKSPACES.filter((w) => w.section.includes('OFFICE')).map((w) => {
            const isActive = location.pathname.startsWith(w.path);
            const isStaff = w.id === 'STAFF_HUB';
            const subtitle = isStaff ? 'Lab & Social Portal' : 'Triage & Support Desk';
            return (
              <button
                key={w.id}
                onClick={() => handleSwitchWorkspace(w)}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'text-white font-bold shadow-lg shadow-coral/20'
                    : 'text-slate hover:text-navy hover:bg-white/80 hover:shadow-xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarHighlight"
                    className="absolute inset-0 bg-gradient-to-r from-coral to-amber-600 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 ${isActive ? 'text-amber-100' : 'text-amber-600 group-hover:text-coral'}`}>{w.icon}</span>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="leading-tight truncate">{w.label}</span>
                    <span className={`text-[8.5px] font-normal leading-tight ${isActive ? 'text-amber-100/80' : 'text-slate/60'}`}>
                      {subtitle}
                    </span>
                  </div>
                </div>
                {w.badge && (
                  <span
                    className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/15'
                        : 'bg-amber-100/80 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    {w.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 3 — Premium Hospital & Doctor Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-emerald-50/70 via-white/60 to-white/0 border border-emerald-200/60 p-2.5 space-y-1.5 shadow-sm">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

          {/* Premium Section Header */}
          <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded bg-emerald-600 shadow-sm">
                <Activity className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="text-[9.5px] font-display font-extrabold uppercase tracking-wider text-emerald-800">
                Hospital & Doctor
              </span>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Workspace Nav Items */}
          {WORKSPACES.filter((w) => w.section.includes('HOSPITAL & DR')).map((w) => {
            const isActive = location.pathname.startsWith(w.path);
            const isHospital = w.id === 'HOSPITAL';
            const subtitle = isHospital ? 'Operations Console' : 'Clinical Workspace';
            return (
              <button
                key={w.id}
                onClick={() => handleSwitchWorkspace(w)}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'text-white font-bold shadow-lg shadow-emerald-600/20'
                    : 'text-slate hover:text-navy hover:bg-white/80 hover:shadow-xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarHighlight"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-600 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {/* Left accent bar for inactive hover */}
                {!isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 ${isActive ? 'text-emerald-200' : 'text-emerald-600 group-hover:text-emerald-700'}`}>{w.icon}</span>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="leading-tight truncate">{w.label}</span>
                    <span className={`text-[8.5px] font-normal leading-tight ${isActive ? 'text-emerald-200/80' : 'text-slate/60'}`}>
                      {subtitle}
                    </span>
                  </div>
                </div>
                {w.badge && (
                  <span
                    className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/15'
                        : 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/60'
                    }`}
                  >
                    {w.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 4 — Premium Patient & Family Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-rose-50/60 via-white/50 to-white/0 border border-rose-200/50 p-2.5 space-y-1.5 shadow-sm">
          {/* Top accent bar */}
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-rose-400 via-coral-deep to-rose-500" />

          {/* Section Header */}
          <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-4 h-4 rounded bg-coral-deep shadow-sm">
                <Heart className="w-2.5 h-2.5 text-white" />
              </span>
              <span className="text-[9.5px] font-display font-extrabold uppercase tracking-wider text-rose-900">
                Patient & Family
              </span>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-rose-600 bg-rose-100/80 px-1.5 py-0.5 rounded-full border border-rose-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              ABHA
            </span>
          </div>

          {/* Nav Items */}
          {WORKSPACES.filter((w) => w.section.includes('PATIENT')).map((w) => {
            const isActive = location.pathname.startsWith(w.path);
            return (
              <button
                key={w.id}
                onClick={() => handleSwitchWorkspace(w)}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'text-white font-bold shadow-lg shadow-rose-600/20'
                    : 'text-slate hover:text-navy hover:bg-white/80 hover:shadow-xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarHighlight"
                    className="absolute inset-0 bg-gradient-to-r from-coral-deep to-rose-600 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 ${isActive ? 'text-rose-200' : 'text-rose-500 group-hover:text-coral-deep'}`}>{w.icon}</span>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="leading-tight truncate">{w.label}</span>
                    <span className={`text-[8.5px] font-normal leading-tight ${isActive ? 'text-rose-200/80' : 'text-slate/60'}`}>
                      Health Records & Portal
                    </span>
                  </div>
                </div>
                {w.badge && (
                  <span
                    className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/15'
                        : 'bg-rose-100/80 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {w.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Hospital Telemetry Mini Widget */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-warm-light-grey/80 border border-soft-grey text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase font-bold text-slate flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            GRID TELEMETRY
          </span>
          <span className="text-[9px] font-mono text-emerald-700 font-bold">99.98% SLA</span>
        </div>

        {/* Occupancy Bar */}
        <div>
          <div className="flex justify-between text-[10px] font-semibold text-slate mb-1">
            <span>Bed Census</span>
            <strong className="text-navy">78% Occupied</strong>
          </div>
          <div className="h-1.5 w-full bg-soft-grey rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-coral rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-coral-deep font-semibold pt-1 border-t border-soft-grey">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-2.5 h-2.5 animate-bounce" /> 108 Fleet:
          </span>
          <span className="font-mono font-bold">1 Active Dispatch</span>
        </div>
      </div>

      {/* Active User Footer */}
      <div className="p-3 border-t border-soft-grey bg-warm-light-grey/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate">Active Identity</p>
            <p className="text-xs font-bold text-navy truncate max-w-[130px]">
              {api.getAuth().userId}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              sound.playClick();
              navigate('/');
            }}
            title="Log out and return to Gateway"
            className="p-1.5 rounded-lg text-slate hover:text-coral hover:bg-white transition-colors shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
};
