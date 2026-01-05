# @manufosela/slide-notification

Slide-in notification web component from the right edge. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/slide-notification
```

## Usage

```javascript
import { showSlideNotification } from '@manufosela/slide-notification';

// Simple notification
showSlideNotification({
  message: 'Hello, world!'
});

// With type and title
showSlideNotification({
  type: 'success',
  title: 'Success!',
  message: 'Your changes have been saved.'
});
```

## Features

- Slides in from the right edge
- Four notification types (info, success, warning, error)
- Auto-hide with configurable duration
- HTML message support
- Custom background colors
- CSS custom properties for theming

## Attributes

| Attribute          | Type   | Default | Description                    |
| ------------------ | ------ | ------- | ------------------------------ |
| `title`            | String | `''`    | Notification title             |
| `message`          | String | `''`    | Message (supports HTML)        |
| `type`             | String | `info`  | Type: info, success, warning, error |
| `timetohide`       | Number | `3000`  | Auto-hide delay in ms (0 = never) |
| `background-color` | String | `''`    | Custom background color        |

## Methods

| Method   | Description                    |
| -------- | ------------------------------ |
| `show()` | Append to body and show        |
| `hide()` | Hide and remove from DOM       |

## Events

| Event                        | Description                    |
| ---------------------------- | ------------------------------ |
| `slide-notification-shown`   | Fired when notification appears |
| `slide-notification-hidden`  | Fired when notification hides   |

## Notification Types

```javascript
// Info (default) - Blue
showSlideNotification({ type: 'info', message: 'Info message' });

// Success - Green/Blue
showSlideNotification({ type: 'success', message: 'Success!' });

// Warning - Yellow (dark text)
showSlideNotification({ type: 'warning', message: 'Warning!' });

// Error - Red
showSlideNotification({ type: 'error', message: 'Error occurred' });
```

## Custom Duration

```javascript
// Quick notification (1 second)
showSlideNotification({
  message: 'Quick!',
  timetohide: 1000
});

// Persistent (must close manually)
const notification = showSlideNotification({
  message: 'Click to close',
  timetohide: 0
});

// Close programmatically
notification.hide();
```

## Custom Colors

```javascript
showSlideNotification({
  message: 'Purple notification',
  backgroundColor: '#8b5cf6'
});
```

## CSS Custom Properties

| Property                          | Default                        | Description        |
| --------------------------------- | ------------------------------ | ------------------ |
| `--slide-notification-width`      | `300px`                        | Notification width |
| `--slide-notification-bg`         | `#17a2b8`                      | Background color   |
| `--slide-notification-color`      | `white`                        | Text color         |
| `--slide-notification-radius`     | `8px`                          | Border radius      |
| `--slide-notification-padding`    | `1.5rem`                       | Padding            |
| `--slide-notification-shadow`     | `0 2px 8px rgba(0,0,0,0.2)`    | Box shadow         |
| `--slide-notification-bottom`     | `20px`                         | Bottom position    |
| `--slide-notification-z-index`    | `10000`                        | Z-index            |
| `--slide-notification-min-height` | `80px`                         | Minimum height     |

## License

MIT
