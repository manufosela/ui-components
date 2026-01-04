# @manufosela/ui-components

Reusable Lit web components for UI: AppModal, SlideNotification, MultiSelect.

## Installation

```bash
npm install @manufosela/ui-components
```

## Components

### AppModal

A flexible modal dialog component.

```javascript
import { AppModal, showModal } from '@manufosela/ui-components';

// Using helper function
showModal({
  title: 'Confirm Action',
  message: 'Are you sure?',
  button1Text: 'Yes',
  button2Text: 'No',
  button1Action: () => console.log('Confirmed'),
  button2Action: () => console.log('Cancelled'),
  // Optional: inject logger
  logger: console
});

// Or create element directly
const modal = document.createElement('app-modal');
modal.title = 'My Modal';
modal.logger = console; // Optional
document.body.appendChild(modal);
```

### SlideNotification

A slide-in notification component.

```javascript
import { SlideNotification, showSlideNotification } from '@manufosela/ui-components';

// Using helper function
showSlideNotification({
  title: 'Success',
  message: 'Operation completed',
  type: 'success', // 'info' | 'success' | 'warning' | 'error'
  timetohide: 3000,
  // Optional: inject logger
  logger: console
});
```

### MultiSelect

A multi-select dropdown component.

```javascript
import { MultiSelect } from '@manufosela/ui-components';

// In HTML
<multi-select
  .options=${[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]}
  .selectedValues=${['a']}
  placeholder="Select options..."
  @change=${(e) => console.log(e.detail.selectedValues)}
></multi-select>
```

## Dependency Injection

All components support optional dependency injection for logging:

```javascript
// Without logging (default)
showModal({ title: 'Test' });

// With console logging
showModal({ title: 'Test', logger: console });

// With custom logger
showModal({
  title: 'Test',
  logger: {
    log: (...args) => myLogger.debug(...args),
    warn: (...args) => myLogger.warn(...args),
    error: (...args) => myLogger.error(...args)
  }
});
```

### AppModal specific dependencies

```javascript
showModal({
  title: 'Test',
  logger: console,
  // Modal registry for managing multiple modals
  modalRegistry: {
    register: (id, element) => myRegistry.add(id, element),
    unregister: (id) => myRegistry.remove(id)
  },
  // Custom ID generator
  idGenerator: (prefix) => `${prefix}_${crypto.randomUUID()}`
});
```

## Events

### AppModal Events
- `modal-action1` - First button clicked
- `modal-action2` - Second button clicked
- `modal-action3` - Third button clicked
- `modal-closed-requested` - Modal close requested
- `close-modal` - Global event to close modals

### MultiSelect Events
- `change` - Selection changed, `detail: { selectedValues: string[] }`

## Peer Dependencies

- `lit` ^3.0.0

## License

MIT
