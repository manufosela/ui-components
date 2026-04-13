import { html, fixture, expect } from '@open-wc/testing';
import '../src/element-card.js';

describe('ElementCard', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<element-card></element-card>`);
    expect(el).to.exist;
    expect(el.title).to.equal('Element-card');
    expect(el.description).to.equal('Description from element-card');
    expect(el.coverBgColor).to.equal('rgba(0, 0, 0, 0.7)');
    expect(el.textColor).to.equal('#FFF');
  });

  it('accepts custom attributes', async () => {
    const el = await fixture(html`
      <element-card
        title="Javascript"
        description="ES6+"
        cover-bgcolor="rgba(255,255,0,0.3)"
        text-color="#000"
      ></element-card>
    `);
    expect(el.title).to.equal('Javascript');
    expect(el.description).to.equal('ES6+');
    expect(el.coverBgColor).to.equal('rgba(255,255,0,0.3)');
    expect(el.textColor).to.equal('#000');
  });

  it('renders title and description in shadow DOM', async () => {
    const el = await fixture(html`
      <element-card title="Hello" description="World"></element-card>
    `);
    await el.updateComplete;
    const titleEl = el.shadowRoot.querySelector('.element-title');
    const descEl = el.shadowRoot.querySelector('.element-desc');
    expect(titleEl.textContent.trim()).to.equal('Hello');
    expect(descEl.textContent.trim()).to.equal('World');
  });

  it('renders slotted content inside element-ctr', async () => {
    const el = await fixture(html`
      <element-card>
        <div>Item A</div>
        <div>Item B</div>
      </element-card>
    `);
    await el.updateComplete;
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });
});
