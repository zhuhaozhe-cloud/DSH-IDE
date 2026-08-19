/**
 * Design Tokens — DSH IDE Mode
 *
 * Centralized design system based on the ui-ux-pro-max skill output.
 * Minimalist/Swiss style, dark mode, dense layout.
 *
 * Color Palette: Deep slate + green accent
 * Typography: IBM Plex Sans (UI) + JetBrains Mono (code)
 * Spacing: 4px base unit, 8/12/16/24/32/48/64px scale
 * Radius: 6px (small), 8px (medium), 12px (large)
 * Shadows: None (flat minimalism) or very subtle
 * Motion: 150-200ms ease-out for all transitions
 */

// ─── Color Palette ──────────────────────────────────────────────────────
// Mapped to DSH CSS variables where possible, with fallbacks for IDE-internal use.
// These constants are used in inline styles; CSS variable references ensure
// the IDE follows DSH skin changes automatically.

export const colors = {
  // Base surfaces
  bgBase: 'var(--dsw-alias-bg-base, #0F172A)',
  bgLayer1: 'var(--dsw-alias-bg-layer-1, #111827)',
  bgLayer2: 'var(--dsw-alias-bg-layer-2, #1B2336)',
  bgLayer3: 'var(--dsw-alias-bg-layer-3, #1E293B)',
  bgElevated: 'var(--dsw-alias-bg-elevated, #1E293B)',
  bgMask: 'var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.5))',

  // Text
  textPrimary: 'var(--dsw-alias-label-primary, #F8FAFC)',
  textSecondary: 'var(--dsw-alias-label-secondary, #94A3B8)',
  textTertiary: 'var(--dsw-alias-label-tertiary, #64748B)',
  textForeground: 'var(--dsw-alias-label-primary-foreground, #FFFFFF)',

  // Borders
  borderSubtle: 'var(--dsw-alias-border-l1, #1E293B)',
  borderDefault: 'var(--dsw-alias-border-l2, #334155)',
  borderStrong: 'var(--dsw-alias-border-l3, #475569)',

  // Interactive
  accentPrimary: 'var(--dsw-alias-state-business-primary, #22C55E)',
  accentHover: 'var(--dsw-alias-state-business-primary, #16A34A)',
  inputBg: 'var(--dsw-specific-input-major, #1E293B)',
  interactiveHover: 'var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,0.05))',

  // Sidebar
  sidebarNavHover: 'var(--dsw-specific-sidebar-nav-item-hover, rgba(255,255,255,0.06))',
  sidebarNavActive: 'var(--dsw-specific-sidebar-nav-item-active, rgba(34,197,94,0.12))',

  // Status
  statusError: 'var(--dsw-alias-state-error-primary, #EF4444)',
  statusWarning: 'var(--dsw-alias-state-warn-primary, #F59E0B)',
  statusSuccess: 'var(--dsw-alias-state-success-primary, #22C55E)',
  statusInfo: 'var(--dsw-alias-state-business-primary, #3B82F6)',
} as const

// ─── Typography ─────────────────────────────────────────────────────────

export const typography = {
  fontFamily: 'var(--dsw-font-family, "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
  fontFamilyMono: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

// ─── Spacing ────────────────────────────────────────────────────────────
// 4px base unit, exponential scale for dense IDE layout

export const spacing = {
  px: '1px',
  0: '0',
  1: '4px',    // 4
  2: '8px',    // 8
  3: '12px',   // 12
  4: '16px',   // 16
  5: '20px',   // 20
  6: '24px',   // 24
  8: '32px',   // 32
  10: '40px',  // 40
  12: '48px',  // 48
  16: '64px',  // 64
} as const

// ─── Border Radius ──────────────────────────────────────────────────────

export const radius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const

// ─── Shadows ────────────────────────────────────────────────────────────
// Minimalist style: no heavy shadows, use subtle elevation

export const shadow = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.2)',
  md: '0 4px 12px rgba(0,0,0,0.3)',
  lg: '0 8px 32px rgba(0,0,0,0.4)',
} as const

// ─── Transitions ────────────────────────────────────────────────────────

export const transition = {
  fast: '100ms ease-out',
  normal: '150ms ease-out',
  slow: '200ms ease-out',
} as const

// ─── Layout Constants ───────────────────────────────────────────────────

export const layout = {
  sidebarWidth: 260,
  sidebarMinWidth: 180,
  sidebarMaxWidth: 400,
  tabBarHeight: '36px',
  menuBarHeight: '32px',
  statusBarHeight: '24px',
  terminalHeaderHeight: '30px',
  resizeHandleSize: '4px',
} as const

// ─── Z-Index Scale ──────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  sidebar: 10,
  editor: 10,
  terminal: 10,
  resizeHandle: 20,
  tabBar: 20,
  menuDropdown: 100,
  dialog: 200,
  overlay: 300,
} as const
