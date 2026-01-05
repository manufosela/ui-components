import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/stars-rating.js';

describe('StarsRating', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      expect(el).to.exist;
      expect(el.rating).to.equal(0);
      expect(el.numstars).to.equal(5);
      expect(el.manual).to.be.false;
    });

    it('renders 5 stars by default', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      expect(stars.length).to.equal(5);
    });

    it('renders custom number of stars', async () => {
      const el = await fixture(html`<stars-rating numstars="10"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      expect(stars.length).to.equal(10);
    });

    it('renders star character', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const star = el.shadowRoot.querySelector('.star');
      expect(star.textContent).to.equal('★');
    });

    it('renders custom star character', async () => {
      const el = await fixture(html`<stars-rating star="♥"></stars-rating>`);
      const star = el.shadowRoot.querySelector('.star');
      expect(star.textContent).to.equal('♥');
    });

    it('renders reset button when manual and reset are true', async () => {
      const el = await fixture(html`<stars-rating manual reset></stars-rating>`);
      const resetBtn = el.shadowRoot.querySelector('.reset-btn');
      expect(resetBtn).to.exist;
    });

    it('does not render reset button when not manual', async () => {
      const el = await fixture(html`<stars-rating reset></stars-rating>`);
      const resetBtn = el.shadowRoot.querySelector('.reset-btn');
      expect(resetBtn).to.be.null;
    });
  });

  describe('Properties', () => {
    it('accepts rating attribute', async () => {
      const el = await fixture(html`<stars-rating rating="3"></stars-rating>`);
      expect(el.rating).to.equal(3);
    });

    it('reflects rating to attribute', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      el.rating = 4;
      await el.updateComplete;
      expect(el.getAttribute('rating')).to.equal('4');
    });

    it('accepts manual attribute', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      expect(el.manual).to.be.true;
    });

    it('accepts half attribute', async () => {
      const el = await fixture(html`<stars-rating half></stars-rating>`);
      expect(el.half).to.be.true;
    });

    it('accepts disabled attribute', async () => {
      const el = await fixture(html`<stars-rating disabled></stars-rating>`);
      expect(el.disabled).to.be.true;
    });
  });

  describe('Star styling', () => {
    it('marks filled stars based on rating', async () => {
      const el = await fixture(html`<stars-rating rating="3"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      expect(stars[0].classList.contains('filled')).to.be.true;
      expect(stars[1].classList.contains('filled')).to.be.true;
      expect(stars[2].classList.contains('filled')).to.be.true;
      expect(stars[3].classList.contains('filled')).to.be.false;
      expect(stars[4].classList.contains('filled')).to.be.false;
    });

    it('shows half-filled star when half and decimal rating', async () => {
      const el = await fixture(html`<stars-rating half rating="2.5"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      expect(stars[0].classList.contains('filled')).to.be.true;
      expect(stars[1].classList.contains('filled')).to.be.true;
      expect(stars[2].classList.contains('half')).to.be.true;
      expect(stars[3].classList.contains('filled')).to.be.false;
    });
  });

  describe('Interaction', () => {
    it('does not respond to clicks when not manual', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[2].click();
      expect(el.rating).to.equal(0);
    });

    it('responds to clicks when manual', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[2].click();
      expect(el.rating).to.equal(3);
    });

    it('does not respond to clicks when disabled', async () => {
      const el = await fixture(html`<stars-rating manual disabled></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[2].click();
      expect(el.rating).to.equal(0);
    });

    it('does not fire event when clicking same rating', async () => {
      const el = await fixture(html`<stars-rating manual rating="3"></stars-rating>`);
      let eventFired = false;
      el.addEventListener('rating-changed', () => { eventFired = true; });
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[2].click();
      expect(eventFired).to.be.false;
    });
  });

  describe('Methods', () => {
    it('setRating() changes the rating', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      el.setRating(4);
      expect(el.rating).to.equal(4);
    });

    it('setRating() clamps to max', async () => {
      const el = await fixture(html`<stars-rating numstars="5"></stars-rating>`);
      el.setRating(10);
      expect(el.rating).to.equal(5);
    });

    it('setRating() clamps to min', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      el.setRating(-5);
      expect(el.rating).to.equal(0);
    });

    it('setRating() ignores non-numeric values', async () => {
      const el = await fixture(html`<stars-rating rating="3"></stars-rating>`);
      el.setRating('invalid');
      expect(el.rating).to.equal(3);
    });

    it('resetRating() sets rating to 0', async () => {
      const el = await fixture(html`<stars-rating rating="4"></stars-rating>`);
      el.resetRating();
      expect(el.rating).to.equal(0);
    });

    it('resetRating() does not fire event when already 0', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      let eventFired = false;
      el.addEventListener('rating-changed', () => { eventFired = true; });
      el.resetRating();
      expect(eventFired).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches rating-changed event on click', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const listener = oneEvent(el, 'rating-changed');
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[3].click();
      const event = await listener;
      expect(event.detail.rating).to.equal(4);
    });

    it('event bubbles', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const listener = oneEvent(el, 'rating-changed');
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].click();
      const event = await listener;
      expect(event.bubbles).to.be.true;
    });

    it('event is composed', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const listener = oneEvent(el, 'rating-changed');
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].click();
      const event = await listener;
      expect(event.composed).to.be.true;
    });

    it('dispatches event on setRating()', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const listener = oneEvent(el, 'rating-changed');
      el.setRating(3);
      const event = await listener;
      expect(event.detail.rating).to.equal(3);
    });

    it('dispatches event on resetRating()', async () => {
      const el = await fixture(html`<stars-rating rating="3"></stars-rating>`);
      const listener = oneEvent(el, 'rating-changed');
      el.resetRating();
      const event = await listener;
      expect(event.detail.rating).to.equal(0);
    });
  });

  describe('Keyboard navigation', () => {
    it('responds to Enter key when manual', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.rating).to.equal(3);
    });

    it('responds to Space key when manual', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(el.rating).to.equal(2);
    });

    it('increments with ArrowRight', async () => {
      const el = await fixture(html`<stars-rating manual rating="2"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(el.rating).to.equal(3);
    });

    it('decrements with ArrowLeft', async () => {
      const el = await fixture(html`<stars-rating manual rating="2"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(el.rating).to.equal(1);
    });

    it('increments by 0.5 with half enabled', async () => {
      const el = await fixture(html`<stars-rating manual half rating="2"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(el.rating).to.equal(2.5);
    });

    it('does not exceed max rating', async () => {
      const el = await fixture(html`<stars-rating manual numstars="5" rating="5"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(el.rating).to.equal(5);
    });

    it('does not go below 0', async () => {
      const el = await fixture(html`<stars-rating manual rating="0"></stars-rating>`);
      const stars = el.shadowRoot.querySelectorAll('.star');
      stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(el.rating).to.equal(0);
    });
  });

  describe('Accessibility', () => {
    it('has radiogroup role on container', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const container = el.shadowRoot.querySelector('.stars-container');
      expect(container.getAttribute('role')).to.equal('radiogroup');
    });

    it('has aria-label on container', async () => {
      const el = await fixture(html`<stars-rating rating="3"></stars-rating>`);
      const container = el.shadowRoot.querySelector('.stars-container');
      expect(container.getAttribute('aria-label')).to.include('3 of 5 stars');
    });

    it('stars have radio role', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const star = el.shadowRoot.querySelector('.star');
      expect(star.getAttribute('role')).to.equal('radio');
    });

    it('stars are focusable when manual', async () => {
      const el = await fixture(html`<stars-rating manual></stars-rating>`);
      const star = el.shadowRoot.querySelector('.star');
      expect(star.getAttribute('tabindex')).to.equal('0');
    });

    it('stars are not focusable when not manual', async () => {
      const el = await fixture(html`<stars-rating></stars-rating>`);
      const star = el.shadowRoot.querySelector('.star');
      expect(star.getAttribute('tabindex')).to.equal('-1');
    });

    it('reset button has aria-label', async () => {
      const el = await fixture(html`<stars-rating manual reset></stars-rating>`);
      const btn = el.shadowRoot.querySelector('.reset-btn');
      expect(btn.getAttribute('aria-label')).to.equal('Reset rating');
    });
  });

  describe('Reset button', () => {
    it('clicking reset button resets rating', async () => {
      const el = await fixture(html`<stars-rating manual reset rating="4"></stars-rating>`);
      const btn = el.shadowRoot.querySelector('.reset-btn');
      btn.click();
      expect(el.rating).to.equal(0);
    });

    it('reset button dispatches event', async () => {
      const el = await fixture(html`<stars-rating manual reset rating="4"></stars-rating>`);
      const listener = oneEvent(el, 'rating-changed');
      const btn = el.shadowRoot.querySelector('.reset-btn');
      btn.click();
      const event = await listener;
      expect(event.detail.rating).to.equal(0);
    });

    it('does not show when disabled', async () => {
      const el = await fixture(html`<stars-rating manual reset disabled></stars-rating>`);
      const btn = el.shadowRoot.querySelector('.reset-btn');
      expect(btn).to.be.null;
    });
  });
});
