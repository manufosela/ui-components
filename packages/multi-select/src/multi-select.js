import { LitElement, html, nothing } from 'lit';
import { multiSelectStyles } from './multi-select.styles.js';

/**
 * A multi-select dropdown component with checkbox options.
 *
 * @element multi-select
 * @fires change - Fired when selection changes. Detail: { selectedValues: string[] }
 *
 * @attr {String} label - Label for the select
 * @attr {String} placeholder - Placeholder text when nothing selected
 * @attr {Boolean} disabled - Disable the select
 *
 * @cssprop --multi-select-min-width - Minimum width (default: 200px)
 * @cssprop --multi-select-bg - Background color (default: white)
 * @cssprop --multi-select-border-color - Border color (default: #dee2e6)
 * @cssprop --multi-select-radius - Border radius (default: 4px)
 */
export class MultiSelect extends LitElement {
  static styles = multiSelectStyles;

  static properties = {
    label: { type: String },
    options: { type: Array },
    selectedValues: { type: Array, attribute: 'selected-values' },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    isOpen: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.label = '';
    this.options = [];
    this.selectedValues = [];
    this.placeholder = 'Select...';
    this.disabled = false;
    this.isOpen = false;

    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeGlobalClickListener();
  }

  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this._addGlobalClickListener();
      } else {
        this._removeGlobalClickListener();
      }
    }
  }

  _addGlobalClickListener() {
    document.addEventListener('mousedown', this._handleClickOutside, true);
  }

  _removeGlobalClickListener() {
    document.removeEventListener('mousedown', this._handleClickOutside, true);
  }

  _handleClickOutside(event) {
    if (this.isOpen && !event.composedPath().includes(this)) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  toggleOption(value) {
    if (this.disabled) return;

    const newSelectedValues = this.selectedValues.includes(value)
      ? this.selectedValues.filter(v => v !== value)
      : [...this.selectedValues, value];

    this.selectedValues = newSelectedValues;

    this.dispatchEvent(new CustomEvent('change', {
      detail: { selectedValues: newSelectedValues },
      bubbles: true,
      composed: true
    }));
  }

  selectAll() {
    if (this.disabled) return;
    this.selectedValues = this.options.map(opt => opt.value);
    this._dispatchChange();
  }

  clearAll() {
    if (this.disabled) return;
    this.selectedValues = [];
    this._dispatchChange();
  }

  _dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { selectedValues: this.selectedValues },
      bubbles: true,
      composed: true
    }));
  }

  _getSelectedLabels() {
    return this.selectedValues.map(value => {
      const option = this.options.find(opt => opt.value === value);
      return option ? option.label : value;
    });
  }

  render() {
    const selectedLabels = this._getSelectedLabels();
    const hasSelection = selectedLabels.length > 0;

    return html`
      <div class="multi-select ${this.isOpen ? 'open' : ''}">
        <div class="select-header" @click="${this.toggleDropdown}">
          <div class="selected-values ${hasSelection ? '' : 'placeholder'}">
            ${hasSelection ? selectedLabels.join(', ') : this.placeholder}
          </div>
          <div class="select-arrow">▼</div>
        </div>

        <div class="options-container">
          ${this.options.length === 0 ? html`
            <div class="no-options">No options available</div>
          ` : this.options.map(option => html`
            <div
              class="option ${this.selectedValues.includes(option.value) ? 'selected' : ''}"
              @click="${() => this.toggleOption(option.value)}"
            >
              <input
                type="checkbox"
                .checked="${this.selectedValues.includes(option.value)}"
                @click="${(e) => { e.stopPropagation(); this.toggleOption(option.value); }}"
              >
              <span>${option.label}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('multi-select', MultiSelect);
