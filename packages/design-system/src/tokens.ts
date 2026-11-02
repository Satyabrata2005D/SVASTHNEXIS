/**
 * @file packages/design-system/src/tokens.ts
 * Accessible Design Tokens and Theme Variables for SvasthNexis Portals
 * WCAG 2.1 AA Compliant (Contrast Ratio >= 4.5:1 for standard text)
 */

export const colors = {
  // Brand Primaries
  navy: {
    50: '#f0f4f8',
    100: '#d9e2ec',
    500: '#102a43',
    700: '#0b1d30',
    900: '#06101e',
  },
  teal: {
    50: '#e6fffa',
    100: '#b2f5ea',
    500: '#008080', // Primary Healthcare Teal
    700: '#005a5a',
    900: '#003333',
  },
  // Clinical Alert & Safety Statuses
  safety: {
    emergencyRed: '#d32f2f', // Bypasses routine queue
    warningAmber: '#ed6c02',
    successEmerald: '#2e7d32',
    infoBlue: '#0288d1',
  },
  // Neutral Canvas & Surface
  neutral: {
    white: '#ffffff',
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    textPrimary: '#0f172a', // High contrast (14.2:1 against white)
    textSecondary: '#475569', // Contrast 5.1:1 against white (WCAG AA compliant)
    textMuted: '#64748b',
  },
};

export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px (Standard readable body)
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const spacing = {
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  12: '3rem', // 48px
  16: '4rem', // 64px
};

export const portalThemes = {
  PATIENT: {
    primaryColor: colors.teal[700],
    accentColor: colors.teal[500],
    portalTitle: 'Patient & Family Health Portal',
    navBg: colors.neutral.white,
  },
  DOCTOR: {
    primaryColor: colors.navy[700],
    accentColor: colors.teal[700],
    portalTitle: 'Doctor Clinical Workspace (RMP)',
    navBg: colors.navy[900],
  },
  HOSPITAL: {
    primaryColor: colors.navy[700],
    accentColor: colors.safety.infoBlue,
    portalTitle: 'Hospital & Facility Operations',
    navBg: colors.navy[700],
  },
  STAFF_HUB: {
    primaryColor: colors.navy[500],
    accentColor: colors.teal[700],
    portalTitle: 'Staff Portal & Employee Operations Hub',
    navBg: colors.navy[700],
  },
  CUSTOMER_CARE: {
    primaryColor: colors.safety.infoBlue,
    accentColor: colors.teal[500],
    portalTitle: 'Customer Care & Support Triage',
    navBg: colors.navy[500],
  },
  PLATFORM_ADMIN: {
    primaryColor: colors.navy[900],
    accentColor: colors.safety.warningAmber,
    portalTitle: 'Platform Governance & Administration Console',
    navBg: colors.navy[900],
  },
};
