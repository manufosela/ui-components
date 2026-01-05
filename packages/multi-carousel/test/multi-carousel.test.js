import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/multi-carousel.js';

describe('MultiCarousel', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<multi-carousel></multi-carousel>`);
      expect(el).to.exist;
      expect(el.current).to.equal(0);
      expect(el.showNav).to.be.true;
      expect(el.showArrows).to.be.true;
      expect(el.loop).to.be.true;
    });

    it('renders slides from slot', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      expect(el._slideCount).to.equal(3);
    });

    it('renders navigation dots', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const dots = el.shadowRoot.querySelectorAll('.nav-dot');
      expect(dots.length).to.equal(2);
    });

    it('renders arrows', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const arrows = el.shadowRoot.querySelectorAll('.arrow');
      expect(arrows.length).to.equal(2);
    });

    it('hides navigation when show-nav is false', async () => {
      const el = await fixture(html`
        <multi-carousel .showNav="${false}">
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const nav = el.shadowRoot.querySelector('.navigation');
      expect(nav).to.be.null;
    });

    it('hides arrows when show-arrows is false', async () => {
      const el = await fixture(html`
        <multi-carousel .showArrows="${false}">
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const arrows = el.shadowRoot.querySelector('.arrows');
      expect(arrows).to.be.null;
    });
  });

  describe('Navigation', () => {
    it('goes to next slide', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      el.next();
      expect(el.current).to.equal(1);
    });

    it('goes to previous slide', async () => {
      const el = await fixture(html`
        <multi-carousel .current="${2}">
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      el.prev();
      expect(el.current).to.equal(1);
    });

    it('goes to specific slide', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      el.goTo(2);
      expect(el.current).to.equal(2);
    });

    it('loops to first slide from last', async () => {
      const el = await fixture(html`
        <multi-carousel .current="${2}">
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      el.next();
      expect(el.current).to.equal(0);
    });

    it('loops to last slide from first', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      el.prev();
      expect(el.current).to.equal(2);
    });

    it('does not loop when loop is false', async () => {
      const el = await fixture(html`
        <multi-carousel .loop="${false}" .current="${2}">
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      el.next();
      expect(el.current).to.equal(2);
    });

    it('responds to nav dot click', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const dots = el.shadowRoot.querySelectorAll('.nav-dot');
      dots[2].click();
      expect(el.current).to.equal(2);
    });

    it('responds to arrow click', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const nextArrow = el.shadowRoot.querySelector('.arrow.next');
      nextArrow.click();
      expect(el.current).to.equal(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('goes to next slide on ArrowRight', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const carousel = el.shadowRoot.querySelector('.carousel');
      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(el.current).to.equal(1);
    });

    it('goes to previous slide on ArrowLeft', async () => {
      const el = await fixture(html`
        <multi-carousel .current="${1}">
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;
      const carousel = el.shadowRoot.querySelector('.carousel');
      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(el.current).to.equal(0);
    });
  });

  describe('Events', () => {
    it('dispatches slide-change on navigation', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;

      setTimeout(() => el.next());
      const event = await oneEvent(el, 'slide-change');

      expect(event.detail.index).to.equal(1);
      expect(event.detail.total).to.equal(2);
    });
  });

  describe('Sync', () => {
    it('syncs with master carousel', async () => {
      const master = await fixture(html`
        <multi-carousel id="master" master>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);

      const slave = await fixture(html`
        <multi-carousel master-id="master">
          <div>Slide A</div>
          <div>Slide B</div>
        </multi-carousel>
      `);

      await master.updateComplete;
      await slave.updateComplete;

      master.next();
      await slave.updateComplete;

      expect(slave.current).to.equal(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;

      const carousel = el.shadowRoot.querySelector('.carousel');
      expect(carousel.getAttribute('role')).to.equal('region');
      expect(carousel.getAttribute('aria-roledescription')).to.equal('carousel');
    });

    it('navigation has tablist role', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;

      const nav = el.shadowRoot.querySelector('.navigation');
      expect(nav.getAttribute('role')).to.equal('tablist');
    });

    it('dots have tab role', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;

      const dots = el.shadowRoot.querySelectorAll('.nav-dot');
      dots.forEach(dot => {
        expect(dot.getAttribute('role')).to.equal('tab');
      });
    });

    it('active dot has aria-selected true', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </multi-carousel>
      `);
      await el.updateComplete;

      const activeDot = el.shadowRoot.querySelector('.nav-dot.active');
      expect(activeDot.getAttribute('aria-selected')).to.equal('true');
    });
  });

  describe('Single or no slides', () => {
    it('hides navigation with single slide', async () => {
      const el = await fixture(html`
        <multi-carousel>
          <div>Only Slide</div>
        </multi-carousel>
      `);
      await el.updateComplete;

      const nav = el.shadowRoot.querySelector('.navigation');
      const arrows = el.shadowRoot.querySelector('.arrows');
      expect(nav).to.be.null;
      expect(arrows).to.be.null;
    });

    it('handles no slides gracefully', async () => {
      const el = await fixture(html`<multi-carousel></multi-carousel>`);
      await el.updateComplete;
      expect(el._slideCount).to.equal(0);
      el.next(); // Should not throw
      expect(el.current).to.equal(0);
    });
  });
});
