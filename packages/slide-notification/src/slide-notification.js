import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { slideNotificationStyles } from './slide-notification.styles.js';

const DEFAULT_COLORS = {
  error: '#dc3545',
  success: '#22c55e',
  warning: '#ffc107',
  info: '#17a2b8',
};

const ICONS = {
  error: '❌',
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️',
};

/**
 * A slide-in notification component from the right edge.
 *
 * @element slide-notification
 * @fires slide-notification-shown - Fired when notification appears
 * @fires slide-notification-hidden - Fired when notification is hidden
 *
 * @attr {String} title - Notification title
 * @attr {String} message - Notification message (supports HTML)
 * @attr {Number} timetohide - Time in ms before auto-hide (default: 3000, 0 = persistent)
 * @attr {String} type - Type: 'info', 'success', 'warning', 'error'
 * @attr {String} background-color - Custom background color
 * @attr {Boolean} persistent - If true, notification stays until clicked (same as timetohide=0)
 *
 * @cssprop [--slide-notification-width=300px] - Width
 * @cssprop [--slide-notification-bg=#17a2b8] - Background color
 * @cssprop [--slide-notification-color=white] - Text color
 * @cssprop [--slide-notification-radius=8px] - Border radius
 * @cssprop [--slide-notification-z-index=10000] - Z-index
 */
export class SlideNotification extends LitElement {
  static styles = slideNotificationStyles;

  static properties = {
    title: { type: String },
    message: { type: String },
    timetohide: { type: Number },
    backgroundColor: { type: String, attribute: 'background-color' },
    type: { type: String, reflect: true },
    persistent: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.timetohide = 3000;
    this.type = 'info';
    this.backgroundColor = '';
    this.persistent = false;
    this._hideTimeout = null;
    this._isVisible = false;
    this._createdProgrammatically = false;
    this._removeOnHide = false;
  }

  connectedCallback() {
    super.connectedCallback();

    // Click to close for persistent notifications
    this.addEventListener('click', this._handleClick);

    // Only auto-show if created programmatically (via helper function)
    if (this._createdProgrammatically) {
      this._showNotification();
    }
  }

  _showNotification() {
    if (this._isVisible) return;
    this._isVisible = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.classList.remove('hiding');
        this.classList.add('visible');

        this.dispatchEvent(
          new CustomEvent('slide-notification-shown', {
            bubbles: true,
            composed: true,
          })
        );
      });

      // Auto-hide after timeout (unless persistent)
      const shouldAutoHide = !this.persistent && this.timetohide > 0;
      if (shouldAutoHide) {
        this._hideTimeout = setTimeout(() => {
          this.hide();
        }, this.timetohide);
      }
    });
  }

  _handleClick = () => {
    if (this.persistent || this.timetohide === 0) {
      this.hide();
    }
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }
    this.removeEventListener('click', this._handleClick);
  }

  hide() {
    if (!this._isVisible) return;
    this._isVisible = false;

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    this.classList.remove('visible');
    this.classList.add('hiding');

    this.dispatchEvent(
      new CustomEvent('slide-notification-hidden', {
        bubbles: true,
        composed: true,
      })
    );

    // Remove from DOM if created programmatically
    if (this._removeOnHide) {
      setTimeout(() => this.remove(), 600);
    }
  }

  show() {
    this._showNotification();
  }

  _getBackgroundColor() {
    if (this.backgroundColor) return this.backgroundColor;
    return DEFAULT_COLORS[this.type] || DEFAULT_COLORS.info;
  }

  _getTextColor() {
    return this.type === 'warning' ? '#212529' : 'white';
  }

  _getTextShadow() {
    return this.type === 'warning'
      ? '1px 1px 2px rgba(0, 0, 0, 0.3)'
      : '1px 1px 2px rgba(0, 0, 0, 0.5)';
  }

  render() {
    const icon = ICONS[this.type] || ICONS.info;
    const bgColor = this._getBackgroundColor();
    const textColor = this._getTextColor();
    const textShadow = this._getTextShadow();

    this.style.setProperty('--_bg', bgColor);
    this.style.setProperty('--_color', textColor);
    this.style.setProperty('--_text-shadow', textShadow);

    return html`
      ${this.title ? html`<div class="title">${this.title}</div>` : ''}
      <div class="notification-content">
        <span class="icon">${icon}</span>
        <div class="message">${unsafeHTML(this.message)}</div>
      </div>
    `;
  }
}

customElements.define('slide-notification', SlideNotification);

/**
 * Helper function to show a slide notification
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message (supports HTML)
 * @param {number} options.timetohide - Time in ms before auto-hide (default: 3000, 0 = persistent)
 * @param {string} options.type - Type: 'info' | 'success' | 'warning' | 'error'
 * @param {string} options.backgroundColor - Custom background color
 * @param {boolean} options.persistent - If true, stays until clicked
 * @returns {SlideNotification} The created notification element
 */
export function showSlideNotification(options = {}) {
  const notification = document.createElement('slide-notification');
  notification.title = options.title || '';
  notification.message = options.message || 'Notification';
  notification.timetohide = options.timetohide ?? 3000;
  notification.type = options.type || 'info';
  notification.persistent = options.persistent || false;
  if (options.backgroundColor) {
    notification.backgroundColor = options.backgroundColor;
  }

  // Mark as programmatically created so it auto-shows and auto-removes
  notification._createdProgrammatically = true;
  notification._removeOnHide = true;
  document.body.appendChild(notification);
  return notification;
}
