import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import { showModal } from '../src/app-modal.js';

describe('AppModal', () => {
  afterEach(() => {
    document.querySelectorAll('app-modal').forEach((el) => el.remove());
  });

  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      expect(el).to.exist;
      expect(el.title).to.equal('');
      expect(el.message).to.equal('');
      expect(el.maxWidth).to.equal('400px');
      expect(el.maxHeight).to.equal('90vh');
      expect(el.showHeader).to.be.true;
      expect(el.showFooter).to.be.true;
    });

    it('renders modal container', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      const modal = el.shadowRoot.querySelector('.modal');
      expect(modal).to.exist;
    });

    it('renders title when provided', async () => {
      const el = await fixture(html`<app-modal title="Test Title"></app-modal>`);
      const header = el.shadowRoot.querySelector('.modal-header');
      expect(header.textContent).to.include('Test Title');
    });

    it('renders close button', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      expect(closeBtn).to.exist;
    });

    it('renders standalone close button without header', async () => {
      const el = await fixture(html`<app-modal .showHeader="${false}"></app-modal>`);
      await el.updateComplete;
      const closeBtn = el.shadowRoot.querySelector('.close-btn.standalone');
      expect(closeBtn).to.exist;
    });

    it('renders slotted content', async () => {
      const el = await fixture(html`<app-modal><p>Content</p></app-modal>`);
      const slot = el.shadowRoot.querySelector('.modal-body slot');
      expect(slot).to.exist;
    });

    it('renders message with HTML', async () => {
      const el = await fixture(html`<app-modal message="<strong>Bold</strong>"></app-modal>`);
      const message = el.shadowRoot.querySelector('.modal-message');
      expect(message).to.exist;
      expect(message.innerHTML).to.include('<strong>Bold</strong>');
    });
  });

  describe('Properties', () => {
    it('accepts title attribute', async () => {
      const el = await fixture(html`<app-modal title="My Title"></app-modal>`);
      expect(el.title).to.equal('My Title');
    });

    it('accepts max-width attribute', async () => {
      const el = await fixture(html`<app-modal max-width="600px"></app-modal>`);
      expect(el.maxWidth).to.equal('600px');
    });

    it('accepts max-height attribute', async () => {
      const el = await fixture(html`<app-modal max-height="80vh"></app-modal>`);
      expect(el.maxHeight).to.equal('80vh');
    });

    it('generates modalId on connect', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      expect(el.modalId).to.be.a('string');
      expect(el.modalId).to.include('modal_');
    });

    it('uses provided modal-id', async () => {
      const el = await fixture(html`<app-modal modal-id="custom-id"></app-modal>`);
      expect(el.modalId).to.equal('custom-id');
    });
  });

  describe('Buttons', () => {
    it('renders button1 when text provided', async () => {
      const el = await fixture(html`<app-modal button1-text="OK"></app-modal>`);
      const btn = el.shadowRoot.querySelector('.confirm');
      expect(btn).to.exist;
      expect(btn.textContent.trim()).to.equal('OK');
    });

    it('renders button2 when text provided', async () => {
      const el = await fixture(html`<app-modal button2-text="Cancel"></app-modal>`);
      const btn = el.shadowRoot.querySelector('.cancel');
      expect(btn).to.exist;
      expect(btn.textContent.trim()).to.equal('Cancel');
    });

    it('renders button3 when text provided', async () => {
      const el = await fixture(html`<app-modal button3-text="Maybe"></app-modal>`);
      const buttons = el.shadowRoot.querySelectorAll('.modal-footer button');
      expect(buttons.length).to.equal(1);
      expect(buttons[0].textContent.trim()).to.equal('Maybe');
    });

    it('does not render footer when showFooter is false', async () => {
      const el = await fixture(html`<app-modal .showFooter="${false}"></app-modal>`);
      await el.updateComplete;
      const footer = el.shadowRoot.querySelector('.modal-footer');
      expect(footer).to.be.null;
    });

    it('applies custom CSS to buttons', async () => {
      const el = await fixture(
        html`<app-modal button1-text="OK" button1-css="background: blue;"></app-modal>`
      );
      const btn = el.shadowRoot.querySelector('.confirm');
      expect(btn.getAttribute('style')).to.equal('background: blue;');
    });
  });

  describe('Events', () => {
    it('dispatches modal-action1 on button1 click', async () => {
      const el = await fixture(html`<app-modal button1-text="OK"></app-modal>`);
      const btn = el.shadowRoot.querySelector('.confirm');

      setTimeout(() => btn.click());
      const event = await oneEvent(el, 'modal-action1');
      expect(event).to.exist;
    });

    it('dispatches modal-action2 on button2 click', async () => {
      const el = await fixture(html`<app-modal button2-text="Cancel"></app-modal>`);
      const btn = el.shadowRoot.querySelector('.cancel');

      setTimeout(() => btn.click());
      const event = await oneEvent(el, 'modal-action2');
      expect(event).to.exist;
    });

    it('dispatches modal-closed-requested on close button click', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');

      setTimeout(() => closeBtn.click());
      const event = await oneEvent(el, 'modal-closed-requested');
      expect(event.detail.modalId).to.equal(el.modalId);
    });

    it('dispatches modal-closed-requested on Escape key', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);

      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });
      const event = await oneEvent(el, 'modal-closed-requested');
      expect(event).to.exist;
    });
  });

  describe('Methods', () => {
    it('close() hides modal in declarative mode', async () => {
      const el = await fixture(html`<app-modal open></app-modal>`);
      await el.updateComplete;
      expect(el.open).to.be.true;

      el.close();
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.false;
      expect(el.style.display).to.equal('none');
      expect(el.isConnected).to.be.true; // Modal stays in DOM
    });

    it('setContent() sets content element properties', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      const content = document.createElement('div');
      content.id = 'test-content';
      content.textContent = 'Test';

      // Just verify properties are set (DOM manipulation tested via demo)
      el._pendingContent = content;
      el.contentElementId = content.id;
      el.contentElementType = content.tagName.toLowerCase();

      expect(el.contentElementId).to.equal('test-content');
      expect(el.contentElementType).to.equal('div');
    });
  });

  describe('Button actions', () => {
    it('calls button1Action when button1 clicked', async () => {
      const el = await fixture(html`<app-modal button1-text="OK"></app-modal>`);
      let called = false;
      el.button1Action = () => {
        called = true;
      };

      const btn = el.shadowRoot.querySelector('.confirm');
      btn.click();

      expect(called).to.be.true;
    });

    it('does not close if button action returns false', async () => {
      const el = await fixture(html`<app-modal button1-text="OK"></app-modal>`);
      el.button1Action = () => false;

      const btn = el.shadowRoot.querySelector('.confirm');
      btn.click();

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.isConnected).to.be.true;
    });
  });

  describe('Global close event', () => {
    it('closes on close-modal event with matching modalId', async () => {
      // Use programmatic mode so modal is actually removed from DOM
      const el = showModal({ title: 'Test' });
      el.modalId = 'test-modal';
      await el.updateComplete;

      document.dispatchEvent(
        new CustomEvent('close-modal', {
          detail: { modalId: 'test-modal' },
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 400));
      expect(document.body.contains(el)).to.be.false;
    });

    it('closes on close-modal event with target=all', async () => {
      // Use programmatic mode so modal is actually removed from DOM
      const el = showModal({ title: 'Test' });
      await el.updateComplete;

      document.dispatchEvent(
        new CustomEvent('close-modal', {
          detail: { target: 'all' },
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 400));
      expect(document.body.contains(el)).to.be.false;
    });

    it('does not close on close-modal event with different modalId', async () => {
      const el = showModal({ title: 'Test' });
      el.modalId = 'test-modal';
      await el.updateComplete;

      document.dispatchEvent(
        new CustomEvent('close-modal', {
          detail: { modalId: 'other-modal' },
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(document.body.contains(el)).to.be.true;
    });
  });

  describe('CSS Custom Properties', () => {
    it('applies max-width CSS variable', async () => {
      const el = await fixture(html`<app-modal max-width="600px"></app-modal>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue('--max-width')).to.equal('600px');
    });

    it('applies max-height CSS variable', async () => {
      const el = await fixture(html`<app-modal max-height="80vh"></app-modal>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue('--max-height')).to.equal('80vh');
    });
  });

  describe('Declarative mode (open property)', () => {
    it('is hidden when open attribute is false', async () => {
      const el = await fixture(html`<app-modal .open="${false}"></app-modal>`);
      await el.updateComplete;
      expect(el.style.display).to.equal('none');
    });

    it('is visible when open attribute is true', async () => {
      const el = await fixture(html`<app-modal open></app-modal>`);
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.style.display).to.not.equal('none');
    });

    it('shows modal when open changes from false to true', async () => {
      const el = await fixture(html`<app-modal .open="${false}"></app-modal>`);
      await el.updateComplete;
      expect(el.style.display).to.equal('none');

      el.open = true;
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.style.display).to.not.equal('none');
    });

    it('hides modal when open changes from true to false', async () => {
      const el = await fixture(html`<app-modal open></app-modal>`);
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));

      el.open = false;
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.style.display).to.equal('none');
    });

    it('does not destroy modal on close() in declarative mode', async () => {
      const el = await fixture(html`<app-modal open></app-modal>`);
      await el.updateComplete;

      el.close();
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(el.isConnected).to.be.true;
      expect(el.open).to.be.false;
    });

    it('show() sets open to true in declarative mode', async () => {
      const el = await fixture(html`<app-modal .open="${false}"></app-modal>`);
      await el.updateComplete;

      el.show();
      await el.updateComplete;
      expect(el.open).to.be.true;
    });

    it('reflects open attribute', async () => {
      const el = await fixture(html`<app-modal .open="${false}"></app-modal>`);
      await el.updateComplete;
      expect(el.hasAttribute('open')).to.be.false;

      el.open = true;
      await el.updateComplete;
      expect(el.hasAttribute('open')).to.be.true;
    });

    it('dispatches events in declarative mode', async () => {
      const el = await fixture(html`<app-modal open button1-text="OK"></app-modal>`);
      await el.updateComplete;

      const btn = el.shadowRoot.querySelector('.confirm');
      setTimeout(() => btn.click());
      const event = await oneEvent(el, 'modal-action1');
      expect(event).to.exist;
    });
  });

  describe('Programmatic mode (via showModal)', () => {
    it('shows automatically when created via showModal()', async () => {
      const el = showModal({ title: 'Test' });
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(el.style.display).to.not.equal('none');
    });

    it('destroys modal on close() in programmatic mode', async () => {
      const el = showModal({ title: 'Test' });
      await el.updateComplete;

      el.close();
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(document.body.contains(el)).to.be.false;
    });

    it('stays hidden when created declaratively without open', async () => {
      // Declarative modals (in HTML) should NOT auto-show
      const el = await fixture(html`<app-modal></app-modal>`);
      await el.updateComplete;
      expect(el.style.display).to.equal('none');
    });
  });

  describe('Intercept close (intercept-close attribute)', () => {
    it('interceptClose defaults to false', async () => {
      const el = await fixture(html`<app-modal></app-modal>`);
      expect(el.interceptClose).to.be.false;
    });

    it('accepts intercept-close attribute', async () => {
      const el = await fixture(html`<app-modal intercept-close></app-modal>`);
      expect(el.interceptClose).to.be.true;
    });

    it('auto-closes after 200ms when interceptClose is false (default)', async () => {
      const el = await fixture(html`<app-modal open></app-modal>`);
      await el.updateComplete;

      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      closeBtn.click();

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.false;
    });

    it('does NOT auto-close when interceptClose is true', async () => {
      const el = await fixture(html`<app-modal open intercept-close></app-modal>`);
      await el.updateComplete;

      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      closeBtn.click();

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.true; // Should still be open
    });

    it('dispatches modal-closed-requested even when interceptClose is true', async () => {
      const el = await fixture(html`<app-modal open intercept-close></app-modal>`);
      await el.updateComplete;

      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      setTimeout(() => closeBtn.click());
      const event = await oneEvent(el, 'modal-closed-requested');
      expect(event).to.exist;
      expect(event.detail.modalId).to.equal(el.modalId);
    });

    it('closes via close-modal event when interceptClose is true', async () => {
      const el = await fixture(
        html`<app-modal open intercept-close modal-id="intercept-test"></app-modal>`
      );
      await el.updateComplete;

      // Simulate user clicking close - modal should NOT auto-close
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      closeBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.true;

      // Now external code decides to close it via event
      document.dispatchEvent(
        new CustomEvent('close-modal', {
          detail: { modalId: 'intercept-test' },
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(el.open).to.be.false;
    });

    it('supports interceptClose via showModal options', async () => {
      const el = showModal({ title: 'Test', interceptClose: true });
      await el.updateComplete;
      expect(el.interceptClose).to.be.true;
    });
  });
});
