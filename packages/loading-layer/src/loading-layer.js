import { LitElement, html, svg } from 'lit';
import { loadingLayerStyles } from './loading-layer.styles.js';

/**
 * A loading overlay component with animated spinner.
 *
 * @element loading-layer
 * @fires loading-layer-shown - Fired when the loading layer is shown
 * @fires loading-layer-hidden - Fired when the loading layer is hidden
 *
 * @attr {Boolean} visible - Whether the loading layer is visible
 * @attr {String} message - Optional message to display below the spinner
 * @attr {Number} size - Size of the spinner in pixels (default: 60)
 * @attr {String} color - Color of the spinner (default: #3b82f6)
 * @attr {Number} stroke-width - Width of the spinner stroke (default: 4)
 * @attr {Number} timeout - Auto-hide timeout in seconds (0 = no auto-hide)
 *
 * @cssprop [--loading-layer-bg=rgba(0, 0, 0, 0.5] - Background color)
 * @cssprop [--loading-layer-z-index=9999] - Z-index
 * @cssprop [--loading-layer-transition=0.3s] - Transition duration
 * @cssprop [--loading-layer-spin-duration=1s] - Spin animation duration
 * @cssprop [--loading-layer-text-color=#fff] - Message text color
 */
export class LoadingLayer extends LitElement {
  static styles = loadingLayerStyles;

  static properties = {
    visible: { type: Boolean, reflect: true },
    message: { type: String },
    size: { type: Number },
    color: { type: String },
    strokeWidth: { type: Number, attribute: 'stroke-width' },
    timeout: { type: Number },
  };

  constructor() {
    super();
    this.visible = false;
    this.message = '';
    this.size = 60;
    this.color = '#3b82f6';
    this.strokeWidth = 4;
    this.timeout = 0;
    this._timeoutId = null;

    // Listen for global events
    this._handleShowEvent = this._handleShowEvent.bind(this);
    this._handleHideEvent = this._handleHideEvent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('loading-layer-show', this._handleShowEvent);
    document.addEventListener('loading-layer-hide', this._handleHideEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('loading-layer-show', this._handleShowEvent);
    document.removeEventListener('loading-layer-hide', this._handleHideEvent);
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
  }

  _handleShowEvent(e) {
    if (e.detail?.message) {
      this.message = e.detail.message;
    }
    this.show();
  }

  _handleHideEvent() {
    this.hide();
  }

  show() {
    this.visible = true;
    this.dispatchEvent(new CustomEvent('loading-layer-shown', { bubbles: true, composed: true }));

    if (this.timeout > 0) {
      this._timeoutId = setTimeout(() => this.hide(), this.timeout * 1000);
    }
  }

  hide() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this.visible = false;
    this.dispatchEvent(new CustomEvent('loading-layer-hidden', { bubbles: true, composed: true }));
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  _renderSpinner() {
    const center = this.size / 2;
    const radius = (this.size - this.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;

    return svg`
      <svg
        class="spinner"
        width="${this.size}"
        height="${this.size}"
        viewBox="0 0 ${this.size} ${this.size}"
        aria-hidden="true"
      >
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="none"
          stroke="${this.color}"
          stroke-width="${this.strokeWidth}"
          stroke-dasharray="${dashArray}"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  render() {
    const statusMessage = this.message || 'Loading';

    return html`
      <div
        class="loading-overlay"
        role="status"
        aria-live="polite"
        aria-busy="${this.visible}"
        aria-label="${statusMessage}"
        @click=${this._onOverlayClick}
      >
        <div class="spinner-container">
          ${this._renderSpinner()}
          ${this.message ? html`<div class="message">${this.message}</div>` : ''}
        </div>
      </div>
    `;
  }

  _onOverlayClick(e) {
    // Prevent clicks from propagating
    e.stopPropagation();
  }
}

customElements.define('loading-layer', LoadingLayer);
