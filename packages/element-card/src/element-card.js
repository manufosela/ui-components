import { LitElement, html, css } from 'lit';

/**
 * A card component with title, description, cover image and slotted content
 * arranged in a grid.
 *
 * @element element-card
 *
 * @attr {String} title - Card title
 * @attr {String} description - Card description
 * @attr {String} cover - Cover background image url
 * @attr {String} cover-bgcolor - Cover background color (default: rgba(0,0,0,0.7))
 * @attr {String} text-color - Text color (default: #fff)
 * @attr {String} img-cover - Cover image (displayed inside .element-cover)
 *
 * @cssprop [--font-size=16px] - Base font size
 * @cssprop [--fsize-element-base=1rem] - Base element font size
 * @cssprop [--fsize-element-title=3rem] - Title font size
 * @cssprop [--fsize-element-desc=2.625rem] - Description font size
 * @cssprop [--imgcover-max-width=100%] - Max width of cover image
 * @cssprop [--imgcover-opacity=1] - Opacity of cover image
 *
 * @slot - Content rendered inside the element grid
 */
export class ElementCard extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
    cover: { type: String },
    coverBgColor: { type: String, attribute: 'cover-bgcolor' },
    textColor: { type: String, attribute: 'text-color' },
    imgcover: { type: String, attribute: 'img-cover' },
  };

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
      font-weight: 500;
      margin: 30px;
      font-size: var(--font-size, 16px);
    }
    .element-card {
      padding: 60px 0;
      display: flex;
      align-items: center;
      width: 100%;
      transition: all 0.5s;
      overflow: hidden;
      position: relative;
      border-radius: 30px;
      box-shadow: 0 28px 79px 0 rgba(10, 22, 31, 0.35);
      max-width: 1200px;
      font-size: var(--fsize-element-base, 1rem);
    }
    @media screen and (max-width: 992px) {
      .element-card {
        align-items: flex-start;
      }
    }
    @media screen and (max-width: 767px) {
      .element-card {
        border-radius: 20px;
      }
    }
    .element-cover {
      border-radius: 30px;
      position: absolute;
      inset: 0;
      display: block;
      object-fit: cover;
      opacity: 1;
      text-align: left;
      padding: 15px;
    }
    .element-cover img {
      max-width: var(--imgcover-max-width, 100%);
      opacity: var(--imgcover-opacity, 1);
      border-radius: 10px;
    }
    @media screen and (max-width: 767px) {
      .element-cover {
        border-radius: 20px;
      }
    }
    .element-content {
      font-size: var(--fsize-element-base, 1rem);
      position: relative;
      z-index: 2;
      width: 100%;
      padding-left: 250px;
      padding-right: 80px;
    }
    @media screen and (max-width: 1200px) {
      .element-content {
        padding-left: 220px;
      }
    }
    @media screen and (max-width: 992px) {
      .element-content {
        padding: 20px 60px 100px;
        text-align: center;
      }
    }
    @media screen and (max-width: 767px) {
      .element-content {
        padding: 20px 30px 50px;
      }
    }
    @media screen and (max-width: 576px) {
      .element-content {
        padding: 20px 15px;
      }
    }
    .element-title {
      margin: 0 0 10px;
      font-weight: 900;
      font-size: var(--fsize-element-title, 3rem);
      line-height: 2.5rem;
      letter-spacing: 2px;
      opacity: 0;
      transform: translateY(-55px);
    }
    @media screen and (max-width: 1200px) {
      .element-title {
        font-size: calc(var(--fsize-element-title, 3rem) * 0.7083);
      }
    }
    @media screen and (max-width: 576px) {
      .element-title {
        font-size: calc(var(--fsize-element-title, 3rem) * 0.5);
      }
    }
    .element-desc {
      display: block;
      font-size: var(--fsize-element-desc, 2.625rem);
      opacity: 0;
      transform: translateY(-110px);
    }
    @media screen and (max-width: 1200px) {
      .element-desc {
        font-size: calc(var(--fsize-element-desc, 2.625rem) * 0.762);
      }
    }
    @media screen and (max-width: 576px) {
      .element-desc {
        font-size: calc(var(--fsize-element-desc, 2.625rem) * 0.457);
      }
    }
    .element-ctr {
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      gap: 10px;
      align-items: center;
      min-height: 150px;
      margin-top: 40px;
      opacity: 0;
      transform: translateY(-165px);
    }
    @media screen and (max-width: 992px) {
      .element-ctr {
        justify-content: center;
      }
    }
    ::slotted(.hr-vertical) {
      width: 1px;
      background: #9fa3a7;
      align-self: stretch;
      margin: 0;
      flex-shrink: 0;
      opacity: 0.5;
    }
    ::slotted(:last-child) {
      margin-top: 2rem;
      grid-column-start: 1;
      grid-column-end: 4;
      font-size: var(--fsize-element-base, 1rem);
    }
    @media screen and (max-width: 767px) {
      .element-ctr {
        grid-template-columns: 1fr;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 40px;
      }
      ::slotted(.hr-vertical) {
        width: 100%;
        margin: 35px 0;
        height: 1px;
      }
    }
    .showTitle {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.5s;
    }
    .showDesc {
      opacity: 1;
      transform: translateY(0);
      transition: all 1s;
    }
    @media (prefers-reduced-motion: reduce) {
      .element-card,
      .showTitle,
      .showDesc {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.title = 'Element-card';
    this.description = 'Description from element-card';
    this.coverBgColor = 'rgba(0, 0, 0, 0.7)';
    this.textColor = '#FFF';
  }

  firstUpdated() {
    setTimeout(() => {
      this.renderRoot.querySelector('.element-title')?.classList.add('showTitle');
      this.renderRoot.querySelector('.element-desc')?.classList.add('showDesc');
      this.renderRoot.querySelector('.element-ctr')?.classList.add('showDesc');
      this._addSeparators();
      if (this.imgcover) {
        const cover = this.shadowRoot.querySelector('.element-cover');
        if (cover) {
          cover.innerHTML = `<img src="${this.imgcover}" alt="${this.title}">`;
        }
      }
    }, 100);
  }

  _addSeparators() {
    const children = Array.from(this.children).filter(
      (child) => !child.classList?.contains('hr-vertical')
    );
    children.forEach((child, i) => {
      if (i > 0 && i % 2 === 1) {
        const separator = document.createElement('span');
        separator.className = 'hr-vertical';
        this.insertBefore(separator, child);
      }
    });
  }

  render() {
    return html`
      <style>
        .element-cover {
          background-color: ${this.coverBgColor};
        }
        .element-content {
          color: ${this.textColor};
        }
        .element-desc,
        .element-title {
          text-align: ${this.imgcover ? 'center' : 'left'};
        }
      </style>
      <div class="element-card">
        <div class="element-cover"></div>
        <div class="element-content">
          <h1 class="element-title">${this.title}</h1>
          <span class="element-desc">${this.description}</span>
          <div class="element-ctr">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('element-card', ElementCard);
