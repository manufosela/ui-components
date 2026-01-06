import { css } from 'lit';

export const MultiCarouselStyles = css`
  :host {
    display: block;
    width: var(--carousel-width, 100%);
  }

  .carousel {
    position: relative;
    width: 100%;
    height: var(--carousel-height, 300px);
    background: var(--carousel-bg, #f8fafc);
    border-radius: var(--carousel-radius, 12px);
    overflow: hidden;
    outline: none;
  }

  .carousel:focus-visible {
    box-shadow: 0 0 0 2px var(--carousel-focus-color, #3b82f6);
  }

  .slides-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .slides {
    display: flex;
    height: 100%;
    transition: transform var(--carousel-transition, 0.4s) ease-out;
  }

  /* Wrap-around transition: use fade instead of slide to avoid "rewind" effect */
  .slides.wrapping {
    transition: none;
    animation: carousel-fade 0.4s ease-out;
  }

  @keyframes carousel-fade {
    0% {
      opacity: 1;
    }
    40% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  ::slotted(*) {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  /* Arrows */
  .arrows {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
  }

  .arrow {
    pointer-events: auto;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: 50%;
    background: var(--carousel-arrow-bg, rgba(255, 255, 255, 0.9));
    color: var(--carousel-arrow-color, #64748b);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .arrow:hover {
    background: var(--carousel-arrow-hover-bg, white);
    color: var(--carousel-arrow-hover-color, #1e293b);
    transform: scale(1.1);
  }

  .arrow:active {
    transform: scale(0.95);
  }

  .arrow.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .arrow svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Navigation dots */
  .navigation {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--carousel-nav-bg, rgba(255, 255, 255, 0.8));
    border-radius: 999px;
    backdrop-filter: blur(4px);
  }

  .nav-dot {
    width: 0.625rem;
    height: 0.625rem;
    border: none;
    border-radius: 50%;
    background: var(--carousel-nav-color, #94a3b8);
    cursor: pointer;
    padding: 0;
    transition: all 0.2s;
  }

  .nav-dot:hover {
    background: var(--carousel-nav-hover, #64748b);
    transform: scale(1.2);
  }

  .nav-dot.active {
    background: var(--carousel-nav-active, #3b82f6);
    transform: scale(1.2);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .arrow {
      width: 2rem;
      height: 2rem;
    }

    .arrow svg {
      width: 1rem;
      height: 1rem;
    }

    .navigation {
      bottom: 0.5rem;
      padding: 0.375rem;
      gap: 0.375rem;
    }

    .nav-dot {
      width: 0.5rem;
      height: 0.5rem;
    }
  }
`;
