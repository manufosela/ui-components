# @manufosela/card-rain-section

Scroll-driven card rain animation section web component built with [Lit 3](https://lit.dev/).

Cards fall (or zoom) into view as the user scrolls through the page. Supports two animation modes, mobile-friendly trigger animations, and respects `prefers-reduced-motion` for accessibility.

## Installation

```bash
npm install @manufosela/card-rain-section
```

## Usage

```javascript
import '@manufosela/card-rain-section';
```

```html
<card-rain-section scroll-height="300">
  <span slot="title">Our<br>Services</span>

  <div slot="card">
    <h3>Design</h3>
    <p>Beautiful interfaces that delight users.</p>
  </div>

  <div slot="card">
    <h3>Development</h3>
    <p>Modern web applications built for scale.</p>
  </div>

  <div slot="card">
    <h3>Strategy</h3>
    <p>Data-driven decisions for measurable results.</p>
  </div>

  <button slot="actions">Learn More</button>
</card-rain-section>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `scroll-height` | Number | `300` | Height of the scroll area in viewport units |
| `fall-mode` | String | `'drop'` | Animation mode: `"drop"` or `"zoom"` |
| `mobile-breakpoint` | Number | `768` | Viewport width threshold for mobile layout (px) |

## Slots

| Slot | Description |
|------|-------------|
| `title` | Title content displayed behind the cards (parsed as innerHTML) |
| `card` | Card elements that animate into view (multiple allowed) |
| `actions` | Action buttons displayed at the bottom of the section |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--crs-bg` | `#1a1618` | Background color of the canvas area |
| `--crs-card-bg` | `var(--accent-gold, #bfa15f)` | Card background color |
| `--crs-card-radius` | `16px` | Card border radius |
| `--crs-card-width` | `440px` | Card width |
| `--crs-card-padding` | `48px` | Card inner padding |
| `--crs-title-size` | `10rem` | Title font size |
| `--crs-title-color` | `rgba(255, 255, 255, 1)` | Title text color |

## Animation Modes

### Drop (default)

Cards fall from above the viewport and settle into place with slight rotations and offsets. Each card scales up slightly as it lands.

```html
<card-rain-section fall-mode="drop">
  ...
</card-rain-section>
```

### Zoom

Cards scale down from a large size with a blur-to-sharp transition effect, creating a dramatic zoom-in appearance.

```html
<card-rain-section fall-mode="zoom">
  ...
</card-rain-section>
```

## Custom Styles

```html
<card-rain-section style="
  --crs-bg: #0a192f;
  --crs-card-bg: #112240;
  --crs-card-radius: 4px;
  --crs-title-color: rgba(100, 255, 218, 0.8);
  --crs-title-size: 8rem;
">
  ...
</card-rain-section>
```

## Accessibility

- The component respects `prefers-reduced-motion: reduce` by disabling all animations and displaying cards in a static vertical layout.
- On mobile viewports, cards use a simpler trigger-based animation when they scroll into view.
- The scroller region has `role="region"` with an `aria-label` for assistive technologies.

## License

MIT
