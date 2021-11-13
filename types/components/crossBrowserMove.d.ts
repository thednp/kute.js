export function onStartComponent(tweenProp: any): void;
export namespace baseCrossBrowserMove {
    const component: string;
    const property: string;
    namespace Interpolate {
        export { numbers };
    }
    namespace functions {
        export { onStartComponent as onStart };
    }
}
export default crossBrowserMove;
import numbers from "../interpolation/numbers.js";
declare namespace crossBrowserMove {
    const component_1: string;
    export { component_1 as component };
    const property_1: string;
    export { property_1 as property };
    export const defaultValue: number[];
    export namespace Interpolate_1 {
        export { numbers };
    }
    export { Interpolate_1 as Interpolate };
    export { componentFunctions as functions };
    export namespace Util {
        export { trueProperty };
    }
}
declare namespace componentFunctions {
    export { getComponentCurrentValue as prepareStart };
    export { prepareComponentValue as prepareProperty };
    export { onStartComponent as onStart };
}
import trueProperty from "../util/trueProperty.js";
declare function getComponentCurrentValue(): number[];
declare function prepareComponentValue(tweenProp: any, value: any): number[];
