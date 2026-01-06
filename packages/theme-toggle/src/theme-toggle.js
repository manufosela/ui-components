import { LitElement, html } from 'lit';
import { themeToggleStyles } from './theme-toggle.styles.js';

/**
 * A theme toggle component for switching between light and dark modes.
 *
 * @element theme-toggle
 * @fires theme-changed - Fired when the theme changes. Detail: { theme: 'light' | 'dark' }
 *
 * @attr {String} theme - Current theme: 'light' or 'dark' (default: 'light')
 * @attr {Boolean} persist - Whether to persist theme to localStorage (default: true)
 * @attr {String} storage-key - LocalStorage key for persisting theme (default: 'theme')
 *
 * @cssprop --theme-toggle-padding - Container padding (default: 4px)
 * @cssprop --theme-toggle-bg - Background color (default: #f3f4f6)
 * @cssprop --theme-toggle-radius - Border radius (default: 9999px)
 * @cssprop --theme-toggle-button-size - Button size (default: 36px)
 * @cssprop --theme-toggle-icon-size - Icon size (default: 20px)
 * @cssprop --theme-toggle-active-bg - Active button background (default: #fff)
 */
export class ThemeToggle extends LitElement {
  static styles = themeToggleStyles;

  static properties = {
    theme: { type: String, reflect: true },
    persist: { type: Boolean },
    storageKey: { type: String, attribute: 'storage-key' },
  };

  constructor() {
    super();
    this.theme = 'light';
    this.persist = true;
    this.storageKey = 'theme';
  }

  connectedCallback() {
    super.connectedCallback();
    // Only load theme from storage/system if not explicitly set via attribute
    if (!this.hasAttribute('theme')) {
      this._loadTheme();
    }
    this._applyTheme();
  }

  _loadTheme() {
    if (this.persist && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.theme = savedTheme;
        return;
      }
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDark ? 'dark' : 'light';
    }
  }

  _saveTheme() {
    if (this.persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, this.theme);
    }
  }

  _applyTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = this.theme;
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    }
  }

  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    if (theme === this.theme) return;

    this.theme = theme;
    this._saveTheme();
    this._applyTheme();
    this._dispatchChange();
  }

  toggle() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  _handleClick(theme) {
    this.setTheme(theme);
  }

  _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: { theme: this.theme },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderSunIcon() {
    return html`
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd"
        />
      </svg>
    `;
  }

  _renderMoonIcon() {
    return html`
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    `;
  }

  render() {
    return html`
      <div class="theme-toggle" role="radiogroup" aria-label="Theme toggle">
        <label class="${this.theme === 'light' ? 'active' : ''}">
          ${this._renderSunIcon()}
          <input
            type="radio"
            name="theme"
            value="light"
            .checked=${this.theme === 'light'}
            @click=${() => this._handleClick('light')}
            aria-label="Light theme"
          />
        </label>
        <label class="${this.theme === 'dark' ? 'active' : ''}">
          ${this._renderMoonIcon()}
          <input
            type="radio"
            name="theme"
            value="dark"
            .checked=${this.theme === 'dark'}
            @click=${() => this._handleClick('dark')}
            aria-label="Dark theme"
          />
        </label>
      </div>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);
