# @manufosela/multi-select

Multi-select dropdown web component with checkbox options. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/multi-select
```

## Usage

```javascript
import '@manufosela/multi-select';
```

```html
<multi-select id="select"></multi-select>

<script>
  const select = document.getElementById('select');
  select.options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' }
  ];

  select.addEventListener('change', (e) => {
    console.log('Selected:', e.detail.selectedValues);
  });
</script>
```

## Features

- Multiple selection with checkboxes
- Click outside to close
- Programmatic select/clear all
- Optional alphabetical sorting (asc/desc)
- Custom placeholder
- Disabled state
- CSS custom properties for theming

## Attributes

| Attribute         | Type    | Default     | Description                              |
| ----------------- | ------- | ----------- | ---------------------------------------- |
| `placeholder`     | String  | `Select...` | Placeholder text                         |
| `disabled`        | Boolean | `false`     | Disable the select                       |
| `selected-values` | Array   | `[]`        | Currently selected values                |
| `sort`            | String  | `""`        | Sort options: `""` (none), `"asc"`, `"desc"` |

## Properties

| Property         | Type   | Description                                    |
| ---------------- | ------ | ---------------------------------------------- |
| `options`        | Array  | Array of `{ value: string, label: string }`    |
| `selectedValues` | Array  | Array of selected values                       |

## Methods

| Method        | Description                |
| ------------- | -------------------------- |
| `selectAll()` | Select all options         |
| `clearAll()`  | Clear all selections       |

## Events

| Event    | Detail                           | Description                  |
| -------- | -------------------------------- | ---------------------------- |
| `change` | `{ selectedValues: string[] }`   | Fired when selection changes |

## Examples

### Pre-selected Values

```html
<multi-select id="select"></multi-select>
<script>
  select.options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];
  select.selectedValues = ['a'];
</script>
```

### Programmatic Control

```javascript
// Select all
document.getElementById('select').selectAll();

// Clear all
document.getElementById('select').clearAll();
```

### Listen for Changes

```javascript
select.addEventListener('change', (e) => {
  const { selectedValues } = e.detail;
  console.log('Selected:', selectedValues);
});
```

### Sorted Options

```html
<!-- No sorting (default) - options appear in insertion order -->
<multi-select>
  <option value="cherry">Cherry</option>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</multi-select>

<!-- Sort alphabetically A-Z -->
<multi-select sort="asc">
  <option value="cherry">Cherry</option>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</multi-select>

<!-- Sort alphabetically Z-A -->
<multi-select sort="desc">
  <option value="cherry">Cherry</option>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
</multi-select>
```

## CSS Custom Properties

| Property                           | Default     | Description            |
| ---------------------------------- | ----------- | ---------------------- |
| `--multi-select-min-width`         | `200px`     | Minimum width          |
| `--multi-select-bg`                | `white`     | Background color       |
| `--multi-select-border-color`      | `#dee2e6`   | Border color           |
| `--multi-select-border-hover`      | `#adb5bd`   | Border hover color     |
| `--multi-select-border-focus`      | `#3b82f6`   | Border focus color     |
| `--multi-select-radius`            | `4px`       | Border radius          |
| `--multi-select-text-color`        | `#495057`   | Text color             |
| `--multi-select-placeholder-color` | `#6c757d`   | Placeholder color      |
| `--multi-select-checkbox-color`    | `#3b82f6`   | Checkbox accent color  |
| `--multi-select-option-hover-bg`   | `#f8f9fa`   | Option hover bg        |
| `--multi-select-option-selected-bg`| `#e9ecef`   | Selected option bg     |
| `--multi-select-max-height`        | `300px`     | Dropdown max height    |
| `--multi-select-z-index`           | `1000`      | Dropdown z-index       |

## License

MIT
