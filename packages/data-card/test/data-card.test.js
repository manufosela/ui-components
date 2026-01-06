import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/data-card.js';

describe('DataCard', () => {
  describe('rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<data-card></data-card>`);
      expect(el).to.exist;
      expect(el.shadowRoot.querySelector('.card')).to.exist;
    });

    it('renders title when provided', async () => {
      const el = await fixture(html`<data-card card-title="Test Title"></data-card>`);
      const title = el.shadowRoot.querySelector('.title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Test Title');
    });

    it('renders description when provided', async () => {
      const el = await fixture(html`<data-card description="Test description"></data-card>`);
      const desc = el.shadowRoot.querySelector('.description');
      expect(desc).to.exist;
      expect(desc.textContent).to.equal('Test description');
    });

    it('renders icon when provided', async () => {
      const el = await fixture(html`<data-card icon="🎉"></data-card>`);
      const iconContainer = el.shadowRoot.querySelector('.icon-container');
      expect(iconContainer).to.exist;
      expect(iconContainer.textContent.trim()).to.equal('🎉');
    });

    it('renders cover image when provided', async () => {
      const el = await fixture(
        html`<data-card img-cover="https://example.com/image.jpg"></data-card>`
      );
      const img = el.shadowRoot.querySelector('.cover img');
      expect(img).to.exist;
      expect(img.getAttribute('src')).to.equal('https://example.com/image.jpg');
    });

    it('renders group badge when provided', async () => {
      const el = await fixture(html`<data-card group="Category"></data-card>`);
      const badge = el.shadowRoot.querySelector('.group-badge');
      expect(badge).to.exist;
      expect(badge.textContent).to.equal('Category');
    });
  });

  describe('properties', () => {
    it('accepts card-title attribute', async () => {
      const el = await fixture(html`<data-card card-title="My Title"></data-card>`);
      expect(el.cardTitle).to.equal('My Title');
    });

    it('accepts description attribute', async () => {
      const el = await fixture(html`<data-card description="My Description"></data-card>`);
      expect(el.description).to.equal('My Description');
    });

    it('accepts url attribute', async () => {
      const el = await fixture(html`<data-card url="https://example.com"></data-card>`);
      expect(el.url).to.equal('https://example.com');
    });

    it('accepts newtab attribute', async () => {
      const el = await fixture(html`<data-card newtab></data-card>`);
      expect(el.newtab).to.be.true;
    });

    it('accepts icon attribute', async () => {
      const el = await fixture(html`<data-card icon="🔥"></data-card>`);
      expect(el.icon).to.equal('🔥');
    });

    it('accepts group attribute', async () => {
      const el = await fixture(html`<data-card group="News"></data-card>`);
      expect(el.group).to.equal('News');
    });

    it('accepts img-cover attribute', async () => {
      const el = await fixture(html`<data-card img-cover="image.jpg"></data-card>`);
      expect(el.imgCover).to.equal('image.jpg');
    });

    it('accepts cover-bg-color attribute', async () => {
      const el = await fixture(html`<data-card cover-bg-color="#ff0000"></data-card>`);
      expect(el.coverBgColor).to.equal('#ff0000');
    });

    it('accepts text-color attribute', async () => {
      const el = await fixture(html`<data-card text-color="#333333"></data-card>`);
      expect(el.textColor).to.equal('#333333');
    });
  });

  describe('link behavior', () => {
    it('renders as link when url is provided', async () => {
      const el = await fixture(html`<data-card url="https://example.com"></data-card>`);
      const link = el.shadowRoot.querySelector('a.card-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('https://example.com');
    });

    it('opens in new tab when newtab is true', async () => {
      const el = await fixture(html`<data-card url="https://example.com" newtab></data-card>`);
      const link = el.shadowRoot.querySelector('a.card-link');
      expect(link.getAttribute('target')).to.equal('_blank');
      expect(link.getAttribute('rel')).to.include('noopener');
    });

    it('opens in same tab when newtab is false', async () => {
      const el = await fixture(html`<data-card url="https://example.com"></data-card>`);
      const link = el.shadowRoot.querySelector('a.card-link');
      expect(link.getAttribute('target')).to.equal('_self');
    });

    it('does not render link when url is not provided', async () => {
      const el = await fixture(html`<data-card></data-card>`);
      const link = el.shadowRoot.querySelector('a.card-link');
      expect(link).to.be.null;
    });
  });

  describe('events', () => {
    it('fires data-card-click event when clicked', async () => {
      const el = await fixture(html`<data-card card-title="Clickable" group="Test"></data-card>`);
      const card = el.shadowRoot.querySelector('.card');

      setTimeout(() => card.click());
      const { detail } = await oneEvent(el, 'data-card-click');

      expect(detail.title).to.equal('Clickable');
      expect(detail.group).to.equal('Test');
    });
  });

  describe('slots', () => {
    it('renders default slot content', async () => {
      const el = await fixture(html`
        <data-card>
          <span class="custom-content">Custom</span>
        </data-card>
      `);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('renders footer slot content', async () => {
      const el = await fixture(html`
        <data-card>
          <button slot="footer">Action</button>
        </data-card>
      `);
      const footerSlot = el.shadowRoot.querySelector('slot[name="footer"]');
      expect(footerSlot).to.exist;
    });
  });

  describe('more info', () => {
    it('renders more info trigger when more-info is provided', async () => {
      const el = await fixture(html`<data-card more-info="https://example.com/info"></data-card>`);
      const trigger = el.shadowRoot.querySelector('.more-info-trigger');
      expect(trigger).to.exist;
    });

    it('does not render more info trigger when more-info is not provided', async () => {
      const el = await fixture(html`<data-card></data-card>`);
      const trigger = el.shadowRoot.querySelector('.more-info-trigger');
      expect(trigger).to.be.null;
    });

    it('has hidden more-info panel initially', async () => {
      const el = await fixture(html`<data-card more-info="https://example.com/info"></data-card>`);
      const panel = el.shadowRoot.querySelector('.more-info-panel');
      expect(panel).to.exist;
      expect(panel.classList.contains('visible')).to.be.false;
    });
  });

  describe('accessibility', () => {
    it('uses semantic article element', async () => {
      const el = await fixture(html`<data-card></data-card>`);
      const article = el.shadowRoot.querySelector('article');
      expect(article).to.exist;
    });

    it('uses heading element for title', async () => {
      const el = await fixture(html`<data-card card-title="Title"></data-card>`);
      const heading = el.shadowRoot.querySelector('h3.title');
      expect(heading).to.exist;
    });

    it('has alt text for cover image', async () => {
      const el = await fixture(
        html`<data-card card-title="My Card" img-cover="image.jpg"></data-card>`
      );
      const img = el.shadowRoot.querySelector('.cover img');
      expect(img.getAttribute('alt')).to.equal('My Card');
    });
  });
});
