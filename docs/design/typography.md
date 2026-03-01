# Typography Guidelines

## Overview

Select fonts that match the project's purpose and brand.

## Font Selection Principles

### Body Font

Choose a font with high readability that is comfortable to read even in long text.

```css
--font-body: "your-body-font", system-ui, sans-serif;
```

### Heading Font

Choose a font that expresses the brand's personality. Create contrast with the body font for visual distinction.

```css
--font-display: "your-display-font", system-ui, serif;
```

## Google Fonts Loading

```css
@import url("https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;500;700&display=swap");
```

## Weights

Prepare at least the following weights:

| Use case | Recommended weight |
|----------|-------------------|
| Body text | 400 (Regular) |
| Emphasis | 500 (Medium) or 700 (Bold) |
| Headings | 600 (SemiBold) or 700 (Bold) |

## Application Rules

- `h1` through `h4`: `--font-display`
- Everything else: `--font-body`

```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
}
```

## Text Size Utilities

| Class | Size | Use case |
|-------|------|----------|
| `text-3xs` | 0.65rem (10.4px) | Extra-small text |
| `text-2xs` | 0.7rem (11.2px) | Small labels |
| `text-xs` | 0.75rem (12px) | Captions |
| `text-sm` | 0.875rem (14px) | Small body text |
| `text-base` | 1rem (16px) | Standard body text |

## Prohibited Practices

- Using font sizes smaller than 10px (to ensure readability)
- Setting line-height below 1.4 (for readability of text, especially CJK)
