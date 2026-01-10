import { css } from 'lit';

export const starsRatingStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--stars-rating-gap, 4px);
  }

  :host([hidden]) {
    display: none;
  }

  .stars-container {
    display: inline-flex;
    align-items: center;
    gap: var(--stars-rating-gap, 4px);
  }

  .star {
    cursor: default;
    font-size: var(--stars-rating-size, 24px);
    color: var(--stars-rating-empty-color, #e5e7eb);
    transition:
      color 0.15s ease,
      transform 0.15s ease;
  }

  :host([manual]) .star {
    cursor: pointer;
  }

  :host([manual]) .star:hover {
    transform: scale(1.15);
  }

  .star.filled {
    color: var(--stars-rating-color, #fbbf24);
  }

  .star.half {
    position: relative;
    color: var(--stars-rating-empty-color, #e5e7eb);
  }

  .star.half::before {
    content: attr(data-star);
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    overflow: hidden;
    color: var(--stars-rating-color, #fbbf24);
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }

  .reset-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: calc(var(--stars-rating-size, 24px) * 0.6);
    padding: 4px;
    margin-left: 8px;
    color: var(--stars-rating-reset-color, #6b7280);
    transition: color 0.15s ease;
  }

  .reset-btn:hover {
    color: var(--stars-rating-reset-hover-color, #374151);
  }

  :host([disabled]) .star {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .star,
    .reset-btn {
      transition: none;
    }

    :host([manual]) .star:hover {
      transform: none;
    }
  }
`;
