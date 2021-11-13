export default class Tween extends TweenBase {
    constructor(...args: any[]);
    paused: boolean;
    _pauseTime: any;
    _repeat: any;
    _repeatDelay: any;
    _repeatOption: any;
    valuesRepeat: {};
    _yoyo: any;
    _reversed: boolean;
    resume(): Tween;
    pause(): Tween;
    reverse(): void;
}
import TweenBase from "./tweenBase.js";
