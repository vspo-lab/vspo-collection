# Color Guidelines

## Overview

The color palette defines the visual identity for ぶいすぽコレクション. It combines a warm neutral base with an amber accent and per-member brand colors.

## Brand Colors

| Name | HEX | CSS Variable | Usage |
|------|-----|-------------|-------|
| Off-White | `#F7F6F3` | `--bg` | Background / base color |
| Amber | `#ab7d42` | `--accent` | Primary accent / CTA / active states |

### Off-White (Background)

The warm off-white gives a soft and approachable impression. Used as the main canvas.

```css
--bg: #F7F6F3;
```

### Amber (Accent)

Used for CTA buttons, active tabs, progress bars, and interactive highlights. Provides warmth without harshness.

```css
--accent: #ab7d42;
--accent-hover: #956b35;
--accent-soft: #ebdbc6;  /* Soft tint for backgrounds */
--accent-bg: #f5efe6;    /* Very light tint for hover/selected rows */
```

## Semantic Colors

| Name | HEX | CSS Variable | Usage |
|------|-----|-------------|-------|
| Surface | `#FFFFFF` | `--surface` | Cards, panels, overlays |
| Border | `#E8E5E0` | `--border` | Standard borders |
| Border Light | `#F0EDE8` | `--border-light` | Subtle dividers |
| Ink | `#202530` | `--ink` | Primary text |
| Ink Soft | `#6B6560` | `--ink-soft` | Secondary text |
| Ink Muted | `#9B9690` | `--ink-muted` | Placeholder, metadata |
| Ink Faint | `#C5C0BA` | `--ink-faint` | Disabled, inactive icons |

## Status Colors

| Name | HEX | CSS Variable | Usage |
|------|-----|-------------|-------|
| Like | `#e05c6c` | `--like-color` | Liked hearts, favorite indicators |
| Like Background | `#fce8eb` | `--like-bg` | Favorite card tints |
| Success | `#3f7a57` | `--success` | Positive actions, merge icon |

## Member Brand Colors

Each Vspo member has an official brand color used for avatars, hero gradients, and personalized UI accents. Defined in `design-tokens.ts` and exposed as CSS custom properties.

| Member | HEX | CSS Variable | Avatar Text |
|--------|-----|-------------|-------------|
| 花芽すみれ | `#B0C4DE` | `--c-sumire` | Dark |
| 花芽なずな | `#FABEDC` | `--c-nazuna` | Dark |
| 小雀とと | `#F5EB4A` | `--c-toto` | Dark |
| 一ノ瀬うるは | `#4182FA` | `--c-uruha` | Light |
| 胡桃のあ | `#FFDBFE` | `--c-noa` | Dark |
| 兎咲ミミ | `#C7B2D6` | `--c-mimi` | Dark |
| 空澄セナ | `#FFFFFF` | `--c-sena` | Dark (+ border) |
| 橘ひなの | `#FA96C8` | `--c-hinano` | Dark |
| 八雲べに | `#85CAB3` | `--c-beni` | Dark |
| 藍沢エマ | `#B4F1F9` | `--c-emma` | Dark |
| 紫宮るな | `#D6ADFF` | `--c-runa` | Light |
| 白波らむね | `#8ECED9` | `--c-ramune` | Dark |
| 小森めと | `#FBA03F` | `--c-met` | Light |
| 神成きゅぴ | `#FFD23C` | `--c-kyupi` | Dark |
| 如月れん | `#BE2152` | `--c-ren` | Light |
| 英リサ | `#D1DE79` | `--c-lisa` | Dark |
| 綾瀬つな | `#FF3652` | `--c-tsuna` | Light |
| 夜乃くろむ | `#909EC8` | `--c-kuromu` | Dark |
| 木暮ゆうひ | `#ED784A` | `--c-yuuhi` | Light |
| 花鋏キョウ | `#FF998D` | `--c-akari` | Dark |
| 小柳こかげ | `#5195E1` | `--c-kokage` | Light |
| 夢野はなび | `#EA5506` | `--c-hanabi` | Light |
| 甘城もか | `#ECA0AA` | `--c-moka` | Dark |
| 瀬名セイネ | `#58535E` | `--c-seine` | Light |
| 千草ちせ | `#BEFF77` | `--c-chise` | Dark |

### Avatar Text Color Rule

- **Dark text** (`avatar-dark-text`): Use when the member color is light (L > 0.7 in OKLch)
- **Light text** (`avatar-light-text`): Use when the member color is dark (L <= 0.7)
- **セナ exception**: White background requires `border: 1px solid var(--border)` for visibility

### Member Color Usage

```css
/* Avatar circle */
.avatar { background: var(--c-sumire); }

/* Hero gradient (member detail page) */
.hero { background: linear-gradient(180deg,
  color-mix(in srgb, var(--c-sumire) 25%, var(--bg)) 0%,
  var(--bg) 100%); }

/* Avatar shadow */
.avatar-lg { box-shadow: 0 8px 32px color-mix(in srgb, var(--c-sumire) 30%, transparent); }
```

## Color Usage Rules

### Priority

1. **Background**: Use off-white `#F7F6F3` as the base
2. **Accent**: Use amber `#ab7d42` for primary CTAs and active states
3. **Member colors**: Use per-member brand colors for avatars and personalization
4. **Status**: Use like/success colors for contextual feedback

### Contrast Ratio Considerations

| Target | Minimum Contrast Ratio |
|--------|----------------------|
| Normal text (under 14px) | 4.5:1 or higher |
| Large text (18px+, or 14px+ bold) | 3:1 or higher |
| UI components / graphics | 3:1 or higher |

### Recommended Combinations

| Background | Text / Foreground | Usage |
|------------|-------------------|-------|
| Off-White (`--bg`) | Ink (`--ink`) | Body text |
| Amber (`--accent`) | White `#FFF` | CTA buttons |
| Accent-bg (`--accent-bg`) | Ink (`--ink`) | Selected/playing rows |
| Member color | Dark or light text | Member avatars |

## Prohibited Practices

- Using colors outside the palette without approval
- Altering brand colors (opacity changes, gradient conversions, etc.)
- Displaying text with color combinations that fail contrast ratio requirements
- Conveying information through color alone (always supplement with shape or text)
- Using emoji or Unicode symbols as icons (use SVG Lucide-style icons)

## References

- [Accessibility Guidelines](./accessibility.md)
- [Design Tokens](./design-tokens.md)
- [Contrast Checker - WebAIM](https://webaim.org/resources/contrastchecker/)
