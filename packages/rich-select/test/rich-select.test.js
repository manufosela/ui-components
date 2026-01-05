import { html } from 'lit';
import { fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/rich-select.js';

describe('RichOption', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<rich-option>Option 1</rich-option>`);

      expect(el).to.exist;
      expect(el.selected).to.be.false;
      expect(el.considered).to.be.false;
      expect(el.disabled).to.be.false;
    });

    it('assigns slot="option" automatically', async () => {
      const el = await fixture(html`<rich-option>Option 1</rich-option>`);

      expect(el.getAttribute('slot')).to.equal('option');
    });
  });

  describe('Properties', () => {
    it('accepts selected attribute', async () => {
      const el = await fixture(html`<rich-option selected>Option 1</rich-option>`);

      expect(el.selected).to.be.true;
      expect(el.hasAttribute('selected')).to.be.true;
    });

    it('accepts disabled attribute', async () => {
      const el = await fixture(html`<rich-option disabled>Option 1</rich-option>`);

      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('accepts value attribute', async () => {
      const el = await fixture(html`<rich-option value="opt1">Option 1</rich-option>`);

      expect(el.value).to.equal('opt1');
    });

    it('uses textContent as value when value attribute not set', async () => {
      const el = await fixture(html`<rich-option>Option Text</rich-option>`);

      expect(el.value).to.equal('Option Text');
    });

    it('accepts title attribute', async () => {
      const el = await fixture(html`<rich-option title="Option Title">Option 1</rich-option>`);

      expect(el.title).to.equal('Option Title');
    });

    it('accepts record attribute', async () => {
      const el = await fixture(html`<rich-option record="searchable">Option 1</rich-option>`);

      expect(el.record).to.equal('searchable');
    });

    it('uses title as record when record not set', async () => {
      const el = await fixture(html`<rich-option title="My Title">Option 1</rich-option>`);

      expect(el.record).to.equal('My Title');
    });
  });

  describe('Content', () => {
    it('returns innerHTML as content when no title', async () => {
      const el = await fixture(html`<rich-option>Option Content</rich-option>`);

      expect(el.content).to.equal('Option Content');
    });

    it('returns title as content when title is set', async () => {
      const el = await fixture(html`<rich-option title="Title Content">Option Content</rich-option>`);

      expect(el.content).to.equal('Title Content');
    });
  });
});

describe('RichSelect', () => {
  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
          <rich-option>Option 2</rich-option>
        </rich-select>
      `);

      expect(el).to.exist;
      expect(el.expanded).to.be.false;
      expect(el.disabled).to.be.false;
    });

    it('renders the caller element', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      const caller = el.shadowRoot.querySelector('#caller');
      expect(caller).to.exist;
    });

    it('renders the chosen text element', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      const chosen = el.shadowRoot.querySelector('#chosen');
      expect(chosen).to.exist;
    });

    it('renders the arrow when arrow attribute is set', async () => {
      const el = await fixture(html`
        <rich-select arrow>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      const arrow = el.shadowRoot.querySelector('#arrow');
      expect(arrow).to.exist;
      expect(getComputedStyle(arrow).display).to.not.equal('none');
    });

    it('renders the selectOptions dropdown', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      const selectOptions = el.shadowRoot.querySelector('#selectOptions');
      expect(selectOptions).to.exist;
    });

    it('renders search input when search attribute is set', async () => {
      const el = await fixture(html`
        <rich-select search>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      const search = el.shadowRoot.querySelector('#search');
      const input = search.querySelector('input');
      expect(search).to.exist;
      expect(input).to.exist;
    });

    it('renders option slot', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      const slot = el.shadowRoot.querySelector('slot[name=option]');
      expect(slot).to.exist;
    });
  });

  describe('Properties', () => {
    it('accepts expanded attribute', async () => {
      const el = await fixture(html`
        <rich-select expanded>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.expanded).to.be.true;
    });

    it('accepts disabled attribute', async () => {
      const el = await fixture(html`
        <rich-select disabled>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.disabled).to.be.true;
      expect(el.getAttribute('tabindex')).to.equal('-1');
    });

    it('accepts search attribute', async () => {
      const el = await fixture(html`
        <rich-select search>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.search).to.be.true;
    });

    it('accepts arrow attribute', async () => {
      const el = await fixture(html`
        <rich-select arrow>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.arrow).to.be.true;
    });

    it('accepts animated attribute', async () => {
      const el = await fixture(html`
        <rich-select animated>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.animated).to.be.true;
    });

    it('accepts placeholder attribute', async () => {
      const el = await fixture(html`
        <rich-select search placeholder="Type to search...">
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.placeholder).to.equal('Type to search...');
      const input = el.shadowRoot.querySelector('#search input');
      expect(input.placeholder).to.equal('Type to search...');
    });

    it('accepts name attribute', async () => {
      const el = await fixture(html`
        <rich-select name="mySelect">
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);

      expect(el.name).to.equal('mySelect');
    });
  });

  describe('Selection', () => {
    it('selects first option by default', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
          <rich-option>Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing(); // Ensure options are initialized
      await el.updateComplete;

      expect(el.value).to.equal('Option 1');
    });

    it('respects pre-selected option', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
          <rich-option selected>Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      expect(el.value).to.equal('Option 2');
    });

    it('can set value programmatically', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option value="opt1">Option 1</rich-option>
          <rich-option value="opt2">Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      el.value = 'opt2';
      await el.updateComplete;

      expect(el.value).to.equal('opt2');
    });

    it('updates chosen display when selection changes', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>First</rich-option>
          <rich-option>Second</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const chosen = el.shadowRoot.querySelector('#chosen');
      expect(chosen.innerHTML).to.equal('First');

      el.value = 'Second';
      await el.updateComplete;

      expect(chosen.innerHTML).to.equal('Second');
    });
  });

  describe('Expand/Collapse', () => {
    it('expands on click', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const caller = el.shadowRoot.querySelector('#caller');
      caller.click();
      await el.updateComplete;

      expect(el.expanded).to.be.true;
    });

    it('collapses on second click', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const caller = el.shadowRoot.querySelector('#caller');
      caller.click();
      await el.updateComplete;
      caller.click();
      await el.updateComplete;

      expect(el.expanded).to.be.false;
    });

    it('does not expand when disabled', async () => {
      const el = await fixture(html`
        <rich-select disabled>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const caller = el.shadowRoot.querySelector('#caller');
      caller.click();
      await el.updateComplete;

      expect(el.expanded).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches change event when option is selected', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option value="opt1">Option 1</rich-option>
          <rich-option value="opt2">Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const listener = oneEvent(el, 'change');

      // Select second option directly using internal method
      const options = el.querySelectorAll('rich-option');
      el._select(options[1]);

      const event = await listener;
      expect(event.detail.value).to.equal('opt2');
    });

    it('change event bubbles and is composed', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option value="opt1">Option 1</rich-option>
          <rich-option value="opt2">Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const listener = oneEvent(el, 'change');

      const options = el.querySelectorAll('rich-option');
      el._select(options[1]);

      const event = await listener;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('includes name in change event detail', async () => {
      const el = await fixture(html`
        <rich-select name="testSelect">
          <rich-option value="opt1">Option 1</rich-option>
          <rich-option value="opt2">Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const listener = oneEvent(el, 'change');

      const options = el.querySelectorAll('rich-option');
      el._select(options[1]);

      const event = await listener;
      expect(event.detail.name).to.equal('testSelect');
    });
  });

  describe('Accessibility', () => {
    it('has tabindex by default', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;

      expect(el.hasAttribute('tabindex')).to.be.true;
      expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('sets tabindex=-1 when disabled', async () => {
      const el = await fixture(html`
        <rich-select disabled>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;

      expect(el.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('Search functionality', () => {
    it('filters options based on search text', async () => {
      const el = await fixture(html`
        <rich-select search>
          <rich-option>Apple</rich-option>
          <rich-option>Banana</rich-option>
          <rich-option>Cherry</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      // Call search method directly
      el._searching('ban');
      await el.updateComplete;

      const options = el.querySelectorAll('rich-option');
      expect(options[0].hidden).to.be.true;
      expect(options[1].hidden).to.be.false;
      expect(options[2].hidden).to.be.true;
    });

    it('filters using record attribute when set', async () => {
      const el = await fixture(html`
        <rich-select search>
          <rich-option record="fruit apple">Apple</rich-option>
          <rich-option record="fruit banana">Banana</rich-option>
          <rich-option record="vegetable carrot">Carrot</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      // Call search method directly
      el._searching('fruit');
      await el.updateComplete;

      const options = el.querySelectorAll('rich-option');
      expect(options[0].hidden).to.be.false;
      expect(options[1].hidden).to.be.false;
      expect(options[2].hidden).to.be.true;
    });

    it('resets search when collapsed', async () => {
      const el = await fixture(html`
        <rich-select search>
          <rich-option>Apple</rich-option>
          <rich-option>Banana</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      el.expanded = true;
      await el.updateComplete;

      const input = el.shadowRoot.querySelector('#search input');
      input.value = 'ban';
      el._searching('ban');
      await el.updateComplete;

      el.expanded = false;
      await el.updateComplete;

      const options = el.querySelectorAll('rich-option');
      expect(options[0].hidden).to.be.false;
      expect(options[1].hidden).to.be.false;
      expect(input.value).to.equal('');
    });
  });

  describe('Disabled options', () => {
    it('skips disabled options in navigation', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
          <rich-option disabled>Option 2 (disabled)</rich-option>
          <rich-option>Option 3</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const options = el.querySelectorAll('rich-option');
      expect(el._nextOption()).to.not.equal(options[1]);
    });

    it('cannot select disabled options', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option value="opt1">Option 1</rich-option>
          <rich-option value="opt2" disabled>Option 2</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const options = el.querySelectorAll('rich-option');
      el._select(options[1]);
      await el.updateComplete;

      expect(el.value).to.equal('opt1');
    });
  });

  describe('Option navigation', () => {
    it('returns first option correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>First</rich-option>
          <rich-option>Second</rich-option>
          <rich-option>Third</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const first = el._firstOption();
      expect(first.textContent.trim()).to.equal('First');
    });

    it('returns last option correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>First</rich-option>
          <rich-option>Second</rich-option>
          <rich-option>Third</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const last = el._lastOption();
      expect(last.textContent.trim()).to.equal('Third');
    });

    it('returns next option correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option selected>First</rich-option>
          <rich-option>Second</rich-option>
          <rich-option>Third</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const next = el._nextOption();
      expect(next.textContent.trim()).to.equal('Second');
    });

    it('returns previous option correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>First</rich-option>
          <rich-option selected>Second</rich-option>
          <rich-option>Third</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const prev = el._previousOption();
      expect(prev.textContent.trim()).to.equal('First');
    });

    it('gets all options', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>First</rich-option>
          <rich-option>Second</rich-option>
          <rich-option>Third</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const all = el._allOptions();
      expect(all.length).to.equal(3);
    });
  });

  describe('Validation helpers', () => {
    it('validates RichOption instances correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const option = el.querySelector('rich-option');
      expect(el._isValidOption(option)).to.be.true;
      expect(el._isValidOption(document.createElement('div'))).to.be.false;
    });

    it('validates enabled options correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Enabled</rich-option>
          <rich-option disabled>Disabled</rich-option>
        </rich-select>
      `);
      await el.updateComplete;
      el._initializing();
      await el.updateComplete;

      const options = el.querySelectorAll('rich-option');
      expect(el._isValidAndEnabled(options[0])).to.be.true;
      expect(el._isValidAndEnabled(options[1])).to.be.false;
    });
  });

  describe('Keyboard validation', () => {
    it('identifies typing keys correctly', async () => {
      const el = await fixture(html`
        <rich-select>
          <rich-option>Option 1</rich-option>
        </rich-select>
      `);
      await el.updateComplete;

      // Letters
      expect(el._isTypingKey(65)).to.be.true; // A
      expect(el._isTypingKey(90)).to.be.true; // Z

      // Numbers
      expect(el._isTypingKey(48)).to.be.true; // 0
      expect(el._isTypingKey(57)).to.be.true; // 9

      // Space
      expect(el._isTypingKey(32)).to.be.true;

      // Non-typing keys
      expect(el._isTypingKey(13)).to.be.false; // Enter
      expect(el._isTypingKey(27)).to.be.false; // Escape
      expect(el._isTypingKey(38)).to.be.false; // Arrow Up
    });
  });
});
