import KUTE from '../objects/kute.js';
import connect from '../objects/connect.js';
import selector from './selector.js';

export default class ProgressBar {
  constructor(element, tween) {
    this.element = selector(element);
    this.element.tween = tween;
    this.element.tween.toolbar = this.element;
    this.element.toolbar = this;
    [this.element.output] = this.element.parentNode.getElementsByTagName('OUTPUT');

    // invalidate
    if (!(this.element instanceof HTMLInputElement)) throw TypeError('Target element is not [HTMLInputElement]');
    if (this.element.type !== 'range') throw TypeError('Target element is not a range input');
    if (!(tween instanceof connect.tween)) throw TypeError(`tween parameter is not [${connect.tween}]`);

    this.element.setAttribute('value', 0);
    this.element.setAttribute('min', 0);
    this.element.setAttribute('max', 1);
    this.element.setAttribute('step', 0.0001);

    this.element.tween._onUpdate = this.updateBar;

    this.element.addEventListener('mousedown', this.downAction, false);
  }

  updateBar() {
    const tick = 0.0001;
    const { output } = this.toolbar;

    // let progress = this.paused ? this.toolbar.value
    // : (KUTE.Time() - this._startTime) / this._duration;
    // progress = progress > 1 - tick ? 1 : progress < 0.01 ? 0 : progress;

    let progress;
    if (this.paused) {
      progress = this.toolbar.value;
    } else {
      progress = (KUTE.Time() - this._startTime) / this._duration;
    }

    // progress = progress > 1 - tick ? 1 : progress < 0.01 ? 0 : progress;
    if (progress > 1 - tick) progress = 1;
    if (progress < 0.01) progress = 0;

    const value = !this._reversed ? progress : 1 - progress;
    this.toolbar.value = value;
    if (output) output.value = `${(value * 10000 >> 0) / 100}%`;
  }

  toggleEvents(action) {
    // add passive handler ?
    this.element[`${action}EventListener`]('mousemove', this.moveAction, false);
    this.element[`${action}EventListener`]('mouseup', this.upAction, false);
  }

  updateTween() {
    // make sure we never complete the tween
    const progress = (!this.tween._reversed ? this.value : 1 - this.value)
      * this.tween._duration - 0.0001;

    this.tween._startTime = 0;
    this.tween.update(progress);
  }

  moveAction() {
    this.toolbar.updateTween.call(this);
  }

  downAction() {
    if (!this.tween.playing) {
      this.tween.start();
    }

    if (!this.tween.paused) {
      this.tween.pause();
      this.toolbar.toggleEvents('add');

      KUTE.Tick = cancelAnimationFrame(KUTE.Ticker);
    }
  }

  upAction() {
    if (this.tween.paused) {
      if (this.tween.paused) this.tween.resume();

      this.tween._startTime = KUTE.Time()
        - (!this.tween._reversed ? this.value : 1 - this.value) * this.tween._duration;

      this.toolbar.toggleEvents('remove');
      KUTE.Tick = requestAnimationFrame(KUTE.Ticker);
    }
  }
}
