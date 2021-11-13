export default class TweenBase {
    constructor(targetElement: any, startObject: any, endObject: any, opsObject: any);
    element: any;
    playing: boolean;
    _startTime: any;
    _startFired: boolean;
    valuesEnd: any;
    valuesStart: any;
    _resetStart: any;
    _easing: any;
    _duration: any;
    _delay: any;
    start(time: any): TweenBase;
    stop(): TweenBase;
    close(): void;
    chain(args: any): TweenBase;
    _chain: any;
    stopChainedTweens(): void;
    update(time: any): boolean;
}
