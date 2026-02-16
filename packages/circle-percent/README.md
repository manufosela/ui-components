# @manufosela/circle-percent

[![npm version](https://img.shields.io/npm/v/@manufosela/circle-percent)](https://www.npmjs.com/package/@manufosela/circle-percent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A circular progress indicator web component with animated SVG arc and customizable styling. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/circle-percent
```

## Usage

```javascript
import '@manufosela/circle-percent';
```

```html
<circle-percent percent="75" title="Progress"></circle-percent>
```

## Features

- Smooth animated progress transitions
- Customizable colors, sizes, and stroke widths
- Optional title label
- Toggle percentage display
- Responsive sizing
- Pure SVG rendering

## Attributes

| Attribute      | Type    | Default   | Description                           |
| -------------- | ------- | --------- | ------------------------------------- |
| `percent`      | Number  | `0`       | Progress value from 0 to 100          |
| `title`        | String  | `''`      | Text label displayed below the circle |
| `radius`       | Number  | `50`      | Radius of the circle in pixels        |
| `stroke-width` | Number  | `6`       | Width of the progress arc             |
| `stroke-color` | String  | `#3b82f6` | Color of the progress arc             |
| `show-percent` | Boolean | `true`    | Whether to display percentage text    |
| `size`         | String  | `medium`  | Predefined size: small, medium, large |

## Examples

### Basic Usage

```html
<circle-percent percent="75" title="Loading"></circle-percent>
```

### Custom Colors

```html
<!-- Success -->
<circle-percent percent="100" stroke-color="#22c55e" title="Complete"></circle-percent>

<!-- Warning -->
<circle-percent percent="50" stroke-color="#f59e0b" title="In Progress"></circle-percent>

<!-- Error -->
<circle-percent percent="25" stroke-color="#ef4444" title="Low"></circle-percent>
```

### Different Sizes

```html
<!-- Small -->
<circle-percent percent="50" radius="30" stroke-width="3" size="small"></circle-percent>

<!-- Large -->
<circle-percent percent="50" radius="80" stroke-width="10" size="large"></circle-percent>
```

### Without Percentage Text

```html
<circle-percent percent="75" show-percent="false" title="Loading..."></circle-percent>
```

### Thick Stroke

```html
<circle-percent percent="85" stroke-width="12" stroke-color="#8b5cf6"></circle-percent>
```

### Programmatic Updates

```javascript
const progress = document.querySelector('circle-percent');

// Update percentage
progress.percent = 50;

// Animate progress
let value = 0;
const interval = setInterval(() => {
  progress.percent = value;
  value += 1;
  if (value > 100) clearInterval(interval);
}, 50);
```

## CSS Custom Properties

| Property                              | Default         | Description                  |
| ------------------------------------- | --------------- | ---------------------------- |
| `--circle-percent-font-family`        | system fonts    | Font family                  |
| `--circle-percent-bg-color`           | `#e5e7eb`       | Background circle color      |
| `--circle-percent-text-size`          | `1.5rem`        | Percentage text size         |
| `--circle-percent-text-weight`        | `600`           | Percentage text weight       |
| `--circle-percent-text-color`         | `currentColor`  | Percentage text color        |
| `--circle-percent-title-size`         | `0.875rem`      | Title text size              |
| `--circle-percent-title-color`        | `#6b7280`       | Title text color             |
| `--circle-percent-title-margin`       | `0.75rem`       | Space above title            |
| `--circle-percent-animation-duration` | `0.5s`          | Transition duration          |

### Example: Custom Styling

```css
circle-percent {
  --circle-percent-bg-color: #1f2937;
  --circle-percent-text-color: #f3f4f6;
  --circle-percent-title-color: #9ca3af;
  --circle-percent-animation-duration: 1s;
}
```

## Accessibility

- Uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
- Dynamic `aria-label` announces title and current percentage
- SVG is hidden from assistive technology (`aria-hidden="true"`)
- Respects `prefers-reduced-motion` by disabling progress animation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Browser Support

This component uses modern web standards and is compatible with all evergreen browsers.

## License

MIT

## Author

manufosela
