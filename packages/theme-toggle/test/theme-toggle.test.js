import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/theme-toggle.js';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clean up localStorage and document state
    localStorage.removeItem('theme');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      expect(el).to.exist;
      expect(el.persist).to.be.true;
      expect(el.storageKey).to.equal('theme');
    });

    it('renders the toggle container', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const toggle = el.shadowRoot.querySelector('.theme-toggle');
      expect(toggle).to.exist;
    });

    it('renders light and dark labels', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const labels = el.shadowRoot.querySelectorAll('label');
      expect(labels.length).to.equal(2);
    });

    it('renders sun and moon icons', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const svgs = el.shadowRoot.querySelectorAll('svg');
      expect(svgs.length).to.equal(2);
    });

    it('renders radio inputs', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const inputs = el.shadowRoot.querySelectorAll('input[type="radio"]');
      expect(inputs.length).to.equal(2);
    });
  });

  describe('Properties', () => {
    it('accepts theme attribute', async () => {
      const el = await fixture(html`<theme-toggle theme="dark"></theme-toggle>`);
      expect(el.theme).to.equal('dark');
    });

    it('reflects theme to attribute', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      el.theme = 'dark';
      await el.updateComplete;
      expect(el.getAttribute('theme')).to.equal('dark');
    });

    it('accepts persist attribute', async () => {
      const el = await fixture(html`<theme-toggle persist="false"></theme-toggle>`);
      el.persist = false;
      expect(el.persist).to.be.false;
    });

    it('accepts storage-key attribute', async () => {
      const el = await fixture(html`<theme-toggle storage-key="app-theme"></theme-toggle>`);
      expect(el.storageKey).to.equal('app-theme');
    });
  });

  describe('Theme switching', () => {
    it('switches to dark theme', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      el.setTheme('dark');
      expect(el.theme).to.equal('dark');
    });

    it('switches to light theme', async () => {
      const el = await fixture(html`<theme-toggle theme="dark"></theme-toggle>`);
      el.setTheme('light');
      expect(el.theme).to.equal('light');
    });

    it('toggles theme', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      el.toggle();
      expect(el.theme).to.equal('dark');
      el.toggle();
      expect(el.theme).to.equal('light');
    });

    it('ignores invalid theme values', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      el.setTheme('invalid');
      expect(el.theme).to.equal('light');
    });

    it('ignores same theme value', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      let eventFired = false;
      el.addEventListener('theme-changed', () => { eventFired = true; });
      el.setTheme('light');
      expect(eventFired).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches theme-changed event', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      const listener = oneEvent(el, 'theme-changed');
      el.setTheme('dark');
      const event = await listener;
      expect(event.detail.theme).to.equal('dark');
    });

    it('event bubbles', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      const listener = oneEvent(el, 'theme-changed');
      el.setTheme('dark');
      const event = await listener;
      expect(event.bubbles).to.be.true;
    });

    it('event is composed', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      const listener = oneEvent(el, 'theme-changed');
      el.setTheme('dark');
      const event = await listener;
      expect(event.composed).to.be.true;
    });
  });

  describe('Persistence', () => {
    it('saves theme to localStorage when persist is true', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      el.setTheme('dark');
      expect(localStorage.getItem('theme')).to.equal('dark');
    });

    it('does not save theme when persist is false', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      el.persist = false;
      el.setTheme('dark');
      expect(localStorage.getItem('theme')).to.be.null;
    });

    it('uses custom storage key', async () => {
      const el = await fixture(html`<theme-toggle theme="light" storage-key="my-theme"></theme-toggle>`);
      el.setTheme('dark');
      expect(localStorage.getItem('my-theme')).to.equal('dark');
      localStorage.removeItem('my-theme');
    });

    it('loads saved theme on connect', async () => {
      localStorage.setItem('theme', 'dark');
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      expect(el.theme).to.equal('dark');
    });
  });

  describe('Document integration', () => {
    it('sets data-theme attribute on documentElement', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      el.setTheme('dark');
      expect(document.documentElement.dataset.theme).to.equal('dark');
    });

    it('adds dark class to documentElement when dark', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      el.setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).to.be.true;
    });

    it('removes dark class when light', async () => {
      const el = await fixture(html`<theme-toggle theme="dark"></theme-toggle>`);
      el.setTheme('light');
      expect(document.documentElement.classList.contains('dark')).to.be.false;
    });
  });

  describe('Active state', () => {
    it('marks light label as active when theme is light', async () => {
      const el = await fixture(html`<theme-toggle theme="light"></theme-toggle>`);
      const labels = el.shadowRoot.querySelectorAll('label');
      expect(labels[0].classList.contains('active')).to.be.true;
      expect(labels[1].classList.contains('active')).to.be.false;
    });

    it('marks dark label as active when theme is dark', async () => {
      const el = await fixture(html`<theme-toggle theme="dark"></theme-toggle>`);
      await el.updateComplete;
      const labels = el.shadowRoot.querySelectorAll('label');
      expect(labels[0].classList.contains('active')).to.be.false;
      expect(labels[1].classList.contains('active')).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('has radiogroup role', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const toggle = el.shadowRoot.querySelector('.theme-toggle');
      expect(toggle.getAttribute('role')).to.equal('radiogroup');
    });

    it('has aria-label on toggle', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const toggle = el.shadowRoot.querySelector('.theme-toggle');
      expect(toggle.getAttribute('aria-label')).to.equal('Theme toggle');
    });

    it('has aria-label on radio inputs', async () => {
      const el = await fixture(html`<theme-toggle></theme-toggle>`);
      const inputs = el.shadowRoot.querySelectorAll('input');
      expect(inputs[0].getAttribute('aria-label')).to.equal('Light theme');
      expect(inputs[1].getAttribute('aria-label')).to.equal('Dark theme');
    });
  });
});
