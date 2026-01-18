---
"@manufosela/app-modal": minor
---

Add design system token support with CSS custom properties and CSS parts for external theming.

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
