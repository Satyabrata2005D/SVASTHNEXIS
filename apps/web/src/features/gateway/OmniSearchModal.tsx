import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import {
  Search,
  Stethoscope,
  Building2,
  User,
  Shield,
  Activity,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Command,
  X,
  CreditCard,
  FileText,
} from 'lucide-react';

interface OmniSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyTrigger: () => void;
}

export const OmniSearchModal: React.FC<OmniSearchModalProps> = ({
  isOpen,
  onClose,
  onEmergencyTrigger,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    {
      id: 'doctor-workspace',
      title: 'Doctor Clinical Workspace',
      category: 'Workspace',
      sub: 'Dr. Ananya Sharma (Cardiology) • Active Encounter & AI Analyzer',
      icon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
      action: () => {
        sound.playChime();
        api.setAuth('DOCTOR_RMP', 'usr-doc-sharma');
        onClose();
        navigate('/doctor');
      },
    },
    {
      id: 'patient-portal',
      title: 'Patient & Family Health Portal',
      category: 'Citizen Care',
      sub: 'Rahul Verma (ABHA: 91-4209-8812-3904) • Health Locker & Meds Tracker',
      icon: <User className="w-4 h-4 text-coral" />,
      action: () => {
        sound.playChime();
        api.setAuth('PATIENT', 'usr-pat-001');
        onClose();
        navigate('/patient');
      },
    },
    {
      id: 'hospital-beds',
      title: 'Hospital Bed & OT Matrix',
      category: 'Institutional',
      sub: 'CityCare Super Specialty • 250 Beds (42 ICU, 18 Oxygen) & 4 OTs',
      icon: <Building2 className="w-4 h-4 text-navy" />,
      action: () => {
        sound.playChime();
        api.setAuth('HOSPITAL', 'usr-admin-citycare');
        onClose();
        navigate('/hospital');
      },
    },
    {
      id: 'staff-hub',
      title: 'Staff Portal & Employee Operations Hub',
      category: 'Office Workers',
      sub: 'Tariffs audit, doctor verification, pathologist LIS, and cyber defense',
      icon: <Activity className="w-4 h-4 text-amber-600" />,
      action: () => {
        sound.playChime();
        api.setAuth('STAFF_HUB', 'usr-staff-lab');
        onClose();
        navigate('/staff');
      },
    },
    {
      id: 'super-admin',
      title: 'Super Admin Governance Console',
      category: 'Sovereign',
      sub: 'National Healthcare NOC, 5-Member Quota, 7-Day Cooling Off',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
      action: () => {
        sound.playChime();
        api.setAuth('SUPER_ADMIN', 'adm-001');
        onClose();
        navigate('/admin');
      },
    },
    {
      id: 'insurance-claims',
      title: 'Empanelled Insurance & Cashless TPA Grid',
      category: 'Finance',
      sub: 'Medi Assist, Paramount, Vidal, Star Health, Cigna, Allianz, Hospital TPA Desk',
      icon: <CreditCard className="w-4 h-4 text-emerald-700" />,
      action: () => {
        sound.playChime();
        api.setAuth('HOSPITAL', 'usr-admin-citycare');
        onClose();
        navigate('/hospital');
      },
    },
    {
      id: 'emergency-108',
      title: 'Emergency 108 Trauma Dispatch',
      category: 'Priority SOS',
      sub: 'Zero-wait resuscitation intake and priority ambulance routing',
      icon: <PhoneCall className="w-4 h-4 text-coral animate-bounce" />,
      action: () => {
        onClose();
        onEmergencyTrigger();
      },
    },
  ];

  const filtered = quickItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.sub.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-navy/60 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -20 }}
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-soft-grey overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-soft-grey flex items-center gap-3 bg-warm-light-grey/60">
          <Search className="w-5 h-5 text-slate shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search portals, doctors, ABHA ID, beds, insurance, or emergency dispatch..."
            className="w-full bg-transparent text-sm sm:text-base text-navy placeholder:text-slate font-medium focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate hover:text-navy"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate bg-white px-2 py-0.5 rounded border border-soft-grey">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-soft-grey/40">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 4, backgroundColor: 'rgba(241, 240, 236, 0.7)' }}
                onClick={item.action}
                className="p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-soft-grey flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-navy group-hover:text-coral transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate truncate">{item.sub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate group-hover:text-coral group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center text-slate space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate/40" />
              <p className="text-sm font-semibold">No healthcare records found for "{query}"</p>
              <p className="text-xs text-slate/80">
                Try searching for "Doctor", "Patient", "ICU", "ABHA", or "Emergency".
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="px-4 py-2.5 bg-warm-light-grey/80 border-t border-soft-grey flex items-center justify-between text-[11px] text-slate">
          <span>SvasthNexis Omni-Search • Unified Healthcare Directory</span>
          <div className="flex items-center gap-3">
            <span>Click item or press <strong>ENTER</strong> to launch</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

