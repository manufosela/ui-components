import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/lcd-digit.js';

describe('LcdDigit', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      expect(el).to.exist;
      expect(el.digit).to.equal('0');
      expect(el.colon).to.be.false;
    });

    it('renders 7 segments', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const segments = el.shadowRoot.querySelectorAll('.segment');
      expect(segments.length).to.equal(7);
    });

    it('renders lcd-digit container', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const container = el.shadowRoot.querySelector('.lcd-digit');
      expect(container).to.exist;
    });

    it('renders colon when enabled', async () => {
      const el = await fixture(html`<lcd-digit colon></lcd-digit>`);
      const colons = el.shadowRoot.querySelectorAll('.colon');
      expect(colons.length).to.equal(2);
    });

    it('does not render colon when disabled', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const colons = el.shadowRoot.querySelectorAll('.colon');
      expect(colons.length).to.equal(0);
    });
  });

  describe('Properties', () => {
    it('accepts digit attribute', async () => {
      const el = await fixture(html`<lcd-digit digit="5"></lcd-digit>`);
      expect(el.digit).to.equal('5');
    });

    it('reflects digit to attribute', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      el.digit = '7';
      await el.updateComplete;
      expect(el.getAttribute('digit')).to.equal('7');
    });

    it('accepts colon attribute', async () => {
      const el = await fixture(html`<lcd-digit colon></lcd-digit>`);
      expect(el.colon).to.be.true;
    });

    it('accepts colon-on attribute', async () => {
      const el = await fixture(html`<lcd-digit colon colon-on></lcd-digit>`);
      expect(el.colonOn).to.be.true;
    });
  });

  describe('Segment patterns', () => {
    // Test each digit pattern
    const digitTests = [
      { digit: '0', segments: [true, true, true, true, true, true, false] },
      { digit: '1', segments: [false, true, true, false, false, false, false] },
      { digit: '2', segments: [true, true, false, true, true, false, true] },
      { digit: '3', segments: [true, true, true, true, false, false, true] },
      { digit: '4', segments: [false, true, true, false, false, true, true] },
      { digit: '5', segments: [true, false, true, true, false, true, true] },
      { digit: '6', segments: [true, false, true, true, true, true, true] },
      { digit: '7', segments: [true, true, true, false, false, false, false] },
      { digit: '8', segments: [true, true, true, true, true, true, true] },
      { digit: '9', segments: [true, true, true, true, false, true, true] },
    ];

    digitTests.forEach(({ digit, segments }) => {
      it(`displays correct pattern for digit ${digit}`, async () => {
        const el = await fixture(html`<lcd-digit digit="${digit}"></lcd-digit>`);
        const segmentEls = el.shadowRoot.querySelectorAll('.segment');
        segments.forEach((shouldBeOn, i) => {
          const isOn = segmentEls[i].classList.contains('on');
          expect(isOn).to.equal(
            shouldBeOn,
            `Segment ${i} should be ${shouldBeOn ? 'on' : 'off'} for digit ${digit}`
          );
        });
      });
    });

    it('displays minus sign correctly', async () => {
      const el = await fixture(html`<lcd-digit digit="-"></lcd-digit>`);
      const segments = el.shadowRoot.querySelectorAll('.segment');
      const pattern = [false, false, false, false, false, false, true];
      pattern.forEach((shouldBeOn, i) => {
        const isOn = segments[i].classList.contains('on');
        expect(isOn).to.equal(shouldBeOn);
      });
    });

    it('displays blank for space', async () => {
      const el = await fixture(html`<lcd-digit digit=" "></lcd-digit>`);
      const onSegments = el.shadowRoot.querySelectorAll('.segment.on');
      expect(onSegments.length).to.equal(0);
    });

    it('displays blank for invalid character', async () => {
      const el = await fixture(html`<lcd-digit digit="x"></lcd-digit>`);
      const onSegments = el.shadowRoot.querySelectorAll('.segment.on');
      expect(onSegments.length).to.equal(0);
    });
  });

  describe('Methods', () => {
    it('setDigit() changes the digit', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      el.setDigit('5');
      expect(el.digit).to.equal('5');
    });

    it('setDigit() ignores invalid values', async () => {
      const el = await fixture(html`<lcd-digit digit="3"></lcd-digit>`);
      el.setDigit('x');
      expect(el.digit).to.equal('3');
    });

    it('setDigit() does not fire event for same value', async () => {
      const el = await fixture(html`<lcd-digit digit="5"></lcd-digit>`);
      let eventFired = false;
      el.addEventListener('digit-changed', () => {
        eventFired = true;
      });
      el.setDigit('5');
      expect(eventFired).to.be.false;
    });

    it('increment() increases digit', async () => {
      const el = await fixture(html`<lcd-digit digit="3"></lcd-digit>`);
      el.increment();
      expect(el.digit).to.equal('4');
    });

    it('increment() wraps from 9 to 0', async () => {
      const el = await fixture(html`<lcd-digit digit="9"></lcd-digit>`);
      el.increment();
      expect(el.digit).to.equal('0');
    });

    it('decrement() decreases digit', async () => {
      const el = await fixture(html`<lcd-digit digit="5"></lcd-digit>`);
      el.decrement();
      expect(el.digit).to.equal('4');
    });

    it('decrement() wraps from 0 to 9', async () => {
      const el = await fixture(html`<lcd-digit digit="0"></lcd-digit>`);
      el.decrement();
      expect(el.digit).to.equal('9');
    });

    it('increment() does nothing for non-numeric digit', async () => {
      const el = await fixture(html`<lcd-digit digit="-"></lcd-digit>`);
      el.increment();
      expect(el.digit).to.equal('-');
    });

    it('decrement() does nothing for non-numeric digit', async () => {
      const el = await fixture(html`<lcd-digit digit="-"></lcd-digit>`);
      el.decrement();
      expect(el.digit).to.equal('-');
    });
  });

  describe('Events', () => {
    it('dispatches digit-changed event on setDigit()', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const listener = oneEvent(el, 'digit-changed');
      el.setDigit('7');
      const event = await listener;
      expect(event.detail.digit).to.equal('7');
    });

    it('dispatches digit-changed event on increment()', async () => {
      const el = await fixture(html`<lcd-digit digit="3"></lcd-digit>`);
      const listener = oneEvent(el, 'digit-changed');
      el.increment();
      const event = await listener;
      expect(event.detail.digit).to.equal('4');
    });

    it('dispatches digit-changed event on decrement()', async () => {
      const el = await fixture(html`<lcd-digit digit="5"></lcd-digit>`);
      const listener = oneEvent(el, 'digit-changed');
      el.decrement();
      const event = await listener;
      expect(event.detail.digit).to.equal('4');
    });

    it('event bubbles', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const listener = oneEvent(el, 'digit-changed');
      el.setDigit('1');
      const event = await listener;
      expect(event.bubbles).to.be.true;
    });

    it('event is composed', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const listener = oneEvent(el, 'digit-changed');
      el.setDigit('2');
      const event = await listener;
      expect(event.composed).to.be.true;
    });
  });

  describe('Colon display', () => {
    it('colon has "on" class when colonOn is true', async () => {
      const el = await fixture(html`<lcd-digit colon colon-on></lcd-digit>`);
      const colons = el.shadowRoot.querySelectorAll('.colon.on');
      expect(colons.length).to.equal(2);
    });

    it('colon does not have "on" class when colonOn is false', async () => {
      const el = await fixture(html`<lcd-digit colon></lcd-digit>`);
      const colons = el.shadowRoot.querySelectorAll('.colon.on');
      expect(colons.length).to.equal(0);
    });

    it('colon state can be toggled', async () => {
      const el = await fixture(html`<lcd-digit colon></lcd-digit>`);
      el.colonOn = true;
      await el.updateComplete;
      let colons = el.shadowRoot.querySelectorAll('.colon.on');
      expect(colons.length).to.equal(2);

      el.colonOn = false;
      await el.updateComplete;
      colons = el.shadowRoot.querySelectorAll('.colon.on');
      expect(colons.length).to.equal(0);
    });
  });

  describe('Accessibility', () => {
    it('has img role on container', async () => {
      const el = await fixture(html`<lcd-digit></lcd-digit>`);
      const container = el.shadowRoot.querySelector('.lcd-digit');
      expect(container.getAttribute('role')).to.equal('img');
    });

    it('has aria-label with digit value', async () => {
      const el = await fixture(html`<lcd-digit digit="5"></lcd-digit>`);
      const container = el.shadowRoot.querySelector('.lcd-digit');
      expect(container.getAttribute('aria-label')).to.include('5');
    });
  });
});
