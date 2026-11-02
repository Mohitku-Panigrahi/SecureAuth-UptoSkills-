---
name: SecureAuth
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#00a9c5'
  on-tertiary-container: '#003842'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system reconciles two distinct design paradigms: the approachable warmth of user-onboarding storytelling with the crystalline precision of an enterprise-grade dark SaaS security console. Security software frequently falters into sterile cynicism or clinical hostility; this system counters that by anchoring high-assurance account security within an empathetic, welcoming human envelope.

The visual style blends **Technical Glassmorphism** with **Warm Humanist Precision**. The backdrop provides deep spatial stability using midnight navy tones, while foreground interactive surfaces feature frosted glass stratification, calibrated ambient lighting (indigo, cyan, and vibrant coral), and crisp borders. Tactile feedback is clear, confident, and frictionless, transforming anxiety-inducing security checkpoints (MFA validation, passkey enrollment, session revocations) into satisfying, low-friction interactions.

## Colors

The palette operates on a calibrated dynamic balance between deep nocturnal anchors and warm energy accents:

- **Midnight Canvas & Surfaces**: The base substrate is `#0b0f19`, scaling upward through surface elevation tiers: Canvas Base (`#0b0f19`), Surface Layer 1 (`#111827`), Surface Layer 2 (`#0f172a`), and Elevated Card Glass (`#1e293b` at 70% opacity with backdrop blur).
- **Core Energetic Accent (Coral / Warmth)**: Rooted in `#f97316`, shifting to `#ea580c` for pressed states and `#fb923c` for subtle glows and hover overlays. Warm peach tints (`#fff7ed`, `#ffedd5`) are reserved for soft alert fills, authentication highlight tags, and onboarding mascot companion motifs.
- **Precision Tech Accents**: Electric Indigo (`#6366f1` / `#8b5cf6`) provides systematic depth for ambient lighting and cryptographic keys. Cyan (`#06b6d4` / `#38bdf8`) handles biometric data visualizers, passkey telemetry, and active focus boundaries.
- **Semantic Integrity**:
  - Positive / Verified: Emerald (`#10b981`)
  - Warning / MFA Latency: Amber (`#f59e0b`)
  - Destructive / Breach Risk: Rose Red (`#ef4444`)
- **Borders & Overlays**: All card dividers and structural contours utilize low-intensity white alpha channels (`rgba(255, 255, 255, 0.08)`) with dynamic hover increases to `rgba(255, 255, 255, 0.16)`.

## Typography

Typography establishes tension between the approachable geometry of **Plus Jakarta Sans** and the neutral utility of **Inter**. 

Headlines utilize tight tracking (`-0.02em` to `-0.03em`) and substantial weight to ground views with authority and warmth. Body copy relies on Inter for rapid legibility in complex density setups such as audit trails, access logs, and permissions trees. Monospace metrics (session hashes, recovery keys, IP addresses, JWT tokens) are rendered exclusively in **JetBrains Mono** with distinct contrast against card backgrounds.

## Layout & Spacing

The layout is built upon an 8-point base spatial grid mapped across an adaptive 12-column layout model:

- **Desktop (1200px+)**: 12 columns, 24px gutters (`gutter`), 32px external boundary margins (`margin`), with optional persistent collapsible security telemetry sidebars (280px fixed width).
- **Tablet (768px – 1199px)**: 8 columns, 20px gutters, 24px external canvas margins. Secondary modules reflow beneath primary profile configuration forms.
- **Mobile (< 768px)**: 4 columns, 16px gutters, 16px margins. Single-column card stacking is enforced. Critical actions dock persistently to the bottom edge above navigation bars.

Internal component rhythm follows strict nesting hierarchies: form input internals utilize `space-sm` vertical by `space-md` horizontal paddings; container cards use `space-lg` padding on desktop and `space-md` on mobile viewports.

## Elevation & Depth

Depth in this system is conveyed through luminosity, frosted transparency, and colored ambient back-glow rather than standard murky drop-shadows.

1. **Backdrop Base (L0)**: `#0b0f19` solid canvas with two slow radial ambient gradients fixed in the background (Upper-left: 20% opacity indigo `#6366f1` blur 140px; Bottom-right: 15% opacity coral `#f97316` blur 160px).
2. **Standard Containers (L1)**: `rgba(30, 41, 59, 0.70)` surface with `backdrop-filter: blur(16px)`, delineated by a hairline edge `border: 1px solid rgba(255, 255, 255, 0.08)`.
3. **Elevated Overlays & Modals (L2)**: `rgba(15, 23, 42, 0.85)` surface with `backdrop-filter: blur(24px)`, delineated by `border: 1px solid rgba(255, 255, 255, 0.14)` and an ambient shadow `0 20px 40px -15px rgba(0, 0, 0, 0.6)`.
4. **Interactive Focus Glows**: Active inputs, selected passkeys, and verified token chips cast a dual-layer illumination ring: `0 0 0 2px #0b0f19, 0 0 0 4px rgba(6, 182, 212, 0.45)`.

## Shapes

The interface embraces a fluid, softened structural cadence. Container cards and security modules leverage deliberate `16px` to `24px` radius structures (`rounded-2xl`), softening technical rigor into a welcoming modern environment. 

Buttons, OTP inputs, and text fields use `10px` to `12px` roundedness to maintain clean cursor alignment. Status chips, verification tags, and security score badges utilize full pill geometry (`9999px`) to immediately differentiate contextual statuses from clickable card assets.

## Components

### Buttons
- **Primary Action (Brand Warmth)**: Solid Coral Orange (`#f97316`), contrasting white text (`#ffffff`), font weight 600. On hover, subtly brightens to `#fb923c` with ambient glow `0 8px 20px -4px rgba(249, 115, 22, 0.45)`.
- **Secondary Action (Tech Precise)**: Translucent indigo tint (`rgba(99, 102, 241, 0.12)`), text color `#818cf8`, border `1px solid rgba(99, 102, 241, 0.3)`. Hover transitions border to Cyan (`#06b6d4`) and text to `#ffffff`.
- **Ghost / Neutral**: Fully transparent surface, border `1px solid rgba(255, 255, 255, 0.08)`, text `#94a3b8`. Hover transitions to background `rgba(255, 255, 255, 0.05)` and text `#f8fafc`.

### Inputs & Verification Fields
- **Text Inputs**: Height 44px, background `rgba(15, 23, 42, 0.6)`, border `1px solid rgba(255, 255, 255, 0.1)`. Placeholder text in `#64748b`. Focused state transitions border to `#06b6d4` with an outer cyan ambient aura.
- **MFA / OTP Digit Blocks**: Square 52x52px inputs, font family `JetBrains Mono`, size 22px bold, text `#f8fafc`. Filled slots display a subtle active coral bottom accent bar (2px height).

### Cards & Panels
- Constructed using `rgba(30, 41, 59, 0.7)` with `backdrop-filter: blur(16px)` and radius `16px`. Dividers inside cards are strictly `1px solid rgba(255, 255, 255, 0.06)`. Header actions align right with accompanying subtle Lucide icons sized to 18px.

### Badges & Status Chips
- Pill geometry with padding `4px 10px`, font size `11px`, font weight 600, uppercase letter-spacing 0.04em.
- **Verified State**: Surface `rgba(16, 185, 129, 0.12)`, border `rgba(16, 185, 129, 0.25)`, text `#34d399`. Includes a pulsing 6px radial dot indicator.
- **Pending / Action Needed**: Surface `rgba(245, 158, 11, 0.12)`, border `rgba(245, 158, 11, 0.25)`, text `#fbbf24`.
- **High Risk**: Surface `rgba(239, 68, 68, 0.12)`, border `rgba(239, 68, 68, 0.25)`, text `#f87171`.

### Checkboxes & Radios
- Size 18x18px, radius 6px (checkbox) or circular (radio), background `rgba(15, 23, 42, 0.8)`, border `1px solid rgba(255, 255, 255, 0.2)`. Selected state fills with `#f97316` displaying a crisp white 2px check stroke.

### Specialized Security Components
- **Passkey & Hardware Key Card**: Dedicated modular tile displaying the hardware token name, last used timestamp, browser fingerprint, and a distinct cyan keyhole indicator.
- **Session Kill Switch**: Destructive action banner with dark slate surface, thin red accent rim, and immediate double-confirmation modal state.