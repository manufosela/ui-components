import { css } from 'lit';

export const loadingLayerStyles = css`
  :host {
    display: block;
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--loading-layer-bg, rgba(0, 0, 0, 0.5));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--loading-layer-z-index, 9999);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--loading-layer-transition, 0.3s) ease,
                visibility var(--loading-layer-transition, 0.3s) ease;
  }

  :host([visible]) .loading-overlay {
    opacity: 1;
    visibility: visible;
  }

  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .spinner {
    animation: spin var(--loading-layer-spin-duration, 1s) linear infinite;
  }

  .message {
    color: var(--loading-layer-text-color, #fff);
    font-family: var(--loading-layer-font-family, inherit);
    font-size: var(--loading-layer-font-size, 1rem);
    text-align: center;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
