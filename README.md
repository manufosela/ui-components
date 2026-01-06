# @manufosela/ui-components

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A collection of modern, accessible, and customizable web components built with [Lit](https://lit.dev/).

## Demo

Visit the [live demo](https://manufosela.github.io/ui-components/) to see all components in action.

## Packages

| Package | Version | Description |
| ------- | ------- | ----------- |
| [@manufosela/app-modal](./packages/app-modal) | ![npm](https://img.shields.io/npm/v/@manufosela/app-modal) | Feature-rich modal with buttons |
| [@manufosela/arc-slider](./packages/arc-slider) | ![npm](https://img.shields.io/npm/v/@manufosela/arc-slider) | Circular arc slider control |
| [@manufosela/behaviour-accordion](./packages/behaviour-accordion) | ![npm](https://img.shields.io/npm/v/@manufosela/behaviour-accordion) | Accessible accordion with animations |
| [@manufosela/calendar-inline](./packages/calendar-inline) | ![npm](https://img.shields.io/npm/v/@manufosela/calendar-inline) | Inline calendar with date selection |
| [@manufosela/circle-percent](./packages/circle-percent) | ![npm](https://img.shields.io/npm/v/@manufosela/circle-percent) | Circular progress indicator |
| [@manufosela/circle-steps](./packages/circle-steps) | ![npm](https://img.shields.io/npm/v/@manufosela/circle-steps) | Step indicator with circular progress |
| [@manufosela/click-clock](./packages/click-clock) | ![npm](https://img.shields.io/npm/v/@manufosela/click-clock) | Countdown, stopwatch, and clock |
| [@manufosela/header-nav](./packages/header-nav) | ![npm](https://img.shields.io/npm/v/@manufosela/header-nav) | Responsive header with hamburger menu |
| [@manufosela/historical-line](./packages/historical-line) | ![npm](https://img.shields.io/npm/v/@manufosela/historical-line) | Horizontal timeline visualization |
| [@manufosela/lcd-digit](./packages/lcd-digit) | ![npm](https://img.shields.io/npm/v/@manufosela/lcd-digit) | 7-segment LCD digit display |
| [@manufosela/loading-layer](./packages/loading-layer) | ![npm](https://img.shields.io/npm/v/@manufosela/loading-layer) | Full-screen loading overlay |
| [@manufosela/marked-calendar](./packages/marked-calendar) | ![npm](https://img.shields.io/npm/v/@manufosela/marked-calendar) | Calendar for tracking habits/events |
| [@manufosela/modal-dialog](./packages/modal-dialog) | ![npm](https://img.shields.io/npm/v/@manufosela/modal-dialog) | Modal dialog with slots |
| [@manufosela/multi-carousel](./packages/multi-carousel) | ![npm](https://img.shields.io/npm/v/@manufosela/multi-carousel) | Responsive carousel with navigation |
| [@manufosela/multi-select](./packages/multi-select) | ![npm](https://img.shields.io/npm/v/@manufosela/multi-select) | Multi-select dropdown |
| [@manufosela/nav-list](./packages/nav-list) | ![npm](https://img.shields.io/npm/v/@manufosela/nav-list) | Horizontal navigation list |
| [@manufosela/qr-code](./packages/qr-code) | ![npm](https://img.shields.io/npm/v/@manufosela/qr-code) | QR code generator |
| [@manufosela/radar-chart](./packages/radar-chart) | ![npm](https://img.shields.io/npm/v/@manufosela/radar-chart) | SVG radar/spider chart |
| [@manufosela/rich-inputfile](./packages/rich-inputfile) | ![npm](https://img.shields.io/npm/v/@manufosela/rich-inputfile) | File input with drag & drop |
| [@manufosela/rich-select](./packages/rich-select) | ![npm](https://img.shields.io/npm/v/@manufosela/rich-select) | Customizable dropdown with rich options |
| [@manufosela/slide-notification](./packages/slide-notification) | ![npm](https://img.shields.io/npm/v/@manufosela/slide-notification) | Slide-in notifications |
| [@manufosela/slider-underline](./packages/slider-underline) | ![npm](https://img.shields.io/npm/v/@manufosela/slider-underline) | Range slider with underline style |
| [@manufosela/stars-rating](./packages/stars-rating) | ![npm](https://img.shields.io/npm/v/@manufosela/stars-rating) | Interactive star rating |
| [@manufosela/tab-nav](./packages/tab-nav) | ![npm](https://img.shields.io/npm/v/@manufosela/tab-nav) | Accessible tab navigation |
| [@manufosela/theme-toggle](./packages/theme-toggle) | ![npm](https://img.shields.io/npm/v/@manufosela/theme-toggle) | Light/dark theme switcher |
| [@manufosela/toast-notification](./packages/toast-notification) | ![npm](https://img.shields.io/npm/v/@manufosela/toast-notification) | Toast notification messages |

## Installation

Install individual packages as needed:

```bash
pnpm add @manufosela/arc-slider
pnpm add @manufosela/modal-dialog
pnpm add @manufosela/toast-notification
# etc.
```

## Usage

```javascript
import '@manufosela/arc-slider';
import '@manufosela/modal-dialog';
```

```html
<arc-slider min-range="0" max-range="100" color1="#FF5500" color2="#0055FF"></arc-slider>

<modal-dialog size="medium">
  <span slot="header">My Modal</span>
  <p>Modal content here</p>
  <button slot="footer">Close</button>
</modal-dialog>
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/manufosela/ui-components.git
cd ui-components

# Install dependencies
pnpm install

# Start development server
pnpm start
```

### Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint all packages
pnpm lint

# Format code
pnpm format
```

### Project Structure

```
ui-components/
├── packages/                  # Individual component packages
│   ├── app-modal/
│   ├── arc-slider/
│   ├── behaviour-accordion/
│   ├── calendar-inline/
│   ├── circle-percent/
│   ├── circle-steps/
│   ├── click-clock/
│   ├── header-nav/
│   ├── historical-line/
│   ├── lcd-digit/
│   ├── loading-layer/
│   ├── marked-calendar/
│   ├── modal-dialog/
│   ├── multi-carousel/
│   ├── multi-select/
│   ├── nav-list/
│   ├── qr-code/
│   ├── radar-chart/
│   ├── rich-inputfile/
│   ├── rich-select/
│   ├── slide-notification/
│   ├── slider-underline/
│   ├── stars-rating/
│   ├── tab-nav/
│   ├── theme-toggle/
│   └── toast-notification/
├── index.html                 # Component catalog
└── pnpm-workspace.yaml
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting a PR.

## License

MIT - see [LICENSE](./LICENSE) for details.
