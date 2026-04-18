import { css } from 'lit';

export const appModalStyles = css`
  :host {
    /* Design System Tokens */

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

  dialog {
    background: var(--modal-bg);
    color: var(--modal-text-color);
    border-radius: var(--modal-border-radius);
    box-shadow: var(--modal-shadow);
    border: none;
    padding: 0;
    width: 90%;
    max-width: var(--max-width, var(--modal-max-width));
    max-height: var(--max-height, var(--modal-max-height));
    text-align: center;
    overflow: auto;
  }

  dialog::backdrop {
    background: var(--modal-overlay-bg);
  }

  dialog[open] {
    animation: modal-fade-in 0.3s ease-out;
  }

  @keyframes modal-fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
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
    background: var(--modal-close-bg);
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--modal-close-color);
    transition:
      background 0.2s,
      color 0.2s;
    z-index: 1;
  }

  .close-btn:hover {
    background: var(--modal-close-hover-bg);
    color: var(--modal-close-hover-color);
  }

  .close-btn.standalone {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
    background: var(--modal-close-bg);
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.2s;
  }

  .close-btn.standalone:hover {
    transform: scale(1.1);
  }

  .modal-body {
    padding: var(--modal-body-padding);
    text-align: left;
    color: var(--modal-body-color);
    overflow: auto;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: var(--modal-footer-padding);
    background: var(--modal-footer-bg);
    border-top: 1px solid var(--modal-border-color);
    flex-wrap: wrap;
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

  /* Full height mode - content expands to fill maxHeight */
  :host([full-height]) dialog {
    height: var(--max-height, var(--modal-max-height));
    display: flex;
    flex-direction: column;
  }

  :host([full-height]) .modal-body {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  :host([full-height]) .modal-body > * {
    flex: 1;
    min-height: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    dialog[open] {
      animation: none;
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
