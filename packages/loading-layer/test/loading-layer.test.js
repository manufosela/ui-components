import { html } from 'lit';
import { fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/loading-layer.js';

describe('LoadingLayer', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el).to.exist;
      expect(el.visible).to.be.false;
      expect(el.size).to.equal(60);
      expect(el.color).to.equal('#3b82f6');
      expect(el.strokeWidth).to.equal(4);
    });

    it('renders the overlay element', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const overlay = el.shadowRoot.querySelector('.loading-overlay');
      expect(overlay).to.exist;
    });

    it('renders the spinner', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const spinner = el.shadowRoot.querySelector('.spinner');
      expect(spinner).to.exist;
    });

    it('renders message when provided', async () => {
      const el = await fixture(html`<loading-layer message="Loading..."></loading-layer>`);
      const message = el.shadowRoot.querySelector('.message');
      expect(message).to.exist;
      expect(message.textContent).to.equal('Loading...');
    });

    it('does not render message when not provided', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const message = el.shadowRoot.querySelector('.message');
      expect(message).to.not.exist;
    });
  });

  describe('Properties', () => {
    it('accepts visible attribute', async () => {
      const el = await fixture(html`<loading-layer visible></loading-layer>`);
      expect(el.visible).to.be.true;
      expect(el.hasAttribute('visible')).to.be.true;
    });

    it('accepts message attribute', async () => {
      const el = await fixture(html`<loading-layer message="Please wait"></loading-layer>`);
      expect(el.message).to.equal('Please wait');
    });

    it('accepts size attribute', async () => {
      const el = await fixture(html`<loading-layer size="100"></loading-layer>`);
      expect(el.size).to.equal(100);
    });

    it('accepts color attribute', async () => {
      const el = await fixture(html`<loading-layer color="#ff0000"></loading-layer>`);
      expect(el.color).to.equal('#ff0000');
    });

    it('accepts stroke-width attribute', async () => {
      const el = await fixture(html`<loading-layer stroke-width="8"></loading-layer>`);
      expect(el.strokeWidth).to.equal(8);
    });

    it('accepts timeout attribute', async () => {
      const el = await fixture(html`<loading-layer timeout="5"></loading-layer>`);
      expect(el.timeout).to.equal(5);
    });
  });

  describe('Show/Hide methods', () => {
    it('shows the loading layer', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el.visible).to.be.false;
      el.show();
      expect(el.visible).to.be.true;
    });

    it('hides the loading layer', async () => {
      const el = await fixture(html`<loading-layer visible></loading-layer>`);
      expect(el.visible).to.be.true;
      el.hide();
      expect(el.visible).to.be.false;
    });

    it('toggles the loading layer', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el.visible).to.be.false;
      el.toggle();
      expect(el.visible).to.be.true;
      el.toggle();
      expect(el.visible).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches loading-layer-shown event when shown', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const listener = oneEvent(el, 'loading-layer-shown');
      el.show();
      const event = await listener;
      expect(event).to.exist;
    });

    it('dispatches loading-layer-hidden event when hidden', async () => {
      const el = await fixture(html`<loading-layer visible></loading-layer>`);
      const listener = oneEvent(el, 'loading-layer-hidden');
      el.hide();
      const event = await listener;
      expect(event).to.exist;
    });

    it('responds to global loading-layer-show event', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el.visible).to.be.false;
      document.dispatchEvent(new CustomEvent('loading-layer-show'));
      expect(el.visible).to.be.true;
    });

    it('responds to global loading-layer-hide event', async () => {
      const el = await fixture(html`<loading-layer visible></loading-layer>`);
      expect(el.visible).to.be.true;
      document.dispatchEvent(new CustomEvent('loading-layer-hide'));
      expect(el.visible).to.be.false;
    });

    it('accepts message in global show event', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      document.dispatchEvent(
        new CustomEvent('loading-layer-show', { detail: { message: 'Custom message' } })
      );
      expect(el.message).to.equal('Custom message');
    });
  });

  describe('Timeout', () => {
    it('auto-hides after timeout', async () => {
      const el = await fixture(html`<loading-layer timeout="0.1"></loading-layer>`);
      el.show();
      expect(el.visible).to.be.true;
      await aTimeout(150);
      expect(el.visible).to.be.false;
    });

    it('clears timeout when hidden manually', async () => {
      const el = await fixture(html`<loading-layer timeout="1"></loading-layer>`);
      el.show();
      el.hide();
      expect(el._timeoutId).to.be.null;
    });
  });

  describe('SVG Spinner', () => {
    it('sets correct size on SVG', async () => {
      const el = await fixture(html`<loading-layer size="80"></loading-layer>`);
      const svg = el.shadowRoot.querySelector('svg');
      expect(svg.getAttribute('width')).to.equal('80');
      expect(svg.getAttribute('height')).to.equal('80');
    });

    it('sets correct color on circle', async () => {
      const el = await fixture(html`<loading-layer color="#ff5500"></loading-layer>`);
      const circle = el.shadowRoot.querySelector('circle');
      expect(circle.getAttribute('stroke')).to.equal('#ff5500');
    });

    it('sets correct stroke-width on circle', async () => {
      const el = await fixture(html`<loading-layer stroke-width="6"></loading-layer>`);
      const circle = el.shadowRoot.querySelector('circle');
      expect(circle.getAttribute('stroke-width')).to.equal('6');
    });
  });
});
