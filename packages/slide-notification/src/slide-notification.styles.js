import { css } from 'lit';

export const slideNotificationStyles = css`
  :host {
    /* ========================================
       Design System Tokens
       ======================================== */

    /* Base tokens */
    --notification-bg: var(--notification-info-bg, #17a2b8);
    --notification-text: var(--text-inverse, #ffffff);
    --notification-border-radius: var(--radius-md, 6px);
    --notification-shadow: var(--shadow-lg, 0 4px 8px rgba(0, 0, 0, 0.15));
    --notification-padding: var(--spacing-md, 1rem);
    --notification-min-width: 300px;
    --notification-max-width: 400px;

    /* Title */
    --notification-title-size: var(--font-size-lg, 1.1rem);
    --notification-title-weight: 600;

    /* Message */
    --notification-message-size: var(--font-size-base, 1rem);

    /* Icon */
    --notification-icon-size: 1.2em;

    /* Animation */
    --notification-animation-duration: 0.5s;
    --notification-slide-distance: 100%;

    /* Layout */
    position: fixed;
    bottom: var(--notification-bottom, 20px);
    right: calc(-20px - var(--notification-max-width));
    width: var(--notification-max-width);
    min-width: var(--notification-min-width);
    min-height: var(--notification-min-height, 80px);
    background: var(--notification-bg);
    color: var(--notification-text);
    border-radius: var(--notification-border-radius);
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    padding: var(--notification-padding);
    box-shadow: var(--notification-shadow);
    font-size: var(--notification-message-size);
    font-weight: 500;
    opacity: 0;
    transition:
      transform var(--notification-animation-duration) ease-in-out,
      opacity var(--notification-animation-duration) ease-in-out;
    transform: translateX(0);
    z-index: var(--notification-z-index, 10000);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Type variants using attribute selectors */
  :host([type='success']) {
    --notification-bg: var(--notification-success-bg, #22c55e);
  }

  :host([type='error']) {
    --notification-bg: var(--notification-error-bg, #dc3545);
  }

  :host([type='warning']) {
    --notification-bg: var(--notification-warning-bg, #ffc107);
    --notification-text: var(--text-primary, #333333);
  }

  :host([type='info']) {
    --notification-bg: var(--notification-info-bg, #17a2b8);
  }

  :host(.visible) {
    opacity: 1;
    transform: translateX(calc(-1 * var(--notification-max-width) - 40px));
  }

  :host(.hiding) {
    transform: translateX(calc(var(--notification-max-width) + 40px));
  }

  :host([persistent]) {
    cursor: pointer;
  }

  .title {
    font-size: var(--notification-title-size);
    font-weight: var(--notification-title-weight);
    margin-bottom: 0.25rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .message {
    font-size: var(--notification-message-size);
    font-weight: 500;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: var(--notification-icon-size);
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      transition: none;
    }
  }
`;
