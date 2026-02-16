# Color Guidelines

## Overview

The color palette is a key element of the brand's visual identity. Consistent use of color provides users with a unified experience.

## Brand Colors

The primary colors that represent the brand.

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| Off-White | `#F7F6F3` | rgb(247, 246, 243) | Background / base color |
| Lime Yellow | `#E6EC49` | rgb(230, 236, 73) | Accent / emphasis |

### Off-White (Background)

Used as the main background color. The warm off-white gives a soft and approachable impression.

```css
--color-background: #F7F6F3;
```

### Lime Yellow (Accent)

Used to highlight CTA buttons and important elements. Highly visible and draws the user's attention.

```css
--color-accent: #E6EC49;
```

## Secondary Colors

Colors that complement the brand colors and add variety to the UI.

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| Warm Beige | `#CBC6BE` | rgb(203, 198, 190) | Footer / secondary background |
| Mint Green | `#97D5D9` | rgb(151, 213, 217) | Cyan accent / supplementary |
| Vivid Orange | `#F7643D` | rgb(247, 100, 61) | Warnings / attention elements |
| Soft Blue | `#83A8F9` | rgb(131, 168, 249) | Information / links |
| Light Gray | `#D9D9D9` | rgb(217, 217, 217) | Decorative / borders |

### Usage Examples

```css
/* Footer background */
.footer {
  background-color: #CBC6BE;
}

/* Info badge */
.badge-info {
  background-color: #83A8F9;
}

/* Warning message */
.alert-warning {
  border-color: #F7643D;
}
```

## Color Usage Rules

### Priority

1. **Background**: Use off-white `#F7F6F3` as the base
2. **Accent**: Use lime yellow `#E6EC49` for primary CTAs
3. **Secondary**: Choose from secondary colors based on context

### Contrast Ratio Considerations

To ensure accessibility, text-to-background contrast ratios must meet the following requirements:

| Target | Minimum Contrast Ratio |
|--------|----------------------|
| Normal text (under 14px) | 4.5:1 or higher |
| Large text (18px+, or 14px+ bold) | 3:1 or higher |
| UI components / graphics | 3:1 or higher |

### Color Combinations

#### Recommended Combinations

| Background | Text / Foreground | Usage |
|------------|-------------------|-------|
| Off-White | Dark gray / black | Body text |
| Lime Yellow | Dark text | CTA buttons |
| Warm Beige | Dark text | Footer sections |

#### Combinations to Avoid

- White text on lime yellow background (insufficient contrast)
- Soft blue text on mint green background (difficult to distinguish)

## Prohibited Practices

- Using colors outside the palette without approval
- Altering brand colors (excessive opacity changes, converting to gradients, etc.)
- Displaying text with color combinations that fail contrast ratio requirements
- Conveying information through color alone (always supplement with shape or text)

## References

- [Accessibility Guidelines](./accessibility.md)
- [Design Tokens](./design-tokens.md)
- [Contrast Checker - WebAIM](https://webaim.org/resources/contrastchecker/)
