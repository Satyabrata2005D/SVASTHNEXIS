import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import { ChevronDown, HelpCircle, Shield, Stethoscope, Building2, User, CreditCard } from 'lucide-react';

export const HealthcareFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SvasthNexis unify platform governance, hospitals, doctors, and citizens?',
      a: 'SvasthNexis connects 4 distinct healthcare sectors into one synchronized ecosystem: Platform Super Admins govern multi-tenant facility quotas; Office Workers audit hospital tariffs and verify doctors; Hospitals manage beds, OTs, and LIS pathology; Doctors author signed digital prescriptions with AI dual-view analysis; and Patients store lifetime records in their encrypted ABHA health locker.',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      q: 'How is patient health data safeguarded under the DPDP Act 2023?',
      a: 'SvasthNexis adheres to strict Zero-Trust boundaries: Customer Care and administrative office staff are physically blocked with HTTP 403 Forbidden from accessing clinical patient charts (CAT-07). Doctors must receive explicit 72-hour scoped consent from the patient, which the patient can revoke instantly at any time.',
      icon: <Shield className="w-4 h-4 text-coral" />,
    },
    {
      q: 'Can doctors manage both hospital consultations and private clinical practices?',
      a: 'Yes. Doctors have dual-practice capabilities with individualized fee schedules (e.g. ₹800 at CityCare Hospital, ₹700 at Private Clinic). Appointments, video teleconsultations (Zoom/Meet with downloadable recordings), and digital prescriptions seamlessly reflect the selected practice mode.',
      icon: <Stethoscope className="w-4 h-4 text-sky-600" />,
    },
    {
      q: 'How does cashless health insurance and TPA pre-authorization work?',
      a: 'SvasthNexis is integrated with major Indian and international TPAs—including Medi Assist, Paramount Health, Vidal Health, MDIndia, Star Health, Cigna Global, and Allianz Care. Hospitals submit ICD-10 diagnostic pre-authorizations with tariff auto-snapshots for 100% cashless approvals.',
      icon: <CreditCard className="w-4 h-4 text-amber-600" />,
    },
    {
      q: 'What occurs during a National 108 Emergency trauma dispatch?',
      a: 'Under protocol CAT-12, clicking Emergency 108 bypasses all advance billing checks and OPD slot holds. The nearest Level-1 trauma resuscitation bay, on-duty trauma surgeons, and the blood bank crossmatch unit are immediately notified in real-time.',
      icon: <HelpCircle className="w-4 h-4 text-coral-deep" />,
    },
  ];

  const toggleFaq = (index: number) => {
    sound.playClick();
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate bg-white px-3 py-1 rounded-full border border-soft-grey shadow-2xs">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy">
          Everything You Need to Know About SvasthNexis
        </h2>
        <p className="text-xs sm:text-sm text-slate">
          Answers to technical, operational, and clinical governance inquiries.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={faq.q}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-coral/40 shadow-md ring-2 ring-coral/10'
                  : 'bg-white/80 border-soft-grey hover:border-slate/40'
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-warm-light-grey flex items-center justify-center shrink-0">
                    {faq.icon}
                  </div>
                  <span className="font-display font-bold text-sm text-navy leading-snug">
                    {faq.q}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-slate leading-relaxed border-t border-soft-grey/60 ml-11">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

