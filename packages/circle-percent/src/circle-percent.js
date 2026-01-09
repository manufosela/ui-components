import { LitElement, html } from 'lit';
import { circlePercentStyles } from './circle-percent.styles.js';

/**
 * A circular progress indicator with animated SVG arc.
 *
 * @element circle-percent
 *
 * @attr {String} title - Text label displayed below the circle
 * @attr {Number} percent - Progress value from 0 to 100 (default: 0)
 * @attr {Number} radius - Radius of the circle in pixels (default: 50)
 * @attr {Number} stroke-width - Width of the progress arc (default: 6)
 * @attr {String} stroke-color - Color of the progress arc (default: #3b82f6)
 * @attr {Boolean} show-percent - Whether to display the percentage text (default: true)
 * @attr {String} size - Predefined size: 'small', 'medium', 'large' (default: medium)
 *
 * @cssprop [--circle-percent-font-family=inherit] - Font family
 * @cssprop [--circle-percent-bg-color=#e5e7eb] - Background circle color
 * @cssprop [--circle-percent-text-size=1.5rem] - Percentage text size
 * @cssprop [--circle-percent-text-weight=600] - Percentage text weight
 * @cssprop [--circle-percent-text-color=currentColor] - Percentage text color
 * @cssprop [--circle-percent-title-size=0.875rem] - Title text size
 * @cssprop [--circle-percent-title-color=#6b7280] - Title text color
 * @cssprop [--circle-percent-animation-duration=0.5s] - Transition duration
 */
export class CirclePercent extends LitElement {
  static styles = circlePercentStyles;

  static properties = {
    title: { type: String },
    percent: { type: Number },
    radius: { type: Number },
    strokeWidth: { type: Number, attribute: 'stroke-width' },
    strokeColor: { type: String, attribute: 'stroke-color' },
    showPercent: { type: Boolean, attribute: 'show-percent' },
    size: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.title = '';
    this.percent = 0;
    this.radius = 50;
    this.strokeWidth = 6;
    this.strokeColor = '#3b82f6';
    this.showPercent = true;
    this.size = 'medium';
  }

  get _normalizedRadius() {
    return this.radius - this.strokeWidth / 2;
  }

  get _circumference() {
    return 2 * Math.PI * this._normalizedRadius;
  }

  get _strokeDasharray() {
    const clampedPercent = Math.min(100, Math.max(0, this.percent));
    const progress = (clampedPercent / 100) * this._circumference;
    return `${progress} ${this._circumference}`;
  }

  get _viewBoxSize() {
    return this.radius * 2;
  }

  render() {
    const viewBox = this._viewBoxSize;
    const center = this.radius;
    const normalizedRadius = this._normalizedRadius;
    const clampedPercent = Math.min(100, Math.max(0, this.percent));
    const ariaLabel = this.title || 'Progress';

    return html`
      <div
        class="circle-container"
        role="progressbar"
        aria-valuenow="${Math.round(clampedPercent)}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="${ariaLabel}: ${Math.round(clampedPercent)}%"
      >
        <div class="circle-wrapper">
          <svg
            width="${viewBox}"
            height="${viewBox}"
            viewBox="0 0 ${viewBox} ${viewBox}"
            aria-hidden="true"
          >
            <!-- Background circle -->
            <circle
              class="background-circle"
              cx="${center}"
              cy="${center}"
              r="${normalizedRadius}"
              stroke-width="${this.strokeWidth}"
            />
            <!-- Progress circle -->
            <circle
              class="progress-circle"
              cx="${center}"
              cy="${center}"
              r="${normalizedRadius}"
              stroke="${this.strokeColor}"
              stroke-width="${this.strokeWidth}"
              stroke-dasharray="${this._strokeDasharray}"
            />
          </svg>
          ${this.showPercent
            ? html`<span class="percent-text">${Math.round(this.percent)}%</span>`
            : ''}
        </div>
        ${this.title ? html`<div class="title">${this.title}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('circle-percent', CirclePercent);
