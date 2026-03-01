# Accessibility Checklist

## Overview

Accessibility is an important element that ensures all users can use the product. This checklist is structured around 7 categories based on WCAG 2.1 standards.

## 1. Alternative Text

Provide appropriate alternative text for images and media content.

| Check item | Details |
|-----------|---------|
| Images have alternative text | Set the `alt` attribute on all `<img>` tags |
| Decorative images can be ignored | Set `alt=""` or `role="presentation"` on decorative images |

### Implementation Examples

```tsx
// Image conveying information
<img src="/article-image.jpg" alt="Aerial photograph of Tokyo's nightscape" />

// Decorative image
<img src="/decorative-line.png" alt="" role="presentation" />

// Image within a link
<a href="/home">
  <img src="/logo.svg" alt="Return to home" />
</a>
```

## 2. Video and Audio

Ensure accessibility of video and audio content.

| Check item | Details |
|-----------|---------|
| Video audio has captions | So users with hearing disabilities can understand the content |
| Audio or content describing video is available | So users with visual disabilities can understand the content |
| Auto-playing audio, video, or animation can be paused | Users can control playback |
| No flashing or strobing more than 3 times per second on screen | Prevention of photosensitive seizures |

### Implementation Examples

```tsx
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track kind="captions" src="/captions-ja.vtt" srclang="ja" label="Japanese captions" />
</video>
```

## 3. Markup

Use semantic HTML markup.

| Check item | Details |
|-----------|---------|
| Tables are marked up with `<table>` | Do not use tables for layout purposes |
| Headings are marked up with `<h1>` through `<h6>` | Use heading levels in sequential order |
| Lists are marked up with `<ul>`, `<ol>`, `<dl>` | Use appropriate list elements |
| Whitespace characters are not used for layout | Control layout with CSS |
| No duplicate `id` attributes exist on the same page | id attributes must be unique |

### Correct Usage of Headings

```tsx
// OK: Sequential heading order
<h1>Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1-1</h3>
<h2>Section 2</h2>

// NG: Skipping heading levels
<h1>Page Title</h1>
<h3>Section 1</h3>  {/* h2 skipped */}
```

## 4. Visibility, Audibility, and Distinguishability

Ensure that visual and auditory information is conveyed appropriately.

| Check item | Details |
|-----------|---------|
| Information remains accessible at 200% zoom or 2x text size | Responsive design |
| Background-to-text contrast ratio is 4.5:1 or higher (3:1 for large text 29px+) | Ensure readability |
| Content is not described solely by color, shape, sound, or layout | Convey information through multiple means |

### Contrast Ratio Standards

| Target | Minimum contrast ratio |
|--------|----------------------|
| Normal text (less than 14px) | 4.5:1 |
| Large text (18px+ or 14px+ bold) | 3:1 |
| UI components | 3:1 |

### Information Conveyed Without Relying on Color Alone

```tsx
// NG: Indicating error with color only
<input className="border-red-500" />

// OK: Indicating error with color + icon + text
<div>
  <input className="border-red-500" aria-invalid="true" aria-describedby="error-msg" />
  <span id="error-msg" className="text-red-600">
    <ErrorIcon /> There is an error in the input
  </span>
</div>
```

## 5. Operability

Ensure operability with keyboard and other input devices.

| Check item | Details |
|-----------|---------|
| Keyboard operable | All interactive elements can receive focus |
| Keyboard operation order matches visual order | Set tabindex appropriately |
| Content does not have time limits | If necessary, provide options to extend or disable |

### Keyboard Focus Visibility

```css
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

## 6. Navigation

Clarify in-page navigation.

| Check item | Details |
|-----------|---------|
| Page language is specified on `<html>` | `<html lang="ja">` |
| Page title represents the page content | Specific and unique titles |
| Main page content has headings | Facilitate navigation with screen readers |
| Link text allows identification of the link destination | Avoid links with only "click here" |

### Improving Link Text

```tsx
// NG: Link destination is unclear
Please check <a href="/policy">here</a>.

// OK: Link destination is clear
Please check our <a href="/policy">Privacy Policy</a>.
```

## 7. Forms

Ensure form input accessibility.

| Check item | Details |
|-----------|---------|
| Input content and operations are displayed as labels | Use `<label>` elements |
| Form parts have accessible names | `aria-label` or `aria-labelledby` |
| Error occurrence and error content can be identified | Display error messages clearly |
| Selecting/entering input fields does not cause major changes | Avoid unintended behavior for users |

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

## How to Use the Checklist

1. Review this checklist upon development completion
2. Verify each item and fix any issues found
3. Re-check the checklist after making fixes
4. Confirm all items are cleared before release

## Reference Links

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
