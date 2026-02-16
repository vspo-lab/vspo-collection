# Design Principles

## Overview

Design principles serve as the foundation for delivering a consistent, high-quality user experience. This guideline defines a 22-item usability checklist.

## Usability Checklist

### Information Design (Items 1-5)

Items related to understanding user tasks and structuring information.

| # | Check Item | Description |
|---|-----------|-------------|
| 1 | Demonstrate understanding of user tasks | Have you clearly understood what tasks users perform and reflected that in the design? |
| 2 | Explain the conceptual model | Does the design communicate the system's structure and behavior in a way users can understand? |
| 3 | Are object properties and actions sufficient for user task completion? | Are the necessary information and actions available? |
| 4 | Explain the view call relationships | Are screen transitions logical and predictable? |
| 5 | Is the main navigation organized around user interests? | Does the navigation structure align with users' mental models? |

### Design Patterns (Items 6-16)

Items related to visual design and interaction.

| # | Check Item | Related Guideline |
|---|-----------|-------------------|
| 6 | Does it follow "visual flow" standards? | [Design Patterns - Visual Flow](./design-patterns.md#visual-flow) |
| 7 | Does it follow "visual grouping" standards? | [Design Patterns - Visual Grouping](./design-patterns.md#visual-grouping) |
| 8 | Does it follow "page layout" standards? | [Design Patterns - Page Layout](./design-patterns.md#page-layout) |
| 9 | Does it follow "spacing" standards? | [CSS Guidelines](../css.md) |
| 10 | Does it follow "mobile layout" standards? | [Design Patterns - Mobile Layout](./design-patterns.md#mobile-layout) |
| 11 | Does user notification/feedback follow "feedback" standards? | [Design Patterns - Feedback](./design-patterns.md#feedback) |
| 12 | For modal UIs, does it follow "modal UI" standards? | [Design Patterns - Modal UI](./design-patterns.md#modal-ui) |
| 13 | When using tables, does it follow appropriate standards? | Data table design principles |
| 14 | Do input elements follow "default value" standards? | Setting appropriate default values |
| 15 | Have error states been considered, with feedback designed to help users recover from errors? | [Content Guidelines - Error Messages](./content-guidelines.md) |
| 16 | Is there a confirmation step before destructive or irreversible actions (including deletion)? | Confirmation dialog display |

### Components (Items 17-18)

Items related to UI component usage.

| # | Check Item | Description |
|---|-----------|-------------|
| 17 | Is there a custom component that duplicates an existing UI library component? | Leverage existing components and avoid custom implementations |
| 18 | Are components used according to their design guidelines? | Use components as intended by their design |

### Writing (Items 19-21)

Items related to text content.

| # | Check Item | Related Guideline |
|---|-----------|-------------------|
| 19 | Are names consistent with core concepts? | [Writing Guidelines](./writing.md) |
| 20 | Do navigation paths and action names follow standards? | Consistent button labels and link text |
| 21 | Do error messages follow standards? | [Content Guidelines](./content-guidelines.md) |

### Accessibility (Item 22)

| # | Check Item | Related Guideline |
|---|-----------|-------------------|
| 22 | Has the accessibility quick checklist been applied? | [Accessibility Guidelines](./accessibility.md) |

## Item Details

### 1. Understanding User Tasks

Clarify the following before starting design:

- Who are the users (personas)?
- What problems are they trying to solve?
- In what context will they use the product?
- What defines success?

### 2. Conceptual Model

Design a mental model that helps users understand the system:

- What are the system's primary "objects"?
- What are the relationships between objects?
- What actions are available?

### 6. Visual Flow

Design the flow of the user's gaze:

- F-pattern (screens where information is stacked vertically)
- Z-pattern (first-visit or minimal-scroll screens)
- Eye movement from larger to smaller elements

### 15. Error State Considerations

When an error occurs:

1. **What happened**: Explain the event
2. **Why it happened**: Explain the cause
3. **How to fix it**: Explain how to resolve it

### 16. Confirmation Before Dangerous Actions

Display a confirmation dialog before destructive actions:

```tsx
// Deletion confirmation example
<Dialog>
  <DialogTitle>Delete this article?</DialogTitle>
  <DialogDescription>
    This action cannot be undone. The article "{title}" will be permanently deleted.
  </DialogDescription>
  <DialogActions>
    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    <Button variant="destructive" onClick={onConfirm}>Delete</Button>
  </DialogActions>
</Dialog>
```

## When to Use the Checklist

| Timing | Purpose |
|--------|---------|
| At design start | Confirm design direction |
| At design completion | Check for gaps and oversights |
| During review | Ensure quality |
| Before release | Final verification |

## References

- [Design Patterns](./design-patterns.md)
- [Accessibility Checklist](./accessibility.md)
- [Content Guidelines](./content-guidelines.md)
- [Design Review](./design-review.md)
