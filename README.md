# @manufosela/ui-components

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A collection of modern, accessible, and customizable web components built with [Lit](https://lit.dev/).

## Demo

Visit the [live demo](https://manufosela.github.io/ui-components/) to see all components in action.

## Packages

| Package | Version | Description |
| ------- | ------- | ----------- |
| [@manufosela/arc-slider](./packages/arc-slider) | ![npm](https://img.shields.io/npm/v/@manufosela/arc-slider) | Circular arc slider control |
| [@manufosela/rich-select](./packages/rich-select) | ![npm](https://img.shields.io/npm/v/@manufosela/rich-select) | Customizable dropdown with rich options |
| [@manufosela/circle-percent](./packages/circle-percent) | ![npm](https://img.shields.io/npm/v/@manufosela/circle-percent) | Circular progress indicator |
| [@manufosela/loading-layer](./packages/loading-layer) | ![npm](https://img.shields.io/npm/v/@manufosela/loading-layer) | Full-screen loading overlay |
| [@manufosela/theme-toggle](./packages/theme-toggle) | ![npm](https://img.shields.io/npm/v/@manufosela/theme-toggle) | Light/dark theme switcher |
| [@manufosela/stars-rating](./packages/stars-rating) | ![npm](https://img.shields.io/npm/v/@manufosela/stars-rating) | Interactive star rating |
| [@manufosela/lcd-digit](./packages/lcd-digit) | ![npm](https://img.shields.io/npm/v/@manufosela/lcd-digit) | 7-segment LCD digit display |
| [@manufosela/toast-notification](./packages/toast-notification) | ![npm](https://img.shields.io/npm/v/@manufosela/toast-notification) | Toast notification messages |
| [@manufosela/modal-dialog](./packages/modal-dialog) | ![npm](https://img.shields.io/npm/v/@manufosela/modal-dialog) | Modal dialog with slots |
| [@manufosela/app-modal](./packages/app-modal) | ![npm](https://img.shields.io/npm/v/@manufosela/app-modal) | Feature-rich modal with buttons |
| [@manufosela/multi-select](./packages/multi-select) | ![npm](https://img.shields.io/npm/v/@manufosela/multi-select) | Multi-select dropdown |
| [@manufosela/slide-notification](./packages/slide-notification) | ![npm](https://img.shields.io/npm/v/@manufosela/slide-notification) | Slide-in notifications |

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
├── packages/           # Individual component packages
│   ├── arc-slider/
│   ├── rich-select/
│   ├── circle-percent/
│   ├── loading-layer/
│   ├── theme-toggle/
│   ├── stars-rating/
│   ├── lcd-digit/
│   ├── toast-notification/
│   ├── modal-dialog/
│   ├── app-modal/
│   ├── multi-select/
│   └── slide-notification/
├── index.html         # Component catalog
└── pnpm-workspace.yaml
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting a PR.

## License

MIT - see [LICENSE](./LICENSE) for details.
