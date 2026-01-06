import { css } from 'lit';

export const multiSelectStyles = css`
  :host {
    display: block;
    font-family: inherit;
  }

  :host([hidden]) {
    display: none;
  }

  .multi-select {
    position: relative;
    width: 100%;
    min-width: var(--multi-select-min-width, 200px);
  }

  .select-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--multi-select-padding, 8px 12px);
    background: var(--multi-select-bg, white);
    border: 1px solid var(--multi-select-border-color, #dee2e6);
    border-radius: var(--multi-select-radius, 4px);
    cursor: pointer;
    user-select: none;
    transition: border-color 0.2s;
  }

  .select-header:hover {
    border-color: var(--multi-select-border-hover, #adb5bd);
  }

  .multi-select.open .select-header {
    border-color: var(--multi-select-border-focus, #3b82f6);
  }

  .selected-values {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--multi-select-text-color, #495057);
  }

  .selected-values.placeholder {
    color: var(--multi-select-placeholder-color, #6c757d);
  }

  .select-arrow {
    margin-left: 8px;
    font-size: 0.8em;
    color: var(--multi-select-arrow-color, #6c757d);
    transition: transform 0.2s;
  }

  .multi-select.open .select-arrow {
    transform: rotate(180deg);
  }

  .options-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--multi-select-dropdown-bg, white);
    border: 1px solid var(--multi-select-border-color, #dee2e6);
    border-radius: var(--multi-select-radius, 4px);
    margin-top: 4px;
    max-height: var(--multi-select-max-height, 300px);
    overflow-y: auto;
    z-index: var(--multi-select-z-index, 1000);
    display: none;
    box-shadow: var(--multi-select-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .multi-select.open .options-container {
    display: block;
  }

  .option {
    display: flex;
    align-items: center;
    padding: var(--multi-select-option-padding, 8px 12px);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .option:hover {
    background-color: var(--multi-select-option-hover-bg, #f8f9fa);
  }

  .option.selected {
    background-color: var(--multi-select-option-selected-bg, #e9ecef);
  }

  .option input[type='checkbox'] {
    margin-right: 8px;
    accent-color: var(--multi-select-checkbox-color, #3b82f6);
  }

  .option span {
    flex: 1;
  }

  .no-options {
    padding: 12px;
    text-align: center;
    color: var(--multi-select-placeholder-color, #6c757d);
  }
`;
