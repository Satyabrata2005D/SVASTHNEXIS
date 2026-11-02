# ADR-011: SvasthNexis Brand Color System (Warm Ivory + Coral + Midnight Navy)

## Status
Accepted (Mandatory Design & Visual Standard for All Ecosystem Interfaces)

## Context
Standard healthcare applications often suffer from sterile, unapproachable blue/teal themes or overly bright reds that evoke panic. The SvasthNexis visual identity requires a warm, calm, premium fintech/healthcare aesthetic that balances approachable human care with clinical clarity and strict WCAG accessibility.

## Decision
All current and future user interfaces across all six workspaces (Patient, Doctor, Hospital, Staff Hub, Customer Care, Platform Admin) must strictly adhere to the **Warm Ivory + Coral Red + Midnight Navy** color combination and proportional distribution specified below:

### 1. Visual Color Distribution Proportions
1. **Warm Ivory (`#F8F7F3`) — 55%:**
   - The primary background canvas for all main shells, views, and frames. Keeps the overall cognitive load calm and non-distracting.
2. **Clean White (`#FFFFFF`) — 25%:**
   - Primary surface for cards, navigation bars, dropdowns, modal windows, and data tables.
3. **Midnight Navy (`#171C2C`) — 10%:**
   - Primary text, prominent page headings (`h1`, `h2`), and deep command elements. Provides sharp contrast against white and ivory.
4. **Coral Red (`#FF5B47` / `#C94132`) — 6%:**
   - Brand accent and primary actions.
   - **Bright Coral (`#FF5B47`):** Active sidebar navigation indicators, accent highlights, and important decision callouts.
   - **Deep Accessible Coral (`#C94132`):** Primary action buttons with small white text to guarantee WCAG 2.1 AA compliant contrast (> 4.5:1).
   - **Soft Coral (`#FCEAE7` / `#FFF0ED`):** Active item background fills and badge surfaces.
5. **Emerald Green (`#10B981` / `#087B56`) — 2%:**
   - Semantic indicator for verified statuses, confirmed bookings, and positive health/financial metrics. Uses `#087B56` text over `#EAF8F1` pale mint backgrounds.
6. **Golden Amber (`#FBC024` / `#765000`) — 2%:**
   - Semantic indicator for pending reviews, attention states, and expiring slot holds. Uses `#765000` text over `#FFF5D6` pale amber backgrounds.

### 2. Hero Section Soft Gradient
The signature landing and workspace hero sections feature the three-stop soft gradient:
- **Left (0%):** Blush Peach (`#F9EBE8`)
- **Center (52%):** Pale Pink-Grey (`#F4EEF0`)
- **Right (100%):** Cool Ivory-Blue (`#EEF0F4`)
- **CSS:** `linear-gradient(110deg, #F9EBE8 0%, #F4EEF0 52%, #EEF0F4 100%)`

### 3. Implementation Rules for Future Features
- **No decorative random colors:** Green and amber must only be used for meaningful semantic states.
- **Never revert to generic blue/teal themes:** Any new page, component, modal, or widget in `packages/design-system`, `apps/api/src/public`, or subsequent micro-frontends must import tokens from `@svasthnexis/design-system` and use these CSS variables.

## Consequences
- Clean, cohesive, identifiable visual brand.
- High accessibility rating and predictable contrast ratios across light and dark elements.

