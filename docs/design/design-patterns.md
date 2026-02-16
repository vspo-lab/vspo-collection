# Design Patterns

## Overview

Design patterns are proven solutions to recurring UI challenges. This guide defines 8 key design patterns.

## Eye Tracking

Patterns that guide the user's eye movement to lead them naturally to important information.

### Fundamental Principles

#### 1. Eyes move from top to bottom

| Pattern | Characteristics | When to Use |
|---------|----------------|-------------|
| F-pattern | Left-to-right, then downward repeatedly | List views, settings screens, vertically stacked content |
| Z-pattern | Top-left to top-right, bottom-left to bottom-right | Modals, login screens, first-visit or minimal-scroll pages |

#### 2. Eyes move from larger elements to smaller elements

Use heading levels in order and keep inner spacing narrower than outer spacing to create a hierarchical visual flow.

### Implementation Notes

- Recognize that these patterns break down when users have a clear goal in mind
- Be aware that multiple patterns interact with each other
- Use headings and whitespace to establish starting points and boundaries for eye movement
- Account for variations across devices and screen widths
- Combine with accessibility support rather than relying on eye tracking alone

## Visual Grouping

Patterns that create visual cohesion among related elements.

### 3 Grouping Methods

| Method | Characteristics | When to Use |
|--------|----------------|-------------|
| Whitespace | Reduces visual complexity | When elements can be positioned by relevance |
| Rectangles | Clearly defines group boundaries | When containing multiple sub-groups |
| Dividers | Shows explicit boundaries | As a last resort when whitespace or rectangles are insufficient |

### Hierarchy

```
Section (heading + content)
└── Block (group within a section)
    └── Element
```

### Design Guidelines

- **Maintain consistency**: Apply the same grouping method to elements at the same level
- **Watch hierarchy depth**: Deeper nesting makes it harder to understand relationships
- **Use TabBar/SideNav**: Use dedicated components for switching between multiple sections

## Page Layout

Patterns for designing overall page structure.

### Basic Structure

```
┌─────────────────────────────┐
│         AppHeader           │
├─────────────────────────────┤
│ Container                   │
│ ┌─────────────────────────┐ │
│ │ Page Title + Lead Text  │ │
│ ├─────────────────────────┤ │
│ │                         │ │
│ │     Main Content        │ │
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 6 Layout Types

| Type | Description | Usage |
|------|-------------|-------|
| Collection (Table/List) | List of objects | Article list, user list |
| Single (1-Column) | Parallel information sections | Detail pages, settings |
| Single (2-Column) | Primary/secondary content distinction | Profiles, dashboards |
| Single (Custom View) | 2D interactive content | Maps, charts |
| Side Navigation + Content | Broad navigation | Settings, documentation |
| Collection + Single | List-detail pair | Email, chat |

### Lead Text

Include lead text in the header area so users can quickly understand the page's purpose.

```tsx
<header>
  <h1>Articles</h1>
  <p className="text-text-secondary">
    Manage your published articles. Create new articles or edit existing ones.
  </p>
</header>
```

### Managing Page Length

Ways to avoid excessive vertical scrolling:

- Collapse content with disclosure widgets
- Split pages using TabBar, SideNav, or SideMenu
- Reduce information density

## Mobile Layout

UI design patterns for smartphones.

### Core Principles

| Aspect | Desktop | Mobile |
|--------|---------|--------|
| Columns | Multi-column possible | Single column recommended |
| Scrolling | 2D allowed (e.g., maps) | Vertical scrolling only recommended |
| Information | Detailed display possible | Show only essential information |
| Interaction | Multiple actions possible | Limit to simple actions |

### Design Approach

```tsx
// Responsive vs Adaptive
// Responsive: Same elements, structure, and data — only the layout changes
// Adaptive: Structure, data, and presentation change based on screen width or device
```

### Implementation

```tsx
// Mobile detection
const { isMobile } = useEnvironment();

// Responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

## Feedback

Patterns for designing responses to user actions.

### Core Principles

| Principle | Description |
|-----------|-------------|
| Passive awareness | Users can see the result without actively checking |
| Proximity | Display feedback near the element the user interacted with |
| Screen reader support | Maintain proper reading order |

### Feedback Patterns

#### Form Input & Submission

```tsx
// Validation error
<FormControl error={!!errors.email}>
  <Label>Email address</Label>
  <Input {...register("email")} />
  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
</FormControl>
```

#### Loading State

```tsx
<Button loading={isSubmitting}>
  {isSubmitting ? "Submitting..." : "Submit"}
</Button>
```

#### Completion Notification

```tsx
// On success
<ResponseMessage status="success">
  Saved successfully
</ResponseMessage>

// On error
<ResponseMessage status="error">
  Failed to save. Please try again.
</ResponseMessage>
```

## Modal UI

Modal UI patterns for completing specific tasks.

### When to Use

| Scenario | Example |
|----------|---------|
| Adding or editing an object | Creating an article, editing a profile |
| Sorting data | Configuring list sort order |
| Importing/exporting data | CSV import/export |
| Confirming destructive actions | Delete confirmation |
| Complex multi-step operations | Wizards |

### Implementation Patterns

| Pattern | Component | Usage |
|---------|-----------|-------|
| Modal dialog | Dialog | Small to medium forms |
| Full-page mode | FloatArea | When content is extensive |
| Partial-page mode | Drawer | Preserves awareness of the original layout |
| Step-based | StepFormDialog | Multi-step operations |

### Component Structure

```tsx
<Dialog>
  <DialogTitle>Create Article</DialogTitle>
  <DialogDescription>Enter the details for your new article.</DialogDescription>

  <DialogContent>
    <FormControl>
      <Label>Title</Label>
      <Input />
    </FormControl>
  </DialogContent>

  <DialogActions>
    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    <Button onClick={onSubmit}>Create</Button>
  </DialogActions>
</Dialog>
```

### Accessibility

**Avoid disabling the submit button.** Even when there are input errors, let users click the button and then display error feedback.

## Wizard

Patterns for completing tasks across multiple steps.

### When to Use

| Scenario | Example |
|----------|---------|
| Complex operations | Searching and selecting objects, editing files |
| Conditional branching | Subsequent fields change based on previous input |
| Confirmation with parameter input | Setting conditions before deletion |

### Core Principles

- **Avoid overuse**: Wizards restrict user behavior, so use them only when clearly beneficial
- **Show progress**: Always display the total number of steps and the current step

### Implementation

```tsx
<StepFormDialog
  currentStep={currentStep}
  totalSteps={3}
  title={`Import Articles (${currentStep}/3)`}
>
  {currentStep === 1 && <Step1 />}
  {currentStep === 2 && <Step2 />}
  {currentStep === 3 && <Step3 />}

  <DialogActions>
    {currentStep > 1 && (
      <Button variant="ghost" onClick={onBack}>Back</Button>
    )}
    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    {currentStep < 3 ? (
      <Button onClick={onNext}>Next</Button>
    ) : (
      <Button onClick={onComplete}>Import</Button>
    )}
  </DialogActions>
</StepFormDialog>
```

## Permission-Based Display Control

Patterns for showing or hiding UI elements based on user permissions.

### 4 Patterns

| Pattern | Behavior | Example |
|---------|----------|---------|
| A | Hide UI, no explanation | Do not show the feature at all to unauthorized users |
| B | Hide UI, explain why | Explain system-default permissions (e.g., cannot delete) |
| C | Disable UI, explain why | Cannot delete because the resource is in use |
| D | Show and enable UI | Normal state |

### How to Show the Reason

```tsx
// Show reason via Tooltip
<Tooltip content="This permission is used by the system and cannot be deleted">
  <Button disabled>Delete</Button>
</Tooltip>

// Using disabledReason
<Button
  disabled
  disabledReason="Cannot delete because another user is currently editing"
>
  Delete
</Button>
```

### Writing Guidelines

| Situation | Phrasing |
|-----------|----------|
| User can take action | "You cannot ... because ... is missing" |
| User cannot take action | "This cannot be done" |

## References

- [Design Principles](./design-principles.md)
- [Accessibility Guidelines](./accessibility.md)
- [CSS Guidelines](../css.md)
