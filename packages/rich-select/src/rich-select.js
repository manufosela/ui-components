import { LitElement, html } from 'lit';
import { richOptionStyles, richSelectStyles } from './rich-select.styles.js';

/**
 * A rich option element for use within rich-select.
 *
 * @element rich-option
 *
 * @attr {Boolean} selected - Whether this option is selected
 * @attr {Boolean} considered - Whether this option is being considered (keyboard navigation)
 * @attr {Boolean} disabled - Whether this option is disabled
 * @attr {String} value - The value of the option (defaults to innerText if not set)
 * @attr {String} title - Display title (used for display when selected)
 * @attr {String} record - Searchable record text (defaults to title)
 */
export class RichOption extends LitElement {
  static styles = richOptionStyles;

  static properties = {
    selected: { type: Boolean, reflect: true },
    considered: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    value: { type: String },
    title: { type: String },
    record: { type: String },
  };

  constructor() {
    super();
    this.selected = false;
    this.considered = false;
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.slot !== 'option') {
      this.slot = 'option';
    }
    this._updateShadowContent();
  }

  updated(changedProperties) {
    if (changedProperties.has('selected') || changedProperties.has('considered')) {
      this._notifyParent();
    }
  }

  _updateShadowContent() {
    // Render innerHTML to shadow DOM for styling
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.innerHTML;
    }
  }

  _notifyParent() {
    if (!this.parentNode || typeof this.parentNode._transcend !== 'function') return;

    const isValid = this._haveValidParent() && !this.disabled;
    if (this.selected && isValid) {
      this.parentNode._transcend(this);
    }
    if (this.considered && isValid) {
      this.parentNode._consider(this);
    }
  }

  get value() {
    if (this.hasAttribute('value')) {
      return this.getAttribute('value');
    }
    const text = this.textContent.trim();
    return text || this.title || '';
  }

  set value(val) {
    if (val) {
      this.setAttribute('value', val);
    } else {
      this.removeAttribute('value');
    }
  }

  get record() {
    return this.hasAttribute('record')
      ? this.getAttribute('record')
      : this.title || this.textContent.trim();
  }

  set record(val) {
    if (val) {
      this.setAttribute('record', val);
    } else {
      this.removeAttribute('record');
    }
  }

  get content() {
    return this.title || this.innerHTML;
  }

  _haveValidParent() {
    return !!this.parentNode && this.parentNode.tagName === 'RICH-SELECT';
  }
}

customElements.define('rich-option', RichOption);

/**
 * A customizable rich select dropdown with search and keyboard navigation.
 *
 * @element rich-select
 * @fires change - Fired when the selected option changes
 *
 * @attr {String} value - The current selected value
 * @attr {Boolean} expanded - Whether the dropdown is expanded
 * @attr {Boolean} disabled - Whether the select is disabled
 * @attr {Boolean} search - Whether to show the search input
 * @attr {Boolean} arrow - Whether to show the dropdown arrow
 * @attr {Boolean} animated - Whether to animate the dropdown
 * @attr {String} placeholder - Placeholder text for the search input
 * @attr {String} name - Form field name
 *
 * @cssprop [--rich-select-width=auto] - Width of the select
 * @cssprop [--rich-select-font-family=inherit] - Font family
 * @cssprop [--caller-padding=8px 12px] - Padding of the trigger button
 * @cssprop [--caller-background=#fff] - Background of trigger
 * @cssprop [--caller-border=1px solid #d1d5db] - Border of trigger
 * @cssprop [--caller-border-radius=6px] - Border radius
 * @cssprop [--option-padding=10px 12px] - Padding of options
 * @cssprop [--option-active-background=#3b82f6] - Background of considered option
 * @cssprop [--option-selected-background=#eff6ff] - Background of selected option
 * @cssprop [--selectOptions-max-height=300px] - Max height of dropdown
 *
 * @slot option - Slot for rich-option elements
 */
export class RichSelect extends LitElement {
  static styles = richSelectStyles;

  static properties = {
    value: { type: String },
    expanded: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    search: { type: Boolean, reflect: true },
    arrow: { type: Boolean, reflect: true },
    animated: { type: Boolean, reflect: true },
    placeholder: { type: String },
    name: { type: String },
  };

  static keyCodes = {
    ENTER: 13,
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    HOME: 36,
    END: 35,
  };

  constructor() {
    super();
    this.expanded = false;
    this.disabled = false;
    this.search = false;
    this.arrow = true;
    this.animated = true;
    this.placeholder = 'Search...';

    this._selectedOption = null;
    this._consideredOption = null;
    this._searchContent = '';
    this.options = [];

    // Bind methods
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onCallerClick = this._onCallerClick.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('mousedown', this._onMouseDown);
    this.addEventListener('mouseup', this._onMouseUp);
    this.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('scroll', this._onScroll, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('mousedown', this._onMouseDown);
    this.removeEventListener('mouseup', this._onMouseUp);
    this.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('scroll', this._onScroll, true);
  }

  firstUpdated() {
    this._optionSlot = this.shadowRoot.querySelector('slot[name=option]');
    this._caller = this.shadowRoot.querySelector('#caller');
    this._chosen = this._caller.querySelector('#chosen');
    this._selectOptions = this.shadowRoot.querySelector('#selectOptions');
    this._searchElm = this.shadowRoot.querySelector('#search');
    this._input = this._searchElm.querySelector('input');
    this._holder = this.shadowRoot.querySelector('#holder');

    this._optionSlot.addEventListener('slotchange', this._onSlotChange);
    this._caller.addEventListener('click', this._onCallerClick);
    this._input.addEventListener('keyup', this._onKeyUp);

    if (!this.animated) {
      this._setHidden(true);
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('expanded')) {
      if (this.expanded) {
        this._expand();
      } else {
        this._collapse();
      }
    }

    if (changedProperties.has('disabled')) {
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
      if (this.disabled) {
        this.blur();
      }
    }
  }

  get value() {
    return this._selectedOption ? this._selectedOption.value : '';
  }

  set value(val) {
    if (typeof val === 'string' || typeof val === 'number') {
      const allValidOptions = this._allValidOptions();
      for (const validOption of allValidOptions) {
        if (validOption.value === String(val)) {
          if (this._selectedOption) {
            this._selectedOption.selected = false;
          }
          validOption.selected = true;
          this._selectedOption = validOption;
          this._updateChosenDisplay();
          return;
        }
      }
    }
  }

  // Event handlers
  _onSlotChange() {
    this._initializing();
  }

  _onCallerClick() {
    if (!this.disabled) {
      this._toggle();
    }
  }

  _onMouseDown(ev) {
    const opt = ev.target.closest('rich-option');
    if (this._isValidAndEnabled(opt)) {
      opt.considered = true;
    }
  }

  _onMouseUp(ev) {
    const opt = ev.target.closest('rich-option');
    if (this._isValidAndEnabled(opt)) {
      this._select(opt);
      this.expanded = false;
      this.focus();
    }
  }

  _onKeyDown(ev) {
    const { keyCodes } = RichSelect;

    switch (ev.keyCode) {
      case keyCodes.HOME:
        this._expandedOption(ev, this._firstOption());
        break;
      case keyCodes.ARROW_UP:
        this._expandedOption(ev, this._previousOption());
        break;
      case keyCodes.ARROW_DOWN:
        this._expandedOption(ev, this._nextOption());
        break;
      case keyCodes.END:
        this._expandedOption(ev, this._lastOption());
        break;
      case keyCodes.ESC:
        ev.preventDefault();
        this.expanded = false;
        this.focus();
        break;
      case keyCodes.ENTER:
        ev.preventDefault();
        if (this.expanded && this._consideredOption) {
          this._select(this._consideredOption);
          this.expanded = false;
          this.focus();
        } else if (!this.expanded) {
          this.expanded = true;
        }
        break;
      default:
        if (!this.expanded && this._isTypingKey(ev.keyCode)) {
          this._input.focus();
          this.expanded = true;
        }
    }
  }

  _onKeyUp(ev) {
    if (ev.target.value !== this._searchContent) {
      this._searching(ev.target.value.trim().toLowerCase());
      this._searchContent = ev.target.value;
    }
  }

  _onBlur() {
    this.expanded = false;
  }

  _onScroll() {
    if (this.expanded) {
      this.expanded = false;
      this.focus();
    }
  }

  _expandedOption(ev, opt) {
    ev.preventDefault();
    if (this.expanded && opt) {
      opt.considered = true;
    } else if (!this.expanded) {
      this.expanded = true;
    }
  }

  // Core methods
  _initializing() {
    const allOptions = this._allOptions();
    this.options = allOptions;
    this._selectedOption = this._getSelected(allOptions);

    if (!this._selectedOption && allOptions.length) {
      const firstOption = this._firstOption();
      if (firstOption) {
        firstOption.selected = true;
      }
    }

    this._updateChosenDisplay();
  }

  _updateChosenDisplay() {
    if (this._chosen && this._selectedOption) {
      this._chosen.innerHTML = this._selectedOption.content;
    }
  }

  _expand() {
    this._setHidden(false);
    this._attachSelectOptionsToCaller();
    if (this.search) {
      this._input.focus();
    }
    if (this._selectedOption) {
      this._selectedOption.scrollIntoView({ block: 'center' });
    }
  }

  _collapse() {
    this._setHidden(true);
    this._releaseSelectOptions();
    if (this._consideredOption) {
      this._consideredOption.considered = false;
      this._consideredOption = null;
    }
    this._resetSearch();
  }

  _setHidden(val) {
    if (!this.animated && this._selectOptions) {
      this._selectOptions.hidden = val;
    }
  }

  _toggle() {
    this.expanded = !this.expanded;
  }

  _select(opt) {
    if (this._isValidAndEnabled(opt) && opt !== this._selectedOption) {
      if (this._selectedOption) {
        this._selectedOption.selected = false;
      }
      opt.selected = true;
      this._selectedOption = opt;
      this._updateChosenDisplay();
      this._dispatchChange();
    }
  }

  _transcend(opt) {
    if (this._isValidAndEnabled(opt) && this._selectedOption !== opt) {
      if (this._selectedOption) {
        this._selectedOption.selected = false;
      }
      this._selectedOption = opt;
      this._updateChosenDisplay();
    }
  }

  _consider(opt) {
    if (this._isValidOption(opt) && this._consideredOption !== opt) {
      if (this._consideredOption) {
        this._consideredOption.considered = false;
      }
      this._consideredOption = opt;
      opt.scrollIntoView({ block: 'nearest' });
    }
  }

  _searching(val) {
    for (const opt of this.options) {
      if (this._isValidOption(opt)) {
        const recordMatch = opt.record.toLowerCase().includes(val);
        const textMatch = opt.textContent.toLowerCase().includes(val);
        opt.hidden = !recordMatch && !textMatch;
      }
    }

    // Consider first visible option if current considered/selected is hidden
    if (
      !this._isVisibleAndEnabled(this._consideredOption) &&
      !this._isVisibleAndEnabled(this._selectedOption)
    ) {
      const firstOption = this._firstOption();
      if (firstOption) {
        firstOption.considered = true;
      }
    }
  }

  _resetSearch() {
    if (this._input && this._input.value) {
      this._input.value = '';
      this._searchContent = '';
      for (const option of this.options) {
        option.hidden = false;
      }
    }
  }

  // Validation helpers
  _isValidOption(opt) {
    return opt instanceof RichOption && opt.tagName === 'RICH-OPTION';
  }

  _isValidAndEnabled(opt) {
    return this._isValidOption(opt) && !opt.disabled;
  }

  _isVisibleAndEnabled(opt) {
    return this._isValidAndEnabled(opt) && !opt.hidden;
  }

  // Option navigation
  _allOptions() {
    return Array.from(this.children).filter((el) => el.tagName === 'RICH-OPTION');
  }

  _allValidOptions() {
    return Array.from(this.querySelectorAll('rich-option:not([hidden]):not([disabled])'));
  }

  _getSelected(allOptions) {
    return allOptions.find((opt) => opt.hasAttribute('selected')) || null;
  }

  _firstOption() {
    return this.querySelector('rich-option:not([disabled]):not([hidden])');
  }

  _lastOption() {
    const options = this._allValidOptions();
    return options[options.length - 1] || null;
  }

  _nextOption() {
    const option = this._consideredOption || this._selectedOption;
    if (!this._isValidAndEnabled(option) || option.hidden) {
      return this._firstOption();
    }

    let el = option.nextElementSibling;
    while (el) {
      if (!el.hidden && this._isValidAndEnabled(el)) {
        return el;
      }
      el = el.nextElementSibling;
    }
    return null;
  }

  _previousOption() {
    const option = this._consideredOption || this._selectedOption;
    if (!this._isValidAndEnabled(option) || option.hidden) {
      return this._lastOption();
    }

    let el = option.previousElementSibling;
    while (el) {
      if (!el.hidden && this._isValidAndEnabled(el)) {
        return el;
      }
      el = el.previousElementSibling;
    }
    return null;
  }

  // Positioning
  _attachSelectOptionsToCaller() {
    if (!this._caller || !this._selectOptions) return;

    const callerRect = this._caller.getBoundingClientRect();
    const dropdownRect = this._selectOptions.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - callerRect.bottom;
    const spaceAbove = callerRect.top;

    this._selectOptions.style.minWidth = `${callerRect.width}px`;
    this._selectOptions.style.left = `${callerRect.left}px`;

    // Position below or above based on available space
    if (spaceBelow >= dropdownRect.height || spaceBelow > spaceAbove) {
      this._selectOptions.style.top = `${callerRect.bottom}px`;
      this._selectOptions.style.bottom = 'auto';
      if (this._holder) {
        const maxHeight = Math.min(spaceBelow - 10, 300);
        this._holder.style.maxHeight = `${maxHeight}px`;
      }
    } else {
      this._selectOptions.style.bottom = `${viewportHeight - callerRect.top}px`;
      this._selectOptions.style.top = 'auto';
      if (this._holder) {
        const searchHeight = this.search ? this._searchElm.offsetHeight : 0;
        const maxHeight = Math.min(spaceAbove - searchHeight - 10, 300);
        this._holder.style.maxHeight = `${maxHeight}px`;
      }
    }
  }

  _releaseSelectOptions() {
    if (this._holder) {
      this._holder.style.maxHeight = '';
    }
    if (this._selectOptions) {
      this._selectOptions.style.top = '';
      this._selectOptions.style.bottom = '';
      this._selectOptions.style.left = '';
      this._selectOptions.style.right = '';
    }
  }

  // Events
  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  _isTypingKey(keyCode) {
    return (
      (keyCode > 47 && keyCode < 58) || // 0-9
      keyCode === 32 || // space
      (keyCode > 64 && keyCode < 91) || // A-Z
      (keyCode > 95 && keyCode < 112) || // numpad
      (keyCode > 185 && keyCode < 193) || // ;=,-./`
      (keyCode > 218 && keyCode < 223) // [\]'
    );
  }

  render() {
    return html`
      <div id="caller">
        <span id="chosen"></span>
        <span id="arrow">
          <span>&#9662;</span>
        </span>
      </div>
      <section id="selectOptions">
        <div id="search">
          <input type="text" spellcheck="false" tabindex="-1" placeholder=${this.placeholder} />
        </div>
        <div id="holder">
          <slot name="option"></slot>
        </div>
      </section>
    `;
  }
}

customElements.define('rich-select', RichSelect);
