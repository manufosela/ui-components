# @manufosela/calendar-inline

[![npm version](https://img.shields.io/npm/v/@manufosela/calendar-inline)](https://www.npmjs.com/package/@manufosela/calendar-inline)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**Date picker on steroids.** A full-featured inline calendar web component built with Lit 3. You get keyboard navigation, range selection, view switching (days / months / years), holiday markers, week numbers, localization, and native form association — all in a single custom element.

Built with [Lit](https://lit.dev/).

## Why not just `<input type="date">`?

The native date input is fine for quick forms but gives you no control over layout, styling, or UX. `calendar-inline` wraps the same concept and adds:

| Native `<input type="date">` | `calendar-inline` adds |
|---|---|
| Browser-styled, not customizable | ~20 CSS custom properties for full theming |
| No inline display | Always-visible, always-rendered calendar grid |
| No range selection | `mode="range"` with live hover preview |
| No holiday markers | Declarative `<calendar-holiday>` children |
| No view switching | Click month/year header to jump to month or year picker |
| No week numbers | `show-week-numbers` shows ISO week numbers |
| No disabled-dates API | `<disabled-date>` children or `disabled-dates` property |
| Limited localization | `locale` attribute, any BCP 47 tag |
| No keyboard grid nav | Full WAI-ARIA grid pattern with roving tabindex |
| No form association | `ElementInternals` — works in any `<form>` |

## Install

```bash
npm install @manufosela/calendar-inline
```

## Quick Start

### Basic

```html
<script type="module">
  import '@manufosela/calendar-inline';
</script>

<calendar-inline></calendar-inline>

<script>
  document.querySelector('calendar-inline').addEventListener('date-select', (e) => {
    console.log('Selected:', e.detail.date); // e.g. "2025-06-15"
  });
</script>
```

### Pre-selected date

```html
<calendar-inline value="2025-06-15"></calendar-inline>
```

### Range mode

```html
<calendar-inline mode="range"></calendar-inline>

<script>
  document.querySelector('calendar-inline').addEventListener('range-select', (e) => {
    console.log('From:', e.detail.start); // "2025-06-10"
    console.log('To:',   e.detail.end);   // "2025-06-20"
  });
</script>
```

Hover preview is built in — days between start and the cursor are highlighted before the user clicks the end date.

### Date constraints (min / max)

```html
<!-- Only allow dates in June 2025 -->
<calendar-inline min="2025-06-01" max="2025-06-30"></calendar-inline>
```

Days outside the range are rendered but not selectable.

### Holidays (declarative)

```html
<calendar-inline>
  <calendar-holiday date="2025-01-01" title="New Year's Day"></calendar-holiday>
  <calendar-holiday date="2025-12-25" title="Christmas Day"></calendar-holiday>
</calendar-inline>

<script>
  document.querySelector('calendar-inline').addEventListener('date-select', (e) => {
    if (e.detail.holiday) {
      console.log('Holiday:', e.detail.holiday); // "Christmas Day"
    }
  });
</script>
```

### Holidays (programmatic)

```javascript
const cal = document.querySelector('calendar-inline');
cal.holidays = [
  { date: '2025-01-01', title: 'New Year\'s Day' },
  { date: '2025-12-25', title: 'Christmas Day' },
];
```

### Disabled dates (declarative)

```html
<calendar-inline>
  <disabled-date date="2025-06-07"></disabled-date>
  <disabled-date date="2025-06-14"></disabled-date>
  <disabled-date date="2025-06-21"></disabled-date>
  <disabled-date date="2025-06-28"></disabled-date>
</calendar-inline>
```

### Month / year picker navigation

Click the **month name** in the header to jump to the month picker. Click the **year** to jump to the year / decade picker. Escape returns to the previous view.

```html
<!-- programmatically navigate to a specific month -->
<script>
  const cal = document.querySelector('calendar-inline');
  cal.goToMonth(2025, 11); // December 2025 (month is 0-based)
</script>
```

### Week numbers and locale

```html
<calendar-inline
  show-week-numbers
  first-day-of-week="1"
  locale="es"
></calendar-inline>
```

### Programmatic control

```javascript
const cal = document.querySelector('calendar-inline');

// Navigate
cal.goToMonth(2025, 5);  // June 2025
cal.goToToday();          // Jump back to the current month

// Expand / collapse (when the host uses an expand pattern)
cal.expand();
cal.collapse();
cal.toggle();
```

### Form integration

`calendar-inline` is a form-associated custom element. It participates in `<form>` validation and submission exactly like a native input.

```html
<form id="bookingForm">
  <label>
    Check-in date
    <calendar-inline name="checkin" required></calendar-inline>
  </label>
  <button type="submit">Book</button>
</form>

<script>
  document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log('Check-in:', data.get('checkin')); // "2025-06-15"
  });
</script>
```

---

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `String` | `''` | Selected date in ISO format (`YYYY-MM-DD`). Reflected. |
| `value-start` | `String` | `''` | Range start date (ISO). Used with `mode="range"`. Reflected. |
| `value-end` | `String` | `''` | Range end date (ISO). Used with `mode="range"`. Reflected. |
| `min` | `String` | `''` | Minimum selectable date (ISO). Dates before this are non-interactive. |
| `max` | `String` | `''` | Maximum selectable date (ISO). Dates after this are non-interactive. |
| `mode` | `String` | `'single'` | Selection mode: `'single'` or `'range'`. |
| `disabled-dates` | `Array` | `[]` | JSON array of ISO date strings to disable. Can also be set as a JS property (`disabledDates`). |
| `holidays` | `Array` | `[]` | Array of `{ date, title }` objects. Marks dates with a coloured dot and tooltip. |
| `first-day-of-week` | `Number` | `1` | First column of the week grid: `0` = Sunday, `1` = Monday. |
| `show-week-numbers` | `Boolean` | `false` | Show ISO week numbers in a leading column. |
| `locale` | `String` | `'en'` | BCP 47 locale tag used for weekday/month names and `aria-label` formatting. |
| `disabled` | `Boolean` | `false` | Disables the entire control (opacity + `pointer-events: none`). Reflected. |
| `readonly` | `Boolean` | `false` | Prevents date selection without visual dimming. Reflected. |
| `name` | `String` | `''` | Form field name. Reflected. Used for `FormData` submission. |

---

## Methods

| Method | Signature | Description |
|---|---|---|
| `goToMonth` | `(year: number, month: number) => void` | Navigate to a specific month. `month` is 0-based (0 = January). Fires `month-change`. |
| `goToToday` | `() => void` | Navigate to the current month and focus today's date. |
| `expand` | `() => void` | Expand the calendar (used when hosting component manages visibility). |
| `collapse` | `() => void` | Collapse the calendar. |
| `toggle` | `() => void` | Toggle expand/collapse. |

---

## Events

| Event | Detail | When |
|---|---|---|
| `date-select` | `{ date: string, dateObj: Date, holiday: string \| null }` | A date is selected in `single` mode. `holiday` is the holiday title or `null`. |
| `range-select` | `{ start: string, end: string, startObj: Date, endObj: Date }` | Both range endpoints are set in `range` mode. Dates are auto-sorted (start ≤ end). |
| `month-change` | `{ month: number, year: number }` | The displayed month changes (navigation or `goToMonth`). `month` is 0-based. |
| `view-change` | `{ view: 'days' \| 'months' \| 'years' }` | The calendar view changes between the day grid, month picker, and year picker. |

All events bubble and are composed (cross Shadow DOM boundary).

---

## CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--calendar-bg` | `#fff` | Calendar background color |
| `--calendar-text` | `#1f2937` | Primary text color |
| `--calendar-shadow` | `0 2px 8px rgba(0,0,0,0.1)` | Box shadow |
| `--calendar-today` | `#dbeafe` | Background for today's date |
| `--calendar-selected` | `#3b82f6` | Background for the selected date |
| `--calendar-hover-bg` | `#f1f5f9` | Day cell hover background |
| `--calendar-muted` | `#6b7280` | Muted text (weekday headers) |
| `--calendar-muted-strong` | `#9ca3af` | Strongly muted text (week numbers) |
| `--calendar-other-month` | `#d1d5db` | Color for days belonging to adjacent months |
| `--calendar-disabled` | `#e5e7eb` | Color for disabled days |
| `--calendar-holiday` | `#ef4444` | Holiday indicator dot color |
| `--calendar-holiday-selected` | `white` | Holiday dot color when the day is selected |
| `--calendar-range-bg` | `#dbeafe` | Background for days between range start and end |
| `--calendar-range-start-bg` | `#3b82f6` | Background for the range start day |
| `--calendar-range-end-bg` | `#3b82f6` | Background for the range end day |
| `--calendar-range-hover-bg` | `#eff6ff` | Background for hovered range preview days |
| `--calendar-picker-bg` | `#f8fafc` | Month / year picker grid background |
| `--calendar-picker-hover-bg` | `#e0f2fe` | Month / year picker cell hover background |
| `--calendar-picker-selected-bg` | `#3b82f6` | Month / year picker selected cell background |
| `--calendar-picker-selected-text` | `white` | Month / year picker selected cell text color |
| `--calendar-today-btn-color` | `#3b82f6` | "Today" button text color |

### Theming example

```css
calendar-inline {
  --calendar-bg: #1e1e2e;
  --calendar-text: #cdd6f4;
  --calendar-today: #313244;
  --calendar-selected: #cba6f7;
  --calendar-hover-bg: #313244;
  --calendar-range-bg: #45475a;
  --calendar-muted: #6c7086;
}
```

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `ArrowLeft` | Move focus one day back |
| `ArrowRight` | Move focus one day forward |
| `ArrowUp` | Move focus one week back |
| `ArrowDown` | Move focus one week forward |
| `Home` | Move focus to the first day of the current week |
| `End` | Move focus to the last day of the current week |
| `PageUp` | Move focus one month back |
| `PageDown` | Move focus one month forward |
| `Shift + PageUp` | Move focus one year back |
| `Shift + PageDown` | Move focus one year forward |
| `Enter` / `Space` | Select the focused date |
| `Escape` | Cancel range selection in progress; return to previous view (months → days, years → months) |

---

## Accessibility

`calendar-inline` implements the **WAI-ARIA Calendar / Date Picker (Grid)** pattern.

### ARIA roles and attributes

- The day grid uses `role="grid"` with `role="row"` and `role="gridcell"` children.
- Each day button carries `aria-label` with the full locale-formatted date (e.g. "15 June 2025 — Christmas Day").
- Today is marked with `aria-current="date"`.
- Selected days carry `aria-selected="true"`.
- Disabled days carry `aria-disabled="true"` (they remain in the DOM and focusable for navigation, but `Enter`/`Space` is ignored).
- The month/year picker grids use `role="grid"` with appropriate labels.
- The host element exposes `aria-disabled` and `aria-readonly` from the component's own attributes.

### Roving tabindex

Only one day button holds `tabindex="0"` at a time — the currently focused date. All other buttons have `tabindex="-1"`. Arrow-key navigation moves the `tabindex="0"` through the grid without requiring Tab presses, which is the standard grid keyboard interaction model.

### Live regions

When the user navigates to a different month, the grid's `aria-label` updates with the new month and year, which screen readers announce on re-focus.

### Form association

The element uses `ElementInternals` (`static formAssociated = true`) to integrate with the browser's form machinery. This means:

- It appears in `FormData` under its `name` attribute.
- It participates in form `reset` (clears `value`).
- It can carry `required`, `disabled`, and `readonly` semantics that the browser propagates to assistive technology.

No polyfill is required — `ElementInternals` is supported in all modern browsers (Chrome 77+, Firefox 93+, Safari 16.4+).

---

## License

Apache-2.0
