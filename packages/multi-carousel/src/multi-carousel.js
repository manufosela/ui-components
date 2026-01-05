import { LitElement, html } from 'lit';
import { MultiCarouselStyles } from './multi-carousel.styles.js';

/**
 * Responsive multi-slide carousel with navigation and sync capabilities.
 *
 * @element multi-carousel
 * @slot - Slide content elements
 * @fires slide-change - Fired when slide changes. Detail: { index, total }
 *
 * @cssprop --carousel-width - Carousel width (default: 100%)
 * @cssprop --carousel-height - Carousel height (default: 300px)
 * @cssprop --carousel-bg - Background color (default: #f8fafc)
 * @cssprop --carousel-nav-color - Navigation dot color (default: #94a3b8)
 * @cssprop --carousel-nav-active - Active nav color (default: #3b82f6)
 * @cssprop --carousel-arrow-color - Arrow color (default: #64748b)
 * @cssprop --carousel-transition - Transition duration (default: 0.4s)
 */
export class MultiCarousel extends LitElement {
  static properties = {
    /** Current slide index (0-based) */
    current: { type: Number },
    /** Auto-play interval in ms (0 = disabled) */
    autoplay: { type: Number },
    /** Show navigation dots */
    showNav: { type: Boolean, attribute: 'show-nav' },
    /** Show arrow buttons */
    showArrows: { type: Boolean, attribute: 'show-arrows' },
    /** Loop slides infinitely */
    loop: { type: Boolean },
    /** Master ID for syncing multiple carousels */
    masterId: { type: String, attribute: 'master-id' },
    /** Act as master (broadcast changes) */
    master: { type: Boolean },
    /** Internal: number of slides */
    _slideCount: { type: Number, state: true }
  };

  static styles = [MultiCarouselStyles];

  constructor() {
    super();
    this.current = 0;
    this.autoplay = 0;
    this.showNav = true;
    this.showArrows = true;
    this.loop = true;
    this.masterId = '';
    this.master = false;
    this._slideCount = 0;
    this._autoplayTimer = null;
    this._boundSyncHandler = this._handleSync.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.masterId) {
      document.addEventListener('multi-carousel-sync', this._boundSyncHandler);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAutoplay();
    if (this.masterId) {
      document.removeEventListener('multi-carousel-sync', this._boundSyncHandler);
    }
  }

  firstUpdated() {
    this._updateSlideCount();
    this._startAutoplay();

    // Observe slot changes
    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => this._updateSlideCount());
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('autoplay')) {
      this._stopAutoplay();
      this._startAutoplay();
    }
  }

  _updateSlideCount() {
    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      const elements = slot.assignedElements();
      this._slideCount = elements.length;
      if (this.current >= this._slideCount) {
        this.current = Math.max(0, this._slideCount - 1);
      }
    }
  }

  _startAutoplay() {
    if (this.autoplay > 0 && this._slideCount > 1) {
      this._autoplayTimer = setInterval(() => this.next(), this.autoplay);
    }
  }

  _stopAutoplay() {
    if (this._autoplayTimer) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }

  _handleSync(event) {
    if (event.detail.masterId === this.masterId && event.detail.sourceId !== this.id) {
      this.current = event.detail.index;
    }
  }

  _broadcastChange() {
    if (this.master) {
      document.dispatchEvent(new CustomEvent('multi-carousel-sync', {
        detail: {
          masterId: this.id,
          sourceId: this.id,
          index: this.current
        }
      }));
    }

    this.dispatchEvent(new CustomEvent('slide-change', {
      detail: {
        index: this.current,
        total: this._slideCount
      },
      bubbles: true,
      composed: true
    }));
  }

  /** Go to specific slide */
  goTo(index) {
    if (this._slideCount === 0) return;

    let newIndex = index;

    if (this.loop) {
      if (newIndex < 0) newIndex = this._slideCount - 1;
      if (newIndex >= this._slideCount) newIndex = 0;
    } else {
      newIndex = Math.max(0, Math.min(newIndex, this._slideCount - 1));
    }

    if (newIndex !== this.current) {
      this.current = newIndex;
      this._broadcastChange();
    }
  }

  /** Go to next slide */
  next() {
    this.goTo(this.current + 1);
  }

  /** Go to previous slide */
  prev() {
    this.goTo(this.current - 1);
  }

  _handleNavClick(index) {
    this.goTo(index);
  }

  _handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }

  _renderNavigation() {
    if (!this.showNav || this._slideCount <= 1) return '';

    return html`
      <div class="navigation" role="tablist">
        ${Array.from({ length: this._slideCount }, (_, i) => html`
          <button
            class="nav-dot ${i === this.current ? 'active' : ''}"
            role="tab"
            aria-selected="${i === this.current}"
            aria-label="Go to slide ${i + 1}"
            @click="${() => this._handleNavClick(i)}"
          ></button>
        `)}
      </div>
    `;
  }

  _renderArrows() {
    if (!this.showArrows || this._slideCount <= 1) return '';

    const showPrev = this.loop || this.current > 0;
    const showNext = this.loop || this.current < this._slideCount - 1;

    return html`
      <div class="arrows">
        <button
          class="arrow prev ${showPrev ? '' : 'hidden'}"
          aria-label="Previous slide"
          @click="${this.prev}"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          class="arrow next ${showNext ? '' : 'hidden'}"
          aria-label="Next slide"
          @click="${this.next}"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    `;
  }

  render() {
    const offset = -this.current * 100;

    return html`
      <div
        class="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        tabindex="0"
        @keydown="${this._handleKeydown}"
      >
        <div class="slides-container">
          <div
            class="slides"
            style="transform: translateX(${offset}%)"
            role="group"
            aria-live="polite"
          >
            <slot></slot>
          </div>
        </div>
        ${this._renderArrows()}
        ${this._renderNavigation()}
      </div>
    `;
  }
}

customElements.define('multi-carousel', MultiCarousel);
