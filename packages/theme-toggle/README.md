# @manufosela/theme-toggle

A light/dark theme toggle web component with smooth transitions and localStorage persistence. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/theme-toggle
```

## Usage

```javascript
import '@manufosela/theme-toggle';
```

```html
<theme-toggle></theme-toggle>
```

## Features

- Light/dark theme switching
- Automatic system preference detection
- localStorage persistence
- Smooth transitions
- Accessible (ARIA support)
- CSS class and data-attribute integration

## Attributes

| Attribute     | Type    | Default | Description                     |
| ------------- | ------- | ------- | ------------------------------- |
| `theme`       | String  | `light` | Current theme: 'light' or 'dark' |
| `persist`     | Boolean | `true`  | Persist theme to localStorage   |
| `storage-key` | String  | `theme` | localStorage key                |

## Methods

| Method           | Description                |
| ---------------- | -------------------------- |
| `setTheme(theme)`| Set theme to 'light' or 'dark' |
| `toggle()`       | Toggle between themes      |

## Events

| Event          | Detail           | Description          |
| -------------- | ---------------- | -------------------- |
| `theme-changed`| `{ theme: string }` | Fired on theme change |

```javascript
themeToggle.addEventListener('theme-changed', (e) => {
  console.log('New theme:', e.detail.theme);
});
```

## Document Integration

The component automatically:
- Sets `data-theme` attribute on `<html>`
- Adds/removes `dark` class on `<html>`

Use these in your CSS:

```css
:root[data-theme="dark"] {
  --bg: #1f2937;
  --text: #f3f4f6;
}

/* Or using class */
.dark {
  --bg: #1f2937;
}
```

## CSS Custom Properties

| Property                      | Default   | Description              |
| ----------------------------- | --------- | ------------------------ |
| `--theme-toggle-padding`      | `4px`     | Container padding        |
| `--theme-toggle-bg`           | `#f3f4f6` | Background color         |
| `--theme-toggle-radius`       | `9999px`  | Border radius            |
| `--theme-toggle-button-size`  | `36px`    | Button size              |
| `--theme-toggle-icon-size`    | `20px`    | Icon size                |
| `--theme-toggle-active-bg`    | `#fff`    | Active button background |

## License

MIT
