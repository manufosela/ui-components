import { css } from 'lit';

export const MarkedCalendarStyles = css`
  :host {
    display: block;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
    --calendar-bg: #f8fafc;
    --calendar-border: #e2e8f0;
    --cell-size: 1.25rem;
  }

  .calendar {
    background: var(--calendar-bg);
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 100%;
    overflow-x: auto;
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #1e293b;
  }

  /* Legend */
  .legend {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .legend-title {
    font-weight: 600;
    color: #64748b;
    font-size: 0.875rem;
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.625rem;
    border: 2px solid transparent;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }

  .legend-item:disabled {
    cursor: default;
  }

  .legend-item:not(:disabled):hover {
    border-color: #94a3b8;
  }

  .legend-item.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    background: var(--item-color);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .legend-label {
    font-size: 1rem;
  }

  /* Navigation */
  .navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .nav-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .nav-btn:hover {
    background: #e2e8f0;
  }

  .nav-title {
    font-size: 1.125rem;
    font-weight: 600;
    min-width: 150px;
    text-align: center;
  }

  .view-btn {
    margin-left: 0.5rem;
  }

  /* Year View */
  .year-view {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .days-header {
    display: flex;
    gap: 2px;
    padding-left: 2rem;
  }

  .day-number {
    width: var(--cell-size);
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    color: #64748b;
  }

  .months-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .month-row {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .month-label {
    width: 1.75rem;
    height: var(--cell-size);
    border: none;
    background: #3b82f6;
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .month-label:hover {
    background: #2563eb;
  }

  .month-days {
    display: flex;
    gap: 2px;
  }

  /* Day Cell */
  .day-cell {
    width: var(--cell-size);
    height: var(--cell-size);
    border-radius: 3px;
    background: var(--cell-bg, white);
    border: 1px solid var(--calendar-border);
    transition: all 0.15s;
  }

  .day-cell.clickable:not(.blocked) {
    cursor: pointer;
  }

  .day-cell.clickable:not(.blocked):hover {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .day-cell.blocked {
    cursor: not-allowed;
  }

  .day-cell.empty {
    background: transparent;
    border: none;
  }

  /* Month View */
  .month-view {
    max-width: 400px;
    margin: 0 auto;
  }

  .weekday-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 0.5rem;
  }

  .weekday {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    padding: 0.25rem;
  }

  .month-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .day-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .day-label {
    font-size: 0.75rem;
    color: #64748b;
  }

  .month-view .day-cell {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 6px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    :host {
      --cell-size: 1rem;
    }

    .calendar {
      padding: 1rem;
    }

    .title {
      font-size: 1.25rem;
    }

    .days-header {
      padding-left: 1.5rem;
    }

    .month-label {
      width: 1.5rem;
      font-size: 0.625rem;
    }

    .month-view .day-cell {
      width: 2rem;
      height: 2rem;
    }
  }
`;
