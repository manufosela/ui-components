import { css } from 'lit';

export const arcSliderStyles = css`
  :host {
    display: block;
    --arc-slider-text-color: #000;
    --arc-slider-thumb-size: 20px;
    --arc-slider-width: 12.5em;
    --arc-slider-value-bg: #f2f2f3;
    --arc-slider-value-border: #dbdbe3;
    --arc-slider-value-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  .arc-slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: var(--arc-slider-width);
    max-width: 100%;
    user-select: none;
    outline: none;
    border-radius: 8px;
  }

  .arc-slider-container:focus-visible {
    outline: 2px solid var(--arc-slider-focus-color, #3b82f6);
    outline-offset: 4px;
  }

  .arc-svg {
    width: 100%;
    height: auto;
    overflow: visible;
    touch-action: none;
    cursor: pointer;
  }

  .arc-path {
    touch-action: none;
    cursor: pointer;
  }

  .arc-thumb {
    touch-action: none;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .arc-thumb:hover {
    transform: scale(1.1);
  }

  .value-display {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
    border: 1px solid var(--arc-slider-value-border);
    border-radius: 5rem;
    padding: 0.25rem 0.75rem;
    background-color: var(--arc-slider-value-bg);
    box-shadow: var(--arc-slider-value-shadow);
    font-size: 0.9rem;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    color: var(--arc-slider-text-color);
  }

  /* Value position variants */
  .arc-slider-container[data-value-position='top'] .value-display {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .arc-slider-container[data-value-position='center'] {
    position: relative;
  }

  .arc-slider-container[data-value-position='center'] .value-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }

  .value-text {
    user-select: none;
  }

  /* Screen reader only - hidden but accessible */
  .sr-only {
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

  @media (prefers-reduced-motion: reduce) {
    .arc-thumb {
      transition: none;
    }

    .arc-thumb:hover {
      transform: none;
    }
  }
`;
