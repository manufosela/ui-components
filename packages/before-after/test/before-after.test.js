import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/before-after.js';

describe('BeforeAfter', () => {
  describe('rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<before-after></before-after>`);
      expect(el).to.exist;
      expect(el.position).to.equal(50);
      expect(el.beforeLabel).to.equal('Before');
      expect(el.afterLabel).to.equal('After');
      expect(el.hideLabels).to.be.false;
      expect(el.hoverMode).to.be.false;
      expect(el.noAnimation).to.be.false;
      expect(el.disabled).to.be.false;
    });

    it('renders shadow DOM with container', async () => {
      const el = await fixture(html`<before-after></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container).to.exist;
    });

    it('renders divider at 50% by default', async () => {
      const el = await fixture(html`<before-after></before-after>`);
      const divider = el.shadowRoot.querySelector('.divider');
      expect(divider).to.exist;
      expect(divider.style.left).to.equal('50%');
    });

    it('renders before and after slots', async () => {
      const el = await fixture(html`
        <before-after>
          <img slot="before" src="data:," alt="before" />
          <img slot="after" src="data:," alt="after" />
        </before-after>
      `);
      const beforeSlot = el.shadowRoot.querySelector('slot[name="before"]');
      const afterSlot = el.shadowRoot.querySelector('slot[name="after"]');
      expect(beforeSlot).to.exist;
      expect(afterSlot).to.exist;
    });

    it('renders labels by default', async () => {
      const el = await fixture(html`<before-after></before-after>`);
      const labels = el.shadowRoot.querySelectorAll('.label');
      expect(labels.length).to.equal(2);
      expect(labels[0].textContent).to.equal('Before');
      expect(labels[1].textContent).to.equal('After');
    });
  });

  describe('attributes', () => {
    it('renders at custom position', async () => {
      const el = await fixture(html`<before-after position="30"></before-after>`);
      expect(el.position).to.equal(30);
      const divider = el.shadowRoot.querySelector('.divider');
      expect(divider.style.left).to.equal('30%');
    });

    it('accepts custom labels', async () => {
      const el = await fixture(html`
        <before-after before-label="Original" after-label="Edited"></before-after>
      `);
      expect(el.beforeLabel).to.equal('Original');
      expect(el.afterLabel).to.equal('Edited');
      const labels = el.shadowRoot.querySelectorAll('.label');
      expect(labels[0].textContent).to.equal('Original');
      expect(labels[1].textContent).to.equal('Edited');
    });

    it('hides labels when hide-labels is set', async () => {
      const el = await fixture(html`<before-after hide-labels></before-after>`);
      expect(el.hideLabels).to.be.true;
      const labels = el.shadowRoot.querySelectorAll('.label');
      expect(labels.length).to.equal(0);
    });

    it('disables interaction when disabled', async () => {
      const el = await fixture(html`<before-after disabled></before-after>`);
      expect(el.disabled).to.be.true;
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('clip-path', () => {
    it('sets correct clip-path on after layer', async () => {
      const el = await fixture(html`<before-after position="30"></before-after>`);
      const afterLayer = el.shadowRoot.querySelector('.after-layer');
      expect(afterLayer.style.clipPath).to.equal('inset(0px 0px 0px 30%)');
    });

    it('sets correct clip-path on before layer', async () => {
      const el = await fixture(html`<before-after position="30"></before-after>`);
      const beforeLayer = el.shadowRoot.querySelector('.before-layer');
      expect(beforeLayer.style.clipPath).to.equal('inset(0px 70% 0px 0px)');
    });

    it('updates clip-path when position changes', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      el.position = 75;
      await el.updateComplete;
      const afterLayer = el.shadowRoot.querySelector('.after-layer');
      expect(afterLayer.style.clipPath).to.equal('inset(0px 0px 0px 75%)');
      const beforeLayer = el.shadowRoot.querySelector('.before-layer');
      expect(beforeLayer.style.clipPath).to.equal('inset(0px 25% 0px 0px)');
    });
  });

  describe('events', () => {
    it('fires before-after-change event with position detail', async () => {
      const el = await fixture(html`<before-after></before-after>`);

      setTimeout(() => {
        el.position = 30;
        el._fireChange();
      });

      const { detail } = await oneEvent(el, 'before-after-change');
      expect(detail).to.exist;
      expect(detail.position).to.equal(30);
    });

    it('change event has bubbles and composed', async () => {
      const el = await fixture(html`<before-after></before-after>`);

      setTimeout(() => {
        el.position = 40;
        el._fireChange();
      });

      const event = await oneEvent(el, 'before-after-change');
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });
  });

  describe('keyboard', () => {
    it('ArrowRight increases position by 1', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(el.position).to.equal(51);
    });

    it('ArrowLeft decreases position by 1', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(el.position).to.equal(49);
    });

    it('Home sets position to 0', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      expect(el.position).to.equal(0);
    });

    it('End sets position to 100', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(el.position).to.equal(100);
    });

    it('PageUp increases position by 10', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
      expect(el.position).to.equal(60);
    });

    it('PageDown decreases position by 10', async () => {
      const el = await fixture(html`<before-after position="50"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
      expect(el.position).to.equal(40);
    });

    it('does not change when disabled', async () => {
      const el = await fixture(html`<before-after position="50" disabled></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(el.position).to.equal(50);
    });
  });

  describe('accessibility', () => {
    it('has role="slider"', async () => {
      const el = await fixture(html`<before-after></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('role')).to.equal('slider');
    });

    it('has correct aria attributes', async () => {
      const el = await fixture(html`<before-after position="30"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('aria-valuemin')).to.equal('0');
      expect(container.getAttribute('aria-valuemax')).to.equal('100');
      expect(container.getAttribute('aria-valuenow')).to.equal('30');
    });

    it('is focusable', async () => {
      const el = await fixture(html`<before-after></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('tabindex')).to.equal('0');
    });

    it('passes accessibility audit', async () => {
      const el = await fixture(html`
        <before-after>
          <img slot="before" src="data:," alt="before" />
          <img slot="after" src="data:," alt="after" />
        </before-after>
      `);
      await expect(el).to.be.accessible();
    });
  });

  describe('bounds', () => {
    it('clamps position to 0 minimum', async () => {
      const el = await fixture(html`<before-after position="5"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      // Press ArrowLeft 10 times to go below 0
      for (let i = 0; i < 10; i++) {
        container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      }
      expect(el.position).to.equal(0);
    });

    it('clamps position to 100 maximum', async () => {
      const el = await fixture(html`<before-after position="95"></before-after>`);
      const container = el.shadowRoot.querySelector('.container');
      // Press ArrowRight 10 times to go above 100
      for (let i = 0; i < 10; i++) {
        container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      }
      expect(el.position).to.equal(100);
    });

    it('handles negative position attribute', async () => {
      const el = await fixture(html`<before-after position="-10"></before-after>`);
      await el.updateComplete;
      const divider = el.shadowRoot.querySelector('.divider');
      expect(divider.style.left).to.equal('0%');
    });

    it('handles position above 100', async () => {
      const el = await fixture(html`<before-after position="150"></before-after>`);
      await el.updateComplete;
      const divider = el.shadowRoot.querySelector('.divider');
      expect(divider.style.left).to.equal('100%');
    });
  });
});
