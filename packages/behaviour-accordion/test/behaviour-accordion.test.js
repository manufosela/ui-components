import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/behaviour-accordion.js';

describe('AccordionItem', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      expect(el).to.exist;
      expect(el.expanded).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.header).to.equal('');
    });

    it('renders header from attribute', async () => {
      const el = await fixture(html`<accordion-item header="Test Header"></accordion-item>`);
      const headerContent = el.shadowRoot.querySelector('.header-content');
      expect(headerContent.textContent.trim()).to.equal('Test Header');
    });

    it('renders header from slot', async () => {
      const el = await fixture(html`
        <accordion-item>
          <span slot="header">Slotted Header</span>
        </accordion-item>
      `);
      const slot = el.shadowRoot.querySelector('slot[name="header"]');
      expect(slot).to.exist;
    });

    it('renders content in default slot', async () => {
      const el = await fixture(html`
        <accordion-item>
          <p>Panel content</p>
        </accordion-item>
      `);
      const slot = el.shadowRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('renders expand/collapse icon', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const icon = el.shadowRoot.querySelector('.icon');
      expect(icon).to.exist;
    });
  });

  describe('expand/collapse', () => {
    it('expands when expanded attribute is set', async () => {
      const el = await fixture(html`<accordion-item expanded></accordion-item>`);
      expect(el.expanded).to.be.true;
      expect(el.hasAttribute('expanded')).to.be.true;
    });

    it('fires toggle event on click', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      setTimeout(() => header.click());
      const event = await oneEvent(el, 'toggle');
      expect(event.detail.expanded).to.be.true;
    });

    it('fires toggle event with correct state', async () => {
      const el = await fixture(html`<accordion-item expanded></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      setTimeout(() => header.click());
      const event = await oneEvent(el, 'toggle');
      expect(event.detail.expanded).to.be.false;
    });
  });

  describe('keyboard interaction', () => {
    it('toggles on Enter key', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      setTimeout(() => {
        header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });
      const event = await oneEvent(el, 'toggle');
      expect(event.detail.expanded).to.be.true;
    });

    it('toggles on Space key', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      setTimeout(() => {
        header.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      });
      const event = await oneEvent(el, 'toggle');
      expect(event.detail.expanded).to.be.true;
    });

    it('ignores other keys', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      let eventFired = false;
      el.addEventListener('toggle', () => {
        eventFired = true;
      });
      header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      await aTimeout(50);
      expect(eventFired).to.be.false;
    });
  });

  describe('disabled state', () => {
    it('reflects disabled attribute', async () => {
      const el = await fixture(html`<accordion-item disabled></accordion-item>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('does not fire toggle when disabled', async () => {
      const el = await fixture(html`<accordion-item disabled></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      let eventFired = false;
      el.addEventListener('toggle', () => {
        eventFired = true;
      });
      header.click();
      await aTimeout(50);
      expect(eventFired).to.be.false;
    });

    it('sets tabindex to -1 when disabled', async () => {
      const el = await fixture(html`<accordion-item disabled></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      expect(header.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('accessibility', () => {
    it('header has role button', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      expect(header.getAttribute('role')).to.equal('button');
    });

    it('header has aria-expanded', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      expect(header.getAttribute('aria-expanded')).to.equal('false');
    });

    it('updates aria-expanded when expanded', async () => {
      const el = await fixture(html`<accordion-item expanded></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      expect(header.getAttribute('aria-expanded')).to.equal('true');
    });

    it('header has aria-disabled', async () => {
      const el = await fixture(html`<accordion-item disabled></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      expect(header.getAttribute('aria-disabled')).to.equal('true');
    });

    it('header is focusable', async () => {
      const el = await fixture(html`<accordion-item></accordion-item>`);
      const header = el.shadowRoot.querySelector('.header');
      expect(header.getAttribute('tabindex')).to.equal('0');
    });
  });
});

describe('BehaviourAccordion', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<behaviour-accordion></behaviour-accordion>`);
      expect(el).to.exist;
      expect(el.multiple).to.be.false;
      expect(el.expanded).to.deep.equal([]);
    });

    it('renders slot for items', async () => {
      const el = await fixture(html`<behaviour-accordion></behaviour-accordion>`);
      const slot = el.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it('renders child accordion-items', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 1">Content 1</accordion-item>
          <accordion-item header="Item 2">Content 2</accordion-item>
        </behaviour-accordion>
      `);
      const items = el.querySelectorAll('accordion-item');
      expect(items.length).to.equal(2);
    });
  });

  describe('single mode', () => {
    it('only allows one item expanded at a time', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 1">Content 1</accordion-item>
          <accordion-item header="Item 2">Content 2</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('accordion-item');
      items[0].shadowRoot.querySelector('.header').click();
      await aTimeout(50);
      expect(items[0].expanded).to.be.true;

      items[1].shadowRoot.querySelector('.header').click();
      await aTimeout(50);
      expect(items[0].expanded).to.be.false;
      expect(items[1].expanded).to.be.true;
    });

    it('collapses item when clicked again', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 1">Content 1</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      const item = el.querySelector('accordion-item');
      item.shadowRoot.querySelector('.header').click();
      await aTimeout(50);
      expect(item.expanded).to.be.true;

      item.shadowRoot.querySelector('.header').click();
      await aTimeout(50);
      expect(item.expanded).to.be.false;
    });
  });

  describe('multiple mode', () => {
    it('allows multiple items expanded', async () => {
      const el = await fixture(html`
        <behaviour-accordion multiple>
          <accordion-item header="Item 1">Content 1</accordion-item>
          <accordion-item header="Item 2">Content 2</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('accordion-item');
      items[0].shadowRoot.querySelector('.header').click();
      await aTimeout(50);
      items[1].shadowRoot.querySelector('.header').click();
      await aTimeout(50);

      expect(items[0].expanded).to.be.true;
      expect(items[1].expanded).to.be.true;
    });
  });

  describe('initially expanded', () => {
    it('expands items from expanded attribute', async () => {
      const el = await fixture(html`
        <behaviour-accordion expanded="0,2">
          <accordion-item header="Item 0">Content 0</accordion-item>
          <accordion-item header="Item 1">Content 1</accordion-item>
          <accordion-item header="Item 2">Content 2</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('accordion-item');
      expect(items[0].expanded).to.be.true;
      expect(items[1].expanded).to.be.false;
      expect(items[2].expanded).to.be.true;
    });

    it('converts expanded attribute to array', async () => {
      const el = await fixture(html` <behaviour-accordion expanded="1"></behaviour-accordion> `);
      expect(el.expanded).to.deep.equal([1]);
    });
  });

  describe('events', () => {
    it('fires item-toggle event', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 1">Content 1</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      const item = el.querySelector('accordion-item');
      setTimeout(() => item.shadowRoot.querySelector('.header').click());
      const event = await oneEvent(el, 'item-toggle');

      expect(event.detail.index).to.equal(0);
      expect(event.detail.expanded).to.be.true;
      expect(event.detail.expandedItems).to.deep.equal([0]);
    });

    it('includes correct expandedItems in event', async () => {
      const el = await fixture(html`
        <behaviour-accordion multiple expanded="0">
          <accordion-item header="Item 0">Content 0</accordion-item>
          <accordion-item header="Item 1">Content 1</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      const items = el.querySelectorAll('accordion-item');
      setTimeout(() => items[1].shadowRoot.querySelector('.header').click());
      const event = await oneEvent(el, 'item-toggle');

      expect(event.detail.expandedItems).to.include(0);
      expect(event.detail.expandedItems).to.include(1);
    });
  });

  describe('programmatic control', () => {
    it('expand() expands specific item', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 0">Content 0</accordion-item>
          <accordion-item header="Item 1">Content 1</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.expand(1);
      const items = el.querySelectorAll('accordion-item');
      expect(items[1].expanded).to.be.true;
    });

    it('collapse() collapses specific item', async () => {
      const el = await fixture(html`
        <behaviour-accordion expanded="0">
          <accordion-item header="Item 0">Content 0</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.collapse(0);
      const item = el.querySelector('accordion-item');
      expect(item.expanded).to.be.false;
    });

    it('toggle() toggles item state', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 0">Content 0</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.toggle(0);
      const item = el.querySelector('accordion-item');
      expect(item.expanded).to.be.true;

      el.toggle(0);
      expect(item.expanded).to.be.false;
    });

    it('expandAll() expands all items in multiple mode', async () => {
      const el = await fixture(html`
        <behaviour-accordion multiple>
          <accordion-item header="Item 0">Content 0</accordion-item>
          <accordion-item header="Item 1">Content 1</accordion-item>
          <accordion-item header="Item 2">Content 2</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.expandAll();
      const items = el.querySelectorAll('accordion-item');
      expect(items[0].expanded).to.be.true;
      expect(items[1].expanded).to.be.true;
      expect(items[2].expanded).to.be.true;
    });

    it('expandAll() does nothing in single mode', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 0">Content 0</accordion-item>
          <accordion-item header="Item 1">Content 1</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.expandAll();
      const items = el.querySelectorAll('accordion-item');
      expect(items[0].expanded).to.be.false;
      expect(items[1].expanded).to.be.false;
    });

    it('collapseAll() collapses all items', async () => {
      const el = await fixture(html`
        <behaviour-accordion multiple expanded="0,1">
          <accordion-item header="Item 0">Content 0</accordion-item>
          <accordion-item header="Item 1">Content 1</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.collapseAll();
      const items = el.querySelectorAll('accordion-item');
      expect(items[0].expanded).to.be.false;
      expect(items[1].expanded).to.be.false;
    });
  });

  describe('edge cases', () => {
    it('handles empty accordion', async () => {
      const el = await fixture(html`<behaviour-accordion></behaviour-accordion>`);
      expect(el._getItems().length).to.equal(0);
    });

    it('expand does nothing if already expanded', async () => {
      const el = await fixture(html`
        <behaviour-accordion expanded="0">
          <accordion-item header="Item 0">Content 0</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.expand(0);
      expect(el.expanded).to.deep.equal([0]);
    });

    it('collapse does nothing if already collapsed', async () => {
      const el = await fixture(html`
        <behaviour-accordion>
          <accordion-item header="Item 0">Content 0</accordion-item>
        </behaviour-accordion>
      `);
      await el.updateComplete;

      el.collapse(0);
      expect(el.expanded).to.deep.equal([]);
    });
  });
});
