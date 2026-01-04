import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const SlideNotificationStyles = css`
  :host {
    --width: 300px;
    --notification-bg: #17a2b8;
    --notification-color: white;
    --text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

    position: fixed;
    bottom: 20px;
    right: calc(-20px - var(--width));
    width: var(--width);
    min-height: 80px;
    background-color: var(--notification-bg) !important;
    color: var(--notification-color) !important;
    border-radius: 8px;
    border-left: 4px solid rgba(255, 255, 255, 0.3);
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    font-size: 1rem;
    font-weight: 500;
    opacity: 0;
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
    transform: translateX(0);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :host(.visible) {
    opacity: 1;
    transform: translateX(-320px);
  }

  .title {
    color: var(--notification-color) !important;
    font-weight: 600 !important;
    margin-bottom: 0.25rem;
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .message {
    color: var(--notification-color) !important;
    font-weight: 600 !important;
    text-shadow: var(--text-shadow) !important;
  }

  .icon {
    font-size: 1.2em;
    flex-shrink: 0;
    color: var(--notification-color) !important;
  }
`;

const DEFAULT_COLORS = {
  error: '#dc3545',
  success: '#2196F3',
  warning: '#ffc107',
  info: '#17a2b8'
};

const ICONS = {
  error: '❌',
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️'
};

export class SlideNotification extends LitElement {
  static properties = {
    title: { type: String },
    message: { type: String },
    timetohide: { type: Number },
    backgroundColor: { type: String },
    type: { type: String },
    logger: { type: Object, attribute: false }
  };

  static styles = SlideNotificationStyles;

  constructor(options) {
    super();
    this.title = options?.title || 'Notification';
    this.message = options?.message || 'This is a notification';
    this.timetohide = options?.timetohide || 3000;
    this.type = options?.type || 'info';
    this.backgroundColor = options?.backgroundColor || DEFAULT_COLORS[this.type] || DEFAULT_COLORS.info;
    this.logger = null;
  }

  _log(level, ...args) {
    this.logger?.[level]?.(...args);
  }

  connectedCallback() {
    super.connectedCallback();
    this._log('log', '[SlideNotification] Connected', { type: this.type, message: this.message });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.classList.add('visible');
      });

      setTimeout(() => {
        this.hideNotification();
      }, this.timetohide);
    });
  }

  hideNotification() {
    this._log('log', '[SlideNotification] Hiding notification');
    requestAnimationFrame(() => {
      const style = document.createElement('style');
      style.textContent = `:host { transform: translateX(320px) !important; }`;
      this.shadowRoot.appendChild(style);
    });
    setTimeout(() => this.remove(), 600);
  }

  render() {
    const textColor = this.type === 'warning' ? '#212529' : 'white';
    const icon = ICONS[this.type] || ICONS.info;

    this.style.setProperty('--notification-bg', this.backgroundColor);
    this.style.setProperty('--notification-color', textColor);
    this.style.setProperty('--text-shadow', this.type === 'warning' ? '1px 1px 2px rgba(0, 0, 0, 0.3)' : '1px 1px 2px rgba(0, 0, 0, 0.5)');

    return html`
      <div class="title">${this.title}</div>
      <div class="notification-content">
        <span class="icon">${icon}</span>
        <div class="message">${unsafeHTML(this.message)}</div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('slide-notification', SlideNotification);

/**
 * Helper function to show a slide notification
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {number} options.timetohide - Time in ms before auto-hide (default: 3000)
 * @param {string} options.type - Type: 'info' | 'success' | 'warning' | 'error'
 * @param {string} options.backgroundColor - Custom background color
 * @param {Object} options.logger - Optional logger object with log/warn/error methods
 * @returns {SlideNotification} The created notification element
 */
export function showSlideNotification(options = {}) {
  const notification = document.createElement('slide-notification');
  notification.title = options.title || '';
  notification.message = options.message || 'Notification';
  notification.timetohide = options.timetohide || 3000;
  notification.type = options.type || 'info';
  notification.backgroundColor = options.backgroundColor || DEFAULT_COLORS[notification.type] || DEFAULT_COLORS.info;

  if (options.logger) {
    notification.logger = options.logger;
  }

  document.body.appendChild(notification);
  return notification;
}
