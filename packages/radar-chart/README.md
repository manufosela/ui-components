# @manufosela/radar-chart

SVG-based radar/spider chart web component. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/radar-chart
```

## Usage

```javascript
import '@manufosela/radar-chart';
```

```html
<radar-chart
  .labels="${['Speed', 'Power', 'Defense', 'Magic', 'Luck']}"
  .series="${[{ name: 'Player', values: [80, 65, 90, 45, 70], color: '#3b82f6' }]}"
></radar-chart>
```

## Features

- Pure SVG rendering
- Multiple data series support
- Interactive tooltips
- Click events on data points
- Customizable colors and styling
- Configurable grid levels
- Optional legend
- CSS custom properties for theming

## Attributes

| Attribute       | Type    | Default  | Description                       |
| --------------- | ------- | -------- | --------------------------------- |
| `labels`        | Array   | `[]`     | Array of axis labels              |
| `series`        | Array   | `[]`     | Array of data series              |
| `max-value`     | Number  | auto     | Maximum scale value               |
| `levels`        | Number  | `5`      | Number of grid rings              |
| `show-dots`     | Boolean | `true`   | Show data point circles           |
| `show-legend`   | Boolean | `true`   | Show legend below chart           |
| `show-values`   | Boolean | `true`   | Show tooltip on hover             |
| `fill-opacity`  | Number  | `0.25`   | Fill opacity (0-1)                |
| `size`          | Number  | `300`    | Chart size in pixels              |

## Series Format

Each series object can have:

```javascript
{
  name: 'Series Name',    // Optional: displayed in legend
  values: [80, 60, 90],   // Required: data values
  color: '#3b82f6'        // Optional: series color
}
```

## Events

| Event              | Detail                                    | Description               |
| ------------------ | ----------------------------------------- | ------------------------- |
| `data-point-click` | `{series, seriesIndex, label, pointIndex, value}` | Fired on point click |

## Examples

### Single Series

```html
<radar-chart
  .labels="${['HTML', 'CSS', 'JS', 'React', 'Node']}"
  .series="${[{
    name: 'Skills',
    values: [90, 85, 80, 75, 70],
    color: '#3b82f6'
  }]}"
></radar-chart>
```

### Multiple Series Comparison

```html
<radar-chart
  .labels="${['Strategy', 'Teamwork', 'Execution', 'Creativity']}"
  .series="${[
    { name: 'Team A', values: [85, 70, 95, 60], color: '#3b82f6' },
    { name: 'Team B', values: [60, 90, 75, 85], color: '#22c55e' }
  ]}"
></radar-chart>
```

### Custom Styling

```html
<radar-chart
  .labels="${['A', 'B', 'C', 'D', 'E']}"
  .series="${[{ values: [80, 60, 90, 70, 85] }]}"
  fill-opacity="0.4"
  levels="3"
  size="400"
></radar-chart>
```

### Minimal (No Dots/Legend)

```html
<radar-chart
  .labels="${['X', 'Y', 'Z']}"
  .series="${[{ values: [75, 80, 65] }]}"
  .showDots="${false}"
  .showLegend="${false}"
></radar-chart>
```

### Handle Click Events

```javascript
const chart = document.querySelector('radar-chart');
chart.addEventListener('data-point-click', (e) => {
  console.log(`${e.detail.series}: ${e.detail.label} = ${e.detail.value}`);
});
```

## CSS Custom Properties

| Property              | Default    | Description           |
| --------------------- | ---------- | --------------------- |
| `--radar-size`        | `300px`    | Chart container size  |
| `--radar-bg`          | `#fff`     | Background color      |
| `--radar-grid-color`  | `#e2e8f0`  | Grid line color       |
| `--radar-axis-color`  | `#94a3b8`  | Axis line color       |
| `--radar-label-color` | `#475569`  | Label text color      |

## Styling Example

```css
radar-chart {
  --radar-size: 350px;
  --radar-bg: #f8fafc;
  --radar-grid-color: #cbd5e1;
  --radar-axis-color: #64748b;
  --radar-label-color: #334155;
}
```

## Use Cases

- Skill assessment visualization
- Product feature comparison
- Team performance metrics
- Game character stats
- Survey results
- Multi-dimensional analysis

## Accessibility

- Data points are clickable with cursor feedback
- Tooltips show values on hover
- Legend provides color-label association
- Labels use `user-select: none` to prevent accidental selection
- Respects `prefers-reduced-motion` by disabling animations

## License

Apache-2.0
