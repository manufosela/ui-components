# @manufosela/element-card

Card component with title, description, cover image and slotted content laid out in a grid. Migrated to Lit 3.

## Installation

```bash
npm install @manufosela/element-card
```

## Usage

```html
<script type="module">
  import '@manufosela/element-card';
</script>

<element-card
  title="Javascript"
  description="ES6+, functional programming, web components"
  img-cover="js-logo.png"
  cover-bgcolor="rgba(255, 255, 0, 0.3)"
  text-color="#000"
>
  <div>Years: 10+</div>
  <div>Level: Advanced</div>
  <div>Ongoing project: ui-components monorepo</div>
</element-card>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | `Element-card` | Card title |
| `description` | String | `Description from element-card` | Card description |
| `cover-bgcolor` | String | `rgba(0,0,0,0.7)` | Cover background color |
| `text-color` | String | `#FFF` | Text color |
| `img-cover` | String | — | Cover image source |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--font-size` | `16px` | Base font size |
| `--fsize-element-base` | `1rem` | Base element font size |
| `--fsize-element-title` | `3rem` | Title font size |
| `--fsize-element-desc` | `2.625rem` | Description font size |
| `--imgcover-max-width` | `100%` | Max width of cover image |
| `--imgcover-opacity` | `1` | Opacity of cover image |

## Accessibility

- **`prefers-reduced-motion`** — hover/transition animations on the card are disabled when the user requests reduced motion
- The cover image uses the `title` attribute value as its `alt` text (e.g. `alt="Javascript"`) so screen readers announce a meaningful label
- The component renders standard HTML (`<h2>`, `<p>`, slotted content) — no custom ARIA roles are added, relying on native semantics
- Slotted child elements retain their own semantics and tab order unchanged

## License

MIT
