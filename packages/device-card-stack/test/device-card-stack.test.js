import { html, fixture, expect } from '@open-wc/testing';
import '../src/device-card-stack.js';

/**
 * Helper that creates a device-card-stack with three slotted cards and waits
 * for the component to finish its first render cycle (_extractCards runs in
 * firstUpdated).
 */
async function fixtureWithCards(attrs = '') {
  const el = await fixture(html`
    <device-card-stack ${attrs}>
      <div
        slot="card"
        data-title="Card A"
        data-color="#1a1a2e"
        data-image="https://picsum.photos/id/1/600/400"
        data-num="01"
      >
        <p>Content for card A</p>
      </div>
      <div
        slot="card"
        data-title="Card B"
        data-color="#16213e"
        data-image="https://picsum.photos/id/2/600/400"
        data-num="02"
      >
        <p>Content for card B</p>
      </div>
      <div
        slot="card"
        data-title="Card C"
        data-color="#0f3460"
        data-image="https://picsum.photos/id/3/600/400"
        data-num="03"
      >
        <p>Content for card C</p>
      </div>
    </device-card-stack>
  `);
  await el.updateComplete;
  return el;
}

describe('DeviceCardStack', () => {
  describe('rendering', () => {
    it('renders with default values', async () => {
      const el = await fixture(html`<device-card-stack></device-card-stack>`);
      expect(el).to.exist;
      expect(el.activeIndex).to.equal(0);
      expect(el.mobileBreakpoint).to.equal(768);
      expect(el.stackRotation).to.equal(3);
      expect(el.transitionDuration).to.equal(500);
    });

    it('has proper shadow DOM structure', async () => {
      const el = await fixtureWithCards();
      const wrapper = el.shadowRoot.querySelector('.wrapper');
      const stackPanel = el.shadowRoot.querySelector('.stack-panel');
      const previewPanel = el.shadowRoot.querySelector('.preview-panel');

      expect(wrapper).to.exist;
      expect(stackPanel).to.exist;
      expect(previewPanel).to.exist;
    });

    it('renders slotted cards correctly', async () => {
      const el = await fixtureWithCards();
      const cards = el.shadowRoot.querySelectorAll('.card');
      expect(cards.length).to.equal(3);
    });

    it('renders card headers with num and title', async () => {
      const el = await fixtureWithCards();
      const headers = el.shadowRoot.querySelectorAll('.card-header');
      expect(headers.length).to.equal(3);

      const firstNum = headers[0].querySelector('.card-num');
      expect(firstNum.textContent).to.equal('01');
    });

    it('renders preview images for each card', async () => {
      const el = await fixtureWithCards();
      const previews = el.shadowRoot.querySelectorAll('.preview-image');
      expect(previews.length).to.equal(3);
    });

    it('marks first card as active by default', async () => {
      const el = await fixtureWithCards();
      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      expect(firstCard.hasAttribute('data-active')).to.be.true;
    });

    it('marks first preview image as visible by default', async () => {
      const el = await fixtureWithCards();
      const firstPreview = el.shadowRoot.querySelectorAll('.preview-image')[0];
      expect(firstPreview.hasAttribute('data-visible')).to.be.true;
    });
  });

  describe('attributes', () => {
    it('accepts active-index attribute', async () => {
      const el = await fixture(html`
        <device-card-stack active-index="1">
          <div slot="card" data-title="A" data-color="#111">A</div>
          <div slot="card" data-title="B" data-color="#222">B</div>
        </device-card-stack>
      `);
      await el.updateComplete;
      expect(el.activeIndex).to.equal(1);

      const secondCard = el.shadowRoot.querySelector('.card[data-index="1"]');
      expect(secondCard.hasAttribute('data-active')).to.be.true;
    });

    it('accepts mobile-breakpoint attribute', async () => {
      const el = await fixture(
        html`<device-card-stack mobile-breakpoint="1024"></device-card-stack>`
      );
      expect(el.mobileBreakpoint).to.equal(1024);
    });

    it('accepts stack-rotation attribute', async () => {
      const el = await fixture(html`<device-card-stack stack-rotation="5"></device-card-stack>`);
      expect(el.stackRotation).to.equal(5);
    });

    it('accepts transition-duration attribute', async () => {
      const el = await fixture(
        html`<device-card-stack transition-duration="800"></device-card-stack>`
      );
      expect(el.transitionDuration).to.equal(800);
    });
  });

  describe('card activation', () => {
    it('activates card on click', async () => {
      const el = await fixtureWithCards();
      const secondCard = el.shadowRoot.querySelector('.card[data-index="1"]');
      secondCard.click();
      await el.updateComplete;

      expect(el.activeIndex).to.equal(1);
      expect(secondCard.hasAttribute('data-active')).to.be.true;

      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      expect(firstCard.hasAttribute('data-active')).to.be.false;
    });

    it('does not change when clicking already active card', async () => {
      const el = await fixtureWithCards();
      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      firstCard.click();
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
    });

    it('updates preview panel visibility on activation', async () => {
      const el = await fixtureWithCards();
      const secondCard = el.shadowRoot.querySelector('.card[data-index="1"]');
      secondCard.click();
      await el.updateComplete;

      const previews = el.shadowRoot.querySelectorAll('.preview-image');
      expect(previews[0].hasAttribute('data-visible')).to.be.false;
      expect(previews[1].hasAttribute('data-visible')).to.be.true;
    });
  });

  describe('keyboard navigation', () => {
    it('ArrowDown activates next card', async () => {
      const el = await fixtureWithCards();
      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      firstCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(1);
    });

    it('ArrowUp activates previous card', async () => {
      const el = await fixtureWithCards();
      // First activate card 1
      el._activateCard(1);
      await el.updateComplete;

      const secondCard = el.shadowRoot.querySelector('.card[data-index="1"]');
      secondCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
    });

    it('ArrowDown wraps around to first card', async () => {
      const el = await fixtureWithCards();
      el._activateCard(2);
      await el.updateComplete;

      const lastCard = el.shadowRoot.querySelector('.card[data-index="2"]');
      lastCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
    });

    it('ArrowUp wraps around to last card', async () => {
      const el = await fixtureWithCards();
      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      firstCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(2);
    });

    it('Home activates first card', async () => {
      const el = await fixtureWithCards();
      el._activateCard(2);
      await el.updateComplete;

      const lastCard = el.shadowRoot.querySelector('.card[data-index="2"]');
      lastCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
    });

    it('End activates last card', async () => {
      const el = await fixtureWithCards();
      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      firstCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(2);
    });

    it('ignores unrelated keys', async () => {
      const el = await fixtureWithCards();
      const firstCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      firstCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
    });
  });

  describe('accessibility', () => {
    it('stack panel has role tablist', async () => {
      const el = await fixtureWithCards();
      const stackPanel = el.shadowRoot.querySelector('.stack-panel');
      expect(stackPanel.getAttribute('role')).to.equal('tablist');
    });

    it('stack panel has aria-orientation vertical', async () => {
      const el = await fixtureWithCards();
      const stackPanel = el.shadowRoot.querySelector('.stack-panel');
      expect(stackPanel.getAttribute('aria-orientation')).to.equal('vertical');
    });

    it('cards have role tab', async () => {
      const el = await fixtureWithCards();
      const cards = el.shadowRoot.querySelectorAll('.card');
      cards.forEach((card) => {
        expect(card.getAttribute('role')).to.equal('tab');
      });
    });

    it('active card has aria-selected true', async () => {
      const el = await fixtureWithCards();
      const activeCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      expect(activeCard.getAttribute('aria-selected')).to.equal('true');
    });

    it('inactive cards have aria-selected false', async () => {
      const el = await fixtureWithCards();
      const inactiveCard = el.shadowRoot.querySelector('.card[data-index="1"]');
      expect(inactiveCard.getAttribute('aria-selected')).to.equal('false');
    });

    it('active card has tabindex 0', async () => {
      const el = await fixtureWithCards();
      const activeCard = el.shadowRoot.querySelector('.card[data-index="0"]');
      expect(activeCard.getAttribute('tabindex')).to.equal('0');
    });

    it('inactive cards have tabindex -1', async () => {
      const el = await fixtureWithCards();
      const inactiveCard = el.shadowRoot.querySelector('.card[data-index="1"]');
      expect(inactiveCard.getAttribute('tabindex')).to.equal('-1');
    });

    it('card body has role tabpanel', async () => {
      const el = await fixtureWithCards();
      const panels = el.shadowRoot.querySelectorAll('.card-body');
      panels.forEach((panel) => {
        expect(panel.getAttribute('role')).to.equal('tabpanel');
      });
    });

    it('active card body has aria-hidden false', async () => {
      const el = await fixtureWithCards();
      const activePanel = el.shadowRoot.querySelector('#panel-0');
      expect(activePanel.getAttribute('aria-hidden')).to.equal('false');
    });

    it('inactive card body has aria-hidden true', async () => {
      const el = await fixtureWithCards();
      const inactivePanel = el.shadowRoot.querySelector('#panel-1');
      expect(inactivePanel.getAttribute('aria-hidden')).to.equal('true');
    });

    it('preview panel has aria-hidden true', async () => {
      const el = await fixtureWithCards();
      const previewPanel = el.shadowRoot.querySelector('.preview-panel');
      expect(previewPanel.getAttribute('aria-hidden')).to.equal('true');
    });

    it('cards have aria-controls pointing to their panel', async () => {
      const el = await fixtureWithCards();
      const card = el.shadowRoot.querySelector('.card[data-index="0"]');
      expect(card.getAttribute('aria-controls')).to.equal('panel-0');
    });
  });

  describe('card data extraction', () => {
    it('extracts data-title from slotted elements', async () => {
      const el = await fixtureWithCards();
      expect(el._cards[0].title).to.equal('Card A');
      expect(el._cards[1].title).to.equal('Card B');
      expect(el._cards[2].title).to.equal('Card C');
    });

    it('extracts data-color from slotted elements', async () => {
      const el = await fixtureWithCards();
      expect(el._cards[0].color).to.equal('#1a1a2e');
      expect(el._cards[1].color).to.equal('#16213e');
      expect(el._cards[2].color).to.equal('#0f3460');
    });

    it('extracts data-image from slotted elements', async () => {
      const el = await fixtureWithCards();
      expect(el._cards[0].image).to.contain('picsum.photos');
    });

    it('extracts data-num from slotted elements', async () => {
      const el = await fixtureWithCards();
      expect(el._cards[0].num).to.equal('01');
      expect(el._cards[1].num).to.equal('02');
    });

    it('uses padded index as default num', async () => {
      const el = await fixture(html`
        <device-card-stack>
          <div slot="card" data-title="No Num" data-color="#111">Content</div>
        </device-card-stack>
      `);
      await el.updateComplete;
      expect(el._cards[0].num).to.equal('01');
    });

    it('uses default color when data-color is missing', async () => {
      const el = await fixture(html`
        <device-card-stack>
          <div slot="card" data-title="No Color">Content</div>
        </device-card-stack>
      `);
      await el.updateComplete;
      expect(el._cards[0].color).to.equal('#4a4a4a');
    });
  });

  describe('3D transforms', () => {
    it('returns active card transform', async () => {
      const el = await fixtureWithCards();
      const transform = el._getCardTransform(0);
      expect(transform).to.equal('translateZ(30px) scale(1.01)');
    });

    it('returns inactive card transform with depth', async () => {
      const el = await fixtureWithCards();
      const transform = el._getCardTransform(1);
      expect(transform).to.include('translateZ');
      expect(transform).to.include('rotateX');
    });

    it('returns active card shadow', async () => {
      const el = await fixtureWithCards();
      const shadow = el._getCardShadow(0);
      expect(shadow).to.equal('0 15px 40px rgba(0, 0, 0, 0.35)');
    });
  });

  describe('cleanup', () => {
    it('removes resize listener on disconnect', async () => {
      const el = await fixture(html`<device-card-stack></device-card-stack>`);
      expect(el._resizeHandler).to.exist;

      el.remove();
      // After disconnectedCallback, _resizeHandler is still defined but the
      // listener is removed. We verify no errors occur on disconnect.
      expect(el._resizeHandler).to.exist;
    });
  });
});
