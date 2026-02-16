# @manufosela/app-modal

[![npm version](https://img.shields.io/npm/v/@manufosela/app-modal)](https://www.npmjs.com/package/@manufosela/app-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Feature-rich modal web component with configurable buttons and dynamic content. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/app-modal
```

## Usage

### Declarative (Recommended)

Use the `open` attribute to control visibility. The modal persists in the DOM and can be reused.

```html
<app-modal
  id="confirmModal"
  title="Delete Item?"
  message="Are you sure you want to delete this item?"
  button1-text="Delete"
  button2-text="Cancel"
  button1-css="background: #ef4444;"
></app-modal>

<button onclick="document.getElementById('confirmModal').open = true">
  Delete
</button>

<script type="module">
  import '@manufosela/app-modal';

  const modal = document.getElementById('confirmModal');
  // Declarative modals are hidden by default - no initialization needed

  modal.addEventListener('modal-action1', () => {
    console.log('Deleted!');
  });

  modal.addEventListener('modal-action2', () => {
    console.log('Cancelled');
  });
</script>
```

### With Slotted Content

```html
<app-modal id="customModal" title="Custom Content" button1-text="Got it">
  <p>This content is <strong>slotted</strong> into the modal.</p>
  <form>
    <input type="text" placeholder="Enter something..." />
  </form>
</app-modal>
```

### Programmatic

Use the `showModal()` helper for quick modals that auto-destroy on close.

```javascript
import { showModal } from '@manufosela/app-modal';

// Simple modal
showModal({
  title: 'Welcome',
  message: 'Hello, world!',
  button1Text: 'OK'
});

// Confirmation dialog
showModal({
  title: 'Delete Item?',
  message: 'Are you sure?',
  button1Text: 'Delete',
  button2Text: 'Cancel',
  button1Action: () => {
    // Handle delete
  }
});
```

## Features

- **Declarative mode** with `open` attribute (modal persists, reusable)
- **Programmatic mode** via `showModal()` (modal auto-destroys)
- Up to 3 configurable buttons
- Custom button actions and styles
- Slotted content support
- Dynamic content injection via `setContent()`
- HTML message support
- Escape key to close
- Global close events
- Auto-generated modal IDs
- CSS custom properties for theming

## Attributes

| Attribute       | Type    | Default  | Description                                      |
| --------------- | ------- | -------- | ------------------------------------------------ |
| `open`          | Boolean | -        | Controls visibility in declarative mode          |
| `title`         | String  | `''`     | Modal title                                      |
| `message`       | String  | `''`     | Modal message (supports HTML)                    |
| `max-width`     | String  | `400px`  | Maximum width                                    |
| `max-height`    | String  | `90vh`   | Maximum height                                   |
| `show-header`   | Boolean | `true`   | Show header section                              |
| `show-footer`   | Boolean | `true`   | Show footer section                              |
| `button1-text`  | String  | `''`     | First button text                                |
| `button2-text`  | String  | `''`     | Second button text                               |
| `button3-text`  | String  | `''`     | Third button text                                |
| `button1-css`   | String  | `''`     | First button inline CSS                          |
| `button2-css`   | String  | `''`     | Second button inline CSS                         |
| `button3-css`   | String  | `''`     | Third button inline CSS                          |
| `modal-id`      | String  | auto     | Unique modal identifier                          |

> **Note:** Declarative modals (placed in HTML) are hidden by default and shown when `open` is set to `true`. In declarative mode, `close()` hides the modal instead of destroying it, allowing reuse. Modals created via `showModal()` auto-show and auto-destroy on close.

## Methods

| Method                      | Description                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| `show()`                    | Show modal (sets `open=true` in declarative mode)                |
| `close()`                   | Close modal (hides in declarative mode, destroys in programmatic)|
| `setContent(element)`       | Set custom element as modal content                              |

## Events

| Event                    | Description                      |
| ------------------------ | -------------------------------- |
| `modal-action1`          | Fired when button 1 is clicked   |
| `modal-action2`          | Fired when button 2 is clicked   |
| `modal-action3`          | Fired when button 3 is clicked   |
| `modal-closed-requested` | Fired when close is requested    |

## showModal() Options

```javascript
showModal({
  title: 'Modal Title',
  message: '<strong>HTML</strong> content',
  maxWidth: '500px',
  maxHeight: '80vh',
  showHeader: true,
  showFooter: true,
  button1Text: 'Confirm',
  button2Text: 'Cancel',
  button3Text: 'Other',
  button1Css: 'background: green;',
  button2Css: 'background: red;',
  button3Css: 'background: gray;',
  button1Action: () => { /* return false to prevent close */ },
  button2Action: () => {},
  button3Action: () => {},
  contentElement: document.createElement('div')
});
```

## Global Close Event

Close modals programmatically:

```javascript
// Close specific modal
document.dispatchEvent(new CustomEvent('close-modal', {
  detail: { modalId: 'my-modal-id' }
}));

// Close all modals
document.dispatchEvent(new CustomEvent('close-modal', {
  detail: { target: 'all' }
}));
```

## CSS Custom Properties

| Property                      | Default         | Description              |
| ----------------------------- | --------------- | ------------------------ |
| `--app-modal-z-index`         | `1000`          | Z-index                  |
| `--app-modal-bg`              | `white`         | Modal background         |
| `--app-modal-radius`          | `8px`           | Border radius            |
| `--app-modal-padding`         | `1.5rem`        | Modal padding            |
| `--app-modal-title-size`      | `1.5rem`        | Title font size          |
| `--app-modal-title-color`     | `inherit`       | Title color              |
| `--app-modal-body-color`      | `#333`          | Body text color          |
| `--app-modal-confirm-bg`      | `#4caf50`       | Confirm button bg        |
| `--app-modal-cancel-bg`       | `#f44336`       | Cancel button bg         |

## app-modal vs modal-dialog

This library includes two modal components. Choose based on your needs:

| Feature | app-modal | modal-dialog |
|---------|-----------|--------------|
| **Use case** | Confirmations, alerts, action dialogs | Custom content, forms, complex layouts |
| **Buttons** | 3 configurable buttons with callbacks | Slot-based (any content) |
| **Content** | `message` attribute + slots + `setContent()` | Default slot (full control) |
| **API** | Declarative (`open`) + Programmatic (`showModal()`) | Declarative (HTML-first) |
| **Close events** | Global `close-modal` event | `modal-close` event |
| **Best for** | "Are you sure?" dialogs, confirmations | Complex forms, custom UI |

**Use `app-modal` when:**
- You need quick confirmation dialogs
- You want predefined button layouts (OK/Cancel/Other)
- You need both declarative and programmatic control

**Use `modal-dialog` when:**
- You need full control over modal content
- You're building complex forms inside modals
- You need multiple custom footer actions

## Accessibility

- Escape key closes the modal
- Click outside overlay closes the modal
- Close button provides explicit dismiss action
- Global close event allows programmatic closing
- Respects `prefers-reduced-motion` by disabling animations

## License

MIT
