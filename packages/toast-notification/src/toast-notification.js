import { LitElement, html, nothing } from 'lit';
import { toastNotificationStyles } from './toast-notification.styles.js';

/**
 * Toast notification component for displaying brief messages.
 *
 * @element toast-notification
 * @fires toast-show - Fired when toast is shown
 * @fires toast-hide - Fired when toast is hidden
 * @fires toast-close - Fired when close button is clicked
 *
 * @attr {String} message - Toast message content
 * @attr {String} type - Toast type: 'success', 'error', 'warning', 'info', or empty for default
 * @attr {String} position - Position: 'top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'
 * @attr {Number} duration - Auto-hide duration in ms (0 to disable)
 * @attr {Boolean} visible - Whether the toast is visible
 * @attr {Boolean} closable - Show close button
 * @attr {Boolean} progress - Show progress bar
 *
 * @cssprop [--toast-z-index=9999] - Z-index
 * @cssprop [--toast-padding=12px 16px] - Padding
 * @cssprop [--toast-radius=8px] - Border radius
 * @cssprop [--toast-bg=#1f2937] - Background color
 * @cssprop [--toast-color=#f9fafb] - Text color
 * @cssprop [--toast-max-width=400px] - Maximum width
 */
export class ToastNotification extends LitElement {
  static styles = toastNotificationStyles;

  static properties = {
    message: { type: String },
    type: { type: String, reflect: true },
    position: { type: String, reflect: true },
    duration: { type: Number },
    visible: { type: Boolean, reflect: true },
    closable: { type: Boolean },
    progress: { type: Boolean },
  };

  constructor() {
    super();
    this.message = '';
    this.type = '';
    this.position = 'top-right';
    this.duration = 3000;
    this.visible = false;
    this.closable = true;
    this.progress = true;
    this._timeoutId = null;
    this._handleGlobalShow = this._handleGlobalShow.bind(this);
    this._handleGlobalHide = this._handleGlobalHide.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('toast-notification-show', this._handleGlobalShow);
    document.addEventListener('toast-notification-hide', this._handleGlobalHide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('toast-notification-show', this._handleGlobalShow);
    document.removeEventListener('toast-notification-hide', this._handleGlobalHide);
    this._clearTimeout();
  }

  _handleGlobalShow(e) {
    const { message, type, duration, position } = e.detail || {};
    if (message) this.message = message;
    if (type) this.type = type;
    if (duration !== undefined) this.duration = duration;
    if (position) this.position = position;
    this.show();
  }

  _handleGlobalHide() {
    this.hide();
  }

  show(message, options = {}) {
    if (message) this.message = message;
    if (options.type) this.type = options.type;
    if (options.duration !== undefined) this.duration = options.duration;
    if (options.position) this.position = options.position;

    this._clearTimeout();
    this.visible = true;

    this.dispatchEvent(
      new CustomEvent('toast-show', {
        detail: { message: this.message, type: this.type },
        bubbles: true,
        composed: true,
      })
    );

    if (this.duration > 0) {
      this._timeoutId = setTimeout(() => this.hide(), this.duration);
    }
  }

  hide() {
    this._clearTimeout();
    this.visible = false;

    this.dispatchEvent(
      new CustomEvent('toast-hide', {
        detail: { message: this.message, type: this.type },
        bubbles: true,
        composed: true,
      })
    );
  }

  _clearTimeout() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('toast-close', {
        detail: { message: this.message, type: this.type },
        bubbles: true,
        composed: true,
      })
    );
    this.hide();
  }

  _renderIcon() {
    switch (this.type) {
      case 'success':
        return html`
          <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        `;
      case 'error':
        return html`
          <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        `;
      case 'warning':
        return html`
          <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        `;
      case 'info':
        return html`
          <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        `;
      default:
        return nothing;
    }
  }

  render() {
    return html`
      <div class="toast ${this.type}" role="alert" aria-live="polite" aria-atomic="true">
        ${this._renderIcon()}
        <span class="message">${this.message}</span>
        ${this.closable
          ? html`
              <button
                class="close-btn"
                @click="${this._handleClose}"
                aria-label="Close notification"
              >
                ✕
              </button>
            `
          : nothing}
        ${this.progress && this.duration > 0 && this.visible
          ? html`
              <div class="progress">
                <div class="progress-bar" style="animation-duration: ${this.duration}ms"></div>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

customElements.define('toast-notification', ToastNotification);
