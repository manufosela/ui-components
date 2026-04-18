import { LitElement, html, css } from 'lit';

/**
 * Accordion item web component — wraps native <details>/<summary>.
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
    /** Exclusive group name — set by parent for single-expand mode */
    groupName: { type: String, attribute: 'group-name' },
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

    details {
      /* Reset default details styling */
    }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--accordion-header-padding, 1rem);
      background: var(--accordion-header-bg, #f9fafb);
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
      list-style: none; /* Remove default marker */
    }

    /* Remove default marker in WebKit */
    summary::-webkit-details-marker {
      display: none;
    }

    summary::marker {
      display: none;
      content: '';
    }

    summary:hover {
      background: var(--accordion-header-hover, #f3f4f6);
    }

    summary:focus-visible {
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
      flex-shrink: 0;
    }

    details[open] .icon {
      transform: rotate(180deg);
    }

    .panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.3s ease-out;
    }

    details[open] .panel {
      grid-template-rows: 1fr;
    }

    .panel-inner {
      overflow: hidden;
    }

    .content {
      padding: var(--accordion-content-padding, 1rem);
      background: var(--accordion-content-bg, #fff);
      color: var(--accordion-content-text, #4b5563);
    }

    @media (prefers-reduced-motion: reduce) {
      summary,
      .icon,
      .panel {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.expanded = false;
    this.disabled = false;
    this.header = '';
    this.groupName = '';
  }

  updated(changed) {
    if (changed.has('expanded')) {
      const details = this.shadowRoot?.querySelector('details');
      if (details) {
        details.open = this.expanded;
      }
    }
  }

  /** @private Handle the native <details> toggle event */
  _handleToggle(e) {
    const details = e.target;
    const wasExpanded = this.expanded;
    this.expanded = details.open;

    if (wasExpanded !== this.expanded) {
      this.dispatchEvent(
        new CustomEvent('toggle', {
          detail: { expanded: this.expanded },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /** @private Prevent toggle on disabled items */
  _handleClick(e) {
    if (this.disabled) {
      e.preventDefault();
    }
  }

  render() {
    return html`
      <details
        ?open="${this.expanded}"
        .name="${this.groupName || ''}"
        @toggle="${this._handleToggle}"
      >
        <summary
          role="button"
          aria-expanded="${this.expanded}"
          aria-disabled="${this.disabled}"
          tabindex="${this.disabled ? -1 : 0}"
          @click="${this._handleClick}"
        >
          <span class="header-content">
            ${this.header ? html`${this.header}` : html`<slot name="header"></slot>`}
          </span>
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </summary>
        <div class="panel">
          <div class="panel-inner">
            <div class="content">
              <slot></slot>
            </div>
          </div>
        </div>
      </details>
    `;
  }
}

/**
 * Accordion container — manages <accordion-item> children.
 *
 * Uses native <details name="..."> for exclusive mode (single expand)
 * and adds Arrow key navigation, expand/collapseAll, and theming.
 *
 * @element behaviour-accordion
 * @slot - Accordion items
 * @fires item-toggle - Fired when any child item is toggled
 *
 * @attr {Boolean} multiple - Allow multiple items to be expanded
 * @attr {String} expanded - Comma-separated list of initially expanded indices
 *
 * @cssprop [--accordion-border=#e5e7eb] - Border color
 * @cssprop [--accordion-radius=8px] - Border radius
 * @cssprop [--accordion-header-bg=#f9fafb] - Header background
 * @cssprop [--accordion-header-hover=#f3f4f6] - Header hover background
 * @cssprop [--accordion-header-text=#1f2937] - Header text color
 * @cssprop [--accordion-header-padding=1rem] - Header padding
 * @cssprop [--accordion-content-bg=#fff] - Content background
 * @cssprop [--accordion-content-text=#4b5563] - Content text color
 * @cssprop [--accordion-content-padding=1rem] - Content padding
 * @cssprop [--accordion-icon=#6b7280] - Icon color
 * @cssprop [--accordion-focus=#3b82f6] - Focus outline color
 */
export class BehaviourAccordion extends LitElement {
  static properties = {
    /** Allow multiple items to be expanded simultaneously */
    multiple: { type: Boolean, reflect: true },
    /** Comma-separated indices of initially expanded items */
    expanded: {
      type: Array,
      converter: {
        fromAttribute(value) {
          if (!value) return [];
          return value
            .split(',')
            .map(Number)
            .filter((n) => !Number.isNaN(n));
        },
        toAttribute(value) {
          return value?.join(',') ?? '';
        },
      },
      reflect: true,
    },
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.multiple = false;
    this.expanded = [];
    this._boundHandleKeydown = this._handleKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._boundHandleKeydown);
    // Apply initial state after items are in the DOM
    this.updateComplete.then(() => this._updateItems());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._boundHandleKeydown);
  }

  updated(changed) {
    if (changed.has('multiple') || changed.has('expanded')) {
      this._updateItems();
    }
  }

  /** @private */
  _getItems() {
    return [...this.querySelectorAll('accordion-item')];
  }

  /** @private Sync child items with parent state */
  _updateItems() {
    const items = this._getItems();
    items.forEach((item, i) => {
      item.expanded = this.expanded.includes(i);
    });
  }

  /** @private Handle toggle events from child items */
  _handleToggle(e) {
    if (e.target.tagName !== 'ACCORDION-ITEM') return;

    const items = this._getItems();
    const index = items.indexOf(e.target);
    if (index === -1) return;

    const isExpanding = e.target.expanded;

    // In single mode, collapse other items when one expands
    if (!this.multiple && isExpanding) {
      items.forEach((item, i) => {
        if (i !== index && item.expanded) {
          item.expanded = false;
        }
      });
    }

    // Read current state from the items
    const newExpanded = items.map((item, i) => (item.expanded ? i : -1)).filter((i) => i !== -1);

    this.expanded = newExpanded;

    this.dispatchEvent(
      new CustomEvent('item-toggle', {
        detail: {
          index,
          expanded: e.detail?.expanded ?? e.target.expanded,
          expandedItems: newExpanded,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** @private Arrow key navigation between items */
  _handleKeydown(e) {
    const items = this._getItems().filter((item) => !item.disabled);
    if (items.length === 0) return;

    const current = e.target.closest('accordion-item');
    const enabledIndex = items.indexOf(current);
    if (enabledIndex === -1) return;

    let target;
    switch (e.key) {
      case 'ArrowDown':
        target = items[(enabledIndex + 1) % items.length];
        break;
      case 'ArrowUp':
        target = items[(enabledIndex - 1 + items.length) % items.length];
        break;
      case 'Home':
        target = items[0];
        break;
      case 'End':
        target = items.at(-1);
        break;
      default:
        return;
    }

    e.preventDefault();
    target?.shadowRoot?.querySelector('summary')?.focus();
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
    return html`<slot @toggle="${this._handleToggle}"></slot>`;
  }
}

customElements.define('accordion-item', AccordionItem);
customElements.define('behaviour-accordion', BehaviourAccordion);
