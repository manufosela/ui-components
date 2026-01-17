import { LitElement, html, css } from 'lit';

/**
 * Range slider web component with underline track style.
 *
 * @element slider-underline
 * @fires change - Fired when value changes (on release)
 * @fires input - Fired continuously while dragging
 * @cssprop [--slider-track=#e5e7eb] - Track color
 * @cssprop [--slider-fill=#3b82f6] - Filled track color
 * @cssprop [--slider-thumb=#3b82f6] - Thumb color
 * @cssprop [--slider-thumb-border=none] - Thumb border
 * @cssprop [--slider-thumb-size=20px] - Thumb size
 * @cssprop [--slider-track-height=4px] - Track height
 * @cssprop [--slider-label-color=#1f2937] - Label text color
 * @cssprop [--slider-tick-color=#9ca3af] - Tick mark color
 * @cssprop [--slider-tick-value-color=#6b7280] - Tick value text color
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
    unit: { type: String },
    /** Slider width (e.g., '300px', '100%') */
    width: { type: String },
    /** Number of tick marks to show (0 = none) */
    showTicks: { type: Number, attribute: 'show-ticks' },
    /** Show values on tick marks */
    showTickValues: { type: Boolean, attribute: 'show-tick-values' },
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

    input[type='range'] {
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

    input[type='range']:focus {
      outline: none;
    }

    input[type='range']:focus-visible {
      outline: none;
    }

    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: var(--thumb-size);
      height: var(--thumb-size);
      border-radius: 50%;
      background: var(--slider-thumb, #3b82f6);
      border: var(--slider-thumb-border, none);
      cursor: grab;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
    }

    input[type='range']::-moz-range-thumb {
      width: var(--thumb-size);
      height: var(--thumb-size);
      border-radius: 50%;
      background: var(--slider-thumb, #3b82f6);
      border: var(--slider-thumb-border, none);
      cursor: grab;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
    }

    input[type='range']::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    }

    input[type='range']::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    }

    input[type='range']:active::-webkit-slider-thumb {
      cursor: grabbing;
      transform: scale(1.15);
    }

    input[type='range']:active::-moz-range-thumb {
      cursor: grabbing;
      transform: scale(1.15);
    }

    input[type='range']:focus-visible::-webkit-slider-thumb {
      outline: 2px solid var(--slider-fill, #3b82f6);
      outline-offset: 2px;
    }

    input[type='range']:focus-visible::-moz-range-thumb {
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
    input[type='range']:focus ~ .tooltip {
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
      color: var(--slider-tick-value-color, #6b7280);
      margin-top: 0.25rem;
    }

    .ticks-container {
      position: relative;
      width: 100%;
      height: 20px;
      margin-top: 0.25rem;
    }

    .tick {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateX(-50%);
    }

    .tick-mark {
      width: 1px;
      height: 8px;
      background: var(--slider-tick-color, #9ca3af);
    }

    .tick-mark.major {
      height: 12px;
      width: 2px;
    }

    .tick-value {
      font-size: 0.625rem;
      color: var(--slider-tick-value-color, #6b7280);
      margin-top: 2px;
      white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
      .fill,
      .tooltip,
      input[type='range']::-webkit-slider-thumb,
      input[type='range']::-moz-range-thumb {
        transition: none;
      }

      input[type='range']::-webkit-slider-thumb:hover,
      input[type='range']::-moz-range-thumb:hover,
      input[type='range']:active::-webkit-slider-thumb,
      input[type='range']:active::-moz-range-thumb {
        transform: none;
      }
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
    this.width = '';
    this.showTicks = 0;
    this.showTickValues = false;
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

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleChange(e) {
    this.value = Number(e.target.value);

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Set value programmatically */
  setValue(val) {
    const newValue = Math.min(this.max, Math.max(this.min, Number(val)));
    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
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

  _renderTicks() {
    if (!this.showTicks || this.showTicks < 2) return '';

    const ticks = [];
    const tickCount = this.showTicks;

    for (let i = 0; i <= tickCount; i++) {
      const percentage = (i / tickCount) * 100;
      const value = Math.round(this.min + (i / tickCount) * (this.max - this.min));
      const isMajor = i === 0 || i === tickCount || i === Math.floor(tickCount / 2);

      ticks.push(html`
        <div class="tick" style="left: ${percentage}%">
          <div class="tick-mark ${isMajor ? 'major' : ''}"></div>
          ${this.showTickValues
            ? html`<span class="tick-value">${this._formatValue(value)}</span>`
            : ''}
        </div>
      `);
    }

    return html`<div class="ticks-container">${ticks}</div>`;
  }

  render() {
    const percentage = this._percentage;
    const formattedValue = this._formatValue(this.value);
    const tooltipLeft = `calc(${percentage}% + (${(50 - percentage) * 0.2}px))`;
    const containerStyle = this.width ? `width: ${this.width}` : '';

    return html`
      <div class="container" style="${containerStyle}">
        ${this.label || (this.showValue && this.labelPosition === 'above')
          ? html`
              <div class="label-row">
                ${this.label ? html`<span class="label">${this.label}</span>` : html`<span></span>`}
                ${this.showValue && this.labelPosition === 'above'
                  ? html` <span class="value-display">${formattedValue}</span> `
                  : ''}
              </div>
            `
          : ''}

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
          ${this.showValue && this.labelPosition === 'tooltip'
            ? html` <div class="tooltip" style="left: ${tooltipLeft}">${formattedValue}</div> `
            : ''}
        </div>

        ${this._renderTicks()}
        ${this.showValue && this.labelPosition === 'below'
          ? html` <div class="value-below">${formattedValue}</div> `
          : ''}
      </div>
    `;
  }
}

customElements.define('slider-underline', SliderUnderline);
