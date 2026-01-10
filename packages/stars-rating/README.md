# @manufosela/stars-rating

An interactive star rating web component with half-star support. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/stars-rating
```

## Usage

```javascript
import '@manufosela/stars-rating';
```

```html
<!-- Display only -->
<stars-rating rating="3.5" half></stars-rating>

<!-- Interactive -->
<stars-rating manual></stars-rating>
```

## Features

- Display and interactive modes
- Half-star rating support
- Keyboard navigation
- Custom star characters
- Reset button option
- Fully accessible (ARIA support)
- CSS customizable

## Attributes

| Attribute  | Type    | Default | Description                      |
| ---------- | ------- | ------- | -------------------------------- |
| `rating`   | Number  | `0`     | Current rating value             |
| `numstars` | Number  | `5`     | Number of stars to display       |
| `manual`   | Boolean | `false` | Enable interactive mode          |
| `half`     | Boolean | `false` | Allow half-star ratings          |
| `reset`    | Boolean | `false` | Show reset button (manual mode)  |
| `disabled` | Boolean | `false` | Disable interaction              |
| `star`     | String  | `★`     | Star character to use            |

## Methods

| Method           | Description                      |
| ---------------- | -------------------------------- |
| `setRating(n)`   | Set rating (clamped to 0-numstars) |
| `resetRating()`  | Reset rating to 0                |

## Events

| Event           | Detail              | Description              |
| --------------- | ------------------- | ------------------------ |
| `rating-changed`| `{ rating: number }`| Fired when rating changes |

```javascript
starsRating.addEventListener('rating-changed', (e) => {
  console.log('New rating:', e.detail.rating);
});
```

## Accessibility

- Uses `role="radiogroup"` with `role="radio"` for each star
- Dynamic `aria-checked` and `aria-label` for each star
- Full keyboard navigation (see below)
- Reset button has descriptive `aria-label`
- Disabled state properly communicated
- Respects `prefers-reduced-motion` by disabling hover animations

## Keyboard Navigation

When `manual` is enabled:
- **Enter/Space**: Set rating on focused star
- **Arrow Right/Up**: Increase rating
- **Arrow Left/Down**: Decrease rating

## CSS Custom Properties

| Property                      | Default   | Description         |
| ----------------------------- | --------- | ------------------- |
| `--stars-rating-size`         | `24px`    | Star size           |
| `--stars-rating-gap`          | `4px`     | Gap between stars   |
| `--stars-rating-color`        | `#fbbf24` | Filled star color   |
| `--stars-rating-empty-color`  | `#e5e7eb` | Empty star color    |
| `--stars-rating-reset-color`  | `#6b7280` | Reset button color  |

## Examples

### Product Rating Display
```html
<stars-rating rating="4.5" half></stars-rating>
```

### User Input with Reset
```html
<stars-rating manual reset></stars-rating>
```

### Custom Hearts Scale
```html
<stars-rating
  numstars="10"
  star="♥"
  style="--stars-rating-color: #ef4444;">
</stars-rating>
```

## License

MIT
