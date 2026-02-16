# Icon Guidelines

## Overview

Icons are key visual elements that improve UI visibility and usability. This guideline establishes the policy of using Lucide React as the primary icon source and creating custom icons when needed.

## Core Principles

Icons should primarily be selected from **Lucide React**. If no suitable icon is available, create a custom one that matches the overall tone and style.

### Using Lucide React

| Item | Recommendation |
|------|----------------|
| Package | lucide-react |
| Style | Outline (default) as the standard |
| Size | 16px to 24px as the standard, depending on use case |
| Color | Follow semantic colors |

```tsx
// Lucide React usage example
import { Search, User, Menu } from "lucide-react";

<Search className="w-4 h-4 text-text-secondary" />
<User className="w-5 h-5 text-text-primary" />
```

### Using the NavIcon Component

In this project, icons are used through the `NavIcon` component. This ensures icon name consistency while leveraging Lucide React icons.

```tsx
import { NavIcon } from "@/shared/components/presenters/NavIcon";

// For navigation
<NavIcon name="home" className="w-5 h-5" />
<NavIcon name="settings" className="w-5 h-5 text-muted-foreground" />
```

#### Available Icon Names

| Name | Description | Lucide Icon |
|------|-------------|-------------|
| home | Home | Home |
| play | Play | Play |
| clock | Clock | Clock |
| credit-card | Credit card | CreditCard |
| settings | Settings | Settings |
| file-text | File | FileText |
| sparkles | Sparkles | Sparkles |
| pencil | Pencil | Pencil |
| target | Target | Target |
| chart-bar | Bar chart | BarChart3 |

## Custom Icon Creation Rules

When Lucide React does not have a suitable icon, create a custom one following these rules.

### Artboard and Size

| Item | Value |
|------|-------|
| Artboard size | 128 x 128 px |
| Padding (all sides) | 8px each |
| Actual drawing area | 112 x 112 px |

```
+---------------------+
|        8px          |
|   +-----------+     |
|8px|  112x112  |8px  |
|   |  Drawing  |     |
|   |   Area    |     |
|   +-----------+     |
|        8px          |
+---------------------+
     128x128px
```

### Stroke and Border Radius

| Item | Default Value | Notes |
|------|---------------|-------|
| Stroke width | 10px | Adjustable |
| Border radius (standard) | 8px radius | - |
| Border radius (small) | 4px radius | Can be combined with standard |

### Solid Style Creation

When creating solid style icons, the recommended spacing between adjacent colors is **6px**.

## Style Variations

Following Lucide React conventions, outline style is used as the default.

### Outline (Default)

- Icons composed of strokes only
- Recommended for normal/default states
- strokeWidth: 2 (default)

### Customization

```tsx
// Change stroke width
<Search strokeWidth={1.5} className="w-5 h-5" />

// Change color
<User className="w-5 h-5 text-primary" />
```

## Creation Workflow

1. **Search Lucide React**: First look for a suitable icon in Lucide React
2. **Duplicate master data**: When creating custom icons, always duplicate the master data before starting
3. **Align to keylines**: Design along keylines for visual consistency
4. **Request review**: After completion, request a review from the design team

## Icon Usage Patterns

### Navigation

```tsx
// Header navigation
import { NavIcon } from "@/shared/components/presenters/NavIcon";

<nav className="flex items-center gap-4">
  <NavIcon name="home" className="w-5 h-5" />
  <NavIcon name="clock" className="w-5 h-5" />
  <NavIcon name="settings" className="w-5 h-5" />
</nav>
```

### Buttons

```tsx
// Button with icon
import { Plus } from "lucide-react";

<button className="flex items-center gap-2">
  <Plus className="w-4 h-4" />
  <span>Add</span>
</button>
```

### Status Indicators

```tsx
// Status icon
import { CheckCircle } from "lucide-react";

<span className="flex items-center gap-1">
  <CheckCircle className="w-4 h-4 text-success" />
  <span>Complete</span>
</span>
```

## Size Guide

| Use Case | Size | Class |
|----------|------|-------|
| Inline text | 14px | `w-3.5 h-3.5` |
| Small button / badge | 16px | `w-4 h-4` |
| Standard button | 18px | `w-4.5 h-4.5` |
| Navigation | 20px | `w-5 h-5` |
| Large heading / hero | 24px | `w-6 h-6` |

## Prohibited Practices

- Deforming or altering Lucide React icons
- Creating custom icons with a style significantly different from Lucide React
- Conveying information with icons alone (always pair with a text label)
- Excessive use of icons for purely decorative purposes

## References

- [Lucide Icons](https://lucide.dev/icons/)
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Accessibility Guidelines](./accessibility.md)
