import { LitElement, html, css } from 'lit';

/**
 * Responsive header navigation web component with hamburger menu.
 *
 * @element header-nav
 * @slot - Navigation links
 * @slot logo - Custom logo content
 * @fires menu-toggle - Fired when mobile menu is toggled
 * @cssprop --header-height - Header height (default: 60px)
 * @cssprop --header-bg - Background color (default: #fff)
 * @cssprop --header-shadow - Box shadow (default: 0 2px 4px rgba(0,0,0,0.1))
 * @cssprop --header-link-color - Link color (default: #374151)
 * @cssprop --header-link-hover - Link hover color (default: #3b82f6)
 * @cssprop --header-mobile-bp - Mobile breakpoint (default: 768px)
 */
export class HeaderNav extends LitElement {
  static properties = {
    /** Logo image URL */
    logo: { type: String },
    /** Logo alt text */
    logoAlt: { type: String, attribute: 'logo-alt' },
    /** Logo link URL */
    logoHref: { type: String, attribute: 'logo-href' },
    /** Sticky header */
    sticky: { type: Boolean },
    /** Mobile breakpoint in pixels */
    mobileBreakpoint: { type: Number, attribute: 'mobile-breakpoint' },
    /** Internal: menu open state */
    _menuOpen: { state: true },
    /** Internal: cloned links for mobile menu */
    _mobileLinks: { state: true }
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
      box-shadow: var(--header-shadow, 0 2px 4px rgba(0,0,0,0.1));
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
      gap: 1.5rem;
    }

    ::slotted(a) {
      color: var(--header-link-color, #374151);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.5rem;
      transition: color 0.2s;
    }

    ::slotted(a:hover) {
      color: var(--header-link-hover, #3b82f6);
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
      transition: transform 0.3s, opacity 0.3s;
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
      box-shadow: var(--header-shadow, 0 2px 4px rgba(0,0,0,0.1));
      flex-direction: column;
      padding: 1rem;
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
      transition: color 0.2s, background 0.2s;
    }

    .mobile-menu a:hover {
      color: var(--header-link-hover, #3b82f6);
      background: #f5f5f7;
    }

    @media (max-width: 768px) {
      nav {
        display: none;
      }

      .hamburger {
        display: flex;
      }
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
  `;

  constructor() {
    super();
    this.logo = '';
    this.logoAlt = 'Logo';
    this.logoHref = '/';
    this.sticky = false;
    this.mobileBreakpoint = 768;
    this._menuOpen = false;
    this._mobileLinks = [];
  }

  _toggleMenu() {
    this._menuOpen = !this._menuOpen;
    this.dispatchEvent(new CustomEvent('menu-toggle', {
      detail: { open: this._menuOpen },
      bubbles: true,
      composed: true
    }));
  }

  _closeMenu() {
    if (this._menuOpen) {
      this._menuOpen = false;
      this.dispatchEvent(new CustomEvent('menu-toggle', {
        detail: { open: false },
        bubbles: true,
        composed: true
      }));
    }
  }

  _handleLinkClick() {
    this._closeMenu();
  }

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

  updated(changedProps) {
    if (changedProps.has('mobileBreakpoint')) {
      this._updateMobileStyles();
    }
  }

  _updateMobileStyles() {
    const style = this.shadowRoot.querySelector('#dynamic-styles');
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

  firstUpdated() {
    this._updateMobileStyles();
    this._updateMobileLinks();

    // Listen for slot changes to update mobile links
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    if (slot) {
      slot.addEventListener('slotchange', () => this._updateMobileLinks());
    }

    // Handle clicks on slotted links to close mobile menu
    this.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        this._closeMenu();
      }
    });
  }

  _updateMobileLinks() {
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    if (slot) {
      const links = slot.assignedElements().filter(el => el.tagName === 'A');
      this._mobileLinks = links.map(link => ({
        href: link.getAttribute('href') || '#',
        text: link.textContent.trim()
      }));
    }
  }

  render() {
    return html`
      <style id="dynamic-styles"></style>
      <div class="overlay ${this._menuOpen ? 'open' : ''}" @click="${this._closeMenu}"></div>
      <header>
        <div class="logo">
          ${this.logo ? html`
            <a href="${this.logoHref}">
              <img src="${this.logo}" alt="${this.logoAlt}" />
            </a>
          ` : html`
            <slot name="logo">
              <a href="${this.logoHref}" class="logo-text">
                <slot name="logo-text">Logo</slot>
              </a>
            </slot>
          `}
        </div>

        <nav>
          <slot></slot>
        </nav>

        <button
          class="hamburger ${this._menuOpen ? 'open' : ''}"
          @click="${this._toggleMenu}"
          aria-label="Toggle menu"
          aria-expanded="${this._menuOpen}"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <div class="mobile-menu ${this._menuOpen ? 'open' : ''}">
        <slot name="mobile"></slot>
        ${this._mobileLinks.map(link => html`
          <a href="${link.href}" @click="${this._closeMenu}">${link.text}</a>
        `)}
      </div>
    `;
  }
}

customElements.define('header-nav', HeaderNav);
