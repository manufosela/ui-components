import { html } from 'lit';
import { fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { LoadingLayer } from '../src/loading-layer.js';

describe('LoadingLayer', () => {
  afterEach(() => {
    // Reset singleton so tests don't block each other
    LoadingLayer._activeInstance = null;
    // Close any open dialogs
    document.querySelectorAll('loading-layer').forEach((el) => {
      const dialog = el.shadowRoot?.querySelector('dialog');
      if (dialog?.open) dialog.close();
      el.visible = false;
    });
  });
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el).to.exist;
      expect(el.visible).to.be.false;
      expect(el.size).to.equal(60);
      expect(el.color).to.equal('#3b82f6');
      expect(el.strokeWidth).to.equal(4);
    });

    it('renders a dialog element in shadow DOM', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const dialog = el.shadowRoot.querySelector('dialog');
      expect(dialog).to.exist;
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
      expect(message.textContent.trim()).to.equal('Loading...');
    });

    it('renders message element (empty) even when no message provided', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const message = el.shadowRoot.querySelector('.message');
      // Live region always present for screen readers
      expect(message).to.exist;
    });

    it('dialog has aria-live assertive region', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const liveRegion = el.shadowRoot.querySelector('[aria-live="assertive"]');
      expect(liveRegion).to.exist;
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

    it('records _showTime when shown', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el._showTime).to.be.null;
      const before = Date.now();
      el.show();
      expect(el._showTime).to.be.at.least(before);
    });

    it('clears _showTime when hidden', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      el.show();
      el.hide();
      expect(el._showTime).to.be.null;
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

    it('dispatches loading-layer-complete event when hidden', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      el.show();
      await aTimeout(10);
      const listener = oneEvent(el, 'loading-layer-complete');
      el.hide();
      const event = await listener;
      expect(event).to.exist;
      expect(event.detail).to.have.property('reason');
      expect(event.detail).to.have.property('duration');
      expect(event.detail.duration).to.be.at.least(0);
    });

    it('loading-layer-complete has reason="manual" when hidden manually', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      el.show();
      const listener = oneEvent(el, 'loading-layer-complete');
      el.hide();
      const event = await listener;
      expect(event.detail.reason).to.equal('manual');
    });

    it('loading-layer-complete has reason="timeout" after timeout', async () => {
      const el = await fixture(html`<loading-layer timeout="0.05"></loading-layer>`);
      el.show();
      const event = await oneEvent(el, 'loading-layer-complete');
      expect(event.detail.reason).to.equal('timeout');
    });

    it('loading-layer-complete has reason="event" when hidden via global event', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      el.show();
      const listener = oneEvent(el, 'loading-layer-complete');
      document.dispatchEvent(new CustomEvent('loading-layer-hide'));
      const event = await listener;
      expect(event.detail.reason).to.equal('event');
    });

    it('responds to global loading-layer-show event', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      expect(el.visible).to.be.false;
      document.dispatchEvent(new CustomEvent('loading-layer-show'));
      expect(el.visible).to.be.true;
      el.hide();
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
      el.hide();
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

  describe('Multi-phase messages', () => {
    it('reads <loading-phase> children on show()', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Step 1"></loading-phase>
          <loading-phase message="Step 2" delay="10"></loading-phase>
        </loading-layer>
      `);
      el.show();
      expect(el._phases).to.have.length(2);
      el.hide();
    });

    it('shows first phase message immediately on show()', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Cargando..."></loading-phase>
          <loading-phase message="Tardando..." delay="10"></loading-phase>
        </loading-layer>
      `);
      el.show();
      expect(el._currentMessage).to.equal('Cargando...');
      el.hide();
    });

    it('advances to next phase after delay', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Fase 1"></loading-phase>
          <loading-phase message="Fase 2" delay="0.1"></loading-phase>
        </loading-layer>
      `);
      el.show();
      expect(el._currentMessage).to.equal('Fase 1');
      await aTimeout(150);
      expect(el._currentMessage).to.equal('Fase 2');
      el.hide();
    });

    it('advances phase via setPhase()', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Fase A"></loading-phase>
          <loading-phase message="Fase B"></loading-phase>
        </loading-layer>
      `);
      el.show();
      expect(el._currentPhase).to.equal(0);
      el.setPhase(1);
      expect(el._currentPhase).to.equal(1);
      expect(el._currentMessage).to.equal('Fase B');
      el.hide();
    });

    it('dispatches loading-layer-phase-change event on phase advance', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Fase A"></loading-phase>
          <loading-phase message="Fase B"></loading-phase>
        </loading-layer>
      `);
      el.show();
      const listener = oneEvent(el, 'loading-layer-phase-change');
      el.setPhase(1);
      const event = await listener;
      expect(event.detail.phase).to.equal(1);
      expect(event.detail.message).to.equal('Fase B');
      el.hide();
    });

    it('advances phase via global loading-layer-phase event', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Alpha"></loading-phase>
          <loading-phase message="Beta"></loading-phase>
        </loading-layer>
      `);
      el.show();
      document.dispatchEvent(new CustomEvent('loading-layer-phase', { detail: { phase: 1 } }));
      expect(el._currentPhase).to.equal(1);
      el.hide();
    });

    it('advances phase via named event attribute', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Waiting..."></loading-phase>
          <loading-phase message="Data loaded!" event="data-ready"></loading-phase>
        </loading-layer>
      `);
      el.show();
      expect(el._currentMessage).to.equal('Waiting...');
      document.dispatchEvent(new CustomEvent('data-ready'));
      await aTimeout(10);
      expect(el._currentMessage).to.equal('Data loaded!');
      el.hide();
    });

    it('shows phase indicator dots when 2+ phases', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Fase 1"></loading-phase>
          <loading-phase message="Fase 2" delay="10"></loading-phase>
        </loading-layer>
      `);
      el.show();
      await el.updateComplete;
      const dots = el.shadowRoot.querySelectorAll('.phase-dot');
      expect(dots.length).to.equal(2);
      el.hide();
    });

    it('first dot is active on phase 0', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="One"></loading-phase>
          <loading-phase message="Two" delay="10"></loading-phase>
        </loading-layer>
      `);
      el.show();
      await el.updateComplete;
      const dots = el.shadowRoot.querySelectorAll('.phase-dot');
      expect(dots[0].classList.contains('active')).to.be.true;
      expect(dots[1].classList.contains('active')).to.be.false;
      el.hide();
    });

    it('falls back to message attribute when no <loading-phase> children', async () => {
      const el = await fixture(html`<loading-layer message="Fallback"></loading-layer>`);
      el.show();
      expect(el._currentMessage).to.equal('Fallback');
      el.hide();
    });

    it('clears phase timers on hide()', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Step 1"></loading-phase>
          <loading-phase message="Step 2" delay="0.1"></loading-phase>
        </loading-layer>
      `);
      el.show();
      el.hide();
      // After hide, advancing to phase should not happen even after delay
      await aTimeout(150);
      expect(el._currentPhase).to.equal(0);
    });

    it('auto-closes after last phase auto-close delay', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Step 1"></loading-phase>
          <loading-phase message="Done!" delay="0.05" auto-close="0.05"></loading-phase>
        </loading-layer>
      `);
      el.show();
      // Wait for delay phase, then auto-close
      await aTimeout(250);
      expect(el.visible).to.be.false;
    });

    it('loading-layer-complete has reason="phases-complete" on auto-close', async () => {
      const el = await fixture(html`
        <loading-layer>
          <loading-phase message="Step 1"></loading-phase>
          <loading-phase message="Step 2" delay="0.05" auto-close="0.05"></loading-phase>
        </loading-layer>
      `);
      el.show();
      const event = await oneEvent(el, 'loading-layer-complete');
      expect(event.detail.reason).to.equal('phases-complete');
    });
  });

  describe('LoadingPhase element', () => {
    it('reads message attribute', async () => {
      const phase = document.createElement('loading-phase');
      phase.setAttribute('message', 'Hello');
      expect(phase.message).to.equal('Hello');
    });

    it('reads delay attribute as number', async () => {
      const phase = document.createElement('loading-phase');
      phase.setAttribute('delay', '5');
      expect(phase.delay).to.equal(5);
    });

    it('reads event attribute', async () => {
      const phase = document.createElement('loading-phase');
      phase.setAttribute('event', 'my-event');
      expect(phase.event).to.equal('my-event');
    });

    it('reads auto-close attribute as number', async () => {
      const phase = document.createElement('loading-phase');
      phase.setAttribute('auto-close', '3');
      expect(phase.autoClose).to.equal(3);
    });

    it('returns defaults when attributes missing', async () => {
      const phase = document.createElement('loading-phase');
      expect(phase.message).to.equal('');
      expect(phase.delay).to.equal(0);
      expect(phase.event).to.equal('');
      expect(phase.autoClose).to.equal(0);
    });
  });

  describe('Dialog accessibility', () => {
    it('dialog has aria-modal="true"', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      const dialog = el.shadowRoot.querySelector('dialog');
      expect(dialog.getAttribute('aria-modal')).to.equal('true');
    });

    it('dialog has aria-busy="true" when visible', async () => {
      const el = await fixture(html`<loading-layer></loading-layer>`);
      el.show();
      await el.updateComplete;
      const dialog = el.shadowRoot.querySelector('dialog');
      expect(dialog.getAttribute('aria-busy')).to.equal('true');
      el.hide();
    });
  });
});
