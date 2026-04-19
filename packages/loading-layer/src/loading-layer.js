import { LitElement, html, svg, css } from 'lit';

/**
 * A declarative loading phase child element.
 *
 * @element loading-phase
 * @attr {String} message - Text to display during this phase
 * @attr {Number} delay - Seconds from show() to auto-advance to this phase (absolute, not relative)
 * @attr {String} event - Document event name that triggers this phase
 * @attr {Number} auto-close - Seconds after entering this phase to auto-close the loading layer
 */
export class LoadingPhase extends HTMLElement {
  get message() {
    return this.getAttribute('message') ?? '';
  }
  get delay() {
    return Number(this.getAttribute('delay')) || 0;
  }
  get event() {
    return this.getAttribute('event') ?? '';
  }
  get autoClose() {
    return Number(this.getAttribute('auto-close')) || 0;
  }
}

customElements.define('loading-phase', LoadingPhase);

/**
 * A loading overlay component with animated spinner and multi-phase messages.
 *
 * @element loading-layer
 * @fires loading-layer-shown - Fired when the loading layer is shown
 * @fires loading-layer-hidden - Fired when the loading layer is hidden
 * @fires loading-layer-complete - Fired when hide() is called, with duration and reason
 * @fires loading-layer-phase-change - Fired when the active phase changes
 *
 * @attr {Boolean} visible - Whether the loading layer is visible
 * @attr {String} message - Optional message to display below the spinner (used when no <loading-phase> children)
 * @attr {Number} size - Size of the spinner in pixels (default: 60)
 * @attr {String} color - Color of the spinner (default: #3b82f6)
 * @attr {Number} stroke-width - Width of the spinner stroke (default: 4)
 * @attr {Number} timeout - Auto-hide timeout in seconds (0 = no auto-hide)
 *
 * @cssprop [--loading-layer-bg=rgba(0,0,0,0.5)] - Background color (dialog::backdrop)
 * @cssprop [--loading-layer-z-index=9999] - Z-index (unused with dialog top-layer, kept for compat)
 * @cssprop [--loading-layer-transition=0.3s] - Transition duration
 * @cssprop [--loading-layer-spin-duration=1s] - Spin animation duration
 * @cssprop [--loading-layer-text-color=#fff] - Message text color
 * @cssprop [--loading-layer-font-family=inherit] - Message font family
 * @cssprop [--loading-layer-font-size=1rem] - Message font size
 * @cssprop [--loading-layer-phase-transition=0.4s] - Phase message transition duration
 */
export class LoadingLayer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    dialog {
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
      outline: none;
    }

    dialog[open] {
      max-width: 100vw;
      max-height: 100vh;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn var(--loading-layer-transition, 0.3s) ease;
    }

    dialog::backdrop {
      background: var(--loading-layer-bg, rgba(0, 0, 0, 0.5));
    }

    dialog[open]::backdrop {
      animation: fadeIn var(--loading-layer-transition, 0.3s) ease;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      animation: spin var(--loading-layer-spin-duration, 1s) linear infinite;
    }

    .message {
      color: var(--loading-layer-text-color, #fff);
      font-family: var(--loading-layer-font-family, inherit);
      font-size: var(--loading-layer-font-size, 1rem);
      text-align: center;
      transition: opacity var(--loading-layer-phase-transition, 0.4s) ease;
      min-height: 1.5em;
    }

    .phase-dots {
      display: flex;
      gap: 6px;
      justify-content: center;
      margin-top: 0.75rem;
    }

    .phase-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: background 0.3s;
    }

    .phase-dot.active {
      background: var(--loading-layer-text-color, #fff);
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation: none;
      }

      dialog[open],
      dialog[open]::backdrop {
        animation: none;
      }

      .message {
        transition: none;
      }
    }
  `;

  static properties = {
    visible: { type: Boolean, reflect: true },
    message: { type: String },
    size: { type: Number },
    color: { type: String },
    strokeWidth: { type: Number, attribute: 'stroke-width' },
    timeout: { type: Number },
    _currentMessage: { type: String, state: true },
    _currentPhase: { type: Number, state: true },
    _phases: { type: Array, state: true },
  };

  constructor() {
    super();
    this.visible = false;
    this.message = '';
    this.size = 60;
    this.color = '#3b82f6';
    this.strokeWidth = 4;
    this.timeout = 0;

    this._timeoutId = null;
    this._showTime = null;
    this._currentMessage = '';
    this._currentPhase = 0;
    this._phases = [];
    this._phaseTimers = [];
    this._phaseEventHandlers = [];
    this._autoCloseTimer = null;
    this._hideReason = 'manual';

    this._handleShowEvent = this._handleShowEvent.bind(this);
    this._handleHideEvent = this._handleHideEvent.bind(this);
    this._handlePhaseEvent = this._handlePhaseEvent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('loading-layer-show', this._handleShowEvent);
    document.addEventListener('loading-layer-hide', this._handleHideEvent);
    document.addEventListener('loading-layer-phase', this._handlePhaseEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('loading-layer-show', this._handleShowEvent);
    document.removeEventListener('loading-layer-hide', this._handleHideEvent);
    document.removeEventListener('loading-layer-phase', this._handlePhaseEvent);
    this._clearAllTimers();
    this._clearPhaseEventListeners();
  }

  // ─── Global event handlers ────────────────────────────────────────────────

  _handleShowEvent(e) {
    // If targeting a specific loading-layer by id, skip if not us
    const targetId = e.detail?.id;
    if (targetId && targetId !== this.id) return;

    // Prevent multiple loading-layers from activating simultaneously
    if (this.visible) return;

    if (e.detail?.message) {
      this.message = e.detail.message;
    }
    this.show();
  }

  _handleHideEvent(e) {
    // If targeting a specific loading-layer by id, skip if not us
    const targetId = e.detail?.id;
    if (targetId && targetId !== this.id) return;

    this._hideReason = 'event';
    this.hide();
  }

  _handlePhaseEvent(e) {
    const targetId = e.detail?.id;
    if (targetId && targetId !== this.id) return;
    if (!this.visible) return;

    const phase = e.detail?.phase;
    if (typeof phase === 'number') {
      this.setPhase(phase);
    }
  }

  // ─── Phase management ─────────────────────────────────────────────────────

  _readPhases() {
    return Array.from(this.querySelectorAll('loading-phase'));
  }

  _clearAllTimers() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    if (this._autoCloseTimer) {
      clearTimeout(this._autoCloseTimer);
      this._autoCloseTimer = null;
    }
    for (const id of this._phaseTimers) {
      clearTimeout(id);
    }
    this._phaseTimers = [];
  }

  _clearPhaseEventListeners() {
    for (const { eventName, handler } of this._phaseEventHandlers) {
      document.removeEventListener(eventName, handler);
    }
    this._phaseEventHandlers = [];
  }

  _schedulePhases(phases) {
    this._clearPhaseEventListeners();

    phases.forEach((phase, index) => {
      // Phases after index 0 — schedule transitions
      if (index === 0) return;

      // By delay (absolute from show() time)
      if (phase.delay > 0) {
        const id = setTimeout(() => {
          this.setPhase(index, 'timer');
        }, phase.delay * 1000);
        this._phaseTimers.push(id);
      }

      // By event name
      if (phase.event) {
        const handler = () => {
          this.setPhase(index, 'event');
        };
        document.addEventListener(phase.event, handler, { once: true });
        this._phaseEventHandlers.push({ eventName: phase.event, handler });
      }
    });
  }

  /**
   * Advance to a specific phase by index.
   * @param {number} index
   * @param {'manual'|'timer'|'event'} [trigger='manual']
   */
  setPhase(index) {
    const phases = this._phases;
    if (!phases.length || index < 0 || index >= phases.length) return;
    if (index === this._currentPhase) return;

    this._currentPhase = index;
    this._currentMessage = phases[index].message;

    this.dispatchEvent(
      new CustomEvent('loading-layer-phase-change', {
        bubbles: true,
        composed: true,
        detail: { phase: index, message: this._currentMessage },
      })
    );

    // Handle auto-close on last phase
    const isLastPhase = index === phases.length - 1;
    if (isLastPhase && phases[index].autoClose > 0) {
      if (this._autoCloseTimer) clearTimeout(this._autoCloseTimer);
      this._autoCloseTimer = setTimeout(() => {
        this._hideReason = 'phases-complete';
        this.hide();
      }, phases[index].autoClose * 1000);
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  show() {
    this._showTime = Date.now();
    this._hideReason = 'manual';

    const phases = this._readPhases();
    this._phases = phases;
    this._currentPhase = 0;
    this._currentMessage = phases.length > 0 ? phases[0].message : this.message;

    this.visible = true;

    // Open the dialog after render
    this.updateComplete.then(() => {
      const dialog = this.shadowRoot?.querySelector('dialog');
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    });

    this.dispatchEvent(new CustomEvent('loading-layer-shown', { bubbles: true, composed: true }));

    // Schedule phase transitions
    if (phases.length > 1) {
      this._schedulePhases(phases);
    }

    // Legacy timeout
    if (this.timeout > 0) {
      this._timeoutId = setTimeout(() => {
        this._hideReason = 'timeout';
        this.hide();
      }, this.timeout * 1000);
    }
  }

  hide() {
    this._clearAllTimers();
    this._clearPhaseEventListeners();

    const duration = this._showTime ? Date.now() - this._showTime : 0;
    const reason = this._hideReason;

    this.visible = false;

    // Close dialog
    const dialog = this.shadowRoot?.querySelector('dialog');
    if (dialog?.open) {
      dialog.close();
    }

    this.dispatchEvent(new CustomEvent('loading-layer-hidden', { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent('loading-layer-complete', {
        bubbles: true,
        composed: true,
        detail: { reason, duration },
      })
    );

    // Reset phase state
    this._phases = [];
    this._currentPhase = 0;
    this._currentMessage = '';
    this._showTime = null;
    this._hideReason = 'manual';
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // ─── Rendering ────────────────────────────────────────────────────────────

  _renderSpinner() {
    const center = this.size / 2;
    const radius = (this.size - this.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;

    return svg`
      <svg
        class="spinner"
        width="${this.size}"
        height="${this.size}"
        viewBox="0 0 ${this.size} ${this.size}"
        aria-hidden="true"
      >
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="none"
          stroke="${this.color}"
          stroke-width="${this.strokeWidth}"
          stroke-dasharray="${dashArray}"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  _renderPhaseDots() {
    const phases = this._phases;
    if (phases.length < 2) return '';

    return html`
      <div class="phase-dots" aria-hidden="true">
        ${phases.map(
          (_, i) => html`
            <div class="phase-dot ${i === this._currentPhase ? 'active' : ''}"></div>
          `
        )}
      </div>
    `;
  }

  _onDialogCancel(e) {
    // Prevent Escape from closing (this is a loading overlay, not a dismissible modal)
    e.preventDefault();
  }

  render() {
    const displayMessage = this._currentMessage || this.message;

    return html`
      <dialog
        aria-busy="${this.visible}"
        aria-modal="true"
        aria-label="${displayMessage || 'Loading'}"
        @cancel="${this._onDialogCancel}"
      >
        <div class="spinner-container">
          ${this._renderSpinner()}
          <div class="message" aria-live="assertive" role="status">${displayMessage}</div>
          ${this._renderPhaseDots()}
        </div>
      </dialog>
    `;
  }

  updated(changedProps) {
    // Sync dialog open state with visible property when changed externally
    if (changedProps.has('visible')) {
      const dialog = this.shadowRoot?.querySelector('dialog');
      if (!dialog) return;

      if (this.visible && !dialog.open) {
        dialog.showModal();
      } else if (!this.visible && dialog.open) {
        dialog.close();
      }
    }
  }
}

customElements.define('loading-layer', LoadingLayer);

export default LoadingLayer;
