# @manufosela/toast-notification

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

## License

MIT
