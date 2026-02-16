# @manufosela/tab-nav

[![npm version](https://img.shields.io/npm/v/@manufosela/tab-nav)](https://www.npmjs.com/package/@manufosela/tab-nav)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Accessible tab navigation web component built with Lit 3. Features keyboard navigation, multiple positions, and smooth transitions.

## Installation

```bash
npm install @manufosela/tab-nav
```

## Usage

```html
<script type="module">
  import '@manufosela/tab-nav';
</script>

<tab-nav>
  <tab-panel label="Overview">Overview content...</tab-panel>
  <tab-panel label="Features">Features content...</tab-panel>
  <tab-panel label="Docs">Documentation...</tab-panel>
</tab-nav>
```

## Examples

### Basic Usage

```html
<tab-nav>
  <tab-panel label="Tab 1">Content for tab 1</tab-panel>
  <tab-panel label="Tab 2">Content for tab 2</tab-panel>
</tab-nav>
```

### Pre-selected Tab

```html
<tab-nav selected="1">
  <tab-panel label="First">First tab</tab-panel>
  <tab-panel label="Second">Second tab (selected)</tab-panel>
</tab-nav>
```

### With Icons

```html
<tab-nav>
  <tab-panel label="Home" icon="🏠">Home content</tab-panel>
  <tab-panel label="Settings" icon="⚙️">Settings content</tab-panel>
</tab-nav>
```

### Disabled Tab

```html
<tab-panel label="Disabled" disabled>Cannot access</tab-panel>
```

### Fill Width

```html
<tab-nav fill>
  <tab-panel label="Tab 1">...</tab-panel>
  <tab-panel label="Tab 2">...</tab-panel>
</tab-nav>
```

### Position Variants

```html
<!-- Tabs at bottom -->
<tab-nav position="bottom">...</tab-nav>

<!-- Vertical tabs on left -->
<tab-nav position="left">...</tab-nav>

<!-- Vertical tabs on right -->
<tab-nav position="right">...</tab-nav>
```

## Properties

### tab-nav

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `selected` | `Number` | `0` | Index of active tab |
| `position` | `String` | `'top'` | Tab position: top, bottom, left, right |
| `fill` | `Boolean` | `false` | Fill available width equally |

### tab-panel

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `String` | `''` | Tab label text |
| `icon` | `String` | `''` | Icon displayed before label |
| `disabled` | `Boolean` | `false` | Whether tab is disabled |

## Methods

| Method | Description |
|--------|-------------|
| `select(index)` | Select tab by index |
| `getSelectedPanel()` | Get current panel element |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `tab-change` | `{index, label}` | Fired when tab changes |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight/ArrowDown` | Next tab |
| `ArrowLeft/ArrowUp` | Previous tab |
| `Home` | First tab |
| `End` | Last tab |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--tab-bg` | `#f9fafb` | Tab bar background |
| `--tab-border` | `#e5e7eb` | Border color |
| `--tab-text` | `#6b7280` | Tab text color |
| `--tab-active-text` | `#1f2937` | Active tab text |
| `--tab-active-border` | `#3b82f6` | Active indicator |
| `--tab-hover-bg` | `#f3f4f6` | Tab hover background |
| `--tab-focus` | `#3b82f6` | Focus outline color |
| `--tab-disabled` | `#d1d5db` | Disabled tab color |
| `--tab-panel-padding` | `1rem` | Panel content padding |

## Accessibility

- Full keyboard navigation (Arrow keys, Home, End)
- ARIA roles: `tablist`, `tab`, `tabpanel`
- `aria-selected` and `aria-disabled` attributes
- Proper focus management with visible focus indicators
- Screen reader compatible
- Respects `prefers-reduced-motion` by disabling animations

## License

Apache-2.0
