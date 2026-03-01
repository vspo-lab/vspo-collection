# Icon Guidelines

## Overview

Icons are important visual elements that enhance UI visibility and usability. This guideline establishes a policy of using Lucide React as the primary icon source and creating original icons when needed.

## Basic Policy

Icons are primarily selected from **Lucide React**. When a suitable icon is not available, create an original icon that matches the visual style.

### Using Lucide React

| Item | Recommendation |
|------|----------------|
| Package | lucide-react |
| Style | Use outline (default) as the baseline |
| Size | Use 16px to 24px as the baseline depending on the use case |
| Color | Follow semantic colors |

```tsx
// Lucide React usage example
import { Search, User, Menu } from "lucide-react";

<Search className="w-4 h-4 text-text-secondary" />
<User className="w-5 h-5 text-text-primary" />
```

### Using the NavIcon Component

In the project, icons are used through the `NavIcon` component. This allows utilizing Lucide React icons while maintaining consistent icon naming.

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

## Original Icon Creation Rules

When a suitable icon is not available in Lucide React, create original icons following these rules.

### Artboard and Size

| Item | Value |
|------|-------|
| Artboard size | 128 x 128 px |
| Margin (all sides) | 8px each |
| Drawing area | 112 x 112 px |

```
+---------------------+
|        8px          |
|   +-----------+     |
|8px|  112x112  |8px  |
|   |  Drawing  |     |
|   |   area    |     |
|   +-----------+     |
|        8px          |
+---------------------+
     128x128px
```

### Stroke and Border Radius

| Item | Base value | Notes |
|------|-----------|-------|
| Stroke width | 10px | Adjustable |
| Border radius (base) | radius 8px | - |
| Border radius (small) | radius 4px | Can be combined with base |

### When Creating Solid Style

When creating a solid style, the recommended spacing between adjacent colors is **6px**.

## Style Variations

Following Lucide React's specification, the outline style is the default.

### Outline (Default)

- Icons composed of strokes only
- Recommended for normal state usage
- strokeWidth: 2 (default)

### Customization

```tsx
// Change stroke width
<Search strokeWidth={1.5} className="w-5 h-5" />

// Change color
<User className="w-5 h-5 text-primary" />
```

## Creation Workflow

1. **Search Lucide React**: First look for an appropriate icon in Lucide React
2. **Duplicate master data**: When creating original icons, always duplicate the master data before starting work
3. **Align to keyline**: Align to the keyline for visual consistency
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

### Status Display

```tsx
// Status icon
import { CheckCircle } from "lucide-react";

<span className="flex items-center gap-1">
  <CheckCircle className="w-4 h-4 text-success" />
  <span>Completed</span>
</span>
```

## Size Guide

| Use case | Size | Class |
|----------|------|-------|
| Inline text | 14px | `w-3.5 h-3.5` |
| Small buttons/badges | 16px | `w-4 h-4` |
| Standard buttons | 18px | `w-4.5 h-4.5` |
| Navigation | 20px | `w-5 h-5` |
| Large headings/hero | 24px | `w-6 h-6` |

## Prohibited Practices

- Modifying or altering Lucide React icons
- Creating original icons with a style significantly different from Lucide React
- Conveying information through icons alone (use text labels alongside)
- Excessive use of icons for decorative purposes

## Reference Links

- [Lucide Icons](https://lucide.dev/icons/)
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Accessibility Guidelines](./accessibility.md)
