import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { slideNotificationStyles } from './slide-notification.styles.js';

const ICONS = {
  error: '❌',
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️',
};

/**
 * A slide-in notification component from the right edge.
 * Fully themeable via CSS custom properties with design system token fallbacks.
 *
 * @element slide-notification
 * @fires slide-notification-shown - Fired when notification appears
 * @fires slide-notification-hidden - Fired when notification is hidden
 *
 * @attr {String} title - Notification title
 * @attr {String} message - Notification message (supports HTML)
 * @attr {Number} timetohide - Time in ms before auto-hide (default: 3000, 0 = persistent)
 * @attr {String} type - Type: 'info', 'success', 'warning', 'error'
 * @attr {String} background-color - Custom background color (overrides type color)
 * @attr {Boolean} persistent - If true, notification stays until clicked (same as timetohide=0)
 *
 * @csspart container - The notification container wrapper
 * @csspart title - The notification title element
 * @csspart content - The notification content wrapper (icon + message)
 * @csspart icon - The notification icon
 * @csspart message - The notification message element
 *
 * @cssprop [--notification-bg] - Background color (falls back to type-specific token)
 * @cssprop [--notification-text] - Text color (falls back to --text-inverse or #ffffff)
 * @cssprop [--notification-border-radius] - Border radius (falls back to --radius-md or 6px)
 * @cssprop [--notification-shadow] - Box shadow (falls back to --shadow-lg)
 * @cssprop [--notification-padding] - Padding (falls back to --spacing-md or 1rem)
 * @cssprop [--notification-min-width=300px] - Minimum width
 * @cssprop [--notification-max-width=400px] - Maximum width
 * @cssprop [--notification-min-height=80px] - Minimum height
 * @cssprop [--notification-bottom=20px] - Distance from bottom
 * @cssprop [--notification-z-index=10000] - Z-index
 *
 * @cssprop [--notification-title-size] - Title font size (falls back to --font-size-lg or 1.1rem)
 * @cssprop [--notification-title-weight=600] - Title font weight
 * @cssprop [--notification-message-size] - Message font size (falls back to --font-size-base or 1rem)
 * @cssprop [--notification-icon-size=1.2em] - Icon size
 *
 * @cssprop [--notification-animation-duration=0.5s] - Animation duration
 * @cssprop [--notification-slide-distance=100%] - Slide distance
 *
 * @cssprop [--notification-success-bg=#22c55e] - Success type background
 * @cssprop [--notification-error-bg=#dc3545] - Error type background
 * @cssprop [--notification-warning-bg=#ffc107] - Warning type background
 * @cssprop [--notification-info-bg=#17a2b8] - Info type background
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

  _getRole() {
    // Use alert for error/warning (more urgent), status for info/success
    return this.type === 'error' || this.type === 'warning' ? 'alert' : 'status';
  }

  _getAriaLive() {
    return this.type === 'error' || this.type === 'warning' ? 'assertive' : 'polite';
  }

  render() {
    const icon = ICONS[this.type] || ICONS.info;

    // Allow backgroundColor attribute to override CSS token
    if (this.backgroundColor) {
      this.style.setProperty('--notification-bg', this.backgroundColor);
    }

    return html`
      <div part="container" role="${this._getRole()}" aria-live="${this._getAriaLive()}">
        ${this.title ? html`<div class="title" part="title">${this.title}</div>` : ''}
        <div class="notification-content" part="content">
          <span class="icon" part="icon" aria-hidden="true">${icon}</span>
          <div class="message" part="message">${unsafeHTML(this.message)}</div>
        </div>
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
 * @param {string} options.backgroundColor - Custom background color (overrides type)
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
