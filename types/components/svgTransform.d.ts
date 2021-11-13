export namespace svgTransformFunctions {
    export { getStartSvgTransform as prepareStart };
    export { prepareSvgTransform as prepareProperty };
    export { svgTransformOnStart as onStart };
    export { svgTransformCrossCheck as crossCheck };
}
export namespace svgTransform {
    export const component: string;
    export const property: string;
    export namespace defaultOptions {
        const transformOrigin: string;
    }
    export namespace defaultValue {
        const translate: number;
        const rotate: number;
        const skewX: number;
        const skewY: number;
        const scale: number;
    }
    export namespace Interpolate {
        export { numbers };
    }
    export { svgTransformFunctions as functions };
    export namespace Util {
        export { parseStringOrigin };
        export { parseTransformString };
        export { parseTransformSVG };
    }
}
export default svgTransform;
declare function getStartSvgTransform(tweenProp: any, value: any): {};
declare function prepareSvgTransform(p: any, v: any): {
    origin: any;
};
import { svgTransformOnStart } from "./svgTransformBase.js";
declare function svgTransformCrossCheck(prop: any): void;
import numbers from "../interpolation/numbers.js";
declare function parseStringOrigin(origin: any, { x, width }: {
    x: any;
    width: any;
}): any;
declare function parseTransformString(a: any): {};
declare function parseTransformSVG(p: any, v: any): {
    origin: any;
};
