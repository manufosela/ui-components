import { LitElement, html, css } from 'lit';

/**
 * A versatile card component for displaying data with optional cover image,
 * icon, links, and modal info panel.
 *
 * @element data-card
 *
 * @attr {String} card-title - Card heading text
 * @attr {String} description - Card description text
 * @attr {String} url - Link URL when card is clicked
 * @attr {Boolean} newtab - Open link in new tab
 * @attr {String} icon - Icon character or emoji to display
 * @attr {String} group - Group/category label
 * @attr {String} img-cover - URL for cover image
 * @attr {String} cover-bg-color - Background color for cover area
 * @attr {String} text-color - Text color
 * @attr {String} more-info - URL to fetch additional info content
 *
 * @cssprop [--data-card-width=280px] - Card width
 * @cssprop [--data-card-min-height=200px] - Card minimum height
 * @cssprop [--data-card-bg=#ffffff] - Card background color
 * @cssprop [--data-card-border-color=#e5e7eb] - Border color
 * @cssprop [--data-card-border-radius=16px] - Border radius
 * @cssprop [--data-card-shadow=0 4px 6px -1px rgba(0,0,0,0.1)] - Box shadow
 * @cssprop [--data-card-padding=1.5rem] - Card padding
 * @cssprop [--data-card-title-size=1.25rem] - Title font size
 * @cssprop [--data-card-title-color=#1f2937] - Title color
 * @cssprop [--data-card-desc-size=0.875rem] - Description font size
 * @cssprop [--data-card-desc-color=#6b7280] - Description color
 * @cssprop [--data-card-icon-size=3rem] - Icon size
 * @cssprop [--data-card-icon-color=#3b82f6] - Icon color
 * @cssprop [--data-card-cover-height=140px] - Cover image height
 * @cssprop [--data-card-cover-opacity=1] - Cover image opacity
 * @cssprop [--data-card-group-bg=#3b82f6] - Group badge background
 * @cssprop [--data-card-group-color=#ffffff] - Group badge text color
 *
 * @slot - Default slot for additional content
 * @slot footer - Footer content
 *
 * @fires data-card-click - Fired when card is clicked
 */
export class DataCard extends LitElement {
  static properties = {
    cardTitle: { type: String, attribute: 'card-title' },
    description: { type: String },
    url: { type: String },
    newtab: { type: Boolean },
    icon: { type: String },
    group: { type: String },
    imgCover: { type: String, attribute: 'img-cover' },
    coverBgColor: { type: String, attribute: 'cover-bg-color' },
    textColor: { type: String, attribute: 'text-color' },
    moreInfo: { type: String, attribute: 'more-info' },
    _moreInfoContent: { state: true },
    _showMoreInfo: { state: true },
    _loading: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    }

    .card {
      width: var(--data-card-width, 280px);
      min-height: var(--data-card-min-height, 200px);
      background: var(--data-card-bg, #ffffff);
      border: 1px solid var(--data-card-border-color, #e5e7eb);
      border-radius: var(--data-card-border-radius, 16px);
      box-shadow: var(--data-card-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      overflow: hidden;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
      position: relative;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.15);
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .cover {
      height: var(--data-card-cover-height, 140px);
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: var(--data-card-cover-opacity, 1);
    }

    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--data-card-icon-size, 3rem);
      color: var(--data-card-icon-color, #3b82f6);
      padding: 1.5rem;
    }

    .group-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--data-card-group-bg, #3b82f6);
      color: var(--data-card-group-color, #ffffff);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .content {
      padding: var(--data-card-padding, 1.5rem);
    }

    .title {
      margin: 0 0 0.5rem 0;
      font-size: var(--data-card-title-size, 1.25rem);
      font-weight: 600;
      color: var(--data-card-title-color, #1f2937);
      line-height: 1.3;
    }

    .description {
      margin: 0 0 1rem 0;
      font-size: var(--data-card-desc-size, 0.875rem);
      color: var(--data-card-desc-color, #6b7280);
      line-height: 1.5;
    }

    .more-info-trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #3b82f6;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
      transition: color 0.2s;
    }

    .more-info-trigger:hover {
      color: var(--data-card-info-trigger-hover, #2563eb);
    }

    .more-info-panel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--data-card-info-bg, rgba(255, 255, 255, 0.98));
      padding: 1.5rem;
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.3s,
        visibility 0.3s;
      overflow-y: auto;
      z-index: 10;
    }

    .more-info-panel.visible {
      opacity: 1;
      visibility: visible;
    }

    .more-info-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border: none;
      background: var(--data-card-info-close-bg, #f3f4f6);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--data-card-info-close-color, #6b7280);
      transition: background 0.2s;
    }

    .more-info-close:hover {
      background: var(--data-card-info-close-hover-bg, #e5e7eb);
    }

    .more-info-content {
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--data-card-info-text, #374151);
      margin-top: 2rem;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: var(--data-card-loading-color, #6b7280);
    }

    .footer {
      padding: 0 var(--data-card-padding, 1.5rem) var(--data-card-padding, 1.5rem);
      border-top: 1px solid var(--data-card-border-color, #e5e7eb);
    }

    ::slotted(*) {
      margin-top: 0.5rem;
    }

    /* Dark mode support */
    :host-context(.dark) .card {
      --data-card-bg: #1f2937;
      --data-card-border-color: #374151;
      --data-card-title-color: #f9fafb;
      --data-card-desc-color: #9ca3af;
    }

    :host-context(.dark) .more-info-panel {
      background: rgba(31, 41, 55, 0.98);
    }

    :host-context(.dark) .more-info-close {
      background: #374151;
      color: #d1d5db;
    }

    :host-context(.dark) .more-info-content {
      color: #d1d5db;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .card {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .card,
      .more-info-panel,
      .more-info-trigger,
      .more-info-close {
        transition: none;
      }

      .card:hover {
        transform: none;
      }
    }
  `;

  constructor() {
    super();
    this.cardTitle = '';
    this.description = '';
    this.url = '';
    this.newtab = false;
    this.icon = '';
    this.group = '';
    this.imgCover = '';
    this.coverBgColor = '';
    this.textColor = '';
    this.moreInfo = '';
    this._moreInfoContent = '';
    this._showMoreInfo = false;
    this._loading = false;
  }

  async _fetchMoreInfo() {
    if (!this.moreInfo || this._moreInfoContent) {
      this._showMoreInfo = true;
      return;
    }

    this._loading = true;
    this._showMoreInfo = true;

    try {
      const response = await fetch(this.moreInfo);
      this._moreInfoContent = await response.text();
    } catch {
      this._moreInfoContent = '<p>Error loading content</p>';
    } finally {
      this._loading = false;
    }
  }

  _closeMoreInfo() {
    this._showMoreInfo = false;
  }

  _handleCardClick(e) {
    if (!this.url) {
      e.preventDefault();
    }
    this.dispatchEvent(
      new CustomEvent('data-card-click', {
        detail: {
          title: this.cardTitle,
          url: this.url,
          group: this.group,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderCover() {
    const coverStyle = this.coverBgColor ? `background-color: ${this.coverBgColor}` : '';

    if (this.imgCover) {
      return html`
        <div class="cover" style="${coverStyle}">
          <img
            src="${this.imgCover}"
            alt="${this.cardTitle}"
            loading="lazy"
            width="280"
            height="140"
          />
          ${this.group ? html`<span class="group-badge">${this.group}</span>` : ''}
        </div>
      `;
    }

    if (this.icon) {
      return html`
        <div class="cover" style="${coverStyle}">
          <div class="icon-container">${this.icon}</div>
          ${this.group ? html`<span class="group-badge">${this.group}</span>` : ''}
        </div>
      `;
    }

    if (this.group) {
      return html`
        <div style="position: relative; padding: 12px;">
          <span class="group-badge" style="position: relative; top: 0; right: 0;"
            >${this.group}</span
          >
        </div>
      `;
    }

    return '';
  }

  _renderMoreInfoPanel() {
    if (!this.moreInfo) return '';

    return html`
      <div
        id="more-info-panel"
        class="more-info-panel ${this._showMoreInfo ? 'visible' : ''}"
        role="dialog"
        aria-label="More information"
      >
        <button class="more-info-close" @click="${this._closeMoreInfo}" aria-label="Close">
          &times;
        </button>
        ${this._loading
          ? html`<div class="loading">Loading...</div>`
          : html`<div class="more-info-content" .innerHTML="${this._moreInfoContent}"></div>`}
      </div>
    `;
  }

  render() {
    const contentStyle = this.textColor ? `color: ${this.textColor}` : '';
    const hasFooterSlot = this.querySelector('[slot="footer"]');

    const cardContent = html`
      ${this._renderCover()}
      <div class="content" style="${contentStyle}">
        ${this.cardTitle ? html`<h3 class="title">${this.cardTitle}</h3>` : ''}
        ${this.description ? html`<p class="description">${this.description}</p>` : ''}
        <slot></slot>
        ${this.moreInfo
          ? html`
              <button
                class="more-info-trigger"
                @click="${this._fetchMoreInfo}"
                aria-expanded="${this._showMoreInfo}"
                aria-controls="more-info-panel"
              >
                + Info
              </button>
            `
          : ''}
      </div>
      ${hasFooterSlot
        ? html`
            <div class="footer">
              <slot name="footer"></slot>
            </div>
          `
        : ''}
      ${this._renderMoreInfoPanel()}
    `;

    if (this.url) {
      return html`
        <article class="card">
          <a
            class="card-link"
            href="${this.url}"
            target="${this.newtab ? '_blank' : '_self'}"
            rel="${this.newtab ? 'noopener noreferrer' : ''}"
            @click="${this._handleCardClick}"
          >
            ${cardContent}
          </a>
        </article>
      `;
    }

    return html` <article class="card" @click="${this._handleCardClick}">${cardContent}</article> `;
  }
}

customElements.define('data-card', DataCard);
