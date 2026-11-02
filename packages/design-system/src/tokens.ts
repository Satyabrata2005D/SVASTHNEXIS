/**
 * @file packages/design-system/src/tokens.ts
 * SVASTHNEXIS visual system: Warm Ivory + Coral + Midnight Navy.
 * Status colours are semantic and deliberately separate from the brand accent.
 */

export const colors = {
  brand: {
    coral: '#FF5B47',
    coralDeep: '#C94132', // Accessible primary action with white text.
    coralSoft: '#FCEAE7',
    warmIvory: '#F8F7F3',
    white: '#FFFFFF',
    warmLightGrey: '#F1F0EC',
    softGreyBorder: '#E7E5E0',
    midnightNavy: '#171C2C',
    slateGrey: '#6B7280',
    emeraldGreen: '#10B981',
    goldenAmber: '#FBC024',
    mutedBlueGrey: '#93A2B9',
    paleMint: '#EAF8F1',
  },
  heroGradient: {
    left: '#F9EBE8',
    center: '#F4EEF0',
    right: '#EEF0F4',
    css: 'linear-gradient(110deg, #F9EBE8 0%, #F4EEF0 52%, #EEF0F4 100%)',
  },
  // Compatibility aliases for modules that still import the original token names.
  navy: {
    50: '#F0F2F6',
    100: '#DCE1E9',
    500: '#171C2C',
    700: '#252B3B',
    900: '#111522',
  },
  teal: {
    50: '#FCEAE7',
    100: '#F9D8D2',
    500: '#FF5B47',
    700: '#C94132',
    900: '#963B31',
  },
  safety: {
    emergencyRed: '#C94132',
    warningAmber: '#765000',
    successEmerald: '#087B56',
    infoBlue: '#64748B',
  },
  neutral: {
    white: '#FFFFFF',
    background: '#F8F7F3',
    surface: '#FFFFFF',
    border: '#E7E5E0',
    textPrimary: '#171C2C',
    textSecondary: '#6B7280',
    textMuted: '#6B7280',
    warmLightGrey: '#F1F0EC',
  },
};

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
};

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
};

export const portalThemes = {
  PATIENT: {
    primaryColor: colors.brand.coralDeep,
    accentColor: colors.brand.coral,
    portalTitle: 'Patient & Family Health Portal',
    navBg: colors.neutral.white,
  },
  DOCTOR: {
    primaryColor: colors.brand.midnightNavy,
    accentColor: colors.brand.coralDeep,
    portalTitle: 'Doctor Clinical Workspace (RMP)',
    navBg: colors.neutral.white,
  },
  HOSPITAL: {
    primaryColor: colors.brand.midnightNavy,
    accentColor: colors.brand.coral,
    portalTitle: 'Hospital & Facility Operations',
    navBg: colors.neutral.white,
  },
  STAFF_HUB: {
    primaryColor: colors.brand.midnightNavy,
    accentColor: colors.brand.coralDeep,
    portalTitle: 'Staff Portal & Employee Operations Hub',
    navBg: colors.neutral.white,
  },
  CUSTOMER_CARE: {
    primaryColor: colors.brand.midnightNavy,
    accentColor: colors.safety.infoBlue,
    portalTitle: 'Customer Care & Support Triage',
    navBg: colors.neutral.white,
  },
  PLATFORM_ADMIN: {
    primaryColor: colors.brand.midnightNavy,
    accentColor: colors.brand.goldenAmber,
    portalTitle: 'Platform Governance & Administration Console',
    navBg: colors.neutral.white,
  },
} as const;

export const designTokens = {
  color: colors,
  typography,
  spacing,
  radius: { sm: '12px', md: '18px', lg: '21px' },
  shadow: {
    card: '0 4px 14px rgba(23, 28, 44, .035)',
    elevated: '0 14px 38px rgba(23, 28, 44, .055)',
  },
};
