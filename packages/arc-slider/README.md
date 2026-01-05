# @manufosela/arc-slider

A customizable arc slider web component with gradient colors, built with [Lit](https://lit.dev/).

[![npm version](https://img.shields.io/npm/v/@manufosela/arc-slider.svg)](https://www.npmjs.com/package/@manufosela/arc-slider)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="https://raw.githubusercontent.com/manufosela/ui-components/main/packages/arc-slider/demo/preview.png" alt="Arc Slider Preview" width="400">
</p>

## Features

- Customizable gradient colors
- Configurable min/max range
- Configurable arc shape (radius, start/end angles, stroke width)
- Touch and mouse support
- Accessible (ARIA labels)
- CSS custom properties for styling
- Zero dependencies (except Lit)

## Installation

```bash
npm install @manufosela/arc-slider
```

```bash
pnpm add @manufosela/arc-slider
```

```bash
yarn add @manufosela/arc-slider
```

## Usage

### Basic

```html
<script type="module">
  import '@manufosela/arc-slider';
</script>

<arc-slider></arc-slider>
```

### With custom range

```html
<arc-slider min-range="-50" max-range="50" arc-value="0"></arc-slider>
```

### With custom colors

```html
<arc-slider color1="#00FF00" color2="#0000FF"></arc-slider>
```

### With custom arc shape

```html
<!-- Quarter arc (bottom-left quadrant) -->
<arc-slider start-angle="180" end-angle="270"></arc-slider>

<!-- Bottom semi-circle -->
<arc-slider start-angle="0" end-angle="180"></arc-slider>

<!-- Smaller arc with thicker stroke -->
<arc-slider radius="60" stroke-width="12"></arc-slider>
```

### With step

```html
<arc-slider min-range="0" max-range="100" step="10"></arc-slider>
```

### Disabled state

```html
<arc-slider disabled></arc-slider>
```

### Listening to changes

```html
<arc-slider id="mySlider"></arc-slider>

<script type="module">
  import '@manufosela/arc-slider';

  document.getElementById('mySlider').addEventListener('change', (e) => {
    console.log('Value changed:', e.detail.value);
  });
</script>
```

### In a Lit component

```javascript
import { LitElement, html } from 'lit';
import '@manufosela/arc-slider';

class MyComponent extends LitElement {
  render() {
    return html`
      <arc-slider
        min-range="0"
        max-range="100"
        arc-value="50"
        color1="#FF5500"
        color2="#0055FF"
        start-angle="180"
        end-angle="0"
        @change=${this._handleChange}
      ></arc-slider>
    `;
  }

  _handleChange(e) {
    console.log('New value:', e.detail.value);
  }
}

customElements.define('my-component', MyComponent);
```

## API

### Properties/Attributes

| Property      | Attribute      | Type      | Default     | Description                              |
| ------------- | -------------- | --------- | ----------- | ---------------------------------------- |
| `minRange`    | `min-range`    | `Number`  | `0`         | Minimum value of the slider              |
| `maxRange`    | `max-range`    | `Number`  | `100`       | Maximum value of the slider              |
| `arcValue`    | `arc-value`    | `Number`  | middle      | Current value (reflects)                 |
| `step`        | `step`         | `Number`  | `1`         | Step increment                           |
| `disabled`    | `disabled`     | `Boolean` | `false`     | Disables the slider                      |
| `color1`      | `color1`       | `String`  | `#FF1122`   | Start color of gradient (hex)            |
| `color2`      | `color2`       | `String`  | `#1122FF`   | End color of gradient (hex)              |
| `radius`      | `radius`       | `Number`  | `100`       | Radius of the arc in pixels              |
| `startAngle`  | `start-angle`  | `Number`  | `180`       | Start angle in degrees (0° = right)      |
| `endAngle`    | `end-angle`    | `Number`  | `0`         | End angle in degrees                     |
| `strokeWidth` | `stroke-width` | `Number`  | `8`         | Width of the arc stroke in pixels        |

### Angle Reference

Angles follow standard SVG/CSS conventions:
- `0°` = Right (3 o'clock)
- `90°` = Bottom (6 o'clock)
- `180°` = Left (9 o'clock)
- `270°` = Top (12 o'clock)

The default arc (180° to 0°) creates a top semi-circle that goes from left to right.

### Events

| Event    | Detail               | Description                     |
| -------- | -------------------- | ------------------------------- |
| `change` | `{ id, value }`      | Fired when the value changes    |

### CSS Custom Properties

| Property                   | Default      | Description                |
| -------------------------- | ------------ | -------------------------- |
| `--arc-slider-text-color`  | `#000`       | Color of the value text    |
| `--arc-slider-thumb-size`  | `20px`       | Size of the slider thumb   |
| `--arc-slider-width`       | `12.5em`     | Width of the slider        |

## Styling Examples

### Custom size

```css
arc-slider {
  --arc-slider-width: 20em;
  --arc-slider-thumb-size: 1.5em;
}
```

### Custom text color

```css
arc-slider {
  --arc-slider-text-color: #333;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm start

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## License

MIT - see [LICENSE](./LICENSE)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](../../CONTRIBUTING.md) first.

## Related

- [@manufosela/ui-components](https://github.com/manufosela/ui-components) - Full UI components library
