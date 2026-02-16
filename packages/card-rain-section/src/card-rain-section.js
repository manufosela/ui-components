import { LitElement, html, css } from 'lit';

const POSES = [
  { x: -5, y: 0, rotate: -6 },
  { x: 8, y: 2, rotate: 4 },
  { x: -3, y: -1, rotate: -2 },
  { x: 6, y: 3, rotate: 7 },
  { x: -8, y: 1, rotate: -5 },
];

/**
 * Scroll-driven card rain animation section.
 *
 * @element card-rain-section
 * @attr {Number} scroll-height - Scroll area height in vh (default: 300)
 * @attr {Number} mobile-breakpoint - Mobile layout threshold in px (default: 768)
 * @attr {String} fall-mode - Animation mode: "drop" or "zoom" (default: "drop")
 * @slot title - Title content displayed behind the cards
 * @slot card - Card elements that animate into view
 * @slot actions - Action buttons at the bottom
 */
export class CardRainSection extends LitElement {
  static properties = {
    scrollHeight: { type: Number, attribute: 'scroll-height' },
    mobileBreakpoint: { type: Number, attribute: 'mobile-breakpoint' },
    fallMode: { type: String, attribute: 'fall-mode' },
    _isMobile: { type: Boolean, state: true },
    _reducedMotion: { type: Boolean, state: true },
    _mobileTriggered: { type: Boolean, state: true },
    _cardCount: { type: Number, state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      --crs-bg: #1a1618;
      --crs-card-bg: var(--accent-gold, #bfa15f);
      --crs-card-radius: 16px;
      --crs-card-width: 440px;
      --crs-card-padding: 48px;
      --crs-title-size: 10rem;
      --crs-title-color: rgba(255, 255, 255, 1);
    }

    .scroller {
      position: relative;
    }

    .canvas {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      background-color: var(--crs-bg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-text {
      position: absolute;
      font-size: var(--crs-title-size);
      font-weight: 700;
      color: var(--crs-title-color);
      text-align: center;
      z-index: 1;
      pointer-events: none;
      will-change: opacity;
      line-height: 1.2;
    }

    .card {
      position: absolute;
      background-color: var(--crs-card-bg);
      color: #fff;
      padding: var(--crs-card-padding);
      border-radius: var(--crs-card-radius);
      width: var(--crs-card-width);
      text-align: left;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      z-index: 2;
      will-change: transform, opacity;
      opacity: 0;
      transform: translateY(-120vh);
    }

    .actions-layer {
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      will-change: opacity;
      opacity: 0;
    }

    /* Slotted content styles */
    ::slotted([slot='title']) {
      display: none !important;
    }

    .card ::slotted(*) {
      color: #fff;
    }

    /* Mobile */
    :host([data-mobile]) .scroller {
      height: auto !important;
    }

    :host([data-mobile]) .canvas {
      position: relative;
      min-height: auto;
      flex-direction: column;
      padding: 80px 0 60px;
      gap: 0;
    }

    :host([data-mobile]) .title-text {
      position: relative;
      font-size: 10vw;
      margin-bottom: 40px;
    }

    :host([data-mobile]) .card {
      position: relative;
      width: 90%;
      margin: 0 auto 20px;
      opacity: 0;
      transform: translateY(40px);
    }

    :host([data-mobile]) .actions-layer {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      text-align: center;
      margin-top: 40px;
      opacity: 0;
    }

    /* Mobile triggered animations */
    @keyframes cardDrop {
      from {
        opacity: 0;
        transform: translateY(40px) rotate(var(--card-rotate, 0deg));
      }
      to {
        opacity: 1;
        transform: translateY(0) rotate(var(--card-rotate, 0deg));
      }
    }

    @keyframes cardZoom {
      from {
        opacity: 0;
        transform: scale(2.5) rotate(0deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(var(--card-rotate, 0deg));
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host([data-mobile][mobile-triggered]) .card {
      animation-duration: 0.5s;
      animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
      animation-fill-mode: forwards;
    }

    :host([data-mobile][mobile-triggered]) .actions-layer {
      animation: fadeInUp 0.4s ease-out forwards;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .scroller {
        height: auto !important;
      }

      .canvas {
        position: relative;
        min-height: auto;
        flex-direction: column;
        padding: 80px 0 60px;
      }

      .title-text {
        position: relative;
        opacity: 0.3 !important;
        margin-bottom: 40px;
      }

      .card {
        position: relative !important;
        width: 90% !important;
        max-width: var(--crs-card-width);
        margin: 0 auto 20px !important;
        opacity: 1 !important;
        transform: none !important;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4) !important;
      }

      .actions-layer {
        position: relative !important;
        bottom: auto !important;
        left: auto !important;
        transform: none !important;
        text-align: center;
        margin-top: 40px;
        opacity: 1 !important;
      }

      :host([data-mobile][mobile-triggered]) .card,
      :host([data-mobile][mobile-triggered]) .actions-layer {
        animation: none !important;
      }
    }
  `;

  constructor() {
    super();
    this.scrollHeight = 300;
    this.mobileBreakpoint = 768;
    this.fallMode = 'drop';
    this._isMobile = false;
    this._reducedMotion = false;
    this._mobileTriggered = false;
    this._cardCount = 0;

    this._currentProgress = 0;
    this._targetProgress = 0;
    this._rafId = null;
    this._scrollHandler = null;
    this._resizeHandler = null;
    this._cardElements = [];
    this._titleText = '';
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
    this._cleanup();
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  }

  firstUpdated() {
    this._processSlots();
    this._setupAnimation();
  }

  _processSlots() {
    const titleSlot = this.querySelector('[slot="title"]');
    if (titleSlot) {
      this._titleText = titleSlot.innerHTML;
    }

    const cards = this.querySelectorAll('[slot="card"]');
    this._cardCount = cards.length;

    cards.forEach((card, i) => {
      card.setAttribute('slot', `card-${i}`);
    });

    this.requestUpdate();
  }

  _checkMobile() {
    const wasMobile = this._isMobile;
    this._isMobile = window.innerWidth <= this.mobileBreakpoint;

    if (this._isMobile) {
      this.setAttribute('data-mobile', '');
    } else {
      this.removeAttribute('data-mobile');
    }

    if (wasMobile !== this._isMobile && this.hasUpdated) {
      this._cleanup();
      this._mobileTriggered = false;
      this.removeAttribute('mobile-triggered');
      this._resetCardStyles();
      this._setupAnimation();
    }
  }

  _onResize() {
    this._checkMobile();
  }

  _cleanup() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
    }
  }

  _resetCardStyles() {
    const cards = this.shadowRoot.querySelectorAll('.card');
    const title = this.shadowRoot.querySelector('.title-text');
    const actions = this.shadowRoot.querySelector('.actions-layer');

    cards.forEach((card) => {
      card.style.cssText = '';
    });
    if (title) title.style.cssText = '';
    if (actions) actions.style.cssText = '';
  }

  _setupAnimation() {
    if (this._reducedMotion) return;

    if (this._isMobile) {
      this._setupMobileAnimation();
    } else {
      this._setupDesktopAnimation();
    }
  }

  _setupDesktopAnimation() {
    this._currentProgress = 0;
    this._targetProgress = 0;
    this._scrollHandler = this._onScroll.bind(this);
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    this._startRafLoop();
  }

  _setupMobileAnimation() {
    const canvas = this.shadowRoot.querySelector('.canvas');
    if (!canvas) return;

    this._scrollHandler = () => {
      if (this._mobileTriggered) return;
      const rect = canvas.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.85;

      if (visible) {
        this._mobileTriggered = true;
        this.setAttribute('mobile-triggered', '');
        this._applyMobileDelays();
        window.removeEventListener('scroll', this._scrollHandler);
        this._scrollHandler = null;
      }
    };

    window.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  _applyMobileDelays() {
    const animName = this.fallMode === 'zoom' ? 'cardZoom' : 'cardDrop';
    const cards = this.shadowRoot.querySelectorAll('.card');
    cards.forEach((card, i) => {
      const pose = POSES[i % POSES.length];
      card.style.setProperty('--card-rotate', `${pose.rotate}deg`);
      card.style.animationName = animName;
      card.style.animationDelay = `${i * 0.2}s`;
    });

    const actions = this.shadowRoot.querySelector('.actions-layer');
    if (actions) {
      actions.style.animationDelay = `${this._cardCount * 0.2 + 0.1}s`;
    }
  }

  _onScroll() {
    const scroller = this.shadowRoot.querySelector('.scroller');
    if (!scroller) return;

    const rect = scroller.getBoundingClientRect();
    const scrollableHeight = scroller.offsetHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      this._targetProgress = 0;
      return;
    }

    const scrolled = -rect.top;
    this._targetProgress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
  }

  _startRafLoop() {
    const lerpFactor = 0.08;

    const loop = () => {
      this._currentProgress += (this._targetProgress - this._currentProgress) * lerpFactor;

      if (Math.abs(this._currentProgress - this._targetProgress) < 0.0001) {
        this._currentProgress = this._targetProgress;
      }

      this._applyDesktopTransforms(this._currentProgress);
      this._rafId = requestAnimationFrame(loop);
    };

    this._rafId = requestAnimationFrame(loop);
  }

  _easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  _getSubProgress(progress, start, end) {
    if (progress <= start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  }

  _applyDesktopTransforms(progress) {
    const title = this.shadowRoot.querySelector('.title-text');
    const cards = this.shadowRoot.querySelectorAll('.card');
    const actions = this.shadowRoot.querySelector('.actions-layer');
    const count = cards.length;

    if (!count) return;

    // Title opacity: 1 -> 0.3
    if (title) {
      const titleOpacity = 1 - 0.7 * progress;
      title.style.opacity = titleOpacity;
    }

    // Each card gets an equal slice of the progress range
    cards.forEach((card, i) => {
      const start = i / count;
      const end = (i + 1) / count;
      const sub = this._easeOutCubic(this._getSubProgress(progress, start, end));
      const pose = POSES[i % POSES.length];

      const result =
        this.fallMode === 'zoom' ? this._calcZoomCard(sub, pose) : this._calcDropCard(sub, pose);

      card.style.opacity = result.opacity;
      card.style.transform = result.transform;
      card.style.boxShadow = result.boxShadow;
      card.style.filter = result.filter || '';
    });

    // Actions fade in when progress > 0.9
    if (actions) {
      const actionsSub = this._getSubProgress(progress, 0.9, 1);
      actions.style.opacity = actionsSub;
    }
  }

  _calcDropCard(sub, pose) {
    const translateY = -120 * (1 - sub) + pose.y * sub;
    const translateX = pose.x * sub;
    const rotate = pose.rotate * sub;

    const opacitySub = this._getSubProgress(sub, 0, 0.3);
    const opacity = Math.min(1, opacitySub / 0.3);

    const scale = 0.8 + 0.2 * sub;

    const shadowBlur = 15 + 35 * sub;
    const shadowY = 4 + 16 * sub;
    const shadowAlpha = 0.1 + 0.3 * sub;

    return {
      opacity,
      transform: `translate(${translateX}vw, ${translateY}vh) rotate(${rotate}deg) scale(${scale})`,
      boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`,
    };
  }

  _calcZoomCard(sub, pose) {
    const scale = 3.5 - 2.5 * sub;
    const translateX = pose.x * sub;
    const translateY = pose.y * sub;
    const rotate = pose.rotate * sub;

    const opacitySub = this._getSubProgress(sub, 0, 0.2);
    const opacity = Math.min(1, opacitySub / 0.2);

    const shadowBlur = 15 + 35 * sub;
    const shadowY = 4 + 16 * sub;
    const shadowAlpha = 0.1 + 0.3 * sub;

    const blurSub = this._getSubProgress(sub, 0, 0.4);
    const blur = 4 * (1 - Math.min(1, blurSub / 0.4));

    return {
      opacity,
      transform: `translate(${translateX}vw, ${translateY}vh) rotate(${rotate}deg) scale(${scale})`,
      boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`,
      filter: blur > 0.01 ? `blur(${blur}px)` : '',
    };
  }

  render() {
    const scrollerHeight =
      this._reducedMotion || this._isMobile ? 'auto' : `${this.scrollHeight}vh`;

    const cardTemplates = [];
    for (let i = 0; i < this._cardCount; i++) {
      cardTemplates.push(html`
        <div class="card">
          <slot name="card-${i}"></slot>
        </div>
      `);
    }

    return html`
      <div
        class="scroller"
        style="height: ${scrollerHeight}"
        role="region"
        aria-label="Tarjetas animadas con scroll"
      >
        <div class="canvas">
          <div class="title-text" .innerHTML="${this._titleText}"></div>
          ${cardTemplates}
          <div class="actions-layer">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>

      <!-- Hidden slot for title source -->
      <slot name="title" style="display:none"></slot>
    `;
  }
}

customElements.define('card-rain-section', CardRainSection);
