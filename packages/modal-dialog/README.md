# @manufosela/modal-dialog

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

## License

MIT
