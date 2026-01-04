import { LitElement, html, css } from 'lit';

const multiSelectStyles = css`
  :host {
    display: block;
    font-family: inherit;
  }

  .multi-select {
    position: relative;
    width: 100%;
    min-width: 200px;
  }

  .select-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }

  .selected-values {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #495057;
  }

  .select-arrow {
    margin-left: 8px;
    font-size: 0.8em;
    color: #6c757d;
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
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    margin-top: 4px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .multi-select.open .options-container {
    display: block;
  }

  .option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .option:hover {
    background-color: #f8f9fa;
  }

  .option.selected {
    background-color: #e9ecef;
  }

  .option input[type="checkbox"] {
    margin-right: 8px;
  }

  .option span {
    flex: 1;
  }
`;

export class MultiSelect extends LitElement {
  static properties = {
    label: { type: String },
    options: { type: Array },
    selectedValues: { type: Array },
    placeholder: { type: String },
    isOpen: { type: Boolean },
    logger: { type: Object, attribute: false }
  };

  static styles = multiSelectStyles;

  constructor() {
    super();
    this.label = '';
    this.options = [];
    this.selectedValues = [];
    this.placeholder = 'Seleccionar...';
    this.isOpen = false;
    this.logger = null;

    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  _log(level, ...args) {
    this.logger?.[level]?.(...args);
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('options') && this.options?.length > 0) {
      this._log('log', '[MultiSelect] Options loaded:', this.options.length);
    }

    if (changedProperties.has('selectedValues') && this.selectedValues?.length > 0) {
      this._log('log', '[MultiSelect] Selection changed:', this.selectedValues.length);
    }

    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this._addGlobalClickListener();
      } else {
        this._removeGlobalClickListener();
      }
    }
  }

  render() {
    const selectedLabels = this.selectedValues.map(value => {
      const option = this.options.find(opt => opt.value === value);
      return option ? option.label : value;
    });

    return html`
      <div class="multi-select ${this.isOpen ? 'open' : ''}">
        <div class="select-header" @click=${this.toggleDropdown}>
          <div class="selected-values">
            ${selectedLabels.length > 0
              ? selectedLabels.join(', ')
              : this.placeholder}
          </div>
          <div class="select-arrow">▼</div>
        </div>

        <div class="options-container">
          ${this.options.map(option => html`
            <div class="option ${this.selectedValues.includes(option.value) ? 'selected' : ''}"
                 @click=${() => this.toggleOption(option.value)}>
              <input type="checkbox"
                     ?checked=${this.selectedValues.includes(option.value)}
                     @click=${(e) => { e.stopPropagation(); this.toggleOption(option.value); }}>
              <span>${option.label}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  toggleOption(value) {
    const newSelectedValues = this.selectedValues.includes(value)
      ? this.selectedValues.filter(v => v !== value)
      : [...this.selectedValues, value];

    this.selectedValues = newSelectedValues;
    this._log('log', '[MultiSelect] Option toggled:', value, 'Selected:', newSelectedValues);

    this.dispatchEvent(new CustomEvent('change', {
      detail: { selectedValues: newSelectedValues },
      bubbles: true,
      composed: true
    }));
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this._log('log', '[MultiSelect] Dropdown toggled:', this.isOpen);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeGlobalClickListener();
  }

  _handleClickOutside(event) {
    if (this.isOpen && !event.composedPath().includes(this)) {
      this.isOpen = false;
    }
  }

  _addGlobalClickListener() {
    if (!this._globalClickListener) {
      this._globalClickListener = (event) => {
        if (!event.composedPath().includes(this)) {
          this.isOpen = false;
        }
      };
      document.addEventListener('mousedown', this._globalClickListener, true);
    }
  }

  _removeGlobalClickListener() {
    if (this._globalClickListener) {
      document.removeEventListener('mousedown', this._globalClickListener, true);
      this._globalClickListener = null;
    }
  }
}

customElements.define('multi-select', MultiSelect);
