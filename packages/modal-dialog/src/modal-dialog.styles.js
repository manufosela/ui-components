import { css } from 'lit';

export const modalDialogStyles = css`
  :host {
    display: contents;
  }

  :host([hidden]) {
    display: none;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: var(--modal-overlay-bg, rgba(0, 0, 0, 0.5));
    z-index: var(--modal-z-index, 9999);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  :host([open]) .overlay {
    opacity: 1;
    visibility: visible;
  }

  .modal {
    background: var(--modal-bg, #fff);
    border-radius: var(--modal-radius, 12px);
    box-shadow: var(--modal-shadow, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04));
    max-width: var(--modal-max-width, 500px);
    width: 100%;
    max-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    transform: scale(0.95) translateY(-20px);
    transition: transform 0.2s ease;
  }

  :host([open]) .modal {
    transform: scale(1) translateY(0);
  }

  :host([size="small"]) .modal {
    max-width: 360px;
  }

  :host([size="large"]) .modal {
    max-width: 720px;
  }

  :host([size="full"]) .modal {
    max-width: calc(100vw - 2rem);
  }

  :host([size="fullscreen"]) .modal {
    max-width: calc(100vw - 2rem);
    height: calc(100vh - 2rem);
    border-radius: var(--modal-radius-fullscreen, 8px);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--modal-header-padding, 16px 20px);
    border-bottom: 1px solid var(--modal-border-color, #e5e7eb);
  }

  .title {
    margin: 0;
    font-size: var(--modal-title-size, 18px);
    font-weight: 600;
    color: var(--modal-title-color, #111827);
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: -8px -8px -8px 8px;
    color: var(--modal-close-color, #6b7280);
    font-size: 18px;
    line-height: 1;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: var(--modal-close-hover-color, #374151);
  }

  .body {
    padding: var(--modal-body-padding, 20px);
    overflow-y: auto;
    flex: 1;
    color: var(--modal-body-color, #374151);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: var(--modal-footer-padding, 16px 20px);
    border-top: 1px solid var(--modal-border-color, #e5e7eb);
  }

  ::slotted([slot="footer"]) {
    margin: 0;
  }

  /* Focus trap indicator */
  .focus-trap {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
