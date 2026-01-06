import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../src/qr-code.js';

describe('QrCode', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<qr-code></qr-code>`);
      expect(el).to.exist;
      expect(el.data).to.equal('');
      expect(el.size).to.equal(200);
      expect(el.errorCorrection).to.equal('M');
      expect(el.color).to.equal('#000000');
      expect(el.background).to.equal('#ffffff');
    });

    it('shows error message when no data', async () => {
      const el = await fixture(html`<qr-code></qr-code>`);
      const error = el.shadowRoot.querySelector('.error');
      expect(error).to.exist;
      expect(error.textContent).to.include('No data');
    });

    it('renders canvas when data is provided', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });

    it('hides error message when data is provided', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      const error = el.shadowRoot.querySelector('.error');
      expect(error).to.be.null;
    });
  });

  describe('properties', () => {
    it('accepts data attribute', async () => {
      const el = await fixture(html`<qr-code data="Hello World"></qr-code>`);
      expect(el.data).to.equal('Hello World');
    });

    it('accepts size attribute', async () => {
      const el = await fixture(html`<qr-code data="test" size="300"></qr-code>`);
      expect(el.size).to.equal(300);
    });

    it('accepts error-correction attribute', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="H"></qr-code>`);
      expect(el.errorCorrection).to.equal('H');
    });

    it('accepts color attribute', async () => {
      const el = await fixture(html`<qr-code data="test" color="#ff0000"></qr-code>`);
      expect(el.color).to.equal('#ff0000');
    });

    it('accepts background attribute', async () => {
      const el = await fixture(html`<qr-code data="test" background="#f0f0f0"></qr-code>`);
      expect(el.background).to.equal('#f0f0f0');
    });
  });

  describe('QR generation', () => {
    it('generates QR code on data change', async () => {
      const el = await fixture(html`<qr-code></qr-code>`);
      el.data = 'New data';
      await el.updateComplete;
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });

    it('regenerates QR code on size change', async () => {
      const el = await fixture(html`<qr-code data="test" size="100"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas.width).to.equal(100);

      el.size = 200;
      await el.updateComplete;
      await aTimeout(50);
      expect(canvas.width).to.equal(200);
    });

    it('handles URL data', async () => {
      const el = await fixture(html`<qr-code data="https://example.com"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });

    it('handles long text data', async () => {
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      const el = await fixture(html`<qr-code data="${longText}"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });
  });

  describe('error correction levels', () => {
    it('supports L level', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="L"></qr-code>`);
      expect(el._getErrorCorrectionLevel()).to.equal(1);
    });

    it('supports M level', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="M"></qr-code>`);
      expect(el._getErrorCorrectionLevel()).to.equal(0);
    });

    it('supports Q level', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="Q"></qr-code>`);
      expect(el._getErrorCorrectionLevel()).to.equal(3);
    });

    it('supports H level', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="H"></qr-code>`);
      expect(el._getErrorCorrectionLevel()).to.equal(2);
    });

    it('handles lowercase error correction', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="h"></qr-code>`);
      expect(el._getErrorCorrectionLevel()).to.equal(2);
    });

    it('defaults to M for invalid level', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="X"></qr-code>`);
      expect(el._getErrorCorrectionLevel()).to.equal(0);
    });
  });

  describe('canvas operations', () => {
    it('sets canvas size correctly', async () => {
      const el = await fixture(html`<qr-code data="test" size="150"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas.width).to.equal(150);
      expect(canvas.height).to.equal(150);
    });

    it('applies foreground color', async () => {
      const el = await fixture(html`<qr-code data="test" color="#ff0000"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
      // Color is applied during rendering
    });

    it('applies background color', async () => {
      const el = await fixture(html`<qr-code data="test" background="#0000ff"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
      // Background is applied during rendering
    });
  });

  describe('toDataURL method', () => {
    it('returns data URL for valid QR code', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      await aTimeout(50);
      const dataUrl = el.toDataURL();
      expect(dataUrl).to.be.a('string');
      expect(dataUrl).to.include('data:image/png');
    });

    it('returns empty string when no data', async () => {
      const el = await fixture(html`<qr-code></qr-code>`);
      const dataUrl = el.toDataURL();
      expect(dataUrl).to.equal('');
    });

    it('supports different image types', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      await aTimeout(50);
      const jpegUrl = el.toDataURL('image/jpeg');
      expect(jpegUrl).to.include('data:image/jpeg');
    });
  });

  describe('download method', () => {
    it('creates download link', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      await aTimeout(50);

      let clickCalled = false;
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = (tag) => {
        const element = originalCreateElement(tag);
        if (tag === 'a') {
          element.click = () => {
            clickCalled = true;
          };
        }
        return element;
      };

      el.download('test.png');
      expect(clickCalled).to.be.true;

      document.createElement = originalCreateElement;
    });

    it('uses default filename', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      await aTimeout(50);

      let downloadFilename = '';
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = (tag) => {
        const element = originalCreateElement(tag);
        if (tag === 'a') {
          Object.defineProperty(element, 'download', {
            set(value) {
              downloadFilename = value;
            },
            get() {
              return downloadFilename;
            },
          });
          element.click = () => {};
        }
        return element;
      };

      el.download();
      expect(downloadFilename).to.equal('qrcode.png');

      document.createElement = originalCreateElement;
    });
  });

  describe('styling', () => {
    it('is inline-block by default', async () => {
      const el = await fixture(html`<qr-code data="test"></qr-code>`);
      const style = getComputedStyle(el);
      expect(style.display).to.equal('inline-block');
    });

    it('has qr-container with correct size', async () => {
      const el = await fixture(html`<qr-code data="test" size="150"></qr-code>`);
      const container = el.shadowRoot.querySelector('.qr-container');
      expect(container).to.exist;
      expect(container.style.cssText).to.include('--qr-size: 150px');
    });
  });

  describe('dynamic updates', () => {
    it('updates QR code when data changes', async () => {
      const el = await fixture(html`<qr-code data="initial"></qr-code>`);
      await aTimeout(50);

      const canvas = el.shadowRoot.querySelector('canvas');
      const initialData = canvas.toDataURL();

      el.data = 'updated';
      await el.updateComplete;
      await aTimeout(50);

      const updatedData = canvas.toDataURL();
      expect(updatedData).to.not.equal(initialData);
    });

    it('updates QR code when color changes', async () => {
      const el = await fixture(html`<qr-code data="test" color="#000000"></qr-code>`);
      await aTimeout(50);

      const canvas = el.shadowRoot.querySelector('canvas');
      const initialData = canvas.toDataURL();

      el.color = '#ff0000';
      await el.updateComplete;
      await aTimeout(50);

      const updatedData = canvas.toDataURL();
      expect(updatedData).to.not.equal(initialData);
    });

    it('updates QR code when background changes', async () => {
      const el = await fixture(html`<qr-code data="test" background="#ffffff"></qr-code>`);
      await aTimeout(50);

      const canvas = el.shadowRoot.querySelector('canvas');
      const initialData = canvas.toDataURL();

      el.background = '#f0f0f0';
      await el.updateComplete;
      await aTimeout(50);

      const updatedData = canvas.toDataURL();
      expect(updatedData).to.not.equal(initialData);
    });

    it('updates QR code when error correction changes', async () => {
      const el = await fixture(html`<qr-code data="test" error-correction="L"></qr-code>`);
      await aTimeout(50);

      const canvas = el.shadowRoot.querySelector('canvas');
      const initialData = canvas.toDataURL();

      el.errorCorrection = 'H';
      await el.updateComplete;
      await aTimeout(50);

      const updatedData = canvas.toDataURL();
      expect(updatedData).to.not.equal(initialData);
    });
  });

  describe('special characters', () => {
    it('handles special characters in data', async () => {
      const el = await fixture(html`<qr-code data="Hello &amp; World!"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });

    it('handles unicode characters', async () => {
      const el = await fixture(html`<qr-code></qr-code>`);
      el.data = 'Hello ';
      await el.updateComplete;
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });

    it('handles numbers', async () => {
      const el = await fixture(html`<qr-code data="1234567890"></qr-code>`);
      await aTimeout(50);
      const canvas = el.shadowRoot.querySelector('canvas');
      expect(canvas).to.exist;
    });
  });
});
