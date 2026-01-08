import { LitElement, html, css } from 'lit';

/**
 * Step indicator web component with circular progress visualization.
 *
 * @element circle-steps
 * @fires step-click - Fired when a step is clicked (if clickable)
 * @fires step-change - Fired when current step changes
 * @cssprop [--steps-size=40px] - Circle size
 * @cssprop [--steps-pending=#e5e7eb] - Pending step color
 * @cssprop [--steps-active=#3b82f6] - Active step color
 * @cssprop [--steps-complete=#22c55e] - Completed step color
 * @cssprop [--steps-text=#1f2937] - Text color
 * @cssprop [--steps-line=#e5e7eb] - Connector line color
 * @cssprop [--steps-line-complete=#22c55e] - Completed connector
 */
export class CircleSteps extends LitElement {
  static properties = {
    /** Array of step objects [{label, description}] or number of steps */
    steps: {
      type: Array,
      converter: {
        fromAttribute: (value) => {
          const num = parseInt(value, 10);
          if (!isNaN(num)) {
            return Array.from({ length: num }, (_, i) => ({ label: `Step ${i + 1}` }));
          }
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        },
      },
    },
    /** Current step index (0-based) */
    current: { type: Number, reflect: true },
    /** Orientation: horizontal or vertical */
    orientation: { type: String },
    /** Allow clicking on steps to navigate */
    clickable: { type: Boolean },
    /** Show step numbers in circles */
    showNumbers: { type: Boolean, attribute: 'show-numbers' },
    /** Hide step numbers (declarative alternative) */
    hideNumbers: { type: Boolean, attribute: 'hide-numbers' },
    /** Show checkmarks for completed steps */
    showCheck: { type: Boolean, attribute: 'show-check' },
    /** Hide checkmarks (declarative alternative) */
    hideCheck: { type: Boolean, attribute: 'hide-check' },
    /** Size variant: small, medium, large */
    size: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    .container.vertical {
      flex-direction: column;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
    }

    .container.vertical .step {
      flex-direction: row;
      flex: none;
      width: 100%;
      padding: 0.5rem 0;
    }

    .circle-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
    }

    .container.vertical .circle-wrapper {
      width: auto;
      flex-direction: column;
    }

    .line {
      flex: 1;
      height: 2px;
      background: var(--steps-line, #e5e7eb);
      transition: background-color 0.3s;
    }

    .container.vertical .line {
      width: 2px;
      height: 24px;
      flex: none;
    }

    .line.complete {
      background: var(--steps-line-complete, #22c55e);
    }

    .line:first-child {
      visibility: hidden;
    }

    .step:first-child .line:first-child {
      visibility: hidden;
    }

    .step:last-child .line:last-child {
      visibility: hidden;
    }

    .circle {
      width: var(--steps-size, 40px);
      height: var(--steps-size, 40px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      background: var(--steps-pending, #e5e7eb);
      color: #6b7280;
      transition: all 0.3s;
      flex-shrink: 0;
      border: 2px solid transparent;
    }

    :host([size='small']) .circle {
      width: 28px;
      height: 28px;
      font-size: 0.75rem;
    }

    :host([size='large']) .circle {
      width: 56px;
      height: 56px;
      font-size: 1rem;
    }

    .circle.active {
      background: var(--steps-active, #3b82f6);
      color: white;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    }

    .circle.complete {
      background: var(--steps-complete, #22c55e);
      color: white;
    }

    .circle.clickable {
      cursor: pointer;
    }

    .circle.clickable:hover:not(.active) {
      transform: scale(1.1);
    }

    .circle.clickable:focus {
      outline: 2px solid var(--steps-active, #3b82f6);
      outline-offset: 2px;
    }

    .content {
      text-align: center;
      margin-top: 0.75rem;
      max-width: 120px;
    }

    .container.vertical .content {
      text-align: left;
      margin-top: 0;
      margin-left: 1rem;
      max-width: none;
      flex: 1;
    }

    .label {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--steps-text, #1f2937);
    }

    .label.active {
      color: var(--steps-active, #3b82f6);
    }

    .label.complete {
      color: var(--steps-complete, #22c55e);
    }

    .description {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .check-icon {
      width: 20px;
      height: 20px;
    }

    :host([size='small']) .check-icon {
      width: 14px;
      height: 14px;
    }

    :host([size='large']) .check-icon {
      width: 28px;
      height: 28px;
    }
  `;

  constructor() {
    super();
    this.steps = [];
    this.current = -1; // -1 = not started, 0..n-1 = active step, n = all complete
    this.orientation = 'horizontal';
    this.clickable = false;
    this.showNumbers = true;
    this.hideNumbers = false;
    this.showCheck = true;
    this.hideCheck = false;
    this.size = 'medium';
  }

  get _showNumbers() {
    return this.showNumbers && !this.hideNumbers;
  }

  get _showCheck() {
    return this.showCheck && !this.hideCheck;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parseSlottedContent();
  }

  /** Parse slotted elements for declarative steps */
  _parseSlottedContent() {
    const stepElements = this.querySelectorAll('step-item');
    if (stepElements.length > 0) {
      this.steps = Array.from(stepElements).map((el) => ({
        label: el.getAttribute('label') || el.textContent.trim() || '',
        description: el.getAttribute('description') || '',
      }));
    }
  }

  _handleStepClick(index) {
    if (!this.clickable) return;

    // If clicking on the current active step and it's the last one, complete all
    if (index === this.current && index === this.steps.length - 1) {
      this.complete();
    } else {
      // Navigate to the clicked step
      this.goToStep(index);
    }

    this.dispatchEvent(
      new CustomEvent('step-click', {
        detail: { index, step: this.steps[index] },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleKeydown(e, index) {
    if (!this.clickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleStepClick(index);
    }
  }

  /** Navigate to a specific step (-1 = not started, 0..n-1 = active, n = all complete) */
  goToStep(index) {
    if (index < -1 || index > this.steps.length) return;

    const oldCurrent = this.current;
    if (index === oldCurrent) return;

    this.current = index;

    this.dispatchEvent(
      new CustomEvent('step-change', {
        detail: {
          oldStep: oldCurrent,
          newStep: index,
          step: index >= 0 && index < this.steps.length ? this.steps[index] : null,
          isComplete: index === this.steps.length,
          isNotStarted: index === -1,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Go to next step (or complete all if on last step) */
  next() {
    if (this.current < this.steps.length) {
      this.goToStep(this.current + 1);
    }
  }

  /** Go to previous step */
  prev() {
    if (this.current > -1) {
      this.goToStep(this.current - 1);
    }
  }

  /** Reset to not started state */
  reset() {
    this.goToStep(-1);
  }

  /** Start from beginning (go to first step) */
  start() {
    this.goToStep(0);
  }

  /** Mark all steps as complete */
  complete() {
    this.goToStep(this.steps.length);
  }

  /** Check if step is completed */
  isComplete(index) {
    // All steps before current are complete
    // When current = steps.length, ALL steps are complete
    return index < this.current;
  }

  /** Check if step is active */
  isActive(index) {
    // When current = -1 (not started) or current = steps.length (all complete), no step is active
    return index === this.current && this.current >= 0 && this.current < this.steps.length;
  }

  _renderCheckIcon() {
    return html`
      <svg
        class="check-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
      >
        <path d="M5 12l5 5L19 7" />
      </svg>
    `;
  }

  _renderCircleContent(index) {
    const isComplete = this.isComplete(index);

    if (isComplete && this._showCheck) {
      return this._renderCheckIcon();
    }

    if (this._showNumbers) {
      return index + 1;
    }

    return '';
  }

  render() {
    const isVertical = this.orientation === 'vertical';

    return html`
      <div class="container ${isVertical ? 'vertical' : ''}">
        ${this.steps.map((step, index) => {
          const isComplete = this.isComplete(index);
          const isActive = this.isActive(index);
          const isPrevComplete = index > 0 && this.isComplete(index - 1);

          return html`
            <div class="step">
              <div class="circle-wrapper">
                ${!isVertical
                  ? html`<div class="line ${isPrevComplete || isComplete ? 'complete' : ''}"></div>`
                  : ''}
                <div
                  class="circle ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''} ${this
                    .clickable
                    ? 'clickable'
                    : ''}"
                  role="${this.clickable ? 'button' : 'presentation'}"
                  tabindex="${this.clickable ? 0 : -1}"
                  aria-current="${isActive ? 'step' : 'false'}"
                  @click="${() => this._handleStepClick(index)}"
                  @keydown="${(e) => this._handleKeydown(e, index)}"
                >
                  ${this._renderCircleContent(index)}
                </div>
                ${!isVertical ? html`<div class="line ${isComplete ? 'complete' : ''}"></div>` : ''}
              </div>
              ${isVertical && index < this.steps.length - 1
                ? html`
                    <div class="circle-wrapper">
                      <div class="line ${isComplete ? 'complete' : ''}"></div>
                    </div>
                  `
                : ''}
              <div class="content">
                <div class="label ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}">
                  ${step.label || ''}
                </div>
                ${step.description ? html`<div class="description">${step.description}</div>` : ''}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

customElements.define('circle-steps', CircleSteps);
