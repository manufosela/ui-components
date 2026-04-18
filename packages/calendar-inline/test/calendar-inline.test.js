import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/calendar-inline.js';

// Helper to format date without timezone issues
function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

describe('CalendarInline', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el).to.exist;
      expect(el.value).to.equal('');
      expect(el.min).to.equal('');
      expect(el.max).to.equal('');
      expect(el.firstDayOfWeek).to.equal(1);
      expect(el.showWeekNumbers).to.be.false;
      expect(el.locale).to.equal('en');
    });

    it('renders calendar container', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const calendar = el.shadowRoot.querySelector('.calendar');
      expect(calendar).to.exist;
    });

    it('renders header with navigation', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const header = el.shadowRoot.querySelector('.header');
      const navButtons = el.shadowRoot.querySelectorAll('.nav-btn');
      expect(header).to.exist;
      expect(navButtons.length).to.equal(2);
    });

    it('renders weekday headers', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const weekdays = el.shadowRoot.querySelectorAll('.weekday');
      expect(weekdays.length).to.equal(7);
    });

    it('renders day cells', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const days = el.shadowRoot.querySelectorAll('.day');
      expect(days.length).to.be.at.least(28);
    });

    it('renders month and year in header', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const monthYear = el.shadowRoot.querySelector('.month-year');
      expect(monthYear).to.exist;
      expect(monthYear.textContent).to.include(new Date().getFullYear().toString());
    });
  });

  describe('date selection', () => {
    it('selects date on click', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const day = el.shadowRoot.querySelector('.day:not(.other-month):not(.disabled)');
      day.click();
      expect(el.value).to.not.equal('');
    });

    it('fires date-select event', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const day = el.shadowRoot.querySelector('.day:not(.other-month):not(.disabled)');
      setTimeout(() => day.click());
      const event = await oneEvent(el, 'date-select');
      expect(event.detail).to.have.property('date');
      expect(event.detail).to.have.property('dateObj');
    });

    it('applies selected class to selected date', async () => {
      const today = new Date();
      const dateStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
      const el = await fixture(html`<calendar-inline value="${dateStr}"></calendar-inline>`);
      const selectedDay = el.shadowRoot.querySelector('.day.selected');
      expect(selectedDay).to.exist;
    });

    it('pre-selects date from value attribute', async () => {
      const el = await fixture(html`<calendar-inline value="2025-01-15"></calendar-inline>`);
      expect(el.value).to.equal('2025-01-15');
      expect(el._currentMonth).to.equal(0);
      expect(el._currentYear).to.equal(2025);
    });
  });

  describe('navigation', () => {
    it('navigates to previous month', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const initialMonth = el._currentMonth;
      const prevBtn = el.shadowRoot.querySelectorAll('.nav-btn')[0];
      prevBtn.click();
      await el.updateComplete;
      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(el._currentMonth).to.equal(expectedMonth);
    });

    it('navigates to next month', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const initialMonth = el._currentMonth;
      const nextBtn = el.shadowRoot.querySelectorAll('.nav-btn')[1];
      nextBtn.click();
      await el.updateComplete;
      const expectedMonth = initialMonth === 11 ? 0 : initialMonth + 1;
      expect(el._currentMonth).to.equal(expectedMonth);
    });

    it('fires month-change event on navigation', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const nextBtn = el.shadowRoot.querySelectorAll('.nav-btn')[1];
      setTimeout(() => nextBtn.click());
      const event = await oneEvent(el, 'month-change');
      expect(event.detail).to.have.property('month');
      expect(event.detail).to.have.property('year');
    });

    it('wraps year when going from January to December', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      el._prevMonth();
      expect(el._currentMonth).to.equal(11);
      expect(el._currentYear).to.equal(2024);
    });

    it('wraps year when going from December to January', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 11;
      el._currentYear = 2024;
      el._nextMonth();
      expect(el._currentMonth).to.equal(0);
      expect(el._currentYear).to.equal(2025);
    });

    it('goToMonth() navigates to specific month', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el.goToMonth(2025, 6);
      expect(el._currentMonth).to.equal(6);
      expect(el._currentYear).to.equal(2025);
    });

    it('goToToday() navigates to current month', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2020;
      el.goToToday();
      const today = new Date();
      expect(el._currentMonth).to.equal(today.getMonth());
      expect(el._currentYear).to.equal(today.getFullYear());
    });
  });

  describe('disabled dates', () => {
    it('disables dates before min', async () => {
      const today = new Date();
      const minDate = formatDate(today.getFullYear(), today.getMonth(), 15);
      const el = await fixture(html`<calendar-inline min="${minDate}"></calendar-inline>`);
      const disabledDays = el.shadowRoot.querySelectorAll('.day.disabled');
      expect(disabledDays.length).to.be.above(0);
    });

    it('disables dates after max', async () => {
      const today = new Date();
      const maxDate = formatDate(today.getFullYear(), today.getMonth(), 15);
      const el = await fixture(html`<calendar-inline max="${maxDate}"></calendar-inline>`);
      const disabledDays = el.shadowRoot.querySelectorAll('.day.disabled');
      expect(disabledDays.length).to.be.above(0);
    });

    it('disables specific dates from disabledDates array', async () => {
      const today = new Date();
      const disabled = formatDate(today.getFullYear(), today.getMonth(), 10);
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el.disabledDates = [disabled];
      await el.updateComplete;
      const isDisabled = el._isDisabled(today.getFullYear(), today.getMonth(), 10);
      expect(isDisabled).to.be.true;
    });

    it('prevents selection of disabled dates', async () => {
      const today = new Date();
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el.disabledDates = [formatDate(today.getFullYear(), today.getMonth(), 5)];
      await el.updateComplete;
      el._selectDate(today.getFullYear(), today.getMonth(), 5);
      expect(el.value).to.equal('');
    });
  });

  describe('holidays', () => {
    it('marks holidays with special class', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const today = new Date();
      el.holidays = [
        { date: formatDate(today.getFullYear(), today.getMonth(), 15), title: 'Test Holiday' },
      ];
      await el.updateComplete;
      const holidayDay = el.shadowRoot.querySelector('.day.holiday');
      expect(holidayDay).to.exist;
    });

    it('_isHoliday returns true for holiday dates', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el.holidays = [{ date: '2025-01-01', title: 'New Year' }];
      expect(el._isHoliday(2025, 0, 1)).to.be.true;
    });

    it('_isHoliday returns false for non-holiday dates', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el.holidays = [{ date: '2025-01-01', title: 'New Year' }];
      expect(el._isHoliday(2025, 0, 2)).to.be.false;
    });

    it('_getHolidayTitle returns holiday title', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el.holidays = [{ date: '2025-01-01', title: 'New Year' }];
      expect(el._getHolidayTitle(2025, 0, 1)).to.equal('New Year');
    });

    it('includes holiday title in date-select event', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const today = new Date();
      el.holidays = [
        { date: formatDate(today.getFullYear(), today.getMonth(), 20), title: 'Test Holiday' },
      ];
      el._currentMonth = today.getMonth();
      el._currentYear = today.getFullYear();
      await el.updateComplete;

      setTimeout(() => el._selectDate(today.getFullYear(), today.getMonth(), 20));
      const event = await oneEvent(el, 'date-select');
      expect(event.detail.holiday).to.equal('Test Holiday');
    });
  });

  describe('week numbers', () => {
    it('shows week numbers when enabled', async () => {
      const el = await fixture(html`<calendar-inline show-week-numbers></calendar-inline>`);
      const weekNumbers = el.shadowRoot.querySelectorAll('.week-number');
      expect(weekNumbers.length).to.be.above(0);
    });

    it('hides week numbers by default', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const weekNumbers = el.shadowRoot.querySelectorAll('.week-number');
      expect(weekNumbers.length).to.equal(0);
    });

    it('applies with-week-numbers class to grid', async () => {
      const el = await fixture(html`<calendar-inline show-week-numbers></calendar-inline>`);
      const daysGrid = el.shadowRoot.querySelector('.days');
      expect(daysGrid.classList.contains('with-week-numbers')).to.be.true;
    });

    it('calculates week numbers correctly', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      // ISO week 1 of 2025 starts on Dec 30, 2024
      const weekNum = el._getWeekNumber(new Date(2025, 0, 1));
      expect(weekNum).to.equal(1);
    });
  });

  describe('first day of week', () => {
    it('starts week on Monday by default', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el.firstDayOfWeek).to.equal(1);
    });

    it('starts week on Sunday when set to 0', async () => {
      const el = await fixture(html`<calendar-inline first-day-of-week="0"></calendar-inline>`);
      expect(el.firstDayOfWeek).to.equal(0);
    });

    it('generates correct weekday names for Monday start', async () => {
      const el = await fixture(
        html`<calendar-inline first-day-of-week="1" locale="en"></calendar-inline>`
      );
      const weekdays = el._getWeekdayNames();
      expect(weekdays[0]).to.include('Mon');
    });

    it('generates correct weekday names for Sunday start', async () => {
      const el = await fixture(
        html`<calendar-inline first-day-of-week="0" locale="en"></calendar-inline>`
      );
      const weekdays = el._getWeekdayNames();
      expect(weekdays[0]).to.include('Sun');
    });
  });

  describe('today highlighting', () => {
    it('highlights today with special class', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const todayCell = el.shadowRoot.querySelector('.day.today');
      expect(todayCell).to.exist;
    });

    it('_isToday returns true for current date', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const today = new Date();
      expect(el._isToday(today.getFullYear(), today.getMonth(), today.getDate())).to.be.true;
    });

    it('_isToday returns false for other dates', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const today = new Date();
      expect(el._isToday(today.getFullYear(), today.getMonth(), today.getDate() + 1)).to.be.false;
    });
  });

  describe('other month days', () => {
    it('shows days from previous month', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      // Force a month that doesn't start on the first day of week
      el._currentMonth = 0; // January 2025 starts on Wednesday
      el._currentYear = 2025;
      await el.updateComplete;
      const otherMonthDays = el.shadowRoot.querySelectorAll('.day.other-month');
      expect(otherMonthDays.length).to.be.above(0);
    });

    it('clicking other-month day selects that date', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      const otherMonthDay = el.shadowRoot.querySelector('.day.other-month');
      if (otherMonthDay) {
        otherMonthDay.click();
        expect(el.value).to.not.equal('');
      }
    });
  });

  describe('locale', () => {
    it('uses default locale en', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el.locale).to.equal('en');
    });

    it('accepts custom locale', async () => {
      const el = await fixture(html`<calendar-inline locale="es"></calendar-inline>`);
      expect(el.locale).to.equal('es');
    });

    it('formats month name according to locale', async () => {
      const el = await fixture(html`<calendar-inline locale="es"></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      const monthName = el._getMonthName();
      expect(monthName.toLowerCase()).to.include('enero');
    });
  });

  describe('utility methods', () => {
    it('_getDaysInMonth returns correct days', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el._getDaysInMonth(2025, 0)).to.equal(31); // January
      expect(el._getDaysInMonth(2025, 1)).to.equal(28); // February 2025
      expect(el._getDaysInMonth(2024, 1)).to.equal(29); // February 2024 (leap year)
      expect(el._getDaysInMonth(2025, 3)).to.equal(30); // April
    });

    it('_getFirstDayOfMonth returns correct offset', async () => {
      const el = await fixture(html`<calendar-inline first-day-of-week="1"></calendar-inline>`);
      // January 1, 2025 is Wednesday (day 3), offset from Monday (day 1) is 2
      const offset = el._getFirstDayOfMonth(2025, 0);
      expect(offset).to.equal(2);
    });

    it('_isSelected returns true for selected date', async () => {
      const el = await fixture(html`<calendar-inline value="2025-01-15"></calendar-inline>`);
      expect(el._isSelected(2025, 0, 15)).to.be.true;
    });

    it('_isSelected returns false when no value', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el._isSelected(2025, 0, 15)).to.be.false;
    });
  });

  describe('styling', () => {
    it('accepts CSS custom properties', async () => {
      const el = await fixture(html`
        <calendar-inline style="--calendar-accent: red;"></calendar-inline>
      `);
      expect(el).to.exist;
    });
  });

  // ─── New feature tests ────────────────────────────────────────────────────

  describe('_parseLocalDate', () => {
    it('parses ISO string without timezone shift', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const date = el._parseLocalDate('2025-03-15');
      expect(date).to.be.instanceOf(Date);
      expect(date.getFullYear()).to.equal(2025);
      expect(date.getMonth()).to.equal(2); // 0-based
      expect(date.getDate()).to.equal(15);
    });

    it('returns null for empty string', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el._parseLocalDate('')).to.be.null;
      expect(el._parseLocalDate(null)).to.be.null;
    });

    it('handles leap year dates correctly', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const date = el._parseLocalDate('2024-02-29');
      expect(date).to.be.instanceOf(Date);
      expect(date.getFullYear()).to.equal(2024);
      expect(date.getMonth()).to.equal(1);
      expect(date.getDate()).to.equal(29);
    });
  });

  describe('view navigation', () => {
    it('clicking month-year header switches to months view', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      expect(el._view).to.equal('days');
      const btn = el.shadowRoot.querySelector('.month-year-btn.month-year');
      btn.click();
      await el.updateComplete;
      expect(el._view).to.equal('months');
    });

    it('clicking a month cell returns to days view with correct month', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._switchView('months');
      await el.updateComplete;
      // Click the first month button (January, index 0)
      const monthBtns = el.shadowRoot.querySelectorAll('.picker-btn');
      monthBtns[0].click();
      await el.updateComplete;
      expect(el._view).to.equal('days');
      expect(el._currentMonth).to.equal(0);
    });

    it('clicking year button in months view switches to years view', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._switchView('months');
      await el.updateComplete;
      // In months view the header shows the year as a .month-year-btn button
      const yearBtn = el.shadowRoot.querySelector('.month-year-btn');
      yearBtn.click();
      await el.updateComplete;
      expect(el._view).to.equal('years');
    });

    it('clicking a year returns to months view with correct year', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._switchView('years');
      await el.updateComplete;
      const yearBtns = el.shadowRoot.querySelectorAll('.picker-btn');
      const targetYear = el._decadeStart + 3;
      yearBtns[3].click();
      await el.updateComplete;
      expect(el._view).to.equal('months');
      expect(el._currentYear).to.equal(targetYear);
    });

    it('Today button navigates to current month in days view', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2020;
      el._view = 'months';
      await el.updateComplete;
      // today-btn is only rendered in days view header, so switch first
      el._view = 'days';
      await el.updateComplete;
      const todayBtn = el.shadowRoot.querySelector('.today-btn');
      todayBtn.click();
      await el.updateComplete;
      const today = new Date();
      expect(el._view).to.equal('days');
      expect(el._currentMonth).to.equal(today.getMonth());
      expect(el._currentYear).to.equal(today.getFullYear());
    });

    it('Escape in days view while selecting range end cancels selection', async () => {
      const el = await fixture(html`<calendar-inline mode="range"></calendar-inline>`);
      // Start a range selection
      const day = el.shadowRoot.querySelector('.day:not(.other-month):not(.disabled)');
      day.click();
      await el.updateComplete;
      expect(el._selectingEnd).to.be.true;
      // Dispatch Escape on the table
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;
      expect(el._selectingEnd).to.be.false;
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowRight moves focus to next day', async () => {
      const el = await fixture(html`<calendar-inline value="2025-06-15"></calendar-inline>`);
      await el.updateComplete;
      const btn = el.shadowRoot.querySelector('button.day[data-date="2025-06-15"]');
      btn.focus();
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;
      expect(el._focusedDate).to.equal('2025-06-16');
    });

    it('ArrowLeft moves focus to previous day', async () => {
      const el = await fixture(html`<calendar-inline value="2025-06-15"></calendar-inline>`);
      await el.updateComplete;
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;
      expect(el._focusedDate).to.equal('2025-06-14');
    });

    it('ArrowDown moves focus to next week', async () => {
      const el = await fixture(html`<calendar-inline value="2025-06-15"></calendar-inline>`);
      await el.updateComplete;
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      expect(el._focusedDate).to.equal('2025-06-22');
    });

    it('PageDown navigates to next month', async () => {
      const el = await fixture(html`<calendar-inline value="2025-06-15"></calendar-inline>`);
      await el.updateComplete;
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
      await el.updateComplete;
      expect(el._currentMonth).to.equal(6); // July
      expect(el._currentYear).to.equal(2025);
    });

    it('Enter selects the focused date', async () => {
      const el = await fixture(html`<calendar-inline value="2025-06-15"></calendar-inline>`);
      await el.updateComplete;
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;
      expect(el.value).to.equal('2025-06-15');
    });

    it('Home moves focus to first day of current week', async () => {
      const el = await fixture(
        html`<calendar-inline value="2025-06-18" first-day-of-week="1"></calendar-inline>`
      );
      await el.updateComplete;
      const table = el.shadowRoot.querySelector('table.days-table');
      table.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await el.updateComplete;
      // June 18 is Wednesday; with Monday start, week starts on June 16
      expect(el._focusedDate).to.equal('2025-06-16');
    });
  });

  describe('range selection', () => {
    it('first click sets valueStart', async () => {
      const el = await fixture(html`<calendar-inline mode="range"></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      const day15 = el.shadowRoot.querySelector('button.day[data-date="2025-01-15"]');
      day15.click();
      await el.updateComplete;
      expect(el.valueStart).to.equal('2025-01-15');
      expect(el._selectingEnd).to.be.true;
    });

    it('second click sets valueEnd', async () => {
      const el = await fixture(html`<calendar-inline mode="range"></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      const day15 = el.shadowRoot.querySelector('button.day[data-date="2025-01-15"]');
      day15.click();
      await aTimeout(50);
      const day20 = el.shadowRoot.querySelector('button.day[data-date="2025-01-20"]');
      day20.click();
      await el.updateComplete;
      expect(el.valueEnd).to.equal('2025-01-20');
    });

    it('fires range-select event with start and end', async () => {
      const el = await fixture(html`<calendar-inline mode="range"></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      const day15 = el.shadowRoot.querySelector('button.day[data-date="2025-01-15"]');
      day15.click();
      await aTimeout(50);
      setTimeout(() => {
        const day20 = el.shadowRoot.querySelector('button.day[data-date="2025-01-20"]');
        day20.click();
      });
      const event = await oneEvent(el, 'range-select');
      expect(event.detail).to.have.property('start');
      expect(event.detail).to.have.property('end');
      expect(event.detail.start).to.equal('2025-01-15');
      expect(event.detail.end).to.equal('2025-01-20');
    });

    it('auto-swaps start and end when end is before start', async () => {
      const el = await fixture(html`<calendar-inline mode="range"></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      // Click day 20 first, then day 10 (reverse order)
      const day20 = el.shadowRoot.querySelector('button.day[data-date="2025-01-20"]');
      day20.click();
      await aTimeout(50);
      const day10 = el.shadowRoot.querySelector('button.day[data-date="2025-01-10"]');
      day10.click();
      await el.updateComplete;
      expect(el.valueStart).to.equal('2025-01-10');
      expect(el.valueEnd).to.equal('2025-01-20');
    });

    it('in-range class applied to td cells between start and end', async () => {
      const el = await fixture(
        html`<calendar-inline
          mode="range"
          value-start="2025-01-10"
          value-end="2025-01-20"
        ></calendar-inline>`
      );
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      const inRangeCells = el.shadowRoot.querySelectorAll('td.in-range');
      // Days 11–19 (9 days) should have in-range class
      expect(inRangeCells.length).to.equal(9);
    });

    it('single mode does NOT fire range-select', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      let rangeSelectFired = false;
      el.addEventListener('range-select', () => {
        rangeSelectFired = true;
      });
      const day15 = el.shadowRoot.querySelector('button.day[data-date="2025-01-15"]');
      day15.click();
      await aTimeout(50);
      expect(rangeSelectFired).to.be.false;
    });
  });

  describe('form association', () => {
    it('has formAssociated static property set to true', async () => {
      const { CalendarInline } = await import('../src/calendar-inline.js');
      expect(CalendarInline.formAssociated).to.be.true;
    });

    it('disabled prevents date selection', async () => {
      const el = await fixture(html`<calendar-inline disabled></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      el._selectDate(2025, 0, 15);
      expect(el.value).to.equal('');
    });

    it('readonly prevents date selection', async () => {
      const el = await fixture(html`<calendar-inline readonly></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      el._selectDate(2025, 0, 15);
      expect(el.value).to.equal('');
    });
  });

  describe('accessibility', () => {
    it('days grid is a table with role="grid"', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const grid = el.shadowRoot.querySelector('table[role="grid"]');
      expect(grid).to.exist;
    });

    it('day buttons have aria-label with full date text', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      el._currentMonth = 0;
      el._currentYear = 2025;
      await el.updateComplete;
      const day15 = el.shadowRoot.querySelector('button.day[data-date="2025-01-15"]');
      expect(day15).to.exist;
      const label = day15.getAttribute('aria-label');
      expect(label).to.be.a('string');
      expect(label.length).to.be.above(0);
    });

    it('today button has aria-current="date"', async () => {
      const el = await fixture(html`<calendar-inline></calendar-inline>`);
      const todayCell = el.shadowRoot.querySelector('button.day.today');
      expect(todayCell).to.exist;
      expect(todayCell.getAttribute('aria-current')).to.equal('date');
    });

    it('selected day has aria-selected="true"', async () => {
      const today = new Date();
      const dateStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
      const el = await fixture(html`<calendar-inline value="${dateStr}"></calendar-inline>`);
      const selectedBtn = el.shadowRoot.querySelector('button.day.selected');
      expect(selectedBtn).to.exist;
      expect(selectedBtn.getAttribute('aria-selected')).to.equal('true');
    });
  });
});
