import { LitElement, html, css } from 'lit';

/**
 * Accordion item web component - used inside behaviour-accordion.
 *
 * @element accordion-item
 * @slot header - Header content for the item
 * @slot - Default slot for panel content
 * @fires toggle - Fired when item is toggled
 */
export class AccordionItem extends LitElement {
  static properties = {
    /** Whether the item is expanded */
    expanded: { type: Boolean, reflect: true },
    /** Whether the item is disabled */
    disabled: { type: Boolean, reflect: true },
    /** Header text (alternative to slot) */
    header: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--accordion-border, #e5e7eb);
      border-radius: var(--accordion-radius, 8px);
      overflow: hidden;
      margin-bottom: -1px;
    }

    :host(:first-child) {
      border-top-left-radius: var(--accordion-radius, 8px);
      border-top-right-radius: var(--accordion-radius, 8px);
    }

    :host(:last-child) {
      border-bottom-left-radius: var(--accordion-radius, 8px);
      border-bottom-right-radius: var(--accordion-radius, 8px);
      margin-bottom: 0;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--accordion-header-padding, 1rem);
      background: var(--accordion-header-bg, #f9fafb);
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }

    .header:hover {
      background: var(--accordion-header-hover, #f3f4f6);
    }

    .header:focus {
      outline: 2px solid var(--accordion-focus, #3b82f6);
      outline-offset: -2px;
    }

    .header-content {
      font-weight: 500;
      color: var(--accordion-header-text, #1f2937);
    }

    .icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
      color: var(--accordion-icon, #6b7280);
    }

    :host([expanded]) .icon {
      transform: rotate(180deg);
    }

    .panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    :host([expanded]) .panel {
      max-height: var(--accordion-max-height, 1000px);
    }

    .content {
      padding: var(--accordion-content-padding, 1rem);
      background: var(--accordion-content-bg, #fff);
      color: var(--accordion-content-text, #4b5563);
    }
  `;

  constructor() {
    super();
    this.expanded = false;
    this.disabled = false;
    this.header = '';
  }

  _toggle() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { expanded: !this.expanded },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggle();
    }
  }

  render() {
    return html`
      <div
        class="header"
        role="button"
        tabindex="${this.disabled ? -1 : 0}"
        aria-expanded="${this.expanded}"
        aria-disabled="${this.disabled}"
        @click="${this._toggle}"
        @keydown="${this._handleKeydown}"
      >
        <div class="header-content">
          <slot name="header">${this.header}</slot>
        </div>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <div class="panel">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

/**
 * Accordion container web component.
 *
 * @element behaviour-accordion
 * @slot - Default slot for accordion-item elements
 * @fires item-toggle - Fired when any item is toggled
 * @cssprop --accordion-border - Border color (default: #e5e7eb)
 * @cssprop --accordion-radius - Border radius (default: 8px)
 * @cssprop --accordion-header-bg - Header background (default: #f9fafb)
 * @cssprop --accordion-header-hover - Header hover background (default: #f3f4f6)
 * @cssprop --accordion-header-text - Header text color (default: #1f2937)
 * @cssprop --accordion-content-bg - Content background (default: #fff)
 * @cssprop --accordion-content-text - Content text color (default: #4b5563)
 * @cssprop --accordion-icon - Icon color (default: #6b7280)
 * @cssprop --accordion-focus - Focus outline color (default: #3b82f6)
 */
export class BehaviourAccordion extends LitElement {
  static properties = {
    /** Allow multiple items to be expanded simultaneously */
    multiple: { type: Boolean },
    /** Index of initially expanded item(s) */
    expanded: {
      type: Array,
      converter: {
        fromAttribute: (value) =>
          value ? value.split(',').map((v) => parseInt(v.trim(), 10)) : [],
        toAttribute: (value) => (Array.isArray(value) ? value.join(',') : ''),
      },
    },
  };

  static styles = css`
    :host {
      display: block;
    }

    ::slotted(accordion-item) {
      display: block;
    }

    ::slotted(accordion-item:not(:last-child)) {
      margin-bottom: -1px;
    }
  `;

  constructor() {
    super();
    this.multiple = false;
    this.expanded = [];
  }

  firstUpdated() {
    this._updateItems();
    this.addEventListener('toggle', this._handleItemToggle.bind(this));
  }

  updated(changedProps) {
    if (changedProps.has('expanded')) {
      this._updateItems();
    }
  }

  _getItems() {
    return [...this.querySelectorAll('accordion-item')];
  }

  _updateItems() {
    const items = this._getItems();
    items.forEach((item, index) => {
      item.expanded = this.expanded.includes(index);
    });
  }

  _handleItemToggle(e) {
    e.stopPropagation();

    const items = this._getItems();
    const index = items.indexOf(e.target);

    if (index === -1) return;

    let newExpanded;

    if (this.multiple) {
      if (this.expanded.includes(index)) {
        newExpanded = this.expanded.filter((i) => i !== index);
      } else {
        newExpanded = [...this.expanded, index];
      }
    } else {
      if (this.expanded.includes(index)) {
        newExpanded = [];
      } else {
        newExpanded = [index];
      }
    }

    this.expanded = newExpanded;
    this._updateItems();

    this.dispatchEvent(
      new CustomEvent('item-toggle', {
        detail: {
          index,
          expanded: newExpanded.includes(index),
          expandedItems: newExpanded,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Expand a specific item by index */
  expand(index) {
    if (!this.expanded.includes(index)) {
      if (this.multiple) {
        this.expanded = [...this.expanded, index];
      } else {
        this.expanded = [index];
      }
      this._updateItems();
    }
  }

  /** Collapse a specific item by index */
  collapse(index) {
    if (this.expanded.includes(index)) {
      this.expanded = this.expanded.filter((i) => i !== index);
      this._updateItems();
    }
  }

  /** Toggle a specific item by index */
  toggle(index) {
    if (this.expanded.includes(index)) {
      this.collapse(index);
    } else {
      this.expand(index);
    }
  }

  /** Expand all items (only works in multiple mode) */
  expandAll() {
    if (this.multiple) {
      this.expanded = this._getItems().map((_, i) => i);
      this._updateItems();
    }
  }

  /** Collapse all items */
  collapseAll() {
    this.expanded = [];
    this._updateItems();
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('accordion-item', AccordionItem);
customElements.define('behaviour-accordion', BehaviourAccordion);
