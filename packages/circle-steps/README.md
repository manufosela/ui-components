# @manufosela/circle-steps

Step indicator web component with circular progress visualization. Built with Lit 3.

## Installation

```bash
npm install @manufosela/circle-steps
```

## Usage

```html
<script type="module">
  import '@manufosela/circle-steps';
</script>

<circle-steps steps="4" current="1"></circle-steps>
```

## Examples

### Basic Usage

```html
<circle-steps steps="4"></circle-steps>
```

### With Labels & Descriptions

```html
<circle-steps id="stepper"></circle-steps>
<script>
  document.getElementById('stepper').steps = [
    { label: 'Account', description: 'Create account' },
    { label: 'Profile', description: 'Setup profile' },
    { label: 'Confirm', description: 'Review & submit' }
  ];
</script>
```

### Vertical Orientation

```html
<circle-steps orientation="vertical" steps="4"></circle-steps>
```

### Clickable Steps

```html
<circle-steps clickable steps="4"></circle-steps>
```

### Size Variants

```html
<circle-steps size="small" steps="4"></circle-steps>
<circle-steps size="large" steps="4"></circle-steps>
```

### Without Numbers/Checkmarks

```html
<circle-steps show-numbers="false" steps="4"></circle-steps>
<circle-steps show-check="false" steps="4"></circle-steps>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `steps` | `Array/Number` | `[]` | Steps array or count |
| `current` | `Number` | `0` | Current step index |
| `orientation` | `String` | `'horizontal'` | horizontal or vertical |
| `clickable` | `Boolean` | `false` | Allow clicking steps |
| `showNumbers` | `Boolean` | `true` | Show step numbers |
| `showCheck` | `Boolean` | `true` | Show checkmarks |
| `size` | `String` | `'medium'` | small, medium, large |

## Step Object

```javascript
{
  label: 'Step Name',
  description: 'Optional description'
}
```

## Methods

| Method | Description |
|--------|-------------|
| `next()` | Go to next step |
| `prev()` | Go to previous step |
| `goToStep(index)` | Navigate to specific step |
| `reset()` | Return to first step |
| `isComplete(index)` | Check if step is complete |
| `isActive(index)` | Check if step is active |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `step-change` | `{oldStep, newStep, step}` | Step changed |
| `step-click` | `{index, step}` | Step clicked (clickable mode) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--steps-size` | `40px` | Circle size |
| `--steps-pending` | `#e5e7eb` | Pending step color |
| `--steps-active` | `#3b82f6` | Active step color |
| `--steps-complete` | `#22c55e` | Completed step color |
| `--steps-text` | `#1f2937` | Text color |
| `--steps-line` | `#e5e7eb` | Connector line color |
| `--steps-line-complete` | `#22c55e` | Completed connector |

## Accessibility

- Proper ARIA roles (button/presentation)
- aria-current for active step
- Keyboard support for clickable mode
- Focus management

## License

Apache-2.0
