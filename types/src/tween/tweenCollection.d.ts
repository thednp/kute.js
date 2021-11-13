export default class TweenCollection {
    constructor(els: any, vS: any, vE: any, Options: any);
    tweens: any[];
    length: number;
    start(time: any): TweenCollection;
    stop(): TweenCollection;
    pause(time: any): TweenCollection;
    resume(time: any): TweenCollection;
    chain(args: any): TweenCollection;
    playing(): boolean;
    removeTweens(): void;
    getMaxDuration(): number;
}
