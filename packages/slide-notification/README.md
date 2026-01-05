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

| Attribute          | Type    | Default | Description                    |
| ------------------ | ------- | ------- | ------------------------------ |
| `title`            | String  | `''`    | Notification title             |
| `message`          | String  | `''`    | Message (supports HTML)        |
| `type`             | String  | `info`  | Type: info, success, warning, error |
| `timetohide`       | Number  | `3000`  | Auto-hide delay in ms (0 = never) |
| `background-color` | String  | `''`    | Custom background color        |
| `persistent`       | Boolean | `false` | Stay visible until clicked     |

## Methods

| Method   | Description                              |
| -------- | ---------------------------------------- |
| `show()` | Show the notification                    |
| `hide()` | Hide the notification                    |

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

// Persistent (click to close)
showSlideNotification({
  message: 'Click me to close',
  persistent: true
});
```

## Declarative Usage

For manual control, use the element in HTML:

```html
<slide-notification id="myNotification"
  title="Hello"
  message="Click buttons to control"
  persistent>
</slide-notification>

<button onclick="myNotification.show()">Show</button>
<button onclick="myNotification.hide()">Hide</button>
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

## slide-notification vs toast-notification

This library includes two notification components. Choose based on your needs:

| Feature | slide-notification | toast-notification |
|---------|--------------------|-------------------|
| **Animation** | Slides in from right edge | Appears in corner |
| **Position** | Right side only | 6 positions (corners + centers) |
| **Stacking** | One at a time | Multiple stack vertically |
| **Progress bar** | No | Yes |
| **Close button** | No (click anywhere) | Yes |
| **Persistent mode** | `persistent` attribute | `duration="0"` |
| **Best for** | Single important messages | Multiple sequential notifications |

**Use `slide-notification` when:**
- You want a prominent single notification
- You prefer slide-in animation
- You want click-anywhere-to-close behavior

**Use `toast-notification` when:**
- You need to show multiple notifications
- You want position flexibility (6 options)
- You need a progress bar indicator

## License

MIT
