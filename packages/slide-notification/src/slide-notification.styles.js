import { css } from 'lit';

export const slideNotificationStyles = css`
  :host {
    --_width: var(--slide-notification-width, 300px);
    --_bg: var(--slide-notification-bg, #17a2b8);
    --_color: var(--slide-notification-color, white);
    --_text-shadow: var(--slide-notification-text-shadow, 1px 1px 2px rgba(0, 0, 0, 0.5));

    position: fixed;
    bottom: var(--slide-notification-bottom, 20px);
    right: calc(-20px - var(--_width));
    width: var(--_width);
    min-height: var(--slide-notification-min-height, 80px);
    background: var(--_bg);
    color: var(--_color);
    border-radius: var(--slide-notification-radius, 8px);
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    padding: var(--slide-notification-padding, 1.5rem);
    box-shadow: var(--slide-notification-shadow, 0 2px 8px rgba(0, 0, 0, 0.2));
    font-size: 1rem;
    font-weight: 500;
    opacity: 0;
    transition:
      transform 0.5s ease-in-out,
      opacity 0.5s ease-in-out;
    transform: translateX(0);
    z-index: var(--slide-notification-z-index, 10000);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :host(.visible) {
    opacity: 1;
    transform: translateX(calc(-1 * var(--_width) - 40px));
  }

  :host(.hiding) {
    transform: translateX(calc(var(--_width) + 40px));
  }

  :host([persistent]) {
    cursor: pointer;
  }

  .title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    text-shadow: var(--_text-shadow);
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .message {
    font-weight: 500;
    text-shadow: var(--_text-shadow);
  }

  .icon {
    font-size: 1.2em;
    flex-shrink: 0;
  }
`;
