# Content Guidelines

## Overview

The content guidelines provide direction for creating user-facing text content consistently. This document defines how to write error messages, help pages, and release notes.

## Error Messages

### Purpose

The role of an error message is to **help users understand the problem and take the next action to resolve it**.

### 3 Core Elements

| Element | Description | Example |
|---------|-------------|---------|
| Event | What happened (from the user's perspective) | "Could not save the article" |
| Cause | Why it happened | "Title is required" |
| Resolution | How to fix it | "Please enter a title" |

### Priority

When there is not enough space to display all elements, prioritize in this order:

```
1. Cause -> 2. Resolution -> 3. Event
```

**Rationale**: The user's top priority is completing their task, so resolution information is the most important.

### Implementation Examples

#### Full Message (when sufficient space is available)

```tsx
<ErrorMessage>
  <p>Could not save the article.</p>
  <p>Title is required. Please enter a title.</p>
</ErrorMessage>
```

#### Concise Message (when space is limited)

```tsx
<ErrorMessage>
  Please enter a title
</ErrorMessage>
```

### Error Message Patterns

#### Input Errors

| Type | Example Message |
|------|----------------|
| Required field empty | "Please enter [field name]" |
| Format error | "[Field name] format is invalid" |
| Character limit | "[Field name] must be [N] characters or fewer" |
| Duplicate error | "This [field name] is already in use" |

#### System Errors

| Type | Example Message |
|------|----------------|
| Network error | "Connection failed. Please try again later" |
| Permission error | "You do not have permission to perform this action" |
| Resource not found | "The page you are looking for could not be found" |

### Prohibited Practices

- Displaying only technical error codes (e.g., `Error: 500`)
- Blaming the user (e.g., "You made an input mistake")
- Vague messages (e.g., showing only "An error occurred")
- Warnings without a resolution

## Help Pages

### 5 Page Types

Prepare 5 types of help pages aligned with what users want to know.

| Type | Purpose | Content |
|------|---------|---------|
| Feature Overview | Explain what a feature is | Feature definition, design intent, capabilities |
| How-To Guide | Explain how to use it | Step-by-step instructions, notes |
| Specifications | Organize settings and limitations | Configuration values, constraints, supported formats |
| FAQ | Answer specific questions | Error troubleshooting, specification questions, common inquiries |
| Glossary | Define technical terms | App-specific terms, industry terminology |

### Feature Overview Page Structure

```markdown
# Feature Name

## What This Feature Does
[Describe the feature overview in 1-2 sentences]

## Key Characteristics
- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]

## Related Features
- [Link to related feature]
```

### How-To Guide Page Structure

```markdown
# How to [Do Something]

## Prerequisites
[Required settings or permissions]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Notes
- [Note 1]
- [Note 2]

## Related Actions
- [Link to related action]
```

### FAQ Page Structure

```markdown
# Frequently Asked Questions

## Category 1
### Q. [Question]
A. [Answer]

### Q. [Question]
A. [Answer]

## Category 2
### Q. [Question]
A. [Answer]
```

### Writing Tips

- Consider the user's mental model
- Judge the appropriate depth of information needed
- Remove unnecessary information (noise)
- Add explanations for technical terms when needed

## Release Notes

### Purpose

Release notes communicate updates such as new features and bug fixes to users.

### Core Principle

Describe **"what users can now do"** rather than **"what changed"**.

| Approach | Example |
|----------|---------|
| Bad: List feature changes | "Added filter feature to notifications" |
| Good: Describe the user experience | "You can now filter notifications by type" |

### Structure

```markdown
# Release Notes

## YYYY-MM-DD

### New Features
- [What users can now do]
- [What users can now do]

### Improvements
- [What became more convenient]
- [What became more convenient]

### Fixes
- [Issue that was resolved]
- [Issue that was resolved]
```

### Categories

| Category | Description | Example |
|----------|-------------|---------|
| New Features | Newly added functionality | "You can now export articles as CSV" |
| Improvements | Enhancements to existing features | "Search result loading speed has improved" |
| Fixes | Bug fixes | "Fixed an issue where images could not be uploaded under certain conditions" |

### Writing Tips

| Tip | Description |
|-----|-------------|
| Be specific | Instead of "improved," describe what changed and how |
| Write from the user's perspective | Focus on user impact, not technical changes |
| Be concise | Keep each item to 1-2 sentences |
| Use positive framing | Prefer "you can now..." over "fixed a problem where you couldn't..." |

### Prohibited Practices

- Listing only technical changes
- Including internal changes irrelevant to users
- Using vague wording (e.g., only "various improvements" or "performance improvements")

## Accessibility Considerations in Writing

### Categories

User-support text is also important from an accessibility perspective.

| Target | Considerations |
|--------|---------------|
| Error messages | Consider that screen readers will read the text aloud |
| Help pages | Use proper heading structure to facilitate navigation |
| Release notes | Write clearly and concisely so all users can understand |

## References

- [Writing Guidelines](./writing.md)
- [Accessibility Checklist](./accessibility.md)
- [Design Patterns - Feedback](./design-patterns.md#feedback)
