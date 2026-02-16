import { html, fixture, expect } from '@open-wc/testing';
import '../src/hero-scroll-animation.js';

describe('HeroScrollAnimation', () => {
  describe('default values', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      expect(el).to.exist;
      expect(el.scrollHeight).to.equal(450);
      expect(el.overlayOpacity).to.equal(0.5);
      expect(el.scrub).to.equal(1);
      expect(el.mobileBreakpoint).to.equal(768);
      expect(el.mobileScrollHeight).to.equal(220);
      expect(el.backgroundText).to.equal('');
    });
  });

  describe('attributes', () => {
    it('accepts background-text attribute', async () => {
      const el = await fixture(
        html`<hero-scroll-animation background-text="HERO"></hero-scroll-animation>`
      );
      expect(el.backgroundText).to.equal('HERO');
    });

    it('accepts scroll-height attribute', async () => {
      const el = await fixture(
        html`<hero-scroll-animation scroll-height="300"></hero-scroll-animation>`
      );
      expect(el.scrollHeight).to.equal(300);
    });

    it('accepts overlay-opacity attribute', async () => {
      const el = await fixture(
        html`<hero-scroll-animation overlay-opacity="0.8"></hero-scroll-animation>`
      );
      expect(el.overlayOpacity).to.equal(0.8);
    });

    it('accepts scrub attribute', async () => {
      const el = await fixture(html`<hero-scroll-animation scrub="2"></hero-scroll-animation>`);
      expect(el.scrub).to.equal(2);
    });

    it('accepts mobile-breakpoint attribute', async () => {
      const el = await fixture(
        html`<hero-scroll-animation mobile-breakpoint="1024"></hero-scroll-animation>`
      );
      expect(el.mobileBreakpoint).to.equal(1024);
    });

    it('accepts mobile-scroll-height attribute', async () => {
      const el = await fixture(
        html`<hero-scroll-animation mobile-scroll-height="180"></hero-scroll-animation>`
      );
      expect(el.mobileScrollHeight).to.equal(180);
    });
  });

  describe('slots', () => {
    it('renders content slot', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <div slot="content"><h1>Hello</h1></div>
        </hero-scroll-animation>
      `);
      const contentSlot = el.shadowRoot.querySelector('slot[name="content"]');
      expect(contentSlot).to.exist;
      const assigned = contentSlot.assignedElements();
      expect(assigned.length).to.equal(1);
      expect(assigned[0].querySelector('h1').textContent).to.equal('Hello');
    });

    it('extracts image sources from background slot', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="background" src="https://example.com/bg.jpg" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      expect(el._bgSrc).to.equal('https://example.com/bg.jpg');
    });

    it('extracts image sources from center slot', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="center" src="https://example.com/center.png" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      expect(el._centerSrc).to.equal('https://example.com/center.png');
    });

    it('extracts image sources from left slot', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="left" src="https://example.com/left.png" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      expect(el._leftSrc).to.equal('https://example.com/left.png');
    });

    it('extracts image sources from right slot', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="right" src="https://example.com/right.png" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      expect(el._rightSrc).to.equal('https://example.com/right.png');
    });
  });

  describe('shadow DOM structure', () => {
    it('has a .scroller element', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller).to.exist;
    });

    it('has a .canvas element', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      const canvas = el.shadowRoot.querySelector('.canvas');
      expect(canvas).to.exist;
    });

    it('has an .overlay element', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay).to.exist;
    });

    it('has a .content-wrapper element', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      const contentWrapper = el.shadowRoot.querySelector('.content-wrapper');
      expect(contentWrapper).to.exist;
    });

    it('has a scroller with role="region"', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      const scroller = el.shadowRoot.querySelector('.scroller');
      expect(scroller.getAttribute('role')).to.equal('region');
    });
  });

  describe('background text', () => {
    it('renders background text when provided', async () => {
      const el = await fixture(
        html`<hero-scroll-animation background-text="PREMIUM"></hero-scroll-animation>`
      );
      const bgText = el.shadowRoot.querySelector('.bg-text');
      expect(bgText).to.exist;
      expect(bgText.textContent).to.equal('PREMIUM');
    });

    it('does not render background text when not provided', async () => {
      const el = await fixture(html`<hero-scroll-animation></hero-scroll-animation>`);
      const bgText = el.shadowRoot.querySelector('.bg-text');
      expect(bgText).to.be.null;
    });
  });

  describe('rendered images', () => {
    it('renders center image when src is provided', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="center" src="https://example.com/center.png" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      const centerImg = el.shadowRoot.querySelector('.center-img img');
      expect(centerImg).to.exist;
      expect(centerImg.getAttribute('src')).to.equal('https://example.com/center.png');
    });

    it('renders left side image when src is provided', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="left" src="https://example.com/left.png" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      const leftImg = el.shadowRoot.querySelector('.side-img--left img');
      expect(leftImg).to.exist;
      expect(leftImg.getAttribute('src')).to.equal('https://example.com/left.png');
    });

    it('renders right side image when src is provided', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <img slot="right" src="https://example.com/right.png" />
        </hero-scroll-animation>
      `);
      await el.updateComplete;
      const rightImg = el.shadowRoot.querySelector('.side-img--right img');
      expect(rightImg).to.exist;
      expect(rightImg.getAttribute('src')).to.equal('https://example.com/right.png');
    });
  });

  describe('accessibility', () => {
    it('passes accessibility audit', async () => {
      const el = await fixture(html`
        <hero-scroll-animation>
          <div slot="content"><h1 style="color: #ffffff;">Hero Title</h1></div>
        </hero-scroll-animation>
      `);
      await expect(el).to.be.accessible();
    });
  });
});
