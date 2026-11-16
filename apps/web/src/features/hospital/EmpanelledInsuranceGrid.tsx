import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  PhoneCall,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  Building2,
  Copy,
  Check,
  FileText,
  Clock,
  Send,
  Zap,
  Info,
  Mail,
  Server,
  Landmark,
} from 'lucide-react';
import { sound } from '@/services/soundEffects';
import { INSURANCE_LOGO_MAP, INSURANCE_LOGO_SRC_MAP } from './InsuranceLogos';

export interface InsuranceProvider {
  id: string;
  name: string;
  shortName: string;
  category: 'STANDALONE_HEALTH' | 'PSU_GENERAL' | 'PRIVATE_GENERAL' | 'GOVT_SCHEME' | 'INTERNATIONAL' | 'HOSPITAL_DESK';
  categoryLabel: string;
  helpline: string;
  helplineDisplay: string;
  email: string;
  website: string;

  // Rigorous Claims & TPA Architecture (IRDAI & International Standards Compliant)
  claimsModel: 'IN_HOUSE_DIRECT' | 'EMPANELLED_TPA' | 'HYBRID' | 'GOVT_SCHEME' | 'INTERNATIONAL_ASSISTANCE' | 'HOSPITAL_ASSISTANCE';
  claimsModelLabel: string;
  inHouseDesk: string;
  licensedTpas: string[];
  govAuthority?: string;
  itPlatform?: string;

  // Compatibility fields
  tpaName: string;
  tpaDesk: string;
  tpaType: 'IN_HOUSE' | 'EMPANELLED_TPA' | 'HYBRID' | 'GOVT_AGENCY' | 'INTERNATIONAL';
  tpaPartners: string[];

  settlementRatio: string;
  brandColor: string;
  bgGradient: string;
  emblemText: string;
  accentBorder: string;
  logoUrl?: string;
}

export const ALL_INSURANCE_PROVIDERS: InsuranceProvider[] = [
  {
    id: 'acko',
    name: 'Acko General Insurance Limited',
    shortName: 'Acko',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Digital Native Insurer',
    helpline: '1800 266 2256',
    helplineDisplay: '1800-266-2256',
    email: 'hello@acko.com',
    website: 'https://www.acko.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House App Adjudication (Retail) + Empanelled TPA (Corporate)',
    inHouseDesk: 'Acko In-House Digital Claims Operations (Direct-to-Consumer Engine)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003 - IRDAI Form NL-48 Partner)',
    ],
    tpaName: 'In-House Digital Engine (Retail) & Medi Assist TPA (Corporate)',
    tpaDesk: 'In-House App Pre-Auth & Medi Assist Corporate Claims Partner',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003 - IRDAI Form NL-48 Partner)',
    ],
    settlementRatio: '98.7%',
    brandColor: '#582C83',
    bgGradient: 'from-purple-900 via-violet-950 to-indigo-900',
    emblemText: 'ACKO',
    accentBorder: 'hover:border-purple-400',
  },
  {
    id: 'aditya-birla',
    name: 'Aditya Birla Health Insurance Co. Limited',
    shortName: 'Aditya Birla Health',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1800 270 7000',
    helplineDisplay: '1800-270-7000',
    email: 'care.healthinsurance@adityabirlacapital.com',
    website: 'https://www.adityabirlacapital.com/healthinsurance',
    claimsModel: 'IN_HOUSE_DIRECT',
    claimsModelLabel: '100% In-House Direct Settlement (No External TPA)',
    inHouseDesk: 'Aditya Birla Health In-House Claims Department (Activ Health / Activ One Direct Desk)',
    licensedTpas: [],
    tpaName: 'In-House TPA: Aditya Birla Health In-House Claims Department',
    tpaDesk: 'Activ Health Direct In-House Pre-Auth & Claims Department',
    tpaType: 'IN_HOUSE',
    tpaPartners: ['Aditya Birla Health In-House Claims Department (Activ Health Desk)'],
    settlementRatio: '99.2%',
    brandColor: '#C4122F',
    bgGradient: 'from-red-900 via-rose-950 to-red-800',
    emblemText: 'ADITYA BIRLA',
    accentBorder: 'hover:border-red-500',
  },
  {
    id: 'allianz-care',
    name: 'Allianz Care (Allianz Partners Global Healthcare)',
    shortName: 'Allianz Care',
    category: 'INTERNATIONAL',
    categoryLabel: 'International / Expat',
    helpline: '+353 1 630 1302',
    helplineDisplay: '+353 1 630 1302 (Global Claims Helpdesk)',
    email: 'claims@allianzcare.com',
    website: 'https://www.allianzcare.com',
    claimsModel: 'INTERNATIONAL_ASSISTANCE',
    claimsModelLabel: 'Allianz Partners Corporate & Expatriate Health',
    inHouseDesk: 'Allianz Partners Health & Life Claims Medical Cell (24/7 International Desk)',
    licensedTpas: [
      'Allianz Partners International Claims & Pre-Authorization Division',
      'Allianz Care Direct Hospital Cashless Settlement Network',
      'Paramount TPA / FHPL (Empanelled Regional Support for Cashless Admissions)',
    ],
    tpaName: 'Allianz Partners International Health & Cashless Clearance Division',
    tpaDesk: 'Allianz Care Direct Cashless Clearinghouse & Hospital Assistance Desk',
    tpaType: 'INTERNATIONAL',
    tpaPartners: [
      'Allianz Partners International Claims & Pre-Authorization Division',
      'Allianz Care Direct Hospital Cashless Settlement Network',
      'Paramount TPA / FHPL (Empanelled Regional Support for Cashless Admissions)',
    ],
    settlementRatio: '99.1%',
    brandColor: '#003781',
    bgGradient: 'from-slate-900 via-blue-950 to-indigo-950',
    emblemText: 'ALLIANZ CARE',
    accentBorder: 'hover:border-sky-400',
  },
  {
    id: 'allianz-care-international',
    name: 'Allianz Care International (Allianz Worldwide Care)',
    shortName: 'Allianz Care International',
    category: 'INTERNATIONAL',
    categoryLabel: 'International / Expat',
    helpline: '+353 1 630 1301',
    helplineDisplay: '+353 1 630 1301 (24/7 Multilingual)',
    email: 'client.services@allianzworldwidecare.com',
    website: 'https://www.allianzcare.com',
    claimsModel: 'INTERNATIONAL_ASSISTANCE',
    claimsModelLabel: 'Global Expatriate Medical Direct Billing Network',
    inHouseDesk: 'Allianz Care Worldwide Medical Network & Emergency Assistance Operations',
    licensedTpas: [
      'Allianz Partners Global Medical Network (Direct Cashless GOP Clearinghouse)',
      'MyHealth Digital Pre-Authorization & Direct Billing Infrastructure',
      'Medi Assist / Vidal Health TPA (Regional Coordination for International Patients)',
    ],
    tpaName: 'Allianz Partners Global Assistance & Direct Guarantee of Payment (GOP)',
    tpaDesk: 'Allianz Worldwide Care International Claims & Pre-Auth Bureau',
    tpaType: 'INTERNATIONAL',
    tpaPartners: [
      'Allianz Partners Global Medical Network (Direct Cashless GOP Clearinghouse)',
      'MyHealth Digital Pre-Authorization & Direct Billing Infrastructure',
      'Medi Assist / Vidal Health TPA (Regional Coordination for International Patients)',
    ],
    settlementRatio: '99.0%',
    brandColor: '#003781',
    bgGradient: 'from-blue-950 via-slate-900 to-sky-950',
    emblemText: 'ALLIANZ INTL',
    accentBorder: 'hover:border-blue-400',
  },
  {
    id: 'bajaj-allianz',
    name: 'Bajaj Allianz General Insurance Company Limited',
    shortName: 'Bajaj Allianz',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 209 5858',
    helplineDisplay: '1800-209-5858',
    email: 'bagichelp@bajajallianz.co.in',
    website: 'https://www.bajajallianz.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House HAT (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'Health Administration Team (HAT) - Bajaj Allianz Dedicated In-House Medical Wing',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
    ],
    tpaName: 'In-House HAT (Health Administration Team) & Empanelled Corporate TPAs',
    tpaDesk: 'In-House HAT Medical Wing & Empanelled Group TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
    ],
    settlementRatio: '98.2%',
    brandColor: '#005596',
    bgGradient: 'from-blue-900 to-indigo-800',
    emblemText: 'BAJAJ ALLIANZ',
    accentBorder: 'hover:border-blue-600',
  },
  {
    id: 'care-health',
    name: 'Care Health Insurance Limited (formerly Religare)',
    shortName: 'Care Health',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1800 102 4488',
    helplineDisplay: '1800-102-4488',
    email: 'customerfirst@careinsurance.com',
    website: 'https://www.careinsurance.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House Claim Genie (Retail) + Empanelled TPA (Corporate)',
    inHouseDesk: 'Care Health Claims Management Department (Claim Genie Real-Time Platform)',
    licensedTpas: [
      'Health Assist Insurance TPA Pvt. Ltd. (formerly Safeway TPA - CoR No. 026)',
    ],
    tpaName: 'In-House Claim Genie Platform & Health Assist TPA (Corporate)',
    tpaDesk: 'In-House Claim Genie Adjudication & Corporate Group TPA',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Health Assist Insurance TPA Pvt. Ltd. (formerly Safeway TPA - CoR No. 026)',
    ],
    settlementRatio: '98.7%',
    brandColor: '#00A3AD',
    bgGradient: 'from-teal-900 via-sky-950 to-slate-900',
    emblemText: 'CARE HEALTH',
    accentBorder: 'hover:border-sky-400',
  },
  {
    id: 'cghs-echs',
    name: 'CGHS & ECHS Beneficiary Health Schemes',
    shortName: 'CGHS / ECHS',
    category: 'GOVT_SCHEME',
    categoryLabel: 'Government Panel',
    helpline: '1800 208 8900',
    helplineDisplay: '1800-208-8900 (Toll-Free)',
    email: 'cghs-helpdesk@lsmgr.nic.in',
    website: 'https://cghs.mohfw.gov.in/',
    claimsModel: 'GOVT_SCHEME',
    claimsModelLabel: 'Central Government Contributory Health Scheme',
    inHouseDesk: 'Ministry of Health and Family Welfare (MoHFW) / Ministry of Defence (MoD)',
    govAuthority: 'Ministry of Health and Family Welfare (MoHFW) & Dept. of Ex-Servicemen Welfare (MoD)',
    itPlatform: 'NHA CGHS Paperless TMS Portal (tms.nha.gov.in/CGHS)',
    licensedTpas: [
      'UTI Infrastructure Technology and Services Limited (UTI-ITSL - Designated Bill Processing Agency / BPA)',
    ],
    tpaName: 'NHA CGHS Paperless TMS & UTI-ITSL Bill Processing Agency',
    tpaDesk: 'NHA CGHS Paperless Clearinghouse & UTI-ITSL BPA System',
    tpaType: 'GOVT_AGENCY',
    tpaPartners: [
      'UTI Infrastructure Technology and Services Limited (UTI-ITSL - Designated Bill Processing Agency / BPA)',
    ],
    settlementRatio: '100% Cashless',
    brandColor: '#047857',
    bgGradient: 'from-teal-950 via-emerald-900 to-slate-900',
    emblemText: 'CGHS / ECHS',
    accentBorder: 'hover:border-teal-400',
  },
  {
    id: 'cholamandalam-ms',
    name: 'Cholamandalam MS General Insurance Company (Chola MS)',
    shortName: 'Chola MS',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 208 9100',
    helplineDisplay: '1800-208-9100',
    email: 'customercare@cholams.murugappa.com',
    website: 'https://www.cholainsurance.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House Chola MS HELP (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'Chola MS HELP (Health Everlasting Protection Unit - Est. 2008)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Good Health Insurance TPA Ltd.',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
    ],
    tpaName: 'In-House TPA: Chola MS HELP & Empanelled Group TPAs',
    tpaDesk: 'In-House Chola MS HELP (100% Retail) & Empanelled Corporate TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Good Health Insurance TPA Ltd.',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
    ],
    settlementRatio: '98.1%',
    brandColor: '#005A9C',
    bgGradient: 'from-blue-900 via-sky-950 to-slate-900',
    emblemText: 'CHOLA MS',
    accentBorder: 'hover:border-blue-400',
  },
  {
    id: 'cigna-global',
    name: 'Cigna Global Health Options (Cigna Healthcare)',
    shortName: 'Cigna Global',
    category: 'INTERNATIONAL',
    categoryLabel: 'International / Expat',
    helpline: '+44 1475 788 182',
    helplineDisplay: '+44 1475 788 182 (24/7 Global)',
    email: 'cghoclaims@cigna.com',
    website: 'https://www.cignaglobal.com',
    claimsModel: 'INTERNATIONAL_ASSISTANCE',
    claimsModelLabel: 'International Direct Billing & Clinical Assistance',
    inHouseDesk: 'Cigna Global Customer Operations & Clinical Case Management Division',
    licensedTpas: [
      'Cigna Envoy Global Direct Settlement Network (Over 1.5M Providers Worldwide)',
      'Cigna Global Medical Evacuation & Assistance Services',
      'Medi Assist India (Domestic Coordination / ISA Partner for Local Hospitalization)',
    ],
    tpaName: 'Cigna Envoy Global Direct Settlement Network & Assistance Desk',
    tpaDesk: 'Cigna Global Medical Claims Division (Direct Cashless Billing)',
    tpaType: 'INTERNATIONAL',
    tpaPartners: [
      'Cigna Envoy Global Direct Settlement Network (Over 1.5M Providers Worldwide)',
      'Cigna Global Medical Evacuation & Assistance Services',
      'Medi Assist India (Domestic Coordination / ISA Partner for Local Hospitalization)',
    ],
    settlementRatio: '99.2%',
    brandColor: '#094987',
    bgGradient: 'from-blue-950 via-sky-950 to-slate-900',
    emblemText: 'CIGNA GLOBAL',
    accentBorder: 'hover:border-sky-400',
  },
  {
    id: 'future-generali',
    name: 'Future Generali India Insurance Company Limited',
    shortName: 'Future Generali',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 220 233',
    helplineDisplay: '1800-220-233',
    email: 'fgcare@futuregenerali.in',
    website: 'https://general.futuregenerali.in',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House FGH (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'Future Generali Health (FGH) Dedicated In-House Claims Department',
    licensedTpas: [
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
    ],
    tpaName: 'In-House TPA: Future Generali Health (FGH) & Paramount TPA',
    tpaDesk: 'In-House FGH Claims Department & Paramount Corporate TPA',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
    ],
    settlementRatio: '97.2%',
    brandColor: '#C00000',
    bgGradient: 'from-red-900 via-rose-950 to-slate-900',
    emblemText: 'FUTURE GENERALI',
    accentBorder: 'hover:border-rose-400',
  },
  {
    id: 'galaxy-health',
    name: 'Galaxy Health and Allied Insurance Company Limited',
    shortName: 'Galaxy Health',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1800 203 0007',
    helplineDisplay: '1800-203-0007',
    email: 'support@galaxyhealth.com',
    website: 'https://www.galaxyhealth.com',
    claimsModel: 'IN_HOUSE_DIRECT',
    claimsModelLabel: '100% In-House Direct Settlement (No External TPA)',
    inHouseDesk: 'Galaxy Health In-House Claims Department (Direct Hospital Pre-Auth Operations)',
    licensedTpas: [],
    tpaName: 'In-House TPA: Galaxy Health In-House Claims Department',
    tpaDesk: 'Direct In-House Cashless Pre-Auth Operations (No External TPA)',
    tpaType: 'IN_HOUSE',
    tpaPartners: ['Galaxy Health In-House Claims Department (Direct Pre-Auth Operations)'],
    settlementRatio: '97.8%',
    brandColor: '#0F2E45',
    bgGradient: 'from-slate-900 via-sky-950 to-blue-900',
    emblemText: 'GALAXY HEALTH',
    accentBorder: 'hover:border-cyan-400',
  },
  {
    id: 'go-digit',
    name: 'Go Digit General Insurance Limited',
    shortName: 'Go Digit',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Digital Native Insurer',
    helpline: '1800 258 5956',
    helplineDisplay: '1800-258-5956',
    email: 'hello@godigit.com',
    website: 'https://www.godigit.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House Digital (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'Digit Direct Automated Claims Operations (FastTrack Health Desk)',
    licensedTpas: [
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
    ],
    tpaName: 'Digit Direct Claims Desk & Paramount / Medi Assist TPA',
    tpaDesk: 'Digit Direct Digital Pre-Auth & Empanelled Corporate TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
    ],
    settlementRatio: '99.0%',
    brandColor: '#FF6D00',
    bgGradient: 'from-amber-700 via-orange-800 to-slate-900',
    emblemText: 'GO DIGIT',
    accentBorder: 'hover:border-amber-400',
  },
  {
    id: 'hdfc-ergo',
    name: 'HDFC ERGO General Insurance Company Limited',
    shortName: 'HDFC ERGO',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '022 6234 6234',
    helplineDisplay: '022-6234-6234',
    email: 'care@hdfcergo.com',
    website: 'https://www.hdfcergo.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'HDFC ERGO In-House Health Claims Operations (Retail Direct Desk)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
    ],
    tpaName: 'In-House Health Claims Desk & Medi Assist / FHPL TPA',
    tpaDesk: 'In-House Retail Claims Desk & Empanelled Corporate TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
    ],
    settlementRatio: '98.9%',
    brandColor: '#004B87',
    bgGradient: 'from-blue-900 via-sky-950 to-slate-900',
    emblemText: 'HDFC ERGO',
    accentBorder: 'hover:border-sky-400',
  },
  {
    id: 'icici-lombard',
    name: 'ICICI Lombard General Insurance Company Limited',
    shortName: 'ICICI Lombard',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 2666',
    helplineDisplay: '1800-2666',
    email: 'customersupport@icicilombard.com',
    website: 'https://www.icicilombard.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House ILHC (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'ILHC (ICICI Lombard Health Care Department - In-House Direct Wing)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
    ],
    tpaName: 'In-House ILHC (ICICI Lombard Health Care) & Empanelled Group TPAs',
    tpaDesk: 'In-House ILHC Medical Desk & Empanelled IRDAI TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
    ],
    settlementRatio: '98.5%',
    brandColor: '#A81C24',
    bgGradient: 'from-orange-800 via-rose-900 to-amber-900',
    emblemText: 'ICICI LOMBARD',
    accentBorder: 'hover:border-amber-400',
  },
  {
    id: 'iffco-tokio',
    name: 'IFFCO Tokio General Insurance Company Limited',
    shortName: 'IFFCO Tokio',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 103 5499',
    helplineDisplay: '1800-103-5499',
    email: 'support@iffcotokio.co.in',
    website: 'https://www.iffcotokio.co.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'IFFCO-Tokio Health Underwriting & Claims Division',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Volo Health Insurance TPA Pvt. Ltd. (East West Assist) (CoR No. 018)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Park Mediclaim TPA Pvt. Ltd.',
      'Genins India Insurance TPA Ltd.',
    ],
    tpaName: 'Medi Assist / Volo Health / Vidal Health / MDIndia / Health India TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Form NL-48 Regulatory Disclosures)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Volo Health Insurance TPA Pvt. Ltd. (East West Assist) (CoR No. 018)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Park Mediclaim TPA Pvt. Ltd.',
      'Genins India Insurance TPA Ltd.',
    ],
    settlementRatio: '96.8%',
    brandColor: '#008542',
    bgGradient: 'from-green-950 via-emerald-950 to-slate-900',
    emblemText: 'IFFCO TOKIO',
    accentBorder: 'hover:border-emerald-400',
  },
  {
    id: 'img-global',
    name: 'International Medical Group (IMG Global Medical Insurance)',
    shortName: 'IMG Global Medical',
    category: 'INTERNATIONAL',
    categoryLabel: 'International / Expat',
    helpline: '+1 317 655 4500',
    helplineDisplay: '+1 (317) 655-4500 (Worldwide 24/7)',
    email: 'IntlClaims@imglobal.com',
    website: 'https://www.imglobal.com',
    claimsModel: 'INTERNATIONAL_ASSISTANCE',
    claimsModelLabel: 'International Direct Billing & Emergency Assistance',
    inHouseDesk: 'IMG Clinical Assistance, Pre-Authorization & Direct Hospital Billing Division',
    licensedTpas: [
      'MyIMG International Direct Provider Network (Global Direct Cashless Guarantee)',
      'IMG Global Medical Evacuation & Emergency Transport Coordination Cell',
      'Paramount Health / Vidal Health TPA (International Patient Direct Billing Assistance)',
    ],
    tpaName: 'MyIMG Direct Hospital Settlement & International Provider Network',
    tpaDesk: 'IMG Global Medical Assistance & Direct Cashless Billing Cell',
    tpaType: 'INTERNATIONAL',
    tpaPartners: [
      'MyIMG International Direct Provider Network (Global Direct Cashless Guarantee)',
      'IMG Global Medical Evacuation & Emergency Transport Coordination Cell',
      'Paramount Health / Vidal Health TPA (International Patient Direct Billing Assistance)',
    ],
    settlementRatio: '98.5%',
    brandColor: '#132D52',
    bgGradient: 'from-slate-900 via-blue-950 to-indigo-950',
    emblemText: 'IMG GLOBAL',
    accentBorder: 'hover:border-amber-400',
  },
  {
    id: 'manipal-cigna',
    name: 'ManipalCigna Health Insurance Company Limited',
    shortName: 'ManipalCigna',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1800 102 4462',
    helplineDisplay: '1800-102-4462',
    email: 'customercare@manipalcigna.com',
    website: 'https://www.manipalcigna.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House Direct (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'ManipalCigna In-House Claims Management Cell (Retail Policies)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
    ],
    tpaName: 'In-House Claims Cell (Retail) & Medi Assist / Vidal Health TPA',
    tpaDesk: 'In-House Retail Adjudication & Empanelled Group TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
    ],
    settlementRatio: '98.4%',
    brandColor: '#007A87',
    bgGradient: 'from-teal-900 to-emerald-800',
    emblemText: 'MANIPAL',
    accentBorder: 'hover:border-teal-500',
  },
  {
    id: 'narayana-health',
    name: 'Narayana Health Insurance Limited',
    shortName: 'Narayana Health',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1800 203 0234',
    helplineDisplay: '1800-203-0234',
    email: 'support@narayanahealth.insurance',
    website: 'https://www.narayanahealth.insurance',
    claimsModel: 'IN_HOUSE_DIRECT',
    claimsModelLabel: '100% In-House Direct Settlement (No External TPA)',
    inHouseDesk: 'Narayana Health In-House Claims Department (Integrated Payer-Provider Network Desk)',
    licensedTpas: [],
    tpaName: 'In-House TPA: Narayana Health In-House Claims Department',
    tpaDesk: 'Narayana Aditi Integrated Network Direct Claims Desk',
    tpaType: 'IN_HOUSE',
    tpaPartners: ['Narayana Health In-House Claims Department (Integrated Network Desk)'],
    settlementRatio: '98.0%',
    brandColor: '#E05A47',
    bgGradient: 'from-rose-900 via-red-950 to-slate-900',
    emblemText: 'NARAYANA',
    accentBorder: 'hover:border-rose-400',
  },
  {
    id: 'national-insurance',
    name: 'National Insurance Company Limited (NICL)',
    shortName: 'National Insurance',
    category: 'PSU_GENERAL',
    categoryLabel: 'PSU Govt Underwriter',
    helpline: '1800 345 0330',
    helplineDisplay: '1800-345-0330',
    email: 'customer.support@nic.co.in',
    website: 'https://nationalinsurance.nic.co.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'National Insurance Central Health Oversight Vertical',
    licensedTpas: [
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Health Insurance TPA of India Limited (HITPA)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Genins India Insurance TPA Ltd.',
      'Good Health Insurance TPA Ltd.',
      'Medsave Health Insurance TPA Ltd. (CoR No. 019)',
      'Volo Health Insurance TPA Pvt. Ltd. (CoR No. 018)',
      'Ericson Insurance TPA Pvt. Ltd. (CoR No. 035)',
    ],
    tpaName: 'Heritage Health / Medi Assist / MDIndia / Vidal Health / HITPA TPA',
    tpaDesk: 'Empanelled Public Sector IRDAI TPAs (Form NL-48 Mandatory Disclosure)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Health Insurance TPA of India Limited (HITPA)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Genins India Insurance TPA Ltd.',
      'Good Health Insurance TPA Ltd.',
      'Medsave Health Insurance TPA Ltd. (CoR No. 019)',
      'Volo Health Insurance TPA Pvt. Ltd. (CoR No. 018)',
      'Ericson Insurance TPA Pvt. Ltd. (CoR No. 035)',
    ],
    settlementRatio: '96.5%',
    brandColor: '#0C2340',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    emblemText: 'NATIONAL',
    accentBorder: 'hover:border-blue-400',
  },
  {
    id: 'new-india-assurance',
    name: 'The New India Assurance Company Limited (NIACL)',
    shortName: 'New India Assurance',
    category: 'PSU_GENERAL',
    categoryLabel: 'PSU Govt Underwriter',
    helpline: '1800 209 1415',
    helplineDisplay: '1800-209-1415',
    email: 'tech.support@newindia.co.in',
    website: 'https://www.newindia.co.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'New India Assurance Central Health Insurance Hub',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Good Health Insurance TPA Ltd.',
      'Medsave Health Insurance TPA Ltd. (CoR No. 019)',
    ],
    tpaName: 'Medi Assist / MDIndia / Heritage / FHPL / Vidal Health TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Form NL-48 Regulatory Annual Disclosures)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Good Health Insurance TPA Ltd.',
      'Medsave Health Insurance TPA Ltd. (CoR No. 019)',
    ],
    settlementRatio: '96.2%',
    brandColor: '#00487C',
    bgGradient: 'from-blue-900 via-sky-950 to-slate-900',
    emblemText: 'NEW INDIA',
    accentBorder: 'hover:border-blue-400',
  },
  {
    id: 'niva-bupa',
    name: 'Niva Bupa Health Insurance Company Limited',
    shortName: 'Niva Bupa',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1860 500 8888',
    helplineDisplay: '1860-500-8888',
    email: 'customercare@nivabupa.com',
    website: 'https://www.nivabupa.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House 30-Min Engine (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'Niva Bupa In-House Claims Processing Unit (30-Minute FastTrack Retail Engine)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
    ],
    tpaName: 'In-House Processing Unit (Retail) & Medi Assist / Raksha TPA',
    tpaDesk: 'In-House 30-Min FastTrack Adjudication & Corporate Group TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
    ],
    settlementRatio: '98.6%',
    brandColor: '#F97316',
    bgGradient: 'from-orange-600 via-amber-600 to-red-600',
    emblemText: 'NIVA BUPA',
    accentBorder: 'hover:border-orange-500',
  },
  {
    id: 'oriental-insurance',
    name: 'The Oriental Insurance Company Limited (OICL)',
    shortName: 'Oriental Insurance',
    category: 'PSU_GENERAL',
    categoryLabel: 'PSU Govt Underwriter',
    helpline: '1800 118 485',
    helplineDisplay: '1800-118-485',
    email: 'csd@orientalinsurance.co.in',
    website: 'https://orientalinsurance.org.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'Oriental Insurance Health Technical Vertical',
    licensedTpas: [
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Health Insurance TPA of India Limited (HITPA)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Good Health Insurance TPA Ltd.',
      'Genins India Insurance TPA Ltd.',
      'Ericson Insurance TPA Pvt. Ltd. (CoR No. 035)',
      'Volo Health Insurance TPA Pvt. Ltd. (CoR No. 018)',
    ],
    tpaName: 'MDIndia / Medi Assist / Vidal Health / Heritage / HITPA TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Form NL-48 Regulatory Disclosures)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Health Insurance TPA of India Limited (HITPA)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Good Health Insurance TPA Ltd.',
      'Genins India Insurance TPA Ltd.',
      'Ericson Insurance TPA Pvt. Ltd. (CoR No. 035)',
      'Volo Health Insurance TPA Pvt. Ltd. (CoR No. 018)',
    ],
    settlementRatio: '95.2%',
    brandColor: '#002B49',
    bgGradient: 'from-slate-900 via-blue-950 to-sky-950',
    emblemText: 'ORIENTAL',
    accentBorder: 'hover:border-sky-400',
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY (Government of India)',
    shortName: 'PM-JAY (Govt)',
    category: 'GOVT_SCHEME',
    categoryLabel: 'National Health Authority',
    helpline: '14555',
    helplineDisplay: '14555 (Toll-Free)',
    email: 'pmjay@nha.gov.in',
    website: 'https://nha.gov.in/PM-JAY',
    claimsModel: 'GOVT_SCHEME',
    claimsModelLabel: 'Government Health Assurance Scheme (NHA TMS + State ISAs)',
    inHouseDesk: 'National Health Authority (NHA) & State Health Agencies (SHA) Dedicated Units',
    govAuthority: 'National Health Authority (NHA) & State Health Agencies (SHAs across 33 States/UTs)',
    itPlatform: 'NHA National Health Claims TMS (Transaction Management System - tms.nha.gov.in)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003 - Empanelled ISA in states including Manipur)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005 - Empanelled ISA in states including Sikkim, Maharashtra)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016 - Empanelled ISA in states including Bihar, Kerala)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013 - Empanelled ISA in Southern States)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006 - Empanelled ISA in Western States)',
    ],
    tpaName: 'NHA TMS Clearinghouse & Empanelled State ISAs (Medi Assist | MDIndia | Vidal)',
    tpaDesk: 'NHA National Claims TMS & State Implementation Support Agencies (ISAs)',
    tpaType: 'GOVT_AGENCY',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003 - Empanelled ISA in states including Manipur)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005 - Empanelled ISA in states including Sikkim, Maharashtra)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016 - Empanelled ISA in states including Bihar, Kerala)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013 - Empanelled ISA in Southern States)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006 - Empanelled ISA in Western States)',
    ],
    settlementRatio: '100% Cashless',
    brandColor: '#E65100',
    bgGradient: 'from-amber-900 via-orange-950 to-slate-900',
    emblemText: 'PM-JAY',
    accentBorder: 'hover:border-amber-400',
  },
  {
    id: 'prudential-hcl',
    name: 'Prudential HCL Health Insurance Network / ICICI Prudential',
    shortName: 'Prudential Health',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private Underwriter',
    helpline: '1800 2660',
    helplineDisplay: '1800-2660',
    email: 'claimsupport@iciciprulife.com',
    website: 'https://www.iciciprulife.com',
    claimsModel: 'IN_HOUSE_DIRECT',
    claimsModelLabel: '100% In-House Direct Settlement (No External TPA)',
    inHouseDesk: 'ICICI Prudential In-House Health Claims Operations Cell',
    licensedTpas: [],
    tpaName: 'In-House TPA: ICICI Prudential Health Claims Department',
    tpaDesk: 'In-House Direct Hospital Operations Cell (No External TPA)',
    tpaType: 'IN_HOUSE',
    tpaPartners: ['ICICI Prudential In-House Health Claims Operations Cell'],
    settlementRatio: '98.9%',
    brandColor: '#A31D1D',
    bgGradient: 'from-red-950 via-rose-950 to-slate-900',
    emblemText: 'ICICI PRU',
    accentBorder: 'hover:border-red-400',
  },
  {
    id: 'reliance-general',
    name: 'Reliance General Insurance Company Limited',
    shortName: 'Reliance General',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '022 4890 3009',
    helplineDisplay: '022-4890-3009',
    email: 'rgicl.services@relianceada.com',
    website: 'https://www.reliancegeneral.co.in',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House RCare (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'RCare Health Claims Operations (Retail In-House Desk)',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
    ],
    tpaName: 'In-House RCare Health & Medi Assist / Vidal Health TPA',
    tpaDesk: 'In-House RCare Claims Operations & Empanelled Corporate TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
    ],
    settlementRatio: '97.6%',
    brandColor: '#D32F2F',
    bgGradient: 'from-red-950 via-rose-950 to-slate-900',
    emblemText: 'RELIANCE',
    accentBorder: 'hover:border-red-400',
  },
  {
    id: 'royal-sundaram',
    name: 'Royal Sundaram General Insurance Co. Limited',
    shortName: 'Royal Sundaram',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1860 425 0000',
    helplineDisplay: '1860-425-0000',
    email: 'care@royalsundaram.in',
    website: 'https://www.royalsundaram.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'Royal Sundaram Health Claims Cell',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Good Health Insurance TPA Ltd.',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
    ],
    tpaName: 'Medi Assist / Paramount / FHPL / Vidal Health / MDIndia TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Form NL-48 Public Disclosures)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Good Health Insurance TPA Ltd.',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
    ],
    settlementRatio: '97.4%',
    brandColor: '#8B0000',
    bgGradient: 'from-red-950 via-rose-950 to-slate-900',
    emblemText: 'ROYAL SUNDARAM',
    accentBorder: 'hover:border-rose-400',
  },
  {
    id: 'sbi-general',
    name: 'SBI General Insurance Company Limited',
    shortName: 'SBI General',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 102 1111',
    helplineDisplay: '1800-102-1111',
    email: 'customer.care@sbigeneral.in',
    website: 'https://www.sbigeneral.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'SBI General Health Claims Management Division',
    licensedTpas: [
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Medsave Health Insurance TPA Ltd. (CoR No. 019)',
      'Volo Health Insurance TPA Pvt. Ltd. (CoR No. 018)',
    ],
    tpaName: 'Paramount / Medi Assist / FHPL / Vidal Health / Raksha TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Form NL-48 Roster Disclosed by Underwriter)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Medsave Health Insurance TPA Ltd. (CoR No. 019)',
      'Volo Health Insurance TPA Pvt. Ltd. (CoR No. 018)',
    ],
    settlementRatio: '97.1%',
    brandColor: '#280071',
    bgGradient: 'from-indigo-950 via-purple-950 to-slate-900',
    emblemText: 'SBI GENERAL',
    accentBorder: 'hover:border-indigo-400',
  },
  {
    id: 'star-health',
    name: 'Star Health & Allied Insurance Co. Ltd.',
    shortName: 'Star Health',
    category: 'STANDALONE_HEALTH',
    categoryLabel: 'Standalone Health',
    helpline: '1800 425 2255',
    helplineDisplay: '1800-425-2255',
    email: 'support@starhealth.in',
    website: 'https://www.starhealth.in',
    claimsModel: 'IN_HOUSE_DIRECT',
    claimsModelLabel: '100% In-House Direct Settlement (No External TPA)',
    inHouseDesk: 'Star Health In-House Claims Department (Direct Adjudication & Pre-Auth)',
    licensedTpas: [],
    tpaName: 'In-House TPA: Star Health In-House Claims Department',
    tpaDesk: 'In-House Claims Department (100% Direct Underwriter Settlement)',
    tpaType: 'IN_HOUSE',
    tpaPartners: ['Star Health In-House Claims Department (Direct Adjudication)'],
    settlementRatio: '99.1%',
    brandColor: '#004B87',
    bgGradient: 'from-blue-900 to-sky-700',
    emblemText: '★ STAR',
    accentBorder: 'hover:border-blue-500',
  },
  {
    id: 'tata-aig',
    name: 'Tata AIG General Insurance Company Limited',
    shortName: 'TATA AIG',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 266 7780',
    helplineDisplay: '1800-266-7780',
    email: 'customersupport@tataaig.com',
    website: 'https://www.tataaig.com',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'Tata AIG Health Claims Central Oversight Division',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Genins India Insurance TPA Ltd.',
      'Good Health Insurance TPA Ltd.',
      'Volo Health Insurance TPA Pvt. Ltd. (East West Assist) (CoR No. 018)',
    ],
    tpaName: 'Medi Assist / MDIndia / Paramount / Vidal Health / FHPL TPA',
    tpaDesk: 'Empanelled IRDAI Third Party Administrators (Form NL-48 Roster)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Genins India Insurance TPA Ltd.',
      'Good Health Insurance TPA Ltd.',
      'Volo Health Insurance TPA Pvt. Ltd. (East West Assist) (CoR No. 018)',
    ],
    settlementRatio: '98.8%',
    brandColor: '#00539F',
    bgGradient: 'from-sky-900 via-blue-950 to-indigo-900',
    emblemText: 'TATA AIG',
    accentBorder: 'hover:border-sky-500',
  },
  {
    id: 'united-india',
    name: 'United India Insurance Company Limited (UIIC)',
    shortName: 'United India',
    category: 'PSU_GENERAL',
    categoryLabel: 'PSU Govt Underwriter',
    helpline: '1800 425 33333',
    helplineDisplay: '1800-425-33333',
    email: 'customercare@uiic.co.in',
    website: 'https://uiic.co.in',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'United India Head Office Health Insurance Department',
    licensedTpas: [
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Good Health Insurance TPA Ltd.',
      'Ericson Insurance TPA Pvt. Ltd. (CoR No. 035)',
    ],
    tpaName: 'MDIndia / Medi Assist / Paramount / Vidal Health / Heritage TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Public Sector Non-Life Disclosures)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Heritage Health Insurance TPA Pvt. Ltd. (CoR No. 008)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'Good Health Insurance TPA Ltd.',
      'Ericson Insurance TPA Pvt. Ltd. (CoR No. 035)',
    ],
    settlementRatio: '95.8%',
    brandColor: '#006699',
    bgGradient: 'from-sky-900 via-blue-900 to-slate-900',
    emblemText: 'UNITED INDIA',
    accentBorder: 'hover:border-sky-400',
  },
  {
    id: 'universal-sompo',
    name: 'Universal Sompo General Insurance Company Limited',
    shortName: 'Universal Sompo',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 22 4030',
    helplineDisplay: '1800-22-4030',
    email: 'contactus@universalsompo.com',
    website: 'https://www.universalsompo.com',
    claimsModel: 'HYBRID',
    claimsModelLabel: 'Hybrid: In-House Direct (Retail) + Empanelled TPAs (Corporate)',
    inHouseDesk: 'Universal Sompo In-House Health Claims Operations (Retail)',
    licensedTpas: [
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
    ],
    tpaName: 'In-House Claims Department (Retail) & FHPL / Medi Assist TPA',
    tpaDesk: 'In-House Retail Claims Desk & Empanelled Group TPAs',
    tpaType: 'HYBRID',
    tpaPartners: [
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
    ],
    settlementRatio: '96.4%',
    brandColor: '#1A365D',
    bgGradient: 'from-slate-900 via-blue-950 to-indigo-950',
    emblemText: 'UNIVERSAL SOMPO',
    accentBorder: 'hover:border-indigo-400',
  },
  {
    id: 'zurich-kotak',
    name: 'Zurich Kotak General Insurance Company Limited',
    shortName: 'Zurich Kotak',
    category: 'PRIVATE_GENERAL',
    categoryLabel: 'Private General',
    helpline: '1800 2120',
    helplineDisplay: '1800-2120',
    email: 'care@zurichkotak.com',
    website: 'https://www.zurichkotak.com',
    claimsModel: 'EMPANELLED_TPA',
    claimsModelLabel: 'Empanelled IRDAI-Licensed TPAs',
    inHouseDesk: 'Zurich Kotak Health Claims Department',
    licensedTpas: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
    ],
    tpaName: 'Medi Assist / Paramount / FHPL / Vidal Health / MDIndia TPA',
    tpaDesk: 'Empanelled IRDAI TPAs (Form NL-48 Public Report)',
    tpaType: 'EMPANELLED_TPA',
    tpaPartners: [
      'Medi Assist Insurance TPA Pvt. Ltd. (CoR No. 003)',
      'Paramount Health Services & Insurance TPA Pvt. Ltd. (CoR No. 006)',
      'Family Health Plan Insurance TPA Ltd. (FHPL) (CoR No. 013)',
      'Vidal Health Insurance TPA Pvt. Ltd. (CoR No. 016)',
      'Health India Insurance TPA Services Pvt. Ltd. (CoR No. 022)',
      'MDIndia Health Insurance TPA Pvt. Ltd. (CoR No. 005)',
      'Raksha Health Insurance TPA Pvt. Ltd. (CoR No. 015)',
    ],
    settlementRatio: '97.0%',
    brandColor: '#23366F',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    emblemText: 'ZURICH KOTAK',
    accentBorder: 'hover:border-blue-400',
  },
  {
    id: 'hospital-tpa-desk',
    name: 'All Other Insurers & Policies Contact Hospital',
    shortName: 'Hospital Contact & TPA Desk',
    category: 'HOSPITAL_DESK',
    categoryLabel: 'Hospital Cashless Bureau',
    helpline: '1800 890 4455',
    helplineDisplay: '1800-890-4455 (24/7 Hospital Desk)',
    email: 'tpa.cashless@svasthnexis.org',
    website: 'https://svasthnexis.org/hospital/tpa-desk',
    claimsModel: 'HOSPITAL_ASSISTANCE',
    claimsModelLabel: 'In-House Hospital Cashless Helpdesk & Universal TPA Facilitation',
    inHouseDesk: 'SvasthNexis Hospital Authority Dedicated TPA & Insurance Facilitation Cell (Ground Floor, Main Atrium)',
    licensedTpas: [
      'Assistance with 50+ IRDAI Licensed TPAs (MDIndia, Medi Assist, Vidal Health, FHPL, Paramount, Heritage, Raksha, etc.)',
      'International Patient Desk: Embassy Medical Attestation, Cigna, Bupa, Aetna, AXA, Allianz, IMG Guarantee of Payment (GOP)',
      'Corporate GMC & GPA Group Cashless Pre-Auth Adjudication & HR Escalation Assistance',
      'Reimbursement Claims File Compilation, Doctor Certification & Claim Form Attestation',
    ],
    tpaName: 'In-House Hospital TPA Assistance Cell & Universal Cashless Desk',
    tpaDesk: '24/7 Hospital Authority Central Insurance & TPA Helpdesk',
    tpaType: 'IN_HOUSE',
    tpaPartners: [
      'Assistance with 50+ IRDAI Licensed TPAs (MDIndia, Medi Assist, Vidal Health, FHPL, Paramount, Heritage, Raksha, etc.)',
      'International Patient Desk: Embassy Medical Attestation, Cigna, Bupa, Aetna, AXA, Allianz, IMG Guarantee of Payment (GOP)',
      'Corporate GMC & GPA Group Cashless Pre-Auth Adjudication & HR Escalation Assistance',
      'Reimbursement Claims File Compilation, Doctor Certification & Claim Form Attestation',
    ],
    settlementRatio: '100% Cashless Support',
    brandColor: '#0F766E',
    bgGradient: 'from-teal-950 via-emerald-950 to-slate-900',
    emblemText: 'HOSPITAL TPA',
    accentBorder: 'hover:border-teal-400',
  },

];

export const InsuranceLogoBadge: React.FC<{
  provider: InsuranceProvider;
  className?: string;
}> = ({ provider, className = 'h-12 w-28 sm:w-32' }) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const src = provider.logoUrl || INSURANCE_LOGO_SRC_MAP[provider.id];

  return (
    <div
      className={`${className} rounded-lg bg-white border border-soft-grey/90 shadow-2xs flex items-center justify-center p-1.5 shrink-0 group-hover:border-slate-300 group-hover:shadow-xs transition-all overflow-hidden relative`}
    >
      {!loadFailed && src ? (
        <img
          src={src}
          alt={`${provider.name} official logo`}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setLoadFailed(true)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-center font-extrabold text-[11px] uppercase tracking-wider rounded px-1"
          style={{
            backgroundColor: `${provider.brandColor}15`,
            color: provider.brandColor,
            border: `1px solid ${provider.brandColor}35`,
          }}
        >
          {provider.emblemText}
        </div>
      )}
    </div>
  );
};

export const EmpanelledInsuranceGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  // Pre-Auth Modal State
  const [selectedProviderForPreAuth, setSelectedProviderForPreAuth] = useState<InsuranceProvider | null>(null);
  const [preAuthPatientName, setPreAuthPatientName] = useState('Rahul Verma');
  const [preAuthPolicyNumber, setPreAuthPolicyNumber] = useState('POL-782190-IND');
  const [preAuthEstimatedAmount, setPreAuthEstimatedAmount] = useState('145000');
  const [preAuthDiagnosis, setPreAuthDiagnosis] = useState('Acute Inpatient Admission - Ward 3');
  const [isSubmittingPreAuth, setIsSubmittingPreAuth] = useState(false);
  const [preAuthSuccessMsg, setPreAuthSuccessMsg] = useState<string | null>(null);

  const filteredProviders = ALL_INSURANCE_PROVIDERS.filter((provider) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      provider.name.toLowerCase().includes(query) ||
      provider.shortName.toLowerCase().includes(query) ||
      provider.claimsModelLabel.toLowerCase().includes(query) ||
      provider.inHouseDesk.toLowerCase().includes(query) ||
      provider.licensedTpas.some((p) => p.toLowerCase().includes(query)) ||
      (provider.govAuthority && provider.govAuthority.toLowerCase().includes(query)) ||
      (provider.itPlatform && provider.itPlatform.toLowerCase().includes(query)) ||
      provider.tpaName.toLowerCase().includes(query) ||
      provider.tpaPartners.some((p) => p.toLowerCase().includes(query)) ||
      provider.email.toLowerCase().includes(query) ||
      provider.helpline.includes(searchQuery)
    );
  });

  const handleCopyHelpline = (id: string, num: string) => {
    sound.playClick();
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleCopyEmail = (id: string, email: string) => {
    sound.playClick();
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2200);
  };

  const handleOpenPreAuth = (ins: InsuranceProvider) => {
    sound.playChime();
    setSelectedProviderForPreAuth(ins);
    setPreAuthSuccessMsg(null);
  };

  const handlePreAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTelemetryBeep();
    setIsSubmittingPreAuth(true);

    setTimeout(() => {
      setIsSubmittingPreAuth(false);
      sound.playChime();
      setPreAuthSuccessMsg(
        `✓ Cashless Pre-Auth Claim #${Date.now().toString().slice(-6)} successfully dispatched to ${
          selectedProviderForPreAuth?.shortName
        } (${selectedProviderForPreAuth?.claimsModelLabel}). Estimated SLA: ~18 minutes.`
      );
      setTimeout(() => {
        setPreAuthSuccessMsg(null);
        setSelectedProviderForPreAuth(null);
      }, 4000);
    }, 1200);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-white via-warm-ivory/60 to-warm-light-grey/80 border border-soft-grey shadow-md overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-soft-grey">
        <div className="flex items-start sm:items-center gap-3.5 max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-deep via-navy to-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
            <Shield className="w-6 h-6 text-coral" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-navy tracking-tight">
                Empanelled Insurance Providers &amp; Cashless Claim Desks
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-soft text-emerald-800 border border-emerald-300">
                {ALL_INSURANCE_PROVIDERS.length} EMPANELLED NATIONWIDE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Verified cashless admission architecture: 100% In-House Direct Underwriters, IRDAI-Licensed TPAs, National Schemes &amp; Hospital Facilitation Cell.
            </p>
          </div>
        </div>

        {/* Global Executive Stats Bar: Utilizing Spacious Space */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          <div className="px-3.5 py-2.5 rounded-xl bg-white border border-soft-grey shadow-2xs text-left">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">IRDAI Carriers</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-navy">32 Underwriters</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-left">
            <span className="text-[10px] text-emerald-700 font-semibold block uppercase">Claims Turnaround</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-emerald-900">~ 18-30 Mins SLA</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-left">
            <span className="text-[10px] text-blue-700 font-semibold block uppercase">Pre-Auth Desk</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-blue-900">100% Cashless</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-left">
            <span className="text-[10px] text-amber-700 font-semibold block uppercase">Unlisted Policies</span>
            <span className="font-mono font-bold text-xs sm:text-sm text-amber-900">Hospital Direct</span>
          </div>
        </div>
      </div>

      {/* Directory Index & Live Search Bar (Without Category Filters) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-soft-grey shadow-2xs">
        {/* Left: Professional Directory Header & Counter */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-sm font-mono shadow-xs shrink-0">
            A–Z
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-navy">
                National Empanelled Underwriters Directory
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Alphabetical Index (A–Z)
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Directory
              </span>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">
              {searchQuery ? (
                <>Showing <strong>{filteredProviders.length}</strong> matching entries for &quot;{searchQuery}&quot;</>
              ) : (
                <>All 32 Underwriters + 1 Institutional Information Desk listed in official alphabetical sequence</>
              )}
            </span>
          </div>
        </div>

        {/* Right: Expansive Live Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search insurer, TPA, or policy name..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-warm-light-grey/60 border border-soft-grey text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy focus:bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy text-xs font-bold"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Insurance Cards */}
      {filteredProviders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-soft-grey text-center space-y-3">
          <p className="text-slate text-sm font-medium">No insurance provider matched &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-coral hover:underline"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredProviders.map((ins, idx) => {
            const isPhoneCopied = copiedId === ins.id;
            const isEmailCopied = copiedEmailId === ins.id;

            // Dedicated Institutional Information Bulletin for the last item: "All Other Insurers & Policies Contact Hospital"
            // Prominent notice design ensuring everyone instantly understands it is an INFORMATION NOTICE / DIRECT CONTACT HUB, NOT AN INSURER.
            // NO PHOTO, strictly contains the requested 4 contact coordinates.
            if (ins.id === 'hospital-tpa-desk') {
              const isHospPhoneCopied = copiedId === 'hosp-phone';
              const isHospEmailCopied = copiedEmailId === 'hosp-email';
              const isTpaPhoneCopied = copiedId === 'tpa-phone';
              const isTpaEmailCopied = copiedEmailId === 'tpa-email';

              return (
                <motion.div
                  key={ins.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="rounded-2xl bg-white border-2 border-amber-400/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group relative"
                >
                  {/* Top Institutional Information Notice Header Banner */}
                  <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white px-5 py-3.5 flex items-center justify-between border-b border-navy/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block leading-tight">
                          Official Information Notice
                        </span>
                        <span className="text-[10px] text-slate-300 block leading-tight">
                          Hospital Facilitation &amp; Cashless Desk
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/20">
                      INDEX #33
                    </span>
                  </div>

                  {/* Body Content: Spacious & Beautifully Balanced */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    {/* Title strictly as requested: "All Other Insurers & Policies Contact Hospital" */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          UNLISTED POLICIES &amp; INTERNATIONAL PATIENT DESK
                        </span>
                        <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          INFORMATION ONLY
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-navy leading-snug">
                        All Other Insurers &amp; Policies Contact Hospital
                      </h4>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                        <strong className="text-amber-950 font-semibold block mb-0.5">ℹ️ Patient Guidance:</strong>
                        If your insurance provider, corporate GMC card, or international health policy is not listed in the 32 empanelled providers above, our on-campus coordination cell facilitates direct cashless pre-authorization, doctor attestations, and claims submission.
                      </p>
                    </div>

                    {/* Hospital Facilitation Scope Grid: Utilises Space Luxuriously */}
                    <div className="p-3.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        <span>On-Campus TPA &amp; Insurance Cell Services</span>
                        <span className="text-[9px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          Universal Support
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-white border border-soft-grey/90 shadow-2xs space-y-0.5">
                          <span className="font-bold text-navy text-[11px] block">
                            🏢 50+ IRDAI Licensed TPAs
                          </span>
                          <span className="text-[10px] text-slate-500 leading-snug block">
                            Medi Assist, MDIndia, Vidal, FHPL, Paramount pre-auth
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-soft-grey/90 shadow-2xs space-y-0.5">
                          <span className="font-bold text-navy text-[11px] block">
                            🌐 International Patients
                          </span>
                          <span className="text-[10px] text-slate-500 leading-snug block">
                            Embassy clearances, GOP &amp; overseas travel policies
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-soft-grey/90 shadow-2xs space-y-0.5">
                          <span className="font-bold text-navy text-[11px] block">
                            💼 Corporate GMC &amp; GPA
                          </span>
                          <span className="text-[10px] text-slate-500 leading-snug block">
                            Group health cards, HR pre-auth &amp; corporate cashless
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-soft-grey/90 shadow-2xs space-y-0.5">
                          <span className="font-bold text-navy text-[11px] block">
                            📋 Reimbursement Docket
                          </span>
                          <span className="text-[10px] text-slate-500 leading-snug block">
                            Doctor certification, itemized bills &amp; discharge dossier
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Exactly the 4 Contact Items Styled as Numbered Information Tiles */}
                    <div className="space-y-2.5 text-xs">
                      {/* 1. Phone number of that particular hospital */}
                      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-navy/20">
                            01
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                1. Hospital Phone Number
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                                Direct Line
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <PhoneCall className="w-3.5 h-3.5 text-navy shrink-0" />
                              <a
                                href="tel:08049694969"
                                className="font-mono font-bold text-navy hover:underline text-xs truncate"
                              >
                                080-4969-4969 / 1800-108-0108
                              </a>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyHelpline('hosp-phone', '080-4969-4969')}
                          className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                            isHospPhoneCopied
                              ? 'bg-emerald-soft text-emerald-900 font-bold border border-emerald-300'
                              : 'text-slate-600 hover:text-navy hover:bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                          title="Copy hospital phone number"
                        >
                          {isHospPhoneCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 2. Email ID of that particular hospital */}
                      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                            02
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                2. Hospital Email ID
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100/60 text-blue-700">
                                Admin Desk
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <a
                                href="mailto:hospital@svasthnexis.org"
                                className="font-mono font-bold text-navy hover:underline text-xs truncate"
                              >
                                hospital@svasthnexis.org
                              </a>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail('hosp-email', 'hospital@svasthnexis.org')}
                          className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                            isHospEmailCopied
                              ? 'bg-emerald-soft text-emerald-900 font-bold border border-emerald-300'
                              : 'text-slate-600 hover:text-navy hover:bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                          title="Copy hospital email ID"
                        >
                          {isHospEmailCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 3. Hospital TPA Desk Phone Number */}
                      <div className="p-3 rounded-xl bg-coral-50/40 border border-coral-200/70 hover:bg-white hover:border-coral-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral-deep font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-coral/20">
                            03
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                3. Hospital TPA Desk Phone Number
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-coral-100 text-coral-deep font-semibold">
                                24/7 Desk
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <PhoneCall className="w-3.5 h-3.5 text-coral shrink-0" />
                              <a
                                href="tel:18008904455"
                                className="font-mono font-bold text-coral-deep hover:underline text-xs truncate"
                              >
                                1800-890-4455 (24/7 Desk)
                              </a>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyHelpline('tpa-phone', '1800-890-4455')}
                          className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                            isTpaPhoneCopied
                              ? 'bg-emerald-soft text-emerald-900 font-bold border border-emerald-300'
                              : 'text-slate-600 hover:text-navy hover:bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                          title="Copy hospital TPA phone number"
                        >
                          {isTpaPhoneCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 4. Hospital TPA Desk Email ID */}
                      <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/70 hover:bg-white hover:border-emerald-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                            04
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                                4. Hospital TPA Desk Email ID
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                Pre-Auth
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <a
                                href="mailto:tpa.cashless@svasthnexis.org"
                                className="font-mono font-bold text-emerald-900 hover:underline text-xs truncate"
                              >
                                tpa.cashless@svasthnexis.org
                              </a>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail('tpa-email', 'tpa.cashless@svasthnexis.org')}
                          className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                            isTpaEmailCopied
                              ? 'bg-emerald-soft text-emerald-900 font-bold border border-emerald-300'
                              : 'text-slate-600 hover:text-navy hover:bg-white border border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                          title="Copy hospital TPA email ID"
                        >
                          {isTpaEmailCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={ins.id}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`p-5 rounded-2xl bg-white border border-soft-grey shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${ins.accentBorder}`}
              >
                {/* Header: Authentic Corporate Logo Badge & Settlement Ratio */}
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-soft-grey/70">
                  <div className="flex items-center gap-2 min-w-0 shrink">
                    <span
                      className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs shrink-0"
                      title={`A–Z Directory Index #${String(idx + 1).padStart(2, '0')}`}
                    >
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <InsuranceLogoBadge provider={ins} />
                  </div>

                  {/* Status & Settlement Badges */}
                  <div className="flex flex-col items-end gap-1 shrink-0 text-right max-w-[140px]">
                    <span className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {ins.settlementRatio}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono truncate max-w-full" title={ins.categoryLabel}>
                      {ins.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Title & Desk Info */}
                <div className="min-w-0">
                  <h4
                    className="font-display font-extrabold text-sm sm:text-[15px] text-navy leading-snug group-hover:text-coral transition-colors"
                    title={ins.name}
                  >
                    {ins.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate mt-1 gap-2">
                    <span className="font-semibold text-slate-600 truncate">{ins.shortName}</span>
                    <span
                      className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold uppercase truncate max-w-[220px] border ${
                        ins.claimsModel === 'IN_HOUSE_DIRECT'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : ins.claimsModel === 'GOVT_SCHEME'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : ins.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                          ? 'bg-sky-50 text-sky-900 border-sky-200'
                          : ins.claimsModel === 'HOSPITAL_ASSISTANCE'
                          ? 'bg-teal-50 text-teal-900 border-teal-200'
                          : ins.claimsModel === 'HYBRID'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : 'bg-purple-50 text-purple-900 border-purple-200'
                      }`}
                      title={ins.claimsModelLabel}
                    >
                      {ins.claimsModel === 'IN_HOUSE_DIRECT'
                        ? '100% In-House Direct'
                        : ins.claimsModel === 'GOVT_SCHEME'
                        ? 'Govt Scheme'
                        : ins.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                        ? 'Global Assistance'
                        : ins.claimsModel === 'HOSPITAL_ASSISTANCE'
                        ? 'Hospital 24/7 Desk'
                        : ins.claimsModel === 'HYBRID'
                        ? 'Hybrid Model'
                        : 'Empanelled TPAs'}
                    </span>
                  </div>
                </div>

                {/* Verified Claims Model & Dedicated Desk Details */}
                <div className="p-3.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      <span>Claims Processing Model</span>
                      <span className="text-[9px] text-slate-400 font-normal">Architecture</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-soft-grey/90 shadow-2xs space-y-1">
                      <div>
                        <span className="text-[9.5px] text-slate-400 font-bold uppercase block tracking-wider">
                          {ins.claimsModel === 'IN_HOUSE_DIRECT'
                            ? 'Internal Medical Claims Department:'
                            : ins.claimsModel === 'GOVT_SCHEME'
                            ? 'Scheme Implementing Structure:'
                            : ins.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                            ? 'Global Medical Operations / Direct Billing Desk:'
                            : ins.claimsModel === 'HOSPITAL_ASSISTANCE'
                            ? 'Hospital Cashless & Insurance Coordination Desk:'
                            : 'In-House Medical Coordination / Desk:'}
                        </span>
                        <span className="font-extrabold text-navy text-[11px] leading-tight block mt-0.5" title={ins.inHouseDesk}>
                          {ins.inHouseDesk}
                        </span>
                      </div>

                      {ins.govAuthority && (
                        <div className="pt-1 border-t border-slate-100 flex items-start gap-1 text-[10px] text-slate-700">
                          <Landmark className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            <strong className="text-navy">Authority:</strong> {ins.govAuthority}
                          </span>
                        </div>
                      )}

                      {ins.itPlatform && (
                        <div className="flex items-start gap-1 text-[10px] text-slate-700">
                          <Server className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            <strong className="text-navy">IT Platform:</strong> {ins.itPlatform}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Officially Empanelled IRDAI TPAs List (Or Direct In-House Note) */}
                  {ins.licensedTpas.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        <span>
                          {ins.claimsModel === 'GOVT_SCHEME'
                            ? `Empanelled Implementation TPAs / ISAs (${ins.licensedTpas.length}):`
                            : ins.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                            ? `Global Assistance & TPA Networks (${ins.licensedTpas.length}):`
                            : ins.claimsModel === 'HOSPITAL_ASSISTANCE'
                            ? `Facilitated TPA & Underwriter Networks (${ins.licensedTpas.length}):`
                            : `Officially Empanelled IRDAI TPAs (${ins.licensedTpas.length}):`}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          {ins.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                            ? 'Global Network'
                            : ins.claimsModel === 'HOSPITAL_ASSISTANCE'
                            ? 'Universal Desk'
                            : 'IRDAI Licensed'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {ins.licensedTpas.map((tpa, pIdx) => (
                          <div
                            key={pIdx}
                            className="text-[10.5px] bg-white text-slate-800 px-2.5 py-1.5 rounded-md border border-soft-grey/90 font-medium flex items-start gap-1.5 shadow-2xs hover:border-slate-300 transition-colors"
                            title={tpa}
                          >
                            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span className="leading-snug break-words">{tpa}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Direct Underwriter Settlement</span>
                      </div>
                      <p className="text-[10px] text-emerald-900/90 leading-relaxed">
                        No Third-Party Administrator (TPA) involved. All cashless authorizations &amp; claims are processed 100% directly by {ins.shortName}&apos;s internal medical team.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-soft-grey/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-800">
                      Direct Cashless Pre-Auth Available
                    </span>
                  </div>
                </div>

                {/* Communication & Channels */}
                <div className="pt-2 border-t border-soft-grey space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-coral shrink-0" />
                      <span className="font-mono font-bold text-navy text-xs">{ins.helplineDisplay}</span>
                    </div>

                    <button
                      onClick={() => handleCopyHelpline(ins.id, ins.helpline)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                        isPhoneCopied
                          ? 'bg-emerald-soft text-emerald-900 font-bold'
                          : 'text-slate-500 hover:text-navy hover:bg-slate-100 border border-transparent hover:border-soft-grey'
                      }`}
                      title="Copy helpline number"
                    >
                      {isPhoneCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-600 text-[11px] truncate" title={ins.email}>
                        {ins.email}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyEmail(ins.id, ins.email)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all flex items-center gap-1 shrink-0 ${
                        isEmailCopied
                          ? 'bg-emerald-soft text-emerald-900 font-bold'
                          : 'text-slate-500 hover:text-navy hover:bg-slate-100 border border-transparent hover:border-soft-grey'
                      }`}
                      title="Copy official email ID"
                    >
                      {isEmailCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={ins.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.playClick()}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-soft-grey hover:border-slate-300 hover:bg-warm-light-grey text-navy text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <button
                    onClick={() => handleOpenPreAuth(ins)}
                    className="w-full py-2 px-3 rounded-xl bg-navy hover:bg-navy-light text-white text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pre-Auth</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Universal Coverage & Unlisted Insurers Contact Hospital Banner */}
      <div className="rounded-xl bg-gradient-to-r from-teal-950 via-slate-900 to-navy text-white p-4 sm:p-5 border border-teal-500/30 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Building2 className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                Don&apos;t See Your Insurance Provider Listed? Contact Hospital TPA Desk
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                50+ Additional Underwriters Supported
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              For unlisted private insurers, corporate group policies (GMC/GPA), embassy medical programs, or international travel/expat health plans, our in-house Hospital TPA Assistance Cell coordinates cashless pre-auth, Guarantee of Payment (GOP), and complete reimbursement claim documentation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full lg:w-auto">
          <a
            href="tel:18008904455"
            onClick={() => sound.playClick()}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>1800-890-4455</span>
          </a>

          <a
            href="mailto:tpa.cashless@svasthnexis.org"
            onClick={() => sound.playClick()}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-teal-300" />
            <span>Email TPA Desk</span>
          </a>

          <a
            href="tel:08049694969"
            onClick={() => sound.playClick()}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-coral hover:bg-coral-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span>Hospital: 080-4969-4969</span>
          </a>
        </div>
      </div>

      {/* Pre-Authorization Modal */}
      <AnimatePresence>
        {selectedProviderForPreAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-2xl bg-white border border-soft-grey shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-soft-grey">
                <div className="flex items-center gap-3">
                  <InsuranceLogoBadge provider={selectedProviderForPreAuth} />
                  <div>
                    <h4 className="font-display font-extrabold text-navy text-sm sm:text-base">
                      Cashless Pre-Authorization Request
                    </h4>
                    <span className="text-xs text-slate block">
                      Underwriter: {selectedProviderForPreAuth.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProviderForPreAuth(null)}
                  className="p-1.5 rounded-lg text-slate hover:text-navy hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {preAuthSuccessMsg ? (
                <div className="p-4 rounded-xl bg-emerald-soft border border-emerald-500/40 text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{preAuthSuccessMsg}</span>
                </div>
              ) : (
                <form onSubmit={handlePreAuthSubmit} className="space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-warm-light-grey/80 border border-soft-grey space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate font-bold uppercase block">Claims Processing Model</span>
                        <span className="font-extrabold text-navy text-xs block">{selectedProviderForPreAuth.claimsModelLabel}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate font-bold uppercase block">SLA Turnaround</span>
                        <span className="font-mono font-bold text-emerald-700">~ 18 Mins</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-soft-grey space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        {selectedProviderForPreAuth.claimsModel === 'IN_HOUSE_DIRECT'
                          ? 'Internal Medical Claims Department:'
                          : selectedProviderForPreAuth.claimsModel === 'GOVT_SCHEME'
                          ? 'Scheme Implementing Structure:'
                          : selectedProviderForPreAuth.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                          ? 'Global Medical Operations / Direct Billing Desk:'
                          : selectedProviderForPreAuth.claimsModel === 'HOSPITAL_ASSISTANCE'
                          ? 'Hospital Cashless & Insurance Coordination Desk:'
                          : 'Internal Claims Coordination / Desk:'}
                      </span>
                      <span className="text-xs font-extrabold text-navy block">
                        {selectedProviderForPreAuth.inHouseDesk}
                      </span>
                      {selectedProviderForPreAuth.govAuthority && (
                        <div className="text-[10.5px] text-slate-700 pt-1 border-t border-slate-100">
                          <strong className="text-navy">Authority:</strong> {selectedProviderForPreAuth.govAuthority}
                        </div>
                      )}
                      {selectedProviderForPreAuth.itPlatform && (
                        <div className="text-[10.5px] text-slate-700">
                          <strong className="text-navy">IT Platform:</strong> {selectedProviderForPreAuth.itPlatform}
                        </div>
                      )}
                    </div>

                    {/* Empanelled TPA Breakdown or In-House Confirmation */}
                    {selectedProviderForPreAuth.licensedTpas.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-600 font-bold block">
                            {selectedProviderForPreAuth.claimsModel === 'GOVT_SCHEME'
                              ? `Empanelled Implementation TPAs / ISAs (${selectedProviderForPreAuth.licensedTpas.length}):`
                              : selectedProviderForPreAuth.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                              ? `Global Assistance & TPA Networks (${selectedProviderForPreAuth.licensedTpas.length}):`
                              : selectedProviderForPreAuth.claimsModel === 'HOSPITAL_ASSISTANCE'
                              ? `Facilitated TPA & Underwriter Networks (${selectedProviderForPreAuth.licensedTpas.length}):`
                              : `Officially Empanelled IRDAI TPAs (${selectedProviderForPreAuth.licensedTpas.length}):`}
                          </span>
                          <span className="text-[9px] font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            {selectedProviderForPreAuth.claimsModel === 'INTERNATIONAL_ASSISTANCE'
                              ? 'Global Network'
                              : selectedProviderForPreAuth.claimsModel === 'HOSPITAL_ASSISTANCE'
                              ? 'Universal Cell'
                              : 'IRDAI Licensed'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                          {selectedProviderForPreAuth.licensedTpas.map((tpa, idx) => (
                            <div key={idx} className="text-[11px] bg-white px-2.5 py-1.5 rounded border border-soft-grey text-slate-800 font-medium flex items-start gap-1.5 shadow-2xs">
                              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                              <span className="leading-snug break-words">{tpa}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                        <span className="font-bold block text-xs text-emerald-800">Direct Insurer Pre-Authorization</span>
                        <p className="text-[11px] text-emerald-900/90 mt-0.5">
                          This request will route directly to {selectedProviderForPreAuth.shortName}&apos;s in-house medical officers. No external TPA is used.
                        </p>
                      </div>
                    )}

                    {/* Official Contact Channels */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-soft-grey/80 text-[11px]">
                      <div className="flex items-center gap-1.5 font-mono text-navy font-bold">
                        <PhoneCall className="w-3.5 h-3.5 text-coral shrink-0" />
                        <span>{selectedProviderForPreAuth.helplineDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 truncate justify-end">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{selectedProviderForPreAuth.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-navy mb-1">Patient Full Name</label>
                      <input
                        type="text"
                        value={preAuthPatientName}
                        onChange={(e) => setPreAuthPatientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-warm-light-grey/60 border border-soft-grey text-navy focus:outline-none focus:ring-1 focus:ring-navy"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-navy mb-1">Health Policy Number</label>
                        <input
                          type="text"
                          value={preAuthPolicyNumber}
                          onChange={(e) => setPreAuthPolicyNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-warm-light-grey/60 border border-soft-grey text-navy font-mono text-xs focus:outline-none focus:ring-1 focus:ring-navy"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-navy mb-1">Estimated Tariff (INR)</label>
                        <input
                          type="text"
                          value={preAuthEstimatedAmount}
                          onChange={(e) => setPreAuthEstimatedAmount(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-warm-light-grey/60 border border-soft-grey text-navy font-mono text-xs focus:outline-none focus:ring-1 focus:ring-navy"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-navy mb-1">Admission Diagnosis &amp; Procedure</label>
                      <input
                        type="text"
                        value={preAuthDiagnosis}
                        onChange={(e) => setPreAuthDiagnosis(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-warm-light-grey/60 border border-soft-grey text-navy focus:outline-none focus:ring-1 focus:ring-navy"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-soft-grey">
                    <button
                      type="button"
                      onClick={() => setSelectedProviderForPreAuth(null)}
                      className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-100 font-bold transition-all text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPreAuth}
                      className="px-4 py-2 rounded-lg bg-coral hover:bg-coral-deep text-white font-bold transition-all flex items-center gap-1.5 shadow-md text-xs disabled:opacity-60"
                    >
                      {isSubmittingPreAuth ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Routing Pre-Auth...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Cashless Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
