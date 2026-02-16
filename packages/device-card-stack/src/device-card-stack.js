import { LitElement, html, css } from 'lit';

/**
 * Accordion-style card stack with 3D perspective and image preview panel.
 *
 * Cards are provided via slotted elements with `slot="card"` and expand on click
 * to reveal their content. A preview panel on the right displays the image
 * associated with the active card. On mobile viewports the preview panel is
 * hidden and images are shown inline within each card.
 *
 * @element device-card-stack
 *
 * @attr {Number} active-index - Index of the currently active card (default: 0)
 * @attr {Number} mobile-breakpoint - Viewport width in px below which mobile layout is used (default: 768)
 * @attr {Number} stack-rotation - Rotation angle in degrees applied to inactive cards (default: 3)
 * @attr {Number} transition-duration - Transition duration in milliseconds (default: 500)
 *
 * @cssprop [--dcs-border-radius=20px] - Border radius of the outer wrapper
 * @cssprop [--dcs-height=700px] - Height of the component in desktop mode
 * @cssprop [--dcs-preview-bg=#000] - Background color of the preview panel
 * @cssprop [--dcs-text-color=#fff] - Text color for the card body title
 * @cssprop [--dcs-title-size=3.5rem] - Font size of the expanded card title
 *
 * @slot card - Card elements with data-title, data-color, data-image, and data-num attributes
 *
 * @fires card-activated - Fired when a card is activated. detail: { index, title }
 */
export class DeviceCardStack extends LitElement {
  static properties = {
    activeIndex: { type: Number, attribute: 'active-index' },
    mobileBreakpoint: { type: Number, attribute: 'mobile-breakpoint' },
    stackRotation: { type: Number, attribute: 'stack-rotation' },
    transitionDuration: { type: Number, attribute: 'transition-duration' },
    _cards: { type: Array, state: true },
    _isMobile: { type: Boolean, state: true },
    _reducedMotion: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
      --dcs-border-radius: 20px;
      --dcs-height: 700px;
      --dcs-preview-bg: #000;
      --dcs-text-color: #fff;
      --dcs-title-size: 3.5rem;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .wrapper {
      display: flex;
      width: 100%;
      height: var(--dcs-height);
      border-radius: var(--dcs-border-radius);
      overflow: hidden;
    }

    /* Stack panel (left) */
    .stack-panel {
      width: 50%;
      display: flex;
      flex-direction: column;
      perspective: 1200px;
      perspective-origin: 50% 30%;
    }

    /* Individual card */
    .card {
      position: relative;
      padding: 0 40px;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition-property: transform, box-shadow, flex-grow;
      transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-style: preserve-3d;
      will-change: transform, box-shadow;
      height: 70px;
      flex-shrink: 0;
      flex-grow: 0;
    }

    .card[data-active] {
      flex-grow: 1;
      height: auto;
      flex-shrink: 1;
      padding: 20px 40px;
      transform: translateZ(30px) scale(1.01);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
    }

    .card:not([data-active]) {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Card header */
    .card-header {
      padding: 24px 0;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .card-num {
      margin-right: 15px;
      font-weight: 400;
      opacity: 0.8;
    }

    /* Card body - only visible when active */
    .card-body {
      margin-top: 40px;
      max-width: 500px;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      transition:
        opacity 0.5s ease 0.15s,
        transform 0.5s ease 0.15s;
    }

    .card[data-active] .card-body {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .card-body-title {
      font-size: var(--dcs-title-size);
      line-height: 1.1;
      margin: 0 0 24px;
      color: var(--dcs-text-color);
      font-weight: 400;
    }

    /* Mobile inline image */
    .card-mobile-image {
      display: none;
    }

    :host([data-mobile]) .card[data-active] .card-mobile-image {
      display: block;
      width: 100%;
      margin-bottom: 20px;
    }

    :host([data-mobile]) .card[data-active] .card-mobile-image img {
      width: 100%;
      max-height: 200px;
      object-fit: contain;
      border-radius: 8px;
    }

    /* Preview panel (right) */
    .preview-panel {
      width: 50%;
      background-color: var(--dcs-preview-bg);
      position: relative;
      overflow: hidden;
      border-radius: 0 var(--dcs-border-radius) var(--dcs-border-radius) 0;
    }

    .preview-image {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.92);
      transition:
        opacity 0.4s ease,
        transform 0.4s ease;
      pointer-events: none;
    }

    .preview-image[data-visible] {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    .preview-image img {
      max-width: 80%;
      max-height: 80%;
      object-fit: contain;
    }

    /* Mobile mode */
    :host([data-mobile]) .wrapper {
      flex-direction: column;
      height: auto;
      min-height: auto;
    }

    :host([data-mobile]) .stack-panel {
      width: 100%;
      perspective: 800px;
    }

    :host([data-mobile]) .preview-panel {
      display: none;
    }

    :host([data-mobile]) .card {
      padding: 0 20px;
    }

    :host([data-mobile]) .card[data-active] {
      padding: 16px 20px;
    }

    :host([data-mobile]) .card-body {
      margin-top: 16px;
    }

    :host([data-mobile]) .card-body-title {
      font-size: 2rem;
    }

    :host([data-mobile]) .card-mobile-image img {
      max-height: 160px;
    }

    /* Focus visible */
    .card:focus-visible {
      outline: 2px solid #fff;
      outline-offset: -2px;
      z-index: 10;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none !important;
        transform: none !important;
      }

      .card[data-active] {
        transform: none !important;
      }

      .card-body {
        transition: none !important;
      }

      .preview-image {
        transition: none !important;
        transform: none !important;
      }
    }

    /* Slotted content styling */
    ::slotted([slot^='card']) {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      line-height: 1.5;
      font-weight: 300;
    }
  `;

  constructor() {
    super();
    this.activeIndex = 0;
    this.mobileBreakpoint = 768;
    this.stackRotation = 3;
    this.transitionDuration = 500;
    this._cards = [];
    this._isMobile = false;
    this._reducedMotion = false;
    this._resizeHandler = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._checkMobile();
    this._resizeHandler = this._onResize.bind(this);
    window.addEventListener('resize', this._resizeHandler, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  }

  firstUpdated() {
    this._extractCards();
    this._applyTransitionDuration();
  }

  _extractCards() {
    const slottedElements = this.querySelectorAll('[slot="card"]');
    const cards = [];
    slottedElements.forEach((el, i) => {
      const slotName = `card-${i}`;
      el.setAttribute('slot', slotName);
      cards.push({
        index: i,
        slotName,
        num: el.dataset.num || String(i + 1).padStart(2, '0'),
        title: el.dataset.title || '',
        image: el.dataset.image || '',
        imageWebp: el.dataset.imageWebp || '',
        color: el.dataset.color || '#4a4a4a',
      });
    });
    this._cards = cards;
  }

  _applyTransitionDuration() {
    const duration = `${this.transitionDuration}ms`;
    this.style.setProperty('--_transition-duration', duration);
  }

  _checkMobile() {
    this._isMobile = window.innerWidth <= this.mobileBreakpoint;
    if (this._isMobile) {
      this.setAttribute('data-mobile', '');
    } else {
      this.removeAttribute('data-mobile');
    }
  }

  _onResize() {
    this._checkMobile();
  }

  _activateCard(index) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;
  }

  _onCardKeydown(e) {
    const total = this._cards.length;
    let handled = true;

    switch (e.key) {
      case 'ArrowDown':
        this._activateCard((this.activeIndex + 1) % total);
        break;
      case 'ArrowUp':
        this._activateCard((this.activeIndex - 1 + total) % total);
        break;
      case 'Home':
        this._activateCard(0);
        break;
      case 'End':
        this._activateCard(total - 1);
        break;
      case 'Enter':
      case ' ':
        // Already handled by click on the tab role
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      this._focusActiveTab();
    }
  }

  _focusActiveTab() {
    requestAnimationFrame(() => {
      const tab = this.shadowRoot.querySelector(`.card[data-index="${this.activeIndex}"]`);
      if (tab) tab.focus();
    });
  }

  _getCardTransform(index) {
    if (this._reducedMotion) return 'none';

    const active = this.activeIndex;
    if (index === active) {
      return 'translateZ(30px) scale(1.01)';
    }

    const distance = Math.abs(index - active);
    const direction = index < active ? -1 : 1;
    const z = -(distance * 15);
    const rotation = direction * Math.min(distance * this.stackRotation, this.stackRotation * 2);

    return `translateZ(${z}px) rotateX(${rotation}deg)`;
  }

  _getCardShadow(index) {
    if (this._reducedMotion) return 'none';

    const active = this.activeIndex;
    if (index === active) {
      return '0 15px 40px rgba(0, 0, 0, 0.35)';
    }

    const distance = Math.abs(index - active);
    const blur = 4 + distance * 6;
    const spread = distance * 2;
    const opacity = 0.1 + distance * 0.05;
    return `0 ${2 + distance * 3}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;
  }

  render() {
    const duration = `${this.transitionDuration}ms`;

    return html`
      <div class="wrapper">
        <div
          class="stack-panel"
          role="tablist"
          aria-label="Dispositivos"
          aria-orientation="vertical"
        >
          ${this._cards.map(
            (card, i) => html`
              <div
                class="card"
                role="tab"
                data-index="${i}"
                ?data-active=${i === this.activeIndex}
                aria-selected=${i === this.activeIndex ? 'true' : 'false'}
                aria-controls="panel-${i}"
                tabindex=${i === this.activeIndex ? '0' : '-1'}
                style="
                  background-color: ${i === this.activeIndex ? card.color : card.color};
                  transform: ${this._getCardTransform(i)};
                  box-shadow: ${this._getCardShadow(i)};
                  transition-duration: ${duration};
                "
                @click=${() => this._activateCard(i)}
                @keydown=${this._onCardKeydown}
              >
                <div class="card-header">
                  <span class="card-num">${card.num}</span>
                  ${card.title}
                </div>
                <div
                  id="panel-${i}"
                  class="card-body"
                  role="tabpanel"
                  aria-hidden=${i === this.activeIndex ? 'false' : 'true'}
                >
                  ${card.image
                    ? html`<picture class="card-mobile-image">
                        ${card.imageWebp
                          ? html`<source type="image/webp" srcset="${card.imageWebp}" />`
                          : ''}
                        <img
                          src="${card.image}"
                          alt="${card.title}"
                          loading="lazy"
                          width="441"
                          height="400"
                        />
                      </picture>`
                    : ''}
                  <h3 class="card-body-title">${card.title}</h3>
                  <slot name="${card.slotName}"></slot>
                </div>
              </div>
            `
          )}
        </div>

        <div class="preview-panel" aria-hidden="true">
          ${this._cards.map(
            (card, i) => html`
              <div class="preview-image" ?data-visible=${i === this.activeIndex}>
                ${card.image
                  ? html`<picture>
                      ${card.imageWebp
                        ? html`<source type="image/webp" srcset="${card.imageWebp}" />`
                        : ''}
                      <img
                        src="${card.image}"
                        alt="${card.title}"
                        loading="${i === this.activeIndex ? 'eager' : 'lazy'}"
                        width="441"
                        height="400"
                      />
                    </picture>`
                  : ''}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('device-card-stack', DeviceCardStack);
