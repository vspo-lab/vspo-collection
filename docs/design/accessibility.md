# Accessibility Checklist

## Overview

Accessibility is essential for ensuring that all users can use the product. This checklist is organized into 7 categories based on WCAG 2.1 guidelines.

## 1. Alternative Text

Provide appropriate alternative text for images and media content.

| Check Item | Details |
|------------|--------|
| Images have alternative text | Set the `alt` attribute on all `<img>` tags |
| Decorative images can be ignored | Set `alt=""` or `role="presentation"` on decorative images |

### Implementation Examples

```tsx
// Image that conveys information
<img src="/article-image.jpg" alt="Aerial photograph of Tokyo's night skyline" />

// Decorative image
<img src="/decorative-line.png" alt="" role="presentation" />

// Image inside a link
<a href="/home">
  <img src="/logo.svg" alt="Return to home" />
</a>
```

## 2. Video & Audio

Ensure accessibility of video and audio content.

| Check Item | Details |
|------------|--------|
| Video audio has captions | Users with hearing impairments can understand the content |
| Video content has audio descriptions or text alternatives | Users with visual impairments can understand the content |
| Auto-playing audio, video, or animations can be paused | Users can control playback |
| No content flashes or strobes more than 3 times per second | Prevents photosensitive seizures |

### Implementation Example

```tsx
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track kind="captions" src="/captions-en.vtt" srclang="en" label="English captions" />
</video>
```

## 3. Markup

Use semantic HTML markup.

| Check Item | Details |
|------------|--------|
| Tables are marked up with `<table>` | Do not use tables for layout purposes |
| Headings are marked up with `<h1>` through `<h6>` | Use heading levels in sequential order |
| Lists are marked up with `<ul>`, `<ol>`, or `<dl>` | Use the appropriate list element |
| Whitespace characters are not used for layout | Control layout with CSS |
| No duplicate `id` attributes exist on the same page | The `id` attribute must be unique |

### Correct Use of Headings

```tsx
// Good: Sequential heading order
<h1>Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1-1</h3>
<h2>Section 2</h2>

// Bad: Skipping heading levels
<h1>Page Title</h1>
<h3>Section 1</h3>  {/* Skipped h2 */}
```

## 4. Perceivability and Distinguishability

Ensure that visual and auditory information is conveyed appropriately.

| Check Item | Details |
|------------|--------|
| Content remains accessible when the screen is zoomed to 200% or the text size is doubled | Responsive design |
| Contrast ratio between background and text is at least 4.5:1 (3:1 for large text 29px+) | Ensure readability |
| Content is not described solely by color, shape, sound, or layout | Convey information through multiple means |

### Contrast Ratio Standards

| Target | Minimum Contrast Ratio |
|--------|----------------------|
| Normal text (under 14px) | 4.5:1 |
| Large text (18px+ or 14px+ bold) | 3:1 |
| UI components | 3:1 |

### Avoid Relying on Color Alone

```tsx
// Bad: Indicating an error with color only
<input className="border-red-500" />

// Good: Indicating an error with color + icon + text
<div>
  <input className="border-red-500" aria-invalid="true" aria-describedby="error-msg" />
  <span id="error-msg" className="text-red-600">
    <ErrorIcon /> There is an error in the input
  </span>
</div>
```

## 5. Operability

Ensure that content is operable with a keyboard and other input devices.

| Check Item | Details |
|------------|--------|
| Keyboard operable | All interactive elements can receive focus |
| Keyboard navigation order matches visual order | Set `tabindex` appropriately |
| No time limits are imposed on content | Allow extensions or removal when time limits are necessary |

### Visible Keyboard Focus

```css
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

## 6. Navigation

Provide clear in-page navigation.

| Check Item | Details |
|------------|--------|
| The page language is specified on `<html>` | `<html lang="en">` |
| The page title describes the page content | Use specific, unique titles |
| Main content has headings | Facilitates navigation with screen readers |
| Link text clearly indicates the destination | Avoid links that only say "click here" |

### Improving Link Text

```tsx
// Bad: Unclear link destination
Please review <a href="/policy">here</a>.

// Good: Clear link destination
Please review the <a href="/policy">Privacy Policy</a>.
```

## 7. Forms

Ensure form input accessibility.

| Check Item | Details |
|------------|--------|
| Input purpose and actions are displayed as labels | Use `<label>` elements |
| Form controls have accessible names | Use `aria-label` or `aria-labelledby` |
| Errors and their details are identifiable | Display error messages clearly |
| Selecting or entering values does not cause unexpected major changes | Avoid actions the user did not intend |

### Form Implementation Example

```tsx
<div>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <span id="email-error" role="alert" className="text-error">
      Please enter a valid email address
    </span>
  )}
</div>
```

## How to Use This Checklist

1. Review this checklist when development is complete
2. Verify each item and fix any issues found
3. Re-check the checklist after making fixes
4. Confirm all items pass before releasing

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
