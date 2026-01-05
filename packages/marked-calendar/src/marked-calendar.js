import { LitElement, html } from 'lit';
import { MarkedCalendarStyles } from './marked-calendar.styles.js';

/**
 * Interactive calendar for tracking moods, habits, or marking dates.
 * Supports year and month views with customizable legends.
 *
 * @element marked-calendar
 * @fires marked-calendar-change - Fired when a day is marked. Detail: { year, month, day, value }
 * @fires marked-calendar-view-change - Fired when view changes. Detail: { view, year, month }
 */
export class MarkedCalendar extends LitElement {
  static properties = {
    /** Calendar title */
    name: { type: String },
    /** Language: 'en' or 'es' */
    lang: { type: String },
    /** View mode: 'year' or 'month' */
    view: { type: String },
    /** Current year */
    year: { type: Number },
    /** Current month (0-11) */
    month: { type: Number },
    /** Enable data saving to localStorage */
    saveData: { type: Boolean, attribute: 'save-data' },
    /** Highlight weekends */
    weekends: { type: Boolean },
    /** Allow view switching */
    changeView: { type: Boolean, attribute: 'change-view' },
    /** Currently selected legend state */
    _selectedState: { type: Number, state: true },
    /** Calendar data */
    _data: { type: Object, state: true }
  };

  static styles = [MarkedCalendarStyles];

  static MONTH_NAMES = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  };

  static DAY_NAMES = {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  };

  static DEFAULT_LEGEND = [
    { code: '#FFFFFF', label: '✕', title: 'Clear' },
    { code: '#22c55e', label: '😃', title: 'Great' },
    { code: '#3b82f6', label: '😊', title: 'Good' },
    { code: '#94a3b8', label: '😐', title: 'Okay' },
    { code: '#f59e0b', label: '😕', title: 'Meh' },
    { code: '#ef4444', label: '😢', title: 'Bad' }
  ];

  constructor() {
    super();
    const now = new Date();
    this.name = 'Year in Pixels';
    this.lang = 'en';
    this.view = 'year';
    this.year = now.getFullYear();
    this.month = now.getMonth();
    this.saveData = false;
    this.weekends = false;
    this.changeView = true;
    this._selectedState = null;
    this._data = {};
    this._legend = [...MarkedCalendar.DEFAULT_LEGEND];
    this._holidays = [];
    this._storageKey = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._storageKey = `marked-calendar-${this.id || 'default'}`;
    this._loadLegendFromLightDom();
    this._loadHolidaysFromLightDom();
    if (this.saveData) {
      this._loadData();
    }
  }

  _loadLegendFromLightDom() {
    const legendItems = [...this.querySelectorAll('#legend li')];
    if (legendItems.length > 0) {
      this._legend = [
        { code: '#FFFFFF', label: '✕', title: 'Clear' },
        ...legendItems.map(item => ({
          code: item.getAttribute('code') || '#ccc',
          label: item.getAttribute('label') || '•',
          title: item.textContent.trim()
        }))
      ];
    }
  }

  _loadHolidaysFromLightDom() {
    const holidayItems = [...this.querySelectorAll('#holidays li')];
    this._holidays = holidayItems.map(item => ({
      date: item.textContent.trim(),
      title: item.getAttribute('title') || 'Holiday'
    }));
  }

  _loadData() {
    try {
      const stored = localStorage.getItem(this._storageKey);
      if (stored) {
        this._data = JSON.parse(stored);
      }
    } catch (e) {
      this._data = {};
    }
  }

  _saveData() {
    if (this.saveData) {
      localStorage.setItem(this._storageKey, JSON.stringify(this._data));
    }
  }

  _getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  _getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  }

  _isWeekend(year, month, day) {
    const d = new Date(year, month, day).getDay();
    return d === 0 || d === 6;
  }

  _isHoliday(month, day) {
    const dateStr = `${day}/${month + 1}`;
    return this._holidays.find(h => h.date === dateStr);
  }

  _getDayValue(year, month, day) {
    return this._data[`${year}-${month}-${day}`];
  }

  _setDayValue(year, month, day, value) {
    const key = `${year}-${month}-${day}`;
    if (value === 0 || value === null) {
      delete this._data[key];
    } else {
      this._data[key] = value;
    }
    this._saveData();
    this.requestUpdate();

    this.dispatchEvent(new CustomEvent('marked-calendar-change', {
      detail: { year, month, day, value },
      bubbles: true,
      composed: true
    }));
  }

  _handleDayClick(year, month, day) {
    if (!this.saveData) return;
    if (this._selectedState === null) return;

    const isWeekendDay = this.weekends && this._isWeekend(year, month, day + 1);
    const holiday = this._isHoliday(month, day + 1);

    if (isWeekendDay || holiday) return;

    this._setDayValue(year, month, day, this._selectedState);
  }

  _handleLegendClick(index) {
    if (!this.saveData) return;
    this._selectedState = index;
  }

  _changeMonth(delta) {
    let newMonth = this.month + delta;
    let newYear = this.year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this.month = newMonth;
    this.year = newYear;

    this._dispatchViewChange();
  }

  _changeYear(delta) {
    this.year += delta;
    this._dispatchViewChange();
  }

  _toggleView() {
    this.view = this.view === 'year' ? 'month' : 'year';
    this._dispatchViewChange();
  }

  _switchToMonth(month) {
    this.month = month;
    this.view = 'month';
    this._dispatchViewChange();
  }

  _dispatchViewChange() {
    this.dispatchEvent(new CustomEvent('marked-calendar-view-change', {
      detail: { view: this.view, year: this.year, month: this.month },
      bubbles: true,
      composed: true
    }));
  }

  _renderLegend() {
    return html`
      <div class="legend">
        <div class="legend-title">${this.saveData ? 'Select:' : 'Legend:'}</div>
        <div class="legend-items">
          ${this._legend.map((item, index) => html`
            <button
              class="legend-item ${this._selectedState === index ? 'selected' : ''}"
              style="--item-color: ${item.code}"
              title="${item.title}"
              @click="${() => this._handleLegendClick(index)}"
              ?disabled="${!this.saveData}"
            >
              <span class="legend-color"></span>
              <span class="legend-label">${item.label}</span>
            </button>
          `)}
        </div>
      </div>
    `;
  }

  _renderNavigation() {
    const isYear = this.view === 'year';
    const title = isYear
      ? this.year
      : `${MarkedCalendar.MONTH_NAMES[this.lang][this.month]} ${this.year}`;

    return html`
      <nav class="navigation">
        <button class="nav-btn" @click="${() => isYear ? this._changeYear(-1) : this._changeMonth(-1)}">‹</button>
        <span class="nav-title">${title}</span>
        <button class="nav-btn" @click="${() => isYear ? this._changeYear(1) : this._changeMonth(1)}">›</button>
        ${this.changeView ? html`
          <button class="nav-btn view-btn" @click="${this._toggleView}">
            ${isYear ? '📅' : '📆'}
          </button>
        ` : ''}
      </nav>
    `;
  }

  _renderDayCell(year, month, day) {
    const value = this._getDayValue(year, month, day);
    const isWeekendDay = this._isWeekend(year, month, day + 1);
    const holiday = this._isHoliday(month, day + 1);
    const legend = value !== undefined ? this._legend[value] : null;

    let bgColor = 'transparent';
    let title = '';
    let isBlocked = false;

    if (this.weekends && isWeekendDay) {
      bgColor = '#e5e7eb';
      title = 'Weekend';
      isBlocked = true;
    } else if (holiday) {
      bgColor = '#d1d5db';
      title = holiday.title;
      isBlocked = true;
    } else if (legend) {
      bgColor = legend.code;
      title = legend.title;
    }

    return html`
      <div
        class="day-cell ${isBlocked ? 'blocked' : ''} ${this.saveData ? 'clickable' : ''}"
        style="--cell-bg: ${bgColor}"
        title="${title}"
        @click="${() => this._handleDayClick(year, month, day)}"
      ></div>
    `;
  }

  _renderYearView() {
    return html`
      <div class="year-view">
        <div class="days-header">
          ${Array.from({ length: 31 }, (_, i) => html`
            <div class="day-number">${i + 1}</div>
          `)}
        </div>
        <div class="months-container">
          ${Array.from({ length: 12 }, (_, monthIndex) => {
            const daysInMonth = this._getDaysInMonth(this.year, monthIndex);
            return html`
              <div class="month-row">
                <button
                  class="month-label"
                  @click="${() => this._switchToMonth(monthIndex)}"
                  title="${MarkedCalendar.MONTH_NAMES[this.lang][monthIndex]}"
                >
                  ${MarkedCalendar.MONTH_NAMES[this.lang][monthIndex].charAt(0)}
                </button>
                <div class="month-days">
                  ${Array.from({ length: daysInMonth }, (_, dayIndex) =>
                    this._renderDayCell(this.year, monthIndex, dayIndex)
                  )}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  _renderMonthView() {
    const daysInMonth = this._getDaysInMonth(this.year, this.month);
    const firstDay = this._getFirstDayOfMonth(this.year, this.month);
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(html`<div class="day-cell empty"></div>`);
    }

    // Day cells
    for (let day = 0; day < daysInMonth; day++) {
      days.push(html`
        <div class="day-wrapper">
          <span class="day-label">${day + 1}</span>
          ${this._renderDayCell(this.year, this.month, day)}
        </div>
      `);
    }

    return html`
      <div class="month-view">
        <div class="weekday-header">
          ${MarkedCalendar.DAY_NAMES[this.lang].map(name => html`
            <div class="weekday">${name}</div>
          `)}
        </div>
        <div class="month-grid">
          ${days}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="calendar">
        <h2 class="title">${this.name}</h2>
        ${this._renderLegend()}
        ${this._renderNavigation()}
        ${this.view === 'year' ? this._renderYearView() : this._renderMonthView()}
      </div>
    `;
  }

  // Public API

  /** Set marked days programmatically */
  setMarkedDays(days) {
    days.forEach(({ day, value }) => {
      const [d, m] = day.split('/').map(Number);
      this._data[`${this.year}-${m - 1}-${d - 1}`] = value;
    });
    this._saveData();
    this.requestUpdate();
  }

  /** Get all marked days */
  getMarkedDays() {
    return Object.entries(this._data).map(([key, value]) => {
      const [year, month, day] = key.split('-').map(Number);
      return { day: `${day + 1}/${month + 1}`, year, value };
    });
  }

  /** Clear all data */
  clearData() {
    this._data = {};
    this._saveData();
    this.requestUpdate();
  }
}

customElements.define('marked-calendar', MarkedCalendar);
