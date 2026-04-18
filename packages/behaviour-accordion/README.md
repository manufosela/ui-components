# @manufosela/behaviour-accordion

[![npm version](https://img.shields.io/npm/v/@manufosela/behaviour-accordion)](https://www.npmjs.com/package/@manufosela/behaviour-accordion)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**`<details>`/`<summary>` on steroids.** A feature-rich accordion web component built on the native `<details>` element. You get semantic HTML, open/close behaviour, `toggle` event, Enter/Space keyboard support, and implicit ARIA roles for free from the browser — plus exclusive accordion mode, Arrow key navigation, expand/collapse-all API, disabled items, and ~12 CSS custom properties on top.

Built with [Lit](https://lit.dev/).

## Why not just `<details>`?

Native `<details>` is great for single disclosure widgets but bare-bones for accordion UIs. `behaviour-accordion` wraps it and adds:

| Native `<details>` (free) | `behaviour-accordion` adds |
| --- | --- |
| Semantic HTML disclosure widget | Exclusive accordion (single expand mode) |
| Open/close on click | Arrow Up/Down keyboard navigation between items |
| `toggle` event | `expandAll()` / `collapseAll()` API |
| Enter/Space keyboard toggle | `disabled` items |
| Implicit `role="group"` + `role="button"` | ~12 CSS custom properties for full theming |
| No JavaScript needed for basic use | `prefers-reduced-motion` support |

> **Note on `<details name="...">`:** The HTML spec's native exclusive-accordion attribute (`name`) relies on same-document grouping that does not work across Shadow DOM boundaries. For this reason, exclusive mode is managed by the parent `<behaviour-accordion>` via JavaScript instead.

## Install

```bash
npm install @manufosela/behaviour-accordion
```

## Quick Start

### Basic accordion

```html
<script type="module">
  import '@manufosela/behaviour-accordion';
</script>

<behaviour-accordion>
  <accordion-item header="Section 1">
    Content for section 1...
  </accordion-item>
  <accordion-item header="Section 2">
    Content for section 2...
  </accordion-item>
  <accordion-item header="Section 3">
    Content for section 3...
  </accordion-item>
</behaviour-accordion>
```

By default only one item can be open at a time (exclusive mode).

### Multiple open

```html
<behaviour-accordion multiple>
  <accordion-item header="Section A">Content A</accordion-item>
  <accordion-item header="Section B">Content B</accordion-item>
  <accordion-item header="Section C">Content C</accordion-item>
</behaviour-accordion>
```

### Initially expanded

Provide a comma-separated list of zero-based indices.

```html
<behaviour-accordion expanded="0,2">
  <accordion-item header="Open by default">First item starts expanded.</accordion-item>
  <accordion-item header="Starts closed">This one is collapsed.</accordion-item>
  <accordion-item header="Also open">Third item also starts expanded.</accordion-item>
</behaviour-accordion>
```

> When `multiple` is not set and `expanded` contains more than one index, only the last one is honoured.

### Slotted header

Use the named `header` slot for rich, interactive header content.

```html
<accordion-item>
  <span slot="header">
    <strong>Custom Header</strong> with <em>rich content</em>
  </span>
  Panel body goes in the default slot.
</accordion-item>
```

### Disabled item

```html
<behaviour-accordion>
  <accordion-item header="Active Section">You can open this.</accordion-item>
  <accordion-item header="Locked Section" disabled>
    This section cannot be opened by the user.
  </accordion-item>
</behaviour-accordion>
```

### Programmatic control

```javascript
const accordion = document.querySelector('behaviour-accordion');

accordion.expand(1);       // Open item at index 1
accordion.collapse(0);     // Close item at index 0
accordion.toggle(2);       // Toggle item at index 2
accordion.expandAll();     // Open all items (requires multiple mode)
accordion.collapseAll();   // Close all items

// Listen for state changes
accordion.addEventListener('item-toggle', (e) => {
  const { index, expanded, expandedItems } = e.detail;
  console.log(`Item ${index} is now ${expanded ? 'open' : 'closed'}`);
  console.log('Currently open:', expandedItems);
});
```

## Attributes

### `<behaviour-accordion>`

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | Boolean | `false` | Allow multiple items to be open simultaneously |
| `expanded` | String | `""` | Comma-separated indices of initially expanded items (e.g. `"0,2"`) |

### `<accordion-item>`

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | String | `""` | Header text (alternative to the `header` slot) |
| `expanded` | Boolean | `false` | Whether the item is expanded |
| `disabled` | Boolean | `false` | Prevent the item from being toggled |

## Methods

Methods are available on the `<behaviour-accordion>` element.

| Method | Description |
| --- | --- |
| `expand(index)` | Expand the item at the given zero-based index |
| `collapse(index)` | Collapse the item at the given zero-based index |
| `toggle(index)` | Toggle the item at the given zero-based index |
| `expandAll()` | Expand all items (effective in `multiple` mode) |
| `collapseAll()` | Collapse all items |

## Events

### `<behaviour-accordion>` emits

| Event | Detail | When |
| --- | --- | --- |
| `item-toggle` | `{ index, expanded, expandedItems }` | An item's open/closed state changed |

`expandedItems` is an array of the indices that are currently expanded.

### `<accordion-item>` emits

| Event | Detail | When |
| --- | --- | --- |
| `toggle` | `{ expanded }` | The item's open/closed state changed |

## Slots

### `<accordion-item>`

| Slot | Description |
| --- | --- |
| `header` | Rich/custom header content (replaces the `header` attribute) |
| *(default)* | Panel body content |

## CSS Custom Properties

All custom properties are set on the `<behaviour-accordion>` host element and cascade into every `<accordion-item>`.

| Property | Default | Description |
| --- | --- | --- |
| `--accordion-border` | `#e5e7eb` | Border colour between and around items |
| `--accordion-radius` | `8px` | Border radius of the accordion container |
| `--accordion-header-bg` | `#f9fafb` | Header background colour |
| `--accordion-header-hover` | `#f3f4f6` | Header background on hover |
| `--accordion-header-text` | `#1f2937` | Header text colour |
| `--accordion-header-padding` | `1rem` | Header padding |
| `--accordion-content-bg` | `#fff` | Panel body background colour |
| `--accordion-content-text` | `#4b5563` | Panel body text colour |
| `--accordion-content-padding` | `1rem` | Panel body padding |
| `--accordion-icon` | `#6b7280` | Chevron icon colour |
| `--accordion-focus` | `#3b82f6` | Focus outline colour |

Example:

```css
behaviour-accordion {
  --accordion-border: #d1d5db;
  --accordion-radius: 4px;
  --accordion-header-bg: #1e293b;
  --accordion-header-text: #f8fafc;
  --accordion-focus: #818cf8;
}
```

## Accessibility

`behaviour-accordion` is **exactly as accessible as a native `<details>`/`<summary>` pair** — because each item *is* a native `<details>`/`<summary>` under the hood.

Each `<accordion-item>` renders a `<details>` element with a `<summary>` child inside its Shadow DOM. This gives you every browser-native accessibility feature for free:

- **Implicit ARIA roles** — `<details>` maps to `role="group"` and `<summary>` maps to `role="button"` in the accessibility tree. The browser exposes these to assistive technology without any ARIA attributes in the HTML.
- **`aria-expanded`** — the browser communicates the open/closed state of each `<summary>` to screen readers automatically via the `open` attribute on `<details>`. No manual `aria-expanded` management needed.
- **Enter and Space** — toggling a `<summary>` with the keyboard is handled natively by the browser, not by a JavaScript `keydown` listener.
- **`toggle` event** — state changes fire the standard DOM `toggle` event on `<details>`, which the wrapper listens to and re-dispatches as `item-toggle`.
- **`prefers-reduced-motion`** — all CSS transitions are disabled when the user requests reduced motion.

### What `behaviour-accordion` adds (without compromising accessibility)

The wrapper adds application-level features that bare `<details>` groups don't provide — exclusive mode, Arrow key navigation, expand/collapse-all — while delegating 100% of the per-item disclosure behaviour to the browser's native implementation. Nothing is reimplemented in JavaScript.

Arrow Up/Down navigation between accordion headers is layered on top using a `keydown` listener on the container. Disabled items are skipped during keyboard traversal. This follows the [ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) recommendation for enhanced keyboard UX while keeping the semantic foundation intact.

### A note on Shadow DOM and `<details name="">`

The HTML spec defines a native exclusive-accordion mechanism: setting the same `name` attribute on multiple `<details>` elements in the same document ensures only one is open at a time. However, this grouping relies on same-document scoping and does not cross Shadow DOM boundaries — each `<accordion-item>` lives in its own Shadow Root, so `name`-based coordination between items would not work.

For this reason, `<behaviour-accordion>` manages exclusive mode itself: when an item opens, the component's `item-toggle` listener closes all siblings in JavaScript. The result is identical behaviour without relying on the cross-document `name` mechanism.

## License

Apache-2.0
