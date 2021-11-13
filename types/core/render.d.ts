export function stop(): void;
export default Render;
export let Tick: number;
export function Ticker(time: any): void;
declare namespace Render {
    export { Tick };
    export { Ticker };
    export { Tweens };
    export { Time };
}
import Tweens from "../objects/tweens.js";
declare namespace Time {
    export { now };
}
import now from "../util/now.js";
