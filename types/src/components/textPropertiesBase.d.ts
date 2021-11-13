export function textPropOnStart(tweenProp: any): void;
export default baseTextProperties;
declare namespace baseTextProperties {
    const component: string;
    const category: string;
    namespace Interpolate {
        export { units };
    }
    namespace functions {
        export { textOnStart as onStart };
    }
}
import units from "../interpolation/units.js";
declare const textOnStart: {};
