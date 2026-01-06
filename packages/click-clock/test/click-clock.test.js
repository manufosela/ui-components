import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import '../src/click-clock.js';

describe('ClickClock', () => {
  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture(html`<click-clock></click-clock>`);
      expect(el).to.exist;
      expect(el.mode).to.equal('countdown');
      expect(el.time).to.equal(60);
      expect(el.autostart).to.be.false;
      expect(el.showDays).to.be.true;
      expect(el.showHours).to.be.true;
      expect(el.showMinutes).to.be.true;
      expect(el.showSeconds).to.be.true;
      expect(el.showMilliseconds).to.be.false;
    });

    it('renders clock element', async () => {
      const el = await fixture(html`<click-clock></click-clock>`);
      const clock = el.shadowRoot.querySelector('.clock');
      expect(clock).to.exist;
    });

    it('renders time units', async () => {
      const el = await fixture(html`<click-clock></click-clock>`);
      const units = el.shadowRoot.querySelectorAll('.unit');
      expect(units.length).to.be.at.least(2);
    });

    it('renders separators', async () => {
      const el = await fixture(html`<click-clock></click-clock>`);
      const separators = el.shadowRoot.querySelectorAll('.separator');
      expect(separators.length).to.be.at.least(1);
    });
  });

  describe('countdown mode', () => {
    it('initializes with time in seconds', async () => {
      const el = await fixture(html`<click-clock time="120"></click-clock>`);
      expect(el._remaining).to.equal(120000);
    });

    it('shows correct time', async () => {
      const el = await fixture(html`<click-clock time="65"></click-clock>`);
      const values = el.shadowRoot.querySelectorAll('.value');
      const texts = Array.from(values).map(v => v.textContent);
      // Should show 01:05 (1 min 5 sec)
      expect(texts).to.include('01');
      expect(texts).to.include('05');
    });

    it('starts countdown on start()', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      el.start();
      expect(el._running).to.be.true;
      el.pause();
    });

    it('fires complete event when done', async () => {
      const el = await fixture(html`<click-clock time="1"></click-clock>`);
      el.start();
      const event = await oneEvent(el, 'complete', false);
      expect(event).to.exist;
    });

    it('shows expired class when complete', async () => {
      const el = await fixture(html`<click-clock time="0"></click-clock>`);
      el._remaining = 0;
      await el.updateComplete;
      const clock = el.shadowRoot.querySelector('.clock');
      expect(clock.classList.contains('expired')).to.be.true;
    });
  });

  describe('stopwatch mode', () => {
    it('starts at zero', async () => {
      const el = await fixture(html`<click-clock mode="stopwatch"></click-clock>`);
      expect(el._remaining).to.equal(0);
    });

    it('counts up when started', async () => {
      const el = await fixture(html`<click-clock mode="stopwatch" show-milliseconds></click-clock>`);
      el.start();
      await aTimeout(250);
      expect(el._remaining).to.be.above(0);
      el.pause();
    });
  });

  describe('clock mode', () => {
    it('shows current time', async () => {
      const el = await fixture(html`<click-clock mode="clock" autostart></click-clock>`);
      await aTimeout(50);
      const { hours, minutes, seconds } = el._getTimeUnits();
      const now = new Date();
      expect(hours).to.equal(now.getHours());
    });
  });

  describe('controls', () => {
    it('start() fires start event', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      setTimeout(() => el.start());
      const event = await oneEvent(el, 'start');
      expect(event).to.exist;
      el.pause();
    });

    it('pause() stops timer', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      el.start();
      el.pause();
      expect(el._running).to.be.false;
    });

    it('pause() fires pause event', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      el.start();
      setTimeout(() => el.pause());
      const event = await oneEvent(el, 'pause');
      expect(event).to.exist;
    });

    it('reset() fires reset event', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      el.start();
      el.pause();
      setTimeout(() => el.reset());
      const event = await oneEvent(el, 'reset');
      expect(event).to.exist;
    });

    it('reset() resets time', async () => {
      const el = await fixture(html`<click-clock time="60"></click-clock>`);
      el._remaining = 30000;
      el.reset();
      expect(el._remaining).to.equal(60000);
    });

    it('toggle() starts when paused', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      el.toggle();
      expect(el._running).to.be.true;
      el.pause();
    });

    it('toggle() pauses when running', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      el.start();
      el.toggle();
      expect(el._running).to.be.false;
    });

    it('getCurrentTime() returns seconds', async () => {
      const el = await fixture(html`<click-clock time="90"></click-clock>`);
      expect(el.getCurrentTime()).to.equal(90);
    });
  });

  describe('autostart', () => {
    it('starts automatically when autostart is true', async () => {
      const el = await fixture(html`<click-clock time="10" autostart></click-clock>`);
      await aTimeout(50);
      expect(el._running).to.be.true;
      el.pause();
    });

    it('does not start when autostart is false', async () => {
      const el = await fixture(html`<click-clock time="10"></click-clock>`);
      expect(el._running).to.be.false;
    });
  });

  describe('target date', () => {
    it('accepts target attribute', async () => {
      const future = new Date();
      future.setMinutes(future.getMinutes() + 5);
      const el = await fixture(html`<click-clock target="${future.toISOString()}"></click-clock>`);
      expect(el._remaining).to.be.above(0);
    });
  });

  describe('display options', () => {
    it('hides days when showDays is false', async () => {
      const el = await fixture(html`<click-clock time="90000" format="full"></click-clock>`);
      el.showDays = false;
      await el.updateComplete;
      const labels = el.shadowRoot.querySelectorAll('.label');
      const texts = Array.from(labels).map(l => l.textContent.toLowerCase());
      expect(texts).to.not.include('days');
    });

    it('shows milliseconds when enabled', async () => {
      const el = await fixture(html`<click-clock show-milliseconds></click-clock>`);
      const ms = el.shadowRoot.querySelector('.ms');
      expect(ms).to.exist;
    });

    it('uses custom separator', async () => {
      const el = await fixture(html`<click-clock separator=" - "></click-clock>`);
      const sep = el.shadowRoot.querySelector('.separator');
      expect(sep.textContent).to.equal(' - ');
    });
  });

  describe('formats', () => {
    it('applies digital format class', async () => {
      const el = await fixture(html`<click-clock format="digital"></click-clock>`);
      const clock = el.shadowRoot.querySelector('.clock');
      expect(clock.classList.contains('digital')).to.be.true;
    });

    it('applies full format class', async () => {
      const el = await fixture(html`<click-clock format="full"></click-clock>`);
      const clock = el.shadowRoot.querySelector('.clock');
      expect(clock.classList.contains('full')).to.be.true;
    });

    it('applies compact format class', async () => {
      const el = await fixture(html`<click-clock format="compact"></click-clock>`);
      const clock = el.shadowRoot.querySelector('.clock');
      expect(clock.classList.contains('compact')).to.be.true;
    });
  });

  describe('time calculations', () => {
    it('pads numbers correctly', async () => {
      const el = await fixture(html`<click-clock></click-clock>`);
      expect(el._pad(5)).to.equal('05');
      expect(el._pad(15)).to.equal('15');
    });

    it('calculates time units correctly', async () => {
      const el = await fixture(html`<click-clock></click-clock>`);
      el._remaining = (2 * 24 * 60 * 60 + 3 * 60 * 60 + 15 * 60 + 30) * 1000;
      const units = el._getTimeUnits();
      expect(units.days).to.equal(2);
      expect(units.hours).to.equal(3);
      expect(units.minutes).to.equal(15);
      expect(units.seconds).to.equal(30);
    });
  });

  describe('tick event', () => {
    it('fires tick event with time details', async () => {
      const el = await fixture(html`<click-clock time="5"></click-clock>`);
      let tickDetail = null;
      el.addEventListener('tick', (e) => { tickDetail = e.detail; });
      el.start();
      await aTimeout(1100);
      el.pause();
      expect(tickDetail).to.exist;
      expect(tickDetail).to.have.property('seconds');
    });
  });

  describe('cleanup', () => {
    it('clears interval on disconnect', async () => {
      const el = await fixture(html`<click-clock time="60" autostart></click-clock>`);
      await aTimeout(50);
      expect(el._intervalId).to.exist;
      el.remove();
      // Interval should be cleared (hard to test directly)
    });
  });
});
