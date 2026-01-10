import { LitElement, html, css } from 'lit';

/**
 * Enhanced file input web component with preview and validation.
 *
 * @element rich-inputfile
 * @fires file-change - Fired when a file is selected
 * @fires file-clear - Fired when the file is cleared
 * @fires file-error - Fired when file validation fails
 * @cssprop [--input-border=#d1d5db] - Border color
 * @cssprop [--input-border-focus=#3b82f6] - Focus border color
 * @cssprop [--input-bg=#fff] - Background color
 * @cssprop [--input-radius=8px] - Border radius
 */
export class RichInputfile extends LitElement {
  static properties = {
    /** Input name attribute */
    name: { type: String },
    /** Comma-separated list of allowed file extensions */
    allowedExtensions: {
      type: Array,
      attribute: 'allowed-extensions',
      converter: {
        fromAttribute: (value) =>
          value ? value.split(',').map((ext) => ext.trim().toLowerCase().replace(/^\./, '')) : [],
        toAttribute: (value) => (Array.isArray(value) ? value.join(',') : ''),
      },
    },
    /** Comma-separated list of allowed MIME types */
    accept: { type: String },
    /** Maximum file size in bytes */
    maxSize: { type: Number, attribute: 'max-size' },
    /** Show image thumbnail preview */
    showPreview: { type: Boolean, attribute: 'show-preview' },
    /** Preview size in pixels */
    previewSize: { type: Number, attribute: 'preview-size' },
    /** Enable drag and drop */
    dropzone: { type: Boolean },
    /** Disable the input */
    disabled: { type: Boolean },
    /** Label text */
    label: { type: String },
    /** Placeholder text */
    placeholder: { type: String },
    /** Current file name */
    _fileName: { state: true },
    /** Current file URL for preview */
    _fileUrl: { state: true },
    /** Error message */
    _error: { state: true },
    /** Drag over state */
    _dragOver: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .dropzone {
      position: relative;
      border: 2px dashed var(--input-border, #d1d5db);
      border-radius: var(--input-radius, 8px);
      background: var(--input-bg, #fff);
      padding: 1.5rem;
      text-align: center;
      transition:
        border-color 0.2s,
        background-color 0.2s;
      cursor: pointer;
    }

    .dropzone:hover:not(.disabled) {
      border-color: var(--input-border-focus, #3b82f6);
      background: #f8fafc;
    }

    .dropzone.drag-over {
      border-color: var(--input-border-focus, #3b82f6);
      background: #eff6ff;
    }

    .dropzone.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f5f5f5;
    }

    .dropzone.has-file {
      border-style: solid;
      border-color: #22c55e;
      background: #f0fdf4;
    }

    input[type='file'] {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    input[type='file']:disabled {
      cursor: not-allowed;
    }

    .upload-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #94a3b8;
    }

    .upload-text {
      color: #64748b;
      font-size: 0.9rem;
    }

    .upload-text strong {
      color: var(--input-border-focus, #3b82f6);
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #fff;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .file-preview {
      flex-shrink: 0;
      border-radius: 4px;
      object-fit: cover;
      background: #f1f5f9;
    }

    .file-details {
      flex: 1;
      min-width: 0;
    }

    .file-name {
      font-weight: 500;
      color: #1f2937;
      word-break: break-all;
      font-size: 0.875rem;
    }

    .file-size {
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: 0.125rem;
    }

    .clear-btn {
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clear-btn:hover {
      background: #dc2626;
    }

    .error {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }

    .hint {
      color: #6b7280;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .dropzone,
      .clear-btn {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.name = '';
    this.allowedExtensions = [];
    this.accept = '';
    this.maxSize = 0;
    this.showPreview = true;
    this.previewSize = 60;
    this.dropzone = true;
    this.disabled = false;
    this.label = '';
    this.placeholder = 'Drop a file here or click to browse';
    this._fileName = '';
    this._fileUrl = '';
    this._error = '';
    this._dragOver = false;
    this._file = null;
  }

  _handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      this._processFile(file);
    }
  }

  _handleDragOver(e) {
    e.preventDefault();
    if (!this.disabled) {
      this._dragOver = true;
    }
  }

  _handleDragLeave(e) {
    e.preventDefault();
    this._dragOver = false;
  }

  _handleDrop(e) {
    e.preventDefault();
    this._dragOver = false;
    if (this.disabled) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      this._processFile(file);
    }
  }

  _processFile(file) {
    this._error = '';

    // Validate extension
    if (this.allowedExtensions.length > 0) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedExtensions.includes(ext)) {
        this._error = `File type not allowed. Allowed: ${this.allowedExtensions.join(', ')}`;
        this._dispatchError(this._error, file);
        return;
      }
    }

    // Validate size
    if (this.maxSize > 0 && file.size > this.maxSize) {
      this._error = `File too large. Maximum: ${this._formatSize(this.maxSize)}`;
      this._dispatchError(this._error, file);
      return;
    }

    this._file = file;
    this._fileName = file.name;

    // Create preview URL for images
    if (this.showPreview && file.type.startsWith('image/')) {
      this._fileUrl = URL.createObjectURL(file);
    } else {
      this._fileUrl = '';
    }

    this.dispatchEvent(
      new CustomEvent('file-change', {
        detail: { file, name: file.name, size: file.size, type: file.type },
        bubbles: true,
        composed: true,
      })
    );
  }

  _dispatchError(message, file) {
    this.dispatchEvent(
      new CustomEvent('file-error', {
        detail: { message, file },
        bubbles: true,
        composed: true,
      })
    );
  }

  _clearFile() {
    if (this._fileUrl) {
      URL.revokeObjectURL(this._fileUrl);
    }
    this._file = null;
    this._fileName = '';
    this._fileUrl = '';
    this._error = '';

    // Reset input
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.value = '';

    this.dispatchEvent(
      new CustomEvent('file-clear', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Get the selected file */
  getFile() {
    return this._file;
  }

  /** Get file as ArrayBuffer */
  async getFileArrayBuffer() {
    if (!this._file) return null;
    return this._file.arrayBuffer();
  }

  /** Get file as Uint8Array */
  async getFileUint8Array() {
    const buffer = await this.getFileArrayBuffer();
    return buffer ? new Uint8Array(buffer) : null;
  }

  /** Get file as Data URL */
  async getFileDataURL() {
    if (!this._file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(this._file);
    });
  }

  /** Set file programmatically */
  setFile(file) {
    if (file instanceof File) {
      this._processFile(file);
    }
  }

  /** Clear the current file */
  clear() {
    this._clearFile();
  }

  _renderHint() {
    const hints = [];
    if (this.allowedExtensions.length > 0) {
      hints.push(`.${this.allowedExtensions.join(', .')}`);
    }
    if (this.maxSize > 0) {
      hints.push(`Max: ${this._formatSize(this.maxSize)}`);
    }
    if (hints.length === 0) return '';
    return html`<div class="hint">${hints.join(' | ')}</div>`;
  }

  render() {
    const acceptValue =
      this.accept ||
      (this.allowedExtensions.length > 0
        ? this.allowedExtensions.map((ext) => `.${ext}`).join(',')
        : '');

    const dropzoneClasses = [
      'dropzone',
      this._dragOver ? 'drag-over' : '',
      this.disabled ? 'disabled' : '',
      this._fileName ? 'has-file' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="container">
        ${this.label ? html`<label>${this.label}</label>` : ''}

        <div
          class="${dropzoneClasses}"
          @dragover="${this.dropzone ? this._handleDragOver : null}"
          @dragleave="${this.dropzone ? this._handleDragLeave : null}"
          @drop="${this.dropzone ? this._handleDrop : null}"
        >
          <input
            type="file"
            name="${this.name}"
            accept="${acceptValue}"
            ?disabled="${this.disabled}"
            @change="${this._handleFileChange}"
          />

          ${this._fileName
            ? html`
                <div class="file-info" @click="${(e) => e.preventDefault()}">
                  ${this._fileUrl
                    ? html`
                        <img
                          class="file-preview"
                          src="${this._fileUrl}"
                          alt="Preview"
                          width="${this.previewSize}"
                          height="${this.previewSize}"
                        />
                      `
                    : ''}
                  <div class="file-details">
                    <div class="file-name">${this._fileName}</div>
                    ${this._file
                      ? html`<div class="file-size">${this._formatSize(this._file.size)}</div>`
                      : ''}
                  </div>
                  <button
                    class="clear-btn"
                    type="button"
                    @click="${(e) => {
                      e.stopPropagation();
                      this._clearFile();
                    }}"
                  >
                    Clear
                  </button>
                </div>
              `
            : html`
                <div class="upload-icon">📁</div>
                <div class="upload-text">
                  ${this.dropzone
                    ? html`<strong>Drop</strong> a file here or <strong>click</strong> to browse`
                    : html`<strong>Click</strong> to browse`}
                </div>
              `}
        </div>

        ${this._error ? html`<div class="error">${this._error}</div>` : ''}
        ${!this._fileName ? this._renderHint() : ''}
      </div>
    `;
  }
}

customElements.define('rich-inputfile', RichInputfile);
