import { css } from 'lit';

export const NavListStyles = css`
  :host {
    display: block;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .navlist {
    width: 100%;
  }

  .navlist__title {
    font-weight: var(--nav-list-title-weight, 700);
    letter-spacing: 2px;
    font-size: var(--nav-list-title-size, 16px);
    margin-bottom: 10px;
    color: var(--nav-list-title-color, inherit);
  }

  .navlist__group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--nav-list-gap, 5px);
  }

  @media screen and (max-width: 992px) {
    .navlist__group {
      justify-content: center;
    }
  }

  .navlist__radio {
    display: none;
  }

  .navlist__item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--nav-list-padding, 10px 20px);
    font-size: var(--nav-list-font-size, 14px);
    letter-spacing: var(--nav-list-letter-spacing, 2px);
    border: 2px solid var(--nav-list-border-color, transparent);
    border-radius: var(--nav-list-border-radius, 4px);
    background: var(--nav-list-bg, transparent);
    transition: all 0.2s ease;
    outline: none;
  }

  .navlist__item--clickable {
    cursor: pointer;
  }

  .navlist__item--clickable:hover {
    background: var(--nav-list-hover-bg, rgba(0, 0, 0, 0.05));
  }

  .navlist__item--clickable:focus-visible {
    box-shadow: 0 0 0 2px var(--nav-list-focus-color, #3b82f6);
  }

  .navlist__item--selected {
    border-color: var(--nav-list-selected-border-color, #cc3743);
    background: var(--nav-list-selected-bg, transparent);
    color: var(--nav-list-selected-color, inherit);
  }

  .navlist__text {
    white-space: nowrap;
  }

  /* Animation */
  .off {
    opacity: 0;
  }

  .fadein {
    opacity: 1;
    animation: fadeInOpacity 0.3s ease-in;
  }

  @keyframes fadeInOpacity {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;
