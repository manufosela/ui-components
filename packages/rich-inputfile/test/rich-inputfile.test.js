import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/rich-inputfile.js';

// Helper to create a mock File
function createMockFile(name, size, type) {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

describe('RichInputfile', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      expect(el).to.exist;
      expect(el.name).to.equal('');
      expect(el.allowedExtensions).to.deep.equal([]);
      expect(el.maxSize).to.equal(0);
      expect(el.showPreview).to.be.true;
      expect(el.previewSize).to.equal(60);
      expect(el.dropzone).to.be.true;
      expect(el.disabled).to.be.false;
    });

    it('renders file input', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const input = el.shadowRoot.querySelector('input[type="file"]');
      expect(input).to.exist;
    });

    it('renders label when provided', async () => {
      const el = await fixture(html`<rich-inputfile label="Upload File"></rich-inputfile>`);
      const label = el.shadowRoot.querySelector('label');
      expect(label).to.exist;
      expect(label.textContent).to.equal('Upload File');
    });

    it('does not render label when not provided', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const label = el.shadowRoot.querySelector('label');
      expect(label).to.be.null;
    });

    it('renders dropzone', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const dropzone = el.shadowRoot.querySelector('.dropzone');
      expect(dropzone).to.exist;
    });
  });

  describe('properties', () => {
    it('accepts name attribute', async () => {
      const el = await fixture(html`<rich-inputfile name="myfile"></rich-inputfile>`);
      expect(el.name).to.equal('myfile');
      const input = el.shadowRoot.querySelector('input');
      expect(input.name).to.equal('myfile');
    });

    it('accepts allowed-extensions attribute', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions="jpg,png,gif"></rich-inputfile>`
      );
      expect(el.allowedExtensions).to.deep.equal(['jpg', 'png', 'gif']);
    });

    it('accepts max-size attribute', async () => {
      const el = await fixture(html`<rich-inputfile max-size="1000000"></rich-inputfile>`);
      expect(el.maxSize).to.equal(1000000);
    });

    it('accepts show-preview attribute', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      el.showPreview = false;
      expect(el.showPreview).to.be.false;
    });

    it('accepts preview-size attribute', async () => {
      const el = await fixture(html`<rich-inputfile preview-size="100"></rich-inputfile>`);
      expect(el.previewSize).to.equal(100);
    });

    it('accepts dropzone attribute', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      el.dropzone = false;
      expect(el.dropzone).to.be.false;
    });

    it('accepts disabled attribute', async () => {
      const el = await fixture(html`<rich-inputfile disabled></rich-inputfile>`);
      expect(el.disabled).to.be.true;
      const input = el.shadowRoot.querySelector('input');
      expect(input.disabled).to.be.true;
    });
  });

  describe('file handling', () => {
    it('processes file on change', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');

      setTimeout(() => {
        el._processFile(file);
      });
      const { detail } = await oneEvent(el, 'file-change');

      expect(detail.name).to.equal('test.txt');
      expect(detail.size).to.equal(100);
      expect(detail.type).to.equal('text/plain');
    });

    it('validates file extension', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions="jpg,png"></rich-inputfile>`
      );
      const file = createMockFile('test.txt', 100, 'text/plain');

      setTimeout(() => {
        el._processFile(file);
      });
      const { detail } = await oneEvent(el, 'file-error');

      expect(detail.message).to.include('not allowed');
    });

    it('allows valid file extension', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions="jpg,png"></rich-inputfile>`
      );
      const file = createMockFile('test.png', 100, 'image/png');

      setTimeout(() => {
        el._processFile(file);
      });
      const { detail } = await oneEvent(el, 'file-change');

      expect(detail.name).to.equal('test.png');
    });

    it('validates file size', async () => {
      const el = await fixture(html`<rich-inputfile max-size="50"></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');

      setTimeout(() => {
        el._processFile(file);
      });
      const { detail } = await oneEvent(el, 'file-error');

      expect(detail.message).to.include('too large');
    });

    it('allows file within size limit', async () => {
      const el = await fixture(html`<rich-inputfile max-size="200"></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');

      setTimeout(() => {
        el._processFile(file);
      });
      const { detail } = await oneEvent(el, 'file-change');

      expect(detail.name).to.equal('test.txt');
    });
  });

  describe('clear functionality', () => {
    it('clears file on button click', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      expect(el._fileName).to.equal('test.txt');

      setTimeout(() => {
        el._clearFile();
      });
      await oneEvent(el, 'file-clear');

      expect(el._fileName).to.equal('');
      expect(el.getFile()).to.be.null;
    });

    it('clear method works', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      setTimeout(() => {
        el.clear();
      });
      await oneEvent(el, 'file-clear');

      expect(el._fileName).to.equal('');
    });
  });

  describe('getFile methods', () => {
    it('getFile returns the file', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const result = el.getFile();
      expect(result).to.equal(file);
    });

    it('getFile returns null when no file', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      expect(el.getFile()).to.be.null;
    });

    it('getFileArrayBuffer returns array buffer', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 10, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const buffer = await el.getFileArrayBuffer();
      expect(buffer).to.be.an.instanceof(ArrayBuffer);
      expect(buffer.byteLength).to.equal(10);
    });

    it('getFileUint8Array returns uint8 array', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 10, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const array = await el.getFileUint8Array();
      expect(array).to.be.an.instanceof(Uint8Array);
      expect(array.length).to.equal(10);
    });

    it('getFileDataURL returns data URL', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 10, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const dataUrl = await el.getFileDataURL();
      expect(dataUrl).to.be.a('string');
      expect(dataUrl).to.include('data:');
    });
  });

  describe('setFile method', () => {
    it('setFile sets the file', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');

      setTimeout(() => {
        el.setFile(file);
      });
      const { detail } = await oneEvent(el, 'file-change');

      expect(detail.name).to.equal('test.txt');
      expect(el.getFile()).to.equal(file);
    });

    it('setFile ignores non-File objects', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      el.setFile('not a file');
      await el.updateComplete;

      expect(el.getFile()).to.be.null;
    });
  });

  describe('drag and drop', () => {
    it('handles drag over', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const dropzone = el.shadowRoot.querySelector('.dropzone');

      dropzone.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
      await el.updateComplete;

      expect(el._dragOver).to.be.true;
      expect(dropzone.classList.contains('drag-over')).to.be.true;
    });

    it('handles drag leave', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const dropzone = el.shadowRoot.querySelector('.dropzone');

      el._dragOver = true;
      await el.updateComplete;

      dropzone.dispatchEvent(new DragEvent('dragleave', { bubbles: true }));
      await el.updateComplete;

      expect(el._dragOver).to.be.false;
    });

    it('ignores drag when disabled', async () => {
      const el = await fixture(html`<rich-inputfile disabled></rich-inputfile>`);
      const dropzone = el.shadowRoot.querySelector('.dropzone');

      dropzone.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
      await el.updateComplete;

      expect(el._dragOver).to.be.false;
    });
  });

  describe('display', () => {
    it('shows file info after selection', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 1024, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const fileName = el.shadowRoot.querySelector('.file-name');
      expect(fileName).to.exist;
      expect(fileName.textContent).to.equal('test.txt');
    });

    it('shows file size', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 1024, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const fileSize = el.shadowRoot.querySelector('.file-size');
      expect(fileSize).to.exist;
      expect(fileSize.textContent).to.include('1.0 KB');
    });

    it('shows error message', async () => {
      const el = await fixture(html`<rich-inputfile max-size="50"></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      const error = el.shadowRoot.querySelector('.error');
      expect(error).to.exist;
      expect(error.textContent).to.include('too large');
    });

    it('shows hints for restrictions', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions="jpg,png" max-size="1048576"></rich-inputfile>`
      );
      await el.updateComplete;

      const hint = el.shadowRoot.querySelector('.hint');
      expect(hint).to.exist;
      expect(hint.textContent).to.include('.jpg');
      expect(hint.textContent).to.include('Max');
    });
  });

  describe('image preview', () => {
    it('shows preview for images', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.png', 100, 'image/png');
      el._processFile(file);
      await el.updateComplete;

      expect(el._fileUrl).to.not.equal('');
    });

    it('does not show preview for non-images', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      const file = createMockFile('test.txt', 100, 'text/plain');
      el._processFile(file);
      await el.updateComplete;

      expect(el._fileUrl).to.equal('');
    });

    it('does not show preview when disabled', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      el.showPreview = false;
      await el.updateComplete;

      const file = createMockFile('test.png', 100, 'image/png');
      el._processFile(file);
      await el.updateComplete;

      expect(el._fileUrl).to.equal('');
    });
  });

  describe('size formatting', () => {
    it('formats bytes', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      expect(el._formatSize(100)).to.equal('100 B');
    });

    it('formats kilobytes', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      expect(el._formatSize(1024)).to.equal('1.0 KB');
    });

    it('formats megabytes', async () => {
      const el = await fixture(html`<rich-inputfile></rich-inputfile>`);
      expect(el._formatSize(1048576)).to.equal('1.0 MB');
    });
  });

  describe('accept attribute', () => {
    it('sets accept from allowed extensions', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions="jpg,png"></rich-inputfile>`
      );
      await el.updateComplete;

      const input = el.shadowRoot.querySelector('input');
      expect(input.accept).to.equal('.jpg,.png');
    });

    it('uses custom accept when provided', async () => {
      const el = await fixture(html`<rich-inputfile accept="image/*"></rich-inputfile>`);
      await el.updateComplete;

      const input = el.shadowRoot.querySelector('input');
      expect(input.accept).to.equal('image/*');
    });
  });

  describe('extension conversion via attribute', () => {
    it('converts string attribute to array', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions="jpg,png,gif"></rich-inputfile>`
      );
      expect(el.allowedExtensions).to.deep.equal(['jpg', 'png', 'gif']);
    });

    it('removes leading dots', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions=".jpg,.png"></rich-inputfile>`
      );
      expect(el.allowedExtensions).to.deep.equal(['jpg', 'png']);
    });

    it('handles empty string', async () => {
      const el = await fixture(html`<rich-inputfile allowed-extensions=""></rich-inputfile>`);
      expect(el.allowedExtensions).to.deep.equal([]);
    });

    it('handles whitespace', async () => {
      const el = await fixture(
        html`<rich-inputfile allowed-extensions=" jpg , png "></rich-inputfile>`
      );
      expect(el.allowedExtensions).to.deep.equal(['jpg', 'png']);
    });
  });
});
