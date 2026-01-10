import { css } from 'lit';

export const richOptionStyles = css`
  :host {
    display: block;
  }
`;

export const richSelectStyles = css`
  :host {
    display: inline-block;
    position: relative;
    user-select: none;
    outline-width: 0px;
    text-align: justify;
    width: var(--rich-select-width, auto);
    font-family: var(--rich-select-font-family, inherit);
  }

  /* Caller (trigger button) */
  #caller {
    display: flex;
    padding: var(--caller-padding, 8px 12px);
    background: var(--caller-background, #fff);
    color: var(--caller-color, inherit);
    white-space: nowrap;
    box-shadow: var(--caller-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
    border: var(--caller-border, 1px solid #d1d5db);
    border-radius: var(--caller-border-radius, 6px);
    height: inherit;
    width: inherit;
    align-items: center;
    transition: all 0.15s ease;
  }

  #caller :first-child {
    position: relative;
    width: inherit;
    overflow-x: hidden;
    flex: 1;
  }

  :host([disabled]) #caller {
    color: var(--caller-disabled-color, #9ca3af);
    background: var(--caller-disabled-background, #f3f4f6);
    cursor: not-allowed;
    border-color: var(--caller-disabled-border-color, #e5e7eb);
  }

  :host(:not([disabled])) #caller:hover {
    cursor: var(--caller-hover-cursor, pointer);
    background: var(--caller-hover-background, #f9fafb);
    color: var(--caller-hover-color, inherit);
    border-color: var(--caller-hover-border-color, #9ca3af);
  }

  :host(:not([disabled]):focus) #caller {
    outline: var(--caller-focus-outline, none);
    border-color: var(--caller-focus-border-color, #3b82f6);
    box-shadow: var(--caller-focus-shadow, 0 0 0 3px rgba(59, 130, 246, 0.2));
  }

  /* Arrow */
  :host([arrow]) #arrow {
    line-height: 20px;
    font-size: var(--arrow-font-size, 14px);
    margin: var(--arrow-margin, 0 0 0 8px);
    color: var(--arrow-color, #6b7280);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([arrow]):host([expanded]) #arrow > span {
    transform: rotate(180deg);
  }

  :host([arrow]) #arrow > span {
    display: block;
    transition: transform var(--animated-time, 0.2s) ease;
  }

  :host(:not([arrow])) #arrow {
    display: none;
  }

  /* Select options dropdown */
  #selectOptions {
    max-height: var(--selectOptions-max-height, 300px);
    overflow-y: auto;
    position: fixed;
    box-shadow: var(
      --selectOptions-shadow,
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06)
    );
    background: var(--selectOptions-background, #fff);
    border: var(--selectOptions-border, 1px solid #e5e7eb);
    border-radius: var(--selectOptions-border-radius, 6px);
    z-index: var(--selectOptions-zIndex, 50);
    transition:
      visibility 0s linear var(--animated-time, 0.15s),
      opacity var(--animated-time, 0.15s) ease;
  }

  :host([animated]):host(:not([expanded])) #selectOptions {
    visibility: hidden;
    opacity: 0;
  }

  :host([animated]):host([expanded]) #selectOptions {
    visibility: visible;
    opacity: 1;
    transition-delay: 0s;
  }

  #holder {
    overflow-y: auto;
    max-height: inherit;
  }

  /* Search input */
  :host(:not([search])) #search {
    display: none;
  }

  #search {
    line-height: normal;
    padding: 8px;
    border-bottom: 1px solid #e5e7eb;
  }

  #search input[type='text'] {
    outline: var(--input-outline, none);
    margin: var(--input-margin, 0);
    width: var(--input-width, 100%);
    border: var(--input-border, 1px solid #d1d5db);
    border-radius: var(--input-border-radius, 4px);
    font: var(--input-font, inherit);
    font-size: var(--input-font-size, 14px);
    padding: var(--input-padding, 6px 10px);
    color: var(--input-color, inherit);
    background: var(--input-background, #fff);
    box-sizing: border-box;
  }

  #search input[type='text']:focus {
    border-color: var(--input-focus-border-color, #3b82f6);
    box-shadow: var(--input-focus-shadow, 0 0 0 2px rgba(59, 130, 246, 0.2));
  }

  #search input[type='text']::placeholder {
    color: var(--input-placeholder-color, #9ca3af);
  }

  /* Option styling */
  ::slotted(rich-option),
  rich-option {
    display: block;
    cursor: pointer;
    padding: var(--option-padding, 10px 12px);
    border: var(--option-border, none);
    color: var(--option-color, inherit);
    line-height: normal;
    transition:
      background-color 0.1s ease,
      color 0.1s ease;
  }

  ::slotted(rich-option:last-child),
  rich-option:last-child {
    border-bottom-left-radius: var(--selectOptions-border-radius, 6px);
    border-bottom-right-radius: var(--selectOptions-border-radius, 6px);
  }

  ::slotted(rich-option:first-child),
  rich-option:first-child {
    border-top-left-radius: var(--selectOptions-border-radius, 6px);
    border-top-right-radius: var(--selectOptions-border-radius, 6px);
  }

  :host([search]) ::slotted(rich-option:first-child),
  :host([search]) rich-option:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  ::slotted(rich-option:hover) {
    background: var(--option-hover-background, #f3f4f6);
    color: var(--option-hover-color, inherit);
  }

  ::slotted(rich-option[hidden]) {
    display: none;
  }

  ::slotted([disabled]) {
    background: var(--option-disabled-background, #f9fafb);
    color: var(--option-disabled-color, #9ca3af);
    cursor: not-allowed;
  }

  ::slotted(rich-option[considered]) {
    background: var(--option-active-background, #3b82f6);
    color: var(--option-active-color, #fff);
  }

  ::slotted(rich-option[selected]:not([considered])) {
    background: var(--option-selected-background, #eff6ff);
    color: var(--option-selected-color, #1d4ed8);
  }

  /* Dark mode support */
  :host-context(.dark) {
    color: var(--dark-text-color, #e5e7eb);
  }

  :host-context(.dark) #caller {
    background: var(--dark-caller-background, #374151);
    border-color: var(--dark-caller-border-color, #4b5563);
    box-shadow: var(--dark-caller-shadow, 0 1px 3px rgba(0, 0, 0, 0.3));
  }

  :host-context(.dark:not([disabled])) #caller:hover {
    background: var(--dark-caller-hover-background, #4b5563);
    color: var(--dark-caller-hover-color, #f3f4f6);
  }

  :host-context(.dark[arrow]) #arrow {
    color: var(--dark-arrow-color, #9ca3af);
  }

  :host-context(.dark) #selectOptions {
    box-shadow: var(--dark-selectOptions-shadow, 0 4px 6px rgba(0, 0, 0, 0.4));
    background: var(--dark-selectOptions-background, #374151);
    border-color: var(--dark-selectOptions-border-color, #4b5563);
  }

  :host-context(.dark) #search {
    border-bottom-color: var(--dark-search-border-color, #4b5563);
  }

  :host-context(.dark) #search input[type='text'] {
    border-color: var(--dark-input-border-color, #4b5563);
    background: var(--dark-input-background, #1f2937);
    color: var(--dark-input-color, #e5e7eb);
  }

  :host-context(.dark) ::slotted([disabled]) {
    background: var(--dark-option-disabled-background, #1f2937);
    color: var(--dark-option-disabled-color, #6b7280);
  }

  :host-context(.dark) ::slotted(rich-option:hover) {
    background: var(--dark-option-hover-background, #4b5563);
  }

  :host-context(.dark) ::slotted(rich-option[considered]) {
    background: var(--dark-option-active-background, #3b82f6);
    color: var(--dark-option-active-color, #fff);
  }

  :host-context(.dark) ::slotted(rich-option[selected]:not([considered])) {
    background: var(--dark-option-selected-background, #1e3a5f);
    color: var(--dark-option-selected-color, #60a5fa);
  }

  @media (prefers-reduced-motion: reduce) {
    #caller {
      transition: none;
    }

    :host([arrow]) #arrow > span {
      transition: none;
    }

    #selectOptions {
      transition: none;
    }

    ::slotted(rich-option),
    rich-option {
      transition: none;
    }
  }
`;
