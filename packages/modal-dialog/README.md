# @manufosela/modal-dialog

[![npm version](https://img.shields.io/npm/v/@manufosela/modal-dialog)](https://www.npmjs.com/package/@manufosela/modal-dialog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modal dialog web component with header, body, and footer slots. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/modal-dialog
```

## Usage

```javascript
import '@manufosela/modal-dialog';
```

```html
<modal-dialog id="modal" title="Hello">
  <p>Modal content goes here.</p>
  <button slot="footer" onclick="modal.confirm()">OK</button>
</modal-dialog>

<button onclick="document.getElementById('modal').show()">Open</button>
```

## Features

- Header with title and close button
- Slotted body and footer content
- Multiple size variants
- Click-outside-to-close
- Escape key to close
- Focus trap
- Body scroll lock
- Accessible (ARIA support)

## Attributes

| Attribute          | Type    | Default  | Description                    |
| ------------------ | ------- | -------- | ------------------------------ |
| `open`             | Boolean | `false`  | Whether modal is open          |
| `title`            | String  | `''`     | Modal title                    |
| `size`             | String  | `medium` | Size: small, medium, large, full, fullscreen |
| `width`            | String  | `''`     | Custom width (e.g., `50vw`, `600px`) |
| `height`           | String  | `''`     | Custom height (e.g., `70vh`, `400px`) |
| `closable`         | Boolean | `true`   | Show close button              |
| `close-on-overlay` | Boolean | `true`   | Close on overlay click         |
| `close-on-escape`  | Boolean | `true`   | Close on Escape key            |

## Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| (default) | Modal body content             |
| `footer`  | Footer buttons/content         |

## Methods

| Method      | Description                    |
| ----------- | ------------------------------ |
| `show()`    | Open the modal                 |
| `hide()`    | Close the modal                |
| `confirm()` | Close and dispatch confirm event |
| `cancel()`  | Close and dispatch cancel event  |

## Events

| Event          | Description                    |
| -------------- | ------------------------------ |
| `modal-open`   | Fired when modal opens         |
| `modal-close`  | Fired when modal closes        |
| `modal-confirm`| Fired on confirm()             |
| `modal-cancel` | Fired on cancel()              |

## Size Variants

```html
<modal-dialog size="small">...</modal-dialog>      <!-- max-width: 360px -->
<modal-dialog size="medium">...</modal-dialog>     <!-- max-width: 500px (default) -->
<modal-dialog size="large">...</modal-dialog>      <!-- max-width: 720px -->
<modal-dialog size="full">...</modal-dialog>       <!-- full width -->
<modal-dialog size="fullscreen">...</modal-dialog> <!-- full width and height -->
```

## Custom Dimensions

Use `width` and `height` attributes for precise control:

```html
<modal-dialog width="50vw" height="70vh">...</modal-dialog>
<modal-dialog width="600px" height="400px">...</modal-dialog>
<modal-dialog width="80%">...</modal-dialog>
```

## CSS Custom Properties

| Property                  | Default                | Description          |
| ------------------------- | ---------------------- | -------------------- |
| `--modal-z-index`         | `9999`                 | Z-index              |
| `--modal-overlay-bg`      | `rgba(0,0,0,0.5)`      | Overlay background   |
| `--modal-bg`              | `#fff`                 | Modal background     |
| `--modal-radius`          | `12px`                 | Border radius        |
| `--modal-max-width`       | `500px`                | Maximum width        |
| `--modal-header-padding`  | `16px 20px`            | Header padding       |
| `--modal-body-padding`    | `20px`                 | Body padding         |
| `--modal-footer-padding`  | `16px 20px`            | Footer padding       |
| `--modal-title-size`      | `18px`                 | Title font size      |
| `--modal-title-color`     | `#111827`              | Title color          |
| `--modal-border-color`    | `#e5e7eb`              | Border color         |

## Examples

### Confirmation Dialog
```html
<modal-dialog id="confirm" title="Delete?" size="small">
  <p>Are you sure?</p>
  <button slot="footer" onclick="confirm.cancel()">Cancel</button>
  <button slot="footer" onclick="confirm.confirm()">Delete</button>
</modal-dialog>
```

### Form Modal
```html
<modal-dialog id="form" title="Edit Profile">
  <form>
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="Email" />
  </form>
  <button slot="footer" onclick="form.cancel()">Cancel</button>
  <button slot="footer" onclick="form.confirm()">Save</button>
</modal-dialog>
```

## modal-dialog vs app-modal

This library includes two modal components. Choose based on your needs:

| Feature | modal-dialog | app-modal |
|---------|--------------|-----------|
| **Use case** | Custom content, forms, declarative modals | Confirmations, alerts, programmatic modals |
| **Content** | Default slot (full control) | `message` attribute + `setContent()` |
| **Buttons** | Slot-based (any content) | 3 configurable buttons with callbacks |
| **API** | Declarative (HTML-first) | Programmatic (`showModal()` helper) |
| **Sizes** | 5 presets + custom width/height | max-width/max-height only |
| **Best for** | Complex forms, custom UI | "Are you sure?" dialogs |

**Use `modal-dialog` when:**
- You need full control over modal content
- You're using slots for custom layouts
- You want size presets (small/medium/large/full/fullscreen)
- You prefer declarative HTML patterns

**Use `app-modal` when:**
- You need quick confirmation dialogs
- You want predefined button layouts (OK/Cancel/Other)
- You're creating modals programmatically

## Accessibility

- `role="dialog"` and `aria-modal="true"` on modal container
- `aria-labelledby` links to modal title
- Close button has descriptive `aria-label`
- Focus trap keeps focus within modal
- Focus returns to trigger element on close
- Escape key closes modal (configurable)
- Body scroll lock when modal is open
- Respects `prefers-reduced-motion` by disabling animations

## License

MIT
