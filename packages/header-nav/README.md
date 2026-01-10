# @manufosela/header-nav

Responsive header navigation web component with hamburger menu. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/header-nav
```

## Usage

```javascript
import '@manufosela/header-nav';
```

```html
<header-nav logo="logo.png">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</header-nav>
```

## Features

- Responsive hamburger menu
- Logo image or custom slot
- Mobile overlay
- Sticky positioning
- Customizable breakpoint
- CSS custom properties for theming
- Accessible (ARIA attributes)

## Attributes

| Attribute           | Type    | Default | Description                     |
| ------------------- | ------- | ------- | ------------------------------- |
| `logo`              | String  | `''`    | Logo image URL                  |
| `logo-alt`          | String  | `'Logo'`| Logo alt text                   |
| `logo-href`         | String  | `'/'`   | Logo link URL                   |
| `sticky`            | Boolean | `false` | Make header sticky              |
| `mobile-breakpoint` | Number  | `768`   | Breakpoint for mobile menu (px) |

## Slots

| Slot        | Description                          |
| ----------- | ------------------------------------ |
| (default)   | Navigation links                     |
| `logo`      | Custom logo content                  |
| `logo-text` | Text logo (used when no logo image)  |
| `mobile`    | Additional mobile-only content       |

## Events

| Event         | Detail        | Description               |
| ------------- | ------------- | ------------------------- |
| `menu-toggle` | `{ open }`    | Fired when menu toggles   |

## Examples

### Basic

```html
<header-nav logo="logo.png">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</header-nav>
```

### Text Logo

```html
<header-nav>
  <span slot="logo-text" style="font-weight: bold; font-size: 1.5rem;">MyBrand</span>
  <a href="/">Home</a>
  <a href="/products">Products</a>
</header-nav>
```

### Custom Logo Slot

```html
<header-nav>
  <div slot="logo">
    <img src="icon.svg" width="32" />
    <span>Company Name</span>
  </div>
  <a href="/">Home</a>
</header-nav>
```

### Sticky Header

```html
<header-nav logo="logo.png" sticky>
  <a href="/">Home</a>
  <a href="/about">About</a>
</header-nav>
```

### Custom Breakpoint

```html
<header-nav logo="logo.png" mobile-breakpoint="1024">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/services">Services</a>
  <a href="/portfolio">Portfolio</a>
  <a href="/contact">Contact</a>
</header-nav>
```

### Dark Theme

```html
<header-nav
  logo="logo-white.png"
  style="--header-bg: #1e293b; --header-link-color: #e2e8f0; --header-link-hover: #3b82f6;"
>
  <a href="/">Home</a>
  <a href="/about">About</a>
</header-nav>
```

### Event Handling

```javascript
const headerNav = document.querySelector('header-nav');

headerNav.addEventListener('menu-toggle', (e) => {
  console.log('Menu is', e.detail.open ? 'open' : 'closed');
});
```

## CSS Custom Properties

| Property              | Default                         | Description        |
| --------------------- | ------------------------------- | ------------------ |
| `--header-height`     | `60px`                          | Header height      |
| `--header-bg`         | `#fff`                          | Background color   |
| `--header-shadow`     | `0 2px 4px rgba(0,0,0,0.1)`     | Box shadow         |
| `--header-link-color` | `#374151`                       | Link color         |
| `--header-link-hover` | `#3b82f6`                       | Link hover color   |

## Styling Example

```css
header-nav {
  --header-height: 70px;
  --header-bg: linear-gradient(135deg, #667eea, #764ba2);
  --header-link-color: white;
  --header-link-hover: #fbbf24;
  --header-shadow: none;
}
```

## Compared to Original

| Feature | Original | New |
| ------- | -------- | --- |
| Lit version | Lit 2.x | Lit 3.x |
| Dependencies | mixin-getlightdom | None |
| Mobile menu | Checkbox hack | JavaScript |
| Overlay | No | Yes |
| Breakpoint | CSS-based | Configurable |
| Sticky | No | Yes |
| Events | No | Yes |
| Tests | Basic | Comprehensive |

## Accessibility

- Hamburger button has `aria-label="Toggle menu"` for screen readers
- `aria-expanded` reflects the current menu state
- Links in mobile menu close the menu on click for keyboard users
- Overlay allows clicking outside to close the menu
- Respects `prefers-reduced-motion` by disabling transitions

## License

Apache-2.0
