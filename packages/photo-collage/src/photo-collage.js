import { LitElement, html } from 'lit';
import { photoCollageStyles } from './photo-collage.styles.js';

/**
 * A photo collage component that displays images in a grid with random rotations.
 *
 * @element photo-collage
 *
 * @attr {Number} width - Collage width in pixels (default: 1200)
 * @attr {Number} height - Collage height in pixels (default: 700)
 * @attr {Number} cols - Number of columns (default: 4)
 * @attr {Number} rows - Number of rows (default: 3)
 * @attr {Number} max-rotation - Max random rotation in degrees (default: 15)
 * @attr {Boolean} randomize - Cycle through extra images with fade effect (default: false)
 * @attr {Number} interval - Seconds between image swaps when randomize is on (default: 5)
 * @attr {Boolean} polaroid - Show polaroid-style frame with shadow (default: true)
 * @attr {Boolean} shuffle - Randomize initial image order (default: false)
 * @attr {Boolean} zoomable - Enable click-to-zoom on photos (default: false)
 *
 * @slot - img elements to display in the collage
 */
export class PhotoCollage extends LitElement {
  static styles = photoCollageStyles;

  static properties = {
    width: { type: Number },
    height: { type: Number },
    cols: { type: Number },
    rows: { type: Number },
    maxRotation: { type: Number, attribute: 'max-rotation' },
    randomize: { type: Boolean },
    interval: { type: Number },
    polaroid: { type: Boolean },
    shuffle: { type: Boolean },
    zoomable: { type: Boolean },
    _zoomedIndex: { type: Number, state: true },
  };

  constructor() {
    super();
    this.width = 1200;
    this.height = 700;
    this.cols = 4;
    this.rows = 3;
    this.maxRotation = 15;
    this.randomize = false;
    this.interval = 5;
    this.polaroid = true;
    this.shuffle = false;
    this.zoomable = false;
    this._zoomedIndex = -1;

    this._images = [];
    this._visibleImages = [];
    this._rotations = [];
    this._intervalId = null;
    this._slotObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this._zoomedIndex >= 0) {
        this._closeZoom();
      }
    };
    document.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopRotation();
    document.removeEventListener('keydown', this._onKeyDown);
    if (this._slotObserver) {
      this._slotObserver.disconnect();
    }
  }

  firstUpdated() {
    this._collectImages();
    this._observeSlot();
  }

  updated(changedProps) {
    if (
      changedProps.has('cols') ||
      changedProps.has('rows') ||
      changedProps.has('maxRotation') ||
      changedProps.has('shuffle')
    ) {
      this._setupCollage();
    }
    if (changedProps.has('interval') || changedProps.has('randomize')) {
      this._stopRotation();
      if (this.randomize && this._images.length > this._totalCells) {
        this._startRotation();
      }
    }
  }

  get _totalCells() {
    return this.cols * this.rows;
  }

  _collectImages() {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    const assigned = slot.assignedElements({ flatten: true });
    this._images = assigned.filter((el) => el.tagName === 'IMG').map((img) => img.src);

    if (this._images.length === 0) {
      assigned.forEach((el) => {
        const imgs = el.querySelectorAll('img');
        imgs.forEach((img) => this._images.push(img.src));
      });
    }

    this._setupCollage();
  }

  _observeSlot() {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    slot.addEventListener('slotchange', () => this._collectImages());

    this._slotObserver = new MutationObserver(() => this._collectImages());
    this._slotObserver.observe(this, { childList: true, subtree: true });
  }

  _setupCollage() {
    const total = this._totalCells;
    const pool = [...this._images];

    if (this.shuffle) {
      this._shuffleArray(pool);
    }

    this._visibleImages = pool.slice(0, total);
    this._rotations = Array.from({ length: total }, () => this._randomRotation());

    this._stopRotation();
    if (this.randomize && this._images.length > total) {
      this._startRotation();
    }

    this.requestUpdate();
  }

  _randomRotation() {
    return (Math.random() * 2 - 1) * this.maxRotation;
  }

  _shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  _startRotation() {
    if (this._intervalId) return;

    this._intervalId = setInterval(() => {
      this._swapRandomImage();
    }, this.interval * 1000);
  }

  _stopRotation() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  _swapRandomImage() {
    const total = this._totalCells;
    const hiddenImages = this._images.filter((src) => !this._visibleImages.includes(src));

    if (hiddenImages.length === 0) return;

    const cellIndex = Math.floor(Math.random() * total);
    const newImage = hiddenImages[Math.floor(Math.random() * hiddenImages.length)];

    const wrapper = this.shadowRoot.querySelector(`[data-index="${cellIndex}"] .photo-wrapper`);
    if (!wrapper) return;

    wrapper.classList.add('fading-out');

    setTimeout(() => {
      this._visibleImages = [...this._visibleImages];
      this._visibleImages[cellIndex] = newImage;
      this._rotations = [...this._rotations];
      this._rotations[cellIndex] = this._randomRotation();
      this.requestUpdate();

      requestAnimationFrame(() => {
        const newWrapper = this.shadowRoot.querySelector(
          `[data-index="${cellIndex}"] .photo-wrapper`
        );
        if (newWrapper) {
          newWrapper.classList.remove('fading-out');
          newWrapper.classList.add('fading-in');
        }
      });
    }, 600);
  }

  _onPhotoClick(index) {
    if (!this.zoomable) return;
    this._zoomedIndex = index;
  }

  _closeZoom() {
    this._zoomedIndex = -1;
  }

  render() {
    const cellWidth = this.width / this.cols;
    const cellHeight = this.height / this.rows;

    return html`
      <div class="collage" style="width:${this.width}px; height:${this.height}px;">
        ${this._visibleImages.map((src, i) => {
          const rotation = this._rotations[i] || 0;
          return html`
            <div
              class="cell"
              data-index="${i}"
              style="width:${cellWidth}px; height:${cellHeight}px;"
            >
              <div
                class="photo-wrapper ${this.polaroid ? 'polaroid' : ''}"
                style="transform: rotate(${rotation}deg);"
                @click=${() => this._onPhotoClick(i)}
              >
                <img src="${src}" alt="Collage photo ${i + 1}" loading="lazy" />
              </div>
            </div>
          `;
        })}
      </div>
      <div
        class="overlay ${this._zoomedIndex >= 0 ? 'active' : ''} ${this.polaroid ? 'polaroid' : ''}"
        @click=${this._closeZoom}
      >
        ${this._zoomedIndex >= 0
          ? html` <img src="${this._visibleImages[this._zoomedIndex]}" alt="Zoomed photo" /> `
          : ''}
      </div>
      <slot style="display:none;"></slot>
    `;
  }
}

customElements.define('photo-collage', PhotoCollage);
