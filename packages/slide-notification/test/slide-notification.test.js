import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/slide-notification.js';

describe('SlideNotification', () => {
  afterEach(() => {
    document.querySelectorAll('slide-notification').forEach(el => el.remove());
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
      const el = await fixture(html`<slide-notification message="Hello World"></slide-notification>`);
      const message = el.shadowRoot.querySelector('.message');
      expect(message.textContent).to.equal('Hello World');
    });

    it('renders message with HTML', async () => {
      const el = await fixture(html`<slide-notification message="<strong>Bold</strong>"></slide-notification>`);
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

  describe('Animation', () => {
    it('adds visible class on connect', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      await new Promise(r => setTimeout(r, 50));
      expect(el.classList.contains('visible')).to.be.true;
    });

    it('adds hiding class on hide', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.hide();
      expect(el.classList.contains('hiding')).to.be.true;
    });
  });

  describe('Auto-hide', () => {
    it('removes itself after timetohide', async () => {
      const el = await fixture(html`<slide-notification timetohide="100"></slide-notification>`);
      await new Promise(r => setTimeout(r, 800));
      expect(document.querySelector('slide-notification')).to.be.null;
    });

    it('does not auto-hide when timetohide is 0', async () => {
      const el = await fixture(html`<slide-notification timetohide="0"></slide-notification>`);
      await new Promise(r => setTimeout(r, 200));
      expect(el.isConnected).to.be.true;
    });
  });

  describe('Events', () => {
    it('dispatches slide-notification-shown on appear', async () => {
      const el = document.createElement('slide-notification');
      setTimeout(() => document.body.appendChild(el));
      const event = await oneEvent(el, 'slide-notification-shown');
      expect(event).to.exist;
      el.remove();
    });

    it('dispatches slide-notification-hidden on hide', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      setTimeout(() => el.hide());
      const event = await oneEvent(el, 'slide-notification-hidden');
      expect(event).to.exist;
    });
  });

  describe('Methods', () => {
    it('hide() removes after animation', async () => {
      const el = await fixture(html`<slide-notification></slide-notification>`);
      el.hide();
      await new Promise(r => setTimeout(r, 700));
      expect(document.querySelector('slide-notification')).to.be.null;
    });

    it('show() appends to body', async () => {
      const el = document.createElement('slide-notification');
      el.message = 'Test';
      el.show();
      expect(document.body.contains(el)).to.be.true;
      el.remove();
    });
  });

  describe('Custom colors', () => {
    it('uses custom background-color', async () => {
      const el = await fixture(html`<slide-notification background-color="#ff0000"></slide-notification>`);
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
      const el = await fixture(html`<slide-notification persistent timetohide="100"></slide-notification>`);
      await new Promise(r => setTimeout(r, 200));
      expect(el.isConnected).to.be.true;
    });

    it('hides on click when persistent', async () => {
      const el = await fixture(html`<slide-notification persistent></slide-notification>`);
      el.click();
      await new Promise(r => setTimeout(r, 700));
      expect(document.querySelector('slide-notification')).to.be.null;
    });

    it('reflects persistent attribute', async () => {
      const el = await fixture(html`<slide-notification persistent></slide-notification>`);
      expect(el.hasAttribute('persistent')).to.be.true;
    });
  });
});
