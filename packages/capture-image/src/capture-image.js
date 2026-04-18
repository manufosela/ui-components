import { LitElement, html, css } from 'lit';

/**
 * Webcam capture component that lets users snap, reset and save photos.
 * Uses getUserMedia to display a live video feed and draws snapshots
 * onto a canvas. Supports an optional rectangular mask, zoom, and pan.
 *
 * @element capture-image
 *
 * @attr {Number} size-x - Video/canvas width in pixels (default: 640)
 * @attr {Number} size-y - Video/canvas height in pixels (default: 480)
 * @attr {Number} maskpercent - Mask border percentage 0-100 (default: 30)
 * @attr {Boolean} mask - Show the rectangular mask overlay (default: false)
 * @attr {Number} max-zoom - Maximum zoom level (default: 5)
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
    maxZoom: { type: Number, attribute: 'max-zoom' },
    _zoom: { state: true },
    _panX: { state: true },
    _panY: { state: true },
    _saveReady: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .container {
      position: relative;
      display: inline-block;
      overflow: hidden;
      cursor: grab;
    }
    .container.dragging {
      cursor: grabbing;
    }
    .container.no-pan {
      cursor: default;
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
      transform-origin: 0 0;
    }
    canvas.snapshot {
      pointer-events: none;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .controls button,
    .controls a {
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
    .controls button:hover,
    .controls a:hover {
      background: #2a2a2a;
    }
    .controls a[hidden] {
      display: none;
    }
    .zoom-controls {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      border: 1px solid rgba(58, 74, 68, 0.35);
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #1c1b1b;
    }
    .zoom-controls button {
      border: none;
      background: none;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
      min-width: 2rem;
    }
    .zoom-controls button:hover {
      background: #2a2a2a;
    }
    .zoom-label {
      font-size: 0.75rem;
      color: #b9cbc2;
      min-width: 3rem;
      text-align: center;
      user-select: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .controls button,
      .controls a {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.sizeX = 640;
    this.sizeY = 480;
    this.mask = false;
    this.maskpercent = 30;
    this.maxZoom = 5;
    this._masksizeX = 0;
    this._masksizeY = 0;
    this._saveReady = false;
    this._zoom = 1;
    this._panX = 0;
    this._panY = 0;
    this._isDragging = false;
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._panStartX = 0;
    this._panStartY = 0;
    this._boundPointerMove = this._onPointerMove.bind(this);
    this._boundPointerUp = this._onPointerUp.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopStream();
    document.removeEventListener('pointermove', this._boundPointerMove);
    document.removeEventListener('pointerup', this._boundPointerUp);
  }

  firstUpdated() {
    this._canvas = this.renderRoot.querySelector('canvas.snapshot');
    this._maskCanvas = this.renderRoot.querySelector('canvas.mask');
    this._video = this.renderRoot.querySelector('video');
    this._containerEl = this.renderRoot.querySelector('.container');
    this._ctx = this._canvas.getContext('2d');

    if (this.mask) {
      this._drawMask();
    }
    this._startCamera();
  }

  updated(changed) {
    if (changed.has('_zoom') || changed.has('_panX') || changed.has('_panY')) {
      this._applyTransform();
    }
  }

  // ─── Camera ──────────────────────────────────────────────────────────────

  async _startCamera() {
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
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: this.sizeX }, height: { ideal: this.sizeY } },
        audio: false,
      });
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

  // ─── Mask ────────────────────────────────────────────────────────────────

  _drawMask() {
    if (!this._maskCanvas) return;
    const ctx = this._maskCanvas.getContext('2d');
    this._masksizeX = (this.sizeX * this.maskpercent) / 100;
    this._masksizeY = (this.sizeY * this.maskpercent) / 100;
    const hx = this._masksizeX / 2;
    const hy = this._masksizeY / 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, this.sizeX, this.sizeY);
    ctx.clearRect(hx, hy, this.sizeX - this._masksizeX, this.sizeY - this._masksizeY);
  }

  // ─── Zoom & Pan ──────────────────────────────────────────────────────────

  _applyTransform() {
    if (!this._video) return;
    const { _zoom: z, _panX: px, _panY: py } = this;
    // Translate so that the pan offset + zoom center the view
    const tx = (-(z - 1) * this.sizeX) / 2 + px;
    const ty = (-(z - 1) * this.sizeY) / 2 + py;
    this._video.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`;
  }

  _clampPan() {
    // Limit pan so you can't drag outside the video bounds
    const maxPanX = ((this._zoom - 1) * this.sizeX) / 2;
    const maxPanY = ((this._zoom - 1) * this.sizeY) / 2;
    this._panX = Math.max(-maxPanX, Math.min(maxPanX, this._panX));
    this._panY = Math.max(-maxPanY, Math.min(maxPanY, this._panY));
  }

  zoomIn() {
    this._zoom = Math.min(this._zoom + 0.5, this.maxZoom);
    this._clampPan();
  }

  zoomOut() {
    this._zoom = Math.max(this._zoom - 0.5, 1);
    this._clampPan();
    if (this._zoom === 1) {
      this._panX = 0;
      this._panY = 0;
    }
  }

  resetZoom() {
    this._zoom = 1;
    this._panX = 0;
    this._panY = 0;
  }

  _onWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  _onPointerDown(e) {
    if (this._zoom <= 1) return;
    e.preventDefault();
    this._isDragging = true;
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
    this._panStartX = this._panX;
    this._panStartY = this._panY;
    this._containerEl?.classList.add('dragging');
    document.addEventListener('pointermove', this._boundPointerMove);
    document.addEventListener('pointerup', this._boundPointerUp);
  }

  _onPointerMove(e) {
    if (!this._isDragging) return;
    const dx = e.clientX - this._dragStartX;
    const dy = e.clientY - this._dragStartY;
    this._panX = this._panStartX + dx;
    this._panY = this._panStartY + dy;
    this._clampPan();
  }

  _onPointerUp() {
    this._isDragging = false;
    this._containerEl?.classList.remove('dragging');
    document.removeEventListener('pointermove', this._boundPointerMove);
    document.removeEventListener('pointerup', this._boundPointerUp);
  }

  // ─── Snap / Reset / Save ─────────────────────────────────────────────────

  snapImage() {
    if (!this._video || !this._ctx) return;

    // The video's native resolution may differ from the display size
    const vw = this._video.videoWidth || this.sizeX;
    const vh = this._video.videoHeight || this.sizeY;
    const scaleX = vw / this.sizeX;
    const scaleY = vh / this.sizeY;

    // What portion of the native video is currently visible (zoom + pan)?
    const visibleW = vw / this._zoom;
    const visibleH = vh / this._zoom;
    const centerX = vw / 2 - (this._panX / this._zoom) * scaleX;
    const centerY = vh / 2 - (this._panY / this._zoom) * scaleY;
    const visibleX = centerX - visibleW / 2;
    const visibleY = centerY - visibleH / 2;

    if (this.mask) {
      // Map mask area (in display coords) to the visible source region
      const maskOffX = (this.sizeX * this.maskpercent) / 200;
      const maskOffY = (this.sizeY * this.maskpercent) / 200;
      const maskW = this.sizeX - maskOffX * 2;
      const maskH = this.sizeY - maskOffY * 2;

      const srcX = visibleX + (maskOffX / this.sizeX) * visibleW;
      const srcY = visibleY + (maskOffY / this.sizeY) * visibleH;
      const srcW = (maskW / this.sizeX) * visibleW;
      const srcH = (maskH / this.sizeY) * visibleH;

      this._ctx.drawImage(this._video, srcX, srcY, srcW, srcH, maskOffX, maskOffY, maskW, maskH);
    } else {
      this._ctx.drawImage(
        this._video,
        visibleX,
        visibleY,
        visibleW,
        visibleH,
        0,
        0,
        this.sizeX,
        this.sizeY
      );
    }

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

  // ─── Render ──────────────────────────────────────────────────────────────

  render() {
    const containerClass = this._zoom > 1 ? 'container' : 'container no-pan';

    return html`
      <div
        class="${containerClass}"
        style="width:${this.sizeX}px; height:${this.sizeY}px;"
        @pointerdown="${this._onPointerDown}"
        @wheel="${this._onWheel}"
      >
        <video width="${this.sizeX}" height="${this.sizeY}" autoplay playsinline muted></video>
        <canvas class="mask" width="${this.sizeX}" height="${this.sizeY}"></canvas>
        <canvas class="snapshot" width="${this.sizeX}" height="${this.sizeY}"></canvas>
      </div>
      <div class="controls">
        <button type="button" @click="${this.snapImage}">Snap</button>
        <button type="button" @click="${this.resetImage}">Reset</button>
        <a
          href="#"
          class="save-btn"
          @click="${this.saveImage}"
          ?hidden="${!this._saveReady}"
          download
          >Save</a
        >
        <div class="zoom-controls">
          <button type="button" @click="${this.zoomOut}" aria-label="Zoom out">−</button>
          <span class="zoom-label">${this._zoom.toFixed(1)}x</span>
          <button type="button" @click="${this.zoomIn}" aria-label="Zoom in">+</button>
        </div>
        ${this._zoom > 1 ? html`<button type="button" @click="${this.resetZoom}">1:1</button>` : ''}
      </div>
    `;
  }
}

customElements.define('capture-image', CaptureImage);
