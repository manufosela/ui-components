import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/marked-calendar.js';

describe('MarkedCalendar', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      expect(el).to.exist;
      expect(el.view).to.equal('year');
      expect(el.lang).to.equal('en');
      expect(el.saveData).to.be.false;
    });

    it('renders title', async () => {
      const el = await fixture(html`<marked-calendar name="My Calendar"></marked-calendar>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title.textContent).to.equal('My Calendar');
    });

    it('renders default title when not provided', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title.textContent).to.equal('Year in Pixels');
    });

    it('renders legend items', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const legendItems = el.shadowRoot.querySelectorAll('.legend-item');
      expect(legendItems.length).to.equal(6); // Default legend has 6 items
    });

    it('renders navigation', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const nav = el.shadowRoot.querySelector('.navigation');
      expect(nav).to.exist;
    });
  });

  describe('Year View', () => {
    it('renders year view by default', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const yearView = el.shadowRoot.querySelector('.year-view');
      expect(yearView).to.exist;
    });

    it('renders 12 month rows', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const monthRows = el.shadowRoot.querySelectorAll('.month-row');
      expect(monthRows.length).to.equal(12);
    });

    it('renders 31 day headers', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const dayNumbers = el.shadowRoot.querySelectorAll('.day-number');
      expect(dayNumbers.length).to.equal(31);
    });

    it('renders month labels', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const monthLabels = el.shadowRoot.querySelectorAll('.month-label');
      expect(monthLabels.length).to.equal(12);
    });
  });

  describe('Month View', () => {
    it('renders month view when set', async () => {
      const el = await fixture(html`<marked-calendar view="month"></marked-calendar>`);
      const monthView = el.shadowRoot.querySelector('.month-view');
      expect(monthView).to.exist;
    });

    it('renders weekday headers', async () => {
      const el = await fixture(html`<marked-calendar view="month"></marked-calendar>`);
      const weekdays = el.shadowRoot.querySelectorAll('.weekday');
      expect(weekdays.length).to.equal(7);
    });

    it('shows correct month name in navigation', async () => {
      const el = await fixture(html`<marked-calendar view="month" .month="${0}"></marked-calendar>`);
      const navTitle = el.shadowRoot.querySelector('.nav-title');
      expect(navTitle.textContent).to.include('January');
    });
  });

  describe('Navigation', () => {
    it('changes year on navigation click', async () => {
      const el = await fixture(html`<marked-calendar .year="${2024}"></marked-calendar>`);
      const prevBtn = el.shadowRoot.querySelectorAll('.nav-btn')[0];
      prevBtn.click();
      await el.updateComplete;
      expect(el.year).to.equal(2023);
    });

    it('changes month on navigation click in month view', async () => {
      const el = await fixture(html`<marked-calendar view="month" .month="${5}"></marked-calendar>`);
      const prevBtn = el.shadowRoot.querySelectorAll('.nav-btn')[0];
      prevBtn.click();
      await el.updateComplete;
      expect(el.month).to.equal(4);
    });

    it('wraps month to previous year', async () => {
      const el = await fixture(html`<marked-calendar view="month" .month="${0}" .year="${2024}"></marked-calendar>`);
      const prevBtn = el.shadowRoot.querySelectorAll('.nav-btn')[0];
      prevBtn.click();
      await el.updateComplete;
      expect(el.month).to.equal(11);
      expect(el.year).to.equal(2023);
    });

    it('wraps month to next year', async () => {
      const el = await fixture(html`<marked-calendar view="month" .month="${11}" .year="${2024}"></marked-calendar>`);
      const nextBtn = el.shadowRoot.querySelectorAll('.nav-btn')[1];
      nextBtn.click();
      await el.updateComplete;
      expect(el.month).to.equal(0);
      expect(el.year).to.equal(2025);
    });

    it('switches to month view when month label clicked', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      const monthLabel = el.shadowRoot.querySelector('.month-label');
      monthLabel.click();
      await el.updateComplete;
      expect(el.view).to.equal('month');
    });

    it('toggles view when view button clicked', async () => {
      const el = await fixture(html`<marked-calendar change-view></marked-calendar>`);
      const viewBtn = el.shadowRoot.querySelector('.view-btn');
      viewBtn.click();
      await el.updateComplete;
      expect(el.view).to.equal('month');
    });
  });

  describe('Data Management', () => {
    it('allows clicking days when saveData is true', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      const dayCells = el.shadowRoot.querySelectorAll('.day-cell:not(.empty)');
      expect(dayCells[0].classList.contains('clickable')).to.be.true;
    });

    it('does not allow clicking when saveData is false', async () => {
      const el = await fixture(html`<marked-calendar></marked-calendar>`);
      el._selectedState = 1;
      const dayCells = el.shadowRoot.querySelectorAll('.day-cell:not(.empty)');
      const initialData = { ...el._data };
      dayCells[0].click();
      await el.updateComplete;
      expect(el._data).to.deep.equal(initialData);
    });

    it('selects legend item on click when saveData is true', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      const legendItem = el.shadowRoot.querySelectorAll('.legend-item')[1];
      legendItem.click();
      await el.updateComplete;
      expect(el._selectedState).to.equal(1);
    });

    it('marks day with selected state', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      el._selectedState = 2;
      const dayCells = el.shadowRoot.querySelectorAll('.day-cell.clickable');
      dayCells[0].click();
      await el.updateComplete;
      const keys = Object.keys(el._data);
      expect(keys.length).to.be.greaterThan(0);
    });

    it('clears day when state 0 is selected', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      el._data[`${el.year}-0-0`] = 2;
      el._selectedState = 0;
      await el.updateComplete;
      const dayCells = el.shadowRoot.querySelectorAll('.day-cell.clickable');
      dayCells[0].click();
      await el.updateComplete;
      expect(el._data[`${el.year}-0-0`]).to.be.undefined;
    });
  });

  describe('Events', () => {
    it('dispatches marked-calendar-change on day click', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      el._selectedState = 1;
      const dayCells = el.shadowRoot.querySelectorAll('.day-cell.clickable');

      setTimeout(() => dayCells[0].click());
      const event = await oneEvent(el, 'marked-calendar-change');

      expect(event.detail).to.have.property('year');
      expect(event.detail).to.have.property('month');
      expect(event.detail).to.have.property('day');
      expect(event.detail).to.have.property('value');
    });

    it('dispatches marked-calendar-view-change on view toggle', async () => {
      const el = await fixture(html`<marked-calendar change-view></marked-calendar>`);
      const viewBtn = el.shadowRoot.querySelector('.view-btn');

      setTimeout(() => viewBtn.click());
      const event = await oneEvent(el, 'marked-calendar-view-change');

      expect(event.detail.view).to.equal('month');
    });
  });

  describe('Language', () => {
    it('uses English month names by default', async () => {
      const el = await fixture(html`<marked-calendar view="month" .month="${0}"></marked-calendar>`);
      const navTitle = el.shadowRoot.querySelector('.nav-title');
      expect(navTitle.textContent).to.include('January');
    });

    it('uses Spanish month names when lang is es', async () => {
      const el = await fixture(html`<marked-calendar view="month" .month="${0}" lang="es"></marked-calendar>`);
      const navTitle = el.shadowRoot.querySelector('.nav-title');
      expect(navTitle.textContent).to.include('Enero');
    });

    it('uses Spanish day names when lang is es', async () => {
      const el = await fixture(html`<marked-calendar view="month" lang="es"></marked-calendar>`);
      const weekdays = el.shadowRoot.querySelectorAll('.weekday');
      expect(weekdays[0].textContent).to.equal('Lun');
    });
  });

  describe('Weekends', () => {
    it('highlights weekends when enabled', async () => {
      const el = await fixture(html`<marked-calendar weekends view="month" .month="${0}" .year="${2024}"></marked-calendar>`);
      await el.updateComplete;
      // January 2024 starts on Monday, so day 6 and 7 are weekend
      const blockedCells = el.shadowRoot.querySelectorAll('.day-cell.blocked');
      expect(blockedCells.length).to.be.greaterThan(0);
    });
  });

  describe('Custom Legend', () => {
    it('loads legend from light DOM', async () => {
      const el = await fixture(html`
        <marked-calendar>
          <ul id="legend">
            <li code="#ff0000" label="🔴">Red</li>
            <li code="#00ff00" label="🟢">Green</li>
          </ul>
        </marked-calendar>
      `);
      await el.updateComplete;
      // Should have Clear + 2 custom items = 3
      expect(el._legend.length).to.equal(3);
    });
  });

  describe('Public API', () => {
    it('setMarkedDays marks multiple days', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      el.setMarkedDays([
        { day: '1/1', value: 1 },
        { day: '2/1', value: 2 }
      ]);
      await el.updateComplete;
      expect(Object.keys(el._data).length).to.equal(2);
    });

    it('getMarkedDays returns marked days', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      el._data[`${el.year}-0-0`] = 1;
      el._data[`${el.year}-0-1`] = 2;
      const days = el.getMarkedDays();
      expect(days.length).to.equal(2);
    });

    it('clearData removes all data', async () => {
      const el = await fixture(html`<marked-calendar save-data></marked-calendar>`);
      el._data = { '2024-0-0': 1, '2024-0-1': 2 };
      el.clearData();
      expect(Object.keys(el._data).length).to.equal(0);
    });
  });
});
