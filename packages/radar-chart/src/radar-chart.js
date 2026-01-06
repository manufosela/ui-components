import { LitElement, html, css, svg } from 'lit';

/**
 * SVG-based radar/spider chart web component.
 *
 * @element radar-chart
 * @fires data-point-click - Fired when a data point is clicked
 * @cssprop --radar-size - Chart size (default: 300px)
 * @cssprop --radar-bg - Background color (default: #fff)
 * @cssprop --radar-grid-color - Grid line color (default: #e2e8f0)
 * @cssprop --radar-axis-color - Axis line color (default: #94a3b8)
 * @cssprop --radar-label-color - Label text color (default: #475569)
 */
export class RadarChart extends LitElement {
  static properties = {
    /** Array of axis labels */
    labels: { type: Array },
    /** Array of data series [{name, values, color}] */
    series: { type: Array },
    /** Maximum value for scale (auto-calculated if not set) */
    maxValue: { type: Number, attribute: 'max-value' },
    /** Number of grid levels */
    levels: { type: Number },
    /** Show data point dots */
    showDots: { type: Boolean, attribute: 'show-dots' },
    /** Show legend */
    showLegend: { type: Boolean, attribute: 'show-legend' },
    /** Show value labels on hover */
    showValues: { type: Boolean, attribute: 'show-values' },
    /** Fill opacity for data areas */
    fillOpacity: { type: Number, attribute: 'fill-opacity' },
    /** Chart size in pixels */
    size: { type: Number },
    /** Internal: hovered point */
    _hoveredPoint: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .container {
      width: var(--radar-size, 300px);
      height: var(--radar-size, 300px);
      position: relative;
    }

    svg {
      width: 100%;
      height: 100%;
      background: var(--radar-bg, #fff);
    }

    .grid-line {
      fill: none;
      stroke: var(--radar-grid-color, #e2e8f0);
      stroke-width: 1;
    }

    .axis-line {
      stroke: var(--radar-axis-color, #94a3b8);
      stroke-width: 1;
    }

    .axis-label {
      font-size: 11px;
      fill: var(--radar-label-color, #475569);
      text-anchor: middle;
      dominant-baseline: middle;
      user-select: none;
    }

    .data-area {
      transition: opacity 0.2s;
    }

    .data-area:hover {
      opacity: 1 !important;
    }

    .data-point {
      cursor: pointer;
      transition:
        r 0.2s,
        fill 0.2s;
    }

    .data-point:hover {
      r: 6;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--radar-label-color, #475569);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .tooltip {
      position: absolute;
      background: rgba(15, 23, 42, 0.9);
      color: white;
      padding: 0.375rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      pointer-events: none;
      transform: translate(-50%, -100%);
      margin-top: -8px;
      white-space: nowrap;
      z-index: 10;
    }

    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -4px;
      border: 4px solid transparent;
      border-top-color: rgba(15, 23, 42, 0.9);
    }

    .level-label {
      font-size: 9px;
      fill: var(--radar-axis-color, #94a3b8);
    }
  `;

  constructor() {
    super();
    this.labels = [];
    this.series = [];
    this.maxValue = 0;
    this.levels = 5;
    this.showDots = true;
    this.showLegend = true;
    this.showValues = true;
    this.fillOpacity = 0.25;
    this.size = 300;
    this._hoveredPoint = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseSlottedContent();
  }

  /** Parse slotted elements for declarative labels and series */
  _parseSlottedContent() {
    const seriesElements = this.querySelectorAll('chart-series');

    if (seriesElements.length > 0) {
      // New declarative format: <chart-series><chart-value label="X">value</chart-value></chart-series>
      const parsedSeries = Array.from(seriesElements)
        .map((el) => {
          const valueElements = el.querySelectorAll('chart-value');

          if (valueElements.length > 0) {
            // Fully declarative: each value is its own element
            const items = Array.from(valueElements).map((ve) => ({
              label: ve.getAttribute('label') || '',
              value: parseFloat(ve.textContent.trim()) || 0,
            }));

            return {
              name: el.getAttribute('name') || '',
              color: el.getAttribute('color') || '',
              values: items.map((item) => item.value),
              labels: items.map((item) => item.label),
            };
          } else {
            // Legacy format: values attribute with comma-separated values
            return {
              name: el.getAttribute('name') || '',
              color: el.getAttribute('color') || '',
              values: el.getAttribute('values')
                ? el
                    .getAttribute('values')
                    .split(',')
                    .map((v) => parseFloat(v.trim()))
                : [],
              labels: [],
            };
          }
        })
        .filter((s) => s.values.length > 0);

      this.series = parsedSeries;

      // Extract labels from first series (all series should share same labels)
      if (parsedSeries.length > 0 && parsedSeries[0].labels.length > 0) {
        this.labels = parsedSeries[0].labels;
      }
    }

    // Fallback: check for standalone chart-label elements (legacy support)
    if (this.labels.length === 0) {
      const labelElements = this.querySelectorAll(':scope > chart-label');
      if (labelElements.length > 0) {
        this.labels = Array.from(labelElements)
          .map((el) => el.textContent.trim())
          .filter(Boolean);
      }
    }
  }

  _getMaxValue() {
    if (this.maxValue > 0) return this.maxValue;
    let max = 0;
    for (const s of this.series) {
      for (const v of s.values || []) {
        if (v > max) max = v;
      }
    }
    return max || 100;
  }

  _polarToCartesian(angle, radius, cx, cy) {
    const angleRad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  }

  _getPolygonPoints(values, cx, cy, radius, max) {
    const angleStep = 360 / values.length;
    const points = values.map((value, i) => {
      const angle = i * angleStep;
      const r = (value / max) * radius;
      const point = this._polarToCartesian(angle, r, cx, cy);
      return `${point.x},${point.y}`;
    });
    return points.join(' ');
  }

  _handlePointClick(seriesIndex, pointIndex, value) {
    this.dispatchEvent(
      new CustomEvent('data-point-click', {
        detail: {
          series: this.series[seriesIndex]?.name || `Series ${seriesIndex + 1}`,
          seriesIndex,
          label: this.labels[pointIndex] || `Point ${pointIndex + 1}`,
          pointIndex,
          value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handlePointHover(event, seriesIndex, pointIndex, value) {
    const rect = this.shadowRoot.querySelector('.container').getBoundingClientRect();
    this._hoveredPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      series: this.series[seriesIndex]?.name || `Series ${seriesIndex + 1}`,
      label: this.labels[pointIndex] || `Point ${pointIndex + 1}`,
      value,
    };
  }

  _handlePointLeave() {
    this._hoveredPoint = null;
  }

  _renderGrid(cx, cy, radius, numAxes) {
    const grids = [];
    const angleStep = 360 / numAxes;
    const max = this._getMaxValue();

    // Grid polygons
    for (let level = 1; level <= this.levels; level++) {
      const r = (radius / this.levels) * level;
      const points = [];
      for (let i = 0; i < numAxes; i++) {
        const point = this._polarToCartesian(i * angleStep, r, cx, cy);
        points.push(`${point.x},${point.y}`);
      }
      grids.push(svg`
        <polygon
          class="grid-line"
          points="${points.join(' ')}"
        />
      `);
    }

    // Axis lines
    for (let i = 0; i < numAxes; i++) {
      const point = this._polarToCartesian(i * angleStep, radius, cx, cy);
      grids.push(svg`
        <line
          class="axis-line"
          x1="${cx}"
          y1="${cy}"
          x2="${point.x}"
          y2="${point.y}"
        />
      `);
    }

    // Level labels (on first axis)
    for (let level = 1; level <= this.levels; level++) {
      const r = (radius / this.levels) * level;
      const value = Math.round((max / this.levels) * level);
      grids.push(svg`
        <text
          class="level-label"
          x="${cx + 4}"
          y="${cy - r}"
          text-anchor="start"
        >${value}</text>
      `);
    }

    return grids;
  }

  _renderLabels(cx, cy, radius, labels) {
    const angleStep = 360 / labels.length;
    const labelOffset = 20;

    return labels.map((label, i) => {
      const point = this._polarToCartesian(i * angleStep, radius + labelOffset, cx, cy);
      return svg`
        <text
          class="axis-label"
          x="${point.x}"
          y="${point.y}"
        >${label}</text>
      `;
    });
  }

  _renderSeries(cx, cy, radius) {
    const max = this._getMaxValue();
    const angleStep = 360 / this.labels.length;

    return this.series.map((s, seriesIndex) => {
      const color = s.color || this._getDefaultColor(seriesIndex);
      const values = s.values || [];
      const polygonPoints = this._getPolygonPoints(values, cx, cy, radius, max);

      const dots = this.showDots
        ? values.map((value, pointIndex) => {
            const angle = pointIndex * angleStep;
            const r = (value / max) * radius;
            const point = this._polarToCartesian(angle, r, cx, cy);
            return svg`
          <circle
            class="data-point"
            cx="${point.x}"
            cy="${point.y}"
            r="4"
            fill="${color}"
            stroke="white"
            stroke-width="2"
            @click="${() => this._handlePointClick(seriesIndex, pointIndex, value)}"
            @mouseenter="${(e) => this._handlePointHover(e, seriesIndex, pointIndex, value)}"
            @mouseleave="${() => this._handlePointLeave()}"
          />
        `;
          })
        : [];

      return svg`
        <g class="data-series">
          <polygon
            class="data-area"
            points="${polygonPoints}"
            fill="${color}"
            fill-opacity="${this.fillOpacity}"
            stroke="${color}"
            stroke-width="2"
          />
          ${dots}
        </g>
      `;
    });
  }

  _getDefaultColor(index) {
    const colors = [
      '#3b82f6', // blue
      '#22c55e', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
    ];
    return colors[index % colors.length];
  }

  _renderLegend() {
    if (!this.showLegend || this.series.length === 0) return null;

    return html`
      <div class="legend">
        ${this.series.map((s, i) => {
          const color = s.color || this._getDefaultColor(i);
          return html`
            <div class="legend-item">
              <div class="legend-color" style="background: ${color}"></div>
              <span>${s.name || `Series ${i + 1}`}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderTooltip() {
    if (!this.showValues || !this._hoveredPoint) return null;

    const { x, y, series, label, value } = this._hoveredPoint;
    return html`
      <div class="tooltip" style="left: ${x}px; top: ${y}px">
        <strong>${label}</strong>: ${value} <br /><small>${series}</small>
      </div>
    `;
  }

  render() {
    const numAxes = this.labels.length || 3;
    const padding = 40;
    const size = this.size;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - padding;

    return html`
      <div class="container" style="--radar-size: ${size}px">
        <svg viewBox="0 0 ${size} ${size}">
          ${this._renderGrid(cx, cy, radius, numAxes)}
          ${this._renderLabels(cx, cy, radius, this.labels.length ? this.labels : ['A', 'B', 'C'])}
          ${this._renderSeries(cx, cy, radius)}
        </svg>
        ${this._renderTooltip()}
      </div>
      ${this._renderLegend()}
    `;
  }
}

customElements.define('radar-chart', RadarChart);
