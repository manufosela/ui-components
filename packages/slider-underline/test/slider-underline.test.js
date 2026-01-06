import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/slider-underline.js';

describe('SliderUnderline', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      expect(el).to.exist;
      expect(el.value).to.equal(50);
      expect(el.min).to.equal(0);
      expect(el.max).to.equal(100);
      expect(el.step).to.equal(1);
      expect(el.disabled).to.be.false;
      expect(el.showValue).to.be.true;
      expect(el.labelPosition).to.equal('above');
    });

    it('renders range input', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      const input = el.shadowRoot.querySelector('input[type="range"]');
      expect(input).to.exist;
    });

    it('renders track and fill', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      const track = el.shadowRoot.querySelector('.track');
      const fill = el.shadowRoot.querySelector('.fill');
      expect(track).to.exist;
      expect(fill).to.exist;
    });

    it('renders label when provided', async () => {
      const el = await fixture(html`<slider-underline label="Volume"></slider-underline>`);
      const label = el.shadowRoot.querySelector('.label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Volume');
    });

    it('renders value display by default', async () => {
      const el = await fixture(html`<slider-underline value="75"></slider-underline>`);
      const valueDisplay = el.shadowRoot.querySelector('.value-display');
      expect(valueDisplay).to.exist;
      expect(valueDisplay.textContent).to.include('75');
    });

    it('hides value display when showValue is false', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      el.showValue = false;
      await el.updateComplete;
      const valueDisplay = el.shadowRoot.querySelector('.value-display');
      expect(valueDisplay).to.be.null;
    });
  });

  describe('value handling', () => {
    it('reflects value attribute', async () => {
      const el = await fixture(html`<slider-underline value="75"></slider-underline>`);
      expect(el.value).to.equal(75);
    });

    it('sets input value correctly', async () => {
      const el = await fixture(html`<slider-underline value="30"></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.value).to.equal('30');
    });

    it('calculates percentage correctly', async () => {
      const el = await fixture(html`<slider-underline value="50" min="0" max="100"></slider-underline>`);
      expect(el._percentage).to.equal(50);
    });

    it('calculates percentage for custom range', async () => {
      const el = await fixture(html`<slider-underline value="150" min="100" max="200"></slider-underline>`);
      expect(el._percentage).to.equal(50);
    });

    it('updates fill width based on value', async () => {
      const el = await fixture(html`<slider-underline value="75"></slider-underline>`);
      const fill = el.shadowRoot.querySelector('.fill');
      expect(fill.style.width).to.equal('75%');
    });
  });

  describe('events', () => {
    it('fires input event on input', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');

      setTimeout(() => {
        input.value = '60';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      const event = await oneEvent(el, 'input');
      expect(event.detail.value).to.equal(60);
    });

    it('fires change event on change', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');

      setTimeout(() => {
        input.value = '80';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const event = await oneEvent(el, 'change');
      expect(event.detail.value).to.equal(80);
    });
  });

  describe('label positions', () => {
    it('shows value above by default', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      const valueDisplay = el.shadowRoot.querySelector('.value-display');
      expect(valueDisplay).to.exist;
    });

    it('shows value below when labelPosition is below', async () => {
      const el = await fixture(html`<slider-underline label-position="below"></slider-underline>`);
      const valueBelow = el.shadowRoot.querySelector('.value-below');
      expect(valueBelow).to.exist;
    });

    it('shows tooltip when labelPosition is tooltip', async () => {
      const el = await fixture(html`<slider-underline label-position="tooltip"></slider-underline>`);
      const tooltip = el.shadowRoot.querySelector('.tooltip');
      expect(tooltip).to.exist;
    });
  });

  describe('formatting', () => {
    it('displays unit suffix', async () => {
      const el = await fixture(html`<slider-underline value="50" unit="%"></slider-underline>`);
      const valueDisplay = el.shadowRoot.querySelector('.value-display');
      expect(valueDisplay.textContent).to.include('50%');
    });

    it('formats value with unit', async () => {
      const el = await fixture(html`<slider-underline value="25" unit="°C"></slider-underline>`);
      expect(el._formatValue(25)).to.equal('25°C');
    });
  });

  describe('programmatic control', () => {
    it('setValue() sets value within range', async () => {
      const el = await fixture(html`<slider-underline></slider-underline>`);
      el.setValue(75);
      expect(el.value).to.equal(75);
    });

    it('setValue() clamps to max', async () => {
      const el = await fixture(html`<slider-underline max="100"></slider-underline>`);
      el.setValue(150);
      expect(el.value).to.equal(100);
    });

    it('setValue() clamps to min', async () => {
      const el = await fixture(html`<slider-underline min="0"></slider-underline>`);
      el.setValue(-10);
      expect(el.value).to.equal(0);
    });

    it('setValue() fires change event', async () => {
      const el = await fixture(html`<slider-underline value="50"></slider-underline>`);

      setTimeout(() => el.setValue(75));
      const event = await oneEvent(el, 'change');

      expect(event.detail.value).to.equal(75);
    });

    it('setValue() does not fire event if value unchanged', async () => {
      const el = await fixture(html`<slider-underline value="50"></slider-underline>`);

      let eventFired = false;
      el.addEventListener('change', () => { eventFired = true; });
      el.setValue(50);

      await aTimeout(50);
      expect(eventFired).to.be.false;
    });

    it('increase() adds step to value', async () => {
      const el = await fixture(html`<slider-underline value="50" step="5"></slider-underline>`);
      el.increase();
      expect(el.value).to.equal(55);
    });

    it('decrease() subtracts step from value', async () => {
      const el = await fixture(html`<slider-underline value="50" step="5"></slider-underline>`);
      el.decrease();
      expect(el.value).to.equal(45);
    });

    it('reset() sets value to min', async () => {
      const el = await fixture(html`<slider-underline value="50" min="10"></slider-underline>`);
      el.reset();
      expect(el.value).to.equal(10);
    });
  });

  describe('disabled state', () => {
    it('reflects disabled attribute', async () => {
      const el = await fixture(html`<slider-underline disabled></slider-underline>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('disables input when disabled', async () => {
      const el = await fixture(html`<slider-underline disabled></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.disabled).to.be.true;
    });
  });

  describe('accessibility', () => {
    it('input has aria-label', async () => {
      const el = await fixture(html`<slider-underline label="Volume"></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.getAttribute('aria-label')).to.equal('Volume');
    });

    it('input has aria-valuemin', async () => {
      const el = await fixture(html`<slider-underline min="10"></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.getAttribute('aria-valuemin')).to.equal('10');
    });

    it('input has aria-valuemax', async () => {
      const el = await fixture(html`<slider-underline max="200"></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.getAttribute('aria-valuemax')).to.equal('200');
    });

    it('input has aria-valuenow', async () => {
      const el = await fixture(html`<slider-underline value="75"></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.getAttribute('aria-valuenow')).to.equal('75');
    });

    it('input has aria-valuetext', async () => {
      const el = await fixture(html`<slider-underline value="50" unit="%"></slider-underline>`);
      const input = el.shadowRoot.querySelector('input');
      expect(input.getAttribute('aria-valuetext')).to.equal('50%');
    });
  });

  describe('edge cases', () => {
    it('handles min equal to max', async () => {
      const el = await fixture(html`<slider-underline min="50" max="50" value="50"></slider-underline>`);
      expect(el._percentage).to.be.NaN; // Division by zero
    });

    it('handles negative values', async () => {
      const el = await fixture(html`<slider-underline min="-50" max="50" value="0"></slider-underline>`);
      expect(el._percentage).to.equal(50);
    });

    it('handles decimal step', async () => {
      const el = await fixture(html`<slider-underline step="0.1" value="5.5"></slider-underline>`);
      el.increase();
      expect(el.value).to.be.closeTo(5.6, 0.01);
    });
  });
});
