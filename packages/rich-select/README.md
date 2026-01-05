# @manufosela/rich-select

A customizable rich select dropdown web component with search, keyboard navigation, and extensive styling options. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/rich-select
```

## Usage

```javascript
import '@manufosela/rich-select';
```

```html
<rich-select arrow>
  <rich-option value="apple">Apple</rich-option>
  <rich-option value="banana">Banana</rich-option>
  <rich-option value="cherry">Cherry</rich-option>
</rich-select>
```

## Features

- Search/filter functionality
- Full keyboard navigation (Arrow keys, Home, End, Enter, Escape)
- Disabled options support
- Dark mode support (via `.dark` parent class)
- Extensive CSS custom properties for styling
- Animated dropdown transitions
- Accessible with proper focus management
- Pre-selected values
- Custom search records for enhanced filtering

## Components

### `<rich-select>`

The main dropdown container component.

#### Attributes

| Attribute     | Type    | Default      | Description                           |
| ------------- | ------- | ------------ | ------------------------------------- |
| `expanded`    | Boolean | `false`      | Whether the dropdown is open          |
| `disabled`    | Boolean | `false`      | Disables the entire select            |
| `search`      | Boolean | `false`      | Shows search input when enabled       |
| `arrow`       | Boolean | `true`       | Shows dropdown arrow indicator        |
| `animated`    | Boolean | `true`       | Enables open/close animations         |
| `placeholder` | String  | `"Search..."` | Placeholder for search input          |
| `name`        | String  | -            | Form field name (included in events)  |

#### Events

| Event    | Detail                        | Description                        |
| -------- | ----------------------------- | ---------------------------------- |
| `change` | `{ value: string, name: string }` | Fired when selection changes     |

### `<rich-option>`

Individual option elements within the select.

#### Attributes

| Attribute    | Type    | Default | Description                                      |
| ------------ | ------- | ------- | ------------------------------------------------ |
| `value`      | String  | -       | Option value (defaults to innerText if not set)  |
| `selected`   | Boolean | `false` | Marks option as selected                         |
| `disabled`   | Boolean | `false` | Disables this option                             |
| `title`      | String  | -       | Display title (used when selected)               |
| `record`     | String  | -       | Searchable text (for enhanced filtering)         |
| `considered` | Boolean | `false` | Option is being considered (keyboard navigation) |

## Examples

### Basic Select

```html
<rich-select arrow>
  <rich-option value="small">Small</rich-option>
  <rich-option value="medium" selected>Medium</rich-option>
  <rich-option value="large">Large</rich-option>
</rich-select>
```

### With Search

```html
<rich-select arrow search placeholder="Find a country...">
  <rich-option value="ar">Argentina</rich-option>
  <rich-option value="au">Australia</rich-option>
  <rich-option value="br">Brazil</rich-option>
  <rich-option value="ca">Canada</rich-option>
  <!-- ... more options -->
</rich-select>
```

### With Custom Search Records

Enhance search by providing additional searchable keywords:

```html
<rich-select arrow search>
  <rich-option value="smile" record="emoji face happy">Smile</rich-option>
  <rich-option value="heart" record="emoji love favorite">Heart</rich-option>
  <rich-option value="star" record="emoji rating favorite">Star</rich-option>
</rich-select>
```

### With Disabled Options

```html
<rich-select arrow>
  <rich-option value="free">Free Plan</rich-option>
  <rich-option value="pro">Pro Plan</rich-option>
  <rich-option value="enterprise" disabled>Enterprise (Contact Sales)</rich-option>
</rich-select>
```

### Event Handling

```html
<rich-select arrow name="category" id="mySelect">
  <rich-option value="electronics">Electronics</rich-option>
  <rich-option value="clothing">Clothing</rich-option>
</rich-select>

<script>
  document.getElementById('mySelect').addEventListener('change', (e) => {
    console.log('Selected value:', e.detail.value);
    console.log('Field name:', e.detail.name);
  });
</script>
```

### Programmatic Value Setting

```javascript
const select = document.querySelector('rich-select');
select.value = 'banana'; // Sets selection to the option with value="banana"
```

## Keyboard Navigation

| Key        | Action                          |
| ---------- | ------------------------------- |
| `↓`        | Move to next option             |
| `↑`        | Move to previous option         |
| `Home`     | Move to first option            |
| `End`      | Move to last option             |
| `Enter`    | Select current option / Open    |
| `Escape`   | Close dropdown                  |
| `A-Z, 0-9` | Open and start typing to search |

## CSS Custom Properties

### Caller (Trigger Button)

| Property                      | Default                     | Description                  |
| ----------------------------- | --------------------------- | ---------------------------- |
| `--rich-select-width`         | `auto`                      | Width of the select          |
| `--rich-select-font-family`   | `inherit`                   | Font family                  |
| `--caller-padding`            | `8px 12px`                  | Padding                      |
| `--caller-background`         | `#fff`                      | Background color             |
| `--caller-color`              | `inherit`                   | Text color                   |
| `--caller-border`             | `1px solid #d1d5db`         | Border                       |
| `--caller-border-radius`      | `6px`                       | Border radius                |
| `--caller-shadow`             | `0 1px 3px rgba(0,0,0,0.1)` | Box shadow                   |
| `--caller-hover-background`   | `#f9fafb`                   | Hover background             |
| `--caller-focus-border-color` | `#3b82f6`                   | Focus border color           |

### Dropdown

| Property                       | Default | Description              |
| ------------------------------ | ------- | ------------------------ |
| `--selectOptions-max-height`   | `300px` | Max height of dropdown   |
| `--selectOptions-background`   | `#fff`  | Background               |
| `--selectOptions-border-radius`| `6px`   | Border radius            |
| `--selectOptions-zIndex`       | `50`    | Z-index                  |

### Options

| Property                      | Default   | Description                       |
| ----------------------------- | --------- | --------------------------------- |
| `--option-padding`            | `10px 12px` | Option padding                  |
| `--option-hover-background`   | `#f3f4f6` | Hover background                  |
| `--option-active-background`  | `#3b82f6` | Considered (keyboard) background  |
| `--option-active-color`       | `#fff`    | Considered text color             |
| `--option-selected-background`| `#eff6ff` | Selected option background        |
| `--option-selected-color`     | `#1d4ed8` | Selected option text color        |
| `--option-disabled-color`     | `#9ca3af` | Disabled option text color        |

### Search Input

| Property                    | Default | Description            |
| --------------------------- | ------- | ---------------------- |
| `--input-padding`           | `6px 10px` | Input padding       |
| `--input-border`            | `1px solid #d1d5db` | Border   |
| `--input-focus-border-color`| `#3b82f6` | Focus border color  |

### Arrow

| Property            | Default | Description     |
| ------------------- | ------- | --------------- |
| `--arrow-font-size` | `14px`  | Arrow size      |
| `--arrow-color`     | `#6b7280` | Arrow color   |

## Dark Mode

The component automatically adapts to dark mode when placed inside a container with the `.dark` class:

```html
<div class="dark">
  <rich-select arrow>
    <rich-option>Option 1</rich-option>
    <rich-option>Option 2</rich-option>
  </rich-select>
</div>
```

Dark mode CSS properties are prefixed with `--dark-*` (e.g., `--dark-caller-background`).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Browser Support

This component uses modern web standards and is compatible with all evergreen browsers.

## License

Apache-2.0

## Author

manufosela
