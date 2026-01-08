import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { NavListStyles } from './nav-list.styles.js';

/**
 * Horizontal navigation list web component with selection support.
 *
 * @element nav-list
 * @fires navlist-changed - Fired when selection changes. Detail: { value, pos, id }
 *
 * @cssprop [--nav-list-gap=5px] - Gap between items
 * @cssprop [--nav-list-padding=10px 20px] - Item padding
 * @cssprop [--nav-list-font-size=14px] - Font size
 * @cssprop [--nav-list-letter-spacing=2px] - Letter spacing
 * @cssprop [--nav-list-border-radius=4px] - Border radius
 * @cssprop [--nav-list-border-color=transparent] - Border color
 * @cssprop [--nav-list-selected-border-color=#cc3743] - Selected border color
 * @cssprop [--nav-list-selected-bg=transparent] - Selected background
 * @cssprop [--nav-list-hover-bg=rgba(0,0,0,0.05] - Hover background)
 * @cssprop [--nav-list-title-size=16px] - Title font size
 * @cssprop [--nav-list-title-weight=700] - Title font weight
 */
export class NavList extends LitElement {
  static properties = {
    /** Array of values to display in the list */
    listValues: { type: Array },
    /** Currently selected value */
    selected: { type: String },
    /** Title displayed above the list */
    title: { type: String },
    /** If true, selection is disabled */
    fixed: { type: Boolean },
    /** If true, listens for external navlist-next/navlist-last events */
    listenEvents: { type: Boolean, attribute: 'listen-events' },
    /** Internal: shows pointer cursor */
    _cursorPointer: { type: Boolean, state: true },
  };

  static styles = [NavListStyles];

  constructor() {
    super();
    this.listValues = [];
    this.selected = null;
    this.title = '';
    this.fixed = false;
    this.listenEvents = false;
    this._cursorPointer = true;
    this._boundGetNextVal = this._getNextVal.bind(this);
    this._boundGetLastVal = this._getLastVal.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._cursorPointer = !this.fixed;
    this._initFromLightDom();

    if (this.listenEvents) {
      this._cursorPointer = false;
      document.addEventListener('navlist-next', this._boundGetNextVal);
      document.addEventListener('navlist-last', this._boundGetLastVal);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.listenEvents) {
      document.removeEventListener('navlist-next', this._boundGetNextVal);
      document.removeEventListener('navlist-last', this._boundGetLastVal);
    }
  }

  firstUpdated() {
    const mainLayer = this.shadowRoot.getElementById('main');
    if (mainLayer) {
      mainLayer.classList.add('fadein');
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('selected') && this.selected) {
      const radio = this.shadowRoot.querySelector(`[id='navlist-item__${this.selected}']`);
      if (radio) {
        radio.checked = true;
      }
    }
  }

  _initFromLightDom() {
    const liElements = [...this.querySelectorAll('ul > li')];
    if (liElements.length > 0) {
      this.listValues = liElements.map((li) => li.textContent.trim());
    }
  }

  _getNextVal(ev) {
    const id = ev.detail?.id;
    if (this.id === id) {
      const pos = this.listValues.indexOf(this.selected);
      if (pos < this.listValues.length - 1) {
        this._setValue(this.listValues[pos + 1]);
      }
    }
  }

  _getLastVal(ev) {
    const id = ev.detail?.id;
    if (this.id === id) {
      const pos = this.listValues.indexOf(this.selected);
      if (pos > 0) {
        this._setValue(this.listValues[pos - 1]);
      }
    }
  }

  _setValue(val) {
    this.selected = val;
    const id = this.id || 'no-id';
    this.dispatchEvent(
      new CustomEvent('navlist-changed', {
        detail: {
          value: this.selected,
          pos: this.listValues.indexOf(this.selected),
          id,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleClick(val) {
    if (!this.fixed) {
      this._setValue(val);
    }
  }

  _handleKeydown(ev, val) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._handleClick(val);
    }
  }

  render() {
    return html`
      <div id="main" class="navlist off">
        ${this.title ? html`<div class="navlist__title">${this.title}</div>` : ''}
        <div class="navlist__group" role="radiogroup" aria-label="${this.title || 'Navigation'}">
          ${this.listValues.map(
            (val) => html`
              <label
                class=${classMap({
                  navlist__item: true,
                  'navlist__item--selected': this.selected === val,
                  'navlist__item--clickable': this._cursorPointer,
                })}
                tabindex="${this.fixed ? -1 : 0}"
                role="radio"
                aria-checked="${this.selected === val}"
                @click="${() => this._handleClick(val)}"
                @keydown="${(e) => this._handleKeydown(e, val)}"
              >
                <input
                  type="radio"
                  class="navlist__radio"
                  name="navlist-${this.id || 'default'}"
                  id="navlist-item__${val}"
                  .checked="${this.selected === val}"
                  ?disabled="${this.fixed}"
                />
                <span class="navlist__text">${val}</span>
              </label>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('nav-list', NavList);
