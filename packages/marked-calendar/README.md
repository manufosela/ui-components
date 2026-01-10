# @manufosela/marked-calendar

Interactive calendar web component for tracking moods, habits, or marking dates. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/marked-calendar
```

## Usage

```javascript
import '@manufosela/marked-calendar';
```

```html
<marked-calendar
  name="My Year Tracker"
  save-data
  weekends
  change-view
></marked-calendar>
```

## Features

- Year and month views
- Customizable legend/mood colors
- LocalStorage persistence
- Weekend highlighting
- Holiday support
- Multi-language (English/Spanish)
- Keyboard accessible
- CSS custom properties for theming

## Attributes

| Attribute     | Type    | Default          | Description                      |
| ------------- | ------- | ---------------- | -------------------------------- |
| `name`        | String  | `Year in Pixels` | Calendar title                   |
| `lang`        | String  | `en`             | Language: `en` or `es`           |
| `view`        | String  | `year`           | View mode: `year` or `month`     |
| `year`        | Number  | Current year     | Display year                     |
| `month`       | Number  | Current month    | Display month (0-11)             |
| `save-data`   | Boolean | `false`          | Enable interactive mode          |
| `weekends`    | Boolean | `false`          | Highlight/block weekends         |
| `change-view` | Boolean | `true`           | Allow view switching             |

## Methods

| Method                     | Description                        |
| -------------------------- | ---------------------------------- |
| `setMarkedDays(days)`      | Set marked days programmatically   |
| `getMarkedDays()`          | Get all marked days                |
| `clearData()`              | Clear all marked days              |

## Events

| Event                        | Detail                        | Description              |
| ---------------------------- | ----------------------------- | ------------------------ |
| `marked-calendar-change`     | `{ year, month, day, value }` | Fired when day is marked |
| `marked-calendar-view-change`| `{ view, year, month }`       | Fired on view change     |

## Custom Legend

Define custom colors and labels:

```html
<marked-calendar save-data>
  <ul id="legend">
    <li code="#22c55e" label="✓">Completed</li>
    <li code="#ef4444" label="✗">Missed</li>
    <li code="#f59e0b" label="½">Partial</li>
  </ul>
</marked-calendar>
```

## Holidays

Define holidays that will be blocked:

```html
<marked-calendar save-data weekends>
  <ul id="holidays">
    <li title="New Year">1/1</li>
    <li title="Christmas">25/12</li>
    <li title="Labor Day">1/5</li>
  </ul>
</marked-calendar>
```

## Programmatic Usage

```javascript
const calendar = document.querySelector('marked-calendar');

// Set marked days
calendar.setMarkedDays([
  { day: '1/1', value: 1 },
  { day: '2/1', value: 2 },
  { day: '15/3', value: 3 }
]);

// Get marked days
const days = calendar.getMarkedDays();
console.log(days);

// Clear all
calendar.clearData();

// Listen for changes
calendar.addEventListener('marked-calendar-change', (e) => {
  console.log('Day marked:', e.detail);
});
```

## CSS Custom Properties

| Property            | Default    | Description        |
| ------------------- | ---------- | ------------------ |
| `--calendar-bg`     | `#f8fafc`  | Background color   |
| `--calendar-border` | `#e2e8f0`  | Border color       |
| `--cell-size`       | `1.25rem`  | Day cell size      |

## Views

### Year View (default)
Shows all 12 months in a compact grid. Click month letters to switch to month view.

### Month View
Traditional calendar grid with weekday headers. Navigate between months with arrows.

## Default Legend

| Color   | Label | Title  |
| ------- | ----- | ------ |
| White   | ✕     | Clear  |
| Green   | 😃    | Great  |
| Blue    | 😊    | Good   |
| Gray    | 😐    | Okay   |
| Orange  | 😕    | Meh    |
| Red     | 😢    | Bad    |

## Accessibility

- Legend buttons have descriptive `title` attributes
- Day cells show state information via `title` on hover
- Disabled legend items are properly marked `disabled`
- Keyboard navigable buttons for navigation and view switching
- Blocked weekend/holiday cells are visually distinct
- Respects `prefers-reduced-motion` by disabling animations

## License

Apache-2.0
