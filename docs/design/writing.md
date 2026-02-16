# Writing Guidelines

## Overview

Good writing is a key element of a great user experience. This guide establishes the principles and rules for creating consistent, readable, and clear text across the product.

## 3 Core Principles

### 1. Tailor Information to the Purpose

Consider the reader's context (where they are reading, their prior knowledge, etc.) and carefully select what to communicate and how to express it.

| Considerations | Example |
|---------------|---------|
| Reader's knowledge level | Whether to use technical terms or plain language |
| Reading context | Quick scan vs. in-depth reading |
| Information needs | Overview only vs. full details |

### 2. Choose Words Carefully

Select words thoughtfully, keeping in mind the impression they will make on the reader.

- Prefer positive phrasing
- Avoid vague expressions
- Use language familiar to the reader

### 3. Use Correct Grammar

Pay attention to sentence structure and follow proper grammar rules.

- Subject-verb agreement
- Modifier placement
- Proper use of prepositions and articles

## Practical Rules

### Keep sentences concise

Long sentences are hard to read and understand. Aim for short, clear sentences.

```
Bad:  By using this feature, users will be able to change their
      notification preferences from their account settings screen,
      which allows for greater customization. (too long)

Good: Use this feature to change notification settings from your account. (concise)
```

### Clarify subjects and objects

Make subjects explicit and do not omit grammatical objects.

```
Bad:  Deleted data.
Good: The data was deleted.

Bad:  Can change settings.
Good: You can change the settings.
```

### Use punctuation appropriately

Place punctuation at meaningful chunk boundaries. Avoid breaking text into unnecessarily small fragments.

```
Bad:  Tomorrow, with Mr. Tanaka, in the meeting room, we will, have a meeting.
Good: Tomorrow we will have a meeting with Mr. Tanaka in the meeting room.
```

### Avoid double negatives

Double negatives are hard to understand. Prefer affirmative phrasing.

```
Bad:  You cannot complete without entering input.
Good: Enter input to complete.

Bad:  Not configuring does not mean you won't be notified.
Good: You will be notified even without configuring.
```

### Maintain consistent notation

Use standard characters as the default and keep notation consistent across the project.

| Category | Rule |
|----------|------|
| Characters | Use standard character sets |
| Numbers | Use digits with commas every 3 digits (e.g., 100,000) |
| Symbols | Use standard punctuation consistently |
| Units | No space between number and unit (e.g., 10px) |

## 5 Writing Goals

### 1. Consistency

Use unified expressions to prevent notation from varying across screens.

```
Bad:  "Save changes" on screen A, "Save" on screen B
Good: Use "Save" consistently across all screens
```

### 2. Cohesion

Unify the vocabulary used throughout the product so users do not experience inconsistencies between screens.

### 3. Discoverability

Structure content and use familiar terminology so users can easily find the information they need.

- Prefer commonly used terms
- Include keywords that users are likely to search for

### 4. Standardization

Publish the rationale behind word choices so that consistent quality is maintained regardless of individual skill or preference.

### 5. Efficiency

Leverage established writing patterns and examples to streamline the word selection process.

## UI Text Rules

### Button Labels

| Type | Format | Example |
|------|--------|---------|
| Action button | Ends with a verb | Save, Delete |
| Confirmation button | Noun or verb | OK, Cancel, Close |
| Navigation | Noun | Home, Settings |

### Error Messages

Refer to the [Content Guidelines](./content-guidelines.md).

### Placeholders

```
Bad:  Please enter a value
Good: e.g., John Smith
```

### Labels

```
Bad:  Enter your name:
Good: Name
```

## Prohibited Practices

- Using raw machine translation output
- Using technical jargon without explanation
- Overuse of honorifics (overly polite expressions)
- Using imperative forms (except for user instructions)
- Excessive use of "etc." or "and so on"

## References

- [Content Guidelines](./content-guidelines.md)
- [Accessibility Guidelines](./accessibility.md)
