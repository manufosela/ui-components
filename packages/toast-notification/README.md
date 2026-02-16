# @manufosela/toast-notification

[![npm version](https://img.shields.io/npm/v/@manufosela/toast-notification)](https://www.npmjs.com/package/@manufosela/toast-notification)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Toast notification web component for displaying brief messages. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/toast-notification
```

## Usage

```javascript
import '@manufosela/toast-notification';
```

```html
<toast-notification id="toast"></toast-notification>

<script>
  document.getElementById('toast').show('Hello!', { type: 'success' });
</script>
```

## Features

- Multiple types: success, error, warning, info
- 6 position options
- Auto-hide with configurable duration
- Progress bar indicator
- Close button
- Global event triggers
- Accessible (ARIA support)

## Attributes

| Attribute  | Type    | Default     | Description                        |
| ---------- | ------- | ----------- | ---------------------------------- |
| `message`  | String  | `''`        | Toast message content              |
| `type`     | String  | `''`        | Type: success, error, warning, info|
| `position` | String  | `top-right` | Position on screen                 |
| `duration` | Number  | `3000`      | Auto-hide duration in ms (0 = never)|
| `visible`  | Boolean | `false`     | Whether toast is visible           |
| `closable` | Boolean | `true`      | Show close button                  |
| `progress` | Boolean | `true`      | Show progress bar                  |

## Positions

- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

## Methods

| Method              | Description                          |
| ------------------- | ------------------------------------ |
| `show(msg, opts)`   | Show toast with message and options  |
| `hide()`            | Hide the toast                       |

```javascript
toast.show('Operation complete!', {
  type: 'success',
  duration: 5000,
  position: 'bottom-center'
});
```

## Events

| Event         | Detail                   | Description           |
| ------------- | ------------------------ | --------------------- |
| `toast-show`  | `{ message, type }`      | Fired when shown      |
| `toast-hide`  | `{ message, type }`      | Fired when hidden     |
| `toast-close` | `{ message, type }`      | Fired on close click  |

## Global Events

Trigger toasts from anywhere:

```javascript
// Show toast
document.dispatchEvent(new CustomEvent('toast-notification-show', {
  detail: { message: 'Hello!', type: 'success', duration: 3000 }
}));

// Hide toast
document.dispatchEvent(new CustomEvent('toast-notification-hide'));
```

## CSS Custom Properties

| Property               | Default            | Description          |
| ---------------------- | ------------------ | -------------------- |
| `--toast-z-index`      | `9999`             | Z-index              |
| `--toast-padding`      | `12px 16px`        | Padding              |
| `--toast-radius`       | `8px`              | Border radius        |
| `--toast-bg`           | `#1f2937`          | Background color     |
| `--toast-color`        | `#f9fafb`          | Text color           |
| `--toast-max-width`    | `400px`            | Maximum width        |
| `--toast-success-bg`   | `#059669`          | Success background   |
| `--toast-error-bg`     | `#dc2626`          | Error background     |
| `--toast-warning-bg`   | `#d97706`          | Warning background   |
| `--toast-info-bg`      | `#2563eb`          | Info background      |

## Accessibility

- Uses `role="alert"` with `aria-live="polite"` for screen reader announcements
- `aria-atomic="true"` ensures the entire notification is read
- Close button has descriptive `aria-label`
- Icons are hidden from assistive technology (`aria-hidden="true"`)
- Respects `prefers-reduced-motion` by disabling animations

## toast-notification vs slide-notification

This library includes two notification components. Choose based on your needs:

| Feature | toast-notification | slide-notification |
|---------|-------------------|-------------------|
| **Animation** | Appears in corner | Slides in from right edge |
| **Position** | 6 positions (corners + centers) | Right side only |
| **Stacking** | Multiple stack vertically | One at a time |
| **Progress bar** | Yes | No |
| **Close button** | Yes | No (click anywhere) |
| **Persistent mode** | `duration="0"` | `persistent` attribute |
| **Best for** | Multiple sequential notifications | Single important messages |

**Use `toast-notification` when:**
- You need to show multiple notifications
- You want position flexibility (6 options)
- You need a progress bar indicator

**Use `slide-notification` when:**
- You want a prominent single notification
- You prefer slide-in animation
- You want click-anywhere-to-close behavior

## License

MIT
