export default class ProgressBar {
    constructor(element: any, tween: any);
    element: HTMLInputElement;
    updateBar(): void;
    toggleEvents(action: any): void;
    updateTween(): void;
    moveAction(): void;
    downAction(): void;
    upAction(): void;
}
