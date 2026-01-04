import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const AppModalStyles = css`
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease-out, background 0.3s ease-out;
  }

  .modal {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: var(--max-width, 400px);
    max-height: var(--max-height, 90vh);
    text-align: center;
    position: relative;
    overflow: auto;
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  .modal-header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    position: relative;
    min-height: 1.5rem;
  }

  .close-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.5rem;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    color: #666;
    z-index: 1;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    color: #333;
    background: rgba(0, 0, 0, 0.2);
  }

  .close-btn.standalone {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    background: rgba(150, 50, 50, 0.5);
    color: #000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 10;
  }

  .close-btn.standalone:hover {
    background: #f8f9fa;
    transform: scale(1.1);
  }

  .modal-body {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: #333;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }

  button.confirm {
    background: #4caf50;
    color: white;
  }

  button.confirm:hover {
    background: #45a047;
  }

  button.cancel {
    background: #f44336;
    color: white;
  }

  button.cancel:hover {
    background: #e53935;
  }
`;

// Simple ID generator (can be overridden via idGenerator property)
function generateDefaultId(prefix = 'modal') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export class AppModal extends LitElement {
  static properties = {
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    maxWidth: { type: String, reflect: true },
    maxHeight: { type: String, reflect: true },
    showHeader: { type: Boolean, reflect: true },
    showFooter: { type: Boolean, reflect: true },
    contentElementId: { type: String },
    contentElementType: { type: String },
    modalId: { type: String },
    // Injectable dependencies
    logger: { type: Object, attribute: false },
    modalRegistry: { type: Object, attribute: false },
    idGenerator: { type: Object, attribute: false }
  };

  static styles = AppModalStyles;

  constructor() {
    super();
    this.title = 'Modal Title';
    this.message = 'Modal message';
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

    // Injectable dependencies
    this.logger = null;
    this.modalRegistry = null;
    this.idGenerator = null;

    this.button1Action = () => {};
    this.button2Action = () => {};
    this.button3Action = () => {};
    this._pendingContent = null;

    this._handleAction1 = this._handleButton1.bind(this);
    this._handleAction2 = this._handleButton2.bind(this);
    this._handleAction3 = this._handleButton3.bind(this);
    this._handleCloseConfirmed = this._handleCloseConfirmed.bind(this);
    this._handleCloseCancelled = this._handleCloseCancelled.bind(this);
  }

  _log(level, ...args) {
    this.logger?.[level]?.(...args);
  }

  _generateId(prefix) {
    if (this.idGenerator && typeof this.idGenerator === 'function') {
      return this.idGenerator(prefix);
    }
    return generateDefaultId(prefix);
  }

  connectedCallback() {
    super.connectedCallback();

    // Generate modalId if not set
    if (!this.modalId) {
      this.modalId = this._generateId('modal');
    }

    requestAnimationFrame(() => {
      const modal = this.shadowRoot.querySelector('.modal');
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

    this._outsideClickHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const modalContent = this.shadowRoot.querySelector('.modal');
      const modalCloseBtn = this.shadowRoot.querySelector('#modal-close-btn');
      const path = e.composedPath();

      if (path.includes(modalCloseBtn)) {
        this._requestClose();
        return;
      }
      if (path.includes(modalContent)) {
        return;
      }
    };

    this._escListener = (e) => {
      if (e.key === 'Escape') {
        this._requestClose();
      }
    };
    window.addEventListener('keydown', this._escListener);
    document.addEventListener('modal-close-confirmed', this._handleCloseConfirmed);
    document.addEventListener('modal-close-cancelled', this._handleCloseCancelled);

    this._globalCloseHandler = (e) => {
      const { modalId, target } = e.detail || {};
      this._log('log', '[AppModal] globalCloseHandler:', {
        myModalId: this.modalId,
        eventModalId: modalId,
        target,
        shouldClose: target === 'all' || modalId === this.modalId
      });

      if (target === 'all' || modalId === this.modalId) {
        this._log('log', '[AppModal] Closing modal:', this.modalId);
        this.close();
      }
    };
    document.addEventListener('close-modal', this._globalCloseHandler);

    this._cardSaveSuccessHandler = (e) => {
      this._log('log', '[AppModal] Received card-save-success:', {
        modalId: this.modalId,
        contentElementId: this.contentElementId,
        eventDetail: e.detail
      });

      const eventCardId = e.detail?.cardId;
      const sourceElement = e.detail?.sourceElement;
      const isNewCard = e.detail?.isNewCard;
      const modalContent = this.shadowRoot.querySelector('.modal-body');

      if (modalContent) {
        const isSourceInsideModal = sourceElement && modalContent.contains(sourceElement);
        const eventTarget = e.target;
        const isTargetInsideModal = eventTarget && modalContent.contains(eventTarget);
        const cardInModal = modalContent.querySelector(`[data-id="${eventCardId}"]`) ||
                           modalContent.querySelector(`#${eventCardId}`) ||
                           modalContent.querySelector(`[cardid="${eventCardId}"]`) ||
                           modalContent.querySelector(`[id="${eventCardId}"]`);
        const idMatches = this.contentElementId && eventCardId &&
                         (this.contentElementId === eventCardId ||
                          this.contentElementId.includes(eventCardId) ||
                          eventCardId.includes(this.contentElementId));
        const contentElement = modalContent.querySelector(this.contentElementType || '*');
        const isSameElement = (sourceElement && contentElement === sourceElement) ||
                             (eventTarget && contentElement === eventTarget);
        const isNewCardInModal = isNewCard && this.contentElementId?.includes('temp_') &&
                                (isSourceInsideModal || isTargetInsideModal || isSameElement);

        const isFromModalContent = isSourceInsideModal || isTargetInsideModal || cardInModal ||
                                  idMatches || isSameElement || isNewCardInModal;

        if (isFromModalContent) {
          this._log('log', '[AppModal] Auto-closing after successful save');
          setTimeout(() => {
            this.close();
          }, 1500);
        }
      }
    };
    document.addEventListener('card-save-success', this._cardSaveSuccessHandler);

    // Register with modal registry if provided
    this.modalRegistry?.register?.(this.modalId, this);
  }

  disconnectedCallback() {
    this._log('log', '[AppModal] disconnectedCallback - Modal being removed:', this.modalId);

    super.disconnectedCallback();
    this.removeEventListener('click', this._outsideClickHandler);
    window.removeEventListener('keydown', this._escListener);
    document.removeEventListener('modal-close-confirmed', this._handleCloseConfirmed);
    document.removeEventListener('modal-close-cancelled', this._handleCloseCancelled);
    document.removeEventListener('close-modal', this._globalCloseHandler);
    document.removeEventListener('card-save-success', this._cardSaveSuccessHandler);

    // Unregister from modal registry if provided
    this.modalRegistry?.unregister?.(this.modalId);

    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }

    if (this._idObserver) {
      this._idObserver.disconnect();
      this._idObserver = null;
    }

    this._contentElement = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('maxWidth') || changedProperties.has('maxHeight')) {
      this.style.setProperty('--max-width', this.maxWidth);
      this.style.setProperty('--max-height', this.maxHeight);
    }
  }

  _handleButton1() {
    this._log('log', '[AppModal] Button1 clicked', { modalId: this.modalId });
    const result = this.button1Action();
    this.dispatchEvent(new CustomEvent('modal-action1', {
      bubbles: true,
      composed: true,
      detail: { contentElementId: this.contentElementId, contentElementType: this.contentElementType }
    }));
    if (result !== false) {
      this.remove();
    }
  }

  _handleButton2() {
    const result = this.button2Action();
    this.dispatchEvent(new CustomEvent('modal-action2', {
      bubbles: true,
      composed: true,
      detail: { contentElementId: this.contentElementId, contentElementType: this.contentElementType }
    }));
    if (result !== false) {
      this.remove();
    }
  }

  _handleButton3() {
    const result = this.button3Action();
    this.dispatchEvent(new CustomEvent('modal-action3', {
      bubbles: true,
      composed: true,
      detail: { contentElementId: this.contentElementId, contentElementType: this.contentElementType }
    }));
    if (result !== false) {
      this.remove();
    }
  }

  _requestClose() {
    this._log('log', '[AppModal] Requesting close');

    document.dispatchEvent(new CustomEvent('modal-closed-requested', {
      bubbles: true,
      composed: true,
      detail: {
        contentElementId: this.contentElementId,
        contentElementType: this.contentElementType,
        modalId: this.modalId
      }
    }));

    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }
    this._closeTimeout = setTimeout(() => {
      this._log('log', '[AppModal] Fallback close triggered');
      this.close();
    }, 200);
  }

  _handleCloseConfirmed(e) {
    const { modalId, contentElementId } = e.detail || {};

    if (modalId && modalId !== this.modalId) {
      return;
    }

    if (contentElementId && this.contentElementId && contentElementId !== this.contentElementId) {
      return;
    }

    this._log('log', `[AppModal] ${this.modalId} processing close-confirmed`);
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }
    this.close();
  }

  _handleCloseCancelled(e) {
    const { modalId } = e.detail || {};
    if (modalId && modalId !== this.modalId) {
      return;
    }

    this._log('log', `[AppModal] ${this.modalId} processing close-cancelled`);
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }
  }

  close() {
    this._log('log', '[AppModal] close() called for:', this.modalId);

    const modal = this.shadowRoot.querySelector('.modal');
    if (modal) {
      modal.style.opacity = '0';
    }
    this.style.opacity = '0';
    this.style.background = 'rgba(0, 0, 0, 0)';
    setTimeout(() => {
      this._log('log', '[AppModal] Removing from DOM:', this.modalId);
      this.remove();
      this.dispatchEvent(new CustomEvent('modal-closed-requested', {
        bubbles: true,
        composed: true,
        detail: {
          contentElementId: this.contentElementId,
          contentElementType: this.contentElementType,
          modalId: this.modalId
        }
      }));
    }, 300);
  }

  setContent(element) {
    const applyContent = () => {
      const modal = this.shadowRoot?.querySelector('.modal');
      const body = modal?.querySelector('.modal-body');
      if (!modal || !body) return false;
      body.innerHTML = '';
      body.appendChild(element);
      this.contentElementId = element.id || element.cardId || '';
      this.contentElementType = element.tagName.toLowerCase();

      this._contentElement = element;
      this._observeContentElementId();

      this._log('log', '[AppModal] setContent:', {
        elementId: element.id,
        contentElementId: this.contentElementId,
        contentElementType: this.contentElementType
      });
      return true;
    };

    if (!applyContent()) {
      this._pendingContent = element;
      requestAnimationFrame(() => applyContent());
    }
  }

  _observeContentElementId() {
    if (!this._contentElement) return;

    if (this._idObserver) {
      this._idObserver.disconnect();
    }

    this._idObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            (mutation.attributeName === 'id' || mutation.attributeName === 'cardid')) {
          const newId = this._contentElement.id || this._contentElement.cardId || '';
          if (newId && newId !== this.contentElementId) {
            this._log('log', '[AppModal] Updating contentElementId:', {
              oldId: this.contentElementId,
              newId: newId
            });
            this.contentElementId = newId;
          }
        }
      });
    });

    this._idObserver.observe(this._contentElement, {
      attributes: true,
      attributeFilter: ['id', 'cardid']
    });
  }

  render() {
    return html`
      <div class="modal">
        ${this.showHeader ? html`
          <div class="modal-header">
            ${this.title}
            <button id="modal-close-btn" class="close-btn" @click=${() => this._requestClose()}>&times;</button>
          </div>
        ` : html`
          <button id="modal-close-btn" class="close-btn standalone" @click=${() => this._requestClose()}>&times;</button>
        `}
        <div class="modal-body">
          ${this.message ? html`<div class="modal-message">${unsafeHTML(this.message)}</div>` : ''}
          <slot></slot>
        </div>
        ${this.showFooter ? html`
          <div class="modal-footer">
            ${this.button1Text ? html`
              <button class="confirm" style="${this.button1Css}" @click=${this._handleAction1}>${this.button1Text}</button>
            ` : ''}
            ${this.button2Text ? html`
              <button class="cancel" style="${this.button2Css}" @click=${this._handleAction2}>${this.button2Text}</button>
            ` : ''}
            ${this.button3Text ? html`
              <button style="${this.button3Css}" @click=${this._handleAction3}>${this.button3Text}</button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('app-modal', AppModal);

/**
 * Helper function to show a modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.message - Modal message (supports HTML)
 * @param {string} options.maxWidth - Max width (default: '400px')
 * @param {string} options.maxHeight - Max height (default: '90vh')
 * @param {string} options.button1Text - First button text
 * @param {string} options.button2Text - Second button text
 * @param {string} options.button3Text - Third button text
 * @param {string} options.button1Css - First button CSS
 * @param {string} options.button2Css - Second button CSS
 * @param {string} options.button3Css - Third button CSS
 * @param {Function} options.button1Action - First button action
 * @param {Function} options.button2Action - Second button action
 * @param {Function} options.button3Action - Third button action
 * @param {boolean} options.showHeader - Show header (default: true)
 * @param {boolean} options.showFooter - Show footer (default: true)
 * @param {HTMLElement} options.contentElement - Element to display as content
 * @param {Object} options.logger - Optional logger object
 * @param {Object} options.modalRegistry - Optional modal registry
 * @param {Function} options.idGenerator - Optional ID generator function
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

  // Inject dependencies if provided
  if (options.logger) {
    modal.logger = options.logger;
  }
  if (options.modalRegistry) {
    modal.modalRegistry = options.modalRegistry;
  }
  if (options.idGenerator) {
    modal.idGenerator = options.idGenerator;
  }

  document.body.appendChild(modal);

  if (options.contentElement) {
    modal.setContent(options.contentElement);
  }

  return modal;
}
