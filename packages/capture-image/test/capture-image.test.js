import { html, fixture, expect } from '@open-wc/testing';
import '../src/capture-image.js';

describe('CaptureImage', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<capture-image></capture-image>`);
    expect(el).to.exist;
    expect(el.sizeX).to.equal(640);
    expect(el.sizeY).to.equal(480);
    expect(el.maskpercent).to.equal(30);
    expect(el.mask).to.equal(false);
  });

  it('accepts custom attributes', async () => {
    const el = await fixture(html`
      <capture-image size-x="320" size-y="240" maskpercent="20" mask></capture-image>
    `);
    expect(el.sizeX).to.equal(320);
    expect(el.sizeY).to.equal(240);
    expect(el.maskpercent).to.equal(20);
    expect(el.mask).to.equal(true);
  });

  it('renders video and snapshot canvas', async () => {
    const el = await fixture(html`<capture-image size-x="320" size-y="240"></capture-image>`);
    await el.updateComplete;
    const video = el.shadowRoot.querySelector('video');
    const canvas = el.shadowRoot.querySelector('canvas.snapshot');
    expect(video).to.exist;
    expect(canvas).to.exist;
  });

  it('renders snap/reset/save buttons', async () => {
    const el = await fixture(html`<capture-image></capture-image>`);
    await el.updateComplete;
    const buttons = el.shadowRoot.querySelectorAll('button');
    expect(buttons).to.have.lengthOf(2);
  });

  it('resetImage does not throw before firstUpdated completes', async () => {
    const el = await fixture(html`<capture-image></capture-image>`);
    expect(() => el.resetImage()).to.not.throw();
  });
});
