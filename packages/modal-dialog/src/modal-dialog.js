import { LitElement, html, nothing } from 'lit';
import { modalDialogStyles } from './modal-dialog.styles.js';

/**
 * Modal dialog component with header, body, and footer slots.
 *
 * @element modal-dialog
 * @fires modal-open - Fired when modal opens
 * @fires modal-close - Fired when modal closes
 * @fires modal-confirm - Fired when confirm action is triggered
 * @fires modal-cancel - Fired when cancel action is triggered
 *
 * @attr {Boolean} open - Whether the modal is open
 * @attr {String} title - Modal title
 * @attr {String} size - Modal size: 'small', 'medium', 'large', 'full', 'fullscreen'
 * @attr {String} width - Custom width (e.g., '50vw', '600px', '80%')
 * @attr {String} height - Custom height (e.g., '70vh', '400px', '80%')
 * @attr {Boolean} closable - Show close button (default: true)
 * @attr {Boolean} close-on-overlay - Close when clicking overlay (default: true)
 * @attr {Boolean} close-on-escape - Close on Escape key (default: true)
 *
 * @slot - Default slot for modal body content
 * @slot footer - Footer slot for action buttons
 *
 * @cssprop [--modal-z-index=9999] - Z-index
 * @cssprop [--modal-overlay-bg=rgba(0,0,0,0.5] - Overlay background)
 * @cssprop [--modal-bg=#fff] - Modal background
 * @cssprop [--modal-radius=12px] - Border radius
 * @cssprop [--modal-max-width=500px] - Maximum width
 */
export class ModalDialog extends LitElement {
  static styles = modalDialogStyles;

  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    size: { type: String, reflect: true },
    width: { type: String },
    height: { type: String },
    closable: { type: Boolean },
    closeOnOverlay: { type: Boolean, attribute: 'close-on-overlay' },
    closeOnEscape: { type: Boolean, attribute: 'close-on-escape' },
  };

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.size = 'medium';
    this.width = '';
    this.height = '';
    this.closable = true;
    this.closeOnOverlay = true;
    this.closeOnEscape = true;
    this._handleKeydown = this._handleKeydown.bind(this);
    this._previousActiveElement = null;
  }

  get _modalStyles() {
    const styles = [];
    if (this.width) {
      styles.push(`max-width: ${this.width}; width: ${this.width}`);
    }
    if (this.height) {
      styles.push(`height: ${this.height}`);
    }
    return styles.length ? styles.join('; ') : null;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeydown);
    this._restoreBodyScroll();
  }

  updated(changedProperties) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._previousActiveElement = document.activeElement;
        this._lockBodyScroll();
        this._dispatchOpen();
        // Focus first focusable element
        requestAnimationFrame(() => {
          const focusable = this.shadowRoot.querySelector('.close-btn, button, [tabindex="0"]');
          if (focusable) focusable.focus();
        });
      } else {
        this._restoreBodyScroll();
        if (this._previousActiveElement) {
          this._previousActiveElement.focus();
          this._previousActiveElement = null;
        }
      }
    }
  }

  _lockBodyScroll() {
    document.body.style.overflow = 'hidden';
  }

  _restoreBodyScroll() {
    document.body.style.overflow = '';
  }

  show() {
    if (this.open) return;
    this.open = true;
  }

  hide() {
    if (!this.open) return;
    this.open = false;
    this._dispatchClose();
  }

  confirm() {
    this.dispatchEvent(
      new CustomEvent('modal-confirm', {
        bubbles: true,
        composed: true,
      })
    );
    this.hide();
  }

  cancel() {
    this.dispatchEvent(
      new CustomEvent('modal-cancel', {
        bubbles: true,
        composed: true,
      })
    );
    this.hide();
  }

  _dispatchOpen() {
    this.dispatchEvent(
      new CustomEvent('modal-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _dispatchClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleKeydown(e) {
    if (!this.open) return;

    if (e.key === 'Escape' && this.closeOnEscape) {
      e.preventDefault();
      this.cancel();
    }

    // Simple focus trap
    if (e.key === 'Tab') {
      const modal = this.shadowRoot.querySelector('.modal');
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  _handleOverlayClick(e) {
    if (e.target === e.currentTarget && this.closeOnOverlay) {
      this.cancel();
    }
  }

  _handleCloseClick() {
    this.cancel();
  }

  render() {
    return html`
      <div class="overlay" @click="${this._handleOverlayClick}" role="presentation">
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="${this.title ? 'modal-title' : nothing}"
          style="${this._modalStyles || nothing}"
        >
          ${this.title || this.closable
            ? html`
                <div class="header">
                  ${this.title
                    ? html`<h2 class="title" id="modal-title">${this.title}</h2>`
                    : html`<span></span>`}
                  ${this.closable
                    ? html`
                        <button
                          class="close-btn"
                          @click="${this._handleCloseClick}"
                          aria-label="Close modal"
                        >
                          ✕
                        </button>
                      `
                    : nothing}
                </div>
              `
            : nothing}
          <div class="body">
            <slot></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('modal-dialog', ModalDialog);
