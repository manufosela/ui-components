import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/radar-chart.js';

describe('RadarChart', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      expect(el).to.exist;
      expect(el.labels).to.deep.equal([]);
      expect(el.series).to.deep.equal([]);
      expect(el.levels).to.equal(5);
      expect(el.showDots).to.be.true;
      expect(el.showLegend).to.be.true;
      expect(el.showValues).to.be.true;
      expect(el.fillOpacity).to.equal(0.25);
      expect(el.size).to.equal(300);
    });

    it('renders SVG element', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const svg = el.shadowRoot.querySelector('svg');
      expect(svg).to.exist;
    });

    it('renders default labels when none provided', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const labels = el.shadowRoot.querySelectorAll('.axis-label');
      expect(labels.length).to.equal(3);
      expect(labels[0].textContent).to.equal('A');
    });

    it('renders custom labels', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['Speed', 'Power', 'Magic'];
      await el.updateComplete;
      const labels = el.shadowRoot.querySelectorAll('.axis-label');
      expect(labels.length).to.equal(3);
      expect(labels[0].textContent).to.equal('Speed');
    });
  });

  describe('grid', () => {
    it('renders grid lines', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const gridLines = el.shadowRoot.querySelectorAll('.grid-line');
      expect(gridLines.length).to.equal(5); // Default 5 levels
    });

    it('renders custom number of levels', async () => {
      const el = await fixture(html`<radar-chart levels="3"></radar-chart>`);
      const gridLines = el.shadowRoot.querySelectorAll('.grid-line');
      expect(gridLines.length).to.equal(3);
    });

    it('renders axis lines', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const axisLines = el.shadowRoot.querySelectorAll('.axis-line');
      expect(axisLines.length).to.equal(3); // Default 3 axes
    });

    it('renders level labels', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const levelLabels = el.shadowRoot.querySelectorAll('.level-label');
      expect(levelLabels.length).to.equal(5);
    });
  });

  describe('data series', () => {
    it('renders single series', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ name: 'Test', values: [80, 60, 90], color: '#3b82f6' }];
      await el.updateComplete;
      const areas = el.shadowRoot.querySelectorAll('.data-area');
      expect(areas.length).to.equal(1);
    });

    it('renders multiple series', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [
        { name: 'Series 1', values: [80, 60, 90], color: '#3b82f6' },
        { name: 'Series 2', values: [70, 80, 60], color: '#22c55e' },
      ];
      await el.updateComplete;
      const areas = el.shadowRoot.querySelectorAll('.data-area');
      expect(areas.length).to.equal(2);
    });

    it('renders data points when showDots is true', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;
      const dots = el.shadowRoot.querySelectorAll('.data-point');
      expect(dots.length).to.equal(3);
    });

    it('hides data points when showDots is false', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      el.showDots = false;
      await el.updateComplete;
      const dots = el.shadowRoot.querySelectorAll('.data-point');
      expect(dots.length).to.equal(0);
    });

    it('applies custom fill opacity', async () => {
      const el = await fixture(html`<radar-chart fill-opacity="0.5"></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;
      const area = el.shadowRoot.querySelector('.data-area');
      expect(area.getAttribute('fill-opacity')).to.equal('0.5');
    });

    it('applies series color', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90], color: '#ff0000' }];
      await el.updateComplete;
      const area = el.shadowRoot.querySelector('.data-area');
      expect(area.getAttribute('stroke')).to.equal('#ff0000');
      expect(area.getAttribute('fill')).to.equal('#ff0000');
    });

    it('uses default colors when not specified', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;
      const area = el.shadowRoot.querySelector('.data-area');
      expect(area.getAttribute('stroke')).to.equal('#3b82f6'); // First default color
    });
  });

  describe('legend', () => {
    it('renders legend when showLegend is true', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ name: 'Test', values: [80, 60, 90] }];
      await el.updateComplete;
      const legend = el.shadowRoot.querySelector('.legend');
      expect(legend).to.exist;
    });

    it('hides legend when showLegend is false', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.showLegend = false;
      el.labels = ['A', 'B', 'C'];
      el.series = [{ name: 'Test', values: [80, 60, 90] }];
      await el.updateComplete;
      const legend = el.shadowRoot.querySelector('.legend');
      expect(legend).to.be.null;
    });

    it('displays series names in legend', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [
        { name: 'Series A', values: [80, 60, 90] },
        { name: 'Series B', values: [70, 80, 60] },
      ];
      await el.updateComplete;
      const legendItems = el.shadowRoot.querySelectorAll('.legend-item');
      expect(legendItems.length).to.equal(2);
      expect(legendItems[0].textContent).to.include('Series A');
      expect(legendItems[1].textContent).to.include('Series B');
    });

    it('uses default series name when not provided', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;
      const legendItem = el.shadowRoot.querySelector('.legend-item');
      expect(legendItem.textContent).to.include('Series 1');
    });
  });

  describe('events', () => {
    it('fires data-point-click event', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ name: 'Test', values: [80, 60, 90] }];
      await el.updateComplete;

      const dot = el.shadowRoot.querySelector('.data-point');
      setTimeout(() => dot.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      const { detail } = await oneEvent(el, 'data-point-click');

      expect(detail).to.exist;
      expect(detail.series).to.equal('Test');
      expect(detail.label).to.equal('A');
      expect(detail.value).to.equal(80);
      expect(detail.seriesIndex).to.equal(0);
      expect(detail.pointIndex).to.equal(0);
    });
  });

  describe('sizing', () => {
    it('applies custom size', async () => {
      const el = await fixture(html`<radar-chart size="400"></radar-chart>`);
      expect(el.size).to.equal(400);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.style.cssText).to.include('--radar-size: 400px');
    });

    it('sets SVG viewBox based on size', async () => {
      const el = await fixture(html`<radar-chart size="400"></radar-chart>`);
      const svg = el.shadowRoot.querySelector('svg');
      expect(svg.getAttribute('viewBox')).to.equal('0 0 400 400');
    });
  });

  describe('max value', () => {
    it('auto-calculates max value from data', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;
      expect(el._getMaxValue()).to.equal(90);
    });

    it('uses custom max value when provided', async () => {
      const el = await fixture(html`<radar-chart max-value="100"></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;
      expect(el._getMaxValue()).to.equal(100);
    });

    it('defaults to 100 when no data', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      expect(el._getMaxValue()).to.equal(100);
    });
  });

  describe('tooltip', () => {
    it('shows tooltip on hover', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ name: 'Test', values: [80, 60, 90] }];
      await el.updateComplete;

      const dot = el.shadowRoot.querySelector('.data-point');
      dot.dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true, clientX: 100, clientY: 100 })
      );
      await el.updateComplete;

      expect(el._hoveredPoint).to.exist;
      expect(el._hoveredPoint.value).to.equal(80);
    });

    it('hides tooltip on mouse leave', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ name: 'Test', values: [80, 60, 90] }];
      await el.updateComplete;

      const dot = el.shadowRoot.querySelector('.data-point');
      dot.dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true, clientX: 100, clientY: 100 })
      );
      await el.updateComplete;
      expect(el._hoveredPoint).to.exist;

      dot.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await el.updateComplete;
      expect(el._hoveredPoint).to.be.null;
    });

    it('hides tooltip when showValues is false', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.showValues = false;
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      el._hoveredPoint = { x: 100, y: 100, series: 'Test', label: 'A', value: 80 };
      await el.updateComplete;

      const tooltip = el.shadowRoot.querySelector('.tooltip');
      expect(tooltip).to.be.null;
    });
  });

  describe('calculations', () => {
    it('calculates polar to cartesian correctly', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const point = el._polarToCartesian(0, 100, 150, 150);
      expect(point.x).to.be.closeTo(150, 1);
      expect(point.y).to.be.closeTo(50, 1);
    });

    it('generates polygon points string', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const points = el._getPolygonPoints([100, 100, 100], 150, 150, 100, 100);
      expect(points).to.be.a('string');
      expect(points.split(' ').length).to.equal(3);
    });

    it('assigns default colors cyclically', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const color0 = el._getDefaultColor(0);
      const color1 = el._getDefaultColor(1);
      const color8 = el._getDefaultColor(8);

      expect(color0).to.equal('#3b82f6');
      expect(color1).to.equal('#22c55e');
      expect(color8).to.equal('#3b82f6'); // Cycles back
    });
  });

  describe('accessibility', () => {
    it('is inline-block display', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      const style = getComputedStyle(el);
      expect(style.display).to.equal('inline-block');
    });
  });

  describe('dynamic updates', () => {
    it('updates chart when labels change', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      await el.updateComplete;

      let axisLabels = el.shadowRoot.querySelectorAll('.axis-label');
      expect(axisLabels.length).to.equal(3);

      el.labels = ['W', 'X', 'Y', 'Z'];
      await el.updateComplete;

      axisLabels = el.shadowRoot.querySelectorAll('.axis-label');
      expect(axisLabels.length).to.equal(4);
    });

    it('updates chart when series change', async () => {
      const el = await fixture(html`<radar-chart></radar-chart>`);
      el.labels = ['A', 'B', 'C'];
      el.series = [{ values: [80, 60, 90] }];
      await el.updateComplete;

      let areas = el.shadowRoot.querySelectorAll('.data-area');
      expect(areas.length).to.equal(1);

      el.series = [{ values: [80, 60, 90] }, { values: [70, 80, 60] }];
      await el.updateComplete;

      areas = el.shadowRoot.querySelectorAll('.data-area');
      expect(areas.length).to.equal(2);
    });
  });
});
