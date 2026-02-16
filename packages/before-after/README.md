# @manufosela/before-after

[![npm version](https://img.shields.io/npm/v/@manufosela/before-after)](https://www.npmjs.com/package/@manufosela/before-after)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Before/after image comparison slider web component built with [Lit 3](https://lit.dev/).

Drag the divider to reveal more of either image. Supports mouse, touch, and keyboard interaction with full ARIA slider semantics.

## Installation

```bash
npm install @manufosela/before-after
```

## Usage

```javascript
import '@manufosela/before-after';
```

```html
<before-after>
  <img slot="before" src="grayscale.jpg" alt="Before">
  <img slot="after" src="color.jpg" alt="After">
</before-after>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | Number | `50` | Divider position (0-100%) |
| `before-label` | String | `'Before'` | Label for the before image |
| `after-label` | String | `'After'` | Label for the after image |
| `hide-labels` | Boolean | `false` | Hide labels |
| `hover-mode` | Boolean | `false` | Divider follows mouse without clicking |
| `no-animation` | Boolean | `false` | Disable transitions |
| `disabled` | Boolean | `false` | Disable interaction |

## Slots

| Slot | Description |
|------|-------------|
| `before` | Image shown on the left (before) |
| `after` | Image shown on the right (after) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `before-after-change` | `{ position }` | Fired on release or key press |
| `before-after-input` | `{ position }` | Fired continuously during drag |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--before-after-divider-color` | `#ffffff` | Divider line color |
| `--before-after-divider-width` | `3px` | Divider line width |
| `--before-after-handle-size` | `40px` | Handle diameter |
| `--before-after-handle-color` | `#ffffff` | Handle color |
| `--before-after-label-bg` | `rgba(0,0,0,0.5)` | Label background |
| `--before-after-label-color` | `#ffffff` | Label text color |
| `--before-after-focus-color` | `#3b82f6` | Focus ring color |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Left/Right | Move 1% |
| Page Up/Down | Move 10% |
| Home | Go to 0% |
| End | Go to 100% |

## Examples

### Custom labels

```html
<before-after before-label="Original" after-label="Edited">
  <img slot="before" src="original.jpg" alt="Original">
  <img slot="after" src="edited.jpg" alt="Edited">
</before-after>
```

### Hover mode

```html
<before-after hover-mode hide-labels>
  <img slot="before" src="before.jpg" alt="Before">
  <img slot="after" src="after.jpg" alt="After">
</before-after>
```

### Custom styles

```html
<before-after style="
  --before-after-divider-color: #ff6600;
  --before-after-handle-size: 48px;
  --before-after-handle-color: #ff6600;
">
  <img slot="before" src="before.jpg" alt="Before">
  <img slot="after" src="after.jpg" alt="After">
</before-after>
```

## License

MIT
