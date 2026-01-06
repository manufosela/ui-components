import { html } from 'lit';
import { fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/arc-slider.js';

describe('ArcSlider', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      expect(el).to.exist;
      expect(el.minRange).to.equal(0);
      expect(el.maxRange).to.equal(100);
      expect(el.step).to.equal(1);
      expect(el.disabled).to.be.false;
    });

    it('renders the slider container', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const container = el.shadowRoot.querySelector('.arc-slider-container');
      expect(container).to.exist;
    });

    it('renders the arc SVG', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const svg = el.shadowRoot.querySelector('.arc-svg');
      expect(svg).to.exist;
    });

    it('renders the arc path', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const path = el.shadowRoot.querySelector('.arc-path');
      expect(path).to.exist;
    });

    it('renders the thumb circle', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const thumb = el.shadowRoot.querySelector('.arc-thumb');
      expect(thumb).to.exist;
    });

    it('renders the hidden input range for accessibility', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const input = el.shadowRoot.querySelector('.sr-only');
      expect(input).to.exist;
      expect(input.type).to.equal('range');
    });

    it('displays the current value', async () => {
      const el = await fixture(html`<arc-slider arc-value="42"></arc-slider>`);
      await aTimeout(50);

      const valueDisplay = el.shadowRoot.querySelector('.value-text');
      expect(valueDisplay).to.exist;
      expect(valueDisplay.textContent).to.equal('42');
    });
  });

  describe('Properties', () => {
    it('accepts min-range attribute', async () => {
      const el = await fixture(html`<arc-slider min-range="-50"></arc-slider>`);

      expect(el.minRange).to.equal(-50);
    });

    it('accepts max-range attribute', async () => {
      const el = await fixture(html`<arc-slider max-range="200"></arc-slider>`);

      expect(el.maxRange).to.equal(200);
    });

    it('accepts arc-value attribute', async () => {
      const el = await fixture(html`<arc-slider arc-value="75"></arc-slider>`);

      expect(el.arcValue).to.equal(75);
    });

    it('accepts step attribute', async () => {
      const el = await fixture(html`<arc-slider step="5"></arc-slider>`);

      expect(el.step).to.equal(5);
    });

    it('accepts disabled attribute', async () => {
      const el = await fixture(html`<arc-slider disabled></arc-slider>`);

      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('accepts color1 attribute', async () => {
      const el = await fixture(html`<arc-slider color1="#00FF00"></arc-slider>`);

      expect(el.color1).to.equal('#00FF00');
    });

    it('accepts color2 attribute', async () => {
      const el = await fixture(html`<arc-slider color2="#0000FF"></arc-slider>`);

      expect(el.color2).to.equal('#0000FF');
    });

    it('accepts radius attribute', async () => {
      const el = await fixture(html`<arc-slider radius="150"></arc-slider>`);

      expect(el.radius).to.equal(150);
    });

    it('accepts start-angle attribute', async () => {
      const el = await fixture(html`<arc-slider start-angle="200"></arc-slider>`);

      expect(el.startAngle).to.equal(200);
    });

    it('accepts end-angle attribute', async () => {
      const el = await fixture(html`<arc-slider end-angle="340"></arc-slider>`);

      expect(el.endAngle).to.equal(340);
    });

    it('accepts stroke-width attribute', async () => {
      const el = await fixture(html`<arc-slider stroke-width="12"></arc-slider>`);

      expect(el.strokeWidth).to.equal(12);
    });

    it('reflects arc-value to attribute', async () => {
      const el = await fixture(html`<arc-slider arc-value="33"></arc-slider>`);
      await aTimeout(50);

      expect(el.getAttribute('arc-value')).to.equal('33');
    });
  });

  describe('Default values', () => {
    it('sets arcValue to middle range by default', async () => {
      const el = await fixture(html`<arc-slider min-range="0" max-range="100"></arc-slider>`);

      expect(el.arcValue).to.equal(50);
    });

    it('calculates correct middle for custom ranges', async () => {
      const el = await fixture(html`<arc-slider min-range="-100" max-range="100"></arc-slider>`);

      expect(el.arcValue).to.equal(0);
    });

    it('uses default colors when not specified', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      expect(el.color1).to.equal('#FF1122');
      expect(el.color2).to.equal('#1122FF');
    });

    it('uses default radius when not specified', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      expect(el.radius).to.equal(100);
    });

    it('uses default angles when not specified', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      expect(el.startAngle).to.equal(180);
      expect(el.endAngle).to.equal(0);
    });

    it('uses default stroke width when not specified', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      expect(el.strokeWidth).to.equal(8);
    });
  });

  describe('Color utilities', () => {
    it('converts hex to RGB correctly', () => {
      const rgb = customElements.get('arc-slider').hexToRgb('#FF5500');

      expect(rgb).to.deep.equal({ r: 255, g: 85, b: 0 });
    });

    it('converts RGB to hex correctly', () => {
      const hex = customElements.get('arc-slider').rgbToHex({ r: 255, g: 85, b: 0 });

      expect(hex).to.equal('#FF5500');
    });

    it('throws error for invalid hex color', () => {
      expect(() => customElements.get('arc-slider').hexToRgb('invalid')).to.throw();
    });

    it('calculates gradient colors', () => {
      const colors = customElements
        .get('arc-slider')
        .calculateGradientColors({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 2);

      expect(colors.length).to.equal(4);
      expect(colors[0]).to.deep.equal({ r: 0, g: 0, b: 0 });
      expect(colors[colors.length - 1]).to.deep.equal({ r: 255, g: 255, b: 255 });
    });
  });

  describe('Events', () => {
    it('dispatches change event with correct detail', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);
      await aTimeout(50);

      const listener = oneEvent(el, 'change');

      // Trigger change by updating value
      el.arcValue = 75;
      el._dispatchChange();

      const event = await listener;
      expect(event.detail.value).to.equal(75);
    });

    it('change event bubbles and is composed', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);
      await aTimeout(50);

      const listener = oneEvent(el, 'change');
      el._dispatchChange();

      const event = await listener;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('has accessible input with aria-label', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const input = el.shadowRoot.querySelector('.sr-only');
      expect(input.getAttribute('aria-label')).to.equal('Arc slider');
    });

    it('disables input when component is disabled', async () => {
      const el = await fixture(html`<arc-slider disabled></arc-slider>`);

      const input = el.shadowRoot.querySelector('.sr-only');
      expect(input.disabled).to.be.true;
    });
  });

  describe('Value clamping', () => {
    it('clamps value to min range', async () => {
      const el = await fixture(html`<arc-slider min-range="0" max-range="100"></arc-slider>`);

      const clamped = el._clampValue(-50);
      expect(clamped).to.equal(0);
    });

    it('clamps value to max range', async () => {
      const el = await fixture(html`<arc-slider min-range="0" max-range="100"></arc-slider>`);

      const clamped = el._clampValue(150);
      expect(clamped).to.equal(100);
    });

    it('returns value unchanged if within range', async () => {
      const el = await fixture(html`<arc-slider min-range="0" max-range="100"></arc-slider>`);

      const clamped = el._clampValue(50);
      expect(clamped).to.equal(50);
    });
  });

  describe('Angle calculations', () => {
    it('converts value to angle correctly for default range', async () => {
      const el = await fixture(html`<arc-slider min-range="0" max-range="100"></arc-slider>`);

      // Default: min on right (0°), max on left (180°), arc through top (270°)
      expect(el._valueToAngle(0)).to.equal(0); // Min at right
      expect(el._valueToAngle(50)).to.equal(270); // Middle at top
      expect(el._valueToAngle(100)).to.equal(180); // Max at left
    });

    it('converts angle to value correctly', async () => {
      const el = await fixture(html`<arc-slider min-range="0" max-range="100"></arc-slider>`);

      // Default: min on right, max on left
      expect(el._angleToValue(0)).to.equal(0); // Right = min
      expect(el._angleToValue(270)).to.equal(50); // Top = middle
      expect(el._angleToValue(180)).to.equal(100); // Left = max
    });

    it('calculates point on arc correctly', async () => {
      const el = await fixture(html`<arc-slider radius="100" stroke-width="8"></arc-slider>`);

      // At 0 degrees (right), x should be cx + radius, y should be cy
      const point = el._getPointOnArc(0);
      expect(point.x).to.be.closeTo(208, 0.1); // cx (108) + radius (100)
      expect(point.y).to.be.closeTo(108, 0.1); // cy (108)
    });

    it('generates valid SVG arc path', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);

      const path = el._getArcPath();
      expect(path).to.include('M ');
      expect(path).to.include(' A ');
    });
  });

  describe('Arc configuration', () => {
    it('creates different arc shapes with custom angles', async () => {
      const el1 = await fixture(html`<arc-slider start-angle="180" end-angle="0"></arc-slider>`);
      const el2 = await fixture(html`<arc-slider start-angle="225" end-angle="315"></arc-slider>`);

      const path1 = el1._getArcPath();
      const path2 = el2._getArcPath();

      expect(path1).to.not.equal(path2);
    });

    it('adjusts viewBox based on radius and stroke width', async () => {
      const el = await fixture(html`<arc-slider radius="50" stroke-width="4"></arc-slider>`);

      expect(el._viewBoxSize).to.equal(108); // (50 + 4) * 2
    });
  });

  describe('Reactivity', () => {
    it('updates colors when color1 changes', async () => {
      const el = await fixture(html`<arc-slider></arc-slider>`);
      await aTimeout(50);

      el.color1 = '#00FF00';
      await el.updateComplete;

      expect(el._colorStops.length).to.be.greaterThan(0);
    });

    it('clamps value when range changes', async () => {
      const el = await fixture(html`<arc-slider arc-value="80"></arc-slider>`);
      await aTimeout(50);

      el.maxRange = 50;
      await el.updateComplete;

      expect(el.arcValue).to.equal(50);
    });
  });
});
