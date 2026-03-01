# Writing Guidelines

## Overview

Writing clear and effective text is an important factor in improving user experience. This guideline establishes principles and rules for creating consistent, readable, and easy-to-understand text.

## 3 Fundamental Principles

### 1. Select Information Based on Purpose

Consider the reader's context (reading environment, prior knowledge, etc.) and carefully choose what to convey and how to express it.

| Consideration | Example |
|---------------|---------|
| Reader's knowledge level | Whether to use technical terms or plain language |
| Reading context | Reading in a hurry vs. reading at leisure |
| Information needs | Wanting just an overview vs. wanting full details |

### 2. Choose Words Carefully

Select words thoughtfully, keeping in mind the impression the reader will receive.

- Prefer positive expressions
- Avoid ambiguous expressions
- Use words familiar to the reader

### 3. Correct Grammar

Be mindful of the elements that compose sentences and follow grammar rules correctly.

- Subject-predicate agreement
- Modifier placement
- Proper use of particles

## Practical Rules

### Keep Sentences Short (Around 50 Characters)

Long sentences are hard to read and understand. Aim for approximately 50 characters per sentence.

```
NG: Using this feature, users will be able to change their notification
    reception settings from their account settings screen. (Too long)

OK: Use this feature to change notification settings from account settings. (Concise)
```

### Clarify Subjects and Particles

Make subjects explicit and do not omit particles.

```
NG: Data deleted.
OK: The data has been deleted.

NG: Can change settings.
OK: You can change the settings.
```

### Use Punctuation Appropriately

Place punctuation at chunk boundaries to separate meaningful groups. However, avoid breaking text into overly small fragments with unnecessary punctuation.

```
NG: Tomorrow, with Tanaka, in the meeting room, we will have, a meeting.
OK: Tomorrow, we will have a meeting with Tanaka in the meeting room.
```

### Avoid Double Negatives

Double negatives are hard to understand, so prefer affirmative sentences.

```
NG: You cannot complete without entering input.
OK: You can complete by entering input.

NG: Notifications will not fail to be sent even without configuration.
OK: Notifications will be sent even without configuration.
```

### Consistent Notation

Use standard characters as a baseline and maintain consistent notation within the project.

| Category | Rule |
|----------|------|
| Characters | Use standard characters as a baseline |
| Numbers | Use half-width digits with commas every 3 digits (e.g., 100,000) |
| Symbols | Use appropriate punctuation (periods, parentheses, etc.) |
| Units | No space between numbers and units (e.g., 10px) |

## Document (Markdown) Writing

Apply the same quality standards not only to UI text but also to technical documents in `docs/`.

### Heading Design

- Use only one `#` per file
- Use `##` for sections and `###` for subsections as a baseline
- Use heading names that convey content at a glance

### State the Purpose at the Beginning

Write 1-2 sentences at the start of the document explaining "what this document defines."
This allows readers to quickly determine whether they need the information.

### Distinguish Between Bullet Points and Steps

- Use numbered lists for sequential explanations
- Use bullet points for non-sequential explanations
- Follow the one-item-one-message rule

### Code Block Principles

- Include executable units
- Specify the language (e.g., `bash`, `ts`, `json`)
- Write prerequisites immediately before the code block

### Link Usage

- Use relative paths for in-repository references
- Use link text that indicates the destination rather than "here" or "click here"
- Prefer primary sources (official documentation) as the basis for specifications

### Integration with textlint

Text quality is ensured through a combination of manual review and `textlint`.
See [docs/security/textlint.md](../security/textlint.md) for detailed operational guidelines.

## 5 Writing Goals

### 1. Consistency

Use unified expressions so that notation does not vary from screen to screen.

```
NG: "Save changes" on Screen A, "Submit" on Screen B
OK: Use "Save" consistently across all screens
```

### 2. Uniformity

Unify the language used across the entire product to avoid giving users an inconsistent impression between different screens.

### 3. Searchability

Structure content so that users can easily find the information they need, and use familiar terms.

- Prefer commonly used terminology
- Include keywords that are easy to search for

### 4. Standardization

By publishing the rationale behind word choices, ensure consistent quality regardless of individual skills or preferences.

### 5. Efficiency

Leverage writing patterns and examples to facilitate smooth decision-making about word choices.

## UI Text Rules

### Button Labels

| Type | Format | Example |
|------|--------|---------|
| Action button | Ends with a verb | Save, Delete |
| Confirmation button | Noun or verb | OK, Cancel, Close |
| Navigation | Noun | Home, Settings |

### Error Messages

See [Content Guidelines](./content-guidelines.md).

### Placeholders

```
NG: Please enter
OK: e.g., John Doe
```

### Labels

```
NG: Enter your name:
OK: Name
```

## Prohibited Practices

- Using machine translations as-is
- Using technical terms without explanation
- Excessive use of honorifics (overly polite expressions)
- Using imperative forms (except for user instructions)
- Overusing "etc." or "and so on"

## Reference Links

- [Content Guidelines](./content-guidelines.md)
- [Accessibility Guidelines](./accessibility.md)
