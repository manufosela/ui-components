import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/slide-notification.js';

describe('SlideNotification', () => {
  afterEach(() => {
    document.querySelectorAll('slide-notification').forEach((el) => el.remove());
  });

  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      expect(el).to.exist;
      expect(el.title).to.equal('');
      expect(el.message).to.equal('');
      expect(el.timetohide).to.equal(3000);
      expect(el.type).to.equal('info');
    });

    it('renders title when provided', async () => {
      const el = await fixture(html`<slide-notification title="Test Title"></slide-notification>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Test Title');
    });

    it('does not render title when empty', async () => {
      const el = await fixture(html`<slide-notification message="Test"></slide-notification>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title).to.be.null;
    });

    it('renders message', async () => {
      const el = await fixture(
        html`<slide-notification message="Hello World"></slide-notification>`
      );
      const message = el.shadowRoot.querySelector('.message');
      expect(message.textContent).to.equal('Hello World');
    });

    it('renders message with HTML', async () => {
      const el = await fixture(
        html`<slide-notification message="<strong>Bold</strong>"></slide-notification>`
      );
      const message = el.shadowRoot.querySelector('.message');
      expect(message.innerHTML).to.include('<strong>Bold</strong>');
    });

    it('renders icon', async () => {
      const el = await fixture(html`<slide-notification type="success"></slide-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.exist;
      expect(icon.textContent).to.equal('✅');
    });
  });

  describe('Types', () => {
    it('shows info icon for info type', async () => {
      const el = await fixture(html`<slide-notification type="info"></slide-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon.textContent).to.equal('ℹ️');
    });

    it('shows success icon for success type', async () => {
      const el = await fixture(html`<slide-notification type="success"></slide-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon.textContent).to.equal('✅');
    });

    it('shows warning icon for warning type', async () => {
      const el = await fixture(html`<slide-notification type="warning"></slide-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon.textContent).to.equal('⚠️');
    });

    it('shows error icon for error type', async () => {
      const el = await fixture(html`<slide-notification type="error"></slide-notification>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon.textContent).to.equal('❌');
    });

    it('reflects type attribute', async () => {
      const el = await fixture(html`<slide-notification type="error"></slide-notification>`);
      expect(el.getAttribute('type')).to.equal('error');
    });
  });

  // Helper to wait for double requestAnimationFrame
  const waitForAnimation = () =>
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 50))));

  describe('Animation', () => {
    it('adds visible class on show', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.show();
      await waitForAnimation();
      expect(el.classList.contains('visible')).to.be.true;
    });

    it('adds hiding class on hide', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.show();
      await waitForAnimation();
      el.hide();
      expect(el.classList.contains('hiding')).to.be.true;
    });
  });

  describe('Auto-hide', () => {
    it('auto-hides after timetohide when shown', async () => {
      const el = await fixture(html`<slide-notification timetohide="100"></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 800));
      expect(el.classList.contains('hiding')).to.be.true;
    });

    it('does not auto-hide when timetohide is 0', async () => {
      const el = await fixture(html`<slide-notification timetohide="0"></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 200));
      expect(el._isVisible).to.be.true;
    });
  });

  describe('Events', () => {
    it('dispatches slide-notification-shown on show', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      setTimeout(() => el.show());
      const event = await oneEvent(el, 'slide-notification-shown');
      expect(event).to.exist;
    });

    it('dispatches slide-notification-hidden on hide', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 100));
      setTimeout(() => el.hide());
      const event = await oneEvent(el, 'slide-notification-hidden');
      expect(event).to.exist;
    });
  });

  describe('Methods', () => {
    it('hide() adds hiding class', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 100));
      el.hide();
      expect(el.classList.contains('hiding')).to.be.true;
    });

    it('show() makes notification visible', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 100));
      expect(el.classList.contains('visible')).to.be.true;
    });

    it('can show and hide multiple times', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 100));
      expect(el._isVisible).to.be.true;
      el.hide();
      expect(el._isVisible).to.be.false;
      el.show();
      await new Promise((r) => setTimeout(r, 100));
      expect(el._isVisible).to.be.true;
    });
  });

  describe('Custom colors', () => {
    it('uses custom background-color', async () => {
      const el = await fixture(
        html`<slide-notification background-color="#ff0000"></slide-notification>`
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue('--_bg')).to.equal('#ff0000');
    });

    it('uses type-specific color when no custom color', async () => {
      const el = await fixture(html`<slide-notification type="error"></slide-notification>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue('--_bg')).to.equal('#dc3545');
    });

    it('uses dark text for warning type', async () => {
      const el = await fixture(html`<slide-notification type="warning"></slide-notification>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue('--_color')).to.equal('#212529');
    });

    it('uses white text for other types', async () => {
      const el = await fixture(html`<slide-notification type="success"></slide-notification>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue('--_color')).to.equal('white');
    });
  });

  describe('Properties', () => {
    it('accepts timetohide as number', async () => {
      const el = await fixture(html`<slide-notification timetohide="5000"></slide-notification>`);
      expect(el.timetohide).to.equal(5000);
    });
  });

  describe('Persistent mode', () => {
    it('has persistent property', async () => {
      const el = await fixture(html`<slide-notification persistent></slide-notification>`);
      expect(el.persistent).to.be.true;
    });

    it('does not auto-hide when persistent', async () => {
      const el = await fixture(
        html`<slide-notification persistent timetohide="100"></slide-notification>`
      );
      el.show();
      await new Promise((r) => setTimeout(r, 200));
      expect(el._isVisible).to.be.true;
    });

    it('hides on click when persistent', async () => {
      const el = await fixture(html`<slide-notification persistent></slide-notification>`);
      el.show();
      await new Promise((r) => setTimeout(r, 100));
      el.click();
      expect(el._isVisible).to.be.false;
    });

    it('reflects persistent attribute', async () => {
      const el = await fixture(html`<slide-notification persistent></slide-notification>`);
      expect(el.hasAttribute('persistent')).to.be.true;
    });
  });

  describe('Programmatic creation', () => {
    it('auto-shows when created via showSlideNotification', async () => {
      const { showSlideNotification } = await import('../src/slide-notification.js');
      const el = showSlideNotification({ message: 'Test' });
      await new Promise((r) => setTimeout(r, 100));
      expect(el.classList.contains('visible')).to.be.true;
      el.hide();
    });

    it('auto-removes from DOM when hidden (programmatic)', async () => {
      const { showSlideNotification } = await import('../src/slide-notification.js');
      const el = showSlideNotification({ message: 'Test', timetohide: 100 });
      await new Promise((r) => setTimeout(r, 800));
      expect(document.body.contains(el)).to.be.false;
    });
  });
});
