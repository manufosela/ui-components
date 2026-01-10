import { css } from 'lit';

export const lcdDigitStyles = css`
  :host {
    display: inline-block;
    --_seg-len: var(--lcd-segment-length, 30px);
    --_seg-w: var(--lcd-segment-width, 6px);
    --_gap: 2px;
  }

  :host([hidden]) {
    display: none;
  }

  .lcd-digit {
    position: relative;
    width: var(--_seg-len);
    height: calc(var(--_seg-len) * 2 + var(--_seg-w));
  }

  .segment {
    position: absolute;
    background-color: var(--lcd-digit-off-color, rgba(0, 0, 0, 0.1));
    transition: background-color 0.1s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .segment {
      transition: none;
    }
  }

  .segment.on {
    background-color: var(--lcd-digit-on-color, #22c55e);
    box-shadow: 0 0 4px var(--lcd-digit-glow-color, rgba(34, 197, 94, 0.5));
  }

  /* Horizontal segments (a, d, g) */
  .segment-h {
    width: calc(var(--_seg-len) - var(--_seg-w) - var(--_gap) * 2);
    height: var(--_seg-w);
    left: calc(var(--_seg-w) / 2 + var(--_gap));
    clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  }

  /* Vertical segments (b, c, e, f) */
  .segment-v {
    width: var(--_seg-w);
    height: calc(var(--_seg-len) - var(--_gap) * 2);
    clip-path: polygon(50% 0, 100% 10%, 100% 90%, 50% 100%, 0 90%, 0 10%);
  }

  /* Segment positions */
  .segment-a {
    top: 0;
  }
  .segment-b {
    right: 0;
    top: calc(var(--_seg-w) / 2 + var(--_gap));
  }
  .segment-c {
    right: 0;
    top: calc(var(--_seg-len) + var(--_seg-w) / 2 + var(--_gap));
  }
  .segment-d {
    bottom: 0;
  }
  .segment-e {
    left: 0;
    top: calc(var(--_seg-len) + var(--_seg-w) / 2 + var(--_gap));
  }
  .segment-f {
    left: 0;
    top: calc(var(--_seg-w) / 2 + var(--_gap));
  }
  .segment-g {
    top: calc(var(--_seg-len) - var(--_seg-w) / 2);
  }

  /* Colon for clock display */
  :host([colon]) {
    margin-right: calc(var(--_seg-w) + 8px);
  }

  .colon {
    position: absolute;
    width: var(--_seg-w);
    height: var(--_seg-w);
    border-radius: 50%;
    right: calc(-1 * var(--_seg-w) - 4px);
    background-color: var(--lcd-digit-off-color, rgba(0, 0, 0, 0.1));
  }

  .colon.on {
    background-color: var(--lcd-digit-on-color, #22c55e);
    box-shadow: 0 0 4px var(--lcd-digit-glow-color, rgba(34, 197, 94, 0.5));
  }

  .colon-top {
    top: calc(var(--_seg-len) / 2 - var(--_seg-w) / 2);
  }

  .colon-bottom {
    top: calc(var(--_seg-len) * 1.5 + var(--_seg-w) / 2);
  }
`;
