import { LitElement, html, css } from 'lit';

/**
 * Responsive header navigation web component with hamburger menu.
 *
 * @element header-nav
 * @slot - Navigation links (<a> elements)
 * @slot logo - Custom logo content
 * @slot logo-text - Text logo fallback
 * @fires menu-toggle - Fired when mobile menu is toggled. detail: { open }
 * @fires nav-click - Fired when a nav link is clicked. detail: { href, text, index }
 *
 * @attr {String} logo - Logo image URL
 * @attr {String} logo-alt - Logo alt text (default: "Logo")
 * @attr {String} logo-href - Logo link URL (default: "/")
 * @attr {Boolean} sticky - Make header sticky
 * @attr {Number} mobile-breakpoint - Viewport width for hamburger (default: 768)
 * @attr {Number} active-index - Index of the currently active nav link (-1 = none)
 *
 * @cssprop [--header-height=60px] - Header height
 * @cssprop [--header-bg=#fff] - Background color
 * @cssprop [--header-shadow=0 2px 4px rgba(0,0,0,0.1)] - Box shadow
 * @cssprop [--header-link-color=#374151] - Link color
 * @cssprop [--header-link-hover=#3b82f6] - Link hover color
 * @cssprop [--header-link-active=#3b82f6] - Active link color
 * @cssprop [--header-link-active-bg=rgba(59,130,246,0.1)] - Active link background
 * @cssprop [--header-link-disabled=#9ca3af] - Disabled link color
 */
export class HeaderNav extends LitElement {
  static properties = {
    logo: { type: String },
    logoAlt: { type: String, attribute: 'logo-alt' },
    logoHref: { type: String, attribute: 'logo-href' },
    sticky: { type: Boolean },
    mobileBreakpoint: { type: Number, attribute: 'mobile-breakpoint' },
    activeIndex: { type: Number, attribute: 'active-index' },
    _menuOpen: { state: true },
    _mobileLinks: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height, 60px);
      padding: 0 1.5rem;
      background: var(--header-bg, #fff);
      box-shadow: var(--header-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    :host([sticky]) header {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      display: flex;
      align-items: center;
    }

    .logo a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }

    .logo img {
      height: calc(var(--header-height, 60px) - 20px);
      width: auto;
    }

    .logo-text {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--header-link-color, #374151);
    }

    nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    ::slotted(a) {
      color: var(--header-link-color, #374151);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transition:
        color 0.2s,
        background-color 0.2s;
    }

    ::slotted(a:hover) {
      color: var(--header-link-hover, #3b82f6);
      background: var(--header-link-active-bg, rgba(59, 130, 246, 0.1));
    }

    ::slotted(a:focus-visible) {
      outline: 2px solid var(--header-link-hover, #3b82f6);
      outline-offset: 2px;
    }

    ::slotted(a[aria-current='page']) {
      color: var(--header-link-active, #3b82f6);
      background: var(--header-link-active-bg, rgba(59, 130, 246, 0.1));
      font-weight: 600;
    }

    ::slotted(a[aria-disabled='true']) {
      color: var(--header-link-disabled, #9ca3af);
      pointer-events: none;
      opacity: 0.6;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
    }

    .hamburger span {
      display: block;
      width: 100%;
      height: 3px;
      background: var(--header-link-color, #374151);
      border-radius: 2px;
      transition:
        transform 0.3s,
        opacity 0.3s;
    }

    .hamburger.open span:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .hamburger.open span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.open span:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }

    .mobile-menu {
      display: none;
      position: absolute;
      top: var(--header-height, 60px);
      left: 0;
      right: 0;
      background: var(--header-bg, #fff);
      box-shadow: var(--header-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      flex-direction: column;
      padding: 0.5rem;
      z-index: 60;
    }

    .mobile-menu.open {
      display: flex;
    }

    .mobile-menu a {
      color: var(--header-link-color, #374151);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      transition:
        color 0.2s,
        background 0.2s;
    }

    .mobile-menu a:hover {
      color: var(--header-link-hover, #3b82f6);
      background: var(--header-link-active-bg, rgba(59, 130, 246, 0.1));
    }

    .mobile-menu a[aria-current='page'] {
      color: var(--header-link-active, #3b82f6);
      background: var(--header-link-active-bg, rgba(59, 130, 246, 0.1));
      font-weight: 600;
    }

    .mobile-menu a[aria-disabled='true'] {
      color: var(--header-link-disabled, #9ca3af);
      pointer-events: none;
      opacity: 0.6;
    }

    .overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 50;
    }

    .overlay.open {
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      ::slotted(a),
      .hamburger span,
      .mobile-menu a {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.logo = '';
    this.logoAlt = 'Logo';
    this.logoHref = '/';
    this.sticky = false;
    this.mobileBreakpoint = 768;
    this.activeIndex = -1;
    this._menuOpen = false;
    this._mobileLinks = [];
  }

  // ─── Menu toggle ─────────────────────────────────────────────────────────

  _toggleMenu() {
    this._menuOpen = !this._menuOpen;
    this.dispatchEvent(
      new CustomEvent('menu-toggle', {
        detail: { open: this._menuOpen },
        bubbles: true,
        composed: true,
      })
    );
  }

  _closeMenu() {
    if (this._menuOpen) {
      this._menuOpen = false;
      this.dispatchEvent(
        new CustomEvent('menu-toggle', {
          detail: { open: false },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // ─── Active / disabled state ─────────────────────────────────────────────

  _getLinks() {
    const slot = this.shadowRoot?.querySelector('slot:not([name])');
    return slot ? slot.assignedElements().filter((el) => el.tagName === 'A') : [];
  }

  _updateActiveState() {
    const links = this._getLinks();
    links.forEach((link, i) => {
      if (i === this.activeIndex) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    // Also update mobile menu
    this._updateMobileLinks();
  }

  /**
   * Set a nav link as disabled by index.
   * @param {number} index
   * @param {boolean} disabled
   */
  setDisabled(index, disabled) {
    const links = this._getLinks();
    if (links[index]) {
      if (disabled) {
        links[index].setAttribute('aria-disabled', 'true');
        links[index].setAttribute('tabindex', '-1');
      } else {
        links[index].removeAttribute('aria-disabled');
        links[index].removeAttribute('tabindex');
      }
      this._updateMobileLinks();
    }
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this._resizeHandler = () => {
      if (window.innerWidth > this.mobileBreakpoint && this._menuOpen) {
        this._closeMenu();
      }
    };
    window.addEventListener('resize', this._resizeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeHandler);
  }

  firstUpdated() {
    this._updateMobileStyles();
    this._updateMobileLinks();
    this._updateActiveState();

    const slot = this.shadowRoot.querySelector('slot:not([name])');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this._updateMobileLinks();
        this._updateActiveState();
      });
    }

    // Handle clicks on slotted links
    this.addEventListener('click', (e) => {
      const link = e.target.closest?.('a');
      if (!link) return;

      if (link.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }

      // Set active state
      const links = this._getLinks();
      const index = links.indexOf(link);
      if (index !== -1) {
        this.activeIndex = index;
        this._updateActiveState();

        this.dispatchEvent(
          new CustomEvent('nav-click', {
            detail: {
              href: link.getAttribute('href'),
              text: link.textContent.trim(),
              index,
            },
            bubbles: true,
            composed: true,
          })
        );
      }

      this._closeMenu();
    });
  }

  updated(changedProps) {
    if (changedProps.has('mobileBreakpoint')) {
      this._updateMobileStyles();
    }
    if (changedProps.has('activeIndex')) {
      this._updateActiveState();
    }
  }

  _updateMobileStyles() {
    const style = this.shadowRoot?.querySelector('#dynamic-styles');
    if (style) {
      style.textContent = `
        @media (max-width: ${this.mobileBreakpoint}px) {
          nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: ${this.mobileBreakpoint + 1}px) {
          nav { display: flex !important; }
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `;
    }
  }

  _updateMobileLinks() {
    const links = this._getLinks();
    this._mobileLinks = links.map((link, i) => ({
      href: link.getAttribute('href') || '#',
      text: link.textContent.trim(),
      active: i === this.activeIndex,
      disabled: link.getAttribute('aria-disabled') === 'true',
    }));
  }

  _onMobileLinkClick(e, index) {
    const link = this._mobileLinks[index];
    if (link?.disabled) {
      e.preventDefault();
      return;
    }

    this.activeIndex = index;
    this._updateActiveState();

    this.dispatchEvent(
      new CustomEvent('nav-click', {
        detail: {
          href: link.href,
          text: link.text,
          index,
        },
        bubbles: true,
        composed: true,
      })
    );

    this._closeMenu();
  }

  render() {
    return html`
      <style id="dynamic-styles"></style>
      <div class="overlay ${this._menuOpen ? 'open' : ''}" @click="${this._closeMenu}"></div>
      <header>
        <div class="logo">
          ${this.logo
            ? html`
                <a href="${this.logoHref}">
                  <img src="${this.logo}" alt="${this.logoAlt}" width="120" height="40" />
                </a>
              `
            : html`
                <slot name="logo">
                  <a href="${this.logoHref}" class="logo-text">
                    <slot name="logo-text">Logo</slot>
                  </a>
                </slot>
              `}
        </div>

        <nav role="navigation" aria-label="Main navigation">
          <slot></slot>
        </nav>

        <button
          class="hamburger ${this._menuOpen ? 'open' : ''}"
          @click="${this._toggleMenu}"
          aria-label="${this._menuOpen ? 'Close menu' : 'Open menu'}"
          aria-expanded="${this._menuOpen}"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <nav
        class="mobile-menu ${this._menuOpen ? 'open' : ''}"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <slot name="mobile"></slot>
        ${this._mobileLinks.map(
          (link, i) => html`
            <a
              href="${link.href}"
              ?aria-current="${link.active ? 'page' : undefined}"
              aria-disabled="${link.disabled ? 'true' : 'false'}"
              @click="${(e) => this._onMobileLinkClick(e, i)}"
              >${link.text}</a
            >
          `
        )}
      </nav>
    `;
  }
}

customElements.define('header-nav', HeaderNav);
