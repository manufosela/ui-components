# @manufosela/click-clock

Countdown timer, stopwatch, and clock web component. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/click-clock
```

## Usage

```javascript
import '@manufosela/click-clock';
```

```html
<click-clock time="60" autostart></click-clock>
```

## Features

- Countdown timer
- Stopwatch (count up)
- Real-time clock
- Target date countdown
- Multiple display formats
- Millisecond precision option
- CSS custom properties for theming
- Event-driven API

## Attributes

| Attribute           | Type    | Default      | Description                     |
| ------------------- | ------- | ------------ | ------------------------------- |
| `mode`              | String  | `'countdown'`| Mode: countdown, stopwatch, clock |
| `time`              | Number  | `60`         | Initial time in seconds         |
| `target`            | String  | `''`         | Target date (ISO string)        |
| `autostart`         | Boolean | `false`      | Start automatically             |
| `show-days`         | Boolean | `true`       | Show days unit                  |
| `show-hours`        | Boolean | `true`       | Show hours unit                 |
| `show-minutes`      | Boolean | `true`       | Show minutes unit               |
| `show-seconds`      | Boolean | `true`       | Show seconds unit               |
| `show-milliseconds` | Boolean | `false`      | Show milliseconds               |
| `separator`         | String  | `':'`        | Separator between units         |
| `format`            | String  | `'digital'`  | Format: digital, full, compact  |

## Methods

| Method           | Description               |
| ---------------- | ------------------------- |
| `start()`        | Start the timer           |
| `pause()`        | Pause the timer           |
| `reset()`        | Reset to initial time     |
| `toggle()`       | Toggle start/pause        |
| `getCurrentTime()` | Get current time in seconds |

## Events

| Event      | Detail                                    | Description           |
| ---------- | ----------------------------------------- | --------------------- |
| `start`    | -                                         | Timer started         |
| `pause`    | -                                         | Timer paused          |
| `reset`    | -                                         | Timer reset           |
| `tick`     | `{days, hours, minutes, seconds, ms}`     | Every tick            |
| `complete` | -                                         | Countdown finished    |

## Examples

### Countdown Timer

```html
<click-clock time="300" autostart></click-clock>
```

### Stopwatch

```html
<click-clock mode="stopwatch" show-milliseconds></click-clock>
```

```javascript
const clock = document.querySelector('click-clock');
clock.start(); // Start
clock.pause(); // Pause
clock.reset(); // Reset
```

### Real-Time Clock

```html
<click-clock mode="clock" autostart></click-clock>
```

### Target Date Countdown

```html
<click-clock target="2025-12-31T00:00:00" autostart></click-clock>
```

### Different Formats

```html
<!-- Digital: 00:05:30 -->
<click-clock time="330" format="digital"></click-clock>

<!-- Full: with labels -->
<click-clock time="330" format="full"></click-clock>

<!-- Compact: no labels -->
<click-clock time="330" format="compact"></click-clock>
```

### Minutes Only

```html
<click-clock
  time="180"
  .showDays="${false}"
  .showHours="${false}"
></click-clock>
```

### Event Handling

```javascript
const clock = document.querySelector('click-clock');

clock.addEventListener('tick', (e) => {
  console.log(`${e.detail.minutes}:${e.detail.seconds}`);
});

clock.addEventListener('complete', () => {
  alert('Timer finished!');
});
```

## CSS Custom Properties

| Property              | Default      | Description        |
| --------------------- | ------------ | ------------------ |
| `--clock-font-size`   | `2rem`       | Font size          |
| `--clock-font-family` | `monospace`  | Font family        |
| `--clock-color`       | `#1f2937`    | Text color         |
| `--clock-bg`          | `transparent`| Background color   |

## Styling Example

```css
click-clock {
  --clock-font-size: 3rem;
  --clock-color: #8b5cf6;
  --clock-bg: #faf5ff;
  border-radius: 12px;
}
```

## License

Apache-2.0
