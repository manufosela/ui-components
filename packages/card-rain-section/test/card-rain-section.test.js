import { html, fixture, expect } from '@open-wc/testing';
import '../src/card-rain-section.js';

describe('CardRainSection', () => {
  describe('rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<card-rain-section></card-rain-section>`);
      expect(el).to.exist;
      expect(el.scrollHeight).to.equal(300);
      expect(el.fallMode).to.equal('drop');
      expect(el.mobileBreakpoint).to.equal(768);
    });

    it('has proper shadow DOM structure', async () => {
      const el = await fixture(html`
        <card-rain-section>
          <span slot="title">Title</span>
          <div slot="card">Card 1</div>
        </card-rain-section>
      `);
      await el.updateComplete;

      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller).to.exist;

      const canvas = el.shadowRoot.querySelector('.canvas');
      expect(canvas).to.exist;

      const titleText = el.shadowRoot.querySelector('.title-text');
      expect(titleText).to.exist;
    });

    it('renders actions slot container', async () => {
      const el = await fixture(html`
        <card-rain-section>
          <button slot="actions">Click me</button>
        </card-rain-section>
      `);
      await el.updateComplete;

      const actionsLayer = el.shadowRoot.querySelector('.actions-layer');
      expect(actionsLayer).to.exist;

      const actionsSlot = actionsLayer.querySelector('slot[name="actions"]');
      expect(actionsSlot).to.exist;
    });
  });

  describe('attributes', () => {
    it('accepts scroll-height attribute', async () => {
      const el = await fixture(html`<card-rain-section scroll-height="500"></card-rain-section>`);
      expect(el.scrollHeight).to.equal(500);
    });

    it('accepts fall-mode attribute with drop value', async () => {
      const el = await fixture(html`<card-rain-section fall-mode="drop"></card-rain-section>`);
      expect(el.fallMode).to.equal('drop');
    });

    it('accepts fall-mode attribute with zoom value', async () => {
      const el = await fixture(html`<card-rain-section fall-mode="zoom"></card-rain-section>`);
      expect(el.fallMode).to.equal('zoom');
    });

    it('accepts mobile-breakpoint attribute', async () => {
      const el = await fixture(
        html`<card-rain-section mobile-breakpoint="1024"></card-rain-section>`
      );
      expect(el.mobileBreakpoint).to.equal(1024);
    });
  });

  describe('slots', () => {
    it('renders title slot content in title-text div', async () => {
      const el = await fixture(html`
        <card-rain-section>
          <span slot="title">My Title</span>
        </card-rain-section>
      `);
      await el.updateComplete;

      const titleText = el.shadowRoot.querySelector('.title-text');
      expect(titleText).to.exist;
      expect(titleText.innerHTML).to.include('My Title');
    });

    it('renders card slots as .card wrappers', async () => {
      const el = await fixture(html`
        <card-rain-section>
          <div slot="card">Card A</div>
          <div slot="card">Card B</div>
          <div slot="card">Card C</div>
        </card-rain-section>
      `);
      await el.updateComplete;

      const cards = el.shadowRoot.querySelectorAll('.card');
      expect(cards.length).to.equal(3);
    });

    it('reassigns card slot names to indexed slots', async () => {
      const el = await fixture(html`
        <card-rain-section>
          <div slot="card" id="c1">Card 1</div>
          <div slot="card" id="c2">Card 2</div>
        </card-rain-section>
      `);
      await el.updateComplete;

      const c1 = el.querySelector('#c1');
      const c2 = el.querySelector('#c2');
      expect(c1.getAttribute('slot')).to.equal('card-0');
      expect(c2.getAttribute('slot')).to.equal('card-1');
    });

    it('has hidden title slot for source', async () => {
      const el = await fixture(html`<card-rain-section></card-rain-section>`);
      await el.updateComplete;

      const titleSlot = el.shadowRoot.querySelector('slot[name="title"]');
      expect(titleSlot).to.exist;
    });
  });

  describe('scroller height', () => {
    it('sets scroller height based on scroll-height attribute', async () => {
      const el = await fixture(html`<card-rain-section scroll-height="400"></card-rain-section>`);
      await el.updateComplete;

      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller.style.height).to.equal('400vh');
    });

    it('uses default scroller height of 300vh', async () => {
      const el = await fixture(html`<card-rain-section></card-rain-section>`);
      await el.updateComplete;

      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller.style.height).to.equal('300vh');
    });
  });

  describe('region role', () => {
    it('has role="region" on scroller', async () => {
      const el = await fixture(html`<card-rain-section></card-rain-section>`);
      await el.updateComplete;

      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller.getAttribute('role')).to.equal('region');
    });

    it('has aria-label on scroller', async () => {
      const el = await fixture(html`<card-rain-section></card-rain-section>`);
      await el.updateComplete;

      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller.getAttribute('aria-label')).to.exist;
    });
  });

  describe('accessibility', () => {
    it('passes accessibility audit', async () => {
      const el = await fixture(html`
        <card-rain-section>
          <span slot="title">Accessible Title</span>
          <div slot="card">Card content</div>
        </card-rain-section>
      `);
      await expect(el).to.be.accessible();
    });
  });
});
