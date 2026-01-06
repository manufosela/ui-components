import { css } from 'lit';

export const appModalStyles = css`
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--app-modal-z-index, 1000);
    opacity: 0;
    transition:
      opacity 0.3s ease-out,
      background 0.3s ease-out;
  }

  .modal {
    background: var(--app-modal-bg, white);
    border-radius: var(--app-modal-radius, 8px);
    padding: var(--app-modal-padding, 1.5rem);
    box-shadow: var(--app-modal-shadow, 0 4px 8px rgba(0, 0, 0, 0.2));
    width: 90%;
    max-width: var(--max-width, 400px);
    max-height: var(--max-height, 90vh);
    text-align: center;
    position: relative;
    overflow: auto;
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  .modal-header {
    font-size: var(--app-modal-title-size, 1.5rem);
    font-weight: bold;
    margin-bottom: 1rem;
    position: relative;
    min-height: 1.5rem;
    color: var(--app-modal-title-color, inherit);
  }

  .close-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    cursor: pointer;
    background: var(--app-modal-close-bg, rgba(0, 0, 0, 0.1));
    border: none;
    color: var(--app-modal-close-color, #666);
    z-index: 1;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    color: var(--app-modal-close-hover-color, #333);
    background: var(--app-modal-close-hover-bg, rgba(0, 0, 0, 0.2));
  }

  .close-btn.standalone {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    background: rgba(150, 50, 50, 0.5);
    color: #000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .close-btn.standalone:hover {
    background: #f8f9fa;
    transform: scale(1.1);
  }

  .modal-body {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: var(--app-modal-body-color, #333);
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  button.confirm {
    background: var(--app-modal-confirm-bg, #4caf50);
    color: var(--app-modal-confirm-color, white);
  }

  button.confirm:hover {
    background: var(--app-modal-confirm-hover-bg, #45a047);
  }

  button.cancel {
    background: var(--app-modal-cancel-bg, #f44336);
    color: var(--app-modal-cancel-color, white);
  }

  button.cancel:hover {
    background: var(--app-modal-cancel-hover-bg, #e53935);
  }
`;
