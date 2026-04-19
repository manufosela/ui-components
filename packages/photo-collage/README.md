# @manufosela/photo-collage

A photo collage web component that displays images in a grid with random rotations, optional polaroid style, automatic image cycling, and click-to-zoom.

## Installation

```bash
npm install @manufosela/photo-collage
```

## Usage

```html
<script type="module">
  import '@manufosela/photo-collage';
</script>

<photo-collage
  width="1200"
  height="700"
  cols="4"
  rows="3"
  max-rotation="15"
  interval="5"
  polaroid
  zoomable
  randomize
>
  <img src="photo1.jpg" alt="Photo 1">
  <img src="photo2.jpg" alt="Photo 2">
  <!-- Add more images than cols*rows to enable randomize -->
</photo-collage>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | Number | 1200 | Collage width in pixels |
| `height` | Number | 700 | Collage height in pixels |
| `cols` | Number | 4 | Number of columns |
| `rows` | Number | 3 | Number of rows |
| `max-rotation` | Number | 15 | Max random rotation in degrees |
| `randomize` | Boolean | false | Cycle through extra images with fade effect |
| `interval` | Number | 5 | Seconds between image swaps |
| `polaroid` | Boolean | true | Polaroid-style frame with shadow |
| `shuffle` | Boolean | false | Randomize initial image order |
| `zoomable` | Boolean | false | Click-to-zoom on photos |

## Slot

Pass `<img>` elements as children. If more images are provided than `cols * rows`, the extra images will be cycled in when `randomize` is enabled.

## Events

This component does not emit custom events.

## CSS Custom Properties

This component does not expose CSS custom properties. Layout and sizing are controlled via the `width`, `height`, `cols`, and `rows` attributes.

## Accessibility

- **`prefers-reduced-motion`** — hover zoom, image-swap fade transitions, and rotation animations are all disabled via `@media (prefers-reduced-motion: reduce)` in the component styles
- Each displayed photo renders with `alt="Collage photo N"` (auto-generated from position index); for meaningful content, provide `alt` text on the slotted `<img>` elements — the component reads `src` from them but does not override their `alt`
- When `zoomable` is enabled, pressing `Escape` closes the zoomed overlay (keyboard handler is attached to the document)
- The zoom overlay `<img>` carries `alt="Zoomed photo"`; images cycle with `loading="lazy"` to avoid unnecessary network requests

## License

MIT
