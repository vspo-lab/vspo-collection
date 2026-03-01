# Design Principles

## Overview

Design principles are the foundation for providing a consistent and excellent user experience. This guideline defines a 22-item checklist centered on usability.

## Usability Checklist

### Information Architecture (Items 1-5)

Items related to understanding user workflows and information structure.

| # | Check item | Description |
|---|-----------|-------------|
| 1 | Explain understanding of user workflows | Have you clearly understood and reflected in the design how users perform their tasks? |
| 2 | Explain the conceptual model | Does it convey the system's structure and behavior in a way that is easy for users to understand? |
| 3 | Are the properties and actions associated with objects sufficient for user task completion? | Are the necessary information and operations available? |
| 4 | Explain the view invocation relationships | Are screen transitions logical and predictable? |
| 5 | Is the main navigation organized according to user interests? | Is the navigation structure aligned with the user's mental model? |

### Design Patterns (Items 6-16)

Items related to visual design and interaction.

| # | Check item | Related guideline |
|---|-----------|-------------------|
| 6 | Does it follow the "eye flow guidance" standards? | [Design Patterns - Eye Flow Guidance](./design-patterns.md#eye-flow-guidance) |
| 7 | Does it follow the "visual grouping" standards? | [Design Patterns - Visual Grouping](./design-patterns.md#visual-grouping) |
| 8 | Does it follow the "page layout" standards? | [Design Patterns - Page Layout](./design-patterns.md#page-layout) |
| 9 | Does it follow the "spacing" standards? | [CSS Guidelines](../css.md) |
| 10 | Does it follow the "mobile layout" standards? | [Design Patterns - Mobile Layout](./design-patterns.md#mobile-layout) |
| 11 | Does the notification/feedback approach follow the "feedback" standards? | [Design Patterns - Feedback](./design-patterns.md#feedback) |
| 12 | For modal UIs, does it follow the "modal UI" standards? | [Design Patterns - Modal UI](./design-patterns.md#modal-ui) |
| 13 | For tables, does it follow the appropriate standards? | Data table design principles |
| 14 | Do input elements follow the "default values" standards? | Setting appropriate default values |
| 15 | Have error states been considered, with feedback that allows users to recover from and resolve errors? | [Content Guidelines - Error Messages](./content-guidelines.md) |
| 16 | Is there a confirmation step before dangerous or irreversible operations, including deletion? | Display confirmation dialog |

### Components (Items 17-18)

Items related to UI component usage.

| # | Check item | Description |
|---|-----------|-------------|
| 17 | Are there custom components that are similar to UI library components? | Leverage existing components and avoid custom implementations |
| 18 | Are components being used according to their design standards? | Use components in accordance with their design intent |

### Writing (Items 19-21)

Items related to text content.

| # | Check item | Related guideline |
|---|-----------|-------------------|
| 19 | Are names aligned with fundamental concepts? | [Writing Guidelines](./writing.md) |
| 20 | Do navigation flows and action names follow the standards? | Unified button labels and link text |
| 21 | Do error messages follow the standards? | [Content Guidelines](./content-guidelines.md) |

### Accessibility (Item 22)

| # | Check item | Related guideline |
|---|-----------|-------------------|
| 22 | Has the accessibility quick checklist been applied? | [Accessibility Guidelines](./accessibility.md) |

## Item Details

### 1. Understanding User Workflows

Clarify the following before starting design:

- Who is the user (persona)
- What problem are they trying to solve
- In what context will they use it
- What defines success

### 2. Conceptual Model

Design the mental model that helps users understand the system:

- What are the system's primary "objects"
- What are the relationships between objects
- What operations are possible

### 6. Eye Flow Guidance

Design the flow of the user's gaze:

- F-pattern (screens where information is arranged vertically)
- Z-pattern (first-time views or screens with minimal scrolling)
- Eye movement from larger elements to smaller elements

### 15. Error State Consideration

When an error occurs:

1. **Event**: Explain what happened
2. **Cause**: Explain why it happened
3. **Resolution**: Explain how to resolve it

### 16. Confirmation Step

Display a confirmation dialog before dangerous operations:

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
| At design completion | Check for gaps and omissions |
| During review | Ensure quality |
| Before release | Final confirmation |

## Reference Links

- [Design Patterns](./design-patterns.md)
- [Accessibility Checklist](./accessibility.md)
- [Content Guidelines](./content-guidelines.md)
- [Design Review](./design-review.md)
