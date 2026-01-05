import { css } from 'lit';

export const circlePercentStyles = css`
  :host {
    display: inline-block;
    font-family: var(--circle-percent-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  }

  .circle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .circle-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    transform: rotate(-90deg);
  }

  .background-circle {
    fill: none;
    stroke: var(--circle-percent-bg-color, #e5e7eb);
  }

  .progress-circle {
    fill: none;
    stroke-linecap: round;
    transition: stroke-dasharray var(--circle-percent-animation-duration, 0.5s) ease-out;
  }

  .percent-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--circle-percent-text-size, 1.5rem);
    font-weight: var(--circle-percent-text-weight, 600);
    color: var(--circle-percent-text-color, currentColor);
  }

  .title {
    margin-top: var(--circle-percent-title-margin, 0.75rem);
    font-size: var(--circle-percent-title-size, 0.875rem);
    font-weight: var(--circle-percent-title-weight, 500);
    color: var(--circle-percent-title-color, #6b7280);
    letter-spacing: 0.025em;
    text-transform: uppercase;
  }

  :host([size="small"]) {
    --circle-percent-text-size: 1rem;
    --circle-percent-title-size: 0.75rem;
  }

  :host([size="large"]) {
    --circle-percent-text-size: 2rem;
    --circle-percent-title-size: 1rem;
  }
`;
