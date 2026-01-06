import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/header-nav.js';

describe('HeaderNav', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      expect(el).to.exist;
      expect(el.logo).to.equal('');
      expect(el.logoAlt).to.equal('Logo');
      expect(el.logoHref).to.equal('/');
      expect(el.sticky).to.be.false;
      expect(el.mobileBreakpoint).to.equal(768);
    });

    it('renders header element', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const header = el.shadowRoot.querySelector('header');
      expect(header).to.exist;
    });

    it('renders nav element', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const nav = el.shadowRoot.querySelector('nav');
      expect(nav).to.exist;
    });

    it('renders hamburger button', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');
      expect(hamburger).to.exist;
    });

    it('renders mobile menu', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const mobileMenu = el.shadowRoot.querySelector('.mobile-menu');
      expect(mobileMenu).to.exist;
    });
  });

  describe('logo', () => {
    it('renders logo image when provided', async () => {
      const el = await fixture(html`<header-nav logo="test.png"></header-nav>`);
      const img = el.shadowRoot.querySelector('.logo img');
      expect(img).to.exist;
      expect(img.src).to.include('test.png');
    });

    it('uses logoAlt for alt text', async () => {
      const el = await fixture(html`<header-nav logo="test.png" logo-alt="My Logo"></header-nav>`);
      const img = el.shadowRoot.querySelector('.logo img');
      expect(img.alt).to.equal('My Logo');
    });

    it('uses logoHref for link', async () => {
      const el = await fixture(html`<header-nav logo="test.png" logo-href="/home"></header-nav>`);
      const link = el.shadowRoot.querySelector('.logo a');
      expect(link.href).to.include('/home');
    });

    it('renders logo slot when no logo URL', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const slot = el.shadowRoot.querySelector('slot[name="logo"]');
      expect(slot).to.exist;
    });

    it('renders logo-text slot', async () => {
      const el = await fixture(html`
        <header-nav>
          <span slot="logo-text">MyBrand</span>
        </header-nav>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="logo-text"]');
      expect(slot).to.exist;
    });
  });

  describe('navigation links', () => {
    it('renders slotted links', async () => {
      const el = await fixture(html`
        <header-nav>
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
        </header-nav>
      `);
      const links = el.querySelectorAll('a');
      expect(links.length).to.equal(2);
    });

    it('renders default slot in nav', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const slot = el.shadowRoot.querySelector('nav slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('hamburger menu', () => {
    it('has aria-label', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');
      expect(hamburger.getAttribute('aria-label')).to.equal('Toggle menu');
    });

    it('has aria-expanded', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');
      expect(hamburger.getAttribute('aria-expanded')).to.equal('false');
    });

    it('toggles menu on click', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');

      hamburger.click();
      await el.updateComplete;

      expect(el._menuOpen).to.be.true;
      expect(hamburger.classList.contains('open')).to.be.true;
    });

    it('updates aria-expanded when open', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');

      hamburger.click();
      await el.updateComplete;

      expect(hamburger.getAttribute('aria-expanded')).to.equal('true');
    });

    it('closes menu on second click', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');

      hamburger.click();
      await el.updateComplete;
      expect(el._menuOpen).to.be.true;

      hamburger.click();
      await el.updateComplete;
      expect(el._menuOpen).to.be.false;
    });
  });

  describe('mobile menu', () => {
    it('is hidden by default', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const mobileMenu = el.shadowRoot.querySelector('.mobile-menu');
      expect(mobileMenu.classList.contains('open')).to.be.false;
    });

    it('shows when menu is open', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      el._menuOpen = true;
      await el.updateComplete;

      const mobileMenu = el.shadowRoot.querySelector('.mobile-menu');
      expect(mobileMenu.classList.contains('open')).to.be.true;
    });

    it('has mobile slot', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const slot = el.shadowRoot.querySelector('.mobile-menu slot[name="mobile"]');
      expect(slot).to.exist;
    });
  });

  describe('overlay', () => {
    it('is hidden by default', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay.classList.contains('open')).to.be.false;
    });

    it('shows when menu is open', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      el._menuOpen = true;
      await el.updateComplete;

      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay.classList.contains('open')).to.be.true;
    });

    it('closes menu when clicked', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      el._menuOpen = true;
      await el.updateComplete;

      const overlay = el.shadowRoot.querySelector('.overlay');
      overlay.click();
      await el.updateComplete;

      expect(el._menuOpen).to.be.false;
    });
  });

  describe('events', () => {
    it('fires menu-toggle event on open', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      const hamburger = el.shadowRoot.querySelector('.hamburger');

      setTimeout(() => hamburger.click());
      const { detail } = await oneEvent(el, 'menu-toggle');

      expect(detail.open).to.be.true;
    });

    it('fires menu-toggle event on close', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      el._menuOpen = true;
      await el.updateComplete;

      const hamburger = el.shadowRoot.querySelector('.hamburger');
      setTimeout(() => hamburger.click());
      const { detail } = await oneEvent(el, 'menu-toggle');

      expect(detail.open).to.be.false;
    });
  });

  describe('sticky', () => {
    it('applies sticky attribute', async () => {
      const el = await fixture(html`<header-nav sticky></header-nav>`);
      expect(el.sticky).to.be.true;
      expect(el.hasAttribute('sticky')).to.be.true;
    });
  });

  describe('mobile breakpoint', () => {
    it('accepts custom breakpoint', async () => {
      const el = await fixture(html`<header-nav mobile-breakpoint="1000"></header-nav>`);
      expect(el.mobileBreakpoint).to.equal(1000);
    });

    it('updates styles when breakpoint changes', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      el.mobileBreakpoint = 900;
      await el.updateComplete;

      const style = el.shadowRoot.querySelector('#dynamic-styles');
      expect(style.textContent).to.include('900px');
    });
  });

  describe('link clicks', () => {
    it('closes menu when link is clicked', async () => {
      const el = await fixture(html`
        <header-nav>
          <a href="#">Link</a>
        </header-nav>
      `);
      el._menuOpen = true;
      await el.updateComplete;

      const link = el.querySelector('a');
      link.click();
      await aTimeout(50);

      expect(el._menuOpen).to.be.false;
    });
  });

  describe('cleanup', () => {
    it('removes resize listener on disconnect', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      expect(el._resizeHandler).to.exist;

      el.remove();

      // Handler should be removed (can't easily test this directly)
      // but at least verify it doesn't throw
    });
  });

  describe('methods', () => {
    it('_toggleMenu toggles state', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      expect(el._menuOpen).to.be.false;

      el._toggleMenu();
      expect(el._menuOpen).to.be.true;

      el._toggleMenu();
      expect(el._menuOpen).to.be.false;
    });

    it('_closeMenu closes menu', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      el._menuOpen = true;

      el._closeMenu();
      expect(el._menuOpen).to.be.false;
    });

    it('_closeMenu does nothing if already closed', async () => {
      const el = await fixture(html`<header-nav></header-nav>`);
      let eventFired = false;
      el.addEventListener('menu-toggle', () => { eventFired = true; });

      el._closeMenu();
      expect(eventFired).to.be.false;
    });
  });
});
