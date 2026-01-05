import { css } from 'lit';

export const themeToggleStyles = css`
  :host {
    display: inline-block;
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: var(--theme-toggle-padding, 4px);
    background: var(--theme-toggle-bg, #f3f4f6);
    border-radius: var(--theme-toggle-radius, 9999px);
    border: var(--theme-toggle-border, 1px solid #e5e7eb);
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--theme-toggle-button-size, 36px);
    height: var(--theme-toggle-button-size, 36px);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--theme-toggle-icon-color, #6b7280);
  }

  label:hover {
    background: var(--theme-toggle-hover-bg, rgba(0, 0, 0, 0.05));
  }

  label.active {
    background: var(--theme-toggle-active-bg, #fff);
    color: var(--theme-toggle-active-color, #1f2937);
    box-shadow: var(--theme-toggle-active-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  svg {
    width: var(--theme-toggle-icon-size, 20px);
    height: var(--theme-toggle-icon-size, 20px);
  }

  /* Dark mode styles */
  :host([theme="dark"]) .theme-toggle {
    background: var(--theme-toggle-dark-bg, #374151);
    border-color: var(--theme-toggle-dark-border, #4b5563);
  }

  :host([theme="dark"]) label {
    color: var(--theme-toggle-dark-icon-color, #9ca3af);
  }

  :host([theme="dark"]) label.active {
    background: var(--theme-toggle-dark-active-bg, #4b5563);
    color: var(--theme-toggle-dark-active-color, #f9fafb);
  }

  :host([theme="dark"]) label:hover {
    background: var(--theme-toggle-dark-hover-bg, rgba(255, 255, 255, 0.05));
  }
`;
