# @manufosela/multi-carousel

Responsive multi-slide carousel web component with navigation and arrows. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/multi-carousel
```

## Usage

```javascript
import '@manufosela/multi-carousel';
```

```html
<multi-carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</multi-carousel>
```

## Features

- Smooth CSS transitions
- Navigation dots and arrows
- Keyboard navigation (arrow keys)
- Autoplay support
- Loop/no-loop modes
- Carousel sync (master/slave)
- Touch-friendly
- Fully accessible (ARIA)
- CSS custom properties for theming

## Attributes

| Attribute     | Type    | Default | Description                        |
| ------------- | ------- | ------- | ---------------------------------- |
| `current`     | Number  | `0`     | Current slide index (0-based)      |
| `autoplay`    | Number  | `0`     | Auto-advance interval in ms        |
| `show-nav`    | Boolean | `true`  | Show navigation dots               |
| `show-arrows` | Boolean | `true`  | Show prev/next arrows              |
| `loop`        | Boolean | `true`  | Loop slides infinitely             |
| `master`      | Boolean | `false` | Act as master for sync             |
| `master-id`   | String  | `''`    | ID of master carousel to sync with |

## Methods

| Method       | Description              |
| ------------ | ------------------------ |
| `next()`     | Go to next slide         |
| `prev()`     | Go to previous slide     |
| `goTo(index)`| Go to specific slide     |

## Events

| Event          | Detail              | Description              |
| -------------- | ------------------- | ------------------------ |
| `slide-change` | `{ index, total }`  | Fired when slide changes |

## Autoplay

```html
<!-- Auto-advance every 3 seconds -->
<multi-carousel autoplay="3000">
  <div>Slide 1</div>
  <div>Slide 2</div>
</multi-carousel>
```

## Synced Carousels

Sync multiple carousels together:

```html
<!-- Master carousel -->
<multi-carousel id="main" master>
  <img src="photo1.jpg" />
  <img src="photo2.jpg" />
</multi-carousel>

<!-- Synced thumbnail carousel -->
<multi-carousel master-id="main">
  <img src="thumb1.jpg" />
  <img src="thumb2.jpg" />
</multi-carousel>
```

## Keyboard Navigation

Focus the carousel (click or Tab) then use:
- **ArrowRight**: Next slide
- **ArrowLeft**: Previous slide

## CSS Custom Properties

| Property                    | Default                | Description        |
| --------------------------- | ---------------------- | ------------------ |
| `--carousel-width`          | `100%`                 | Carousel width     |
| `--carousel-height`         | `300px`                | Carousel height    |
| `--carousel-bg`             | `#f8fafc`              | Background color   |
| `--carousel-radius`         | `12px`                 | Border radius      |
| `--carousel-transition`     | `0.4s`                 | Slide transition   |
| `--carousel-nav-color`      | `#94a3b8`              | Dot color          |
| `--carousel-nav-active`     | `#3b82f6`              | Active dot color   |
| `--carousel-nav-bg`         | `rgba(255,255,255,0.8)`| Nav background     |
| `--carousel-arrow-color`    | `#64748b`              | Arrow color        |
| `--carousel-arrow-bg`       | `rgba(255,255,255,0.9)`| Arrow background   |
| `--carousel-focus-color`    | `#3b82f6`              | Focus ring color   |

## Styling Example

```css
multi-carousel {
  --carousel-height: 400px;
  --carousel-bg: #1e293b;
  --carousel-nav-active: #ec4899;
  --carousel-arrow-bg: rgba(0, 0, 0, 0.5);
  --carousel-arrow-color: white;
}
```

## Slide Content

Slides can contain any HTML:

```html
<multi-carousel>
  <div class="slide">
    <img src="image.jpg" alt="Photo" />
    <h3>Caption</h3>
  </div>
  <div class="slide">
    <video src="video.mp4" controls></video>
  </div>
</multi-carousel>
```

## Accessibility

- `role="region"` and `aria-roledescription="carousel"` on container
- `aria-live="polite"` for slide change announcements
- Navigation dots use `role="tablist"` and `role="tab"`
- `aria-selected` and `aria-label` on navigation dots
- Arrow buttons have descriptive `aria-label`
- Full keyboard navigation (Arrow keys)
- Focus visible indicator on carousel
- Respects `prefers-reduced-motion` by disabling animations

## License

MIT
