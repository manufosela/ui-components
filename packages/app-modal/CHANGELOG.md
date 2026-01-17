# @manufosela/app-modal

## 2.1.0

### Minor Changes

- bb7f5f0: Add `intercept-close` attribute to prevent automatic modal closing. When enabled, the modal dispatches `modal-closed-requested` event but doesn't auto-close, allowing external code to decide whether to close by dispatching `close-modal` event.
