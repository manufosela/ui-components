import { LitElement, html, css } from 'lit';

/**
 * Inline calendar web component — full-featured date picker with keyboard navigation,
 * range selection, view switching (days/months/years), and form association.
 *
 * @element calendar-inline
 * @fires date-select   - Fired when a single date is selected. detail: { date, dateObj, holiday }
 * @fires range-select  - Fired when a range is fully selected. detail: { start, end, startObj, endObj }
 * @fires month-change  - Fired when the displayed month changes. detail: { month, year }
 * @fires view-change   - Fired when the view changes (days/months/years). detail: { view }
 *
 * @cssprop [--calendar-bg=#fff]                    - Background color
 * @cssprop [--calendar-text=#1f2937]               - Text color
 * @cssprop [--calendar-shadow=0 2px 8px rgba(0,0,0,0.1)] - Box shadow
 * @cssprop [--calendar-today=#dbeafe]              - Today highlight background
 * @cssprop [--calendar-selected=#3b82f6]           - Selected date background
 * @cssprop [--calendar-hover-bg=#f1f5f9]           - Hover background
 * @cssprop [--calendar-muted=#6b7280]              - Muted text color
 * @cssprop [--calendar-muted-strong=#9ca3af]       - Muted strong text color
 * @cssprop [--calendar-other-month=#d1d5db]        - Other month day color
 * @cssprop [--calendar-disabled=#e5e7eb]           - Disabled day color
 * @cssprop [--calendar-holiday=#ef4444]            - Holiday dot color
 * @cssprop [--calendar-holiday-selected=white]     - Holiday dot color when selected
 * @cssprop [--calendar-range-bg=#dbeafe]           - Range in-between background
 * @cssprop [--calendar-range-start-bg=#3b82f6]     - Range start background
 * @cssprop [--calendar-range-end-bg=#3b82f6]       - Range end background
 * @cssprop [--calendar-range-hover-bg=#eff6ff]     - Range hover preview background
 * @cssprop [--calendar-picker-bg=#f8fafc]          - Month/year picker background
 * @cssprop [--calendar-picker-hover-bg=#e0f2fe]    - Month/year picker hover background
 * @cssprop [--calendar-picker-selected-bg=#3b82f6] - Month/year picker selected background
 * @cssprop [--calendar-picker-selected-text=white] - Month/year picker selected text
 * @cssprop [--calendar-today-btn-color=#3b82f6]    - Today button color
 */
export class CalendarInline extends LitElement {
  static formAssociated = true;

  static properties = {
    /** Selected date (ISO string, single mode) */
    value: { type: String, reflect: true },
    /** Minimum selectable date (ISO string) */
    min: { type: String },
    /** Maximum selectable date (ISO string) */
    max: { type: String },
    /** Disabled dates array (ISO strings) */
    disabledDates: { type: Array, attribute: 'disabled-dates' },
    /** Holidays array [{date, title}] */
    holidays: { type: Array },
    /** First day of week (0=Sunday, 1=Monday) */
    firstDayOfWeek: { type: Number, attribute: 'first-day-of-week' },
    /** Show week numbers */
    showWeekNumbers: { type: Boolean, attribute: 'show-week-numbers' },
    /** Locale for formatting */
    locale: { type: String },
    /** Selection mode: 'single' | 'range' */
    mode: { type: String },
    /** Range start (ISO string, range mode) */
    valueStart: { type: String, attribute: 'value-start', reflect: true },
    /** Range end (ISO string, range mode) */
    valueEnd: { type: String, attribute: 'value-end', reflect: true },
    /** Form field name */
    name: { type: String, reflect: true },
    /** Whether the control is disabled */
    disabled: { type: Boolean, reflect: true },
    /** Whether the control is readonly */
    readonly: { type: Boolean, reflect: true },
    /** Internal: current month being displayed */
    _currentMonth: { state: true },
    /** Internal: current year being displayed */
    _currentYear: { state: true },
    /** Internal: current view ('days' | 'months' | 'years') */
    _view: { state: true },
    /** Internal: decade start for years view */
    _decadeStart: { state: true },
    /** Internal: focused date for roving tabindex */
    _focusedDate: { state: true },
    /** Internal: range selecting second date */
    _selectingEnd: { state: true },
    /** Internal: hovered date for range preview */
    _hoveredDate: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .calendar {
      background: var(--calendar-bg, #fff);
      border-radius: 12px;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: var(--calendar-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
      max-width: 320px;
      outline: none;
    }

    /* ─── Header ─────────────────────────────────── */

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      gap: 0.25rem;
    }

    .header-center {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
    }

    .month-year-btn {
      background: none;
      border: none;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--calendar-text, #1f2937);
      transition: background-color 0.2s;
    }

    .month-year-btn:hover {
      background: var(--calendar-hover-bg, #f1f5f9);
    }

    .today-btn {
      background: none;
      border: none;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--calendar-today-btn-color, #3b82f6);
      transition: background-color 0.2s;
      white-space: nowrap;
    }

    .today-btn:hover {
      background: var(--calendar-hover-bg, #f1f5f9);
    }

    .nav-btn {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 6px;
      color: var(--calendar-text, #1f2937);
      font-size: 1.2rem;
      transition: background-color 0.2s;
      line-height: 1;
    }

    .nav-btn:hover {
      background: var(--calendar-hover-bg, #f1f5f9);
    }

    /* ─── Days view ───────────────────────────────── */

    .days-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .days-table th {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--calendar-muted, #6b7280);
      padding: 0.5rem 0;
      text-align: center;
    }

    .days-table td {
      padding: 0;
      text-align: center;
    }

    .week-number-cell {
      font-size: 0.7rem;
      color: var(--calendar-muted-strong, #9ca3af);
      padding: 0.25rem;
      text-align: center;
      width: 2rem;
    }

    /* ─── Day button ─────────────────────────────── */

    .day {
      aspect-ratio: 1;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: none;
      background: none;
      font-size: 0.875rem;
      cursor: pointer;
      transition:
        background-color 0.2s,
        color 0.2s;
      position: relative;
      color: var(--calendar-text, #1f2937);
      padding: 0;
      box-sizing: border-box;
      font-family: inherit;
      outline: none;
    }

    .day:focus-visible {
      outline: 2px solid var(--calendar-selected, #3b82f6);
      outline-offset: 1px;
    }

    .day:hover:not(.disabled):not(.other-month) {
      background: var(--calendar-hover-bg, #f1f5f9);
    }

    .day.today {
      background: var(--calendar-today, #dbeafe);
      font-weight: 600;
    }

    .day.selected {
      background: var(--calendar-selected, #3b82f6);
      color: white;
    }

    .day.other-month {
      color: var(--calendar-other-month, #d1d5db);
    }

    .day.disabled {
      color: var(--calendar-disabled, #e5e7eb);
      cursor: not-allowed;
    }

    .day.holiday::after {
      content: '';
      position: absolute;
      bottom: 2px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--calendar-holiday, #ef4444);
    }

    .day.holiday.selected::after {
      background: var(--calendar-holiday-selected, white);
    }

    /* ─── Range styles ───────────────────────────── */

    /* The TD wraps range background; button stays circular */
    td.in-range {
      background: var(--calendar-range-bg, #dbeafe);
    }

    td.range-start {
      background: linear-gradient(to right, transparent 50%, var(--calendar-range-bg, #dbeafe) 50%);
    }

    td.range-end {
      background: linear-gradient(to left, transparent 50%, var(--calendar-range-bg, #dbeafe) 50%);
    }

    td.range-start.range-end {
      background: none;
    }

    td.range-hover {
      background: var(--calendar-range-hover-bg, #eff6ff);
    }

    .day.range-start,
    .day.range-end {
      background: var(--calendar-range-start-bg, #3b82f6);
      color: white;
    }

    .day.range-start.today,
    .day.range-end.today {
      background: var(--calendar-range-start-bg, #3b82f6);
    }

    /* ─── Months / Years picker ──────────────────── */

    .picker-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding: 0.5rem 0;
    }

    .picker-btn {
      background: var(--calendar-picker-bg, #f8fafc);
      border: none;
      padding: 0.75rem 0.5rem;
      cursor: pointer;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--calendar-text, #1f2937);
      transition:
        background-color 0.2s,
        color 0.2s;
      font-family: inherit;
      outline: none;
    }

    .picker-btn:hover {
      background: var(--calendar-picker-hover-bg, #e0f2fe);
    }

    .picker-btn:focus-visible {
      outline: 2px solid var(--calendar-selected, #3b82f6);
      outline-offset: 1px;
    }

    .picker-btn.selected {
      background: var(--calendar-picker-selected-bg, #3b82f6);
      color: var(--calendar-picker-selected-text, white);
    }

    .picker-btn.today-month,
    .picker-btn.today-year {
      font-weight: 700;
      text-decoration: underline;
      text-decoration-color: var(--calendar-today-btn-color, #3b82f6);
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-btn,
      .day,
      .picker-btn,
      .month-year-btn,
      .today-btn {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this._internals = this.attachInternals();

    this.value = '';
    this.min = '';
    this.max = '';
    this.disabledDates = [];
    this.holidays = [];
    this.firstDayOfWeek = 1; // Monday
    this.showWeekNumbers = false;
    this.locale = 'en';
    this.mode = 'single';
    this.valueStart = '';
    this.valueEnd = '';
    this.name = '';
    this.disabled = false;
    this.readonly = false;

    const today = new Date();
    this._currentMonth = today.getMonth();
    this._currentYear = today.getFullYear();
    this._view = 'days';
    this._decadeStart = Math.floor(today.getFullYear() / 10) * 10;
    this._focusedDate = null;
    this._selectingEnd = false;
    this._hoveredDate = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseSlottedContent();
    if (this.value) {
      const date = this._parseLocalDate(this.value);
      if (date) {
        this._currentMonth = date.getMonth();
        this._currentYear = date.getFullYear();
        this._focusedDate = this.value;
      }
    } else if (this.valueStart) {
      const date = this._parseLocalDate(this.valueStart);
      if (date) {
        this._currentMonth = date.getMonth();
        this._currentYear = date.getFullYear();
        this._focusedDate = this.valueStart;
      }
    }
    this._updateFormValue();
  }

  // ─── Form association ──────────────────────────────────────────────────────

  _updateFormValue() {
    if (!this._internals) return;
    if (this.disabled) {
      this._internals.setFormValue(null);
      return;
    }
    if (this.mode === 'range') {
      if (this.valueStart && this.valueEnd) {
        this._internals.setFormValue(`${this.valueStart}/${this.valueEnd}`);
      } else {
        this._internals.setFormValue(null);
      }
    } else {
      this._internals.setFormValue(this.value || null);
    }
  }

  // ─── Date parsing ──────────────────────────────────────────────────────────

  /**
   * Parse an ISO date string (YYYY-MM-DD) in LOCAL time (no UTC shift).
   * @param {string} isoString
   * @returns {Date|null}
   */
  _parseLocalDate(isoString) {
    if (!isoString) return null;
    const parts = isoString.split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return new Date(y, m - 1, d);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _formatDateString(year, month, day) {
    const y = String(year);
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  _getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  _getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return (day - this.firstDayOfWeek + 7) % 7;
  }

  _getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  _getMonthHeaderLabel() {
    const date = new Date(this._currentYear, this._currentMonth);
    return date.toLocaleDateString(this.locale, { month: 'long', year: 'numeric' });
  }

  /** @deprecated alias kept for backward compat with tests */
  _getMonthName() {
    return this._getMonthHeaderLabel();
  }

  /**
   * Returns 7 weekday names starting from firstDayOfWeek.
   * Uses Jan 1, 2023 which is a known Sunday as anchor.
   */
  _getWeekdayNames() {
    const days = [];
    // Jan 1, 2023 is a Sunday (day 0)
    const sunday = new Date(2023, 0, 1);
    for (let i = 0; i < 7; i++) {
      const dayIndex = (this.firstDayOfWeek + i) % 7;
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + dayIndex);
      days.push(date.toLocaleDateString(this.locale, { weekday: 'short' }));
    }
    return days;
  }

  _isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  }

  _isSelected(year, month, day) {
    if (this.mode === 'range') return false;
    if (!this.value) return false;
    const selected = this._parseLocalDate(this.value);
    if (!selected) return false;
    return (
      selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day
    );
  }

  _isDisabled(year, month, day) {
    const dateStr = this._formatDateString(year, month, day);
    if (this.disabledDates.includes(dateStr)) return true;
    const date = new Date(year, month, day);
    if (this.min) {
      const minDate = this._parseLocalDate(this.min);
      if (minDate && date < minDate) return true;
    }
    if (this.max) {
      const maxDate = this._parseLocalDate(this.max);
      if (maxDate && date > maxDate) return true;
    }
    return false;
  }

  _isHoliday(year, month, day) {
    const dateStr = this._formatDateString(year, month, day);
    return this.holidays.some((h) => h.date === dateStr);
  }

  _getHolidayTitle(year, month, day) {
    const dateStr = this._formatDateString(year, month, day);
    const holiday = this.holidays.find((h) => h.date === dateStr);
    return holiday?.title || '';
  }

  // ─── Range helpers ─────────────────────────────────────────────────────────

  _isRangeStart(year, month, day) {
    if (this.mode !== 'range' || !this.valueStart) return false;
    const d = this._parseLocalDate(this.valueStart);
    if (!d) return false;
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  }

  _isRangeEnd(year, month, day) {
    if (this.mode !== 'range' || !this.valueEnd) return false;
    const d = this._parseLocalDate(this.valueEnd);
    if (!d) return false;
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  }

  _isInRange(year, month, day) {
    if (this.mode !== 'range' || !this.valueStart || !this.valueEnd) return false;
    const start = this._parseLocalDate(this.valueStart);
    const end = this._parseLocalDate(this.valueEnd);
    if (!start || !end) return false;
    const d = new Date(year, month, day);
    return d > start && d < end;
  }

  _isRangeHover(year, month, day) {
    if (this.mode !== 'range' || !this._selectingEnd || !this.valueStart || !this._hoveredDate)
      return false;
    const start = this._parseLocalDate(this.valueStart);
    const hovered = this._parseLocalDate(this._hoveredDate);
    if (!start || !hovered) return false;
    const d = new Date(year, month, day);
    const rangeStart = start <= hovered ? start : hovered;
    const rangeEnd = start <= hovered ? hovered : start;
    return d > rangeStart && d < rangeEnd;
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  _prevMonth() {
    if (this._currentMonth === 0) {
      this._currentMonth = 11;
      this._currentYear--;
    } else {
      this._currentMonth--;
    }
    this._dispatchMonthChange();
  }

  _nextMonth() {
    if (this._currentMonth === 11) {
      this._currentMonth = 0;
      this._currentYear++;
    } else {
      this._currentMonth++;
    }
    this._dispatchMonthChange();
  }

  _prevDecade() {
    this._decadeStart -= 10;
  }

  _nextDecade() {
    this._decadeStart += 10;
  }

  _dispatchMonthChange() {
    this.dispatchEvent(
      new CustomEvent('month-change', {
        detail: { month: this._currentMonth, year: this._currentYear },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Navigate to a specific month/year */
  goToMonth(year, month) {
    this._currentYear = year;
    this._currentMonth = month;
    this._dispatchMonthChange();
    this.requestUpdate();
  }

  /** Navigate to today */
  goToToday() {
    const today = new Date();
    this._view = 'days';
    this.goToMonth(today.getFullYear(), today.getMonth());
    this._focusedDate = this._formatDateString(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  }

  // ─── View switching ────────────────────────────────────────────────────────

  _switchView(view) {
    this._view = view;
    if (view === 'years') {
      this._decadeStart = Math.floor(this._currentYear / 10) * 10;
    }
    this.dispatchEvent(
      new CustomEvent('view-change', {
        detail: { view },
        bubbles: true,
        composed: true,
      })
    );
  }

  _selectMonth(monthIndex) {
    this._currentMonth = monthIndex;
    this._view = 'days';
    this._dispatchMonthChange();
  }

  _selectYear(year) {
    this._currentYear = year;
    this._view = 'months';
  }

  // ─── Date selection ────────────────────────────────────────────────────────

  _selectDate(year, month, day) {
    if (this.disabled || this.readonly) return;
    if (this._isDisabled(year, month, day)) return;

    const dateStr = this._formatDateString(year, month, day);
    const dateObj = new Date(year, month, day);

    if (this.mode === 'range') {
      if (!this._selectingEnd || !this.valueStart) {
        // First click: set start
        this.valueStart = dateStr;
        this.valueEnd = '';
        this._selectingEnd = true;
        this._hoveredDate = null;
      } else {
        // Second click: set end, auto-swap if needed
        let start = this.valueStart;
        let end = dateStr;
        const startObj = this._parseLocalDate(start);
        const endObj = dateObj;
        if (endObj < startObj) {
          [start, end] = [end, start];
        }
        this.valueStart = start;
        this.valueEnd = end;
        this._selectingEnd = false;
        this._hoveredDate = null;
        this._updateFormValue();
        this.dispatchEvent(
          new CustomEvent('range-select', {
            detail: {
              start: this.valueStart,
              end: this.valueEnd,
              startObj: this._parseLocalDate(this.valueStart),
              endObj: this._parseLocalDate(this.valueEnd),
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    } else {
      this.value = dateStr;
      this._focusedDate = dateStr;
      this._updateFormValue();
      this.dispatchEvent(
        new CustomEvent('date-select', {
          detail: {
            date: this.value,
            dateObj,
            holiday: this._isHoliday(year, month, day)
              ? this._getHolidayTitle(year, month, day)
              : null,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // ─── Keyboard navigation ───────────────────────────────────────────────────

  _handleKeyDown(e) {
    if (this._view !== 'days') {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (this._view === 'years') this._view = 'months';
        else if (this._view === 'months') this._view = 'days';
      }
      return;
    }

    const focused = this._focusedDate ? this._parseLocalDate(this._focusedDate) : null;
    if (!focused) return;

    let newDate = null;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newDate = new Date(focused);
        newDate.setDate(focused.getDate() - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newDate = new Date(focused);
        newDate.setDate(focused.getDate() + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newDate = new Date(focused);
        newDate.setDate(focused.getDate() - 7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newDate = new Date(focused);
        newDate.setDate(focused.getDate() + 7);
        break;
      case 'Home':
        e.preventDefault();
        newDate = new Date(focused);
        // Move to start of week
        {
          const dayOfWeek = (focused.getDay() - this.firstDayOfWeek + 7) % 7;
          newDate.setDate(focused.getDate() - dayOfWeek);
        }
        break;
      case 'End':
        e.preventDefault();
        newDate = new Date(focused);
        // Move to end of week
        {
          const dayOfWeek = (focused.getDay() - this.firstDayOfWeek + 7) % 7;
          newDate.setDate(focused.getDate() + (6 - dayOfWeek));
        }
        break;
      case 'PageUp':
        e.preventDefault();
        newDate = new Date(focused);
        if (e.shiftKey) {
          newDate.setFullYear(focused.getFullYear() - 1);
        } else {
          newDate.setMonth(focused.getMonth() - 1);
        }
        break;
      case 'PageDown':
        e.preventDefault();
        newDate = new Date(focused);
        if (e.shiftKey) {
          newDate.setFullYear(focused.getFullYear() + 1);
        } else {
          newDate.setMonth(focused.getMonth() + 1);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!this._isDisabled(focused.getFullYear(), focused.getMonth(), focused.getDate())) {
          this._selectDate(focused.getFullYear(), focused.getMonth(), focused.getDate());
        }
        return;
      case 'Escape':
        e.preventDefault();
        if (this._selectingEnd) {
          this._selectingEnd = false;
          this._hoveredDate = null;
        }
        return;
      default:
        return;
    }

    if (newDate) {
      const newStr = this._formatDateString(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
      );
      this._focusedDate = newStr;
      // If new date is in a different month, navigate there
      if (
        newDate.getFullYear() !== this._currentYear ||
        newDate.getMonth() !== this._currentMonth
      ) {
        this._currentYear = newDate.getFullYear();
        this._currentMonth = newDate.getMonth();
        this._dispatchMonthChange();
      }
      // Focus the button after render
      this.updateComplete.then(() => this._focusByDate(newStr));
    }
  }

  _focusByDate(dateStr) {
    const btn = this.shadowRoot?.querySelector(`button.day[data-date="${dateStr}"]`);
    btn?.focus();
  }

  // ─── Slot parsing ──────────────────────────────────────────────────────────

  /** Parse slotted elements for holidays and disabled dates */
  _parseSlottedContent() {
    const holidayElements = this.querySelectorAll('calendar-holiday');
    if (holidayElements.length > 0) {
      this.holidays = Array.from(holidayElements)
        .map((el) => ({
          date: el.getAttribute('date'),
          title: el.getAttribute('title') || '',
        }))
        .filter((h) => h.date);
    }

    const disabledElements = this.querySelectorAll('disabled-date');
    if (disabledElements.length > 0) {
      this.disabledDates = Array.from(disabledElements)
        .map((el) => el.getAttribute('date'))
        .filter(Boolean);
    }
  }

  // ─── Rendering ────────────────────────────────────────────────────────────

  _renderHeader() {
    if (this._view === 'months') {
      return html`
        <div class="header">
          <button
            class="nav-btn"
            @click="${() => {
              this._currentYear--;
            }}"
            aria-label="Previous year"
          >
            ◀
          </button>
          <div class="header-center">
            <button
              class="month-year-btn"
              @click="${() => this._switchView('years')}"
              aria-live="polite"
            >
              ${this._currentYear}
            </button>
          </div>
          <button
            class="nav-btn"
            @click="${() => {
              this._currentYear++;
            }}"
            aria-label="Next year"
          >
            ▶
          </button>
        </div>
      `;
    }

    if (this._view === 'years') {
      return html`
        <div class="header">
          <button class="nav-btn" @click="${this._prevDecade}" aria-label="Previous decade">
            ◀
          </button>
          <div class="header-center">
            <span class="month-year-btn" aria-live="polite">
              ${this._decadeStart}–${this._decadeStart + 9}
            </span>
          </div>
          <button class="nav-btn" @click="${this._nextDecade}" aria-label="Next decade">▶</button>
        </div>
      `;
    }

    // Days view
    return html`
      <div class="header">
        <button class="nav-btn" @click="${this._prevMonth}" aria-label="Previous month">◀</button>
        <div class="header-center">
          <button
            class="month-year-btn month-year"
            @click="${() => this._switchView('months')}"
            aria-live="polite"
            aria-label="Switch to month view"
          >
            ${this._getMonthHeaderLabel()}
          </button>
          <button class="today-btn" @click="${this.goToToday}" aria-label="Go to today">
            Today
          </button>
        </div>
        <button class="nav-btn" @click="${this._nextMonth}" aria-label="Next month">▶</button>
      </div>
    `;
  }

  _renderMonthsGrid() {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const label = new Date(this._currentYear, i, 1).toLocaleDateString(this.locale, {
        month: 'short',
      });
      const isSelected = i === this._currentMonth;
      const isCurrentMonth = i === today.getMonth() && this._currentYear === today.getFullYear();
      months.push(html`
        <button
          role="gridcell"
          class="picker-btn ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'today-month' : ''}"
          aria-selected="${isSelected}"
          @click="${() => this._selectMonth(i)}"
        >
          ${label}
        </button>
      `);
    }

    return html`
      <div role="grid" aria-label="Month picker">
        <div role="row" class="picker-grid">${months}</div>
      </div>
    `;
  }

  _renderYearsGrid() {
    const today = new Date();
    const years = [];
    for (let i = 0; i < 12; i++) {
      const year = this._decadeStart + i;
      const isSelected = year === this._currentYear;
      const isCurrentYear = year === today.getFullYear();
      years.push(html`
        <button
          role="gridcell"
          class="picker-btn ${isSelected ? 'selected' : ''} ${isCurrentYear ? 'today-year' : ''}"
          aria-selected="${isSelected}"
          @click="${() => this._selectYear(year)}"
        >
          ${year}
        </button>
      `);
    }

    return html`
      <div role="grid" aria-label="Year picker">
        <div role="row" class="picker-grid">${years}</div>
      </div>
    `;
  }

  _renderDaysView() {
    const weekdays = this._getWeekdayNames();
    const daysInMonth = this._getDaysInMonth(this._currentYear, this._currentMonth);
    const firstDay = this._getFirstDayOfMonth(this._currentYear, this._currentMonth);
    const prevMonthDays = this._getDaysInMonth(
      this._currentMonth === 0 ? this._currentYear - 1 : this._currentYear,
      this._currentMonth === 0 ? 11 : this._currentMonth - 1
    );

    const prevMonth = this._currentMonth === 0 ? 11 : this._currentMonth - 1;
    const prevYear = this._currentMonth === 0 ? this._currentYear - 1 : this._currentYear;
    const nextMonth = this._currentMonth === 11 ? 0 : this._currentMonth + 1;
    const nextYear = this._currentMonth === 11 ? this._currentYear + 1 : this._currentYear;

    // Build all cells as { year, month, day, otherMonth }
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ year: prevYear, month: prevMonth, day: prevMonthDays - i, otherMonth: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ year: this._currentYear, month: this._currentMonth, day: d, otherMonth: false });
    }

    let nextDay = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ year: nextYear, month: nextMonth, day: nextDay++, otherMonth: true });
    }

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    // Focused date string
    const focusedStr = this._focusedDate;

    const tableClass = `days-table days ${this.showWeekNumbers ? 'with-week-numbers' : ''}`.trim();

    return html`
      <table
        class="${tableClass}"
        role="grid"
        aria-label="${this._getMonthHeaderLabel()}"
        @keydown="${this._handleKeyDown}"
      >
        <thead>
          <tr role="row">
            ${this.showWeekNumbers
              ? html`<th scope="col" class="week-number-cell week-number" aria-label="Week number">
                  #
                </th>`
              : ''}
            ${weekdays.map(
              (d) => html`
                <th scope="col" role="columnheader" class="weekday" abbr="${d}" aria-label="${d}">
                  ${d}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${weeks.map((week) => {
            const firstCellDate = new Date(week[0].year, week[0].month, week[0].day);
            const weekNum = this._getWeekNumber(firstCellDate);
            return html`
              <tr role="row">
                ${this.showWeekNumbers
                  ? html`<td
                      class="week-number-cell week-number"
                      role="rowheader"
                      aria-label="Week ${weekNum}"
                    >
                      ${weekNum}
                    </td>`
                  : ''}
                ${week.map((cell) => {
                  const { year, month, day, otherMonth } = cell;
                  const dateStr = this._formatDateString(year, month, day);
                  const isToday = this._isToday(year, month, day);
                  const isSelected = this._isSelected(year, month, day);
                  const isDisabled = this._isDisabled(year, month, day);
                  const isHoliday = this._isHoliday(year, month, day);
                  const holidayTitle = isHoliday ? this._getHolidayTitle(year, month, day) : '';
                  const isRangeStart = this._isRangeStart(year, month, day);
                  const isRangeEnd = this._isRangeEnd(year, month, day);
                  const inRange = this._isInRange(year, month, day);
                  const isRangeHover = this._isRangeHover(year, month, day);
                  const isFocused = focusedStr === dateStr;

                  const btnClasses = [
                    'day',
                    isToday ? 'today' : '',
                    isSelected ? 'selected' : '',
                    isDisabled ? 'disabled' : '',
                    isHoliday ? 'holiday' : '',
                    otherMonth ? 'other-month' : '',
                    isRangeStart ? 'range-start' : '',
                    isRangeEnd ? 'range-end' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const tdClasses = [
                    inRange ? 'in-range' : '',
                    isRangeStart && !isRangeEnd ? 'range-start' : '',
                    isRangeEnd && !isRangeStart ? 'range-end' : '',
                    isRangeStart && isRangeEnd ? 'range-start range-end' : '',
                    isRangeHover ? 'range-hover' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const ariaLabel =
                    new Date(year, month, day).toLocaleDateString(this.locale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }) + (holidayTitle ? ` — ${holidayTitle}` : '');

                  return html`
                    <td role="gridcell" class="${tdClasses}">
                      <button
                        class="${btnClasses}"
                        type="button"
                        data-date="${dateStr}"
                        aria-label="${ariaLabel}"
                        aria-selected="${isSelected || isRangeStart || isRangeEnd
                          ? 'true'
                          : 'false'}"
                        aria-current="${isToday ? 'date' : 'false'}"
                        aria-disabled="${isDisabled ? 'true' : 'false'}"
                        tabindex="${isFocused ? '0' : '-1'}"
                        title="${holidayTitle}"
                        @click="${() => {
                          if (!isDisabled) {
                            this._focusedDate = dateStr;
                            this._selectDate(year, month, day);
                          }
                        }}"
                        @mouseover="${() => {
                          if (this.mode === 'range' && this._selectingEnd) {
                            this._hoveredDate = dateStr;
                          }
                        }}"
                        @mouseout="${() => {
                          if (this.mode === 'range' && this._selectingEnd) {
                            this._hoveredDate = null;
                          }
                        }}"
                      >
                        ${day}
                      </button>
                    </td>
                  `;
                })}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  render() {
    return html`
      <div
        class="calendar"
        role="application"
        aria-label="Calendar"
        aria-disabled="${this.disabled ? 'true' : 'false'}"
        aria-readonly="${this.readonly ? 'true' : 'false'}"
      >
        ${this._renderHeader()} ${this._view === 'months' ? this._renderMonthsGrid() : ''}
        ${this._view === 'years' ? this._renderYearsGrid() : ''}
        ${this._view === 'days' ? this._renderDaysView() : ''}
      </div>
    `;
  }
}

customElements.define('calendar-inline', CalendarInline);
