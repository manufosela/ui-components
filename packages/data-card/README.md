# @manufosela/data-card

[![npm version](https://img.shields.io/npm/v/@manufosela/data-card)](https://www.npmjs.com/package/@manufosela/data-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A versatile card web component for displaying data with optional cover image, icon, links, and modal info panel. Built with Lit.

## Installation

```bash
npm install @manufosela/data-card
```

## Usage

```javascript
import '@manufosela/data-card';
```

```html
<!-- Basic card -->
<data-card
  card-title="Welcome"
  description="A simple data card."
></data-card>

<!-- Card with icon -->
<data-card
  card-title="Settings"
  description="Configure your preferences."
  icon="⚙️"
></data-card>

<!-- Card with cover image -->
<data-card
  card-title="Mountain View"
  description="Beautiful landscape."
  img-cover="https://example.com/image.jpg"
></data-card>

<!-- Clickable card with link -->
<data-card
  card-title="Visit Site"
  description="Go to the website."
  url="https://example.com"
  newtab
></data-card>

<!-- Card with group badge -->
<data-card
  card-title="Tutorial"
  description="Learn something new."
  icon="📚"
  group="Education"
></data-card>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `card-title` | String | `''` | Card heading text |
| `description` | String | `''` | Card description text |
| `url` | String | `''` | Link URL when card is clicked |
| `newtab` | Boolean | `false` | Open link in new tab |
| `icon` | String | `''` | Icon character or emoji |
| `group` | String | `''` | Group/category label badge |
| `img-cover` | String | `''` | URL for cover image |
| `cover-bg-color` | String | `''` | Background color for cover area |
| `text-color` | String | `''` | Text color |
| `more-info` | String | `''` | URL to fetch additional info |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--data-card-width` | `280px` | Card width |
| `--data-card-min-height` | `200px` | Minimum height |
| `--data-card-bg` | `#ffffff` | Background color |
| `--data-card-border-color` | `#e5e7eb` | Border color |
| `--data-card-border-radius` | `16px` | Border radius |
| `--data-card-shadow` | `0 4px 6px...` | Box shadow |
| `--data-card-padding` | `1.5rem` | Content padding |
| `--data-card-title-size` | `1.25rem` | Title font size |
| `--data-card-title-color` | `#1f2937` | Title color |
| `--data-card-desc-size` | `0.875rem` | Description font size |
| `--data-card-desc-color` | `#6b7280` | Description color |
| `--data-card-icon-size` | `3rem` | Icon size |
| `--data-card-icon-color` | `#3b82f6` | Icon color |
| `--data-card-cover-height` | `140px` | Cover image height |
| `--data-card-cover-opacity` | `1` | Cover image opacity |
| `--data-card-group-bg` | `#3b82f6` | Group badge background |
| `--data-card-group-color` | `#ffffff` | Group badge text color |

## Slots

| Name | Description |
|------|-------------|
| (default) | Additional content below description |
| `footer` | Footer content with border separator |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `data-card-click` | `{ title, url, group }` | Fired when card is clicked |

## Examples

### Custom Styling

```html
<data-card
  card-title="Dark Card"
  icon="🌙"
  style="
    --data-card-bg: #1e293b;
    --data-card-title-color: #f8fafc;
    --data-card-desc-color: #94a3b8;
  "
></data-card>
```

### With Slotted Content

```html
<data-card card-title="Article">
  <div class="tags">
    <span>JavaScript</span>
    <span>Web Components</span>
  </div>
  <button slot="footer">Read More</button>
</data-card>
```

### Gradient Cover

```html
<data-card
  card-title="Featured"
  icon="⭐"
  cover-bg-color="linear-gradient(135deg, #667eea, #764ba2)"
></data-card>
```

## Accessibility

- Uses semantic `<article>` element for card container
- Title rendered as `<h3>` heading
- Cover images include `alt` attribute from card title
- More info panel uses `role="dialog"` with proper ARIA attributes
- Info trigger has `aria-expanded` state
- Respects `prefers-reduced-motion` by disabling hover animations and transitions

## License

MIT
