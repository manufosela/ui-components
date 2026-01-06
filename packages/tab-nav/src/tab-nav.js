import { LitElement, html, css } from 'lit';

/**
 * Tab panel component - used inside tab-nav.
 *
 * @element tab-panel
 * @slot - Default slot for panel content
 */
export class TabPanel extends LitElement {
  static properties = {
    /** Tab label/title */
    label: { type: String },
    /** Whether this tab is disabled */
    disabled: { type: Boolean, reflect: true },
    /** Icon (optional, displayed before label) */
    icon: { type: String },
    /** Internal: whether panel is active */
    _active: { state: true },
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([active]) {
      display: block;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.disabled = false;
    this.icon = '';
    this._active = false;
  }

  updated(changedProps) {
    if (changedProps.has('_active')) {
      if (this._active) {
        this.setAttribute('active', '');
      } else {
        this.removeAttribute('active');
      }
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

/**
 * Tab navigation web component.
 *
 * @element tab-nav
 * @slot - Default slot for tab-panel elements
 * @fires tab-change - Fired when active tab changes
 * @cssprop --tab-bg - Tab bar background (default: #f9fafb)
 * @cssprop --tab-border - Border color (default: #e5e7eb)
 * @cssprop --tab-text - Tab text color (default: #6b7280)
 * @cssprop --tab-active-text - Active tab text (default: #1f2937)
 * @cssprop --tab-active-border - Active indicator color (default: #3b82f6)
 * @cssprop --tab-hover-bg - Tab hover background (default: #f3f4f6)
 * @cssprop --tab-focus - Focus outline color (default: #3b82f6)
 * @cssprop --tab-disabled - Disabled tab color (default: #d1d5db)
 */
export class TabNav extends LitElement {
  static properties = {
    /** Index of active tab */
    selected: { type: Number, reflect: true },
    /** Tab position: top, bottom, left, right */
    position: { type: String },
    /** Fill available width equally */
    fill: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-direction: column;
    }

    .container.position-bottom {
      flex-direction: column-reverse;
    }

    .container.position-left {
      flex-direction: row;
    }

    .container.position-right {
      flex-direction: row-reverse;
    }

    .tabs {
      display: flex;
      background: var(--tab-bg, #f9fafb);
      border-bottom: 1px solid var(--tab-border, #e5e7eb);
      gap: 0;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .tabs::-webkit-scrollbar {
      display: none;
    }

    .container.position-bottom .tabs {
      border-bottom: none;
      border-top: 1px solid var(--tab-border, #e5e7eb);
    }

    .container.position-left .tabs,
    .container.position-right .tabs {
      flex-direction: column;
      border-bottom: none;
      overflow-x: visible;
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .container.position-left .tabs::-webkit-scrollbar,
    .container.position-right .tabs::-webkit-scrollbar {
      display: none;
    }

    .container.position-left .tabs {
      border-right: 1px solid var(--tab-border, #e5e7eb);
    }

    .container.position-right .tabs {
      border-left: 1px solid var(--tab-border, #e5e7eb);
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      color: var(--tab-text, #6b7280);
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
      transition:
        color 0.2s,
        background-color 0.2s;
    }

    :host([fill]) .tab {
      flex: 1;
      justify-content: center;
    }

    .tab:hover:not(.disabled) {
      background: var(--tab-hover-bg, #f3f4f6);
      color: var(--tab-active-text, #1f2937);
    }

    .tab:focus {
      outline: none;
    }

    .tab:focus-visible {
      outline: 2px solid var(--tab-focus, #3b82f6);
      outline-offset: -2px;
    }

    .tab.active {
      color: var(--tab-active-text, #1f2937);
    }

    .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--tab-active-border, #3b82f6);
    }

    .container.position-bottom .tab.active::after {
      bottom: auto;
      top: -1px;
    }

    .container.position-left .tab.active::after,
    .container.position-right .tab.active::after {
      bottom: 0;
      top: 0;
      width: 2px;
      height: auto;
    }

    .container.position-left .tab.active::after {
      left: auto;
      right: -1px;
    }

    .container.position-right .tab.active::after {
      left: -1px;
      right: auto;
    }

    .tab.disabled {
      color: var(--tab-disabled, #d1d5db);
      cursor: not-allowed;
    }

    .tab-icon {
      font-size: 1.1em;
    }

    .panels {
      flex: 1;
      padding: var(--tab-panel-padding, 1rem);
    }
  `;

  constructor() {
    super();
    this.selected = 0;
    this.position = 'top';
    this.fill = false;
  }

  firstUpdated() {
    this._updatePanels();
  }

  updated(changedProps) {
    if (changedProps.has('selected')) {
      this._updatePanels();
    }
  }

  _getPanels() {
    return [...this.querySelectorAll('tab-panel')];
  }

  _updatePanels() {
    const panels = this._getPanels();
    panels.forEach((panel, index) => {
      panel._active = index === this.selected;
    });
  }

  _selectTab(index) {
    const panels = this._getPanels();
    if (panels[index]?.disabled) return;
    if (index === this.selected) return;

    this.selected = index;
    this._updatePanels();

    this.dispatchEvent(
      new CustomEvent('tab-change', {
        detail: {
          index,
          label: panels[index]?.label || '',
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleKeydown(e, _index) {
    const panels = this._getPanels();
    const enabledIndices = panels
      .map((p, i) => ({ disabled: p.disabled, index: i }))
      .filter((p) => !p.disabled)
      .map((p) => p.index);

    if (enabledIndices.length === 0) return;

    let targetIndex = null;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const currentPos = enabledIndices.indexOf(this.selected);
        const prevPos = currentPos <= 0 ? enabledIndices.length - 1 : currentPos - 1;
        targetIndex = enabledIndices[prevPos];
        break;
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const currentPos = enabledIndices.indexOf(this.selected);
        const nextPos = currentPos >= enabledIndices.length - 1 ? 0 : currentPos + 1;
        targetIndex = enabledIndices[nextPos];
        break;
      }
      case 'Home': {
        e.preventDefault();
        targetIndex = enabledIndices[0];
        break;
      }
      case 'End': {
        e.preventDefault();
        targetIndex = enabledIndices[enabledIndices.length - 1];
        break;
      }
    }

    if (targetIndex !== null) {
      this._selectTab(targetIndex);
      this.shadowRoot.querySelectorAll('.tab')[targetIndex]?.focus();
    }
  }

  /** Select a tab by index */
  select(index) {
    this._selectTab(index);
  }

  /** Get the currently selected panel element */
  getSelectedPanel() {
    return this._getPanels()[this.selected];
  }

  render() {
    const panels = this._getPanels();

    return html`
      <div class="container position-${this.position}">
        <div class="tabs" role="tablist">
          ${panels.map(
            (panel, index) => html`
              <button
                class="tab ${index === this.selected ? 'active' : ''} ${panel.disabled
                  ? 'disabled'
                  : ''}"
                role="tab"
                tabindex="${index === this.selected ? 0 : -1}"
                aria-selected="${index === this.selected}"
                aria-disabled="${panel.disabled}"
                @click="${() => this._selectTab(index)}"
                @keydown="${(e) => this._handleKeydown(e, index)}"
              >
                ${panel.icon ? html`<span class="tab-icon">${panel.icon}</span>` : ''}
                ${panel.label}
              </button>
            `
          )}
        </div>
        <div class="panels" role="tabpanel">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('tab-panel', TabPanel);
customElements.define('tab-nav', TabNav);
