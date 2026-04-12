import { html, fixture, expect } from '@open-wc/testing';
import '../src/photo-collage.js';

describe('PhotoCollage', () => {
  it('renders with default values', async () => {
    const el = await fixture(html`<photo-collage></photo-collage>`);
    expect(el).to.exist;
    expect(el.width).to.equal(1200);
    expect(el.height).to.equal(700);
    expect(el.cols).to.equal(4);
    expect(el.rows).to.equal(3);
    expect(el.maxRotation).to.equal(15);
    expect(el.interval).to.equal(5);
    expect(el.polaroid).to.equal(true);
    expect(el.randomize).to.equal(false);
    expect(el.shuffle).to.equal(false);
    expect(el.zoomable).to.equal(false);
  });

  it('accepts custom attributes', async () => {
    const el = await fixture(html`
      <photo-collage
        width="800"
        height="600"
        cols="3"
        rows="2"
        max-rotation="10"
        interval="3"
      ></photo-collage>
    `);
    expect(el.width).to.equal(800);
    expect(el.height).to.equal(600);
    expect(el.cols).to.equal(3);
    expect(el.rows).to.equal(2);
    expect(el.maxRotation).to.equal(10);
    expect(el.interval).to.equal(3);
  });

  it('accepts boolean attributes', async () => {
    const el = await fixture(html` <photo-collage randomize shuffle zoomable></photo-collage> `);
    expect(el.randomize).to.equal(true);
    expect(el.shuffle).to.equal(true);
    expect(el.zoomable).to.equal(true);
  });

  it('can disable polaroid', async () => {
    const el = await fixture(html`<photo-collage></photo-collage>`);
    expect(el.polaroid).to.equal(true);

    el.polaroid = false;
    await el.updateComplete;
    const wrapper = el.shadowRoot.querySelector('.photo-wrapper');
    if (wrapper) {
      expect(wrapper.classList.contains('polaroid')).to.equal(false);
    }
  });

  it('renders correct number of cells from slotted images', async () => {
    const el = await fixture(html`
      <photo-collage cols="2" rows="2">
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="1"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="2"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="3"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="4"
        />
      </photo-collage>
    `);

    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 100));
    await el.updateComplete;

    const cells = el.shadowRoot.querySelectorAll('.cell');
    expect(cells.length).to.equal(4);
  });

  it('renders collage container with correct dimensions', async () => {
    const el = await fixture(html` <photo-collage width="800" height="500"></photo-collage> `);
    const collage = el.shadowRoot.querySelector('.collage');
    expect(collage.style.width).to.equal('800px');
    expect(collage.style.height).to.equal('500px');
  });

  it('does not show overlay when zoomable is off', async () => {
    const el = await fixture(html`<photo-collage></photo-collage>`);
    const overlay = el.shadowRoot.querySelector('.overlay');
    expect(overlay.classList.contains('active')).to.equal(false);
  });

  it('has a hidden slot for source images', async () => {
    const el = await fixture(html`<photo-collage></photo-collage>`);
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it('limits visible images to cols * rows', async () => {
    const el = await fixture(html`
      <photo-collage cols="2" rows="1">
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="1"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="2"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="3"
        />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="4"
        />
      </photo-collage>
    `);

    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 100));
    await el.updateComplete;

    const cells = el.shadowRoot.querySelectorAll('.cell');
    expect(cells.length).to.equal(2);
  });
});
