import { LitElement, html, css } from 'lit';

/**
 * Countdown timer and clock web component.
 *
 * @element click-clock
 * @fires tick - Fired every second with remaining time
 * @fires complete - Fired when countdown reaches zero
 * @fires start - Fired when timer starts
 * @fires pause - Fired when timer pauses
 * @fires reset - Fired when timer resets
 * @cssprop [--clock-font-size=2rem] - Font size
 * @cssprop [--clock-font-family=monospace] - Font family
 * @cssprop [--clock-color=#1f2937] - Text color
 * @cssprop [--clock-bg=transparent] - Background color
 */
export class ClickClock extends LitElement {
  static properties = {
    /** Mode: 'countdown', 'stopwatch', 'clock' */
    mode: { type: String },
    /** Initial time in seconds for countdown/stopwatch */
    time: { type: Number },
    /** Target date for countdown (ISO string or timestamp) */
    target: { type: String },
    /** Auto-start on load */
    autostart: { type: Boolean },
    /** Show days */
    showDays: { type: Boolean, attribute: 'show-days' },
    /** Hide days (declarative alternative) */
    hideDays: { type: Boolean, attribute: 'hide-days' },
    /** Show hours */
    showHours: { type: Boolean, attribute: 'show-hours' },
    /** Hide hours (declarative alternative) */
    hideHours: { type: Boolean, attribute: 'hide-hours' },
    /** Show minutes */
    showMinutes: { type: Boolean, attribute: 'show-minutes' },
    /** Hide minutes (declarative alternative) */
    hideMinutes: { type: Boolean, attribute: 'hide-minutes' },
    /** Show seconds */
    showSeconds: { type: Boolean, attribute: 'show-seconds' },
    /** Hide seconds (declarative alternative) */
    hideSeconds: { type: Boolean, attribute: 'hide-seconds' },
    /** Show milliseconds */
    showMilliseconds: { type: Boolean, attribute: 'show-milliseconds' },
    /** Separator between units */
    separator: { type: String },
    /** Format: 'full', 'compact', 'digital' */
    format: { type: String },
    /** Internal: current remaining time in ms */
    _remaining: { state: true },
    /** Internal: is running */
    _running: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .clock {
      font-family: var(--clock-font-family, 'SF Mono', Monaco, Consolas, monospace);
      font-size: var(--clock-font-size, 2rem);
      color: var(--clock-color, #1f2937);
      background: var(--clock-bg, transparent);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .unit {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .value {
      font-weight: 600;
      min-width: 2ch;
      text-align: center;
    }

    .label {
      font-size: 0.5em;
      color: var(--clock-muted-color, #6b7280);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .separator {
      opacity: 0.5;
      font-weight: 300;
    }

    .compact .label {
      display: none;
    }

    .digital .unit {
      flex-direction: row;
    }

    .digital .label {
      font-size: 0.7em;
      margin-left: 0.1em;
    }

    .expired {
      color: #ef4444;
    }

    .ms {
      font-size: 0.6em;
      opacity: 0.7;
    }
  `;

  constructor() {
    super();
    this.mode = 'countdown';
    this.time = 60;
    this.target = '';
    this.autostart = false;
    this.showDays = true;
    this.hideDays = false;
    this.showHours = true;
    this.hideHours = false;
    this.showMinutes = true;
    this.hideMinutes = false;
    this.showSeconds = true;
    this.hideSeconds = false;
    this.showMilliseconds = false;
    this.separator = ':';
    this.format = 'digital';
    this._remaining = 0;
    this._running = false;
    this._intervalId = null;
    this._startTime = 0;
    this._pausedTime = 0;
  }

  get _showDays() {
    return this.showDays && !this.hideDays;
  }

  get _showHours() {
    return this.showHours && !this.hideHours;
  }

  get _showMinutes() {
    return this.showMinutes && !this.hideMinutes;
  }

  get _showSeconds() {
    return this.showSeconds && !this.hideSeconds;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initialize();
    if (this.autostart) {
      this.start();
    }
    if (this.mode === 'clock') {
      this._startClock();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopInterval();
  }

  _initialize() {
    if (this.mode === 'countdown') {
      if (this.target) {
        const targetDate = new Date(this.target).getTime();
        this._remaining = Math.max(0, targetDate - Date.now());
      } else {
        this._remaining = this.time * 1000;
      }
    } else if (this.mode === 'stopwatch') {
      this._remaining = 0;
    }
  }

  _startClock() {
    this._intervalId = setInterval(() => {
      this._remaining = Date.now();
      this.requestUpdate();
    }, 1000);
  }

  _stopInterval() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /** Start the timer */
  start() {
    if (this._running || this.mode === 'clock') return;

    this._running = true;
    this._startTime = Date.now() - (this.mode === 'stopwatch' ? this._remaining : 0);

    this.dispatchEvent(new CustomEvent('start', { bubbles: true, composed: true }));

    const interval = this.showMilliseconds ? 100 : 1000;
    this._intervalId = setInterval(() => {
      this._tick();
    }, interval);
  }

  _tick() {
    const elapsed = Date.now() - this._startTime;

    if (this.mode === 'countdown') {
      const initial = this.target
        ? new Date(this.target).getTime() - this._startTime + this._pausedTime
        : this.time * 1000;
      this._remaining = Math.max(0, initial - elapsed + this._pausedTime);

      if (this._remaining <= 0) {
        this._remaining = 0;
        this.pause();
        this.dispatchEvent(new CustomEvent('complete', { bubbles: true, composed: true }));
      }
    } else if (this.mode === 'stopwatch') {
      this._remaining = elapsed;
    }

    this.dispatchEvent(
      new CustomEvent('tick', {
        detail: this._getTimeUnits(),
        bubbles: true,
        composed: true,
      })
    );

    this.requestUpdate();
  }

  /** Pause the timer */
  pause() {
    if (!this._running) return;

    this._running = false;
    this._pausedTime = this._remaining;
    this._stopInterval();

    this.dispatchEvent(new CustomEvent('pause', { bubbles: true, composed: true }));
  }

  /** Reset the timer */
  reset() {
    this.pause();
    this._pausedTime = 0;
    this._initialize();
    this.requestUpdate();

    this.dispatchEvent(new CustomEvent('reset', { bubbles: true, composed: true }));
  }

  /** Toggle start/pause */
  toggle() {
    if (this._running) {
      this.pause();
    } else {
      this.start();
    }
  }

  /** Get current time in seconds */
  getCurrentTime() {
    return Math.floor(this._remaining / 1000);
  }

  _getTimeUnits() {
    let ms = this._remaining;

    if (this.mode === 'clock') {
      const now = new Date(this._remaining || Date.now());
      return {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        days: 0,
        milliseconds: 0,
      };
    }

    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    ms %= 24 * 60 * 60 * 1000;
    const hours = Math.floor(ms / (60 * 60 * 1000));
    ms %= 60 * 60 * 1000;
    const minutes = Math.floor(ms / (60 * 1000));
    ms %= 60 * 1000;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);

    return { days, hours, minutes, seconds, milliseconds };
  }

  _pad(num, length = 2) {
    return String(num).padStart(length, '0');
  }

  _renderUnit(value, label, showLabel = true) {
    return html`
      <span class="unit">
        <span class="value">${this._pad(value)}</span>
        ${showLabel && this.format === 'full' ? html`<span class="label">${label}</span>` : ''}
        ${this.format === 'digital' ? html`<span class="label">${label.charAt(0)}</span>` : ''}
      </span>
    `;
  }

  _renderSeparator() {
    return html`<span class="separator">${this.separator}</span>`;
  }

  _getAriaLabel() {
    const { days, hours, minutes, seconds } = this._getTimeUnits();
    const parts = [];

    if (this._showDays && days > 0) parts.push(`${days} days`);
    if (this._showHours) parts.push(`${hours} hours`);
    if (this._showMinutes) parts.push(`${minutes} minutes`);
    if (this._showSeconds) parts.push(`${seconds} seconds`);

    const modeLabel =
      this.mode === 'countdown' ? 'Countdown' : this.mode === 'stopwatch' ? 'Stopwatch' : 'Clock';

    return `${modeLabel}: ${parts.join(', ')}`;
  }

  render() {
    const { days, hours, minutes, seconds, milliseconds } = this._getTimeUnits();
    const expired = this.mode === 'countdown' && this._remaining === 0;

    const parts = [];

    if (this._showDays && (days > 0 || this.format === 'full')) {
      parts.push(this._renderUnit(days, 'days'));
    }
    if (this._showHours) {
      parts.push(this._renderUnit(hours, 'hrs'));
    }
    if (this._showMinutes) {
      parts.push(this._renderUnit(minutes, 'min'));
    }
    if (this._showSeconds) {
      parts.push(this._renderUnit(seconds, 'sec'));
    }
    if (this.showMilliseconds) {
      parts.push(html`<span class="unit ms"><span class="value">${milliseconds}</span></span>`);
    }

    // Add separators
    const withSeparators = [];
    parts.forEach((part, i) => {
      withSeparators.push(part);
      if (i < parts.length - 1) {
        withSeparators.push(this._renderSeparator());
      }
    });

    return html`
      <div
        class="clock ${this.format} ${expired ? 'expired' : ''}"
        role="timer"
        aria-label="${this._getAriaLabel()}"
        aria-live="off"
      >
        ${withSeparators}
      </div>
    `;
  }
}

customElements.define('click-clock', ClickClock);
