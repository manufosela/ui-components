---
"@manufosela/slide-notification": minor
---

Add design system token support with CSS custom properties and CSS parts for external theming.

**CSS Custom Properties:**
- Base: `--notification-bg`, `--notification-text`, `--notification-border-radius`, `--notification-shadow`, `--notification-padding`
- Sizing: `--notification-min-width`, `--notification-max-width`, `--notification-min-height`
- Typography: `--notification-title-size`, `--notification-title-weight`, `--notification-message-size`, `--notification-icon-size`
- Animation: `--notification-animation-duration`, `--notification-slide-distance`
- Type colors: `--notification-success-bg`, `--notification-error-bg`, `--notification-warning-bg`, `--notification-info-bg`

Colors now handled via CSS attribute selectors `:host([type="success"])` instead of JavaScript.

**CSS Parts for external styling:**
- `container`, `title`, `content`, `icon`, `message`
