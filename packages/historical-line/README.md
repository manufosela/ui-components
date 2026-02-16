# @manufosela/historical-line

[![npm version](https://img.shields.io/npm/v/@manufosela/historical-line)](https://www.npmjs.com/package/@manufosela/historical-line)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A horizontal timeline visualization web component for displaying historical data, built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/historical-line
```

## Usage

```javascript
import '@manufosela/historical-line';
```

```html
<historical-line
  title="Work Experience"
  start-year="2015"
  end-year="2024">
</historical-line>

<script>
  document.querySelector('historical-line').data = [
    { start: '3/1/2015', main: 'Company A', desc: 'Developer', bg: '#3b82f6' },
    { start: '6/1/2018', main: 'Company B', desc: 'Senior Dev', bg: '#8b5cf6' },
    { start: '1/1/2022', main: 'Company C', desc: 'Lead', bg: '#22c55e' }
  ];
</script>
```

### Declarative Usage

```html
<historical-line title="Timeline" start-year="2020" end-year="2024">
  <timeline-item
    start="1/1/2020"
    label="Event 1"
    description="Description"
    background="#ef4444">
  </timeline-item>
  <timeline-item
    start="6/1/2022"
    label="Event 2"
    description="Another event"
    background="#22c55e">
  </timeline-item>
</historical-line>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | `''` | Timeline title |
| `start-year` | Number | Current year | Start year of timeline |
| `end-year` | Number | Current year | End year of timeline |

## Data Format

Each data item should have:

| Property | Type | Description |
|----------|------|-------------|
| `start` | String | Date in M/D/YYYY format |
| `main` | String | Main label text |
| `desc` | String | Description text |
| `bg` | String | Background color (CSS) |
| `color` | String | Text color (CSS) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--font-size` | `16px` | Base font size |
| `--title-color` | `#1d1d1f` | Title color |
| `--border-color` | `#d2d2d7` | Border color |
| `--desc-font-size` | `0.8rem` | Description font size |

## Accessibility

- Uses semantic HTML table structure for data representation
- Supports dark mode via `.dark` class on parent
- CSS parts available for custom styling: `title`, `container`

## License

MIT
