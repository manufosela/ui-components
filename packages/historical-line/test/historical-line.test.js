import { html, fixture, expect } from '@open-wc/testing';
import '../src/historical-line.js';

describe('HistoricalLine', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<historical-line></historical-line>`);
    expect(el).to.exist;
    expect(el.title).to.equal('');
    expect(el.data).to.deep.equal([]);
  });

  it('renders title when provided', async () => {
    const el = await fixture(html`<historical-line title="My Timeline"></historical-line>`);
    const title = el.shadowRoot.querySelector('.title');
    expect(title).to.exist;
    expect(title.textContent).to.equal('My Timeline');
  });

  it('does not render title when not provided', async () => {
    const el = await fixture(html`<historical-line></historical-line>`);
    const title = el.shadowRoot.querySelector('.title');
    expect(title).to.be.null;
  });

  it('accepts start-year and end-year attributes', async () => {
    const el = await fixture(html`
      <historical-line start-year="2020" end-year="2024"></historical-line>
    `);
    expect(el.startYear).to.equal(2020);
    expect(el.endYear).to.equal(2024);
  });

  it('renders year headers', async () => {
    const el = await fixture(html`
      <historical-line start-year="2022" end-year="2024"></historical-line>
    `);
    await el.updateComplete;
    const years = el.shadowRoot.querySelectorAll('.year');
    expect(years.length).to.equal(3);
    expect(years[0].textContent).to.equal('2022');
    expect(years[1].textContent).to.equal('2023');
    expect(years[2].textContent).to.equal('2024');
  });

  it('accepts data property', async () => {
    const el = await fixture(html`
      <historical-line start-year="2020" end-year="2022"></historical-line>
    `);
    el.data = [
      { start: '1/1/2020', main: 'Event 1', desc: 'Description 1', bg: '#ff0000' },
      { start: '6/1/2021', main: 'Event 2', desc: 'Description 2', bg: '#00ff00' },
    ];
    await el.updateComplete;

    const items = el.shadowRoot.querySelectorAll('.item');
    expect(items.length).to.be.greaterThan(0);
  });

  it('renders items with correct colors', async () => {
    const el = await fixture(html`
      <historical-line start-year="2020" end-year="2021"></historical-line>
    `);
    el.data = [{ start: '1/1/2020', main: 'Test', desc: 'Desc', bg: '#ff0000', color: '#ffffff' }];
    await el.updateComplete;

    const item = el.shadowRoot.querySelector('.item[style*="background"]');
    expect(item).to.exist;
  });

  it('renders descriptions', async () => {
    const el = await fixture(html`
      <historical-line start-year="2020" end-year="2021"></historical-line>
    `);
    el.data = [{ start: '1/1/2020', main: 'Test', desc: 'My Description', bg: '#ff0000' }];
    await el.updateComplete;

    const descs = el.shadowRoot.querySelectorAll('.desc');
    expect(descs.length).to.be.greaterThan(0);
  });

  it('has correct container structure', async () => {
    const el = await fixture(html`
      <historical-line start-year="2020" end-year="2021"></historical-line>
    `);
    const table = el.shadowRoot.querySelector('.container');
    expect(table).to.exist;
    expect(table.tagName).to.equal('TABLE');
  });

  it('renders rule items for months', async () => {
    const el = await fixture(html`
      <historical-line start-year="2020" end-year="2020"></historical-line>
    `);
    await el.updateComplete;
    const ruleItems = el.shadowRoot.querySelectorAll('.rule-item');
    expect(ruleItems.length).to.equal(12); // 12 months
  });

  it('passes accessibility audit', async () => {
    const el = await fixture(html`
      <historical-line title="Accessible Timeline" start-year="2020" end-year="2022">
      </historical-line>
    `);
    await expect(el).to.be.accessible();
  });
});
