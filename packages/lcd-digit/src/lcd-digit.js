import { LitElement, html } from 'lit';
import { lcdDigitStyles } from './lcd-digit.styles.js';

/**
 * 7-segment LCD digit display component.
 *
 * @element lcd-digit
 * @fires digit-changed - Fired when the digit value changes. Detail: { digit: string }
 *
 * @attr {String} digit - The digit to display (0-9, or '-' for minus)
 * @attr {Boolean} colon - Show colon after digit (for clock displays)
 * @attr {Boolean} colon-on - Whether colon is lit
 *
 * @cssprop --lcd-segment-length - Segment length (default: 30px)
 * @cssprop --lcd-segment-width - Segment width (default: 6px)
 * @cssprop --lcd-digit-on-color - Active segment color (default: #22c55e)
 * @cssprop --lcd-digit-off-color - Inactive segment color (default: rgba(0,0,0,0.1))
 * @cssprop --lcd-digit-glow-color - Glow effect color (default: rgba(34,197,94,0.5))
 */
export class LcdDigit extends LitElement {
  static styles = lcdDigitStyles;

  static properties = {
    digit: { type: String, reflect: true },
    colon: { type: Boolean },
    colonOn: { type: Boolean, attribute: 'colon-on' },
  };

  // 7-segment patterns: a, b, c, d, e, f, g
  // Each array represents which segments are ON for each digit
  static DIGIT_PATTERNS = {
    '0': [1, 1, 1, 1, 1, 1, 0],
    '1': [0, 1, 1, 0, 0, 0, 0],
    '2': [1, 1, 0, 1, 1, 0, 1],
    '3': [1, 1, 1, 1, 0, 0, 1],
    '4': [0, 1, 1, 0, 0, 1, 1],
    '5': [1, 0, 1, 1, 0, 1, 1],
    '6': [1, 0, 1, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 0, 0],
    '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1],
    '-': [0, 0, 0, 0, 0, 0, 1],
    ' ': [0, 0, 0, 0, 0, 0, 0],
  };

  constructor() {
    super();
    this.digit = '0';
    this.colon = false;
    this.colonOn = false;
  }

  _getSegments() {
    const pattern = LcdDigit.DIGIT_PATTERNS[this.digit] || LcdDigit.DIGIT_PATTERNS[' '];
    return pattern;
  }

  setDigit(value) {
    const strValue = String(value);
    if (strValue === this.digit) return;

    if (strValue in LcdDigit.DIGIT_PATTERNS) {
      this.digit = strValue;
      this._dispatchChange();
    }
  }

  increment() {
    const current = parseInt(this.digit, 10);
    if (isNaN(current)) return;

    const next = (current + 1) % 10;
    this.digit = String(next);
    this._dispatchChange();
  }

  decrement() {
    const current = parseInt(this.digit, 10);
    if (isNaN(current)) return;

    const next = (current - 1 + 10) % 10;
    this.digit = String(next);
    this._dispatchChange();
  }

  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('digit-changed', {
        detail: { digit: this.digit },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const segments = this._getSegments();
    const segmentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    return html`
      <div class="lcd-digit" role="img" aria-label="LCD digit ${this.digit}">
        ${segmentNames.map(
          (name, i) => html`
            <div
              class="segment segment-${name === 'a' || name === 'd' || name === 'g' ? 'h' : 'v'} segment-${name} ${segments[i] ? 'on' : ''}"
            ></div>
          `
        )}
        ${this.colon
          ? html`
              <div class="colon colon-top ${this.colonOn ? 'on' : ''}"></div>
              <div class="colon colon-bottom ${this.colonOn ? 'on' : ''}"></div>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('lcd-digit', LcdDigit);
