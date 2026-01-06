import { LitElement, html, css } from 'lit';

/**
 * Range slider web component with underline track style.
 *
 * @element slider-underline
 * @fires change - Fired when value changes (on release)
 * @fires input - Fired continuously while dragging
 * @cssprop --slider-track - Track color (default: #e5e7eb)
 * @cssprop --slider-fill - Filled track color (default: #3b82f6)
 * @cssprop --slider-thumb - Thumb color (default: #3b82f6)
 * @cssprop --slider-thumb-border - Thumb border (default: none)
 * @cssprop --slider-thumb-size - Thumb size (default: 20px)
 * @cssprop --slider-track-height - Track height (default: 4px)
 * @cssprop --slider-label-color - Label text color (default: #1f2937)
 */
export class SliderUnderline extends LitElement {
  static properties = {
    /** Current value */
    value: { type: Number, reflect: true },
    /** Minimum value */
    min: { type: Number },
    /** Maximum value */
    max: { type: Number },
    /** Step increment */
    step: { type: Number },
    /** Disabled state */
    disabled: { type: Boolean, reflect: true },
    /** Show value label */
    showValue: { type: Boolean, attribute: 'show-value' },
    /** Value label position: above, below, tooltip */
    labelPosition: { type: String, attribute: 'label-position' },
    /** Custom value formatter function name */
    format: { type: String },
    /** Optional label text */
    label: { type: String },
    /** Unit suffix for value display */
    unit: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      --thumb-size: var(--slider-thumb-size, 20px);
      --track-height: var(--slider-track-height, 4px);
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--slider-label-color, #1f2937);
    }

    .value-display {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--slider-fill, #3b82f6);
      min-width: 3rem;
      text-align: right;
    }

    .slider-wrapper {
      position: relative;
      height: var(--thumb-size);
      display: flex;
      align-items: center;
    }

    .track {
      position: absolute;
      width: 100%;
      height: var(--track-height);
      background: var(--slider-track, #e5e7eb);
      border-radius: calc(var(--track-height) / 2);
      overflow: hidden;
    }

    .fill {
      position: absolute;
      height: 100%;
      background: var(--slider-fill, #3b82f6);
      border-radius: calc(var(--track-height) / 2);
      transition: width 0.1s ease;
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: var(--thumb-size);
      background: transparent;
      cursor: pointer;
      margin: 0;
      position: relative;
      z-index: 2;
    }

    input[type="range"]:focus {
      outline: none;
    }

    input[type="range"]:focus-visible {
      outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: var(--thumb-size);
      height: var(--thumb-size);
      border-radius: 50%;
      background: var(--slider-thumb, #3b82f6);
      border: var(--slider-thumb-border, none);
      cursor: grab;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    input[type="range"]::-moz-range-thumb {
      width: var(--thumb-size);
      height: var(--thumb-size);
      border-radius: 50%;
      background: var(--slider-thumb, #3b82f6);
      border: var(--slider-thumb-border, none);
      cursor: grab;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    }

    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    }

    input[type="range"]:active::-webkit-slider-thumb {
      cursor: grabbing;
      transform: scale(1.15);
    }

    input[type="range"]:active::-moz-range-thumb {
      cursor: grabbing;
      transform: scale(1.15);
    }

    input[type="range"]:focus-visible::-webkit-slider-thumb {
      outline: 2px solid var(--slider-fill, #3b82f6);
      outline-offset: 2px;
    }

    input[type="range"]:focus-visible::-moz-range-thumb {
      outline: 2px solid var(--slider-fill, #3b82f6);
      outline-offset: 2px;
    }

    .tooltip {
      position: absolute;
      top: -2rem;
      transform: translateX(-50%);
      background: var(--slider-fill, #3b82f6);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: var(--slider-fill, #3b82f6);
    }

    .slider-wrapper:hover .tooltip,
    input[type="range"]:focus ~ .tooltip {
      opacity: 1;
    }

    .value-below {
      text-align: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--slider-fill, #3b82f6);
      margin-top: 0.25rem;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
  `;

  constructor() {
    super();
    this.value = 50;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
    this.showValue = true;
    this.labelPosition = 'above';
    this.format = '';
    this.label = '';
    this.unit = '';
  }

  get _percentage() {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  _formatValue(val) {
    if (this.format && typeof window[this.format] === 'function') {
      return window[this.format](val);
    }
    return `${val}${this.unit}`;
  }

  _handleInput(e) {
    this.value = Number(e.target.value);

    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleChange(e) {
    this.value = Number(e.target.value);

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  /** Set value programmatically */
  setValue(val) {
    const newValue = Math.min(this.max, Math.max(this.min, Number(val)));
    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      }));
    }
  }

  /** Increase value by step */
  increase() {
    this.setValue(this.value + this.step);
  }

  /** Decrease value by step */
  decrease() {
    this.setValue(this.value - this.step);
  }

  /** Reset to minimum value */
  reset() {
    this.setValue(this.min);
  }

  render() {
    const percentage = this._percentage;
    const formattedValue = this._formatValue(this.value);
    const tooltipLeft = `calc(${percentage}% + (${(50 - percentage) * 0.2}px))`;

    return html`
      <div class="container">
        ${this.label || (this.showValue && this.labelPosition === 'above') ? html`
          <div class="label-row">
            ${this.label ? html`<span class="label">${this.label}</span>` : html`<span></span>`}
            ${this.showValue && this.labelPosition === 'above' ? html`
              <span class="value-display">${formattedValue}</span>
            ` : ''}
          </div>
        ` : ''}

        <div class="slider-wrapper">
          <div class="track">
            <div class="fill" style="width: ${percentage}%"></div>
          </div>
          <input
            type="range"
            .value="${String(this.value)}"
            min="${this.min}"
            max="${this.max}"
            step="${this.step}"
            ?disabled="${this.disabled}"
            @input="${this._handleInput}"
            @change="${this._handleChange}"
            aria-label="${this.label || 'Slider'}"
            aria-valuemin="${this.min}"
            aria-valuemax="${this.max}"
            aria-valuenow="${this.value}"
            aria-valuetext="${formattedValue}"
          />
          ${this.showValue && this.labelPosition === 'tooltip' ? html`
            <div class="tooltip" style="left: ${tooltipLeft}">${formattedValue}</div>
          ` : ''}
        </div>

        ${this.showValue && this.labelPosition === 'below' ? html`
          <div class="value-below">${formattedValue}</div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('slider-underline', SliderUnderline);
