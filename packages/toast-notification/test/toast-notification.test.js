import { html } from 'lit';
import { fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/toast-notification.js';

describe('ToastNotification', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      expect(el).to.exist;
      expect(el.message).to.equal('');
      expect(el.type).to.equal('');
      expect(el.position).to.equal('top-right');
      expect(el.duration).to.equal(3000);
      expect(el.visible).to.be.false;
    });

    it('renders toast container', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast).to.exist;
    });

    it('renders message', async () => {
      const el = await fixture(html`<toast-notification message="Hello"></toast-notification>`);
      const message = el.shadowRoot.querySelector('.message');
      expect(message.textContent).to.equal('Hello');
    });

    it('renders close button when closable', async () => {
      const el = await fixture(html`<toast-notification closable></toast-notification>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      expect(closeBtn).to.exist;
    });

    it('does not render close button when not closable', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      el.closable = false;
      await el.updateComplete;
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      expect(closeBtn).to.be.null;
    });
  });

  describe('Properties', () => {
    it('accepts message attribute', async () => {
      const el = await fixture(html`<toast-notification message="Test"></toast-notification>`);
      expect(el.message).to.equal('Test');
    });

    it('accepts type attribute', async () => {
      const el = await fixture(html`<toast-notification type="success"></toast-notification>`);
      expect(el.type).to.equal('success');
    });

    it('accepts position attribute', async () => {
      const el = await fixture(
        html`<toast-notification position="bottom-left"></toast-notification>`
      );
      expect(el.position).to.equal('bottom-left');
    });

    it('accepts duration attribute', async () => {
      const el = await fixture(html`<toast-notification duration="5000"></toast-notification>`);
      expect(el.duration).to.equal(5000);
    });

    it('reflects visible to attribute', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      el.visible = true;
      await el.updateComplete;
      expect(el.hasAttribute('visible')).to.be.true;
    });
  });

  describe('Type styling', () => {
    it('applies success class', async () => {
      const el = await fixture(html`<toast-notification type="success"></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('success')).to.be.true;
    });

    it('applies error class', async () => {
      const el = await fixture(html`<toast-notification type="error"></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('error')).to.be.true;
    });

    it('applies warning class', async () => {
      const el = await fixture(html`<toast-notification type="warning"></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('warning')).to.be.true;
    });

    it('applies info class', async () => {
      const el = await fixture(html`<toast-notification type="info"></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.classList.contains('info')).to.be.true;
    });
  });

  describe('Icons', () => {
    it('renders success icon', async () => {
      const el = await fixture(html`<toast-notification type="success"></toast-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.exist;
    });

    it('renders error icon', async () => {
      const el = await fixture(html`<toast-notification type="error"></toast-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.exist;
    });

    it('renders warning icon', async () => {
      const el = await fixture(html`<toast-notification type="warning"></toast-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.exist;
    });

    it('renders info icon', async () => {
      const el = await fixture(html`<toast-notification type="info"></toast-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.exist;
    });

    it('does not render icon for default type', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.be.null;
    });
  });

  describe('Methods', () => {
    it('show() makes toast visible', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      el.show();
      expect(el.visible).to.be.true;
    });

    it('show() accepts message parameter', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      el.show('New message');
      expect(el.message).to.equal('New message');
    });

    it('show() accepts options parameter', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      el.show('Test', { type: 'success', position: 'bottom-center' });
      expect(el.type).to.equal('success');
      expect(el.position).to.equal('bottom-center');
    });

    it('hide() makes toast hidden', async () => {
      const el = await fixture(html`<toast-notification visible></toast-notification>`);
      el.hide();
      expect(el.visible).to.be.false;
    });
  });

  describe('Auto-hide', () => {
    it('auto-hides after duration', async () => {
      const el = await fixture(html`<toast-notification duration="100"></toast-notification>`);
      el.show();
      expect(el.visible).to.be.true;
      await aTimeout(150);
      expect(el.visible).to.be.false;
    });

    it('does not auto-hide when duration is 0', async () => {
      const el = await fixture(html`<toast-notification duration="0"></toast-notification>`);
      el.show();
      await aTimeout(100);
      expect(el.visible).to.be.true;
    });

    it('clears previous timeout on new show()', async () => {
      const el = await fixture(html`<toast-notification duration="100"></toast-notification>`);
      el.show();
      await aTimeout(50);
      el.show(); // Reset timeout
      await aTimeout(70);
      expect(el.visible).to.be.true;
      await aTimeout(50);
      expect(el.visible).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches toast-show event', async () => {
      const el = await fixture(html`<toast-notification message="Test"></toast-notification>`);
      const listener = oneEvent(el, 'toast-show');
      el.show();
      const event = await listener;
      expect(event.detail.message).to.equal('Test');
    });

    it('dispatches toast-hide event', async () => {
      const el = await fixture(html`<toast-notification visible></toast-notification>`);
      const listener = oneEvent(el, 'toast-hide');
      el.hide();
      const event = await listener;
      expect(event.bubbles).to.be.true;
    });

    it('dispatches toast-close event on close button click', async () => {
      const el = await fixture(html`<toast-notification visible closable></toast-notification>`);
      const listener = oneEvent(el, 'toast-close');
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      closeBtn.click();
      const event = await listener;
      expect(event.composed).to.be.true;
    });
  });

  describe('Global events', () => {
    it('responds to toast-notification-show event', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      document.dispatchEvent(
        new CustomEvent('toast-notification-show', {
          detail: { message: 'Global message', type: 'success' },
        })
      );
      expect(el.visible).to.be.true;
      expect(el.message).to.equal('Global message');
      expect(el.type).to.equal('success');
    });

    it('responds to toast-notification-hide event', async () => {
      const el = await fixture(html`<toast-notification visible></toast-notification>`);
      document.dispatchEvent(new CustomEvent('toast-notification-hide'));
      expect(el.visible).to.be.false;
    });
  });

  describe('Progress bar', () => {
    it('renders progress bar when progress and visible', async () => {
      const el = await fixture(
        html`<toast-notification progress visible duration="3000"></toast-notification>`
      );
      const progress = el.shadowRoot.querySelector('.progress');
      expect(progress).to.exist;
    });

    it('does not render progress bar when not visible', async () => {
      const el = await fixture(html`<toast-notification progress></toast-notification>`);
      const progress = el.shadowRoot.querySelector('.progress');
      expect(progress).to.be.null;
    });

    it('does not render progress bar when duration is 0', async () => {
      const el = await fixture(
        html`<toast-notification progress visible duration="0"></toast-notification>`
      );
      const progress = el.shadowRoot.querySelector('.progress');
      expect(progress).to.be.null;
    });
  });

  describe('Accessibility', () => {
    it('has alert role', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.getAttribute('role')).to.equal('alert');
    });

    it('has aria-live polite', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.getAttribute('aria-live')).to.equal('polite');
    });

    it('has aria-atomic true', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      const toast = el.shadowRoot.querySelector('.toast');
      expect(toast.getAttribute('aria-atomic')).to.equal('true');
    });

    it('close button has aria-label', async () => {
      const el = await fixture(html`<toast-notification closable></toast-notification>`);
      const closeBtn = el.shadowRoot.querySelector('.close-btn');
      expect(closeBtn.getAttribute('aria-label')).to.equal('Close notification');
    });
  });

  describe('Cleanup', () => {
    it('clears timeout on disconnect', async () => {
      const el = await fixture(html`<toast-notification duration="1000"></toast-notification>`);
      el.show();
      el.remove();
      // No error should occur
    });

    it('removes event listeners on disconnect', async () => {
      const el = await fixture(html`<toast-notification></toast-notification>`);
      el.remove();
      // Should not respond to global events after removal
      document.dispatchEvent(
        new CustomEvent('toast-notification-show', {
          detail: { message: 'Test' },
        })
      );
      // No error, element is disconnected
    });
  });
});
