# @manufosela/slider-underline

Range slider web component with underline track style. Built with Lit 3.

## Installation

```bash
npm install @manufosela/slider-underline
```

## Usage

```html
<script type="module">
  import '@manufosela/slider-underline';
</script>

<slider-underline label="Volume" value="50"></slider-underline>
```

## Examples

### Basic Usage

```html
<slider-underline label="Volume"></slider-underline>
```

### Custom Range

```html
<slider-underline
  label="Temperature"
  min="0"
  max="40"
  value="22"
  unit="°C"
></slider-underline>
```

### Step Values

```html
<slider-underline step="10" min="0" max="100"></slider-underline>
```

### Value Positions

```html
<!-- Above (default) -->
<slider-underline label-position="above"></slider-underline>

<!-- Below -->
<slider-underline label-position="below"></slider-underline>

<!-- Tooltip -->
<slider-underline label-position="tooltip"></slider-underline>
```

### Disabled

```html
<slider-underline disabled value="30"></slider-underline>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `Number` | `50` | Current value |
| `min` | `Number` | `0` | Minimum value |
| `max` | `Number` | `100` | Maximum value |
| `step` | `Number` | `1` | Step increment |
| `disabled` | `Boolean` | `false` | Disabled state |
| `showValue` | `Boolean` | `true` | Show value display |
| `labelPosition` | `String` | `'above'` | above, below, tooltip |
| `label` | `String` | `''` | Label text |
| `unit` | `String` | `''` | Unit suffix |

## Methods

| Method | Description |
|--------|-------------|
| `setValue(val)` | Set value (clamped to range) |
| `increase()` | Increase by step |
| `decrease()` | Decrease by step |
| `reset()` | Reset to minimum |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `input` | `{value}` | Fired continuously while dragging |
| `change` | `{value}` | Fired on release |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--slider-track` | `#e5e7eb` | Track color |
| `--slider-fill` | `#3b82f6` | Filled track color |
| `--slider-thumb` | `#3b82f6` | Thumb color |
| `--slider-thumb-border` | `none` | Thumb border |
| `--slider-thumb-size` | `20px` | Thumb size |
| `--slider-track-height` | `4px` | Track height |
| `--slider-label-color` | `#1f2937` | Label text color |

## Styling Examples

```html
<!-- Green theme -->
<slider-underline style="
  --slider-fill: #22c55e;
  --slider-thumb: #22c55e;
"></slider-underline>

<!-- Large track -->
<slider-underline style="
  --slider-thumb-size: 28px;
  --slider-track-height: 8px;
"></slider-underline>

<!-- Bordered thumb -->
<slider-underline style="
  --slider-thumb: white;
  --slider-thumb-border: 3px solid #3b82f6;
"></slider-underline>
```

## Accessibility

- Native range input element
- ARIA valuemin, valuemax, valuenow
- ARIA valuetext for screen readers
- Keyboard navigation support

## License

Apache-2.0
