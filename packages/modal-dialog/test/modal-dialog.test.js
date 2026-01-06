import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/modal-dialog.js';

describe('ModalDialog', () => {
  afterEach(() => {
    // Clean up body scroll
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      expect(el).to.exist;
      expect(el.open).to.be.false;
      expect(el.title).to.equal('');
      expect(el.size).to.equal('medium');
      expect(el.closable).to.be.true;
    });

    it('renders overlay', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay).to.exist;
    });

    it('renders modal container', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal).to.exist;
    });

    it('renders title when provided', async () => {
      const el = await fixture(html`<modal-dialog title="Test Title"></modal-dialog>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title.textContent).to.equal('Test Title');
    });

    it('renders close button when closable', async () => {
      const el = await fixture(html`<modal-dialog closable></modal-dialog>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      expect(closeBtn).to.exist;
    });

    it('does not render close button when not closable and no title', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      el.closable = false;
      await el.updateComplete;
      const header = el.shadowRoot.querySelector('.header');
      expect(header).to.be.null;
    });

    it('renders slotted content', async () => {
      const el = await fixture(html`<modal-dialog><p>Content</p></modal-dialog>`);
      const slot = el.shadowRoot.querySelector('.body slot');
      expect(slot).to.exist;
    });

    it('renders footer slot', async () => {
      const el = await fixture(
        html`<modal-dialog><button slot="footer">OK</button></modal-dialog>`
      );
      const footerSlot = el.shadowRoot.querySelector('.footer slot[name="footer"]');
      expect(footerSlot).to.exist;
    });
  });

  describe('Properties', () => {
    it('accepts open attribute', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      expect(el.open).to.be.true;
    });

    it('reflects open to attribute', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      el.open = true;
      await el.updateComplete;
      expect(el.hasAttribute('open')).to.be.true;
    });

    it('accepts title attribute', async () => {
      const el = await fixture(html`<modal-dialog title="My Title"></modal-dialog>`);
      expect(el.title).to.equal('My Title');
    });

    it('accepts size attribute', async () => {
      const el = await fixture(html`<modal-dialog size="large"></modal-dialog>`);
      expect(el.size).to.equal('large');
    });

    it('accepts close-on-overlay attribute', async () => {
      const el = await fixture(html`<modal-dialog close-on-overlay></modal-dialog>`);
      expect(el.closeOnOverlay).to.be.true;
    });

    it('accepts close-on-escape attribute', async () => {
      const el = await fixture(html`<modal-dialog close-on-escape></modal-dialog>`);
      expect(el.closeOnEscape).to.be.true;
    });
  });

  describe('Size variants', () => {
    it('applies small size', async () => {
      const el = await fixture(html`<modal-dialog size="small"></modal-dialog>`);
      expect(el.getAttribute('size')).to.equal('small');
    });

    it('applies large size', async () => {
      const el = await fixture(html`<modal-dialog size="large"></modal-dialog>`);
      expect(el.getAttribute('size')).to.equal('large');
    });

    it('applies full size', async () => {
      const el = await fixture(html`<modal-dialog size="full"></modal-dialog>`);
      expect(el.getAttribute('size')).to.equal('full');
    });

    it('applies fullscreen size', async () => {
      const el = await fixture(html`<modal-dialog size="fullscreen"></modal-dialog>`);
      expect(el.getAttribute('size')).to.equal('fullscreen');
    });
  });

  describe('Custom dimensions', () => {
    it('accepts width attribute', async () => {
      const el = await fixture(html`<modal-dialog width="50vw"></modal-dialog>`);
      expect(el.width).to.equal('50vw');
    });

    it('accepts height attribute', async () => {
      const el = await fixture(html`<modal-dialog height="70vh"></modal-dialog>`);
      expect(el.height).to.equal('70vh');
    });

    it('applies width style to modal', async () => {
      const el = await fixture(html`<modal-dialog width="600px"></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.style.width).to.equal('600px');
      expect(modal.style.maxWidth).to.equal('600px');
    });

    it('applies height style to modal', async () => {
      const el = await fixture(html`<modal-dialog height="400px"></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.style.height).to.equal('400px');
    });

    it('applies both width and height', async () => {
      const el = await fixture(html`<modal-dialog width="80%" height="60vh"></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.style.width).to.equal('80%');
      expect(modal.style.height).to.equal('60vh');
    });

    it('does not apply style when no custom dimensions', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.hasAttribute('style')).to.be.false;
    });
  });

  describe('Methods', () => {
    it('show() opens the modal', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      el.show();
      expect(el.open).to.be.true;
    });

    it('show() does nothing if already open', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      let eventCount = 0;
      el.addEventListener('modal-open', () => eventCount++);
      el.show();
      expect(eventCount).to.equal(0);
    });

    it('hide() closes the modal', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      el.hide();
      expect(el.open).to.be.false;
    });

    it('hide() does nothing if already closed', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      let eventCount = 0;
      el.addEventListener('modal-close', () => eventCount++);
      el.hide();
      expect(eventCount).to.equal(0);
    });

    it('confirm() closes and dispatches event', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      const listener = oneEvent(el, 'modal-confirm');
      el.confirm();
      await listener;
      expect(el.open).to.be.false;
    });

    it('cancel() closes and dispatches event', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      const listener = oneEvent(el, 'modal-cancel');
      el.cancel();
      await listener;
      expect(el.open).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches modal-open event', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      const listener = oneEvent(el, 'modal-open');
      el.open = true;
      await listener;
    });

    it('dispatches modal-close event', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      const listener = oneEvent(el, 'modal-close');
      el.hide();
      const event = await listener;
      expect(event.bubbles).to.be.true;
    });

    it('dispatches modal-confirm event', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      const listener = oneEvent(el, 'modal-confirm');
      el.confirm();
      const event = await listener;
      expect(event.composed).to.be.true;
    });

    it('dispatches modal-cancel event', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      const listener = oneEvent(el, 'modal-cancel');
      el.cancel();
      const event = await listener;
      expect(event.bubbles).to.be.true;
    });
  });

  describe('Close interactions', () => {
    it('closes on overlay click when closeOnOverlay is true', async () => {
      const el = await fixture(html`<modal-dialog open close-on-overlay></modal-dialog>`);
      const overlay = el.shadowRoot.querySelector('.overlay');
      overlay.click();
      expect(el.open).to.be.false;
    });

    it('does not close on overlay click when closeOnOverlay is false', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      el.closeOnOverlay = false;
      await el.updateComplete;
      const overlay = el.shadowRoot.querySelector('.overlay');
      overlay.click();
      expect(el.open).to.be.true;
    });

    it('does not close on modal content click', async () => {
      const el = await fixture(html`<modal-dialog open close-on-overlay></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      modal.click();
      expect(el.open).to.be.true;
    });

    it('closes on close button click', async () => {
      const el = await fixture(html`<modal-dialog open closable></modal-dialog>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      closeBtn.click();
      expect(el.open).to.be.false;
    });

    it('closes on Escape key when closeOnEscape is true', async () => {
      const el = await fixture(html`<modal-dialog open close-on-escape></modal-dialog>`);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.open).to.be.false;
    });

    it('does not close on Escape key when closeOnEscape is false', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      el.closeOnEscape = false;
      await el.updateComplete;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.open).to.be.true;
    });

    it('does not respond to Escape when closed', async () => {
      const el = await fixture(html`<modal-dialog close-on-escape></modal-dialog>`);
      let eventCount = 0;
      el.addEventListener('modal-cancel', () => eventCount++);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(eventCount).to.equal(0);
    });
  });

  describe('Body scroll lock', () => {
    it('locks body scroll when opened', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      el.open = true;
      await el.updateComplete;
      expect(document.body.style.overflow).to.equal('hidden');
    });

    it('restores body scroll when closed', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      el.open = false;
      await el.updateComplete;
      expect(document.body.style.overflow).to.equal('');
    });

    it('restores body scroll on disconnect', async () => {
      const el = await fixture(html`<modal-dialog open></modal-dialog>`);
      el.remove();
      expect(document.body.style.overflow).to.equal('');
    });
  });

  describe('Accessibility', () => {
    it('has dialog role', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.getAttribute('role')).to.equal('dialog');
    });

    it('has aria-modal true', async () => {
      const el = await fixture(html`<modal-dialog></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.getAttribute('aria-modal')).to.equal('true');
    });

    it('has aria-labelledby when title present', async () => {
      const el = await fixture(html`<modal-dialog title="Test"></modal-dialog>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal.getAttribute('aria-labelledby')).to.equal('modal-title');
    });

    it('title has correct id', async () => {
      const el = await fixture(html`<modal-dialog title="Test"></modal-dialog>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title.id).to.equal('modal-title');
    });

    it('close button has aria-label', async () => {
      const el = await fixture(html`<modal-dialog closable></modal-dialog>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      expect(closeBtn.getAttribute('aria-label')).to.equal('Close modal');
    });
  });
});
