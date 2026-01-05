import { css } from 'lit';

export const toastNotificationStyles = css`
  :host {
    position: fixed;
    z-index: var(--toast-z-index, 9999);
    pointer-events: none;
  }

  :host([position="top-right"]) { top: 1rem; right: 1rem; }
  :host([position="top-left"]) { top: 1rem; left: 1rem; }
  :host([position="top-center"]) { top: 1rem; left: 50%; transform: translateX(-50%); }
  :host([position="bottom-right"]) { bottom: 1rem; right: 1rem; }
  :host([position="bottom-left"]) { bottom: 1rem; left: 1rem; }
  :host([position="bottom-center"]) { bottom: 1rem; left: 50%; transform: translateX(-50%); }

  :host([hidden]) {
    display: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: var(--toast-padding, 12px 16px);
    border-radius: var(--toast-radius, 8px);
    background: var(--toast-bg, #1f2937);
    color: var(--toast-color, #f9fafb);
    font-family: var(--toast-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    font-size: var(--toast-font-size, 14px);
    box-shadow: var(--toast-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
    pointer-events: auto;
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-width: var(--toast-max-width, 400px);
  }

  :host([visible]) .toast {
    opacity: 1;
    transform: translateY(0);
  }

  :host([position^="bottom"]) .toast {
    transform: translateY(20px);
  }

  :host([position^="bottom"][visible]) .toast {
    transform: translateY(0);
  }

  .toast.success {
    background: var(--toast-success-bg, #059669);
  }

  .toast.error {
    background: var(--toast-error-bg, #dc2626);
  }

  .toast.warning {
    background: var(--toast-warning-bg, #d97706);
  }

  .toast.info {
    background: var(--toast-info-bg, #2563eb);
  }

  .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .message {
    flex: 1;
    line-height: 1.4;
  }

  .close-btn {
    flex-shrink: 0;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 4px;
    margin: -4px -4px -4px 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
    line-height: 1;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0 0 var(--toast-radius, 8px) var(--toast-radius, 8px);
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    width: 100%;
    transform-origin: left;
    animation: progress linear forwards;
  }

  @keyframes progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }
`;
