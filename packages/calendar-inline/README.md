# @manufosela/calendar-inline

[![npm version](https://img.shields.io/npm/v/@manufosela/calendar-inline)](https://www.npmjs.com/package/@manufosela/calendar-inline)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Inline calendar web component built with Lit 3. Features date selection, navigation, holidays, week numbers, and full localization support.

## Installation

```bash
npm install @manufosela/calendar-inline
```

## Usage

```html
<script type="module">
  import '@manufosela/calendar-inline';
</script>

<calendar-inline></calendar-inline>
```

## Examples

### Basic Usage

```html
<calendar-inline></calendar-inline>
```

### Pre-selected Date

```html
<calendar-inline value="2025-01-15"></calendar-inline>
```

### Date Range

```html
<calendar-inline
  min="2025-01-01"
  max="2025-12-31"
></calendar-inline>
```

### With Holidays

```html
<calendar-inline id="cal"></calendar-inline>
<script>
  document.getElementById('cal').holidays = [
    { date: '2025-01-01', title: 'New Year' },
    { date: '2025-12-25', title: 'Christmas' }
  ];
</script>
```

### Week Numbers

```html
<calendar-inline show-week-numbers></calendar-inline>
```

### Sunday Start

```html
<calendar-inline first-day-of-week="0"></calendar-inline>
```

### Disabled Dates

```html
<calendar-inline id="cal"></calendar-inline>
<script>
  document.getElementById('cal').disabledDates = [
    '2025-01-05',
    '2025-01-12',
    '2025-01-19'
  ];
</script>
```

### Spanish Locale

```html
<calendar-inline locale="es"></calendar-inline>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `String` | `''` | Selected date (ISO format: YYYY-MM-DD) |
| `min` | `String` | `''` | Minimum selectable date |
| `max` | `String` | `''` | Maximum selectable date |
| `disabledDates` | `Array` | `[]` | Array of disabled date strings |
| `holidays` | `Array` | `[]` | Array of `{date, title}` objects |
| `firstDayOfWeek` | `Number` | `1` | First day (0=Sunday, 1=Monday) |
| `showWeekNumbers` | `Boolean` | `false` | Show ISO week numbers |
| `locale` | `String` | `'en'` | Locale for formatting |

## Methods

| Method | Description |
|--------|-------------|
| `goToMonth(year, month)` | Navigate to specific month (0-11) |
| `goToToday()` | Navigate to current month |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `date-select` | `{date, dateObj, holiday}` | Fired when a date is selected |
| `month-change` | `{month, year}` | Fired when month changes |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--calendar-bg` | `#fff` | Background color |
| `--calendar-text` | `#1f2937` | Text color |
| `--calendar-accent` | `#3b82f6` | Accent color |
| `--calendar-today` | `#dbeafe` | Today highlight color |
| `--calendar-selected` | `#3b82f6` | Selected date color |

## Styling Example

```html
<calendar-inline style="
  --calendar-accent: #8b5cf6;
  --calendar-selected: #8b5cf6;
  --calendar-today: #f3e8ff;
"></calendar-inline>
```

## Accessibility

- Navigation buttons have `aria-label` for screen readers
- Holiday dates show descriptive `title` attribute on hover
- Visual indicators for today, selected, disabled, and holiday states
- Respects `prefers-reduced-motion` by disabling transitions

## License

Apache-2.0
