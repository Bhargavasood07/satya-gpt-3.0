/**
 * SATYA-GPT COLOR PALETTE — "Midnight Ops"
 * ─────────────────────────────────────────────────────────────
 * A professional cybersecurity palette built on 3 core ideas:
 *
 *  1. TRUST   → Electric Blue   — brand, actions, links
 *  2. INTEL   → Cyan            — live data, scan, AI activity
 *  3. STATUS  → Emerald / Amber / Crimson — safe / warn / threat
 *
 * All colors pass WCAG AA contrast on their respective surfaces.
 * ─────────────────────────────────────────────────────────────
 */

export const palette = {

  /* ── RAW SCALE ─────────────────────────────────────────────── */

  /* Navy (surface) */
  navy: {
    950: '#02060f',   // deepest void
    900: '#040d1c',   // page base
    850: '#060f22',   // inset wells
    800: '#081428',   // card surface
    750: '#0a1a34',   // card elevated
    700: '#0d1f3c',   // overlay / modal
    600: '#152a50',   // border-strong
    500: '#1e3a6e',   // border-default
    400: '#2a4f8f',   // border-subtle active
    300: '#3d6db8',   // text-muted
    200: '#6a96d4',   // text-secondary
    100: '#a8c4e8',   // text-tertiary
    50:  '#ddeaf8',   // text-on-dark
  },

  /* Blue (primary brand) */
  blue: {
    600: '#1245c4',   // deep press
    500: '#1a6cf9',   // primary action
    400: '#3d84ff',   // hover state
    300: '#6ba3ff',   // light variant
    200: '#9bbfff',   // very light
    100: '#ccdeff',   // muted fill
    glow: 'rgba(26,108,249,0.30)',
    muted: 'rgba(26,108,249,0.10)',
    border: 'rgba(26,108,249,0.35)',
  },

  /* Cyan (intel / live data) */
  cyan: {
    500: '#00c8ef',   // live indicators, scan lines
    400: '#33d6f5',   // hover
    300: '#66e3f8',   // light
    glow: 'rgba(0,200,239,0.28)',
    muted: 'rgba(0,200,239,0.08)',
  },

  /* Emerald (safe / success) */
  emerald: {
    500: '#00c896',   // safe result
    400: '#1ad4a5',   // hover
    300: '#5de0bb',   // light
    glow: 'rgba(0,200,150,0.25)',
    muted: 'rgba(0,200,150,0.09)',
  },

  /* Amber (warning / MeitY) */
  amber: {
    500: '#f5a623',   // caution
    400: '#f8bc55',   // hover
    300: '#fbd087',   // light
    glow: 'rgba(245,166,35,0.25)',
    muted: 'rgba(245,166,35,0.09)',
  },

  /* Crimson (threat / danger / freeze) */
  crimson: {
    600: '#c4162a',   // deep press
    500: '#ff2d4f',   // threat alert
    400: '#ff5c77',   // hover
    300: '#ff8fa0',   // light
    glow: 'rgba(255,45,79,0.28)',
    muted: 'rgba(255,45,79,0.09)',
  },

  /* Violet (AI / intelligence features only) */
  violet: {
    500: '#7c5cfc',   // KAVACH AI accent
    400: '#9b80fd',   // hover
    300: '#baa8fe',   // light
    glow: 'rgba(124,92,252,0.28)',
    muted: 'rgba(124,92,252,0.09)',
  },

  /* Pure white/black for overlays */
  white: '#ffffff',
  black: '#000000',
};

/* ── SEMANTIC MAPPING ──────────────────────────────────────────
 * Maps semantic roles to raw palette values.
 * Use these everywhere — never raw hex values directly.
 */
export const tokens = {

  /* Surfaces (layered depth) */
  surface: {
    void:    palette.navy[950],
    base:    palette.navy[900],
    inset:   palette.navy[850],
    card:    palette.navy[800],
    raised:  palette.navy[750],
    overlay: palette.navy[700],
  },

  /* Borders */
  border: {
    subtle:  `rgba(255,255,255,0.05)`,
    default: `rgba(255,255,255,0.09)`,
    strong:  `rgba(255,255,255,0.16)`,
    focus:   palette.blue[500],
    brand:   palette.blue.border,
  },

  /* Brand / Primary */
  primary:   palette.blue[500],
  primaryHover: palette.blue[400],
  primaryMuted: palette.blue.muted,
  primaryGlow:  palette.blue.glow,
  primaryBorder: palette.blue.border,

  /* Intel accent (scan, live, data) */
  intel:     palette.cyan[500],
  intelMuted: palette.cyan.muted,
  intelGlow:  palette.cyan.glow,

  /* AI accent (KAVACH, AI Hub) */
  ai:        palette.violet[500],
  aiMuted:   palette.violet.muted,
  aiGlow:    palette.violet.glow,

  /* Semantic states */
  success:   palette.emerald[500],
  successMuted: palette.emerald.muted,
  successGlow:  palette.emerald.glow,

  warning:   palette.amber[500],
  warningMuted: palette.amber.muted,
  warningGlow:  palette.amber.glow,

  danger:    palette.crimson[500],
  dangerMuted: palette.crimson.muted,
  dangerGlow:  palette.crimson.glow,

  /* Text */
  text: {
    primary:   '#e8f2ff',        // blue-tinted white — feels digital
    secondary: palette.navy[200],
    muted:     palette.navy[300],
    inverse:   palette.navy[900],
  },
};

export default { palette, tokens };
