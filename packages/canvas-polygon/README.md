# @manufosela/canvas-polygon

A canvas-based regular polygon web component built with Lit 3.

## Installation

```bash
npm install @manufosela/canvas-polygon
```

## Usage

```html
<script type="module">
  import '@manufosela/canvas-polygon';
</script>

<canvas-polygon size="200" sides="6" bg-color="#00e0b3"></canvas-polygon>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | Number | 400 | Canvas width and height in pixels |
| `sides` | Number | 6 | Number of polygon sides (≥ 3) |
| `line-width` | Number | 1 | Stroke line width |
| `bg-color` | String | `transparent` | Fill color |
| `offset-rotation` | Number | auto | Rotation offset in radians |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--canvas-polygon-text-color` | `#000` | Host text color |

## License

MIT
