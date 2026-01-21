import { LitElement, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { appModalStyles } from './app-modal.styles.js';

function generateDefaultId(prefix = 'modal') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * A feature-rich modal component with configurable buttons and content.
 *
 * Supports both programmatic usage via showModal() and declarative usage with the open attribute.
 * Fully themeable via CSS custom properties with design system token fallbacks.
 *
 * @element app-modal
 * @fires modal-action1 - Fired when button 1 is clicked
 * @fires modal-action2 - Fired when button 2 is clicked
 * @fires modal-action3 - Fired when button 3 is clicked
 * @fires modal-closed-requested - Fired when modal close is requested (can be intercepted with intercept-close)
 *
 * @attr {Boolean} intercept-close - When true, modal won't auto-close on close request. Listen to modal-closed-requested and dispatch close-modal event to close manually.
 * @attr {Boolean} full-height - When true, modal content expands to fill the maxHeight
 * @attr {String} title - Modal title
 * @attr {String} message - Modal message (supports HTML)
 * @attr {String} max-width - Maximum width (default: 400px)
 * @attr {String} max-height - Maximum height (default: 90vh)
 * @attr {Boolean} show-header - Show header section (default: true)
 * @attr {Boolean} show-footer - Show footer section (default: true)
 * @attr {Boolean} open - Controls modal visibility in declarative mode. When present, modal won't auto-destroy on close.
 * @attr {String} button1-text - Text for button 1
 * @attr {String} button2-text - Text for button 2
 * @attr {String} button3-text - Text for button 3
 * @attr {String} button1-css - Custom CSS for button 1
 * @attr {String} button2-css - Custom CSS for button 2
 * @attr {String} button3-css - Custom CSS for button 3
 *
 * @slot - Default slot for modal body content
 *
 * @csspart container - The modal container element
 * @csspart header - The modal header element
 * @csspart body - The modal body element
 * @csspart footer - The modal footer element
 * @csspart close-btn - The close button
 * @csspart btn-primary - The primary action button (button1)
 * @csspart btn-secondary - The secondary action button (button2)
 * @csspart btn-tertiary - The tertiary action button (button3)
 *
 * @cssprop [--app-modal-z-index=1000] - Z-index of the modal overlay
 *
 * @cssprop [--modal-bg] - Modal background (falls back to --bg-primary or #ffffff)
 * @cssprop [--modal-text-color] - Modal text color (falls back to --text-primary or #333333)
 * @cssprop [--modal-border-radius] - Border radius (falls back to --radius-lg or 8px)
 * @cssprop [--modal-shadow] - Box shadow (falls back to --shadow-xl)
 * @cssprop [--modal-overlay-bg=rgba(0,0,0,0.6)] - Overlay background color
 * @cssprop [--modal-max-width=80vw] - Default max width
 * @cssprop [--modal-max-height=80vh] - Default max height
 *
 * @cssprop [--modal-header-bg] - Header background (falls back to --bg-secondary)
 * @cssprop [--modal-header-text] - Header text color (falls back to --text-primary)
 * @cssprop [--modal-header-padding] - Header padding (falls back to --spacing-md or 1rem)
 * @cssprop [--modal-header-font-size] - Header font size (falls back to --font-size-xl or 1.5rem)
 *
 * @cssprop [--modal-body-padding] - Body padding (falls back to --spacing-lg or 1.5rem)
 * @cssprop [--modal-body-color] - Body text color (falls back to --text-primary or #333333)
 *
 * @cssprop [--modal-footer-bg] - Footer background (falls back to --bg-secondary)
 * @cssprop [--modal-footer-padding] - Footer padding (falls back to --spacing-md or 1rem)
 * @cssprop [--modal-border-color] - Border color for header/footer (falls back to --border-default or #e0e0e0)
 *
 * @cssprop [--modal-close-bg] - Close button background (falls back to --bg-muted)
 * @cssprop [--modal-close-color] - Close button color (falls back to --text-secondary or #666666)
 * @cssprop [--modal-close-hover-bg] - Close button hover background
 * @cssprop [--modal-close-hover-color] - Close button hover color
 *
 * @cssprop [--modal-btn-primary-bg] - Primary button background (falls back to --brand-primary or #4caf50)
 * @cssprop [--modal-btn-primary-text] - Primary button text (falls back to --text-inverse or #ffffff)
 * @cssprop [--modal-btn-primary-hover-bg] - Primary button hover background
 *
 * @cssprop [--modal-btn-secondary-bg] - Secondary button background (falls back to --brand-danger or #f44336)
 * @cssprop [--modal-btn-secondary-text] - Secondary button text (falls back to --text-inverse or #ffffff)
 * @cssprop [--modal-btn-secondary-hover-bg] - Secondary button hover background
 *
 * @cssprop [--modal-btn-tertiary-bg] - Tertiary button background (falls back to --bg-muted or #e9ecef)
 * @cssprop [--modal-btn-tertiary-text] - Tertiary button text (falls back to --text-primary or #333333)
 * @cssprop [--modal-btn-tertiary-hover-bg] - Tertiary button hover background
 */
export class AppModal extends LitElement {
  static styles = appModalStyles;

  static properties = {
    title: { type: String },
    message: { type: String },
    maxWidth: { type: String, attribute: 'max-width', reflect: true },
    maxHeight: { type: String, attribute: 'max-height', reflect: true },
    showHeader: { type: Boolean, attribute: 'show-header', reflect: true },
    showFooter: { type: Boolean, attribute: 'show-footer', reflect: true },
    contentElementId: { type: String },
    contentElementType: { type: String },
    modalId: { type: String, attribute: 'modal-id' },
    button1Text: { type: String, attribute: 'button1-text' },
    button2Text: { type: String, attribute: 'button2-text' },
    button3Text: { type: String, attribute: 'button3-text' },
    button1Css: { type: String, attribute: 'button1-css' },
    button2Css: { type: String, attribute: 'button2-css' },
    button3Css: { type: String, attribute: 'button3-css' },
    open: { type: Boolean, reflect: true },
    interceptClose: { type: Boolean, attribute: 'intercept-close' },
    fullHeight: { type: Boolean, attribute: 'full-height', reflect: true },
  };

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.maxWidth = '400px';
    this.maxHeight = '90vh';
    this.button1Text = '';
    this.button2Text = '';
    this.button3Text = '';
    this.button1Css = '';
    this.button2Css = '';
    this.button3Css = '';
    this.showHeader = true;
    this.showFooter = true;
    this.contentElementId = '';
    this.contentElementType = '';
    this.modalId = '';
    this.interceptClose = false;
    this.fullHeight = false;
    // open is intentionally not initialized to detect declarative usage

    this.button1Action = () => {};
    this.button2Action = () => {};
    this.button3Action = () => {};
    this._pendingContent = null;
    this._declarativeMode = false;
    this._programmaticMode = false;

    this._handleKeydown = this._handleKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.modalId) {
      this.modalId = generateDefaultId('modal');
    }

    // Detect declarative mode: if 'open' attribute exists, open property was set, or NOT programmatic
    // Programmatic mode (via showModal()) auto-shows; declarative mode requires open attribute
    this._declarativeMode =
      this.hasAttribute('open') || this.open !== undefined || !this._programmaticMode;

    // In programmatic mode, auto-show; in declarative mode, respect the open property
    const shouldShow = this._programmaticMode || (this._declarativeMode && this.open);

    if (shouldShow) {
      this._showModal();
    } else {
      // Hide initially in declarative mode when open is false/undefined
      this.style.display = 'none';
    }

    window.addEventListener('keydown', this._handleKeydown);

    this._globalCloseHandler = (e) => {
      const { modalId, target } = e.detail || {};
      if (target === 'all' || modalId === this.modalId) {
        this.close();
      }
    };
    document.addEventListener('close-modal', this._globalCloseHandler);
  }

  _showModal() {
    this.style.display = '';
    requestAnimationFrame(() => {
      const modal = this.shadowRoot?.querySelector('.modal');
      if (modal) {
        modal.style.opacity = '1';
      }
      this.style.opacity = '1';
      this.style.background = 'rgba(0, 0, 0, 0.5)';

      if (this._pendingContent) {
        this.setContent(this._pendingContent);
        this._pendingContent = null;
      }
    });
  }

  _hideModal() {
    const modal = this.shadowRoot?.querySelector('.modal');
    if (modal) {
      modal.style.opacity = '0';
    }
    this.style.opacity = '0';
    this.style.background = 'rgba(0, 0, 0, 0)';

    setTimeout(() => {
      this.style.display = 'none';
    }, 300);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._handleKeydown);
    document.removeEventListener('close-modal', this._globalCloseHandler);

    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }

    this._contentElement = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('maxWidth') || changedProperties.has('maxHeight')) {
      this.style.setProperty('--max-width', this.maxWidth);
      this.style.setProperty('--max-height', this.maxHeight);
    }

    if (changedProperties.has('open') && this._declarativeMode) {
      if (this.open) {
        this._showModal();
      } else {
        this._hideModal();
      }
    }
  }

  _handleKeydown(e) {
    if (e.key === 'Escape') {
      this._requestClose();
    }
  }

  _handleButton1() {
    const result = this.button1Action();
    this.dispatchEvent(
      new CustomEvent('modal-action1', {
        bubbles: true,
        composed: true,
        detail: {
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
        },
      })
    );
    if (result !== false) {
      this.close();
    }
  }

  _handleButton2() {
    const result = this.button2Action();
    this.dispatchEvent(
      new CustomEvent('modal-action2', {
        bubbles: true,
        composed: true,
        detail: {
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
        },
      })
    );
    if (result !== false) {
      this.close();
    }
  }

  _handleButton3() {
    const result = this.button3Action();
    this.dispatchEvent(
      new CustomEvent('modal-action3', {
        bubbles: true,
        composed: true,
        detail: {
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
        },
      })
    );
    if (result !== false) {
      this.close();
    }
  }

  _handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      this._requestClose();
    }
  }

  _requestClose() {
    this.dispatchEvent(
      new CustomEvent('modal-closed-requested', {
        bubbles: true,
        composed: true,
        detail: {
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
          modalId: this.modalId,
        },
      })
    );

    // If intercept-close is enabled, don't auto-close - let external code decide
    // External code should dispatch 'close-modal' event with { detail: { modalId } } to close
    if (this.interceptClose) {
      return;
    }

    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }
    this._closeTimeout = setTimeout(() => {
      this.close();
    }, 200);
  }

  show() {
    if (this._declarativeMode) {
      this.open = true;
    } else {
      document.body.appendChild(this);
    }
  }

  close() {
    if (this._declarativeMode) {
      // In declarative mode, just hide the modal (don't destroy)
      this.open = false;
    } else {
      // Legacy behavior: destroy the modal
      const modal = this.shadowRoot?.querySelector('.modal');
      if (modal) {
        modal.style.opacity = '0';
      }
      this.style.opacity = '0';
      this.style.background = 'rgba(0, 0, 0, 0)';

      setTimeout(() => {
        this.remove();
      }, 300);
    }
  }

  setContent(element) {
    const applyContent = () => {
      const modal = this.shadowRoot?.querySelector('.modal');
      const body = modal?.querySelector('.modal-body');
      if (!modal || !body) return false;

      // Remove existing content except slot
      const slot = body.querySelector('slot');
      while (body.firstChild) {
        if (body.firstChild === slot) break;
        body.removeChild(body.firstChild);
      }
      body.insertBefore(element, slot);

      this.contentElementId = element.id || '';
      this.contentElementType = element.tagName.toLowerCase();
      this._contentElement = element;
      return true;
    };

    if (!applyContent()) {
      this._pendingContent = element;
      requestAnimationFrame(() => applyContent());
    }
  }

  render() {
    return html`
      <div class="modal" part="container" @click="${(e) => e.stopPropagation()}">
        ${this.showHeader
          ? html`
              <div class="modal-header" part="header">
                ${this.title}
                <button class="close-btn" part="close-btn" @click="${this._requestClose}">
                  &times;
                </button>
              </div>
            `
          : html`
              <button class="close-btn standalone" part="close-btn" @click="${this._requestClose}">
                &times;
              </button>
            `}
        <div class="modal-body" part="body">
          ${this.message
            ? html`<div class="modal-message">${unsafeHTML(this.message)}</div>`
            : nothing}
          <slot></slot>
        </div>
        ${this.showFooter
          ? html`
              <div class="modal-footer" part="footer">
                ${this.button1Text
                  ? html`
                      <button
                        class="confirm"
                        part="btn-primary"
                        style="${this.button1Css}"
                        @click="${this._handleButton1}"
                      >
                        ${this.button1Text}
                      </button>
                    `
                  : nothing}
                ${this.button2Text
                  ? html`
                      <button
                        class="cancel"
                        part="btn-secondary"
                        style="${this.button2Css}"
                        @click="${this._handleButton2}"
                      >
                        ${this.button2Text}
                      </button>
                    `
                  : nothing}
                ${this.button3Text
                  ? html`
                      <button
                        part="btn-tertiary"
                        style="${this.button3Css}"
                        @click="${this._handleButton3}"
                      >
                        ${this.button3Text}
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

customElements.define('app-modal', AppModal);

/**
 * Helper function to show a modal
 * @param {Object} options - Modal options
 * @returns {AppModal} The created modal element
 */
export function showModal(options = {}) {
  const modal = document.createElement('app-modal');
  modal.title = options.title || '';
  modal.message = options.message || '';
  modal.maxWidth = options.maxWidth || '400px';
  modal.maxHeight = options.maxHeight || '90vh';
  modal.button1Text = options.button1Text || '';
  modal.button2Text = options.button2Text || '';
  modal.button3Text = options.button3Text || '';
  modal.button1Css = options.button1Css || '';
  modal.button2Css = options.button2Css || '';
  modal.button3Css = options.button3Css || '';
  modal.button1Action = options.button1Action || (() => {});
  modal.button2Action = options.button2Action || (() => {});
  modal.button3Action = options.button3Action || (() => {});
  modal.showHeader = options.showHeader ?? true;
  modal.showFooter = options.showFooter ?? true;
  modal.interceptClose = options.interceptClose ?? false;
  modal.fullHeight = options.fullHeight ?? false;

  // Mark as programmatic so it auto-shows on append
  modal._programmaticMode = true;

  document.body.appendChild(modal);

  if (options.contentElement) {
    modal.setContent(options.contentElement);
  }

  return modal;
}
