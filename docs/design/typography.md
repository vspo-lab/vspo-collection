# Typography Guidelines

## Overview

This project uses fonts that convey a soft and approachable feel.

## Fonts

### Body Font: M PLUS Rounded 1c

A rounded gothic typeface that gives a soft and friendly impression.

```css
--font-body: "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "Yu Gothic",
  "Noto Sans JP", sans-serif;
```

### Heading Font: Shippori Mincho B1

A serif (Mincho) typeface that adds elegance and sophistication to headings.

```css
--font-display: "Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho",
  serif;
```

## Google Fonts Import

```css
@import url("https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Shippori+Mincho+B1:wght@600;700&display=swap");
```

## Weights

| Font | 400 | 500 | 600 | 700 |
|------|-----|-----|-----|-----|
| M PLUS Rounded 1c | ✓ | ✓ | - | ✓ |
| Shippori Mincho B1 | - | - | ✓ | ✓ |

## Application Rules

- `h1` through `h4`: `--font-display` (Shippori Mincho B1)
- Everything else: `--font-body` (M PLUS Rounded 1c)

```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
}
```

## Text Size Utilities

| Class | Size | Use Case |
|-------|------|----------|
| `text-3xs` | 0.65rem (10.4px) | Extra-small text |
| `text-2xs` | 0.7rem (11.2px) | Small labels |
| `text-xs` | 0.75rem (12px) | Captions |
| `text-sm` | 0.875rem (14px) | Small body text |
| `text-base` | 1rem (16px) | Standard body text |

## Prohibited Practices

- Using a font size below 10px (to ensure readability)
- Setting line height below 1.4 (for readability of Japanese text)

## References

- [M PLUS Rounded 1c - Google Fonts](https://fonts.google.com/specimen/M+PLUS+Rounded+1c)
- [Shippori Mincho B1 - Google Fonts](https://fonts.google.com/specimen/Shippori+Mincho+B1)
- [CSS Guidelines](../css.md)
