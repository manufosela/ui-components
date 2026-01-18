# @manufosela/app-modal

## 2.2.0

### Minor Changes

- c3dc852: Add design system token support with CSS custom properties and CSS parts for external theming.

  **CSS Custom Properties:**
  - Modal container: `--modal-bg`, `--modal-text-color`, `--modal-border-radius`, `--modal-shadow`
  - Header: `--modal-header-bg`, `--modal-header-text`, `--modal-header-padding`
  - Body: `--modal-body-padding`, `--modal-body-color`
  - Footer: `--modal-footer-bg`, `--modal-footer-padding`, `--modal-border-color`
  - Buttons: `--modal-btn-primary-*`, `--modal-btn-secondary-*`, `--modal-btn-tertiary-*`

  All properties fall back to design system tokens (e.g., `--bg-primary`, `--text-primary`, `--brand-primary`) or sensible defaults.

  **CSS Parts for external styling:**
  - `container`, `header`, `body`, `footer`
  - `close-btn`, `btn-primary`, `btn-secondary`, `btn-tertiary`

## 2.1.0

### Minor Changes

- bb7f5f0: Add `intercept-close` attribute to prevent automatic modal closing. When enabled, the modal dispatches `modal-closed-requested` event but doesn't auto-close, allowing external code to decide whether to close by dispatching `close-modal` event.
