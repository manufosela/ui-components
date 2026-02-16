# @manufosela/device-card-stack

Accordion-style card stack with 3D perspective and image preview panel, built with [Lit 3](https://lit.dev/).

Cards expand on click to reveal their content while a side panel displays the associated image. On mobile viewports the preview panel is hidden and images appear inline within each card. Supports keyboard navigation and ARIA tablist semantics.

## Installation

```bash
npm install @manufosela/device-card-stack
```

## Usage

```javascript
import '@manufosela/device-card-stack';
```

```html
<device-card-stack>
  <div slot="card" data-title="Mountain" data-color="#1a1a2e"
       data-image="mountain.jpg" data-num="01">
    <p>Mountain landscape description.</p>
  </div>
  <div slot="card" data-title="Ocean" data-color="#16213e"
       data-image="ocean.jpg" data-num="02">
    <p>Ocean waves description.</p>
  </div>
  <div slot="card" data-title="Forest" data-color="#0f3460"
       data-image="forest.jpg" data-num="03">
    <p>Forest path description.</p>
  </div>
</device-card-stack>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `active-index` | Number | `0` | Index of the currently active card |
| `mobile-breakpoint` | Number | `768` | Viewport width (px) below which mobile layout is used |
| `stack-rotation` | Number | `3` | Rotation angle in degrees for inactive cards |
| `transition-duration` | Number | `500` | Transition duration in milliseconds |

## Slots

| Slot | Description |
|------|-------------|
| `card` | Card elements. Use `data-title`, `data-color`, `data-image`, and `data-num` attributes to configure each card. |

### Card data attributes

| Attribute | Description |
|-----------|-------------|
| `data-title` | Title displayed in the card header and body |
| `data-color` | Background color of the card |
| `data-image` | URL of the image shown in the preview panel |
| `data-num` | Number label shown in the card header (defaults to zero-padded index) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--dcs-border-radius` | `20px` | Border radius of the outer wrapper |
| `--dcs-height` | `700px` | Height of the component in desktop mode |
| `--dcs-preview-bg` | `#000` | Background color of the preview panel |
| `--dcs-text-color` | `#fff` | Text color for the card body title |
| `--dcs-title-size` | `3.5rem` | Font size of the expanded card title |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Down | Activate next card |
| Arrow Up | Activate previous card |
| Home | Activate first card |
| End | Activate last card |

## License

MIT
