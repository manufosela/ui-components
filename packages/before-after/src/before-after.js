import { LitElement, html, css } from 'lit';

/**
 * Before/after image comparison slider.
 *
 * Drag the divider to reveal more of either image. Supports mouse, touch,
 * and keyboard interaction with full ARIA slider semantics.
 *
 * @element before-after
 *
 * @attr {Number} position - Divider position in percent 0-100 (default: 50)
 * @attr {String} before-label - Label for the before image (default: "Before")
 * @attr {String} after-label - Label for the after image (default: "After")
 * @attr {Boolean} hide-labels - Hide labels
 * @attr {Boolean} hover-mode - Move divider on hover without clicking
 * @attr {Boolean} no-animation - Disable transitions
 * @attr {Boolean} disabled - Disable all interaction
 *
 * @cssprop [--before-after-divider-color=#ffffff] - Divider line color
 * @cssprop [--before-after-divider-width=3px] - Divider line width
 * @cssprop [--before-after-handle-size=40px] - Handle diameter
 * @cssprop [--before-after-handle-color=#ffffff] - Handle color
 * @cssprop [--before-after-label-bg=rgba(0,0,0,0.5)] - Label background
 * @cssprop [--before-after-label-color=#ffffff] - Label text color
 * @cssprop [--before-after-focus-color=#3b82f6] - Focus ring color
 *
 * @fires before-after-change - Fired when position changes (on release / key)
 * @fires before-after-input - Fired continuously during drag
 *
 * @slot before - Image to show on the left (before)
 * @slot after - Image to show on the right (after)
 */
export class BeforeAfter extends LitElement {
  static properties = {
    position: { type: Number },
    beforeLabel: { type: String, attribute: 'before-label' },
    afterLabel: { type: String, attribute: 'after-label' },
    hideLabels: { type: Boolean, attribute: 'hide-labels' },
    hoverMode: { type: Boolean, attribute: 'hover-mode' },
    noAnimation: { type: Boolean, attribute: 'no-animation' },
    disabled: { type: Boolean },
    _dragging: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      overflow: hidden;
      line-height: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    .container {
      position: relative;
      touch-action: none;
      overflow: hidden;
    }

    .container:focus-visible {
      outline: 3px solid var(--before-after-focus-color, #3b82f6);
      outline-offset: 2px;
    }

    :host([disabled]) .container {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .before-layer {
      display: block;
      width: 100%;
    }

    .before-layer ::slotted(*) {
      display: block;
      width: 100%;
      height: auto;
    }

    .after-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .after-layer ::slotted(*) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .divider {
      position: absolute;
      top: 0;
      bottom: 0;
      width: var(--before-after-divider-width, 3px);
      background: var(--before-after-divider-color, #ffffff);
      transform: translateX(-50%);
      cursor: ew-resize;
      z-index: 2;
      pointer-events: none;
    }

    .handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: var(--before-after-handle-size, 40px);
      height: var(--before-after-handle-size, 40px);
      border-radius: 50%;
      background: var(--before-after-handle-color, #ffffff);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 3;
    }

    .handle svg {
      width: 60%;
      height: 60%;
      fill: none;
      stroke: #333;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .label {
      position: absolute;
      top: 12px;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      line-height: 1;
      background: var(--before-after-label-bg, rgba(0, 0, 0, 0.5));
      color: var(--before-after-label-color, #ffffff);
      pointer-events: none;
      z-index: 4;
    }

    .label-before {
      left: 12px;
    }

    .label-after {
      right: 12px;
    }

    .transition .after-layer,
    .transition .divider {
      transition:
        left 0.15s ease,
        clip-path 0.15s ease;
    }

    :host-context(.dark) {
      --before-after-divider-color: #e5e7eb;
      --before-after-handle-color: #e5e7eb;
    }
  `;

  constructor() {
    super();
    this.position = 50;
    this.beforeLabel = 'Before';
    this.afterLabel = 'After';
    this.hideLabels = false;
    this.hoverMode = false;
    this.noAnimation = false;
    this.disabled = false;
    this._dragging = false;

    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
  }

  /** Clamp a value between 0 and 100 */
  _clamp(val) {
    return Math.min(100, Math.max(0, val));
  }

  /** Convert a clientX to a percentage position */
  _clientXToPosition(clientX) {
    const rect = this._container.getBoundingClientRect();
    const x = clientX - rect.left;
    return this._clamp((x / rect.width) * 100);
  }

  /** Update position and dispatch input event */
  _setPosition(pos) {
    const clamped = this._clamp(pos);
    if (clamped !== this.position) {
      this.position = clamped;
      this.dispatchEvent(
        new CustomEvent('before-after-input', {
          detail: { position: this.position },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /** Dispatch change event */
  _fireChange() {
    this.dispatchEvent(
      new CustomEvent('before-after-change', {
        detail: { position: this.position },
        bubbles: true,
        composed: true,
      })
    );
  }

  get _container() {
    return this.renderRoot?.querySelector('.container');
  }

  _onPointerDown(e) {
    if (this.disabled) return;
    this._dragging = true;
    this._setPosition(this._clientXToPosition(e.clientX));
    this._container.setPointerCapture(e.pointerId);
  }

  _onPointerMove(e) {
    if (this.disabled) return;
    if (this.hoverMode) {
      this._setPosition(this._clientXToPosition(e.clientX));
      return;
    }
    if (!this._dragging) return;
    this._setPosition(this._clientXToPosition(e.clientX));
  }

  _onPointerUp() {
    if (!this._dragging) return;
    this._dragging = false;
    this._fireChange();
  }

  _onKeyDown(e) {
    if (this.disabled) return;

    let newPos = this.position;
    switch (e.key) {
      case 'ArrowLeft':
        newPos -= 1;
        break;
      case 'ArrowRight':
        newPos += 1;
        break;
      case 'PageDown':
        newPos -= 10;
        break;
      case 'PageUp':
        newPos += 10;
        break;
      case 'Home':
        newPos = 0;
        break;
      case 'End':
        newPos = 100;
        break;
      default:
        return;
    }

    e.preventDefault();
    this.position = this._clamp(newPos);
    this._fireChange();
  }

  render() {
    const pos = this._clamp(this.position);
    const showTransition = !this.noAnimation && !this._dragging;

    return html`
      <div
        class="container ${showTransition ? 'transition' : ''}"
        role="slider"
        tabindex="${this.disabled ? -1 : 0}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${pos}"
        aria-label="Image comparison slider"
        @pointerdown="${this._onPointerDown}"
        @pointermove="${this._onPointerMove}"
        @pointerup="${this._onPointerUp}"
        @lostpointercapture="${this._onPointerUp}"
        @keydown="${this._onKeyDown}"
      >
        <div class="before-layer">
          <slot name="before"></slot>
        </div>

        <div class="after-layer" style="clip-path: inset(0 0 0 ${pos}%)">
          <slot name="after"></slot>
        </div>

        <div class="divider" style="left: ${pos}%">
          <div class="handle">
            <svg viewBox="0 0 24 24">
              <polyline points="8,4 4,12 8,20"></polyline>
              <polyline points="16,4 20,12 16,20"></polyline>
            </svg>
          </div>
        </div>

        ${this.hideLabels
          ? ''
          : html`
              <span class="label label-before">${this.beforeLabel}</span>
              <span class="label label-after">${this.afterLabel}</span>
            `}
      </div>
    `;
  }
}

customElements.define('before-after', BeforeAfter);
