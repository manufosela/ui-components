import { LitElement, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { appModalStyles } from './app-modal.styles.js';

function generateDefaultId(prefix = 'modal') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * A feature-rich modal component built on native `<dialog>`.
 *
 * Supports both programmatic usage via showModal() and declarative usage with the open attribute.
 * Fully themeable via CSS custom properties with design system token fallbacks.
 * Uses native `<dialog>` for built-in focus trap, aria-modal, Escape handling, and top-layer.
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
    interceptClose: { type: Boolean, attribute: 'intercept-close' },
    fullHeight: { type: Boolean, attribute: 'full-height', reflect: true },
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.maxWidth = '400px';
    this.maxHeight = '90vh';
    this.showHeader = true;
    this.showFooter = true;
    this.contentElementId = '';
    this.contentElementType = '';
    this.modalId = '';
    this.button1Text = '';
    this.button2Text = '';
    this.button3Text = '';
    this.button1Css = '';
    this.button2Css = '';
    this.button3Css = '';
    this.button1Action = () => {};
    this.button2Action = () => {};
    this.button3Action = () => {};
    this.interceptClose = false;
    this.fullHeight = false;

    this._programmaticMode = false;
    this._pendingContent = null;
    this._closeTimeout = null;
    this._boundGlobalCloseHandler = this._handleGlobalClose.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.modalId) {
      this.modalId = generateDefaultId();
    }

    // Detect declarative mode: open attribute present before connect
    if (this.open !== undefined && this.open !== null) {
      this._programmaticMode = false;
    }

    document.addEventListener('close-modal', this._boundGlobalCloseHandler);

    // Auto-show in programmatic mode or if declarative with open=true
    if (this._programmaticMode || this.open) {
      this.updateComplete.then(() => this._showModal());
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('close-modal', this._boundGlobalCloseHandler);
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('maxWidth') || changedProperties.has('maxHeight')) {
      const dialog = this.shadowRoot?.querySelector('dialog');
      if (dialog) {
        dialog.style.setProperty('--max-width', this.maxWidth);
        dialog.style.setProperty('--max-height', this.maxHeight);
      }
    }

    // Handle declarative open/close
    if (changedProperties.has('open') && !this._programmaticMode) {
      if (this.open) {
        this._showModal();
      } else if (changedProperties.get('open') === true) {
        this._hideModal();
      }
    }
  }

  /** @private */
  get _dialog() {
    return this.shadowRoot?.querySelector('dialog');
  }

  _showModal() {
    const dialog = this._dialog;
    if (!dialog || dialog.open) return;
    dialog.showModal();

    // Inject any pending content
    if (this._pendingContent) {
      const body = dialog.querySelector('.modal-body');
      if (body) {
        body.insertBefore(this._pendingContent, body.firstChild);
        this._pendingContent = null;
      }
    }
  }

  _hideModal() {
    const dialog = this._dialog;
    if (!dialog?.open) return;
    dialog.close();
  }

  /**
   * Handle native dialog cancel event (Escape key).
   * We prevent the default close so we can route through _requestClose
   * which supports intercept-close.
   */
  _handleCancel(e) {
    e.preventDefault();
    this._requestClose();
  }

  /**
   * Handle clicks on the dialog backdrop.
   * A click on the <dialog> element itself (not its children) = backdrop click.
   */
  _handleDialogClick(e) {
    if (e.target === this._dialog) {
      this._requestClose();
    }
  }

  _requestClose() {
    this.dispatchEvent(
      new CustomEvent('modal-closed-requested', {
        detail: {
          modalId: this.modalId,
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
        },
        bubbles: true,
        composed: true,
      })
    );

    if (!this.interceptClose) {
      this._closeTimeout = setTimeout(() => this.close(), 200);
    }
  }

  _handleGlobalClose(e) {
    const { modalId, target } = e.detail ?? {};
    if (target === 'all' || modalId === this.modalId) {
      this.close();
    }
  }

  /**
   * Show the modal.
   * In declarative mode, sets the open attribute.
   * In programmatic mode, appends to body if needed.
   */
  show() {
    if (!this._programmaticMode) {
      this.open = true;
    } else {
      if (!this.isConnected) {
        document.body.appendChild(this);
      }
      this.updateComplete.then(() => this._showModal());
    }
  }

  /**
   * Close the modal.
   * In declarative mode, removes the open attribute.
   * In programmatic mode, removes element from DOM.
   */
  close() {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }

    this._hideModal();

    if (!this._programmaticMode) {
      this.open = false;
    } else {
      // Programmatic modals auto-destroy
      this.remove();
    }
  }

  /**
   * Inject a custom DOM element into the modal body.
   * @param {HTMLElement} element - The element to inject
   * @returns {boolean} false if not ready (content is queued)
   */
  setContent(element) {
    if (element.id) this.contentElementId = element.id;
    if (element.tagName) this.contentElementType = element.tagName.toLowerCase();

    const body = this.shadowRoot?.querySelector('.modal-body');
    if (body) {
      body.insertBefore(element, body.firstChild);
      return true;
    }
    this._pendingContent = element;
    return false;
  }

  _handleButton(index) {
    const action = this[`button${index}Action`];
    const result = action?.();

    this.dispatchEvent(
      new CustomEvent(`modal-action${index}`, {
        detail: {
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
        },
        bubbles: true,
        composed: true,
      })
    );

    if (result !== false) {
      this.close();
    }
  }

  _handleButton1() {
    this._handleButton(1);
  }
  _handleButton2() {
    this._handleButton(2);
  }
  _handleButton3() {
    this._handleButton(3);
  }

  render() {
    const closeButton = html`
      <button
        class="close-btn ${!this.showHeader ? 'standalone' : ''}"
        part="close-btn"
        aria-label="Close"
        @click="${this._requestClose}"
      >
        ✕
      </button>
    `;

    return html`
      <dialog
        part="container"
        style="--max-width: ${this.maxWidth}; --max-height: ${this.maxHeight}"
        @cancel="${this._handleCancel}"
        @click="${this._handleDialogClick}"
      >
        ${this.showHeader
          ? html`
              <div class="modal-header" part="header">
                <span>${this.title}</span>
                ${closeButton}
              </div>
            `
          : closeButton}
        <div class="modal-body" part="body">
          ${this.message ? html`<p>${unsafeHTML(this.message)}</p>` : nothing}
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
      </dialog>
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

  modal._programmaticMode = true;

  document.body.appendChild(modal);

  if (options.contentElement) {
    modal.setContent(options.contentElement);
  }

  return modal;
}
