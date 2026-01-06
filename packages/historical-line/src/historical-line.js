import { LitElement, html, css } from 'lit';

/**
 * A horizontal timeline visualization component for displaying historical data.
 *
 * @element historical-line
 * @fires data-changed - Fired when data is updated
 *
 * @attr {String} title - Timeline title
 * @attr {Number} start-year - Start year of the timeline
 * @attr {Number} end-year - End year of the timeline
 *
 * @csspart title - The title element
 * @csspart container - The table container
 *
 * @cssprop [--font-size=16px] - Base font size
 * @cssprop [--title-color=#000] - Title color
 * @cssprop [--border-color=#000] - Border color
 * @cssprop [--desc-font-size=0.8rem] - Description font size
 */
export class HistoricalLine extends LitElement {
  static properties = {
    title: { type: String },
    startYear: { type: Number, attribute: 'start-year' },
    endYear: { type: Number, attribute: 'end-year' },
    data: { type: Array },
    _arrYears: { state: true },
    _arrMain: { state: true },
    _arrDesc: { state: true },
    _arrColspan: { state: true },
    _numMonths: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      overflow-x: auto;
      overflow-y: hidden;
      margin: 20px;
      --font-size: 16px;
      --title-color: #1d1d1f;
      --border-color: #d2d2d7;
      --desc-font-size: 0.8rem;
    }

    .container {
      font-size: var(--font-size);
      border-spacing: 0;
      width: 100%;
      min-width: max-content;
    }

    .title {
      padding: 0 20px 10px;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--title-color);
      margin: 0;
    }

    td {
      vertical-align: top;
      padding: 2px;
    }

    .item,
    .year {
      margin: 0;
      padding: 4px 8px;
      border: 1px solid var(--border-color);
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
    }

    .year {
      background: #f5f5f7;
      font-size: 0.9rem;
    }

    .desc {
      margin: 0;
      padding: 10px;
      border: 0;
      border-top: 1px solid var(--border-color);
      border-radius: 0 0 12px 12px;
      font-size: var(--desc-font-size);
      font-weight: normal;
      line-height: 1.4;
    }

    .rule-item {
      color: var(--border-color);
      font-size: 0.6rem;
      text-align: center;
      padding: 0;
    }

    #space {
      height: 20px;
    }

    /* Dark mode support */
    :host-context(.dark) {
      --title-color: #f5f5f7;
      --border-color: #48484a;
    }

    :host-context(.dark) .year {
      background: #2c2c2e;
    }
  `;

  constructor() {
    super();
    this.title = '';
    this.data = [];
    this._today = new Date();
    this._arrYears = [];
    this._arrMain = [];
    this._arrDesc = [];
    this._arrColspan = [];
    this._numMonths = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseSlottedData();
  }

  willUpdate(changedProperties) {
    if (
      changedProperties.has('startYear') ||
      changedProperties.has('endYear') ||
      changedProperties.has('data')
    ) {
      this._calculateTimeline();
    }
  }

  _parseSlottedData() {
    const items = this.querySelectorAll('timeline-item');
    if (items.length > 0) {
      this.data = Array.from(items).map((item) => ({
        start: item.getAttribute('start') || '',
        main: item.getAttribute('label') || item.textContent.trim(),
        desc: item.getAttribute('description') || '',
        bg: item.getAttribute('background') || '',
        color: item.getAttribute('color') || '',
      }));
    }
  }

  _monthDiff(d1, d2) {
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  _calculateTimeline() {
    const startYear = this.startYear || this._today.getFullYear();
    const endYear = this.endYear || this._today.getFullYear();
    const startDate = new Date(`12/1/${startYear - 1}`);

    this._numMonths = (endYear - startYear + 1) * 12;

    // Build years array
    this._arrYears = [];
    for (let y = startYear; y <= endYear; y++) {
      this._arrYears.push(y);
    }

    if (!this.data || this.data.length === 0) {
      this._arrMain = [];
      this._arrDesc = [];
      return;
    }

    // Create working copy with boundaries
    const workingData = [
      { start: `1/1/${startYear}`, main: '', bg: '', color: '', desc: '' },
      ...this.data,
      {
        start: `${this._today.getMonth() + 1}/${this._today.getDate()}/${this._today.getFullYear()}`,
        main: '',
        desc: '',
        bg: '',
        color: '',
      },
      { start: `12/1/${endYear}`, main: '', desc: '', bg: '', color: '' },
    ];

    // Calculate colspans
    let newStart = startDate;
    this._arrColspan = workingData.map((t, index) => {
      if (index === 0) return 0;
      const s = new Date(newStart);
      const e = new Date(t.start);
      const m = this._monthDiff(s, e);
      newStart = t.start;
      return m + 1;
    });

    // Build main and desc arrays
    this._arrMain = workingData.slice(0, -1).map((el, index) => ({
      text: el.main,
      bg: el.bg,
      color: el.color,
      colspan: this._arrColspan[index + 1],
    }));

    this._arrDesc = workingData.slice(0, -1).map((el, index) => ({
      text: el.desc,
      colspan: this._arrColspan[index + 1],
    }));
  }

  render() {
    return html`
      ${this.title ? html`<h3 class="title" part="title">${this.title}</h3>` : ''}
      <table class="container" part="container">
        <tr>
          ${this._arrYears.map((year) => html`<td class="year" colspan="12">${year}</td>`)}
        </tr>
        <tr>
          ${Array(this._numMonths)
            .fill(0)
            .map(() => html`<td class="rule-item">│</td>`)}
        </tr>
        <tr>
          ${this._arrMain.map(
            (item) => html`
              <td
                class="item"
                style="background:${item.bg}; color:${item.color};"
                colspan="${item.colspan}"
              >
                ${item.text}
              </td>
            `
          )}
        </tr>
        <tr id="space"></tr>
        <tr>
          ${this._arrDesc.map(
            (item) => html`
              <td class="desc" colspan="${item.colspan}">${this._renderDesc(item.text)}</td>
            `
          )}
        </tr>
      </table>
      <slot @slotchange="${this._parseSlottedData}" style="display:none;"></slot>
    `;
  }

  _renderDesc(text) {
    // If text contains HTML, render it unsafely (for backwards compatibility)
    if (text && text.includes('<')) {
      const div = document.createElement('div');
      div.innerHTML = text;
      return html`${Array.from(div.childNodes).map((node) => node.textContent)}`;
    }
    return text;
  }
}

customElements.define('historical-line', HistoricalLine);
