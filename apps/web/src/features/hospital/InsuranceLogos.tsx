import React from 'react';

export interface LogoProps {
  className?: string;
  alt?: string;
}

/**
 * Authentic Corporate Logo Asset URLs for all 28 Empanelled Insurance Providers.
 * Sourced directly from official company brand assets and CDNs.
 */
export const INSURANCE_LOGO_SRC_MAP: Record<string, string> = {
  'star-health': '/insurance-logos/star-health.png',
  'tata-aig': '/insurance-logos/tata-aig.png',
  'manipal-cigna': '/insurance-logos/manipal-cigna.png',
  'niva-bupa': '/insurance-logos/niva-bupa.jpg',
  'bajaj-allianz': '/insurance-logos/bajaj-allianz.jpg',
  'aditya-birla': '/insurance-logos/aditya-birla.png',
  'galaxy-health': '/insurance-logos/galaxy-health.png',
  'narayana-health': '/insurance-logos/narayana-health.svg',
  'national-insurance': '/insurance-logos/national-insurance.png',
  'united-india': '/insurance-logos/united-india.jpg',
  'sbi-general': '/insurance-logos/sbi-general.jpg',
  'royal-sundaram': '/insurance-logos/royal-sundaram.jpg',
  'iffco-tokio': '/insurance-logos/iffco-tokio.jpg',
  'zurich-kotak': '/insurance-logos/zurich-kotak.png',
  'oriental-insurance': '/insurance-logos/oriental-insurance.jpg',
  'new-india-assurance': '/insurance-logos/new-india-assurance.jpg',
  'prudential-hcl': '/insurance-logos/prudential-hcl.jpg',
  'universal-sompo': '/insurance-logos/universal-sompo.jpg',
  'future-generali': '/insurance-logos/future-generali.jpg',
  'cholamandalam-ms': '/insurance-logos/cholamandalam-ms.jpg',
  'acko': '/insurance-logos/acko.svg',
  'digit': '/insurance-logos/go-digit.png',
  'go-digit': '/insurance-logos/go-digit.png',
  'reliance-general': '/insurance-logos/reliance-general.jpg',
  'hdfc-ergo': '/insurance-logos/hdfc-ergo.jpg',
  'icici-lombard': '/insurance-logos/icici-lombard.png',
  'care-health': '/insurance-logos/care-health.png',
  'ayushman-bharat': '/insurance-logos/pm-jay.png',
  'pm-jay': '/insurance-logos/pm-jay.png',
  'cghs-echs': '/insurance-logos/cghs-echs.png',
  'cigna-global': '/insurance-logos/cigna-global.png',
  'img-global': '/insurance-logos/img-global.svg',
  'allianz-care-international': '/insurance-logos/allianz-care-international.svg',
  'allianz-care': '/insurance-logos/allianz-care.svg',
  'hospital-tpa-desk': '/insurance-logos/hospital-tpa-desk.svg',
};

// 1. Star Health & Allied Insurance
export const StarHealthLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Star Health & Allied Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['star-health']} alt={alt} className={className} loading="lazy" />
);

// 2. Tata AIG General Insurance
export const TataAigLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Tata AIG General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['tata-aig']} alt={alt} className={className} loading="lazy" />
);

// 3. ManipalCigna Health Insurance
export const ManipalCignaLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'ManipalCigna Health Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['manipal-cigna']} alt={alt} className={className} loading="lazy" />
);

// 4. Niva Bupa Health Insurance
export const NivaBupaLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Niva Bupa Health Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['niva-bupa']} alt={alt} className={className} loading="lazy" />
);

// 5. Bajaj Allianz General Insurance
export const BajajAllianzLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Bajaj Allianz General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['bajaj-allianz']} alt={alt} className={className} loading="lazy" />
);

// 6. Aditya Birla Health Insurance
export const AdityaBirlaLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Aditya Birla Health Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['aditya-birla']} alt={alt} className={className} loading="lazy" />
);

// 7. Galaxy Health and Allied Insurance
export const GalaxyHealthLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Galaxy Health and Allied Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['galaxy-health']} alt={alt} className={className} loading="lazy" />
);

// 8. Narayana Health Insurance
export const NarayanaHealthLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Narayana Health Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['narayana-health']} alt={alt} className={className} loading="lazy" />
);

// 9. National Insurance Company Limited (NICL) - Authentic Official Swan & Teal Emblem
export const NationalInsuranceLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'National Insurance Company Limited' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['national-insurance']} alt={alt} className={className} loading="lazy" />
);

// 10. United India Insurance Company (UIIC)
export const UnitedIndiaLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'United India Insurance Company' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['united-india']} alt={alt} className={className} loading="lazy" />
);

// 11. SBI General Insurance
export const SbiGeneralLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'SBI General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['sbi-general']} alt={alt} className={className} loading="lazy" />
);

// 12. Royal Sundaram General Insurance
export const RoyalSundaramLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Royal Sundaram General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['royal-sundaram']} alt={alt} className={className} loading="lazy" />
);

// 13. IFFCO Tokio General Insurance
export const IffcoTokioLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'IFFCO Tokio General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['iffco-tokio']} alt={alt} className={className} loading="lazy" />
);

// 14. Zurich Kotak General Insurance
export const ZurichKotakLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Zurich Kotak General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['zurich-kotak']} alt={alt} className={className} loading="lazy" />
);

// 15. The Oriental Insurance Company Limited
export const OrientalInsuranceLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'The Oriental Insurance Company' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['oriental-insurance']} alt={alt} className={className} loading="lazy" />
);

// 16. The New India Assurance Company Limited
export const NewIndiaAssuranceLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'The New India Assurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['new-india-assurance']} alt={alt} className={className} loading="lazy" />
);

// 17. Prudential HCL / ICICI Prudential
export const PrudentialHclLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Prudential HCL / ICICI Prudential' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['prudential-hcl']} alt={alt} className={className} loading="lazy" />
);

// 18. Universal Sompo General Insurance
export const UniversalSompoLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Universal Sompo General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['universal-sompo']} alt={alt} className={className} loading="lazy" />
);

// 19. Future Generali India Insurance
export const FutureGeneraliLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Future Generali India Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['future-generali']} alt={alt} className={className} loading="lazy" />
);

// 20. Cholamandalam MS General Insurance (Chola MS)
export const CholamandalamMsLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Cholamandalam MS General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['cholamandalam-ms']} alt={alt} className={className} loading="lazy" />
);

// 21. Acko General Insurance
export const AckoLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Acko General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['acko']} alt={alt} className={className} loading="lazy" />
);

// 22. Go Digit General Insurance
export const DigitLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Go Digit General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['digit']} alt={alt} className={className} loading="lazy" />
);

// 23. Reliance General Insurance
export const RelianceGeneralLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Reliance General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['reliance-general']} alt={alt} className={className} loading="lazy" />
);

// 24. HDFC ERGO General Insurance
export const HdfcErgoLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'HDFC ERGO General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['hdfc-ergo']} alt={alt} className={className} loading="lazy" />
);

// 25. ICICI Lombard General Insurance
export const IciciLombardLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'ICICI Lombard General Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['icici-lombard']} alt={alt} className={className} loading="lazy" />
);

// 26. Care Health Insurance
export const CareHealthLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Care Health Insurance' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['care-health']} alt={alt} className={className} loading="lazy" />
);

// 27. Ayushman Bharat PM-JAY
export const AyushmanBharatLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Ayushman Bharat PM-JAY' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['ayushman-bharat']} alt={alt} className={className} loading="lazy" />
);

// 28. Central Government Health Scheme (CGHS & ECHS)
export const CghsEchsLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Central Government Health Scheme (CGHS & ECHS)' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['cghs-echs']} alt={alt} className={className} loading="lazy" />
);

// 29. Cigna Global Health Options
export const CignaGlobalLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Cigna Global Health Options' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['cigna-global']} alt={alt} className={className} loading="lazy" />
);

// 30. IMG Global Medical Insurance (International Medical Group)
export const ImgGlobalLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'International Medical Group (IMG Global)' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['img-global']} alt={alt} className={className} loading="lazy" />
);

// 31. Allianz Care International
export const AllianzCareIntlLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Allianz Care International' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['allianz-care-international']} alt={alt} className={className} loading="lazy" />
);

// 32. Allianz Care (Allianz Partners)
export const AllianzCareLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Allianz Care' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['allianz-care']} alt={alt} className={className} loading="lazy" />
);

// 33. Hospital Cashless & Universal TPA Helpdesk
export const HospitalTpaDeskLogo: React.FC<LogoProps> = ({ className = 'w-full h-full object-contain', alt = 'Hospital Cashless & Universal TPA Helpdesk' }) => (
  <img src={INSURANCE_LOGO_SRC_MAP['hospital-tpa-desk']} alt={alt} className={className} loading="lazy" />
);

/**
 * Complete Master Map associating all Provider IDs to their authentic logo components.
 */
export const INSURANCE_LOGO_MAP: Record<string, React.FC<LogoProps>> = {
  'star-health': StarHealthLogo,
  'tata-aig': TataAigLogo,
  'manipal-cigna': ManipalCignaLogo,
  'niva-bupa': NivaBupaLogo,
  'bajaj-allianz': BajajAllianzLogo,
  'aditya-birla': AdityaBirlaLogo,
  'galaxy-health': GalaxyHealthLogo,
  'narayana-health': NarayanaHealthLogo,
  'national-insurance': NationalInsuranceLogo,
  'united-india': UnitedIndiaLogo,
  'sbi-general': SbiGeneralLogo,
  'royal-sundaram': RoyalSundaramLogo,
  'iffco-tokio': IffcoTokioLogo,
  'zurich-kotak': ZurichKotakLogo,
  'oriental-insurance': OrientalInsuranceLogo,
  'new-india-assurance': NewIndiaAssuranceLogo,
  'prudential-hcl': PrudentialHclLogo,
  'universal-sompo': UniversalSompoLogo,
  'future-generali': FutureGeneraliLogo,
  'cholamandalam-ms': CholamandalamMsLogo,
  'acko': AckoLogo,
  'digit': DigitLogo,
  'go-digit': DigitLogo,
  'reliance-general': RelianceGeneralLogo,
  'hdfc-ergo': HdfcErgoLogo,
  'icici-lombard': IciciLombardLogo,
  'care-health': CareHealthLogo,
  'ayushman-bharat': AyushmanBharatLogo,
  'pm-jay': AyushmanBharatLogo,
  'cghs-echs': CghsEchsLogo,
  'cigna-global': CignaGlobalLogo,
  'img-global': ImgGlobalLogo,
  'allianz-care-international': AllianzCareIntlLogo,
  'allianz-care': AllianzCareLogo,
  'hospital-tpa-desk': HospitalTpaDeskLogo,
};
