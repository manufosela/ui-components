import { LitElement, html } from 'lit';
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
 * @attr {String} sort - Sort options: '' (none), 'asc' (A-Z), 'desc' (Z-A)
 *
 * @slot - Default slot for declarative option elements
 *
 * @example
 * <!-- Declarative usage -->
 * <multi-select placeholder="Select fruits...">
 *   <option value="apple">Apple</option>
 *   <option value="banana" selected>Banana</option>
 *   <option value="cherry">Cherry</option>
 * </multi-select>
 *
 * @cssprop [--multi-select-min-width=200px] - Minimum width
 * @cssprop [--multi-select-bg=white] - Background color
 * @cssprop [--multi-select-border-color=#dee2e6] - Border color
 * @cssprop [--multi-select-radius=4px] - Border radius
 */
export class MultiSelect extends LitElement {
  static styles = multiSelectStyles;

  static properties = {
    label: { type: String },
    options: { type: Array },
    selectedValues: { type: Array, attribute: 'selected-values' },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    sort: { type: String },
    isOpen: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.label = '';
    this.options = [];
    this.selectedValues = [];
    this.placeholder = 'Select...';
    this.disabled = false;
    this.sort = '';
    this.isOpen = false;
    this._slotOptionsProcessed = false;

    this._handleClickOutside = this._handleClickOutside.bind(this);
  }

  /** Get options sorted according to sort property */
  get _sortedOptions() {
    if (!this.sort) {
      return this.options;
    }
    const sorted = [...this.options].sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
    return this.sort === 'desc' ? sorted.reverse() : sorted;
  }

  connectedCallback() {
    super.connectedCallback();
    // Process declarative options from light DOM
    this._processSlotOptions();
  }

  _processSlotOptions() {
    // Only process if options weren't set programmatically
    if (this.options.length > 0 || this._slotOptionsProcessed) return;

    const slotOptions = this.querySelectorAll('option');
    if (slotOptions.length > 0) {
      this._slotOptionsProcessed = true;
      const options = [];
      const selectedValues = [];

      slotOptions.forEach((option) => {
        options.push({
          value: option.value || option.textContent.trim(),
          label: option.textContent.trim(),
        });
        if (option.hasAttribute('selected')) {
          selectedValues.push(option.value || option.textContent.trim());
        }
      });

      this.options = options;
      if (selectedValues.length > 0 && this.selectedValues.length === 0) {
        this.selectedValues = selectedValues;
      }
    }
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
      ? this.selectedValues.filter((v) => v !== value)
      : [...this.selectedValues, value];

    this.selectedValues = newSelectedValues;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selectedValues: newSelectedValues },
        bubbles: true,
        composed: true,
      })
    );
  }

  selectAll() {
    if (this.disabled) return;
    this.selectedValues = this.options.map((opt) => opt.value);
    this._dispatchChange();
  }

  clearAll() {
    if (this.disabled) return;
    this.selectedValues = [];
    this._dispatchChange();
  }

  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selectedValues: this.selectedValues },
        bubbles: true,
        composed: true,
      })
    );
  }

  _getSelectedLabels() {
    return this.selectedValues.map((value) => {
      const option = this.options.find((opt) => opt.value === value);
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
          ${this._sortedOptions.length === 0
            ? html` <div class="no-options">No options available</div> `
            : this._sortedOptions.map(
                (option) => html`
                  <div
                    class="option ${this.selectedValues.includes(option.value) ? 'selected' : ''}"
                    @click="${() => this.toggleOption(option.value)}"
                  >
                    <input
                      type="checkbox"
                      .checked="${this.selectedValues.includes(option.value)}"
                      @click="${(e) => {
                        e.stopPropagation();
                        this.toggleOption(option.value);
                      }}"
                    />
                    <span>${option.label}</span>
                  </div>
                `
              )}
        </div>
      </div>
    `;
  }
}

customElements.define('multi-select', MultiSelect);
