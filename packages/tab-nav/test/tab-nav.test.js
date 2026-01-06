import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/tab-nav.js';

describe('TabPanel', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<tab-panel></tab-panel>`);
      expect(el).to.exist;
      expect(el.label).to.equal('');
      expect(el.disabled).to.be.false;
      expect(el.icon).to.equal('');
    });

    it('renders label attribute', async () => {
      const el = await fixture(html`<tab-panel label="Test Tab"></tab-panel>`);
      expect(el.label).to.equal('Test Tab');
    });

    it('renders icon attribute', async () => {
      const el = await fixture(html`<tab-panel icon="🏠"></tab-panel>`);
      expect(el.icon).to.equal('🏠');
    });

    it('renders content in slot', async () => {
      const el = await fixture(html`<tab-panel><p>Panel content</p></tab-panel>`);
      const slot = el.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it('reflects disabled attribute', async () => {
      const el = await fixture(html`<tab-panel disabled></tab-panel>`);
      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('active state', () => {
    it('is hidden by default', async () => {
      const el = await fixture(html`<tab-panel></tab-panel>`);
      const styles = getComputedStyle(el);
      expect(styles.display).to.equal('none');
    });

    it('shows when active', async () => {
      const el = await fixture(html`<tab-panel></tab-panel>`);
      el._active = true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;
    });

    it('removes active attribute when inactive', async () => {
      const el = await fixture(html`<tab-panel></tab-panel>`);
      el._active = true;
      await el.updateComplete;
      el._active = false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });
  });
});

describe('TabNav', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<tab-nav></tab-nav>`);
      expect(el).to.exist;
      expect(el.selected).to.equal(0);
      expect(el.position).to.equal('top');
      expect(el.fill).to.be.false;
    });

    it('renders tabs container', async () => {
      const el = await fixture(html`<tab-nav></tab-nav>`);
      const tabs = el.shadowRoot.querySelector('.tabs');
      expect(tabs).to.exist;
      expect(tabs.getAttribute('role')).to.equal('tablist');
    });

    it('renders panels container', async () => {
      const el = await fixture(html`<tab-nav></tab-nav>`);
      const panels = el.shadowRoot.querySelector('.panels');
      expect(panels).to.exist;
      expect(panels.getAttribute('role')).to.equal('tabpanel');
    });

    it('renders tab buttons from panels', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 1">Content 1</tab-panel>
          <tab-panel label="Tab 2">Content 2</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;
      const tabs = el.shadowRoot.querySelectorAll('.tab');
      expect(tabs.length).to.equal(2);
    });

    it('displays tab labels', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="First Tab">Content</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;
      const tab = el.shadowRoot.querySelector('.tab');
      expect(tab.textContent.trim()).to.include('First Tab');
    });

    it('displays tab icons', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Home" icon="🏠">Content</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;
      const icon = el.shadowRoot.querySelector('.tab-icon');
      expect(icon).to.exist;
      expect(icon.textContent).to.equal('🏠');
    });
  });

  describe('tab selection', () => {
    it('first tab is selected by default', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 1">Content 1</tab-panel>
          <tab-panel label="Tab 2">Content 2</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;
      const panels = el.querySelectorAll('tab-panel');
      expect(panels[0].hasAttribute('active')).to.be.true;
      expect(panels[1].hasAttribute('active')).to.be.false;
    });

    it('respects selected attribute', async () => {
      const el = await fixture(html`
        <tab-nav selected="1">
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;
      const panels = el.querySelectorAll('tab-panel');
      expect(panels[0].hasAttribute('active')).to.be.false;
      expect(panels[1].hasAttribute('active')).to.be.true;
    });

    it('switches tab on click', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[1].click();
      await el.updateComplete;

      const panels = el.querySelectorAll('tab-panel');
      expect(panels[0].hasAttribute('active')).to.be.false;
      expect(panels[1].hasAttribute('active')).to.be.true;
    });

    it('marks active tab with active class', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      expect(tabs[0].classList.contains('active')).to.be.true;
      expect(tabs[1].classList.contains('active')).to.be.false;
    });

    it('fires tab-change event', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      setTimeout(() => tabs[1].click());
      const event = await oneEvent(el, 'tab-change');

      expect(event.detail.index).to.equal(1);
      expect(event.detail.label).to.equal('Tab 1');
    });

    it('does not fire event when clicking same tab', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('tab-change', () => {
        eventFired = true;
      });

      const tab = el.shadowRoot.querySelector('.tab');
      tab.click();
      await aTimeout(50);

      expect(eventFired).to.be.false;
    });
  });

  describe('disabled tabs', () => {
    it('marks disabled tabs', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Enabled">Content</tab-panel>
          <tab-panel label="Disabled" disabled>Content</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      expect(tabs[0].classList.contains('disabled')).to.be.false;
      expect(tabs[1].classList.contains('disabled')).to.be.true;
    });

    it('cannot select disabled tab', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1" disabled>Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[1].click();
      await el.updateComplete;

      expect(el.selected).to.equal(0);
    });

    it('sets aria-disabled on disabled tab', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab" disabled>Content</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tab = el.shadowRoot.querySelector('.tab');
      expect(tab.getAttribute('aria-disabled')).to.equal('true');
    });
  });

  describe('keyboard navigation', () => {
    it('navigates with ArrowRight', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(1);
    });

    it('navigates with ArrowLeft', async () => {
      const el = await fixture(html`
        <tab-nav selected="1">
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(0);
    });

    it('wraps from last to first with ArrowRight', async () => {
      const el = await fixture(html`
        <tab-nav selected="1">
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(0);
    });

    it('wraps from first to last with ArrowLeft', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(1);
    });

    it('Home key selects first tab', async () => {
      const el = await fixture(html`
        <tab-nav selected="2">
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
          <tab-panel label="Tab 2">Content 2</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(0);
    });

    it('End key selects last tab', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
          <tab-panel label="Tab 2">Content 2</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(2);
    });

    it('skips disabled tabs when navigating', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1" disabled>Content 1</tab-panel>
          <tab-panel label="Tab 2">Content 2</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;

      expect(el.selected).to.equal(2);
    });
  });

  describe('position', () => {
    it('applies top position class by default', async () => {
      const el = await fixture(html`<tab-nav></tab-nav>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.classList.contains('position-top')).to.be.true;
    });

    it('applies bottom position class', async () => {
      const el = await fixture(html`<tab-nav position="bottom"></tab-nav>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.classList.contains('position-bottom')).to.be.true;
    });

    it('applies left position class', async () => {
      const el = await fixture(html`<tab-nav position="left"></tab-nav>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.classList.contains('position-left')).to.be.true;
    });

    it('applies right position class', async () => {
      const el = await fixture(html`<tab-nav position="right"></tab-nav>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.classList.contains('position-right')).to.be.true;
    });
  });

  describe('programmatic control', () => {
    it('select() changes active tab', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      el.select(1);
      await el.updateComplete;

      expect(el.selected).to.equal(1);
      const panels = el.querySelectorAll('tab-panel');
      expect(panels[1].hasAttribute('active')).to.be.true;
    });

    it('getSelectedPanel() returns current panel', async () => {
      const el = await fixture(html`
        <tab-nav selected="1">
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const panel = el.getSelectedPanel();
      expect(panel.label).to.equal('Tab 1');
    });
  });

  describe('accessibility', () => {
    it('tabs have role tab', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab">Content</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tab = el.shadowRoot.querySelector('.tab');
      expect(tab.getAttribute('role')).to.equal('tab');
    });

    it('active tab has aria-selected true', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      expect(tabs[0].getAttribute('aria-selected')).to.equal('true');
      expect(tabs[1].getAttribute('aria-selected')).to.equal('false');
    });

    it('active tab has tabindex 0, others -1', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0">Content 0</tab-panel>
          <tab-panel label="Tab 1">Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      const tabs = el.shadowRoot.querySelectorAll('.tab');
      expect(tabs[0].getAttribute('tabindex')).to.equal('0');
      expect(tabs[1].getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('edge cases', () => {
    it('handles empty tab-nav', async () => {
      const el = await fixture(html`<tab-nav></tab-nav>`);
      expect(el._getPanels().length).to.equal(0);
    });

    it('handles all disabled tabs', async () => {
      const el = await fixture(html`
        <tab-nav>
          <tab-panel label="Tab 0" disabled>Content 0</tab-panel>
          <tab-panel label="Tab 1" disabled>Content 1</tab-panel>
        </tab-nav>
      `);
      await el.updateComplete;

      // Keyboard navigation should not change selection
      const tabs = el.shadowRoot.querySelectorAll('.tab');
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;

      // Selection unchanged since all disabled
      expect(el.selected).to.equal(0);
    });
  });
});
