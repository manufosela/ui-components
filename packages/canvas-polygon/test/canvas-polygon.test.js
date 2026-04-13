import { html, fixture, expect } from '@open-wc/testing';
import '../src/canvas-polygon.js';

describe('CanvasPolygon', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<canvas-polygon></canvas-polygon>`);
    expect(el).to.exist;
    expect(el.size).to.equal(400);
    expect(el.sides).to.equal(6);
    expect(el.lineWidth).to.equal(1);
    expect(el.bgColor).to.equal('transparent');
  });

  it('accepts custom attributes', async () => {
    const el = await fixture(html`
      <canvas-polygon size="200" sides="5" line-width="3" bg-color="#00e0b3"></canvas-polygon>
    `);
    expect(el.size).to.equal(200);
    expect(el.sides).to.equal(5);
    expect(el.lineWidth).to.equal(3);
    expect(el.bgColor).to.equal('#00e0b3');
  });

  it('throws when sides < 3', async () => {
    let error;
    try {
      await fixture(html`<canvas-polygon sides="2"></canvas-polygon>`);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });

  it('renders a canvas element', async () => {
    const el = await fixture(html`<canvas-polygon size="100"></canvas-polygon>`);
    const canvas = el.shadowRoot.querySelector('canvas');
    expect(canvas).to.exist;
    expect(canvas.width).to.equal(100);
    expect(canvas.height).to.equal(100);
  });

  it('computes default offset rotation for triangle', async () => {
    const el = await fixture(html`<canvas-polygon sides="3" size="100"></canvas-polygon>`);
    await el.updateComplete;
    expect(el.offsetRotation).to.not.equal(0);
  });

  it('passes accessibility audit', async () => {
    const el = await fixture(html`<canvas-polygon size="100"></canvas-polygon>`);
    await expect(el).to.be.accessible();
  });
});
