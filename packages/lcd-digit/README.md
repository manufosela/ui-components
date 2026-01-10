# @manufosela/lcd-digit

A 7-segment LCD digit display web component. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/lcd-digit
```

## Usage

```javascript
import '@manufosela/lcd-digit';
```

```html
<lcd-digit digit="5"></lcd-digit>
```

## Features

- 7-segment LED/LCD display style
- Supports digits 0-9, minus sign, and blank
- Optional colon for clock displays
- Glow effect on active segments
- Increment/decrement methods
- Fully customizable via CSS properties

## Attributes

| Attribute  | Type    | Default | Description                    |
| ---------- | ------- | ------- | ------------------------------ |
| `digit`    | String  | `0`     | Digit to display (0-9, -, space) |
| `colon`    | Boolean | `false` | Show colon after digit         |
| `colon-on` | Boolean | `false` | Whether colon is lit           |

## Methods

| Method        | Description                    |
| ------------- | ------------------------------ |
| `setDigit(d)` | Set the digit (0-9, -, space)  |
| `increment()` | Increase digit (wraps 9→0)     |
| `decrement()` | Decrease digit (wraps 0→9)     |

## Events

| Event          | Detail             | Description            |
| -------------- | ------------------ | ---------------------- |
| `digit-changed`| `{ digit: string }`| Fired when digit changes |

```javascript
lcdDigit.addEventListener('digit-changed', (e) => {
  console.log('New digit:', e.detail.digit);
});
```

## CSS Custom Properties

| Property                  | Default              | Description              |
| ------------------------- | -------------------- | ------------------------ |
| `--lcd-segment-length`    | `30px`               | Segment length           |
| `--lcd-segment-width`     | `6px`                | Segment width            |
| `--lcd-digit-on-color`    | `#22c55e`            | Active segment color     |
| `--lcd-digit-off-color`   | `rgba(0,0,0,0.1)`    | Inactive segment color   |
| `--lcd-digit-glow-color`  | `rgba(34,197,94,0.5)`| Glow effect color        |

## Examples

### Simple Counter
```html
<lcd-digit id="counter" digit="0"></lcd-digit>
<button onclick="document.getElementById('counter').increment()">+</button>
```

### Clock Display
```html
<lcd-digit digit="1"></lcd-digit>
<lcd-digit digit="2" colon colon-on></lcd-digit>
<lcd-digit digit="3"></lcd-digit>
<lcd-digit digit="4"></lcd-digit>
```

### Custom Color
```html
<lcd-digit
  digit="8"
  style="--lcd-digit-on-color: #3b82f6; --lcd-digit-glow-color: rgba(59, 130, 246, 0.5);">
</lcd-digit>
```

### Negative Number
```html
<lcd-digit digit="-"></lcd-digit>
<lcd-digit digit="5"></lcd-digit>
```

## Accessibility

- Uses `role="img"` with dynamic `aria-label` describing the displayed digit
- Respects `prefers-reduced-motion` by disabling segment transitions
- For clock displays, consider wrapping multiple digits in a container with `aria-label` describing the full time

```html
<div role="img" aria-label="Time: 12:34">
  <lcd-digit digit="1"></lcd-digit>
  <lcd-digit digit="2" colon colon-on></lcd-digit>
  <lcd-digit digit="3"></lcd-digit>
  <lcd-digit digit="4"></lcd-digit>
</div>
```

## License

MIT
