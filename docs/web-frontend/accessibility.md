# Accessibility Design Guidelines

This document defines accessibility requirements and implementation guidance for this project.

## Table of Contents

1. [Compliance Targets](#compliance-targets)
2. [React Aria Policy](#react-aria-policy)
3. [Current Assessment](#current-assessment)
4. [Implementation Guidelines](#implementation-guidelines)
5. [Component Requirements](#component-requirements)
6. [Testing Strategy](#testing-strategy)
7. [Checklists](#checklists)

---

## Compliance Targets

### WCAG 2.2 Level AA

The project target is **WCAG 2.2 Level AA**.

#### Four POUR Principles

| Principle | Meaning |
|----------|---------|
| Perceivable | Information and UI can be perceived by users |
| Operable | UI and navigation are operable |
| Understandable | Content and interaction are understandable |
| Robust | Works across user agents and assistive technologies |

#### WCAG 2.2 Items Relevant to This Project

| Criterion | Requirement | Project Impact |
|----------|-------------|----------------|
| 2.4.11 Focus Not Obscured | Focused content must not be hidden by sticky UI | Header and navigation layout |
| 2.5.7 Dragging Movements | Offer alternatives to drag interactions | Future drag-and-drop features |
| 2.5.8 Target Size | Touch targets at least 24x24px | All interactive controls |
| 3.2.6 Consistent Help | Keep help entry points consistent | Help and support UI |
| 3.3.7 Redundant Entry | Avoid unnecessary repeat input | Form design |
| 3.3.8 Accessible Authentication | Reduce cognitive burden in auth | Login and verification flows |

### Legal Context

- **European Accessibility Act (EAA)**: Enforced from June 28, 2025 for EU services
- **ADA Title II (US public entities)**: Typically requires WCAG 2.1 AA minimum
- **Regional disability accommodation laws**: Require reasonable accommodation in many jurisdictions

---

## React Aria Policy

Use **React Aria Components** for accessible interaction primitives.

### Why React Aria

[React Aria](https://react-spectrum.adobe.com/react-aria/) provides robust accessibility behavior by default:

- ARIA semantics and keyboard support
- Focus management
- Internationalization support
- Pointer, keyboard, and assistive technology compatibility
- Styling flexibility with TailwindCSS

### Installation

```bash
pnpm add react-aria-components
```

### Target Components

| Component | Purpose | Replaces |
|----------|---------|----------|
| `Button` | Actions | Custom button logic |
| `TextField` | Text input | Custom input wrappers |
| `Select` | Selection controls | Custom select implementations |
| `Modal` / `Dialog` | Overlay dialogs | Homegrown modal logic |
| `Form` | Form semantics | Raw form wiring |
| `RadioGroup` | Grouped radio options | Ad-hoc radio logic |
| `Checkbox` | Boolean input | Ad-hoc checkbox logic |
| `ProgressBar` | Progress feedback | Custom progress widgets |

### Example: Button

```tsx
import { Button } from "react-aria-components";

export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center
                 rounded-full bg-primary px-6 py-3 font-semibold text-white
                 transition duration-fast ease-standard
                 hover:bg-primary/90
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-ring focus-visible:ring-offset-2
                 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Example: TextField

```tsx
import { FieldError, Input, Label, Text, TextField } from "react-aria-components";

type Props = {
  label: string;
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
};

export function FormTextField({ label, description, errorMessage, isRequired, ...props }: Props) {
  return (
    <TextField isRequired={isRequired} {...props}>
      <Label className="text-sm font-medium">
        {label}
        {isRequired && <span className="ml-1 text-error">*</span>}
      </Label>
      <Input
        className="mt-1 w-full rounded-2xl border bg-card px-4 py-3 text-sm
                   transition duration-fast ease-standard
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                   invalid:border-error"
      />
      {description && (
        <Text slot="description" className="mt-1 text-sm text-muted">
          {description}
        </Text>
      )}
      <FieldError className="mt-1 text-sm text-error">{errorMessage}</FieldError>
    </TextField>
  );
}
```

### Focus Ring Guidance

Use `useFocusRing` when creating fully custom controls.

```tsx
import { mergeProps, useFocusRing } from "react-aria";

function CustomButton({ children, ...props }) {
  const ref = useRef(null);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cn("rounded-full px-4 py-2", isFocusVisible && "ring-2 ring-ring ring-offset-2")}
    >
      {children}
    </button>
  );
}
```

### Migration Steps

1. Replace `<button>` + `onClick` with `<Button>` + `onPress` where possible
2. Replace `<input>` with `<TextField>` + `<Input>` + `<FieldError>` composition
3. Replace custom `<select>` handling with `<Select>` + `<ListBox>`
4. Replace custom modal logic with `<Modal>` + `<Dialog>` to get focus trapping and dismissal patterns

---

## Current Assessment

### Implemented

| Item | Status | Notes |
|------|--------|-------|
| `htmlFor`/`id` pairing | Good | Core label linking in place |
| `focus-visible` styles | Partial | Present on major controls |
| Disabled-state handling | Good | Includes visual feedback |
| `aria-label` usage | Partial | Missing in several icon-only controls |
| Root `lang` setting | Good | Present at layout level |

### Gaps

| Item | Priority | Scope |
|------|----------|-------|
| Modal accessibility completeness | High | Focus trap, roles, Escape handling |
| Color contrast for warning/error tones | High | Token adjustments |
| `aria-describedby` consistency | Medium | Form error descriptions |
| `aria-required` usage | Medium | Required fields |
| Skip links | Medium | Fast jump to main content |
| Keyboard navigation consistency | Medium | Navigation and composite controls |

---

## Implementation Guidelines

### 1. Semantic HTML First

Use semantic elements before custom role-based implementations.

```tsx
// Good
<button onClick={handleClick}>Submit</button>
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/home">Home</a>
    </li>
  </ul>
</nav>

// Bad
<div onClick={handleClick} role="button">Submit</div>
```

### 2. Form Accessibility

#### Label Association

```tsx
<label htmlFor="email">Email address</label>
<Input id="email" type="email" aria-describedby="email-error" />
{error && <p id="email-error" role="alert">{error}</p>}
```

#### Required Fields

```tsx
<label htmlFor="name">
  Full name <span aria-hidden="true">*</span>
</label>
<Input
  id="name"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "name-error" : undefined}
/>
```

#### Group Related Controls

```tsx
<fieldset>
  <legend>Applicant type</legend>
  <label>
    <input type="radio" name="userType" value="individual" />
    Individual
  </label>
  <label>
    <input type="radio" name="userType" value="business" />
    Business
  </label>
</fieldset>
```

### 3. Modal and Dialog

Modal requirements:

- `role="dialog"` and `aria-modal="true"`
- Title linked via `aria-labelledby`
- Focus moved into the dialog on open
- Focus restored to trigger on close
- Escape closes modal (unless explicitly blocked)

```tsx
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function AccessibleModal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="mx-4 w-full max-w-lg rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
```

### 4. Focus Management

```css
:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: var(--color-ring);
  ring-offset: 2px;
}

html {
  scroll-padding-top: 80px;
}

*:focus {
  scroll-margin-top: 100px;
}
```

#### Skip Link

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

### 5. Color Contrast

#### Contrast Targets

| Content Type | Minimum AA | Minimum AAA |
|--------------|------------|-------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18px+) | 3:1 | 4.5:1 |
| UI components/graphics | 3:1 | - |

#### Token Improvements

```css
:root {
  --color-error: oklch(0.55 0.20 25);
  --color-error-text: oklch(0.45 0.18 25);
  --color-success: oklch(0.50 0.15 145);
  --color-warning: oklch(0.55 0.15 85);
}
```

Do not rely on color alone for state communication.

```tsx
// Good: color + icon + text
<div className="flex items-center gap-2 text-error">
  <AlertCircleIcon aria-hidden="true" />
  <span>Error: please review your input.</span>
</div>

// Bad: color only
<div className="text-red-500">Please review your input.</div>
```

### 6. Target Size

Ensure touch targets are at least 24x24px (recommended 44x44px).

```tsx
const buttonVariants = cva(
  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-4 py-2",
);

<button aria-label="Open settings" className="flex h-11 w-11 items-center justify-center rounded-full">
  <SettingsIcon className="h-5 w-5" />
</button>
```

### 7. Dynamic Content

#### Live Regions

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

#### Loading State

```tsx
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <Spinner aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </>
  ) : (
    "Submit"
  )}
</button>
```

### 8. Images and Media

```tsx
// Informative image
<img src="/avatar.png" alt="User profile image" />

// Decorative image
<img src="/decoration.svg" alt="" aria-hidden="true" />

// Complex image
<figure>
  <img src="/chart.png" alt="Sales trend chart for 2024" aria-describedby="chart-desc" />
  <figcaption id="chart-desc">Sales increased by 20% from January to December.</figcaption>
</figure>
```

For audio/video features, provide equivalent text and controls:

- Visual feedback for voice input state
- Text transcript/subtitle output for generated responses
- User control for volume and playback

---

## Component Requirements

### Button

- Minimum target size (`min-h-[44px]`)
- Visible keyboard focus style (`focus-visible`)
- Disabled semantics and visual state (`disabled`, `aria-disabled`)
- `aria-label` required for icon-only buttons

### Input

- Label linked via `htmlFor` and `id`
- Validation state via `aria-invalid`
- Error text linked with `aria-describedby`
- Required state conveyed via `aria-required`

### Select

- Label association and keyboard operability
- Error linkage and clear focus state

### Navigation

- Use semantic `<nav>` with clear `aria-label`
- Current page indicated with `aria-current="page"`
- Keyboard focus must remain visible

---

## Testing Strategy

### Automated

| Tool | Purpose | Typical Coverage |
|------|---------|------------------|
| axe-core | CI accessibility checks | Partial, rule-based |
| eslint-plugin-jsx-a11y | Static linting | Common issues |
| Lighthouse | Overall quality and accessibility score | Heuristic score |

Example with `jest-axe`:

```tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual

#### Keyboard

1. `Tab` reaches all interactive elements
2. `Enter`/`Space` activates buttons as expected
3. `Escape` closes modals
4. Focus indicator remains visible
5. Focus order is logical

#### Screen Reader

| OS | Reader |
|----|--------|
| macOS | VoiceOver |
| Windows | NVDA / JAWS |
| iOS | VoiceOver |
| Android | TalkBack |

Validate:

- Heading hierarchy is announced correctly
- Form labels and controls are associated
- Image alt text is appropriate
- Dynamic updates are announced when expected

#### Color Contrast

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools -> Rendering -> Emulate vision deficiencies

---

## Checklists

### Development Checklist

#### HTML Structure

- [ ] Heading levels are logical (`h1` -> `h2` -> `h3`)
- [ ] Landmark elements are present (`header`, `nav`, `main`, `footer`)
- [ ] Lists use `ul`/`ol`
- [ ] Data tables include `caption` and proper headers

#### Forms

- [ ] Every input has an associated `label`
- [ ] Required fields use `aria-required="true"`
- [ ] Invalid fields use `aria-invalid` and `aria-describedby`
- [ ] Error messages use `role="alert"` where immediate announcement is needed
- [ ] Appropriate `autocomplete` attributes are set

#### Interactive Elements

- [ ] Buttons use `<button>`
- [ ] Links use `<a>`
- [ ] Custom controls define appropriate roles and states
- [ ] Target size is at least 44x44px where feasible
- [ ] `focus-visible` styles are implemented

#### Modal / Dialog

- [ ] `role="dialog"` and `aria-modal="true"` are applied
- [ ] `aria-labelledby` points to the dialog title
- [ ] Focus trapping is implemented
- [ ] Escape closes dialog when appropriate
- [ ] Focus returns to trigger element after close

#### Images / Media

- [ ] Informative images have meaningful alt text
- [ ] Decorative images use `alt=""` and `aria-hidden="true"`
- [ ] Videos include captions or transcripts where required

#### Color and State

- [ ] Text contrast is at least 4.5:1
- [ ] UI component contrast is at least 3:1
- [ ] State is not conveyed by color alone

### Pre-Release Checklist

- [ ] Run automated checks with axe-core
- [ ] Verify complete keyboard-only operation
- [ ] Validate with VoiceOver/NVDA
- [ ] Verify layout at 200% zoom
- [ ] Verify reduced-motion behavior

---

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html)
- [MDN Accessibility](https://developer.mozilla.org/docs/Web/Accessibility)
- [axe-core](https://github.com/dequelabs/axe-core)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
