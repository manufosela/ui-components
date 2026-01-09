import { LitElement, html, svg } from 'lit';
import { arcSliderStyles } from './arc-slider.styles.js';

/**
 * An arc slider component with gradient colors.
 *
 * @element arc-slider
 * @fires change - Fired when the slider value changes. Detail: { id, value }
 *
 * @attr {Number} min-range - Minimum value of the slider (default: 0)
 * @attr {Number} max-range - Maximum value of the slider (default: 100)
 * @attr {Number} arc-value - Current value of the slider
 * @attr {Number} step - Step increment value (default: 1)
 * @attr {Boolean} disabled - Whether the slider is disabled
 * @attr {String} color1 - Start color of the gradient (hex format, default: #FF1122)
 * @attr {String} color2 - End color of the gradient (hex format, default: #1122FF)
 * @attr {Number} radius - Radius of the arc in pixels (default: 100)
 * @attr {Number} start-angle - Start angle in degrees (default: 180, left side)
 * @attr {Number} end-angle - End angle in degrees (default: 0, right side)
 * @attr {Number} stroke-width - Width of the arc stroke (default: 8)
 * @attr {String} value-position - Position of value display: top, bottom, center (default: bottom)
 * @attr {Boolean} show-value-on-thumb - Show value as badge on the thumb
 * @attr {Boolean} show-limits - Show min/max values at arc ends
 * @attr {Number} show-ticks - Number of tick marks to show on the arc (0 = none)
 * @attr {Boolean} hide-value - Hide the value display entirely
 *
 * @cssprop [--arc-slider-text-color=#000] - Text color
 * @cssprop [--arc-slider-thumb-size=20px] - Size of the thumb
 */
export class ArcSlider extends LitElement {
  static styles = arcSliderStyles;

  static properties = {
    minRange: { type: Number, attribute: 'min-range' },
    maxRange: { type: Number, attribute: 'max-range' },
    arcValue: { type: Number, attribute: 'arc-value', reflect: true },
    step: { type: Number },
    disabled: { type: Boolean, reflect: true },
    color1: { type: String },
    color2: { type: String },
    radius: { type: Number },
    startAngle: { type: Number, attribute: 'start-angle' },
    endAngle: { type: Number, attribute: 'end-angle' },
    strokeWidth: { type: Number, attribute: 'stroke-width' },
    clockwise: { type: Boolean },
    reverse: { type: Boolean }, // Reverse value direction (right-to-left instead of left-to-right)
    valuePosition: { type: String, attribute: 'value-position' }, // top, bottom, center
    showValueOnThumb: { type: Boolean, attribute: 'show-value-on-thumb' },
    showLimits: { type: Boolean, attribute: 'show-limits' },
    showTicks: { type: Number, attribute: 'show-ticks' },
    hideValue: { type: Boolean, attribute: 'hide-value' },
  };

  constructor() {
    super();
    this.minRange = 0;
    this.maxRange = 100;
    this.step = 1;
    this.disabled = false;
    this.color1 = '#FF1122';
    this.color2 = '#1122FF';
    this.radius = 100;
    this.startAngle = 180; // Left side (in degrees)
    this.endAngle = 0; // Right side (in degrees)
    this.strokeWidth = 8;
    this.clockwise = false; // false = through top (upward), true = through bottom (downward)
    this.reverse = false; // false = left-to-right, true = right-to-left
    this.valuePosition = 'bottom'; // top, bottom, center
    this.showValueOnThumb = false;
    this.showLimits = false;
    this.showTicks = 0;
    this.hideValue = false;

    this._colorStops = [];
    this._isDragging = false;

    this._handlePointerDown = this._handlePointerDown.bind(this);
    this._handlePointerMove = this._handlePointerMove.bind(this);
    this._handlePointerUp = this._handlePointerUp.bind(this);
  }

  get _middleRange() {
    return (this.maxRange + this.minRange) / 2;
  }

  // Convert degrees to radians
  _degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  // Get point on arc given angle in degrees
  _getPointOnArc(angleDeg) {
    const angleRad = this._degToRad(angleDeg);
    const cx = this.radius + this.strokeWidth;
    const cy = this.radius + this.strokeWidth;
    return {
      x: cx + this.radius * Math.cos(angleRad),
      y: cy + this.radius * Math.sin(angleRad),
    };
  }

  // Determine if arc goes clockwise based on angles and clockwise property
  get _isClockwise() {
    // Default: arcs go upward (through top/270°)
    // clockwise=true flips to downward (through bottom/90°)
    const defaultClockwise = this.endAngle < this.startAngle;
    if (this.clockwise) {
      return !defaultClockwise; // Flip direction for downward arc
    }
    return defaultClockwise;
  }

  // Convert value to angle (follows the arc direction)
  _valueToAngle(value) {
    let progress = (value - this.minRange) / (this.maxRange - this.minRange);

    // Default: right-to-left (min on right, max on left)
    // reverse flips to left-to-right
    if (!this.reverse) {
      progress = 1 - progress;
    }

    let angle;

    if (this._isClockwise) {
      // Clockwise arc: increase angle
      let angleDiff = this.endAngle - this.startAngle;
      if (angleDiff <= 0) angleDiff += 360;
      angle = this.startAngle + progress * angleDiff;
      if (angle >= 360) angle -= 360;
    } else {
      // Counter-clockwise arc: decrease angle
      let angleDiff = this.startAngle - this.endAngle;
      if (angleDiff <= 0) angleDiff += 360;
      angle = this.startAngle - progress * angleDiff;
      if (angle < 0) angle += 360;
    }

    return angle;
  }

  // Convert angle to value (follows the arc direction)
  _angleToValue(angleDeg) {
    let progress;

    if (this._isClockwise) {
      // Clockwise arc
      let angleDiff = this.endAngle - this.startAngle;
      if (angleDiff <= 0) angleDiff += 360;
      let adjustedAngle = angleDeg - this.startAngle;
      if (adjustedAngle < 0) adjustedAngle += 360;
      progress = Math.max(0, Math.min(1, adjustedAngle / angleDiff));
    } else {
      // Counter-clockwise arc
      let angleDiff = this.startAngle - this.endAngle;
      if (angleDiff <= 0) angleDiff += 360;
      let adjustedAngle = this.startAngle - angleDeg;
      if (adjustedAngle < 0) adjustedAngle += 360;
      progress = Math.max(0, Math.min(1, adjustedAngle / angleDiff));
    }

    // Default: right-to-left (min on right, max on left)
    // reverse flips to left-to-right
    if (!this.reverse) {
      progress = 1 - progress;
    }

    return Math.round(this.minRange + progress * (this.maxRange - this.minRange));
  }

  // Get SVG arc path
  _getArcPath() {
    const start = this._getPointOnArc(this.startAngle);
    const end = this._getPointOnArc(this.endAngle);

    // Calculate angular distance based on direction
    let angleDiff;
    if (this._isClockwise) {
      angleDiff = this.endAngle - this.startAngle;
      if (angleDiff <= 0) angleDiff += 360;
    } else {
      angleDiff = this.startAngle - this.endAngle;
      if (angleDiff <= 0) angleDiff += 360;
    }

    const largeArcFlag = angleDiff > 180 ? 1 : 0;
    const sweepFlag = this._isClockwise ? 1 : 0;

    return `M ${start.x} ${start.y} A ${this.radius} ${this.radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
  }

  // Get SVG viewBox dimensions
  get _viewBoxSize() {
    return (this.radius + this.strokeWidth) * 2;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.arcValue === undefined) {
      this.arcValue = this._middleRange;
    }
    this._initColorStops();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('pointermove', this._handlePointerMove);
    window.removeEventListener('pointerup', this._handlePointerUp);
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('color1') || changedProperties.has('color2')) {
      this._initColorStops();
    }

    if (changedProperties.has('minRange') || changedProperties.has('maxRange')) {
      // Clamp current value to new range
      const clampedValue = this._clampValue(this.arcValue);
      if (clampedValue !== this.arcValue) {
        this.arcValue = clampedValue;
      }
    }
  }

  // Color utilities
  static hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      throw new Error(`Invalid hexadecimal color value: ${hex}`);
    }
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }

  static rgbToHex({ r, g, b }) {
    return `#${[r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;
  }

  static calculateGradientColors(color1, color2, numSteps = 4) {
    const colors = [];
    for (let i = 0; i <= numSteps + 1; i++) {
      const t = i / (numSteps + 1);
      colors.push({
        r: Math.round(color1.r + (color2.r - color1.r) * t),
        g: Math.round(color1.g + (color2.g - color1.g) * t),
        b: Math.round(color1.b + (color2.b - color1.b) * t),
      });
    }
    return colors;
  }

  _initColorStops() {
    try {
      const rgb1 = ArcSlider.hexToRgb(this.color1);
      const rgb2 = ArcSlider.hexToRgb(this.color2);
      this._colorStops = ArcSlider.calculateGradientColors(rgb1, rgb2);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('ArcSlider: Invalid color format, using defaults', e);
      const rgb1 = ArcSlider.hexToRgb('#FF1122');
      const rgb2 = ArcSlider.hexToRgb('#1122FF');
      this._colorStops = ArcSlider.calculateGradientColors(rgb1, rgb2);
    }
  }

  _clampValue(value) {
    return Math.min(Math.max(value, this.minRange), this.maxRange);
  }

  _getThumbColor() {
    if (!this._colorStops || this._colorStops.length === 0) return '#ffffff';

    const progress = Math.max(
      0,
      Math.min(1, (this.arcValue - this.minRange) / (this.maxRange - this.minRange))
    );
    const index = (this._colorStops.length - 1) * progress;
    const startIndex = Math.floor(index);
    const endIndex = Math.min(Math.ceil(index), this._colorStops.length - 1);
    const startColor = this._colorStops[startIndex];
    const endColor = this._colorStops[endIndex];

    if (!startColor || !endColor) return '#ffffff';

    const t = index - startIndex;

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);

    return `rgb(${r}, ${g}, ${b})`;
  }

  _handlePointerDown(event) {
    if (this.disabled) return;

    this._isDragging = true;
    this._updateValueFromPointer(event);

    window.addEventListener('pointermove', this._handlePointerMove);
    window.addEventListener('pointerup', this._handlePointerUp);
  }

  _handlePointerMove(event) {
    if (!this._isDragging || this.disabled) return;
    this._updateValueFromPointer(event);
  }

  _handlePointerUp() {
    if (this._isDragging) {
      this._isDragging = false;
      this._dispatchChange();
    }
    window.removeEventListener('pointermove', this._handlePointerMove);
    window.removeEventListener('pointerup', this._handlePointerUp);
  }

  _updateValueFromPointer(event) {
    const svgEl = this.shadowRoot.querySelector('.arc-svg');
    if (!svgEl) return;

    const rect = svgEl.getBoundingClientRect();
    const cx = this.radius + this.strokeWidth;
    const cy = this.radius + this.strokeWidth;

    // Get pointer position relative to SVG center
    const scaleX = this._viewBoxSize / rect.width;
    const scaleY = this._viewBoxSize / rect.height;

    const pointerX = (event.clientX - rect.left) * scaleX;
    const pointerY = (event.clientY - rect.top) * scaleY;

    // Calculate angle from center to pointer
    const dx = pointerX - cx;
    const dy = pointerY - cy;
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    // Convert angle to value using the arc-aware conversion
    const newValue = this._clampValue(this._angleToValue(angleDeg));

    if (newValue !== this.arcValue) {
      this.arcValue = newValue;
      this._dispatchChange();
    }
  }

  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { id: this.id, value: this.arcValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderGradientStops() {
    return this._colorStops.map(
      (color, index) => svg`
        <stop
          offset="${index / (this._colorStops.length - 1)}"
          stop-color="${ArcSlider.rgbToHex(color)}"
        />
      `
    );
  }

  _renderLimits() {
    if (!this.showLimits) return '';

    const startPos = this._getPointOnArc(this.startAngle);
    const endPos = this._getPointOnArc(this.endAngle);
    const offset = this.strokeWidth + 15;

    // Calculate offset direction based on angle
    const startOffsetX = Math.cos(this._degToRad(this.startAngle)) * offset;
    const startOffsetY = Math.sin(this._degToRad(this.startAngle)) * offset;
    const endOffsetX = Math.cos(this._degToRad(this.endAngle)) * offset;
    const endOffsetY = Math.sin(this._degToRad(this.endAngle)) * offset;

    const minValue = this.reverse ? this.minRange : this.maxRange;
    const maxValue = this.reverse ? this.maxRange : this.minRange;

    return svg`
      <text
        x="${startPos.x + startOffsetX}"
        y="${startPos.y + startOffsetY}"
        class="limit-text"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="var(--arc-slider-text-color, #666)"
        font-size="12"
      >${minValue}</text>
      <text
        x="${endPos.x + endOffsetX}"
        y="${endPos.y + endOffsetY}"
        class="limit-text"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="var(--arc-slider-text-color, #666)"
        font-size="12"
      >${maxValue}</text>
    `;
  }

  _renderTicks() {
    if (!this.showTicks || this.showTicks < 2) return '';

    const ticks = [];
    const tickCount = this.showTicks;

    for (let i = 0; i <= tickCount; i++) {
      const progress = i / tickCount;
      const value = Math.round(this.minRange + progress * (this.maxRange - this.minRange));

      // Calculate angle for this tick
      const tickProgress = this.reverse ? progress : 1 - progress;
      let angle;

      if (this._isClockwise) {
        let angleDiff = this.endAngle - this.startAngle;
        if (angleDiff <= 0) angleDiff += 360;
        angle = this.startAngle + tickProgress * angleDiff;
        if (angle >= 360) angle -= 360;
      } else {
        let angleDiff = this.startAngle - this.endAngle;
        if (angleDiff <= 0) angleDiff += 360;
        angle = this.startAngle - tickProgress * angleDiff;
        if (angle < 0) angle += 360;
      }

      const pos = this._getPointOnArc(angle);
      const offset = this.strokeWidth + 20;
      const offsetX = Math.cos(this._degToRad(angle)) * offset;
      const offsetY = Math.sin(this._degToRad(angle)) * offset;

      ticks.push(svg`
        <text
          x="${pos.x + offsetX}"
          y="${pos.y + offsetY}"
          class="tick-text"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="var(--arc-slider-text-color, #999)"
          font-size="10"
        >${value}</text>
      `);
    }

    return ticks;
  }

  _renderThumbValue(thumbPos) {
    if (!this.showValueOnThumb) return '';

    // Position the value above the thumb
    const offsetY = -25;

    return svg`
      <g class="thumb-value-group">
        <rect
          x="${thumbPos.x - 20}"
          y="${thumbPos.y + offsetY - 10}"
          width="40"
          height="20"
          rx="10"
          fill="var(--arc-slider-thumb-badge-bg, #333)"
        />
        <text
          x="${thumbPos.x}"
          y="${thumbPos.y + offsetY}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="var(--arc-slider-thumb-badge-color, #fff)"
          font-size="12"
          font-weight="bold"
        >${this.arcValue ?? this._middleRange}</text>
      </g>
    `;
  }

  render() {
    const currentAngle = this._valueToAngle(this.arcValue ?? this._middleRange);
    const thumbPos = this._getPointOnArc(currentAngle);
    const thumbColor = this._getThumbColor();
    const viewBox = this._viewBoxSize;
    const thumbSize = 20;

    const valueDisplay = !this.hideValue
      ? html`<div class="value-display">
          <span class="value-text">${this.arcValue ?? this._middleRange}</span>
        </div>`
      : '';

    return html`
      <div class="arc-slider-container" data-value-position="${this.valuePosition}">
        ${this.valuePosition === 'top' ? valueDisplay : ''}

        <svg
          class="arc-svg"
          viewBox="0 0 ${viewBox} ${viewBox}"
          @pointerdown=${this._handlePointerDown}
        >
          <defs>
            <linearGradient
              id="arc-gradient-${this._uniqueId}"
              gradientUnits="userSpaceOnUse"
              x1="${this._getPointOnArc(this.startAngle).x}"
              y1="${this._getPointOnArc(this.startAngle).y}"
              x2="${this._getPointOnArc(this.endAngle).x}"
              y2="${this._getPointOnArc(this.endAngle).y}"
            >
              ${this._renderGradientStops()}
            </linearGradient>
          </defs>

          <!-- Ticks -->
          ${this._renderTicks()}

          <!-- Limits -->
          ${this._renderLimits()}

          <!-- Arc path -->
          <path
            class="arc-path"
            d="${this._getArcPath()}"
            stroke="url(#arc-gradient-${this._uniqueId})"
            stroke-width="${this.strokeWidth}"
            stroke-linecap="round"
            fill="none"
          />

          <!-- Thumb -->
          <circle
            class="arc-thumb"
            cx="${thumbPos.x}"
            cy="${thumbPos.y}"
            r="${thumbSize / 2}"
            fill="white"
            stroke="${thumbColor}"
            stroke-width="3"
            style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"
          />

          <!-- Inner colored circle of thumb -->
          <circle
            cx="${thumbPos.x}"
            cy="${thumbPos.y}"
            r="${thumbSize / 2 - 4}"
            fill="${thumbColor}"
          />

          <!-- Value badge on thumb -->
          ${this._renderThumbValue(thumbPos)}
        </svg>

        ${this.valuePosition === 'center' ? valueDisplay : ''}
        ${this.valuePosition === 'bottom' || !this.valuePosition ? valueDisplay : ''}

        <!-- Hidden input for accessibility -->
        <input
          type="range"
          class="sr-only"
          min="${this.minRange}"
          max="${this.maxRange}"
          step="${this.step}"
          .value="${String(this.arcValue ?? this._middleRange)}"
          ?disabled=${this.disabled}
          aria-label="Arc slider"
          @input=${(e) => {
            this.arcValue = parseInt(e.target.value, 10);
            this._dispatchChange();
          }}
        />
      </div>
    `;
  }

  get _uniqueId() {
    if (!this.__uniqueId) {
      this.__uniqueId = Math.random().toString(36).substring(2, 9);
    }
    return this.__uniqueId;
  }
}

customElements.define('arc-slider', ArcSlider);
