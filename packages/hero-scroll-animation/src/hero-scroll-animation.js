import { LitElement, html, css } from 'lit';

/**
 * Hero section with scroll-driven parallax animation.
 *
 * As the user scrolls, the hero content fades out and slides up, while
 * a center image rises and side images slide in from the edges. Supports
 * both desktop (scroll-linked) and mobile (intersection-triggered) modes.
 *
 * Images are provided via named slots (`background`, `center`, `left`, `right`)
 * and their `src` attributes are extracted to render internal `<img>` elements.
 * The `content` slot holds arbitrary markup displayed over the hero background.
 *
 * @element hero-scroll-animation
 *
 * @attr {String} background-text - Large decorative text rendered behind the images
 * @attr {Number} scroll-height - Scroll distance in vh units for the parallax effect (default: 450)
 * @attr {Number} overlay-opacity - Opacity of the dark overlay on the background image (default: 0.5)
 * @attr {Number} scrub - Smoothing factor for the scroll interpolation (default: 1)
 * @attr {Number} mobile-breakpoint - Viewport width in px below which mobile mode is used (default: 768)
 * @attr {Number} mobile-scroll-height - Scroll distance in vh units for mobile mode (default: 220)
 *
 * @cssprop [--hero-accent-color=#bfa15f] - Accent color used for decorative elements
 * @cssprop [--hero-text-color=#f0f0f0] - Default text color inside the hero
 * @cssprop [--hero-bg-gradient-start=#d4af37] - Start color for the background text gradient
 * @cssprop [--hero-bg-gradient-end=#f4e4b0] - End color for the background text gradient
 *
 * @slot content - Main content displayed over the hero (headings, text, CTAs)
 * @slot background - Hidden `<img>` whose `src` is used as the hero background image
 * @slot center - Hidden `<img>` whose `src` is used for the center parallax image
 * @slot left - Hidden `<img>` whose `src` is used for the left side parallax image
 * @slot right - Hidden `<img>` whose `src` is used for the right side parallax image
 */
export class HeroScrollAnimation extends LitElement {
  static properties = {
    backgroundText: { type: String, attribute: 'background-text' },
    scrollHeight: { type: Number, attribute: 'scroll-height' },
    overlayOpacity: { type: Number, attribute: 'overlay-opacity' },
    scrub: { type: Number },
    mobileBreakpoint: { type: Number, attribute: 'mobile-breakpoint' },
    mobileScrollHeight: { type: Number, attribute: 'mobile-scroll-height' },
    _progress: { type: Number, state: true },
    _isMobile: { type: Boolean, state: true },
    _reducedMotion: { type: Boolean, state: true },
    _mobileTriggered: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      --_accent: var(--hero-accent-color, #bfa15f);
      --_text: var(--hero-text-color, #f0f0f0);
      --_grad-start: var(--hero-bg-gradient-start, #d4af37);
      --_grad-end: var(--hero-bg-gradient-end, #f4e4b0);
    }

    .scroller {
      position: relative;
    }

    .canvas {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1a1618;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, var(--_overlay-opacity, 0.5));
      z-index: 1;
      will-change: opacity;
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      will-change: transform, opacity;
    }

    ::slotted([slot='content']) {
      position: relative;
      z-index: 2;
    }

    .bg-text {
      position: absolute;
      bottom: -20%;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: clamp(4rem, 15vw, 12rem);
      font-weight: 700;
      background: linear-gradient(
        135deg,
        var(--_grad-start) 0%,
        var(--_grad-end) 50%,
        var(--_grad-start) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0.4;
      z-index: 0;
      white-space: nowrap;
      pointer-events: none;
      will-change: transform, opacity;
    }

    .center-img {
      position: absolute;
      bottom: -35%;
      left: 50%;
      transform: translateX(-50%) translateZ(0);
      width: min(60vw, 900px);
      max-width: 90vw;
      z-index: 3;
      will-change: transform;
      pointer-events: none;
    }

    .center-img img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
    }

    .side-img {
      position: absolute;
      top: 50%;
      z-index: 2;
      width: min(40vw, 700px);
      max-width: 45vw;
      will-change: transform, opacity;
      pointer-events: none;
    }

    .side-img img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4));
    }

    .side-img--left {
      left: 5%;
      transform: translateY(-50%) translateZ(0);
    }

    .side-img--right {
      right: 5%;
      transform: translateY(-50%) translateZ(0);
    }

    /* Hide slotted images used as sources */
    ::slotted([slot='background']),
    ::slotted([slot='center']),
    ::slotted([slot='left']),
    ::slotted([slot='right']) {
      display: none !important;
    }

    /* Mobile keyframe animations */
    @keyframes fadeOutContent {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-60px);
      }
    }

    @keyframes slideUpCenter {
      from {
        transform: translateX(-50%) translateY(0) scale(1);
      }
      to {
        transform: translateX(-50%) translateY(-55vh) scale(0.75);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(-200px) scale(0.7);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0) scale(1);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(200px) scale(0.7);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0) scale(1);
      }
    }

    @keyframes fadeBgText {
      from {
        opacity: 0;
        transform: translate(-50%, 0) translateY(0) scale(1.2);
      }
      to {
        opacity: 0.4;
        transform: translate(-50%, 0) translateY(-55vh) scale(1);
      }
    }

    :host([mobile-triggered]) .content-wrapper {
      animation: fadeOutContent 0.6s ease-out forwards;
    }

    :host([mobile-triggered]) .overlay {
      animation: fadeOutContent 0.6s ease-out forwards;
    }

    :host([mobile-triggered]) .center-img {
      animation: slideUpCenter 0.8s cubic-bezier(0.33, 1, 0.68, 1) 0.3s forwards;
    }

    :host([mobile-triggered]) .side-img--left {
      animation: slideInLeft 0.8s cubic-bezier(0.33, 1, 0.68, 1) 0.35s forwards;
    }

    :host([mobile-triggered]) .side-img--right {
      animation: slideInRight 0.8s cubic-bezier(0.33, 1, 0.68, 1) 0.35s forwards;
    }

    :host([mobile-triggered]) .bg-text {
      animation: fadeBgText 0.8s ease-out 0.35s forwards;
    }

    /* Initial hidden state for mobile side images */
    :host([data-mobile]) .side-img {
      opacity: 0;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      :host {
        /* Show static layout */
      }

      .scroller {
        height: 100vh !important;
      }

      .canvas {
        position: relative;
      }

      .content-wrapper {
        opacity: 1 !important;
        transform: none !important;
      }

      .overlay {
        opacity: 1 !important;
      }

      .center-img,
      .side-img,
      .bg-text {
        display: none;
      }

      :host([mobile-triggered]) .content-wrapper,
      :host([mobile-triggered]) .overlay,
      :host([mobile-triggered]) .center-img,
      :host([mobile-triggered]) .side-img--left,
      :host([mobile-triggered]) .side-img--right,
      :host([mobile-triggered]) .bg-text {
        animation: none !important;
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .center-img {
        width: 55vw;
        max-width: 85vw;
        bottom: -25%;
      }

      .side-img {
        width: 28vw;
        max-width: 35vw;
        top: 60%;
      }

      .side-img--left {
        left: 2%;
      }

      .side-img--right {
        right: 2%;
      }

      .bg-text {
        font-size: min(10vw, 5rem);
      }
    }
  `;

  constructor() {
    super();
    this.backgroundText = '';
    this.scrollHeight = 450;
    this.overlayOpacity = 0.5;
    this.scrub = 1;
    this.mobileBreakpoint = 768;
    this.mobileScrollHeight = 220;
    this._progress = 0;
    this._isMobile = false;
    this._reducedMotion = false;
    this._mobileTriggered = false;

    this._currentProgress = 0;
    this._targetProgress = 0;
    this._rafId = null;
    this._scrollHandler = null;
    this._resizeHandler = null;
    this._observer = null;

    this._bgSrc = '';
    this._centerSrc = '';
    this._leftSrc = '';
    this._rightSrc = '';
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
    this._extractSlotSources();
    this._setupAnimation();
  }

  _getImgSrc(slotEl) {
    if (!slotEl) return '';
    if (slotEl.tagName === 'PICTURE') {
      const webpSource = slotEl.querySelector('source[type="image/webp"]');
      if (webpSource) return webpSource.getAttribute('srcset') || '';
      const img = slotEl.querySelector('img');
      return img ? img.getAttribute('src') || '' : '';
    }
    return slotEl.getAttribute('src') || '';
  }

  _extractSlotSources() {
    const bgSlot = this.querySelector('[slot="background"]');
    const centerSlot = this.querySelector('[slot="center"]');
    const leftSlot = this.querySelector('[slot="left"]');
    const rightSlot = this.querySelector('[slot="right"]');

    this._bgSrc = this._getImgSrc(bgSlot);
    this._centerSrc = this._getImgSrc(centerSlot);
    this._leftSrc = this._getImgSrc(leftSlot);
    this._rightSrc = this._getImgSrc(rightSlot);

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
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
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
    this._scrollHandler = this._onScroll.bind(this);
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    this._startRafLoop();
  }

  _setupMobileAnimation() {
    const scroller = this.shadowRoot.querySelector('.scroller');
    if (!scroller) return;

    const scrollerHeight = scroller.offsetHeight;
    const triggerPoint = scrollerHeight * 0.15;

    this._scrollHandler = () => {
      if (this._mobileTriggered) return;
      const rect = scroller.getBoundingClientRect();
      const scrolled = -rect.top;

      if (scrolled > triggerPoint) {
        this._mobileTriggered = true;
        this.setAttribute('mobile-triggered', '');
        this._handleMobileA11y();
        window.removeEventListener('scroll', this._scrollHandler);
        this._scrollHandler = null;
      }
    };

    window.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  _handleMobileA11y() {
    setTimeout(() => {
      this._setContentA11y(true);
    }, 600);
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
    const loop = () => {
      const lerpFactor = 1 / (1 + this.scrub * 10);
      this._currentProgress += (this._targetProgress - this._currentProgress) * lerpFactor;

      if (Math.abs(this._currentProgress - this._targetProgress) > 0.0001) {
        this._applyDesktopTransforms(this._currentProgress);
      } else {
        this._currentProgress = this._targetProgress;
        this._applyDesktopTransforms(this._currentProgress);
      }

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
    const contentWrapper = this.shadowRoot.querySelector('.content-wrapper');
    const overlay = this.shadowRoot.querySelector('.overlay');
    const centerImg = this.shadowRoot.querySelector('.center-img');
    const bgText = this.shadowRoot.querySelector('.bg-text');
    const leftImg = this.shadowRoot.querySelector('.side-img--left');
    const rightImg = this.shadowRoot.querySelector('.side-img--right');

    // Phase 1: 0.0 -> 0.25 - Content fade out
    const phase1 = this._easeOutCubic(this._getSubProgress(progress, 0, 0.25));
    if (contentWrapper) {
      contentWrapper.style.opacity = 1 - phase1;
      contentWrapper.style.transform = `translateY(${-60 * phase1}px)`;
    }
    if (overlay) {
      overlay.style.opacity = 1 - phase1;
    }

    // A11y: hide content from tab when scrolled past
    this._setContentA11y(phase1 > 0.9);

    // Phase 2: 0.3 -> 0.85 - All 3 images move together
    const phase2 = this._easeOutCubic(this._getSubProgress(progress, 0.3, 0.85));

    // Center image rises
    if (centerImg) {
      const translateY = -65 * phase2; // vh
      const scale = 1 - 0.3 * phase2; // 1 -> 0.7
      centerImg.style.transform = `translateX(-50%) translateY(${translateY}vh) scale(${scale})`;
    }

    // Bg text follows center image (same vertical movement)
    if (bgText) {
      const fontSize = 12 - 5 * phase2; // 12rem -> 7rem
      const translateY = -65 * phase2; // same as center image
      bgText.style.fontSize = `clamp(${4 - 1 * phase2}rem, ${15 - 7 * phase2}vw, ${fontSize}rem)`;
      bgText.style.transform = `translate(-50%, 0) translateY(${translateY}vh)`;
    }

    // Side images appear together with center (slight delay: 0.35 -> 0.9)
    const phaseSides = this._easeOutCubic(this._getSubProgress(progress, 0.35, 0.9));
    if (leftImg) {
      const x = -200 * (1 - phaseSides);
      const scale = 0.7 + 0.3 * phaseSides;
      leftImg.style.opacity = phaseSides;
      leftImg.style.transform = `translateY(-50%) translateX(${x}px) scale(${scale})`;
    }
    if (rightImg) {
      const x = 200 * (1 - phaseSides);
      const scale = 0.7 + 0.3 * phaseSides;
      rightImg.style.opacity = phaseSides;
      rightImg.style.transform = `translateY(-50%) translateX(${x}px) scale(${scale})`;
    }
  }

  _setContentA11y(hidden) {
    const contentSlot = this.querySelector('[slot="content"]');
    if (!contentSlot) return;

    const focusableElements = contentSlot.querySelectorAll('a, button, input, [tabindex]');
    if (hidden) {
      contentSlot.setAttribute('aria-hidden', 'true');
      focusableElements.forEach((el) => el.setAttribute('tabindex', '-1'));
    } else {
      contentSlot.removeAttribute('aria-hidden');
      focusableElements.forEach((el) => el.removeAttribute('tabindex'));
    }
  }

  _getScrollerHeight() {
    if (this._reducedMotion) return '100vh';
    const h = this._isMobile ? this.mobileScrollHeight : this.scrollHeight;
    return `${h}vh`;
  }

  render() {
    return html`
      <div
        class="scroller"
        style="height: ${this._getScrollerHeight()}"
        role="region"
        aria-label="Hero animado con scroll"
      >
        <div
          class="canvas"
          style="
            background-image: ${this._bgSrc ? `url('${this._bgSrc}')` : 'none'};
            --_overlay-opacity: ${this.overlayOpacity};
          "
        >
          <div class="overlay"></div>

          <div class="content-wrapper">
            <slot name="content"></slot>
          </div>

          ${this.backgroundText ? html`<div class="bg-text">${this.backgroundText}</div>` : ''}
          ${this._centerSrc
            ? html`
                <div class="center-img">
                  <img src="${this._centerSrc}" alt="" loading="eager" width="900" height="506" />
                </div>
              `
            : ''}
          ${this._leftSrc
            ? html`
                <div class="side-img side-img--left">
                  <img
                    src="${this._leftSrc}"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="960"
                    height="540"
                  />
                </div>
              `
            : ''}
          ${this._rightSrc
            ? html`
                <div class="side-img side-img--right">
                  <img
                    src="${this._rightSrc}"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="960"
                    height="540"
                  />
                </div>
              `
            : ''}
        </div>
      </div>

      <!-- Hidden slots for source images -->
      <slot name="background"></slot>
      <slot name="center"></slot>
      <slot name="left"></slot>
      <slot name="right"></slot>
    `;
  }
}

customElements.define('hero-scroll-animation', HeroScrollAnimation);
