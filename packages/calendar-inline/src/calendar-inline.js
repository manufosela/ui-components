import { LitElement, html, css } from 'lit';

/**
 * Inline calendar web component with horizontal scrolling.
 *
 * @element calendar-inline
 * @fires date-select - Fired when a date is selected
 * @fires month-change - Fired when month changes
 * @cssprop [--calendar-bg=#fff] - Background color
 * @cssprop [--calendar-text=#1f2937] - Text color
 * @cssprop [--calendar-accent=#3b82f6] - Accent color
 * @cssprop [--calendar-today=#dbeafe] - Today highlight
 * @cssprop [--calendar-selected=#3b82f6] - Selected color
 */
export class CalendarInline extends LitElement {
  static properties = {
    /** Selected date (Date object or ISO string) */
    value: { type: String },
    /** Minimum selectable date */
    min: { type: String },
    /** Maximum selectable date */
    max: { type: String },
    /** Disabled dates array */
    disabledDates: { type: Array, attribute: 'disabled-dates' },
    /** Holidays array [{date, title}] */
    holidays: { type: Array },
    /** First day of week (0=Sunday, 1=Monday) */
    firstDayOfWeek: { type: Number, attribute: 'first-day-of-week' },
    /** Show week numbers */
    showWeekNumbers: { type: Boolean, attribute: 'show-week-numbers' },
    /** Locale for formatting */
    locale: { type: String },
    /** Internal: current month being displayed */
    _currentMonth: { state: true },
    /** Internal: current year being displayed */
    _currentYear: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .calendar {
      background: var(--calendar-bg, #fff);
      border-radius: 12px;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 320px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .month-year {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--calendar-text, #1f2937);
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
    }

    .nav-btn:hover {
      background: #f1f5f9;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .weekdays.with-week-numbers {
      grid-template-columns: 2rem repeat(7, 1fr);
    }

    .weekday {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
      padding: 0.5rem 0;
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .days.with-week-numbers {
      grid-template-columns: 2rem repeat(7, 1fr);
    }

    .week-number {
      font-size: 0.7rem;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.875rem;
      cursor: pointer;
      transition:
        background-color 0.2s,
        color 0.2s;
      position: relative;
    }

    .day:hover:not(.disabled):not(.other-month) {
      background: #f1f5f9;
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
      color: #d1d5db;
    }

    .day.disabled {
      color: #e5e7eb;
      cursor: not-allowed;
    }

    .day.holiday::after {
      content: '';
      position: absolute;
      bottom: 2px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #ef4444;
    }

    .day.holiday.selected::after {
      background: white;
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-btn,
      .day {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.value = '';
    this.min = '';
    this.max = '';
    this.disabledDates = [];
    this.holidays = [];
    this.firstDayOfWeek = 1; // Monday
    this.showWeekNumbers = false;
    this.locale = 'en';

    const today = new Date();
    this._currentMonth = today.getMonth();
    this._currentYear = today.getFullYear();
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseSlottedContent();
    if (this.value) {
      const date = new Date(this.value);
      this._currentMonth = date.getMonth();
      this._currentYear = date.getFullYear();
    }
  }

  /** Parse slotted elements for holidays and disabled dates */
  _parseSlottedContent() {
    // Parse holiday elements
    const holidayElements = this.querySelectorAll('calendar-holiday');
    if (holidayElements.length > 0) {
      this.holidays = Array.from(holidayElements)
        .map((el) => ({
          date: el.getAttribute('date'),
          title: el.getAttribute('title') || '',
        }))
        .filter((h) => h.date);
    }

    // Parse disabled date elements
    const disabledElements = this.querySelectorAll('disabled-date');
    if (disabledElements.length > 0) {
      this.disabledDates = Array.from(disabledElements)
        .map((el) => el.getAttribute('date'))
        .filter(Boolean);
    }
  }

  _getMonthName() {
    const date = new Date(this._currentYear, this._currentMonth);
    return date.toLocaleDateString(this.locale, { month: 'long', year: 'numeric' });
  }

  _getWeekdayNames() {
    const days = [];
    const baseDate = new Date(2024, 0, this.firstDayOfWeek); // A Sunday in 2024
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      days.push(date.toLocaleDateString(this.locale, { weekday: 'short' }));
    }
    return days;
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

  _isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  }

  _isSelected(year, month, day) {
    if (!this.value) return false;
    const selected = new Date(this.value);
    return (
      selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day
    );
  }

  _formatDateString(year, month, day) {
    const y = String(year);
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  _isDisabled(year, month, day) {
    const dateStr = this._formatDateString(year, month, day);

    if (this.disabledDates.includes(dateStr)) return true;

    const date = new Date(year, month, day);
    if (this.min && date < new Date(this.min)) return true;
    if (this.max && date > new Date(this.max)) return true;

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

  _dispatchMonthChange() {
    this.dispatchEvent(
      new CustomEvent('month-change', {
        detail: { month: this._currentMonth, year: this._currentYear },
        bubbles: true,
        composed: true,
      })
    );
  }

  _selectDate(year, month, day) {
    if (this._isDisabled(year, month, day)) return;

    const date = new Date(year, month, day);
    this.value = this._formatDateString(year, month, day);

    this.dispatchEvent(
      new CustomEvent('date-select', {
        detail: {
          date: this.value,
          dateObj: date,
          holiday: this._isHoliday(year, month, day)
            ? this._getHolidayTitle(year, month, day)
            : null,
        },
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
    this.goToMonth(today.getFullYear(), today.getMonth());
  }

  _renderCalendarDays() {
    const daysInMonth = this._getDaysInMonth(this._currentYear, this._currentMonth);
    const firstDay = this._getFirstDayOfMonth(this._currentYear, this._currentMonth);
    const prevMonthDays = this._getDaysInMonth(
      this._currentMonth === 0 ? this._currentYear - 1 : this._currentYear,
      this._currentMonth === 0 ? 11 : this._currentMonth - 1
    );

    const days = [];
    let currentWeek = [];

    // Add week number placeholder
    if (this.showWeekNumbers) {
      const firstDayDate = new Date(this._currentYear, this._currentMonth, 1 - firstDay);
      currentWeek.push(html`<span class="week-number">${this._getWeekNumber(firstDayDate)}</span>`);
    }

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = this._currentMonth === 0 ? 11 : this._currentMonth - 1;
      const prevYear = this._currentMonth === 0 ? this._currentYear - 1 : this._currentYear;
      currentWeek.push(html`
        <span class="day other-month" @click="${() => this._selectDate(prevYear, prevMonth, day)}"
          >${day}</span
        >
      `);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = this._isToday(this._currentYear, this._currentMonth, day);
      const isSelected = this._isSelected(this._currentYear, this._currentMonth, day);
      const isDisabled = this._isDisabled(this._currentYear, this._currentMonth, day);
      const isHoliday = this._isHoliday(this._currentYear, this._currentMonth, day);
      const holidayTitle = isHoliday
        ? this._getHolidayTitle(this._currentYear, this._currentMonth, day)
        : '';

      const classes = [
        'day',
        isToday ? 'today' : '',
        isSelected ? 'selected' : '',
        isDisabled ? 'disabled' : '',
        isHoliday ? 'holiday' : '',
      ]
        .filter(Boolean)
        .join(' ');

      currentWeek.push(html`
        <span
          class="${classes}"
          title="${holidayTitle}"
          @click="${() => this._selectDate(this._currentYear, this._currentMonth, day)}"
          >${day}</span
        >
      `);

      if (currentWeek.length === (this.showWeekNumbers ? 8 : 7)) {
        days.push(...currentWeek);
        currentWeek = [];
        if (day < daysInMonth && this.showWeekNumbers) {
          const nextDate = new Date(this._currentYear, this._currentMonth, day + 1);
          currentWeek.push(html`<span class="week-number">${this._getWeekNumber(nextDate)}</span>`);
        }
      }
    }

    // Next month days
    const nextMonth = this._currentMonth === 11 ? 0 : this._currentMonth + 1;
    const nextYear = this._currentMonth === 11 ? this._currentYear + 1 : this._currentYear;
    let nextDay = 1;
    while (currentWeek.length < (this.showWeekNumbers ? 8 : 7)) {
      currentWeek.push(html`
        <span
          class="day other-month"
          @click="${() => this._selectDate(nextYear, nextMonth, nextDay)}"
          >${nextDay}</span
        >
      `);
      nextDay++;
    }
    days.push(...currentWeek);

    return days;
  }

  render() {
    const weekdays = this._getWeekdayNames();
    const gridClass = this.showWeekNumbers ? 'with-week-numbers' : '';

    return html`
      <div class="calendar">
        <div class="header">
          <button class="nav-btn" @click="${this._prevMonth}" aria-label="Previous month">◀</button>
          <span class="month-year">${this._getMonthName()}</span>
          <button class="nav-btn" @click="${this._nextMonth}" aria-label="Next month">▶</button>
        </div>

        <div class="weekdays ${gridClass}">
          ${this.showWeekNumbers ? html`<span class="weekday"></span>` : ''}
          ${weekdays.map((day) => html`<span class="weekday">${day}</span>`)}
        </div>

        <div class="days ${gridClass}">${this._renderCalendarDays()}</div>
      </div>
    `;
  }
}

customElements.define('calendar-inline', CalendarInline);
