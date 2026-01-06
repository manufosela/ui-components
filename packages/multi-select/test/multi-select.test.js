import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../src/multi-select.js';

describe('MultiSelect', () => {
  const sampleOptions = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];

  describe('Rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<multi-select></multi-select>`);
      expect(el).to.exist;
      expect(el.options).to.deep.equal([]);
      expect(el.selectedValues).to.deep.equal([]);
      expect(el.placeholder).to.equal('Select...');
      expect(el.disabled).to.be.false;
    });

    it('renders placeholder when no selection', async () => {
      const el = await fixture(html`<multi-select placeholder="Choose..."></multi-select>`);
      const display = el.shadowRoot.querySelector('.selected-values');
      expect(display.textContent.trim()).to.equal('Choose...');
      expect(display.classList.contains('placeholder')).to.be.true;
    });

    it('renders options when provided', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const options = el.shadowRoot.querySelectorAll('.option');
      expect(options.length).to.equal(3);
    });

    it('renders no options message when empty', async () => {
      const el = await fixture(html`<multi-select></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const noOptions = el.shadowRoot.querySelector('.no-options');
      expect(noOptions).to.exist;
      expect(noOptions.textContent).to.include('No options');
    });

    it('renders checkboxes for each option', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const checkboxes = el.shadowRoot.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).to.equal(3);
    });
  });

  describe('Selection', () => {
    it('displays selected labels', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['a', 'b']}"></multi-select>
      `);

      const display = el.shadowRoot.querySelector('.selected-values');
      expect(display.textContent).to.include('Option A');
      expect(display.textContent).to.include('Option B');
    });

    it('toggles selection on option click', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const option = el.shadowRoot.querySelector('.option');
      option.click();

      expect(el.selectedValues).to.include('a');
    });

    it('removes from selection when clicked again', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['a']}"></multi-select>
      `);
      el.isOpen = true;
      await el.updateComplete;

      const option = el.shadowRoot.querySelector('.option');
      option.click();

      expect(el.selectedValues).to.not.include('a');
    });

    it('marks selected options with class', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['a']}"></multi-select>
      `);
      el.isOpen = true;
      await el.updateComplete;

      const options = el.shadowRoot.querySelectorAll('.option');
      expect(options[0].classList.contains('selected')).to.be.true;
      expect(options[1].classList.contains('selected')).to.be.false;
    });

    it('checks checkbox for selected options', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['b']}"></multi-select>
      `);
      el.isOpen = true;
      await el.updateComplete;

      const checkboxes = el.shadowRoot.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes[0].checked).to.be.false;
      expect(checkboxes[1].checked).to.be.true;
    });
  });

  describe('Dropdown behavior', () => {
    it('opens dropdown on header click', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      const header = el.shadowRoot.querySelector('.select-header');
      header.click();

      expect(el.isOpen).to.be.true;
    });

    it('closes dropdown on second header click', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const header = el.shadowRoot.querySelector('.select-header');
      header.click();

      expect(el.isOpen).to.be.false;
    });

    it('rotates arrow when open', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const container = el.shadowRoot.querySelector('.multi-select');
      expect(container.classList.contains('open')).to.be.true;
    });

    it('does not open when disabled', async () => {
      const el = await fixture(
        html`<multi-select disabled .options="${sampleOptions}"></multi-select>`
      );
      const header = el.shadowRoot.querySelector('.select-header');
      header.click();

      expect(el.isOpen).to.be.false;
    });
  });

  describe('Events', () => {
    it('dispatches change event on selection', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const option = el.shadowRoot.querySelector('.option');
      setTimeout(() => option.click());

      const event = await oneEvent(el, 'change');
      expect(event.detail.selectedValues).to.include('a');
    });

    it('includes all selected values in event', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['a']}"></multi-select>
      `);
      el.isOpen = true;
      await el.updateComplete;

      const options = el.shadowRoot.querySelectorAll('.option');
      setTimeout(() => options[1].click());

      const event = await oneEvent(el, 'change');
      expect(event.detail.selectedValues).to.deep.equal(['a', 'b']);
    });
  });

  describe('Methods', () => {
    it('selectAll() selects all options', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.selectAll();

      expect(el.selectedValues).to.deep.equal(['a', 'b', 'c']);
    });

    it('clearAll() clears all selections', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['a', 'b']}"></multi-select>
      `);
      el.clearAll();

      expect(el.selectedValues).to.deep.equal([]);
    });

    it('selectAll() does nothing when disabled', async () => {
      const el = await fixture(
        html`<multi-select disabled .options="${sampleOptions}"></multi-select>`
      );
      el.selectAll();

      expect(el.selectedValues).to.deep.equal([]);
    });
  });

  describe('Disabled state', () => {
    it('reflects disabled attribute', async () => {
      const el = await fixture(html`<multi-select disabled></multi-select>`);
      expect(el.hasAttribute('disabled')).to.be.true;
    });

    it('does not toggle option when disabled', async () => {
      const el = await fixture(
        html`<multi-select disabled .options="${sampleOptions}"></multi-select>`
      );
      el.isOpen = true;
      await el.updateComplete;

      const option = el.shadowRoot.querySelector('.option');
      option.click();

      expect(el.selectedValues).to.deep.equal([]);
    });
  });

  describe('Click outside', () => {
    it('closes dropdown on outside mousedown', async () => {
      const el = await fixture(html`<multi-select .options="${sampleOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      // Dispatch mousedown event (what the component listens for)
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      await el.updateComplete;

      expect(el.isOpen).to.be.false;
    });
  });

  describe('Label handling', () => {
    it('displays value if label not found', async () => {
      const el = await fixture(html`
        <multi-select .options="${sampleOptions}" .selectedValues="${['unknown']}"></multi-select>
      `);

      const display = el.shadowRoot.querySelector('.selected-values');
      expect(display.textContent).to.include('unknown');
    });
  });

  describe('Declarative options (slots)', () => {
    it('reads options from child option elements', async () => {
      const el = await fixture(html`
        <multi-select>
          <option value="x">Option X</option>
          <option value="y">Option Y</option>
          <option value="z">Option Z</option>
        </multi-select>
      `);

      expect(el.options.length).to.equal(3);
      expect(el.options[0].value).to.equal('x');
      expect(el.options[0].label).to.equal('Option X');
    });

    it('reads selected attribute from option elements', async () => {
      const el = await fixture(html`
        <multi-select>
          <option value="a">A</option>
          <option value="b" selected>B</option>
          <option value="c" selected>C</option>
        </multi-select>
      `);

      expect(el.selectedValues).to.deep.equal(['b', 'c']);
    });

    it('uses textContent as value if value attribute missing', async () => {
      const el = await fixture(html`
        <multi-select>
          <option>First</option>
          <option>Second</option>
        </multi-select>
      `);

      expect(el.options[0].value).to.equal('First');
      expect(el.options[1].value).to.equal('Second');
    });

    it('prefers programmatic options over slot options', async () => {
      const programmaticOptions = [{ value: 'prog', label: 'Programmatic' }];
      const el = await fixture(html`
        <multi-select .options="${programmaticOptions}">
          <option value="slot">Slot</option>
        </multi-select>
      `);

      expect(el.options.length).to.equal(1);
      expect(el.options[0].value).to.equal('prog');
    });
  });

  describe('Sorting', () => {
    const unsortedOptions = [
      { value: 'c', label: 'Cherry' },
      { value: 'a', label: 'Apple' },
      { value: 'b', label: 'Banana' },
    ];

    it('does not sort by default', async () => {
      const el = await fixture(html`<multi-select .options="${unsortedOptions}"></multi-select>`);
      el.isOpen = true;
      await el.updateComplete;

      const options = el.shadowRoot.querySelectorAll('.option span');
      expect(options[0].textContent).to.equal('Cherry');
      expect(options[1].textContent).to.equal('Apple');
      expect(options[2].textContent).to.equal('Banana');
    });

    it('sorts ascending with sort="asc"', async () => {
      const el = await fixture(
        html`<multi-select sort="asc" .options="${unsortedOptions}"></multi-select>`
      );
      el.isOpen = true;
      await el.updateComplete;

      const options = el.shadowRoot.querySelectorAll('.option span');
      expect(options[0].textContent).to.equal('Apple');
      expect(options[1].textContent).to.equal('Banana');
      expect(options[2].textContent).to.equal('Cherry');
    });

    it('sorts descending with sort="desc"', async () => {
      const el = await fixture(
        html`<multi-select sort="desc" .options="${unsortedOptions}"></multi-select>`
      );
      el.isOpen = true;
      await el.updateComplete;

      const options = el.shadowRoot.querySelectorAll('.option span');
      expect(options[0].textContent).to.equal('Cherry');
      expect(options[1].textContent).to.equal('Banana');
      expect(options[2].textContent).to.equal('Apple');
    });

    it('sort property defaults to empty string', async () => {
      const el = await fixture(html`<multi-select></multi-select>`);
      expect(el.sort).to.equal('');
    });

    it('accepts sort attribute', async () => {
      const el = await fixture(html`<multi-select sort="asc"></multi-select>`);
      expect(el.sort).to.equal('asc');
    });
  });
});
