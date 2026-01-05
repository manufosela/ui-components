import { LitElement, html, svg } from 'lit';
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
 * @cssprop --circle-percent-font-family - Font family
 * @cssprop --circle-percent-bg-color - Background circle color (default: #e5e7eb)
 * @cssprop --circle-percent-text-size - Percentage text size (default: 1.5rem)
 * @cssprop --circle-percent-text-weight - Percentage text weight (default: 600)
 * @cssprop --circle-percent-text-color - Percentage text color
 * @cssprop --circle-percent-title-size - Title text size (default: 0.875rem)
 * @cssprop --circle-percent-title-color - Title text color (default: #6b7280)
 * @cssprop --circle-percent-animation-duration - Transition duration (default: 0.5s)
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

    return html`
      <div class="circle-container">
        <div class="circle-wrapper">
          <svg
            width="${viewBox}"
            height="${viewBox}"
            viewBox="0 0 ${viewBox} ${viewBox}"
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
