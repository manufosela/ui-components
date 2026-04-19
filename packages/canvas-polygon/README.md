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

## Accessibility

- **`prefers-reduced-motion`** — no animations are present in this component; the polygon is rendered statically on a `<canvas>` element
- Canvas content is **not accessible to screen readers** — the `<canvas>` element renders a bitmap with no text alternative by default
- If the polygon conveys meaningful information, add an `aria-label` or visually hidden description on the host element (e.g. `<canvas-polygon aria-label="Hexagonal shape">`)
- The component is purely decorative in most uses; mark it with `aria-hidden="true"` on the host to hide it from assistive technology when that is the case

## License

MIT
