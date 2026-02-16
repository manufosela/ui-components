# @manufosela/qr-code

[![npm version](https://img.shields.io/npm/v/@manufosela/qr-code)](https://www.npmjs.com/package/@manufosela/qr-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

QR code generator web component. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/qr-code
```

## Usage

```javascript
import '@manufosela/qr-code';
```

```html
<qr-code data="https://example.com"></qr-code>
```

## Features

- Pure JavaScript QR generation (no external dependencies)
- Canvas-based rendering
- Customizable colors
- Multiple error correction levels
- Download as PNG
- Responsive sizing
- CSS custom properties for theming

## Attributes

| Attribute          | Type   | Default   | Description                    |
| ------------------ | ------ | --------- | ------------------------------ |
| `data`             | String | `''`      | Text or URL to encode          |
| `size`             | Number | `200`     | QR code size in pixels         |
| `error-correction` | String | `'M'`     | Error correction level (L/M/Q/H) |
| `color`            | String | `#000000` | Foreground (module) color      |
| `background`       | String | `#ffffff` | Background color               |

## Methods

| Method                  | Description                           |
| ----------------------- | ------------------------------------- |
| `toDataURL(type?)`      | Returns QR code as data URL           |
| `download(filename?)`   | Downloads QR code as PNG image        |

## Error Correction Levels

| Level | Recovery Capacity |
| ----- | ----------------- |
| L     | ~7%               |
| M     | ~15%              |
| Q     | ~25%              |
| H     | ~30%              |

Higher levels allow more damage/obstruction tolerance but result in denser QR codes.

## Examples

### Basic

```html
<qr-code data="Hello World"></qr-code>
```

### Custom Size

```html
<qr-code data="Small QR" size="100"></qr-code>
<qr-code data="Large QR" size="400"></qr-code>
```

### Custom Colors

```html
<qr-code
  data="Styled QR"
  color="#3b82f6"
  background="#eff6ff">
</qr-code>
```

### Dark Mode

```html
<qr-code
  data="Dark Mode"
  color="#f8fafc"
  background="#1e293b">
</qr-code>
```

### High Error Correction

```html
<qr-code
  data="Resilient QR"
  error-correction="H">
</qr-code>
```

### URL Encoding

```html
<qr-code data="https://github.com/manufosela"></qr-code>
```

### WiFi QR Code

```html
<qr-code data="WIFI:T:WPA;S:NetworkName;P:password123;;"></qr-code>
```

### Email QR Code

```html
<qr-code data="mailto:hello@example.com"></qr-code>
```

### Phone QR Code

```html
<qr-code data="tel:+1234567890"></qr-code>
```

### Download QR Code

```javascript
const qr = document.querySelector('qr-code');

// Download as PNG
qr.download('my-qrcode.png');

// Get as data URL
const dataUrl = qr.toDataURL();
console.log(dataUrl);

// Get as JPEG
const jpegUrl = qr.toDataURL('image/jpeg');
```

## CSS Custom Properties

| Property    | Default   | Description           |
| ----------- | --------- | --------------------- |
| `--qr-size` | `200px`   | QR code container size|
| `--qr-fg`   | `#000`    | Foreground color      |
| `--qr-bg`   | `#fff`    | Background color      |

## Styling Example

```css
qr-code {
  --qr-size: 250px;
}
```

## vCard Example

```html
<qr-code data="BEGIN:VCARD
VERSION:3.0
N:Doe;John
FN:John Doe
ORG:Company Name
TEL:+1234567890
EMAIL:john@example.com
END:VCARD"></qr-code>
```

## Accessibility

- Container has `role="img"` for screen reader identification
- `aria-label` dynamically describes the QR code content (e.g., "QR code containing: https://example.com")
- Canvas is marked as `aria-hidden="true"` since it's decorative
- Consider providing alternative text or link for users who cannot scan QR codes

## Compared to Original

| Feature | @nickmitchko/qr-code | @manufosela/qr-code |
| ------- | -------------------- | ------------------- |
| Lit version | Lit 2.x | Lit 3.x |
| Dependencies | qrcode-generator | None (built-in) |
| TypeScript | No | No |
| Tests | No | Yes |
| CSS Properties | Limited | Full theming |
| Download | No | Yes |
| Error Correction | Limited | All levels |

## License

Apache-2.0
