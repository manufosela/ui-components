import { LitElement, html, css } from 'lit';

/**
 * Webcam capture component that lets users snap, reset and save photos.
 * Uses getUserMedia to display a live video feed and draws snapshots
 * onto a canvas. Supports an optional rectangular mask.
 *
 * @element capture-image
 *
 * @attr {Number} size-x - Video/canvas width in pixels (default: 640)
 * @attr {Number} size-y - Video/canvas height in pixels (default: 480)
 * @attr {Number} maskpercent - Mask border percentage 0-100 (default: 30)
 * @attr {Boolean} mask - Show the rectangular mask overlay (default: false)
 *
 * @fires capture-image-snap - Fired when a photo is snapped. detail: { dataURL }
 * @fires capture-image-save - Fired when a photo is saved. detail: { filename }
 * @fires capture-image-error - Fired on getUserMedia errors. detail: { error }
 */
export class CaptureImage extends LitElement {
  static properties = {
    sizeX: { type: Number, attribute: 'size-x' },
    sizeY: { type: Number, attribute: 'size-y' },
    maskpercent: { type: Number },
    mask: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .container {
      position: relative;
      display: inline-block;
    }
    video,
    canvas.mask,
    canvas.snapshot {
      position: absolute;
      top: 0;
      left: 0;
    }
    video {
      position: relative;
      display: block;
    }
    .botonera {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }
    .botonera button,
    .botonera a {
      appearance: button;
      text-decoration: none;
      color: #f4f5f2;
      background: #1c1b1b;
      border: 1px solid rgba(58, 74, 68, 0.35);
      border-radius: 0.5rem;
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
      font-family: inherit;
      cursor: pointer;
      transition: background 200ms ease-out;
    }
    .botonera button:hover,
    .botonera a:hover {
      background: #2a2a2a;
    }
    .botonera a[hidden] {
      display: none;
    }
  `;

  constructor() {
    super();
    this.sizeX = 640;
    this.sizeY = 480;
    this.mask = false;
    this.maskpercent = 30;
    this._masksizeX = 0;
    this._masksizeY = 0;
    this._saveReady = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopStream();
  }

  firstUpdated() {
    this._canvas = this.renderRoot.querySelector('canvas.snapshot');
    this._maskCanvas = this.renderRoot.querySelector('canvas.mask');
    this._video = this.renderRoot.querySelector('video');
    this._saveBtn = this.renderRoot.querySelector('.save-btn');
    this._ctx = this._canvas.getContext('2d');

    if (this.mask) {
      this._drawMask();
    }

    this._canvas.width = this.sizeX - this._masksizeX * 2;
    this._canvas.height = this.sizeY - this._masksizeY * 2;

    this._startStream();
  }

  _drawMask() {
    const maskCtx = this._maskCanvas.getContext('2d');
    this._masksizeX = (this.sizeX * this.maskpercent) / 200;
    this._masksizeY = (this.sizeY * this.maskpercent) / 200;
    maskCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    maskCtx.fillRect(0, 0, this.sizeX, this._masksizeY);
    maskCtx.fillRect(0, this.sizeY - this._masksizeY, this.sizeX, this._masksizeY);
    maskCtx.fillRect(0, this._masksizeY, this._masksizeX, this.sizeY - this._masksizeY * 2);
    maskCtx.fillRect(
      this.sizeX - this._masksizeX,
      this._masksizeY,
      this._masksizeX,
      this.sizeY - this._masksizeY * 2
    );
  }

  async _startStream() {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.dispatchEvent(
        new CustomEvent('capture-image-error', {
          detail: { error: new Error('getUserMedia not supported') },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this._video.srcObject = this._stream;
      await this._video.play();
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('capture-image-error', {
          detail: { error },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  _stopStream() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }
  }

  snapImage() {
    if (!this._video || !this._ctx) return;
    const offsetX = (this.sizeX * this.maskpercent) / 200;
    const offsetY = (this.sizeY * this.maskpercent) / 200;
    const width = this.sizeX - offsetX * 2;
    const height = this.sizeY - offsetY * 2;
    this._ctx.drawImage(
      this._video,
      offsetX,
      offsetY,
      width,
      height,
      offsetX,
      offsetY,
      width,
      height
    );
    this._saveReady = true;
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent('capture-image-snap', {
        detail: { dataURL: this._canvas.toDataURL('image/png') },
        bubbles: true,
        composed: true,
      })
    );
  }

  resetImage() {
    if (!this._ctx) return;
    this._ctx.clearRect(0, 0, this.sizeX, this.sizeY);
    this._saveReady = false;
    this.requestUpdate();
  }

  saveImage(event) {
    if (!this._canvas) return;
    const dataURL = this._canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `snapshot-${timestamp}.png`;
    event.currentTarget.download = filename;
    event.currentTarget.href = dataURL;

    this.dispatchEvent(
      new CustomEvent('capture-image-save', {
        detail: { filename },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="container" style="width:${this.sizeX}px; height:${this.sizeY}px;">
        <video width="${this.sizeX}" height="${this.sizeY}" autoplay playsinline muted></video>
        <canvas class="mask" width="${this.sizeX}" height="${this.sizeY}"></canvas>
        <canvas class="snapshot" width="${this.sizeX}" height="${this.sizeY}"></canvas>
      </div>
      <div class="botonera">
        <button type="button" @click=${this.snapImage}>Snap</button>
        <button type="button" @click=${this.resetImage}>Reset</button>
        <a href="#" class="save-btn" @click=${this.saveImage} ?hidden=${!this._saveReady} download
          >Save</a
        >
      </div>
    `;
  }
}

customElements.define('capture-image', CaptureImage);
