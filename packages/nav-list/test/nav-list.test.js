import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/nav-list.js';

describe('NavList', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<nav-list></nav-list>`);
      expect(el).to.exist;
      expect(el.listValues).to.deep.equal([]);
      expect(el.selected).to.be.null;
      expect(el.title).to.equal('');
      expect(el.fixed).to.be.false;
    });

    it('renders title when provided', async () => {
      const el = await fixture(html`<nav-list title="Menu"></nav-list>`);
      const title = el.shadowRoot.querySelector('.navlist__title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Menu');
    });

    it('does not render title when empty', async () => {
      const el = await fixture(html`<nav-list></nav-list>`);
      const title = el.shadowRoot.querySelector('.navlist__title');
      expect(title).to.be.null;
    });

    it('renders list items', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B', 'C']}"></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item');
      expect(items.length).to.equal(3);
    });

    it('renders items from light DOM', async () => {
      const el = await fixture(html`
        <nav-list>
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </nav-list>
      `);
      expect(el.listValues).to.deep.equal(['Option 1', 'Option 2', 'Option 3']);
    });
  });

  describe('Selection', () => {
    it('marks selected item', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B', 'C']}" selected="B"></nav-list>`);
      await el.updateComplete;
      const selectedItem = el.shadowRoot.querySelector('.navlist__item--selected');
      expect(selectedItem).to.exist;
      expect(selectedItem.textContent.trim()).to.equal('B');
    });

    it('updates selection on click', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B', 'C']}"></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item');
      items[1].click();
      await el.updateComplete;
      expect(el.selected).to.equal('B');
    });

    it('does not update selection when fixed', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B', 'C']}" fixed></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item');
      items[1].click();
      await el.updateComplete;
      expect(el.selected).to.be.null;
    });

    it('dispatches navlist-changed event on selection', async () => {
      const el = await fixture(html`<nav-list id="test" .listValues="${['A', 'B', 'C']}"></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item');

      setTimeout(() => items[1].click());
      const event = await oneEvent(el, 'navlist-changed');

      expect(event.detail.value).to.equal('B');
      expect(event.detail.pos).to.equal(1);
      expect(event.detail.id).to.equal('test');
    });
  });

  describe('Fixed mode', () => {
    it('has fixed property', async () => {
      const el = await fixture(html`<nav-list fixed></nav-list>`);
      expect(el.fixed).to.be.true;
    });

    it('disables radio buttons when fixed', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B']}" fixed></nav-list>`);
      const radios = el.shadowRoot.querySelectorAll('.navlist__radio');
      radios.forEach(radio => {
        expect(radio.disabled).to.be.true;
      });
    });

    it('removes clickable class when fixed', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B']}" fixed></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item--clickable');
      expect(items.length).to.equal(0);
    });
  });

  describe('Event listening', () => {
    it('responds to navlist-next event', async () => {
      const el = await fixture(html`<nav-list id="test" .listValues="${['A', 'B', 'C']}" selected="A" listen-events></nav-list>`);
      await el.updateComplete;

      document.dispatchEvent(new CustomEvent('navlist-next', { detail: { id: 'test' } }));
      await el.updateComplete;

      expect(el.selected).to.equal('B');
    });

    it('responds to navlist-last event', async () => {
      const el = await fixture(html`<nav-list id="test" .listValues="${['A', 'B', 'C']}" selected="C" listen-events></nav-list>`);
      await el.updateComplete;

      document.dispatchEvent(new CustomEvent('navlist-last', { detail: { id: 'test' } }));
      await el.updateComplete;

      expect(el.selected).to.equal('B');
    });

    it('ignores events with different id', async () => {
      const el = await fixture(html`<nav-list id="test" .listValues="${['A', 'B', 'C']}" selected="A" listen-events></nav-list>`);
      await el.updateComplete;

      document.dispatchEvent(new CustomEvent('navlist-next', { detail: { id: 'other' } }));
      await el.updateComplete;

      expect(el.selected).to.equal('A');
    });

    it('does not go past last item on navlist-next', async () => {
      const el = await fixture(html`<nav-list id="test" .listValues="${['A', 'B', 'C']}" selected="C" listen-events></nav-list>`);
      await el.updateComplete;

      document.dispatchEvent(new CustomEvent('navlist-next', { detail: { id: 'test' } }));
      await el.updateComplete;

      expect(el.selected).to.equal('C');
    });

    it('does not go past first item on navlist-last', async () => {
      const el = await fixture(html`<nav-list id="test" .listValues="${['A', 'B', 'C']}" selected="A" listen-events></nav-list>`);
      await el.updateComplete;

      document.dispatchEvent(new CustomEvent('navlist-last', { detail: { id: 'test' } }));
      await el.updateComplete;

      expect(el.selected).to.equal('A');
    });
  });

  describe('Accessibility', () => {
    it('has radiogroup role', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B']}"></nav-list>`);
      const group = el.shadowRoot.querySelector('[role="radiogroup"]');
      expect(group).to.exist;
    });

    it('items have radio role', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B']}"></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('[role="radio"]');
      expect(items.length).to.equal(2);
    });

    it('selected item has aria-checked true', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B']}" selected="A"></nav-list>`);
      await el.updateComplete;
      const selected = el.shadowRoot.querySelector('[aria-checked="true"]');
      expect(selected).to.exist;
      expect(selected.textContent.trim()).to.equal('A');
    });

    it('supports keyboard navigation with Enter', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B', 'C']}"></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item');

      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;

      expect(el.selected).to.equal('B');
    });

    it('supports keyboard navigation with Space', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A', 'B', 'C']}"></nav-list>`);
      const items = el.shadowRoot.querySelectorAll('.navlist__item');

      items[2].dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await el.updateComplete;

      expect(el.selected).to.equal('C');
    });
  });

  describe('Animation', () => {
    it('adds fadein class on firstUpdated', async () => {
      const el = await fixture(html`<nav-list .listValues="${['A']}"></nav-list>`);
      await el.updateComplete;
      const main = el.shadowRoot.getElementById('main');
      expect(main.classList.contains('fadein')).to.be.true;
    });
  });
});
