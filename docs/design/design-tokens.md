# Design Tokens

## Overview

Design tokens serve as a shared language between designers and engineers, providing the foundation for building consistent UIs efficiently. This guideline defines the token types and their usage.

## Token Architecture

This project uses a **3-layer token structure**:

```
Base Palette → Semantic Tokens → Component Tokens
```

1. **Base Palette**: Raw color values (OKLch format)
2. **Semantic Tokens**: Intent-driven tokens (`--token-*`)
3. **Component Tokens**: Final tokens used in Tailwind (`--color-*`)

### OKLch Color Format

All colors are defined in **OKLch** format for perceptual uniformity:

```css
oklch(L C H / A)
/* L: Lightness (0-1), C: Chroma (0-0.4), H: Hue (0-360), A: Alpha */
```

Benefits of OKLch:
- Perceptually uniform lightness scale
- Intuitive alpha blending
- Directly computable in CSS

---

## Token Types

### 1. Base Palette (Primitive Tokens)

Concrete values at the lowest layer, carrying atomic meaning.

```css
/* Neutrals (per docs/design/colors.md) */
--palette-ink-900: oklch(0.21 0.02 285);  /* Dark text */
--palette-ink-800: oklch(0.28 0.02 285);  /* Soft text */
--palette-ink-500: oklch(0.50 0.01 285);  /* Muted text */
--palette-cream-50: oklch(0.97 0.005 90); /* #F7F6F3 Off-white */
--palette-white: oklch(1 0 0);            /* Pure white */

/* Accent colors (per docs/design/colors.md) */
--palette-mint-100: oklch(0.82 0.06 195); /* #97D5D9 Mint green */
--palette-sky-100: oklch(0.72 0.12 260);  /* #83A8F9 Soft blue */
--palette-amber-100: oklch(0.62 0.12 70); /* #ab7d42 Amber (primary accent) */
--palette-amber-hover: oklch(0.55 0.12 70); /* #956b35 Amber hover */
--palette-amber-soft: oklch(0.90 0.04 70); /* #ebdbc6 Amber soft */
--palette-amber-bg: oklch(0.95 0.02 70);  /* #f5efe6 Amber bg */
--palette-coral-100: oklch(0.65 0.20 35); /* #F7643D Vivid orange (warnings) */
--palette-beige-100: oklch(0.82 0.015 80);/* #CBC6BE Warm beige */

/* Soft variants (with alpha) */
--palette-line: oklch(0.87 0 0 / 0.3);    /* #D9D9D9 Light gray */
--palette-sky-soft: oklch(0.72 0.12 260 / 0.7);
--palette-coral-soft: oklch(0.90 0.08 50 / 0.8);
--palette-amber-soft: oklch(0.65 0.20 35 / 0.7);
--palette-cream-soft: oklch(0.94 0.025 80 / 0.7); /* Warm cream */

/* Status */
--palette-like: #e05c6c;       /* Like/favorite heart */
--palette-like-bg: #fce8eb;    /* Favorite card tint */
--palette-success: #3f7a57;    /* Success/positive actions */

/* Dark mode only */
--palette-dark-bg: oklch(0.18 0.03 280);
--palette-dark-bar: oklch(0.12 0.02 280);
```

#### Member Brand Colors

Per-member brand colors (sourced from `design-tokens.ts`). Used for avatars, hero gradients, and personalized accents.

```css
--c-sumire: #B0C4DE;   --c-nazuna: #FABEDC;  --c-toto: #F5EB4A;
--c-uruha: #4182FA;    --c-noa: #FFDBFE;     --c-mimi: #C7B2D6;
--c-sena: #FFFFFF;     --c-hinano: #FA96C8;  --c-lisa: #D1DE79;
--c-ren: #BE2152;      --c-kyupi: #FFD23C;   --c-beni: #85CAB3;
--c-emma: #B4F1F9;     --c-runa: #D6ADFF;    --c-tsuna: #FF3652;
--c-ramune: #8ECED9;   --c-met: #FBA03F;     --c-akari: #FF998D;
--c-kuromu: #909EC8;   --c-kokage: #5195E1;  --c-yuuhi: #ED784A;
--c-hanabi: #EA5506;   --c-moka: #ECA0AA;    --c-seine: #58535E;
--c-chise: #BEFF77;
```

### 2. Semantic Tokens

Context-specific values that convey the intended purpose of each token.

```css
/* Background */
--token-canvas: var(--palette-cream-50);     /* Main background */
--token-surface: var(--palette-white);       /* Card/panel background */
--token-surface-soft: var(--palette-sky-soft); /* Soft background */
--token-surface-ink: var(--palette-ink-900); /* Dark background */

/* Text */
--token-text: var(--palette-ink-900);        /* Primary text */
--token-text-soft: var(--palette-ink-800);   /* Secondary text */
--token-text-muted: var(--palette-ink-500);  /* Muted text */

/* Border */
--token-border: var(--palette-line);         /* Standard border */

/* Accent */
--token-accent: var(--palette-amber-100);    /* Primary accent (amber) */
--token-accent-hover: var(--palette-amber-hover);
--token-accent-soft: var(--palette-amber-soft);
--token-accent-bg: var(--palette-amber-bg);

/* Status colors */
--token-like: var(--palette-like);
--token-like-bg: var(--palette-like-bg);
--token-success: var(--palette-success);
--token-info: var(--palette-sky-100);
--token-info-soft: var(--palette-cream-soft);
--token-warning: var(--palette-coral-100);
--token-warning-soft: oklch(0.65 0.20 35 / 0.7);

/* Dark mode only */
--token-dark-canvas: var(--palette-dark-bg);
--token-dark-bar: var(--palette-dark-bar);
```

### 3. Component Tokens (Tailwind Tokens)

Defined via the `@theme` directive, these tokens are available as Tailwind utilities.

```css
/* Background */
--color-background: var(--token-canvas);
--color-card: var(--token-surface);
--color-muted: var(--token-surface-soft);

/* Text */
--color-foreground: var(--token-text);
--color-foreground-soft: var(--token-text-soft);
--color-muted-foreground: var(--token-text-muted);

/* Primary (interactive elements) */
--color-primary: var(--token-surface-ink);
--color-primary-foreground: oklch(1 0 0);

/* Accent */
--color-accent: var(--token-accent);
--color-accent-soft: var(--token-accent-soft);

/* Status */
--color-info: var(--token-info);
--color-info-soft: var(--token-info-soft);
--color-warning: var(--token-warning);
--color-warning-soft: var(--token-warning-soft);
--color-success: var(--token-success);

/* Border */
--color-border: var(--token-border);
--color-ring: var(--token-surface-ink);

/* Palette colors (direct reference) */
--color-mint: var(--palette-mint-100);
--color-sky: var(--palette-sky-100);
--color-coral: var(--palette-coral-100);
--color-amber: var(--palette-amber-100);
--color-beige: var(--palette-beige-100);

/* Dark mode */
--color-dark-canvas: var(--token-dark-canvas);
--color-dark-bar: var(--token-dark-bar);
```

---

## Radius Tokens

Defines the border-radius scale.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.5rem (8px) | Small elements, chips |
| `--radius-md` | 0.875rem (14px) | Standard elements, buttons |
| `--radius-lg` | 1.25rem (20px) | Cards, panels |
| `--radius-xl` | 1.5rem (24px) | Large panels |
| `--radius-2xl` | 2rem (32px) | Modals, large cards |

---

## Shadow Tokens

Shadows that express elevation (sense of depth).

| Token | Usage |
|-------|-------|
| `--shadow-card` | Cards, subtle elevation (20px blur, 8% alpha) |
| `--shadow-action` | Buttons, interactive elements (12px blur, 20% alpha) |
| `--shadow-hero` | Hero elements, emphasis (30px blur, 30% alpha) |
| `--shadow-focus` | Focus ring (2px ring, 20% alpha) |

```css
--shadow-card: 0 20px 40px oklch(0.21 0.02 285 / 0.08);
--shadow-action: 0 12px 24px oklch(0.21 0.02 285 / 0.2);
--shadow-hero: 0 30px 80px oklch(0.21 0.02 285 / 0.3);
--shadow-focus: 0 0 0 2px oklch(0.21 0.02 285 / 0.2);
```

---

## Motion Tokens

Defines animation and transition durations.

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Instant feedback (hover, focus) |
| `--duration-md` | 300ms | Standard transitions (panel open/close) |
| `--ease-standard` | cubic-bezier(0.2, 0.7, 0.2, 1) | Standard easing |

---

## Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | "M PLUS Rounded 1c", system fonts... | Body text |
| `--font-display` | "Shippori Mincho B1", system fonts... | Headings (h1-h4) |

### Text Size Utilities

| Class | Size | Usage |
|-------|------|-------|
| `text-3xs` | 0.65rem (10.4px) | Extra-small text |
| `text-2xs` | 0.7rem (11.2px) | Small labels |
| `text-xs` | 0.75rem (12px) | Captions |
| `text-sm` | 0.875rem (14px) | Small body text |
| `text-base` | 1rem (16px) | Standard body text |

---

## Chart Colors

Defined in HSL format for recharts compatibility.

```css
--chart-1: 160 60% 45%;  /* Mint family */
--chart-2: 200 70% 50%;  /* Sky family */
--chart-3: 280 65% 60%;  /* Lilac family */
--chart-4: 30 80% 55%;   /* Coral/orange family */
--chart-5: 340 75% 55%;  /* Rose family */
```

---

## Phase Colors

Colors for visually distinguishing workflow phases.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-phase-start` | `oklch(0.60 0.15 250)` | Start phase (blue) |
| `--color-phase-progress` | `oklch(0.65 0.15 160)` | In-progress phase (green) |
| `--color-phase-review` | `oklch(0.60 0.15 300)` | Review phase (purple) |
| `--color-phase-pending` | `oklch(0.75 0.15 85)` | Pending phase (amber) |
| `--color-phase-complete` | `oklch(0.60 0.15 15)` | Complete phase (rose) |

### Usage in Tailwind

```tsx
<div className="bg-phase-start" />      // Start
<div className="bg-phase-progress" />   // In progress
<div className="bg-phase-review" />     // Review
<div className="bg-phase-pending" />    // Pending
<div className="bg-phase-complete" />   // Complete
```

---

## Status Colors

Colors for displaying real-time state.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-status-active` | `oklch(0.65 0.15 160)` | Active state (green) |
| `--color-status-danger` | `oklch(0.60 0.18 15)` | Danger/warning (red) |
| `--color-status-processing` | `oklch(0.60 0.15 250)` | Processing state (blue) |

### Usage in Tailwind

```tsx
<div className="bg-status-active" />      // Active indicator
<div className="bg-status-danger" />      // Warning badge
<div className="bg-status-processing" />  // Processing state
```

---

## Additional Component Tokens

### Secondary

Tokens for interactive elements used as alternatives to primary.

```css
--color-secondary: var(--token-surface-soft);
--color-secondary-foreground: var(--token-text);
```

| Class | Usage |
|-------|-------|
| `bg-secondary` | Secondary button background |
| `text-secondary-foreground` | Secondary button text |

### Popover

Tokens for floating elements such as dropdowns, tooltips, and modals.

```css
--color-popover: var(--token-surface);
--color-popover-foreground: var(--token-text);
```

| Class | Usage |
|-------|-------|
| `bg-popover` | Popover background |
| `text-popover-foreground` | Popover text |

### Input

Token for form input field borders.

```css
--color-input: var(--token-border);
```

| Class | Usage |
|-------|-------|
| `border-input` | Input field border |

### Other Foreground Tokens

Text colors corresponding to each status color. All reference `--token-text-soft`.

```css
--color-card-foreground: var(--token-text-soft);
--color-accent-foreground: var(--token-text-soft);
--color-success-foreground: var(--token-text-soft);
--color-warning-foreground: var(--token-text-soft);
--color-info-foreground: var(--token-text-soft);
```

| Token | Usage |
|-------|-------|
| `--color-card-foreground` | Card text |
| `--color-accent-foreground` | Accent element text |
| `--color-success-foreground` | Success state text |
| `--color-warning-foreground` | Warning state text |
| `--color-info-foreground` | Info state text |

### Legacy Aliases (Backward Compatibility)

The following tokens are maintained for backward compatibility. Do not use them in new code.

```css
--color-ink: var(--token-text);
--color-ink-soft: var(--token-text-soft);
--color-cream: var(--token-canvas);
--color-surface: var(--token-surface);
--color-line: var(--token-border);
```

| Legacy Token | Replacement |
|-------------|-------------|
| `--color-ink` | `--color-foreground` |
| `--color-ink-soft` | `--color-foreground-soft` |
| `--color-cream` | `--color-background` |
| `--color-surface` | `--color-card` |
| `--color-line` | `--color-border` |

---

## How to Use Tokens

### Using with Tailwind CSS

Tokens defined via the `@theme` directive are available as Tailwind utilities.

```tsx
// Background color
<div className="bg-background" />
<div className="bg-card" />

// Text color
<p className="text-foreground" />
<p className="text-foreground-soft" />
<p className="text-muted-foreground" />

// Border
<div className="border border-border" />

// Border radius
<div className="rounded-lg" />  // Uses radius-lg
<div className="rounded-2xl" /> // Uses radius-2xl

// Shadow
<div className="shadow-card" />
<div className="shadow-action" />
```

### Using as CSS Variables

```css
.custom-element {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  transition: all var(--duration-fast) var(--ease-standard);
}
```

---

## Token Design Guidelines

### Naming Convention

```
--{layer}-{category}-{variant}

Examples:
--palette-ink-900      (Base Palette)
--token-text-soft      (Semantic Token)
--color-foreground     (Component Token)
```

### Adding New Tokens

1. **Add a primitive**: First add the value to `--palette-*`
2. **Create a semantic token**: Express the intent with `--token-*`
3. **Expose to Tailwind**: Define `--color-*` via `@theme` as needed
4. **Document**: Update this document

### Prohibited Practices

- Using hardcoded values directly (always use tokens)
- Overriding existing token values
- Using meaningless abbreviations
- Using Tailwind built-in colors directly (e.g., `bg-blue-500`)

---

## References

- [CSS Guidelines](../css.md)
- [Color Guidelines](./colors.md)
- [Typography Guidelines](./typography.md)
- [Utility Classes](./utilities.md)
