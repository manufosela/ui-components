import { LitElement, html } from 'lit';
import { starsRatingStyles } from './stars-rating.styles.js';

/**
 * An interactive star rating component.
 *
 * @element stars-rating
 * @fires rating-changed - Fired when the rating changes. Detail: { rating: number }
 *
 * @attr {Number} rating - Current rating value (default: 0)
 * @attr {Number} numstars - Number of stars to display (default: 5)
 * @attr {Boolean} manual - Enable interactive mode (default: false)
 * @attr {Boolean} half - Allow half-star ratings (default: false)
 * @attr {Boolean} reset - Show reset button (default: false)
 * @attr {Boolean} disabled - Disable interaction (default: false)
 * @attr {String} star - Star character to use (default: ★)
 *
 * @cssprop [--stars-rating-size=24px] - Star size
 * @cssprop [--stars-rating-gap=4px] - Gap between stars
 * @cssprop [--stars-rating-color=#fbbf24] - Filled star color
 * @cssprop [--stars-rating-empty-color=#e5e7eb] - Empty star color
 * @cssprop [--stars-rating-reset-color=#6b7280] - Reset button color
 */
export class StarsRating extends LitElement {
  static styles = starsRatingStyles;

  static properties = {
    rating: { type: Number, reflect: true },
    numstars: { type: Number },
    manual: { type: Boolean, reflect: true },
    half: { type: Boolean },
    reset: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
    star: { type: String },
    _hoverRating: { type: Number, state: true },
  };

  constructor() {
    super();
    this.rating = 0;
    this.numstars = 5;
    this.manual = false;
    this.half = false;
    this.reset = false;
    this.disabled = false;
    this.star = '★';
    this._hoverRating = null;
  }

  get _displayRating() {
    return this._hoverRating !== null ? this._hoverRating : this.rating;
  }

  _getStarClass(index) {
    const rating = this._displayRating;
    const starValue = index + 1;

    if (rating >= starValue) {
      return 'star filled';
    }

    if (this.half && rating > index && rating < starValue) {
      return 'star half';
    }

    return 'star';
  }

  _handleClick(e, index) {
    if (!this.manual || this.disabled) return;

    let newRating = index + 1;
    if (this.half) {
      const rect = e.target.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      newRating = isLeftHalf ? index + 0.5 : index + 1;
    }

    if (newRating === this.rating) return;

    this.rating = newRating;
    this._dispatchChange();
  }

  _handleMouseMove(e, index) {
    if (!this.manual || this.disabled) return;

    if (this.half) {
      const rect = e.target.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      this._hoverRating = isLeftHalf ? index + 0.5 : index + 1;
    } else {
      this._hoverRating = index + 1;
    }
  }

  _handleMouseLeave() {
    this._hoverRating = null;
  }

  _handleKeydown(e, index) {
    if (!this.manual || this.disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Keyboard sets full star (no half detection possible)
      const newRating = index + 1;
      if (newRating !== this.rating) {
        this.rating = newRating;
        this._dispatchChange();
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const increment = this.half ? 0.5 : 1;
      const newRating = Math.min(this.numstars, this.rating + increment);
      if (newRating !== this.rating) {
        this.rating = newRating;
        this._dispatchChange();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const increment = this.half ? 0.5 : 1;
      const newRating = Math.max(0, this.rating - increment);
      if (newRating !== this.rating) {
        this.rating = newRating;
        this._dispatchChange();
      }
    }
  }

  resetRating() {
    if (this.rating === 0) return;
    this.rating = 0;
    this._dispatchChange();
  }

  setRating(value) {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const clamped = Math.max(0, Math.min(this.numstars, numValue));
    if (clamped === this.rating) return;

    this.rating = clamped;
    this._dispatchChange();
  }

  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('rating-changed', {
        detail: { rating: this.rating },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderStars() {
    const stars = [];
    for (let i = 0; i < this.numstars; i++) {
      stars.push(html`
        <span
          class="${this._getStarClass(i)}"
          data-star="${this.star}"
          role="radio"
          tabindex="${this.manual && !this.disabled ? 0 : -1}"
          aria-checked="${this.rating >= i + 1}"
          aria-label="Rate ${i + 1} of ${this.numstars} stars"
          @click="${(e) => this._handleClick(e, i)}"
          @mousemove="${(e) => this._handleMouseMove(e, i)}"
          @mouseleave="${this._handleMouseLeave}"
          @keydown="${(e) => this._handleKeydown(e, i)}"
          >${this.star}</span
        >
      `);
    }
    return stars;
  }

  render() {
    return html`
      <div
        class="stars-container"
        role="radiogroup"
        aria-label="Star rating: ${this.rating} of ${this.numstars} stars"
      >
        ${this._renderStars()}
        <input type="hidden" .value="${this.rating}" />
      </div>
      ${this.reset && this.manual && !this.disabled
        ? html`
            <button class="reset-btn" @click="${this.resetRating}" aria-label="Reset rating">
              ✕
            </button>
          `
        : ''}
    `;
  }
}

customElements.define('stars-rating', StarsRating);
