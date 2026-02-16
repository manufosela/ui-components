# @manufosela/hero-scroll-animation

Hero section with scroll-driven parallax animation built with [Lit 3](https://lit.dev/).

As the user scrolls, the hero content fades out and slides up while a center image rises and side images slide in from the edges. On mobile, the animation is triggered by an intersection observer instead of continuous scroll tracking.

## Installation

```bash
npm install @manufosela/hero-scroll-animation
```

## Usage

```javascript
import '@manufosela/hero-scroll-animation';
```

```html
<hero-scroll-animation>
  <img slot="background" src="bg.jpg" />
  <img slot="center" src="center.png" />
  <img slot="left" src="left.png" />
  <img slot="right" src="right.png" />
  <div slot="content">
    <h1>Hero Title</h1>
    <p>Subtitle text</p>
  </div>
</hero-scroll-animation>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `background-text` | String | `''` | Large decorative text behind the images |
| `scroll-height` | Number | `450` | Scroll distance in vh for the parallax effect |
| `overlay-opacity` | Number | `0.5` | Opacity of the dark overlay (0-1) |
| `scrub` | Number | `1` | Smoothing factor for scroll interpolation |
| `mobile-breakpoint` | Number | `768` | Viewport width (px) below which mobile mode activates |
| `mobile-scroll-height` | Number | `220` | Scroll distance in vh for mobile mode |

## Slots

| Slot | Description |
|------|-------------|
| `content` | Main content (headings, text, CTAs) displayed over the hero |
| `background` | Hidden `<img>` whose `src` is used as the background image |
| `center` | Hidden `<img>` whose `src` is used for the center parallax image |
| `left` | Hidden `<img>` whose `src` is used for the left side image |
| `right` | Hidden `<img>` whose `src` is used for the right side image |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--hero-accent-color` | `#bfa15f` | Accent color for decorative elements |
| `--hero-text-color` | `#f0f0f0` | Default text color inside the hero |
| `--hero-bg-gradient-start` | `#d4af37` | Start color for the background text gradient |
| `--hero-bg-gradient-end` | `#f4e4b0` | End color for the background text gradient |

## Examples

### With background text

```html
<hero-scroll-animation background-text="PREMIUM">
  <img slot="background" src="bg.jpg" />
  <img slot="center" src="center.png" />
  <div slot="content">
    <h1>Premium Collection</h1>
  </div>
</hero-scroll-animation>
```

### Custom overlay and scroll distance

```html
<hero-scroll-animation overlay-opacity="0.7" scroll-height="350">
  <img slot="background" src="bg.jpg" />
  <img slot="center" src="center.png" />
  <img slot="left" src="left.png" />
  <img slot="right" src="right.png" />
  <div slot="content">
    <h1>Dark Hero</h1>
  </div>
</hero-scroll-animation>
```

### Custom gradient colors

```html
<hero-scroll-animation
  background-text="EXPLORE"
  style="
    --hero-bg-gradient-start: #e63946;
    --hero-bg-gradient-end: #f4a261;
  "
>
  <img slot="background" src="bg.jpg" />
  <img slot="center" src="center.png" />
  <div slot="content">
    <h1>Explore</h1>
  </div>
</hero-scroll-animation>
```

## License

MIT
