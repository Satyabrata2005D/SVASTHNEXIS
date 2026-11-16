import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { sound } from '@/services/soundEffects';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
// 3D Bed replaced by Authentic Hospital Photo Showcase
import {
  BedDouble,
  Activity,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  User,
  Users,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Droplet,
  Radio,
  Lock,
  Plus,
  ArrowRight,
  Check,
  Eye,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  ZoomIn,
  X,
} from 'lucide-react';

export type BedCategoryType =
  | 'GENERAL_AC'
  | 'ICU'
  | 'PREMIUM_ICU'
  | 'PRIVATE_CABIN'
  | 'PREMIUM_PRIVATE_CABIN';

export interface HospitalFacilityCategory {
  category: string;
  items: string[];
}

export interface BedCategoryData {
  id: BedCategoryType;
  name: string;
  shortCode: string;
  totalBeds: number;
  availableBeds: number;
  dailyTariff: number;
  accentColor: string;
  bgGradient: string;
  tagline: string;
  description: string;
  keyEquipment: string[];
  vitalsMonitoring: string;
  nurseRatio: string;
  facilities: HospitalFacilityCategory[];
}

export const BED_CATEGORIES: Record<BedCategoryType, BedCategoryData> = {
  GENERAL_AC: {
    id: 'GENERAL_AC',
    name: 'General AC Ward Bed',
    shortCode: 'GAC',
    totalBeds: 120,
    availableBeds: 42,
    dailyTariff: 2500,
    accentColor: 'text-emerald-400',
    bgGradient: 'from-emerald-600 via-teal-700 to-emerald-950',
    tagline: 'Centralized Climate Control & Nursing Care',
    description:
      'Comfortable 2-function motorized medical bed in a climate-controlled ward with central oxygen outlet, nurse call pendant, and shared monitoring.',
    keyEquipment: ['Central AC', '2-Function Motor', 'Central O2 Port', 'Nurse Call Pendant'],
    vitalsMonitoring: 'Periodic Telemetry (Every 4 Hours)',
    nurseRatio: '1 : 4 Certified Ward Staff',
    facilities: [
      {
        category: 'Clinical Facilities',
        items: [
          'Central Med-Gas Pipeline (Oxygen & Suction Outlet)',
          '2-Function Motorized Articulation Hospital Bed',
          'Emergency Bedside Nurse Call Pendant & Intercom',
          'Shared Multi-Parameter Vital Signs Telemetry',
        ],
      },
      {
        category: 'In-Ward Amenities',
        items: [
          'Central Climate-Controlled Air Conditioning (HVAC)',
          'Personal Lockable Bedside Storage Cabinet',
          'Adjustable Overbed Food & Reading Table',
          'Comfortable Attendant Chair with Ward Access',
        ],
      },
      {
        category: 'Hospital Services',
        items: [
          '24/7 Professional Ward Nursing Care',
          'Dietician-Supervised Inpatient Meal Plans',
          'Twice-Daily Attending Physician Clinical Rounds',
          'IRDAI Cashless TPA & GOP Settlement Desk',
        ],
      },
    ],
  },
  ICU: {
    id: 'ICU',
    name: 'Intensive Care Unit (ICU)',
    shortCode: 'ICU',
    totalBeds: 45,
    availableBeds: 9,
    dailyTariff: 8500,
    accentColor: 'text-coral',
    bgGradient: 'from-coral via-coral-deep to-navy',
    tagline: 'Continuous High-Dependency Telemetry & Ventilation',
    description:
      'High-dependency critical care bed equipped with continuous 5-lead ECG, invasive hemodynamic line monitoring, Hamilton C6 ventilator port, and 1:1 dedicated nursing.',
    keyEquipment: ['Mechanical Ventilator Port', '5-Lead ECG Telemetry', 'Dual Syringe Infusion Pumps', '1:1 Nurse Station'],
    vitalsMonitoring: 'Continuous 24/7 Invasive Hemodynamics',
    nurseRatio: '1 : 1 Critical Care Specialist RN',
    facilities: [
      {
        category: 'Critical Infrastructure',
        items: [
          'Hamilton-C6 / Puritan Bennett Mechanical Ventilator Port',
          'Continuous 5-Lead Invasive Hemodynamic ECG Monitor',
          'Dual Precision Syringe Infusion Pumps & Crash Cart',
          'Arterial Line & Central Venous Pressure (CVP) Transducers',
        ],
      },
      {
        category: 'ICU Amenities',
        items: [
          'Positive Pressure ISO-7 Cleanroom with HEPA Filtration',
          'Anti-Decubitus Alternating Pressure Air Mattress',
          'Motorized 4-Function ICU Bed with Trendelenburg Tilt',
          'Bedside STAT Point-of-Care Blood Gas (ABG) & Ultrasound',
        ],
      },
      {
        category: 'Critical Services',
        items: [
          '1:1 Dedicated Critical Care Certified Nurse (NABH Gold)',
          '24/7 On-Duty Intensivist & Anesthesiologist Bedside Cover',
          'Continuous Real-Time Telemetry Stream to Central Command',
          'Structured Daily Family Clinical Counseling by Primary Team',
        ],
      },
    ],
  },
  PREMIUM_ICU: {
    id: 'PREMIUM_ICU',
    name: 'Premium ICU (Airborne Isolation)',
    shortCode: 'PICU',
    totalBeds: 20,
    availableBeds: 4,
    dailyTariff: 14000,
    accentColor: 'text-amber-400',
    bgGradient: 'from-amber-500 via-amber-700 to-slate-950',
    tagline: 'Negative Pressure HEPA Cleanroom & ECMO Ready',
    description:
      'Specialized airborne negative pressure cleanroom suite with continuous renal replacement therapy (CRRT) port, ECMO readiness, and secure encrypted family telemetry uplink.',
    keyEquipment: ['Negative Pressure HEPA Room', 'ECMO Circuit Ready', 'CRRT Dialysis Hookup', 'Encrypted Family Video Uplink'],
    vitalsMonitoring: 'Advanced Multi-Parametric (IntelliVue MX800)',
    nurseRatio: '1 : 1 Specialized Isolation Intensivist RN',
    facilities: [
      {
        category: 'Advanced Infrastructure',
        items: [
          'Negative Pressure Airborne Isolation (16 Air Changes/Hour)',
          'Continuous Renal Replacement Therapy (CRRT Dialysis Hookup)',
          'ECMO (Extracorporeal Membrane Oxygenation) Circuit Ready',
          'Inhaled Nitric Oxide (iNO) Therapy Integration Line',
        ],
      },
      {
        category: 'Isolation Amenities',
        items: [
          'Decontamination Anteroom Airlock with UV-C Interlock',
          'Stryker InTouch Advanced Critical Smart Bed with Scale',
          'Encrypted Bi-Directional HD Family Tele-Visit Video Uplink',
          'Dedicated In-Suite Robotic Air & Surface Sterilization',
        ],
      },
      {
        category: 'Specialized Services',
        items: [
          '1:1 Senior Certified Critical Care Specialist Nurse',
          'Direct Senior Intensivist / Infectious Disease Consultant Oversight',
          'STAT Priority Lab & Point-of-Care Molecular Diagnostics',
          'Comprehensive Barrier Nursing & Bio-Containment Protocol',
        ],
      },
    ],
  },
  PRIVATE_CABIN: {
    id: 'PRIVATE_CABIN',
    name: 'Private En-Suite Cabin',
    shortCode: 'CAB',
    totalBeds: 50,
    availableBeds: 16,
    dailyTariff: 6500,
    accentColor: 'text-sky-400',
    bgGradient: 'from-sky-600 via-indigo-700 to-navy',
    tagline: 'En-Suite Privacy & Attendant Accommodations',
    description:
      'Single-occupancy private recovery room with attached en-suite bathroom, 3-function motorized Hill-Rom bed, attendant pull-out sofa bed, smart TV, and personal nursing console.',
    keyEquipment: ['Attached Washroom', 'Attendant Recliner Sofa-Bed', 'Electric 3-Motor Bed', 'Smart TV & Wi-Fi'],
    vitalsMonitoring: 'Automated Wireless Ward Telemetry',
    nurseRatio: '1 : 2 Dedicated Private Ward Nurse',
    facilities: [
      {
        category: 'Private Clinical Setup',
        items: [
          'Electric 3-Motor Hill-Rom Bed with Auto-Contour & CPR Release',
          'Central Medical Oxygen, Air & Vacuum Pipeline Outlets',
          'Wireless Ward Telemetry Sync with Central Nurse Station',
          'Bedside Nurse Call & Emergency Code Button',
        ],
      },
      {
        category: 'Room Amenities',
        items: [
          'Attached Private En-Suite Bathroom with 24/7 Hot Water',
          'Full Attendant Recliner Sofa-Cum-Bed & Premium Linen',
          '43" 4K Smart TV with Streaming Services & High-Speed Wi-Fi',
          'Personal Ward Refrigerator, Electric Kettle & Safe Locker',
        ],
      },
      {
        category: 'Patient Privileges',
        items: [
          'Dedicated Nursing Care (1:2 Patient-Nurse Ratio)',
          'Customized Inpatient & Attendant Dietary Meal Service',
          'Flexible Attendant Visiting Hours & 24/7 Access Pass',
          'Daily Senior Consultant Rounds & Dedicated Care Coordinator',
        ],
      },
    ],
  },
  PREMIUM_PRIVATE_CABIN: {
    id: 'PREMIUM_PRIVATE_CABIN',
    name: 'Premium Private Deluxe Suite',
    shortCode: 'PCAB',
    totalBeds: 15,
    availableBeds: 5,
    dailyTariff: 12500,
    accentColor: 'text-purple-400',
    bgGradient: 'from-purple-600 via-indigo-900 to-slate-950',
    tagline: 'Presidential 2-Room Suite with Visitor Lounge',
    description:
      'Luxurious 2-room presidential hospital suite with separate patient clinical room and visitor lounge, motorized Stryker InTouch ICU-grade smart bed, kitchenette, and priority physician rounds.',
    keyEquipment: ['2-Room Suite & Lounge', 'Stryker InTouch SmartBed', 'Kitchenette & Refrigerator', 'VIP Concierge Rounds'],
    vitalsMonitoring: 'Continuous Wireless Non-Invasive Vitals Matrix',
    nurseRatio: '1 : 1 Dedicated Concierge Nurse',
    facilities: [
      {
        category: 'Deluxe Suite Clinical Setup',
        items: [
          'Stryker InTouch Presidential SmartBed with In-Bed Weigh Scale',
          'Integrated Non-Invasive Continuous Patient Telemetry Matrix',
          'Concealed Medical Gas Architectural Headwall Console',
          'Emergency Cardiac Pull-Cord & Rapid Response Uplink',
        ],
      },
      {
        category: 'Presidential Suite Amenities',
        items: [
          '2-Room Layout: Clinical Patient Bedroom + Private Visitor Lounge',
          'Executive Kitchenette with Microwave, Coffee Bar & Refrigerator',
          'Dual 55" 4K Smart Entertainment Displays with High-Speed Fiber',
          'Luxury Hotel-Grade Bath with Walk-in Shower & Premium Toiletries',
        ],
      },
      {
        category: 'VIP Concierge Privileges',
        items: [
          'Dedicated Private Concierge Nurse & Priority Pharmacy Delivery',
          'All-Inclusive Gourmet Dining for Inpatient & Attendant',
          'Priority Super-Specialist Consultations & Rounding',
          'VIP Valet Parking, Express Check-in & Bedside Discharge',
        ],
      },
    ],
  },
};

export interface WardPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  tag: string;
  uploadedAt: string;
  isCustom?: boolean;
}

export const INITIAL_WARD_PHOTOS: Record<BedCategoryType, WardPhoto[]> = {
  GENERAL_AC: [
    {
      id: 'gac-p1',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      title: 'Climate-Controlled Multi-Bed Ward',
      caption: 'Spacious air-conditioned ward layout with motorized beds, partition curtains & central nurse station.',
      tag: 'Ward Bay',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'gac-p2',
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      title: 'Motorized Bed & O₂ Pipeline Outlet',
      caption: 'Central medical oxygen port, emergency nurse call pendant & adjustable overbed table.',
      tag: 'Bedside Unit',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'gac-p3',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      title: 'Attendant Chair & Personal Locker',
      caption: 'Dedicated lockable storage cabinet, companion seating & bedside monitoring telemetry.',
      tag: 'Amenities',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'gac-p4',
      url: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1200&q=80',
      title: 'Central Ward Nursing Station',
      caption: '24/7 certified staff shift console maintaining direct line-of-sight to all ward inpatients.',
      tag: 'Nursing Station',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'gac-p5',
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      title: 'Zero-Infection UV-C Disinfection Area',
      caption: 'Terminal sterilization and hospital-grade deep sanitization between patient admissions.',
      tag: 'Sanitization',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'gac-p6',
      url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      title: 'HEPA 99.97% Climate Air System',
      caption: 'Centralized HVAC maintaining continuous 22.5°C temperature and sterile air change cycles.',
      tag: 'HVAC Airflow',
      uploadedAt: '05 Nov 2026',
    },
  ],
  ICU: [
    {
      id: 'icu-p1',
      url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
      title: 'Critical Care ICU Bay & Ventilator Port',
      caption: 'Hamilton C6 mechanical ventilator dock with ceiling architectural gas pendant and suction lines.',
      tag: 'Ventilator Port',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'icu-p2',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      title: 'Continuous 5-Lead Hemodynamic Array',
      caption: 'Real-time arterial line, central venous pressure (CVP) and invasive cardiac output telemetry.',
      tag: 'Vital Telemetry',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'icu-p3',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      title: 'Dual Precision Syringe & Infusion Matrix',
      caption: 'High-precision inotropic syringe pumps and emergency defibrillator crash cart ready.',
      tag: 'Infusion Pumps',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'icu-p4',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      title: 'Motorized 4-Function ICU Bed & Air Mattress',
      caption: 'Anti-decubitus pressure relief surface with bilateral emergency CPR release and Trendelenburg tilt.',
      tag: 'ICU Bed',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'icu-p5',
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      title: '1:1 Bedside Intensivist Nurse Workstation',
      caption: 'NABH Gold 1:1 certified critical care specialist nurse station positioned directly adjacent to patient.',
      tag: '1:1 Nurse Cover',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'icu-p6',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      title: 'Bedside STAT Arterial Blood Gas (ABG) Lab',
      caption: 'Point-of-care rapid blood gas diagnostic analyzer and bedside ultrasound cart.',
      tag: 'POC Diagnostic',
      uploadedAt: '05 Nov 2026',
    },
  ],
  PREMIUM_ICU: [
    {
      id: 'picu-p1',
      url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      title: 'Negative Pressure Airborne Isolation Suite',
      caption: 'Hermetically sealed ISO-7 cleanroom isolation suite with 16 air changes/hour and HEPA exhaust.',
      tag: 'Negative Pressure',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'picu-p2',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      title: 'Stryker InTouch Bed with Integrated Scale',
      caption: 'Advanced critical care bed with continuous weighing scale, pulmonary therapy & exit alarms.',
      tag: 'Critical SmartBed',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'picu-p3',
      url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
      title: 'CRRT Dialysis & ECMO Life Support Hookup',
      caption: 'Dedicated clinical plumbing and electrical feed for continuous renal replacement & ECMO oxygenators.',
      tag: 'ECMO / Dialysis',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'picu-p4',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      title: 'Decontamination Anteroom Airlock Entry',
      caption: 'Dual-door gowning buffer with UV-C interlock, biohazard barrier protocols and negative pressure seal.',
      tag: 'Airlock Entry',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'picu-p5',
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      title: 'Encrypted HD Family Contactless Tele-Visit',
      caption: 'Bi-directional secure family video tablet allowing relatives to visit isolated patient in 1080p.',
      tag: 'Family Tele-Visit',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'picu-p6',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      title: 'In-Suite Autonomous UV-C Robot Disinfection',
      caption: 'Pulsed-xenon terminal disinfection robot deployed between patient transfers for zero pathogen SLA.',
      tag: 'Robotic Clean',
      uploadedAt: '05 Nov 2026',
    },
  ],
  PRIVATE_CABIN: [
    {
      id: 'cab-p1',
      url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      title: 'Single-Occupancy En-Suite Private Cabin',
      caption: 'Spacious tranquil recovery room with Hill-Rom motorized 3-function bed and panoramic natural light.',
      tag: 'Private Room',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'cab-p2',
      url: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
      title: 'Attendant Recliner Sleeper Sofa-Cum-Bed',
      caption: 'Convertible sofa bed with premium linens and blankets for full-time companion comfort.',
      tag: 'Attendant Sofa',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'cab-p3',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      title: 'Attached Private Bathroom with Hot Water',
      caption: 'Accessible walk-in washroom with safety grab rails, anti-slip tiles, and emergency nurse call cord.',
      tag: 'Attached Bath',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'cab-p4',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      title: 'Smart TV, High-Speed Wi-Fi & Pantry Safe',
      caption: '43" 4K Smart TV with entertainment apps, personal refrigerator, digital safe locker & high-speed Wi-Fi.',
      tag: 'Entertainment',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'cab-p5',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      title: 'Concealed Architectural Med-Gas Headwall',
      caption: 'Flush designer headwall concealing medical oxygen, suction outlets & emergency power backup.',
      tag: 'Headwall Design',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'cab-p6',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      title: 'Dedicated 1:2 Nursing & Dietician Dining',
      caption: 'Personalized culinary meal service for patient and attendant with dedicated private nurse desk.',
      tag: 'Care & Dining',
      uploadedAt: '05 Nov 2026',
    },
  ],
  PREMIUM_PRIVATE_CABIN: [
    {
      id: 'pcab-p1',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
      title: 'Presidential 2-Room Suite - Master Bedroom',
      caption: 'Ultra-luxury clinical room featuring Stryker InTouch smart bed, bespoke paneling and clinical oxygen.',
      tag: 'Master Suite',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'pcab-p2',
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      title: 'VIP Visitor Living Room & Executive Lounge',
      caption: 'Separate private lounge with executive seating, conference desk and 55" OLED entertainment console.',
      tag: 'Visitor Lounge',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'pcab-p3',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      title: 'In-Suite Executive Kitchenette & Bar',
      caption: 'Microwave oven, premium espresso machine, double-door refrigerator and companion dining bar.',
      tag: 'Kitchenette',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'pcab-p4',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      title: 'Hotel-Grade Master En-Suite Bathroom',
      caption: 'Designer marble walk-in rain shower, premium toiletries, luxury robes and emergency pull cords.',
      tag: 'Luxury Bath',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'pcab-p5',
      url: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
      title: 'Panoramic Hospital Garden & Skyline Balcony',
      caption: 'Acoustically insulated floor-to-ceiling glass windows with motorized blackout drapes & HVAC zoning.',
      tag: 'Skyline View',
      uploadedAt: '05 Nov 2026',
    },
    {
      id: 'pcab-p6',
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      title: 'VIP Concierge Desk & In-Room Check-Out',
      caption: 'Dedicated 1:1 private concierge nurse, priority medicine delivery and bedside cashier discharge.',
      tag: 'VIP Concierge',
      uploadedAt: '05 Nov 2026',
    },
  ],
};

interface HospitalBed3DMatrixProps {
  onAdmitPatientSuccess?: (msg: string) => void;
}

export const HospitalBed3DMatrix: React.FC<HospitalBed3DMatrixProps> = ({ onAdmitPatientSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<BedCategoryType>('GENERAL_AC');
  const [selectedBedItem, setSelectedBedItem] = useState<any | null>(null);

  // Tab View inside Ward Desk: Bed Units vs Real Photos
  const [wardViewTab, setWardViewTab] = useState<'UNITS' | 'PHOTOS'>('UNITS');

  // Actual Hospital Photographs (Maximum 10 per Category)
  const MAX_WARD_PHOTOS = 10;
  const AUTO_SWIPE_INTERVAL_MS = 6000; // 6-second auto-slide interval (5-7 seconds requirement)
  const [wardPhotos, setWardPhotos] = useState<Record<BedCategoryType, WardPhoto[]>>(INITIAL_WARD_PHOTOS);

  // Upload Photo Modal State
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState<boolean>(false);
  const [uploadCategory, setUploadCategory] = useState<BedCategoryType>('GENERAL_AC');
  const [uploadPhotoTitle, setUploadPhotoTitle] = useState<string>('');
  const [uploadPhotoCaption, setUploadPhotoCaption] = useState<string>('');
  const [uploadPhotoTag, setUploadPhotoTag] = useState<string>('Bedside Unit');
  const [uploadPhotoUrl, setUploadPhotoUrl] = useState<string>('');
  const [uploadFilePreview, setUploadFilePreview] = useState<string | null>(null);

  // Lightbox Modal State
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [swipeProgress, setSwipeProgress] = useState<number>(0);

  // Admission Modal State
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState<boolean>(false);
  const [targetBedToAdmit, setTargetBedToAdmit] = useState<any | null>(null);
  const [patientNameInput, setPatientNameInput] = useState('Rahul Verma');
  const [admissionDiagnosisInput, setAdmissionDiagnosisInput] = useState('Acute Bronchopneumonia & Hypoxemia');
  const [attendingDoctorInput, setAttendingDoctorInput] = useState('Dr. Rajesh Varma');

  // Simulated Wards Data for each Category
  const [wardBeds, setWardBeds] = useState<Record<BedCategoryType, any[]>>({
    GENERAL_AC: [
      { id: 'GAC-101', status: 'AVAILABLE', patient: null },
      { id: 'GAC-102', status: 'OCCUPIED', patient: 'Vikram Joshi', doctor: 'Dr. Rajesh Varma', days: 2 },
      { id: 'GAC-103', status: 'AVAILABLE', patient: null },
      { id: 'GAC-104', status: 'OCCUPIED', patient: 'Ananya Roy', doctor: 'Dr. Sunita Sen', days: 4 },
      { id: 'GAC-105', status: 'AVAILABLE', patient: null },
      { id: 'GAC-106', status: 'SANITIZING', patient: null },
      { id: 'GAC-107', status: 'OCCUPIED', patient: 'Deepak Rao', doctor: 'Dr. Suresh Nair', days: 1 },
      { id: 'GAC-108', status: 'AVAILABLE', patient: null },
      { id: 'GAC-109', status: 'AVAILABLE', patient: null },
      { id: 'GAC-110', status: 'OCCUPIED', patient: 'Meera Patel', doctor: 'Dr. Ananya Sharma', days: 3 },
      { id: 'GAC-111', status: 'AVAILABLE', patient: null },
      { id: 'GAC-112', status: 'AVAILABLE', patient: null },
    ],
    ICU: [
      { id: 'ICU-201', status: 'OCCUPIED', patient: 'Ramesh K. (Post-CABG)', doctor: 'Dr. Arvind Mehra', days: 2 },
      { id: 'ICU-202', status: 'AVAILABLE', patient: null },
      { id: 'ICU-203', status: 'OCCUPIED', patient: 'Sanjay Dutt (Septic Shock)', doctor: 'Dr. Priya Rao', days: 5 },
      { id: 'ICU-204', status: 'OCCUPIED', patient: 'Gita Mehta (Trauma Subdural)', doctor: 'Dr. K. Saxena', days: 3 },
      { id: 'ICU-205', status: 'AVAILABLE', patient: null },
      { id: 'ICU-206', status: 'AVAILABLE', patient: null },
    ],
    PREMIUM_ICU: [
      { id: 'PICU-301', status: 'AVAILABLE', patient: null },
      { id: 'PICU-302', status: 'OCCUPIED', patient: 'Siddharth M. (ECMO Run)', doctor: 'Dr. Arvind Mehra', days: 7 },
      { id: 'PICU-303', status: 'AVAILABLE', patient: null },
      { id: 'PICU-304', status: 'OCCUPIED', patient: 'Harish V. (Severe ARDS Isolation)', doctor: 'Dr. Sunita Sen', days: 4 },
    ],
    PRIVATE_CABIN: [
      { id: 'CAB-401', status: 'AVAILABLE', patient: null },
      { id: 'CAB-402', status: 'OCCUPIED', patient: 'Nalini Iyer', doctor: 'Dr. Kavita Deshmukh', days: 3 },
      { id: 'CAB-403', status: 'AVAILABLE', patient: null },
      { id: 'CAB-404', status: 'AVAILABLE', patient: null },
      { id: 'CAB-405', status: 'OCCUPIED', patient: 'Pradeep Goel', doctor: 'Dr. Rajesh Varma', days: 1 },
      { id: 'CAB-406', status: 'AVAILABLE', patient: null },
    ],
    PREMIUM_PRIVATE_CABIN: [
      { id: 'PCAB-501', status: 'AVAILABLE', patient: null },
      { id: 'PCAB-502', status: 'OCCUPIED', patient: 'Ambassador H. Al-Mansoor', doctor: 'Dr. Arvind Mehra', days: 4 },
      { id: 'PCAB-503', status: 'AVAILABLE', patient: null },
      { id: 'PCAB-504', status: 'OCCUPIED', patient: 'Rajiv Singhania', doctor: 'Dr. Ananya Sharma', days: 2 },
    ],
  });

  // 3D Perspective Tilt with Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Reset active photo index and progress when changing category
  useEffect(() => {
    setActivePhotoIndex(0);
    setSwipeProgress(0);
  }, [selectedCategory]);

  // Active Category Photographs (Maximum 15 Limit)
  const activePhotos = (wardPhotos[selectedCategory] && wardPhotos[selectedCategory].length > 0)
    ? wardPhotos[selectedCategory]
    : (INITIAL_WARD_PHOTOS[selectedCategory] || []);
  const safePhotoIndex = activePhotos.length > 0
    ? Math.min(activePhotoIndex, activePhotos.length - 1)
    : 0;
  const currentPhoto = activePhotos[safePhotoIndex] || activePhotos[0];

  // Auto-Swiper Timer Effect (Always Active: 6-second auto-advance with smooth progress, pausing on hover)
  useEffect(() => {
    if (isHovered || activePhotos.length <= 1) {
      return;
    }

    const stepMs = 100;
    const interval = setInterval(() => {
      setSwipeProgress((prev) => {
        if (prev >= 100) {
          setSlideDirection(1);
          setActivePhotoIndex((curr) => (curr + 1) % activePhotos.length);
          return 0;
        }
        return prev + (stepMs / AUTO_SWIPE_INTERVAL_MS) * 100;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isHovered, activePhotos.length, safePhotoIndex]);

  // Navigation handlers
  const handleNextPhoto = () => {
    sound.playClick();
    setSlideDirection(1);
    setActivePhotoIndex((prev) => (prev + 1) % activePhotos.length);
    setSwipeProgress(0);
  };

  const handlePrevPhoto = () => {
    sound.playClick();
    setSlideDirection(-1);
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : activePhotos.length - 1));
    setSwipeProgress(0);
  };

  const handleSelectPhoto = (idx: number) => {
    sound.playClick();
    setSlideDirection(idx >= safePhotoIndex ? 1 : -1);
    setActivePhotoIndex(idx);
    setSwipeProgress(0);
  };

    const currentCatData = BED_CATEGORIES[selectedCategory];

  // Total summary across 5 categories
  const totalAllBeds = Object.values(BED_CATEGORIES).reduce((acc, c) => acc + c.totalBeds, 0);
  const totalAllAvailable = Object.values(BED_CATEGORIES).reduce((acc, c) => acc + c.availableBeds, 0);
  const totalOccupied = totalAllBeds - totalAllAvailable;
  const occupancyPercentage = Math.round((totalOccupied / totalAllBeds) * 100);

  // Admission Execution
  const handleExecuteAdmission = () => {
    if (!targetBedToAdmit) return;
    sound.playChime();
    setWardBeds((prev) => {
      const list = prev[selectedCategory] || [];
      const updated = list.map((b) =>
        b.id === targetBedToAdmit.id
          ? {
              ...b,
              status: 'OCCUPIED',
              patient: patientNameInput,
              doctor: attendingDoctorInput,
              days: 1,
            }
          : b
      );
      return { ...prev, [selectedCategory]: updated };
    });

    // Decrement available count in category
    BED_CATEGORIES[selectedCategory].availableBeds = Math.max(0, BED_CATEGORIES[selectedCategory].availableBeds - 1);

    const successMsg = `Patient ${patientNameInput} successfully admitted to ${targetBedToAdmit.id} (${currentCatData.name})! Vitals telemetry stream initialized.`;
    if (onAdmitPatientSuccess) onAdmitPatientSuccess(successMsg);

    setIsAdmitModalOpen(false);
    setTargetBedToAdmit(null);
  };

  // Discharge Execution
  const handleExecuteDischarge = (bed: any) => {
    sound.playChime();
    setWardBeds((prev) => {
      const list = prev[selectedCategory] || [];
      const updated = list.map((b) =>
        b.id === bed.id
          ? {
              ...b,
              status: 'SANITIZING',
              patient: null,
              doctor: null,
            }
          : b
      );
      return { ...prev, [selectedCategory]: updated };
    });

    const msg = `Bed ${bed.id} discharged. Initiated UV-C sterilization protocol. Bed will return to AVAILABLE shortly.`;
    if (onAdmitPatientSuccess) onAdmitPatientSuccess(msg);
    setSelectedBedItem(null);
  };

// activePhotos and safePhotoIndex handled above

  // Photo Upload File Handler (Local device file)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Selected image exceeds 8MB size limit. Please select a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save Uploaded Photo (Enforces Maximum 10 Photos per Category)
  const handleSaveUploadedPhoto = () => {
    const targetCat = uploadCategory || selectedCategory;
    const currentList = wardPhotos[targetCat] || [];
    if (currentList.length >= MAX_WARD_PHOTOS) {
      alert(`Maximum ${MAX_WARD_PHOTOS} photographs reached for ${BED_CATEGORIES[targetCat].name}. Please delete an existing photo to upload a new one.`);
      return;
    }

    const finalUrl = uploadFilePreview || uploadPhotoUrl.trim();
    if (!finalUrl) {
      alert('Please select an image file or provide a valid image URL.');
      return;
    }

    const newPhoto: WardPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: finalUrl,
      title: uploadPhotoTitle.trim() || `${BED_CATEGORIES[targetCat].name} Real Photograph`,
      caption: uploadPhotoCaption.trim() || `Verified hospital photograph uploaded for ${BED_CATEGORIES[targetCat].name}.`,
      tag: uploadPhotoTag || 'Ward View',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      isCustom: true,
    };

    sound.playChime();
    setWardPhotos((prev) => ({
      ...prev,
      [targetCat]: [...(prev[targetCat] || []), newPhoto],
    }));

    // Reset upload state
    setUploadFilePreview(null);
    setUploadPhotoUrl('');
    setUploadPhotoTitle('');
    setUploadPhotoCaption('');
    setIsUploadPhotoModalOpen(false);

    if (onAdmitPatientSuccess) {
      onAdmitPatientSuccess(
        `New photograph successfully uploaded to ${BED_CATEGORIES[targetCat].name} portal! (${currentList.length + 1}/${MAX_WARD_PHOTOS} photos uploaded)`
      );
    }
  };

  // Delete Photo Handler
  const handleDeletePhoto = (photoId: string, category: BedCategoryType) => {
    sound.playClick();
    setWardPhotos((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((p) => p.id !== photoId),
    }));
    if (lightboxPhotoIndex !== null) {
      setLightboxPhotoIndex(null);
    }
    if (onAdmitPatientSuccess) {
      onAdmitPatientSuccess(`Photograph deleted from ${BED_CATEGORIES[category].name} gallery.`);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-2xl bg-gradient-to-br from-navy via-slate-900 to-navy-light text-white p-4 sm:p-5 shadow-2xl border border-white/10 space-y-3.5"
      style={{ perspective: 1200 }}
    >
      {/* COMPACT HEADER: TITLE & GLOBAL INPATIENT CAPACITY TICKER */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-coral to-coral-deep text-white shadow-glow-coral">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-display text-white flex items-center gap-2">
              <span>Inpatient Ward Architecture & Real-Time Bed Matrix</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                LIVE TELEMETRY
              </span>
            </h3>
          </div>
        </div>

        {/* Compact Capacity HUD */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1 backdrop-blur-md text-[11px] font-mono">
          <span className="text-slate-400">Total Capacity:</span>
          <span className="text-emerald-400 font-bold">{totalAllAvailable} Free</span>
          <span className="text-slate-500">/</span>
          <span className="text-white font-bold">{totalAllBeds} Total</span>
          <span className="px-1.5 py-0.2 rounded bg-coral/20 text-coral-light font-bold text-[10px]">
            {occupancyPercentage}% Occ
          </span>
        </div>
      </div>

      {/* 5-CATEGORY HORIZONTAL CAPSULE TABS (COMPACT ~38px) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(BED_CATEGORIES) as BedCategoryType[]).map((catKey) => {
          const cat = BED_CATEGORIES[catKey];
          const isSelected = selectedCategory === catKey;
          const occPct = Math.round(((cat.totalBeds - cat.availableBeds) / cat.totalBeds) * 100);

          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(catKey);
              }}
              className={`py-2 px-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center justify-between gap-1 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r ' + cat.bgGradient + ' border-white/40 shadow-glow-coral'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    {cat.shortCode}
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {cat.name.split(' (')[0]}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-emerald-300 font-semibold">
                  ₹{cat.dailyTariff.toLocaleString('en-IN')}<span className="text-[9px] text-slate-400 font-normal">/d</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-black/40 text-emerald-300' : 'bg-black/30 text-emerald-400'
                }`}>
                  {cat.availableBeds} Free
                </span>
                <span className="block text-[8px] font-mono text-slate-400 mt-0.5">
                  {occPct}% occ
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2-COLUMN COMPACT STAGE: PHOTO GALLERY (LEFT) & WARD DESK (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* COLUMN 1: COMPACT AUTHENTIC PHOTO SHOWCASE (EXPANDED TO 8 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between rounded-xl bg-slate-900/90 border border-white/10 p-3 sm:p-4 relative overflow-hidden shadow-xl min-h-[420px] sm:min-h-[460px] lg:min-h-[490px]">
          {/* Top Bar on Authentic Bed Showcase */}
          <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{currentCatData.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                  {currentCatData.shortCode}
                </span>
              </h4>
            </div>

            {/* Gallery Toolbar: Zoom & Photo Counter */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLightboxPhotoIndex(safePhotoIndex)}
                className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/15 text-[9px] font-mono text-white hover:bg-black/80 flex items-center gap-1 transition-all"
                title="Full View"
              >
                <ZoomIn className="w-2.5 h-2.5 text-cyan-400" />
                <span>Zoom</span>
              </button>

              <span className="text-[9px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                {safePhotoIndex + 1}/{activePhotos.length}
              </span>
            </div>
          </div>

          {/* Main Photo Viewport with Left-Swipe & Clean Aspect Ratio */}
          <div
            className="relative my-2 rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex-1 min-h-[350px] sm:min-h-[390px] lg:min-h-[420px] group flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setLightboxPhotoIndex(safePhotoIndex)}
          >
            {/* Auto-Advance Progress Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-black/50 z-30">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 transition-all duration-100 ease-linear"
                style={{ width: `${swipeProgress}%` }}
              />
            </div>

            {/* Left & Right Slide Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-lg"
              title="Previous photograph"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-lg"
              title="Next photograph"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* AnimatePresence Active Photograph */}
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={`${selectedCategory}-${safePhotoIndex}-${currentPhoto?.id}`}
                custom={slideDirection}
                variants={{
                  enter: (dir: number) => ({
                    x: dir > 0 ? 120 : -120,
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  },
                  exit: (dir: number) => ({
                    x: dir > 0 ? -120 : 120,
                    opacity: 0,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
              >
                {/* Ambient Blurred Glow */}
                <img
                  src={currentPhoto?.url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

                {/* Foreground Image - Always Auto-Fitted with full aspect ratio preserved */}
                <img
                  src={currentPhoto?.url}
                  alt={currentPhoto?.title}
                  className="relative z-10 w-full h-full select-none drop-shadow-xl transition-all duration-300 object-contain max-h-full max-w-full p-0 sm:p-0.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating Top Tag */}
            <div className="absolute top-2 left-2 z-20 pointer-events-none">
              <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono font-bold text-cyan-300 border border-cyan-500/30 shadow-md">
                {currentPhoto?.tag || 'Ward Unit'}
              </span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: ULTRA-COMPACT REAL-TIME WARD INVENTORY & MEDIA DESK (4-5 COLS) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 space-y-3 shadow-xl">
          {/* 1. Category Header & Metrics Ribbon (Combined in ~45px) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono">
                  WARD DESK
                </span>
                <span className="text-xs font-bold text-white">
                  {currentCatData.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold block">
                ₹{currentCatData.dailyTariff.toLocaleString('en-IN')}/day • Cashless TPA
              </span>
            </div>

            {/* 3 Metric Pills */}
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <div className="px-2 py-1 rounded bg-black/40 border border-white/10 text-center">
                <span className="text-slate-400 text-[8px] block">TOTAL</span>
                <strong className="text-white font-bold">{currentCatData.totalBeds}</strong>
              </div>
              <div className="px-2 py-1 rounded bg-rose-950/30 border border-rose-500/30 text-center">
                <span className="text-rose-300 text-[8px] block">OCCUPIED</span>
                <strong className="text-rose-200 font-bold">{currentCatData.totalBeds - currentCatData.availableBeds}</strong>
              </div>
              <div className="px-2 py-1 rounded bg-emerald-950/30 border border-emerald-500/30 text-center">
                <span className="text-emerald-300 text-[8px] block">FREE</span>
                <strong className="text-emerald-400 font-bold">{currentCatData.availableBeds}</strong>
              </div>
            </div>
          </div>

          {/* 2. Compact Verified Facilities Pills (~35px) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Certified Facilities
              </span>
              <span className="text-emerald-400 text-[9px]">Verified NABH/IRDAI</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
              {currentCatData.facilities.flatMap(f => f.items).slice(0, 6).map((item, idx) => (
                <span
                  key={idx}
                  className="shrink-0 px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[9px] text-slate-300 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="truncate max-w-[120px]">{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 3. Compact Ward Bed Units Grid (~55px) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" /> Bed Allocation ({currentCatData.shortCode})
              </span>
              <span className="text-[9px] text-emerald-400">
                {(wardBeds[selectedCategory] || []).filter(b => b.status === 'AVAILABLE').length} Free to Admit
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {(wardBeds[selectedCategory] || []).slice(0, 12).map((bed) => {
                const isAvail = bed.status === 'AVAILABLE';
                const isOcc = bed.status === 'OCCUPIED';

                return (
                  <button
                    key={bed.id}
                    onClick={() => {
                      sound.playClick();
                      if (isAvail) {
                        setTargetBedToAdmit(bed);
                        setIsAdmitModalOpen(true);
                      } else {
                        setSelectedBedItem(bed);
                      }
                    }}
                    className={`py-1 px-1 rounded text-center transition-all cursor-pointer border ${
                      isAvail
                        ? 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-200'
                        : isOcc
                        ? 'bg-rose-950/40 border-rose-500/40 hover:bg-rose-900/60 text-rose-200'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    }`}
                    title={isAvail ? `${bed.id}: Free (Click to Admit)` : `${bed.id}: Occupied by ${bed.patient}`}
                  >
                    <div className="text-[9px] font-bold font-mono">{bed.id}</div>
                    <div className="text-[8px] truncate opacity-80">
                      {isAvail ? 'Free' : isOcc ? (bed.patient?.split(' ')[0] || 'Patient') : 'Clean'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Compact Hospital Management Media Desk (~50px) */}
          <div className="p-2 rounded-lg bg-slate-900/80 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-white font-mono uppercase">
                  Media Control ({activePhotos.length}/{MAX_WARD_PHOTOS})
                </span>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  sound.playClick();
                  setUploadCategory(selectedCategory);
                  setIsUploadPhotoModalOpen(true);
                }}
                disabled={activePhotos.length >= MAX_WARD_PHOTOS}
                className="text-[10px] h-6 py-0 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
              >
                <Upload className="w-2.5 h-2.5 text-white" />
                <span>Upload</span>
              </Button>
            </div>

            {/* Horizontal Mini Thumbnail Strip of Photos */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
              {activePhotos.map((photo, pIdx) => {
                const isBroadcasting = pIdx === safePhotoIndex;
                return (
                  <div
                    key={photo.id}
                    className={`relative shrink-0 w-12 h-8 rounded border overflow-hidden transition-all group ${
                      isBroadcasting
                        ? 'border-emerald-400 ring-1 ring-emerald-400/60 scale-105'
                        : 'border-white/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleSelectPhoto(pIdx)}
                    />
                    {isBroadcasting && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
                    )}
                    {photo.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id, selectedCategory);
                        }}
                        className="absolute bottom-0 right-0 p-0.5 bg-rose-950/90 text-rose-300 hover:text-white rounded-tl opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete photo"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {activePhotos.length < MAX_WARD_PHOTOS && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setUploadCategory(selectedCategory);
                    setIsUploadPhotoModalOpen(true);
                  }}
                  className="shrink-0 w-12 h-8 rounded border border-dashed border-white/20 hover:border-emerald-400 hover:bg-emerald-500/10 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-300 transition-all cursor-pointer"
                  title="Upload Photograph"
                >
                  <Plus className="w-3 h-3 text-emerald-400" />
                  <span className="text-[7px] font-mono">+Add</span>
                </button>
              )}
            </div>
          </div>

          {/* 5. Selected Bed Detail or Live Footer */}
          {selectedBedItem ? (
            <div className="p-2 rounded-lg bg-slate-900 border border-coral/40 text-[10px] space-y-1 animate-fadeIn">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-bold text-coral-light flex items-center gap-1">
                  <User className="w-3 h-3 text-coral" /> {selectedBedItem.id} Inpatient
                </span>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  Day {selectedBedItem.days}
                </span>
              </div>
              <div className="font-bold text-white text-xs">{selectedBedItem.patient}</div>
              <div className="text-[10px] text-slate-300">
                Physician: <strong className="text-white">{selectedBedItem.doctor}</strong>
              </div>
              <div className="pt-1 flex justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-[10px] py-1 px-2 h-auto"
                  onClick={() => handleExecuteDischarge(selectedBedItem)}
                >
                  Discharge
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-[10px] py-1 px-2 h-auto"
                  onClick={() => setSelectedBedItem(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>Click green bed to admit • Click red to inspect</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Live Sync
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADMIT PATIENT INTO TARGET BED */}
      {isAdmitModalOpen && targetBedToAdmit && (
        <Modal
          isOpen={isAdmitModalOpen}
          onClose={() => setIsAdmitModalOpen(false)}
          title={`Admit Patient into Bed ${targetBedToAdmit.id} — ${currentCatData.name}`}
          description={`Daily Tariff: ₹${currentCatData.dailyTariff.toLocaleString('en-IN')}/day • ${currentCatData.tagline}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsAdmitModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                onClick={handleExecuteAdmission}
              >
                <Check className="w-4 h-4 mr-1.5" /> Confirm Inpatient Admission
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <Input
              label="Patient Legal Full Name"
              value={patientNameInput}
              onChange={(e) => setPatientNameInput(e.target.value)}
            />
            <Input
              label="Admitting Clinical Diagnosis"
              value={admissionDiagnosisInput}
              onChange={(e) => setAdmissionDiagnosisInput(e.target.value)}
            />
            <Input
              label="Attending Consultant / Department"
              value={attendingDoctorInput}
              onChange={(e) => setAttendingDoctorInput(e.target.value)}
            />

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] leading-relaxed">
              Admission will immediately initialize real-time vitals monitoring ({currentCatData.vitalsMonitoring}), generate an inpatient encounter identifier, and publish the bed allocation to the patient portal.
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: UPLOAD HOSPITAL WARD PHOTOGRAPH (MAX 10) */}
      {isUploadPhotoModalOpen && (
        <Modal
          isOpen={isUploadPhotoModalOpen}
          onClose={() => {
            setIsUploadPhotoModalOpen(false);
            setUploadFilePreview(null);
            setUploadPhotoUrl('');
            setUploadPhotoTitle('');
            setUploadPhotoCaption('');
          }}
          title={`Upload Picture for ${BED_CATEGORIES[uploadCategory].name}`}
          description={`Hospital Administration Portal • Max ${MAX_WARD_PHOTOS} photos per category (${(wardPhotos[uploadCategory] || []).length}/${MAX_WARD_PHOTOS} uploaded)`}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsUploadPhotoModalOpen(false);
                  setUploadFilePreview(null);
                  setUploadPhotoUrl('');
                  setUploadPhotoTitle('');
                  setUploadPhotoCaption('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                onClick={handleSaveUploadedPhoto}
                disabled={(!uploadFilePreview && !uploadPhotoUrl) || (wardPhotos[uploadCategory] || []).length >= MAX_WARD_PHOTOS}
              >
                <Upload className="w-4 h-4 mr-1.5" /> Save to Ward Gallery
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs text-slate-800">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Bed Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as BedCategoryType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.values(BED_CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({(wardPhotos[cat.id] || []).length}/${MAX_WARD_PHOTOS} photos)
                  </option>
                ))}
              </select>
            </div>

            {/* Image Source: File Upload or URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Upload Image File (from device)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-300 rounded-lg p-1.5"
              />
              <div className="text-[10px] text-slate-400">
                Supported formats: JPG, PNG, WebP (Max 8MB).
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-mono">OR Image URL</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div>
              <Input
                label="Direct Image URL (Web Link)"
                placeholder="https://images.unsplash.com/photo-..."
                value={uploadPhotoUrl}
                onChange={(e) => setUploadPhotoUrl(e.target.value)}
              />
            </div>

            {/* Live Preview */}
            {(uploadFilePreview || uploadPhotoUrl) && (
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-slate-700">Image Preview:</span>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                  <img
                    src={uploadFilePreview || uploadPhotoUrl}
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Title & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  label="Photograph Title"
                  placeholder="e.g. Bedside Headwall & O₂ Port"
                  value={uploadPhotoTitle}
                  onChange={(e) => setUploadPhotoTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo Tag / Section
                </label>
                <select
                  value={uploadPhotoTag}
                  onChange={(e) => setUploadPhotoTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Bedside Unit">Bedside Unit</option>
                  <option value="Ward Bay">Ward Bay</option>
                  <option value="Attached Bath">Attached Bath</option>
                  <option value="Attendant Sofa">Attendant Sofa</option>
                  <option value="Ventilator Port">Ventilator Port</option>
                  <option value="Vital Telemetry">Vital Telemetry</option>
                  <option value="Amenities">Amenities</option>
                  <option value="Sanitization">Sanitization</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <Input
                label="Clinical Description / Caption"
                placeholder="e.g. Real view of motorized bed, attached bathroom, and continuous telemetry."
                value={uploadPhotoCaption}
                onChange={(e) => setUploadPhotoCaption(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                All uploaded photographs are verified under Hospital Infrastructure Quality Guidelines (NABH / JCI) and displayed in real time to incoming patients and TPA insurance assessors.
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* LIGHTBOX MODAL: FULL RESOLUTION ACTUAL PHOTO INSPECTOR */}
      {lightboxPhotoIndex !== null && activePhotos[lightboxPhotoIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxPhotoIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/90 text-white">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {currentCatData.name} — Real Hospital Photograph
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activePhotos[lightboxPhotoIndex].tag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  Photo {lightboxPhotoIndex + 1} of {activePhotos.length}
                </span>
                <button
                  onClick={() => setLightboxPhotoIndex(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image Stage with Prev / Next */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[400px] max-h-[72vh] overflow-hidden group">
              <img
                src={activePhotos[lightboxPhotoIndex].url}
                alt={activePhotos[lightboxPhotoIndex].title}
                className="max-w-full max-h-[72vh] object-contain select-none"
              />

              {/* Prev Button */}
              <button
                onClick={() =>
                  setLightboxPhotoIndex((prev) => (prev! > 0 ? prev! - 1 : activePhotos.length - 1))
                }
                className="absolute left-3 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-sm transition-all"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setLightboxPhotoIndex((prev) => (prev! < activePhotos.length - 1 ? prev! + 1 : 0))
                }
                className="absolute right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-sm transition-all"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Footer & Details */}
            <div className="p-4 bg-slate-900 border-t border-white/10 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {activePhotos[lightboxPhotoIndex].title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {activePhotos[lightboxPhotoIndex].caption}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs h-7 py-1 px-2.5"
                    onClick={() => handleDeletePhoto(activePhotos[lightboxPhotoIndex].id, selectedCategory)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10 overflow-x-auto pb-1">
                {activePhotos.map((thumb, tIdx) => (
                  <button
                    key={thumb.id}
                    onClick={() => setLightboxPhotoIndex(tIdx)}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border shrink-0 transition-all ${
                      lightboxPhotoIndex === tIdx
                        ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

