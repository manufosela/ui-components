# @manufosela/behaviour-accordion

Accessible accordion web component built with Lit 3. Features smooth animations, keyboard navigation, and flexible configuration.

## Installation

```bash
npm install @manufosela/behaviour-accordion
```

## Usage

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
</behaviour-accordion>
```

## Examples

### Basic Usage

```html
<behaviour-accordion>
  <accordion-item header="FAQ Question 1">
    Answer to question 1...
  </accordion-item>
  <accordion-item header="FAQ Question 2">
    Answer to question 2...
  </accordion-item>
</behaviour-accordion>
```

### Multiple Open

```html
<behaviour-accordion multiple>
  <accordion-item header="Section A">Content A</accordion-item>
  <accordion-item header="Section B">Content B</accordion-item>
</behaviour-accordion>
```

### Initially Expanded

```html
<behaviour-accordion expanded="0,2">
  <accordion-item header="Open">First and third open</accordion-item>
  <accordion-item header="Closed">This is closed</accordion-item>
  <accordion-item header="Open">Also open</accordion-item>
</behaviour-accordion>
```

### Custom Header Slot

```html
<accordion-item>
  <span slot="header">
    <strong>Custom Header</strong> with rich content
  </span>
  Panel content...
</accordion-item>
```

### Disabled Item

```html
<accordion-item header="Disabled Section" disabled>
  This content is not accessible.
</accordion-item>
```

## Properties

### behaviour-accordion

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `multiple` | `Boolean` | `false` | Allow multiple items open |
| `expanded` | `Array` | `[]` | Indices of expanded items |

### accordion-item

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `header` | `String` | `''` | Header text |
| `expanded` | `Boolean` | `false` | Whether item is expanded |
| `disabled` | `Boolean` | `false` | Whether item is disabled |

## Methods

| Method | Description |
|--------|-------------|
| `expand(index)` | Expand item at index |
| `collapse(index)` | Collapse item at index |
| `toggle(index)` | Toggle item at index |
| `expandAll()` | Expand all (multiple mode only) |
| `collapseAll()` | Collapse all items |

## Events

### behaviour-accordion

| Event | Detail | Description |
|-------|--------|-------------|
| `item-toggle` | `{index, expanded, expandedItems}` | Item was toggled |

### accordion-item

| Event | Detail | Description |
|-------|--------|-------------|
| `toggle` | `{expanded}` | Item toggle requested |

## Slots

### accordion-item

| Slot | Description |
|------|-------------|
| `header` | Custom header content |
| (default) | Panel content |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--accordion-border` | `#e5e7eb` | Border color |
| `--accordion-radius` | `8px` | Border radius |
| `--accordion-header-bg` | `#f9fafb` | Header background |
| `--accordion-header-hover` | `#f3f4f6` | Header hover background |
| `--accordion-header-text` | `#1f2937` | Header text color |
| `--accordion-header-padding` | `1rem` | Header padding |
| `--accordion-content-bg` | `#fff` | Content background |
| `--accordion-content-text` | `#4b5563` | Content text color |
| `--accordion-content-padding` | `1rem` | Content padding |
| `--accordion-icon` | `#6b7280` | Icon color |
| `--accordion-focus` | `#3b82f6` | Focus outline color |
| `--accordion-max-height` | `1000px` | Max height for animation |

## Accessibility

- Full keyboard navigation (Enter/Space to toggle)
- ARIA attributes (role, aria-expanded, aria-disabled)
- Focus management and visible focus indicators
- Screen reader compatible

## License

Apache-2.0
