# Content Guidelines

## Overview

Content guidelines provide direction for creating user-facing text content with consistency. This guideline defines how to create error messages, help pages, and release notes.

## Error Messages

### Purpose

The role of error messages is to **enable users to resolve the problem and proceed to the next action upon reading the message**.

### 3 Basic Elements

| Element | Description | Example |
|---------|-------------|---------|
| Event | What happened (from the user's perspective) | "Could not save the article" |
| Cause | Why it happened | "Title has not been entered" |
| Resolution | How to resolve it | "Please enter a title" |

### Priority

When all elements cannot be displayed, show them in the following priority order:

```
1. Cause → 2. Resolution → 3. Event
```

**Reason**: The user's top priority is "completing the operation," making resolution information the most important.

### Implementation Examples

#### Full Message (When Sufficient Space Is Available)

```tsx
<ErrorMessage>
  <p>Could not save the article.</p>
  <p>Title has not been entered. Please enter a title.</p>
</ErrorMessage>
```

#### Concise Message (When Space Is Limited)

```tsx
<ErrorMessage>
  Please enter a title
</ErrorMessage>
```

### Error Message Patterns

#### Input Errors

| Type | Example message |
|------|----------------|
| Required field empty | "Please enter [field name]" |
| Format error | "[field name] format is incorrect" |
| Character limit | "Please enter [field name] within [N] characters" |
| Duplicate error | "This [field name] is already in use" |

#### System Errors

| Type | Example message |
|------|----------------|
| Communication error | "Communication failed. Please try again later" |
| Permission error | "You do not have permission to perform this action" |
| Resource not found | "The page you are looking for could not be found" |

### Prohibited Practices

- Displaying only technical error codes (e.g., `Error: 500`)
- Blaming the user (e.g., "Input mistake")
- Ambiguous expressions (e.g., only "An error occurred")
- Warnings without resolution guidance

## Help Pages

### 5 Types of Structure

Prepare 5 types of help pages aligned with what users "want to know."

| Type | Purpose | Content |
|------|---------|---------|
| Feature overview | Explain what the feature is | Feature definition, design philosophy, capabilities |
| Step-by-step guide | Explain how to operate | Step-by-step instructions, notes |
| Specifications list | Organize settings and limitations | Setting values, restrictions, supported formats |
| FAQ | Answer specific questions | Error handling, specification questions, common questions |
| Glossary | Define technical terms | App-specific terms, industry terms |

### Feature Overview Page Structure

```markdown
# Feature Name

## What You Can Do with This Feature
[Explain the feature overview in 1-2 sentences]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Related Features
- [Link to related feature]
```

### Step-by-Step Guide Page Structure

```markdown
# How to [Action]

## Prerequisites
[Required settings or permissions beforehand]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Notes
- [Note 1]
- [Note 2]

## Related Operations
- [Link to related operation]
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
- Appropriately judge the depth of information needed
- Eliminate unnecessary information (noise)
- Add explanations for technical terms as needed

## Release Notes

### Purpose

Release notes are documents that communicate updates such as feature additions and bug fixes to users.

### Basic Principle

Describe **"how users can now use it"** rather than **"what changed."**

| Approach | Example |
|----------|---------|
| NG: List feature changes | "Added filter function to notifications" |
| OK: Describe user experience | "You can now filter notifications by type" |

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
| New Features | Newly added features | "You can now export articles as CSV" |
| Improvements | Enhancements to existing features | "Search result loading speed has been improved" |
| Fixes | Bug fixes | "Fixed an issue where images could not be uploaded under certain conditions" |

### Writing Tips

| Tip | Description |
|-----|-------------|
| Be specific | Instead of "improved," describe what improved and how |
| Write from the user's perspective | Focus on user impact, not technical changes |
| Keep it concise | About 1-2 sentences per item |
| Use positive expressions | Prefer "You can now [do X]" over "[X] was broken" |

### Prohibited Practices

- Listing only technical changes
- Including internal changes unrelated to users
- Ambiguous expressions (only "various improvements" or "performance enhancements")

## Accessibility-Related Writing

### Classification

Text related to user support is also important from an accessibility perspective.

| Target | Consideration |
|--------|---------------|
| Error messages | Consider that they will be read aloud by screen readers |
| Help pages | Set heading structure appropriately to facilitate navigation |
| Release notes | Write in clear, concise language that all users can understand |

## Reference Links

- [Writing Guidelines](./writing.md)
- [Accessibility Checklist](./accessibility.md)
- [Design Patterns - Feedback](./design-patterns.md#feedback)
