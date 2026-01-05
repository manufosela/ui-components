import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../src/circle-percent.js';

describe('CirclePercent', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<circle-percent></circle-percent>`);

      expect(el).to.exist;
      expect(el.percent).to.equal(0);
      expect(el.radius).to.equal(50);
      expect(el.strokeWidth).to.equal(6);
      expect(el.showPercent).to.be.true;
    });

    it('renders the SVG element', async () => {
      const el = await fixture(html`<circle-percent></circle-percent>`);

      const svg = el.shadowRoot.querySelector('svg');
      expect(svg).to.exist;
    });

    it('renders the background circle', async () => {
      const el = await fixture(html`<circle-percent></circle-percent>`);

      const bgCircle = el.shadowRoot.querySelector('.background-circle');
      expect(bgCircle).to.exist;
    });

    it('renders the progress circle', async () => {
      const el = await fixture(html`<circle-percent></circle-percent>`);

      const progressCircle = el.shadowRoot.querySelector('.progress-circle');
      expect(progressCircle).to.exist;
    });

    it('renders the percent text when showPercent is true', async () => {
      const el = await fixture(html`<circle-percent percent="50"></circle-percent>`);

      const percentText = el.shadowRoot.querySelector('.percent-text');
      expect(percentText).to.exist;
      expect(percentText.textContent).to.equal('50%');
    });

    it('does not render percent text when showPercent is false', async () => {
      const el = await fixture(html`<circle-percent percent="50" show-percent="false"></circle-percent>`);
      el.showPercent = false;
      await el.updateComplete;

      const percentText = el.shadowRoot.querySelector('.percent-text');
      expect(percentText).to.not.exist;
    });

    it('renders the title when provided', async () => {
      const el = await fixture(html`<circle-percent title="Progress"></circle-percent>`);

      const title = el.shadowRoot.querySelector('.title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Progress');
    });

    it('does not render title when not provided', async () => {
      const el = await fixture(html`<circle-percent></circle-percent>`);

      const title = el.shadowRoot.querySelector('.title');
      expect(title).to.not.exist;
    });
  });

  describe('Properties', () => {
    it('accepts percent attribute', async () => {
      const el = await fixture(html`<circle-percent percent="75"></circle-percent>`);

      expect(el.percent).to.equal(75);
    });

    it('accepts radius attribute', async () => {
      const el = await fixture(html`<circle-percent radius="100"></circle-percent>`);

      expect(el.radius).to.equal(100);
    });

    it('accepts stroke-width attribute', async () => {
      const el = await fixture(html`<circle-percent stroke-width="10"></circle-percent>`);

      expect(el.strokeWidth).to.equal(10);
    });

    it('accepts stroke-color attribute', async () => {
      const el = await fixture(html`<circle-percent stroke-color="#ff0000"></circle-percent>`);

      expect(el.strokeColor).to.equal('#ff0000');
    });

    it('accepts title attribute', async () => {
      const el = await fixture(html`<circle-percent title="Loading"></circle-percent>`);

      expect(el.title).to.equal('Loading');
    });

    it('accepts size attribute', async () => {
      const el = await fixture(html`<circle-percent size="large"></circle-percent>`);

      expect(el.size).to.equal('large');
      expect(el.hasAttribute('size')).to.be.true;
    });
  });

  describe('Calculations', () => {
    it('calculates normalized radius correctly', async () => {
      const el = await fixture(html`<circle-percent radius="50" stroke-width="6"></circle-percent>`);

      expect(el._normalizedRadius).to.equal(47); // 50 - 6/2
    });

    it('calculates circumference correctly', async () => {
      const el = await fixture(html`<circle-percent radius="50" stroke-width="6"></circle-percent>`);

      const expectedCircumference = 2 * Math.PI * 47;
      expect(el._circumference).to.be.closeTo(expectedCircumference, 0.01);
    });

    it('calculates stroke dasharray for 0%', async () => {
      const el = await fixture(html`<circle-percent percent="0"></circle-percent>`);

      const dasharray = el._strokeDasharray;
      expect(dasharray).to.match(/^0\s/);
    });

    it('calculates stroke dasharray for 100%', async () => {
      const el = await fixture(html`<circle-percent percent="100"></circle-percent>`);

      const dasharray = el._strokeDasharray;
      const circumference = el._circumference;
      expect(dasharray).to.include(circumference.toString().substring(0, 5));
    });

    it('calculates stroke dasharray for 50%', async () => {
      const el = await fixture(html`<circle-percent percent="50"></circle-percent>`);

      const dasharray = el._strokeDasharray;
      const halfCircumference = el._circumference * 0.5;
      const parts = dasharray.split(' ');
      expect(parseFloat(parts[0])).to.be.closeTo(halfCircumference, 0.01);
    });

    it('calculates viewBox size correctly', async () => {
      const el = await fixture(html`<circle-percent radius="60"></circle-percent>`);

      expect(el._viewBoxSize).to.equal(120); // radius * 2
    });
  });

  describe('Value clamping', () => {
    it('clamps percent below 0 to 0', async () => {
      const el = await fixture(html`<circle-percent percent="-10"></circle-percent>`);

      const dasharray = el._strokeDasharray;
      expect(dasharray).to.match(/^0\s/);
    });

    it('clamps percent above 100 to 100', async () => {
      const el = await fixture(html`<circle-percent percent="150"></circle-percent>`);

      const dasharray = el._strokeDasharray;
      const circumference = el._circumference;
      const parts = dasharray.split(' ');
      expect(parseFloat(parts[0])).to.be.closeTo(circumference, 0.01);
    });
  });

  describe('SVG attributes', () => {
    it('sets correct viewBox on SVG', async () => {
      const el = await fixture(html`<circle-percent radius="50"></circle-percent>`);

      const svg = el.shadowRoot.querySelector('svg');
      expect(svg.getAttribute('viewBox')).to.equal('0 0 100 100');
    });

    it('sets correct width and height on SVG', async () => {
      const el = await fixture(html`<circle-percent radius="50"></circle-percent>`);

      const svg = el.shadowRoot.querySelector('svg');
      expect(svg.getAttribute('width')).to.equal('100');
      expect(svg.getAttribute('height')).to.equal('100');
    });

    it('sets correct stroke color on progress circle', async () => {
      const el = await fixture(html`<circle-percent stroke-color="#ff5500"></circle-percent>`);

      const progressCircle = el.shadowRoot.querySelector('.progress-circle');
      expect(progressCircle.getAttribute('stroke')).to.equal('#ff5500');
    });

    it('sets correct stroke width on circles', async () => {
      const el = await fixture(html`<circle-percent stroke-width="8"></circle-percent>`);

      const bgCircle = el.shadowRoot.querySelector('.background-circle');
      const progressCircle = el.shadowRoot.querySelector('.progress-circle');
      expect(bgCircle.getAttribute('stroke-width')).to.equal('8');
      expect(progressCircle.getAttribute('stroke-width')).to.equal('8');
    });
  });

  describe('Reactivity', () => {
    it('updates percent text when percent changes', async () => {
      const el = await fixture(html`<circle-percent percent="25"></circle-percent>`);

      let percentText = el.shadowRoot.querySelector('.percent-text');
      expect(percentText.textContent).to.equal('25%');

      el.percent = 75;
      await el.updateComplete;

      percentText = el.shadowRoot.querySelector('.percent-text');
      expect(percentText.textContent).to.equal('75%');
    });

    it('updates title when title changes', async () => {
      const el = await fixture(html`<circle-percent title="Loading"></circle-percent>`);

      let title = el.shadowRoot.querySelector('.title');
      expect(title.textContent).to.equal('Loading');

      el.title = 'Complete';
      await el.updateComplete;

      title = el.shadowRoot.querySelector('.title');
      expect(title.textContent).to.equal('Complete');
    });

    it('updates stroke color when strokeColor changes', async () => {
      const el = await fixture(html`<circle-percent stroke-color="#ff0000"></circle-percent>`);

      let progressCircle = el.shadowRoot.querySelector('.progress-circle');
      expect(progressCircle.getAttribute('stroke')).to.equal('#ff0000');

      el.strokeColor = '#00ff00';
      await el.updateComplete;

      progressCircle = el.shadowRoot.querySelector('.progress-circle');
      expect(progressCircle.getAttribute('stroke')).to.equal('#00ff00');
    });
  });

  describe('Rounding', () => {
    it('rounds decimal percentages to whole numbers in display', async () => {
      const el = await fixture(html`<circle-percent percent="33.7"></circle-percent>`);

      const percentText = el.shadowRoot.querySelector('.percent-text');
      expect(percentText.textContent).to.equal('34%');
    });

    it('rounds down when appropriate', async () => {
      const el = await fixture(html`<circle-percent percent="33.3"></circle-percent>`);

      const percentText = el.shadowRoot.querySelector('.percent-text');
      expect(percentText.textContent).to.equal('33%');
    });
  });
});
