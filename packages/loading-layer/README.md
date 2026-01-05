# @manufosela/loading-layer

A customizable loading overlay web component with animated spinner. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/loading-layer
```

## Usage

```javascript
import '@manufosela/loading-layer';
```

```html
<loading-layer id="loader"></loading-layer>

<script>
  document.getElementById('loader').show();
  // Later...
  document.getElementById('loader').hide();
</script>
```

## Features

- Animated SVG spinner
- Customizable colors and sizes
- Optional message display
- Auto-hide timeout
- Global event support
- Smooth fade transitions

## Attributes

| Attribute      | Type    | Default   | Description                        |
| -------------- | ------- | --------- | ---------------------------------- |
| `visible`      | Boolean | `false`   | Whether the loader is visible      |
| `message`      | String  | `''`      | Message displayed below spinner    |
| `size`         | Number  | `60`      | Spinner size in pixels             |
| `color`        | String  | `#3b82f6` | Spinner color                      |
| `stroke-width` | Number  | `4`       | Spinner stroke width               |
| `timeout`      | Number  | `0`       | Auto-hide timeout in seconds       |

## Methods

| Method     | Description              |
| ---------- | ------------------------ |
| `show()`   | Show the loading layer   |
| `hide()`   | Hide the loading layer   |
| `toggle()` | Toggle visibility        |

## Events

| Event                  | Description           |
| ---------------------- | --------------------- |
| `loading-layer-shown`  | Fired when shown      |
| `loading-layer-hidden` | Fired when hidden     |

## Global Events (Input)

You can show/hide the loading layer using custom events:

```javascript
// Show with message
document.dispatchEvent(new CustomEvent('loading-layer-show', {
  detail: { message: 'Loading...' }
}));

// Hide
document.dispatchEvent(new CustomEvent('loading-layer-hide'));
```

## CSS Custom Properties

| Property                         | Default              | Description          |
| -------------------------------- | -------------------- | -------------------- |
| `--loading-layer-bg`             | `rgba(0,0,0,0.5)`   | Overlay background   |
| `--loading-layer-z-index`        | `9999`              | Z-index              |
| `--loading-layer-transition`     | `0.3s`              | Fade duration        |
| `--loading-layer-spin-duration`  | `1s`                | Spin animation       |
| `--loading-layer-text-color`     | `#fff`              | Message color        |

## License

MIT
