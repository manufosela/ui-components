# @manufosela/nav-list

Horizontal navigation list web component with selection support. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/nav-list
```

## Usage

```javascript
import '@manufosela/nav-list';
```

```html
<nav-list id="menu" title="Select Option"></nav-list>

<script>
  const menu = document.getElementById('menu');
  menu.listValues = ['Option 1', 'Option 2', 'Option 3'];
  menu.addEventListener('navlist-changed', (e) => {
    console.log('Selected:', e.detail.value);
  });
</script>
```

## Features

- Horizontal navigation list with selection
- Light DOM support (define items in HTML)
- Keyboard navigation (Enter/Space)
- External event control (next/previous)
- Fixed (read-only) mode
- CSS custom properties for theming
- Accessible (ARIA radiogroup)

## Attributes

| Attribute       | Type    | Default | Description                              |
| --------------- | ------- | ------- | ---------------------------------------- |
| `title`         | String  | `''`    | Title displayed above the list           |
| `selected`      | String  | `null`  | Currently selected value                 |
| `fixed`         | Boolean | `false` | If true, selection is disabled           |
| `listen-events` | Boolean | `false` | Listen for navlist-next/navlist-last events |

## Properties

| Property     | Type     | Description                |
| ------------ | -------- | -------------------------- |
| `listValues` | String[] | Array of values to display |

## Methods

| Method | Description |
| ------ | ----------- |
| -      | Use events for programmatic control |

## Events

| Event             | Detail                    | Description                |
| ----------------- | ------------------------- | -------------------------- |
| `navlist-changed` | `{ value, pos, id }`      | Fired when selection changes |

## Light DOM Usage

Define items directly in HTML:

```html
<nav-list title="Categories">
  <ul>
    <li>Electronics</li>
    <li>Clothing</li>
    <li>Books</li>
  </ul>
</nav-list>
```

## Event-driven Navigation

Control selection programmatically:

```html
<nav-list id="pages" listen-events></nav-list>

<script>
  // Go to next item
  document.dispatchEvent(new CustomEvent('navlist-next', {
    detail: { id: 'pages' }
  }));

  // Go to previous item
  document.dispatchEvent(new CustomEvent('navlist-last', {
    detail: { id: 'pages' }
  }));
</script>
```

## CSS Custom Properties

| Property                          | Default              | Description              |
| --------------------------------- | -------------------- | ------------------------ |
| `--nav-list-gap`                  | `5px`                | Gap between items        |
| `--nav-list-padding`              | `10px 20px`          | Item padding             |
| `--nav-list-font-size`            | `14px`               | Font size                |
| `--nav-list-letter-spacing`       | `2px`                | Letter spacing           |
| `--nav-list-border-radius`        | `4px`                | Border radius            |
| `--nav-list-border-color`         | `transparent`        | Border color             |
| `--nav-list-bg`                   | `transparent`        | Background color         |
| `--nav-list-hover-bg`             | `rgba(0,0,0,0.05)`   | Hover background         |
| `--nav-list-selected-border-color`| `#cc3743`            | Selected border color    |
| `--nav-list-selected-bg`          | `transparent`        | Selected background      |
| `--nav-list-selected-color`       | `inherit`            | Selected text color      |
| `--nav-list-focus-color`          | `#3b82f6`            | Focus ring color         |
| `--nav-list-title-size`           | `16px`               | Title font size          |
| `--nav-list-title-weight`         | `700`                | Title font weight        |
| `--nav-list-title-color`          | `inherit`            | Title color              |

## Styling Examples

### Pill Style

```css
nav-list {
  --nav-list-selected-border-color: transparent;
  --nav-list-selected-bg: #3b82f6;
  --nav-list-selected-color: white;
  --nav-list-border-radius: 999px;
  --nav-list-padding: 8px 20px;
}
```

### Underline Style

```css
nav-list {
  --nav-list-border-radius: 0;
  --nav-list-selected-border-color: transparent;
  --nav-list-padding: 10px 16px;
}
nav-list .navlist__item--selected {
  border-bottom: 2px solid #3b82f6;
}
```

## License

Apache-2.0
