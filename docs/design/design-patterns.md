# Design Patterns

## Overview

Design patterns are proven solutions to recurring UI challenges. This guideline defines 8 major design patterns.

## Eye Flow Guidance

A pattern for designing the flow of the user's gaze and naturally guiding them to important information.

### Fundamental Rules

#### 1. The eye moves from top to bottom

| Pattern | Characteristics | Applicable scenarios |
|---------|----------------|---------------------|
| F-pattern | Left-to-right, then downward repeatedly | List screens, settings screens, screens with vertically arranged information |
| Z-pattern | Top-left to top-right, bottom-left to bottom-right | Modals, login screens, first-time views or screens with minimal scrolling |

#### 2. The eye moves from larger elements to smaller elements

Use heading levels in order and set inner spacing narrower than outer spacing to achieve hierarchical eye flow guidance.

### Implementation Notes

- Recognize that the rules may not apply when users have a clear purpose
- Be aware that multiple rules interact with each other
- Use headings and spacing to set "starting points and boundaries for eye movement"
- Consider the impact of device and screen width variations
- Use alongside accessibility measures; do not rely on eye flow guidance alone

## Visual Grouping

A pattern for giving related elements a visual sense of cohesion.

### 3 Expression Methods

| Method | Characteristics | Use case |
|--------|----------------|----------|
| Spacing | Reduces screen complexity | When element placement by relatedness is possible |
| Rectangle | Clarifies group boundaries | When multiple child groups are present |
| Divider line | Displays clear boundaries | Last resort when spacing and rectangles are insufficient |

### Hierarchy

```
Section (heading + content)
└── Block (group within section)
    └── Element
```

### Design Guidelines

- **Maintain consistency**: Apply the same grouping method to elements at the same hierarchy level
- **Watch hierarchy depth**: Deeper hierarchies make it harder to grasp information relationships
- **Use TabBar/SideNav**: Use dedicated components for switching between multiple sections

## Page Layout

A pattern for designing the overall page composition.

### Basic Structure

```
┌─────────────────────────────┐
│         AppHeader           │
├─────────────────────────────┤
│ Container                   │
│ ┌─────────────────────────┐ │
│ │ Page title + Lead text  │ │
│ ├─────────────────────────┤ │
│ │                         │ │
│ │      Main content       │ │
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 6 Layout Types

| Type | Description | Use case |
|------|-------------|----------|
| Collection (Table/List) | List display of objects | Article list, user list |
| Single (1-Column) | Sections of parallel information | Detail pages, settings screens |
| Single (2-Column) | Primary/secondary information distinction | Profile, dashboard |
| Single (Custom View) | 2D interactive content | Maps, charts |
| Side Navigation + Content | Extensive navigation | Settings, documentation |
| Collection + Single | List-detail pair display | Email, chat |

### Lead Text

Implement lead text in the header area so users can quickly understand the page's purpose.

```tsx
<header>
  <h1>Article List</h1>
  <p className="text-text-secondary">
    Manage published articles. Create new articles or edit existing ones.
  </p>
</header>
```

### Page Length Management

Methods to avoid excessively long vertical scrolling:

- Collapse content with disclosures
- Split pages using TabBar, SideNav, or SideMenu
- Reduce information density

## Mobile Layout

UI design patterns for smartphones.

### Basic Principles

| Item | Desktop | Mobile |
|------|---------|--------|
| Columns | Multi-column possible | Single column recommended |
| Scrolling | 2D possible (maps, etc.) | Vertical scrolling only recommended |
| Information density | Detailed display possible | Only essential information |
| Operations | Multiple operations possible | Limited to simple operations |

### Design Approach

```tsx
// Responsive vs Adaptive
// Responsive: Same elements, structure, and data with layout-only changes
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

A pattern for designing responses to user actions.

### Basic Principles

| Principle | Description |
|-----------|-------------|
| Passive recognition | Users can see results without actively checking |
| Proximity display | Display feedback near the operated element |
| Screen reader support | Maintain appropriate reading order |

### Feedback Patterns

#### Form Input / Submission

```tsx
// Validation error
<FormControl error={!!errors.email}>
  <Label>Email address</Label>
  <Input {...register("email")} />
  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
</FormControl>
```

#### Processing State

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

A modal UI pattern for completing specific tasks.

### Use Cases

| Scenario | Example |
|----------|---------|
| Adding/editing objects | Article creation, profile editing |
| Sorting data | List sort settings |
| Importing/exporting data | CSV import/export |
| Confirming destructive actions | Deletion confirmation |
| Complex sequential operations | Wizards |

### Implementation Patterns

| Pattern | Component | Use case |
|---------|-----------|----------|
| Modal dialog | Dialog | Small to medium forms |
| Full-page mode | FloatArea | When there is a lot of information |
| Partial-page mode | Drawer | Maintain awareness of original layout |
| Step-based | StepFormDialog | Multi-step operations |

### Structural Elements

```tsx
<Dialog>
  <DialogTitle>Create Article</DialogTitle>
  <DialogDescription>Enter the new article information.</DialogDescription>

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

**Avoid disabling the submit button**. Even when there are input errors, let the user press the button and then display error feedback.

## Wizard

A pattern for completing operations across multiple steps.

### Use Cases

| Scenario | Example |
|----------|---------|
| Complex operations | Object search and selection, file editing |
| Conditional branching | Subsequent items change based on input content |
| Confirmation with parameter input | Condition settings before deletion |

### Basic Principles

- **Avoid overuse**: Limit to particularly effective cases since it restricts user behavior
- **Progress display**: Always show the total number of steps and the current step

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

A pattern for controlling UI visibility based on user permissions.

### 4 Patterns

| Pattern | Approach | Example |
|---------|----------|---------|
| A | Hide UI, hide reason | Do not show the feature at all to unauthorized users |
| B | Hide UI, show reason | Explain system-standard permissions (e.g., cannot delete) |
| C | Show UI as disabled, show reason | Cannot delete because it is in use |
| D | Show UI, allow interaction | Normal state |

### Displaying the Reason

```tsx
// Show reason via Tooltip
<Tooltip content="This permission cannot be deleted because it is used by the system">
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

| Situation | Expression |
|-----------|------------|
| User can take action | "Cannot [action] because [reason]" |
| User cannot take action | "Cannot [action]" |

## Reference Links

- [Design Principles](./design-principles.md)
- [Accessibility Guidelines](./accessibility.md)
- [CSS Guidelines](../css.md)
