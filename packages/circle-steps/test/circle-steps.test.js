import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/circle-steps.js';

describe('CircleSteps', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      expect(el).to.exist;
      expect(el.steps).to.deep.equal([]);
      expect(el.current).to.equal(-1);
      expect(el.orientation).to.equal('horizontal');
      expect(el.clickable).to.be.false;
      expect(el.showNumbers).to.be.true;
      expect(el.showCheck).to.be.true;
    });

    it('renders steps from array', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const circles = el.shadowRoot.querySelectorAll('.circle');
      expect(circles.length).to.equal(3);
    });

    it('renders steps from number attribute', async () => {
      const el = await fixture(html`<circle-steps steps="4"></circle-steps>`);
      await el.updateComplete;
      expect(el.steps.length).to.equal(4);
    });

    it('renders step labels', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'First' }, { label: 'Second' }];
      await el.updateComplete;
      const labels = el.shadowRoot.querySelectorAll('.label');
      expect(labels[0].textContent.trim()).to.equal('First');
      expect(labels[1].textContent.trim()).to.equal('Second');
    });

    it('renders step descriptions', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'Step', description: 'Step description' }];
      await el.updateComplete;
      const desc = el.shadowRoot.querySelector('.description');
      expect(desc).to.exist;
      expect(desc.textContent).to.equal('Step description');
    });

    it('renders step numbers', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;
      const circles = el.shadowRoot.querySelectorAll('.circle');
      expect(circles[0].textContent.trim()).to.equal('1');
      expect(circles[1].textContent.trim()).to.equal('2');
    });

    it('hides numbers when showNumbers is false', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.showNumbers = false;
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;
      const circles = el.shadowRoot.querySelectorAll('.circle');
      // Second circle (not complete) should have no number
      expect(circles[1].textContent.trim()).to.equal('');
    });
  });

  describe('step states', () => {
    it('marks current step as active', async () => {
      const el = await fixture(html`<circle-steps current="1"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const circles = el.shadowRoot.querySelectorAll('.circle');
      expect(circles[0].classList.contains('active')).to.be.false;
      expect(circles[1].classList.contains('active')).to.be.true;
      expect(circles[2].classList.contains('active')).to.be.false;
    });

    it('marks previous steps as complete', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const circles = el.shadowRoot.querySelectorAll('.circle');
      expect(circles[0].classList.contains('complete')).to.be.true;
      expect(circles[1].classList.contains('complete')).to.be.true;
      expect(circles[2].classList.contains('complete')).to.be.false;
    });

    it('shows checkmarks for completed steps', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const checks = el.shadowRoot.querySelectorAll('.check-icon');
      expect(checks.length).to.equal(2);
    });

    it('hides checkmarks when showCheck is false', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.showCheck = false;
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const checks = el.shadowRoot.querySelectorAll('.check-icon');
      expect(checks.length).to.equal(0);
    });

    it('isComplete returns correct state', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      expect(el.isComplete(0)).to.be.true;
      expect(el.isComplete(1)).to.be.true;
      expect(el.isComplete(2)).to.be.false;
    });

    it('isActive returns correct state', async () => {
      const el = await fixture(html`<circle-steps current="1"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      expect(el.isActive(0)).to.be.false;
      expect(el.isActive(1)).to.be.true;
      expect(el.isActive(2)).to.be.false;
    });
  });

  describe('navigation', () => {
    it('next() advances to next step', async () => {
      const el = await fixture(html`<circle-steps current="0"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.next();
      expect(el.current).to.equal(1);
    });

    it('next() on last step marks all complete', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.next();
      expect(el.current).to.equal(3); // 3 = all complete (steps.length)
    });

    it('prev() goes to previous step', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.prev();
      expect(el.current).to.equal(1);
    });

    it('prev() does nothing on not started state', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.prev();
      expect(el.current).to.equal(-1);
    });

    it('goToStep() navigates to specific step', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.goToStep(2);
      expect(el.current).to.equal(2);
    });

    it('goToStep() ignores invalid index', async () => {
      const el = await fixture(html`<circle-steps current="1"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.goToStep(-2);
      expect(el.current).to.equal(1);
      el.goToStep(10);
      expect(el.current).to.equal(1);
    });

    it('reset() returns to not started state', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      el.reset();
      expect(el.current).to.equal(-1);
    });

    it('fires step-change event on navigation', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      setTimeout(() => el.next());
      const event = await oneEvent(el, 'step-change');
      expect(event.detail.oldStep).to.equal(-1);
      expect(event.detail.newStep).to.equal(0);
      expect(event.detail.step.label).to.equal('A');
    });
  });

  describe('clickable mode', () => {
    it('adds clickable class when enabled', async () => {
      const el = await fixture(html`<circle-steps clickable></circle-steps>`);
      el.steps = [{ label: 'A' }];
      await el.updateComplete;
      const circle = el.shadowRoot.querySelector('.circle');
      expect(circle.classList.contains('clickable')).to.be.true;
    });

    it('fires step-click event on click', async () => {
      const el = await fixture(html`<circle-steps clickable></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;

      const circles = el.shadowRoot.querySelectorAll('.circle');
      setTimeout(() => circles[1].click());
      const event = await oneEvent(el, 'step-click');

      expect(event.detail.index).to.equal(1);
      expect(event.detail.step.label).to.equal('B');
    });

    it('does not fire event when not clickable', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener('step-click', () => {
        eventFired = true;
      });

      const circles = el.shadowRoot.querySelectorAll('.circle');
      circles[1].click();
      await aTimeout(50);

      expect(eventFired).to.be.false;
    });

    it('responds to Enter key when clickable', async () => {
      const el = await fixture(html`<circle-steps clickable></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;

      const circles = el.shadowRoot.querySelectorAll('.circle');
      setTimeout(() => {
        circles[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });
      const event = await oneEvent(el, 'step-click');

      expect(event.detail.index).to.equal(1);
    });

    it('responds to Space key when clickable', async () => {
      const el = await fixture(html`<circle-steps clickable></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;

      const circles = el.shadowRoot.querySelectorAll('.circle');
      setTimeout(() => {
        circles[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      });
      const event = await oneEvent(el, 'step-click');

      expect(event.detail.index).to.equal(0);
    });
  });

  describe('orientation', () => {
    it('applies horizontal orientation by default', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.classList.contains('vertical')).to.be.false;
    });

    it('applies vertical orientation', async () => {
      const el = await fixture(html`<circle-steps orientation="vertical"></circle-steps>`);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.classList.contains('vertical')).to.be.true;
    });
  });

  describe('connector lines', () => {
    it('renders connector lines between steps', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const lines = el.shadowRoot.querySelectorAll('.line');
      expect(lines.length).to.be.above(0);
    });

    it('marks completed connector lines', async () => {
      const el = await fixture(html`<circle-steps current="2"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
      await el.updateComplete;
      const completeLines = el.shadowRoot.querySelectorAll('.line.complete');
      expect(completeLines.length).to.be.above(0);
    });
  });

  describe('accessibility', () => {
    it('clickable circles have role button', async () => {
      const el = await fixture(html`<circle-steps clickable></circle-steps>`);
      el.steps = [{ label: 'A' }];
      await el.updateComplete;
      const circle = el.shadowRoot.querySelector('.circle');
      expect(circle.getAttribute('role')).to.equal('button');
    });

    it('non-clickable circles have role presentation', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }];
      await el.updateComplete;
      const circle = el.shadowRoot.querySelector('.circle');
      expect(circle.getAttribute('role')).to.equal('presentation');
    });

    it('active step has aria-current', async () => {
      const el = await fixture(html`<circle-steps current="1"></circle-steps>`);
      el.steps = [{ label: 'A' }, { label: 'B' }];
      await el.updateComplete;
      const circles = el.shadowRoot.querySelectorAll('.circle');
      expect(circles[0].getAttribute('aria-current')).to.equal('false');
      expect(circles[1].getAttribute('aria-current')).to.equal('step');
    });

    it('clickable circles are focusable', async () => {
      const el = await fixture(html`<circle-steps clickable></circle-steps>`);
      el.steps = [{ label: 'A' }];
      await el.updateComplete;
      const circle = el.shadowRoot.querySelector('.circle');
      expect(circle.getAttribute('tabindex')).to.equal('0');
    });

    it('non-clickable circles are not focusable', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{ label: 'A' }];
      await el.updateComplete;
      const circle = el.shadowRoot.querySelector('.circle');
      expect(circle.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('size variants', () => {
    it('applies small size', async () => {
      const el = await fixture(html`<circle-steps size="small"></circle-steps>`);
      expect(el.size).to.equal('small');
      expect(el.getAttribute('size')).to.equal('small');
    });

    it('applies large size', async () => {
      const el = await fixture(html`<circle-steps size="large"></circle-steps>`);
      expect(el.size).to.equal('large');
      expect(el.getAttribute('size')).to.equal('large');
    });
  });

  describe('edge cases', () => {
    it('handles empty steps array', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      expect(el.steps.length).to.equal(0);
    });

    it('handles JSON steps attribute', async () => {
      const stepsJson = JSON.stringify([{ label: 'X' }, { label: 'Y' }]);
      const el = await fixture(html`<circle-steps steps="${stepsJson}"></circle-steps>`);
      expect(el.steps.length).to.equal(2);
    });

    it('handles step without label', async () => {
      const el = await fixture(html`<circle-steps></circle-steps>`);
      el.steps = [{}];
      await el.updateComplete;
      const label = el.shadowRoot.querySelector('.label');
      expect(label.textContent.trim()).to.equal('');
    });
  });
});
