# @manufosela/app-modal

[![npm version](https://img.shields.io/npm/v/@manufosela/app-modal)](https://www.npmjs.com/package/@manufosela/app-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**`<dialog>` on steroids.** A feature-rich modal web component built on the native `<dialog>` element. You get focus trap, `aria-modal`, Escape key, inert background, and `::backdrop` for free from the browser — plus configurable buttons, theming, events, and two operation modes on top.

Built with [Lit](https://lit.dev/).

## Why not just `<dialog>`?

Native `<dialog>` is great for accessibility but bare-bones for UI. `app-modal` wraps it and adds:

| Native `<dialog>` (free) | `app-modal` adds |
|--------------------------|------------------|
| Focus trap | Up to 3 configurable buttons with callbacks |
| `aria-modal="true"` | Declarative (`open` attr) + programmatic (`showModal()`) modes |
| Escape to close | `intercept-close` to prevent accidental dismissal |
| `::backdrop` | ~30 CSS custom properties for full theming |
| Inert background | Global `close-modal` event to close from anywhere |
| Top layer (no z-index) | Dynamic content injection via `setContent()` |
| | HTML messages, slotted content, CSS parts |
| | `prefers-reduced-motion` support |

## Install

```bash
npm install @manufosela/app-modal
```

## Quick Start

### Declarative (recommended)

The modal lives in your HTML. Control it with the `open` attribute.

```html
<app-modal
  id="confirmModal"
  title="Delete Item?"
  message="This action cannot be undone."
  button1-text="Delete"
  button2-text="Cancel"
></app-modal>

<button onclick="document.getElementById('confirmModal').open = true">
  Delete
</button>

<script type="module">
  import '@manufosela/app-modal';

  const modal = document.getElementById('confirmModal');

  modal.addEventListener('modal-action1', () => {
    console.log('Deleted!');
  });

  modal.addEventListener('modal-action2', () => {
    console.log('Cancelled');
  });
</script>
```

### Programmatic

For one-shot modals that self-destruct on close.

```javascript
import { showModal } from '@manufosela/app-modal';

showModal({
  title: 'Welcome',
  message: 'Hello, world!',
  button1Text: 'OK',
});

// Confirmation with callback
showModal({
  title: 'Are you sure?',
  message: 'This will delete everything.',
  button1Text: 'Delete',
  button2Text: 'Cancel',
  button1Action: () => {
    deleteEverything();
    // return false to prevent auto-close
  },
});
```

### With Slotted Content

```html
<app-modal id="formModal" title="Edit Profile" button1-text="Save">
  <form>
    <label>Name <input type="text" name="name" /></label>
    <label>Email <input type="email" name="email" /></label>
  </form>
</app-modal>
```

### Intercept Close

Prevent the modal from closing until a condition is met.

```html
<app-modal
  id="unsavedModal"
  title="Unsaved Changes"
  message="You have unsaved changes."
  button1-text="Discard"
  button2-text="Keep Editing"
  intercept-close
></app-modal>

<script type="module">
  import '@manufosela/app-modal';

  const modal = document.getElementById('unsavedModal');

  modal.addEventListener('modal-closed-requested', (e) => {
    if (userConfirmsDiscard()) {
      document.dispatchEvent(
        new CustomEvent('close-modal', {
          detail: { modalId: e.detail.modalId },
        })
      );
    }
  });
</script>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | Boolean | — | Show/hide the modal (declarative mode) |
| `title` | String | `""` | Header text |
| `message` | String | `""` | Body message (supports HTML) |
| `max-width` | String | `"400px"` | Modal max width |
| `max-height` | String | `"90vh"` | Modal max height |
| `show-header` | Boolean | `true` | Show/hide the header section |
| `show-footer` | Boolean | `true` | Show/hide the footer section |
| `full-height` | Boolean | `false` | Expand content to fill max-height |
| `modal-id` | String | auto | Unique ID (auto-generated if omitted) |
| `intercept-close` | Boolean | `false` | Prevent auto-close on dismiss |
| `button1-text` | String | `""` | Primary button label |
| `button2-text` | String | `""` | Secondary button label |
| `button3-text` | String | `""` | Tertiary button label |
| `button1-css` | String | `""` | Inline style override for button 1 |
| `button2-css` | String | `""` | Inline style override for button 2 |
| `button3-css` | String | `""` | Inline style override for button 3 |

## Methods

| Method | Description |
|--------|-------------|
| `show()` | Open the modal |
| `close()` | Close the modal (removes from DOM in programmatic mode) |
| `setContent(element)` | Inject a DOM element into the modal body |

## Events

### Emitted

| Event | Detail | When |
|-------|--------|------|
| `modal-action1` | `{ contentElementId, contentElementType }` | Button 1 clicked |
| `modal-action2` | `{ contentElementId, contentElementType }` | Button 2 clicked |
| `modal-action3` | `{ contentElementId, contentElementType }` | Button 3 clicked |
| `modal-closed-requested` | `{ modalId, contentElementId, contentElementType }` | Close requested (Escape, backdrop click, close button) |

### Listened (global)

```javascript
// Close a specific modal
document.dispatchEvent(new CustomEvent('close-modal', {
  detail: { modalId: 'my-modal-id' },
}));

// Close all modals
document.dispatchEvent(new CustomEvent('close-modal', {
  detail: { target: 'all' },
}));
```

## `showModal()` Options

```javascript
import { showModal } from '@manufosela/app-modal';

const modal = showModal({
  title: 'Confirm',
  message: 'Are you sure?',
  maxWidth: '500px',
  maxHeight: '80vh',
  showHeader: true,
  showFooter: true,
  button1Text: 'Confirm',
  button2Text: 'Cancel',
  button3Text: 'Details',
  button1Css: '',
  button2Css: '',
  button3Css: '',
  button1Action: () => { /* return false to prevent close */ },
  button2Action: () => {},
  button3Action: () => {},
  interceptClose: false,
  fullHeight: false,
  contentElement: document.createElement('div'),
});
```

Returns the `AppModal` instance (already appended to `document.body`).

## CSS Custom Properties

### Modal container

| Property | Fallback | Default |
|----------|----------|---------|
| `--modal-bg` | `--bg-primary` | `#ffffff` |
| `--modal-text-color` | `--text-primary` | `#333333` |
| `--modal-border-radius` | `--radius-lg` | `8px` |
| `--modal-shadow` | `--shadow-xl` | `0 8px 32px rgba(0,0,0,0.3)` |
| `--modal-overlay-bg` | — | `rgba(0,0,0,0.6)` |
| `--modal-max-width` | — | `80vw` |
| `--modal-max-height` | — | `80vh` |

### Header

| Property | Fallback | Default |
|----------|----------|---------|
| `--modal-header-bg` | `--bg-secondary` | `transparent` |
| `--modal-header-text` | `--text-primary` | `inherit` |
| `--modal-header-padding` | `--spacing-md` | `1rem` |
| `--modal-header-font-size` | `--font-size-xl` | `1.5rem` |

### Body

| Property | Fallback | Default |
|----------|----------|---------|
| `--modal-body-padding` | `--spacing-lg` | `1.5rem` |
| `--modal-body-color` | `--text-primary` | `#333333` |

### Footer

| Property | Fallback | Default |
|----------|----------|---------|
| `--modal-footer-bg` | `--bg-secondary` | `transparent` |
| `--modal-footer-padding` | `--spacing-md` | `1rem` |
| `--modal-border-color` | `--border-default` | `#e0e0e0` |

### Buttons

| Property | Fallback | Default |
|----------|----------|---------|
| `--modal-btn-primary-bg` | `--brand-primary` | `#4caf50` |
| `--modal-btn-primary-text` | `--text-inverse` | `#ffffff` |
| `--modal-btn-primary-hover-bg` | `--brand-primary-hover` | `#45a047` |
| `--modal-btn-secondary-bg` | `--brand-danger` | `#f44336` |
| `--modal-btn-secondary-text` | `--text-inverse` | `#ffffff` |
| `--modal-btn-secondary-hover-bg` | `--brand-danger-hover` | `#e53935` |
| `--modal-btn-tertiary-bg` | `--bg-muted` | `#e9ecef` |
| `--modal-btn-tertiary-text` | `--text-primary` | `#333333` |
| `--modal-btn-tertiary-hover-bg` | `--bg-muted-hover` | `#dee2e6` |

### Close button

| Property | Fallback | Default |
|----------|----------|---------|
| `--modal-close-bg` | `--bg-muted` | `rgba(0,0,0,0.1)` |
| `--modal-close-color` | `--text-secondary` | `#666666` |
| `--modal-close-hover-bg` | `--bg-muted-hover` | `rgba(0,0,0,0.2)` |
| `--modal-close-hover-color` | `--text-primary` | `#333333` |

## CSS Parts

Style internal elements from outside using `::part()`:

```css
app-modal::part(container) { /* the <dialog> element */ }
app-modal::part(header)    { /* header section */ }
app-modal::part(body)      { /* content area */ }
app-modal::part(footer)    { /* button area */ }
app-modal::part(close-btn) { /* close ✕ button */ }
app-modal::part(btn-primary)   { /* button 1 */ }
app-modal::part(btn-secondary) { /* button 2 */ }
app-modal::part(btn-tertiary)  { /* button 3 */ }
```

## Accessibility

`app-modal` is **exactly as accessible as a native `<dialog>`** — because it *is* a native `<dialog>` under the hood.

The component renders a `<dialog>` element inside its Shadow DOM and opens it with `showModal()`. This gives you every browser-native accessibility feature for free:

- **Focus trap** — Tab/Shift-Tab stays inside the modal. Slotted content (light DOM) participates in the focus cycle too.
- **`role="dialog"` + `aria-modal="true"`** — the browser exposes these implicitly to assistive technology (they won't appear as HTML attributes, but screen readers see them in the accessibility tree).
- **Escape key** — handled natively via the `cancel` event, not a JavaScript `keydown` listener.
- **Inert background** — all content outside the modal becomes non-interactive and invisible to screen readers. This is the browser's "blocked by a modal dialog" behavior — it works even though the `<dialog>` is inside a Shadow DOM.
- **Top layer** — the dialog renders above everything regardless of DOM position or `z-index`. No stacking context issues.
- **`prefers-reduced-motion`** — all animations are disabled when the user requests reduced motion.

### But doesn't Shadow DOM break any of this?

No. When `dialog.showModal()` is called from a Shadow DOM:

1. The dialog is promoted to the **top layer** — a browser-managed rendering layer independent of the DOM tree. Shadow DOM boundaries don't affect it.
2. Everything outside the dialog is marked as **"blocked by a modal dialog"** at the document level. This is not the `inert` HTML attribute — it's an internal browser state with the same effect. Elements outside the modal can't receive focus, aren't clickable, and are hidden from screen readers.
3. **Slotted content works** — elements passed via `<slot>` (light DOM projection) are part of the dialog for focus trapping purposes.

This has been verified in Chrome, Firefox, and Safari. The combination of Shadow DOM + `<dialog>` + slots is a well-supported pattern.

### What `app-modal` adds (without compromising accessibility)

The wrapper adds application-level features that `<dialog>` alone doesn't provide — configurable buttons, theming, events, dual operation modes — while delegating 100% of the accessibility behavior to the browser's native implementation. Nothing is reimplemented in JavaScript.

## License

MIT
