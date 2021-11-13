export function getRadius(tweenProp: any): any;
export function prepareRadius(tweenProp: any, value: any): {
    v: number;
    u: string;
};
export namespace radiusFunctions {
    export { getRadius as prepareStart };
    export { prepareRadius as prepareProperty };
    export { radiusOnStart as onStart };
}
export default BorderRadius;
declare const radiusOnStart: {};
declare namespace BorderRadius {
    export const component: string;
    export const category: string;
    export { radiusProps as properties };
    export { radiusValues as defaultValues };
    export namespace Interpolate {
        export { units };
    }
    export { radiusFunctions as functions };
    export namespace Util {
        export { trueDimension };
    }
}
declare const radiusProps: string[];
declare const radiusValues: {};
import units from "../interpolation/units.js";
import trueDimension from "../util/trueDimension.js";
