import { css } from 'lit';

export const appModalStyles = css`
  :host {
    /* Layout */
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--app-modal-z-index, 1000);
    opacity: 0;
    transition:
      opacity 0.3s ease-out,
      background 0.3s ease-out;
    background: rgba(0, 0, 0, 0);

    /* ========================================
       Design System Tokens
       ======================================== */

    /* Modal container */
    --modal-bg: var(--bg-primary, #ffffff);
    --modal-text-color: var(--text-primary, #333333);
    --modal-border-radius: var(--radius-lg, 8px);
    --modal-shadow: var(--shadow-xl, 0 8px 32px rgba(0, 0, 0, 0.3));
    --modal-overlay-bg: rgba(0, 0, 0, 0.6);
    --modal-max-width: 80vw;
    --modal-max-height: 80vh;

    /* Header */
    --modal-header-bg: var(--bg-secondary, transparent);
    --modal-header-text: var(--text-primary, inherit);
    --modal-header-padding: var(--spacing-md, 1rem);
    --modal-header-font-size: var(--font-size-xl, 1.5rem);

    /* Body */
    --modal-body-padding: var(--spacing-lg, 1.5rem);
    --modal-body-color: var(--text-primary, #333333);

    /* Footer */
    --modal-footer-bg: var(--bg-secondary, transparent);
    --modal-footer-padding: var(--spacing-md, 1rem);
    --modal-border-color: var(--border-default, #e0e0e0);

    /* Close button */
    --modal-close-bg: var(--bg-muted, rgba(0, 0, 0, 0.1));
    --modal-close-color: var(--text-secondary, #666666);
    --modal-close-hover-bg: var(--bg-muted-hover, rgba(0, 0, 0, 0.2));
    --modal-close-hover-color: var(--text-primary, #333333);

    /* Primary button (confirm) */
    --modal-btn-primary-bg: var(--brand-primary, #4caf50);
    --modal-btn-primary-text: var(--text-inverse, #ffffff);
    --modal-btn-primary-hover-bg: var(--brand-primary-hover, #45a047);

    /* Secondary button (cancel) */
    --modal-btn-secondary-bg: var(--brand-danger, #f44336);
    --modal-btn-secondary-text: var(--text-inverse, #ffffff);
    --modal-btn-secondary-hover-bg: var(--brand-danger-hover, #e53935);

    /* Tertiary button */
    --modal-btn-tertiary-bg: var(--bg-muted, #e9ecef);
    --modal-btn-tertiary-text: var(--text-primary, #333333);
    --modal-btn-tertiary-hover-bg: var(--bg-muted-hover, #dee2e6);
  }

  .modal {
    background: var(--modal-bg);
    color: var(--modal-text-color);
    border-radius: var(--modal-border-radius);
    box-shadow: var(--modal-shadow);
    width: 90%;
    max-width: var(--max-width, var(--modal-max-width));
    max-height: var(--max-height, var(--modal-max-height));
    text-align: center;
    position: relative;
    overflow: auto;
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  .modal-header {
    font-size: var(--modal-header-font-size);
    font-weight: bold;
    padding: var(--modal-header-padding);
    margin-bottom: 0;
    position: relative;
    min-height: 1.5rem;
    color: var(--modal-header-text);
    background: var(--modal-header-bg);
    border-bottom: 1px solid var(--modal-border-color);
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
    background: var(--modal-close-bg);
    border: none;
    color: var(--modal-close-color);
    z-index: 1;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    color: var(--modal-close-hover-color);
    background: var(--modal-close-hover-bg);
  }

  .close-btn.standalone {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--modal-close-bg);
    color: var(--modal-close-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .close-btn.standalone:hover {
    background: var(--modal-close-hover-bg);
    transform: scale(1.1);
  }

  .modal-body {
    padding: var(--modal-body-padding);
    font-size: 1rem;
    color: var(--modal-body-color);
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: var(--modal-footer-padding);
    background: var(--modal-footer-bg);
    border-top: 1px solid var(--modal-border-color);
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--modal-border-radius);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  button.confirm {
    background: var(--modal-btn-primary-bg);
    color: var(--modal-btn-primary-text);
  }

  button.confirm:hover {
    background: var(--modal-btn-primary-hover-bg);
  }

  button.cancel {
    background: var(--modal-btn-secondary-bg);
    color: var(--modal-btn-secondary-text);
  }

  button.cancel:hover {
    background: var(--modal-btn-secondary-hover-bg);
  }

  /* Tertiary button (button3) */
  .modal-footer button:not(.confirm):not(.cancel) {
    background: var(--modal-btn-tertiary-bg);
    color: var(--modal-btn-tertiary-text);
  }

  .modal-footer button:not(.confirm):not(.cancel):hover {
    background: var(--modal-btn-tertiary-hover-bg);
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      transition: none;
    }

    .modal {
      transition: none;
    }

    .close-btn {
      transition: none;
    }

    .close-btn.standalone:hover {
      transform: none;
    }

    button {
      transition: none;
    }
  }
`;
