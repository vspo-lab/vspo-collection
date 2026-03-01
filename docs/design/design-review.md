# Design Review

## Overview

Design review is an important process for ensuring product quality. This guideline defines two types of review processes: information architecture review and UI review.

## Information Architecture Review

A review that examines whether the product's information structure is appropriate.

### Scope

| Scope | Description |
|-------|-------------|
| New application development | Newly developed applications |
| Large-scale feature development | Major feature additions to existing products |

### Timing

Conduct the review when the design outline has been established and is ready to share with the development team.

### Required Materials

| Material | Description |
|----------|-------------|
| Information architecture outputs | IA diagrams, sitemaps, flow diagrams, etc. |
| Screen layouts | Design files or screen captures |

### Participant Roles

| Role | Person | Responsibility |
|------|--------|----------------|
| Reviewee | Assigned designer | Accountable for explaining design decisions |
| Support | Development team (optional) | Support the reviewee |
| Facilitator | Moderator | Facilitate proceedings and organize discussions |
| Reviewer | Other participants | Provide feedback |

### Evaluation Criteria

Evaluation is conducted on a 4-level scale.

| Rating | Description | Next action |
|--------|-------------|-------------|
| Good | No issues | Proceed as-is |
| Minor issues | Small improvements needed | Fix, no re-review needed |
| Clear issues | Clear problems exist | Fix/redesign, then re-review |
| Fundamental issues | Design rethink required | Restart from design phase |

### Expected Feedback

| Perspective | Specific examples |
|-------------|-------------------|
| Are there concerns with the information architecture outputs? | Object definitions, screen transitions, navigation structure |
| Is there a gap between the screens and the information architecture? | Consistency between design intent and screen representation |

**Note**: Details such as spacing and component selection are handled in the UI review.

### Review Process

1. **Preparation**: Reviewee shares materials (at least 2 business days before the review)
2. **Presentation**: Reviewee explains the intent of the information architecture (15 min)
3. **Q&A**: Respond to reviewer questions (20 min)
4. **Feedback**: Reviewers provide feedback (15 min)
5. **Summary**: Determine evaluation and confirm next actions (10 min)

## UI Review

A review conducted on the concrete surface-level aspects of product design.

### Scope

| Scope | Description |
|-------|-------------|
| New application development | Newly developed applications |
| Medium to large-scale feature development | Feature additions to existing products |

### Timing

| Development type | Timing |
|-----------------|--------|
| New development | After information architecture review is complete |
| Medium-scale development | At the assigned designer's preferred time |

### Participants

| Role | Count |
|------|-------|
| Assigned designer (reviewee) | 1 person |
| Reviewer | 1 person (randomly assigned) |

### Review Format

**Asynchronous review** is the default format.

1. Reviewee shares the design file
2. Reviewer provides feedback via comments
3. Reviewee responds and makes corrections

### Expected Feedback

Feedback is provided in the following format:

| Element | Description |
|---------|-------------|
| Checklist number | Checklist number from [Design Principles](./design-principles.md) |
| Target | Specific screen/element |
| Feedback content | Issue and improvement suggestion |

#### Feedback Example

```
[#7 Visual Grouping]
Settings screen - "Notification Settings" section

Issue: The spacing between "Email notifications" and "Push notifications"
      is too narrow, making them appear as the same group.

Suggestion: Increase the section spacing from 24px to 40px to
           clarify the group boundaries.
```

### Review Goal

The ideal is **a single round-trip communication** where the reviewee receives feedback and responds to decisions outside the checklist.

### Checklist Usage

The UI review utilizes the 22-item checklist from [Design Principles](./design-principles.md).

Especially important items:

| # | Item |
|---|------|
| 6 | Eye flow guidance |
| 7 | Visual grouping |
| 8 | Page layout |
| 9 | Spacing |
| 10 | Mobile layout |
| 11 | Feedback |
| 17 | Avoiding custom components |
| 21 | Error messages |

## Review Process Flow

```
┌─────────────────────────────────────────────────────────┐
│                    For new development                   │
├─────────────────────────────────────────────────────────┤
│  Start design                                           │
│      ↓                                                  │
│  Create information architecture outputs                │
│      ↓                                                  │
│  [IA Review] ←──── Re-review if rated                   │
│      │             "Clear issues" or above              │
│      ↓                                                  │
│  Create UI design                                       │
│      ↓                                                  │
│  [UI Review] ←───── Revise and re-confirm as needed     │
│      ↓                                                  │
│  Start development                                      │
└─────────────────────────────────────────────────────────┘
```

## Review Request Templates

### Information Architecture Review Request

```markdown
## Information Architecture Review Request

### Project Name
[Project name]

### Overview
[Brief description of the project]

### Material Links
- Information architecture: [Link]
- Screen layouts: [Link]

### Preferred Date
[List candidate dates]

### Points to Focus On
- [Focus point 1]
- [Focus point 2]
```

### UI Review Request

```markdown
## UI Review Request

### Target Screens
[List of target screens]

### Design File
[Figma or other link]

### Background / Context
[Design background and constraints]

### Points to Focus On
- [Focus point 1]
- [Focus point 2]
```

## Reference Links

- [Design Principles](./design-principles.md)
- [Design Patterns](./design-patterns.md)
- [Accessibility Checklist](./accessibility.md)
