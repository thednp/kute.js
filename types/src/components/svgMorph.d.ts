export default svgMorph;
declare namespace svgMorph {
    export const component: string;
    export const property: string;
    export const defaultValue: never[];
    export { coords as Interpolate };
    export namespace defaultOptions {
        const morphPrecision: number;
        const morphIndex: number;
    }
    export { svgMorphFunctions as functions };
    export namespace Util {
        export { addPoints };
        export { bisect };
        export { normalizeRing };
        export { validRing };
        export { getInterpolationPoints };
        export { pathStringToRing };
        export { distanceSquareRoot };
        export { midPoint };
        export { approximateRing };
        export { rotateRing };
        export { pathToString };
        export { pathToCurve };
        export { getPathLength };
        export { getPointAtLength };
        export { getDrawDirection };
        export { roundPath };
    }
}
import coords from "../interpolation/coords.js";
declare namespace svgMorphFunctions {
    export { getSVGMorph as prepareStart };
    export { prepareSVGMorph as prepareProperty };
    export { onStartSVGMorph as onStart };
    export { crossCheckSVGMorph as crossCheck };
}
declare function addPoints(ring: any, numPoints: any): void;
declare function bisect(ring: any, maxSegmentLength?: number): void;
declare function normalizeRing(input: any, maxSegmentLength: any): any;
declare function validRing(ring: any): boolean;
declare function getInterpolationPoints(pathArray1: any, pathArray2: any, precision: any): any[];
declare function pathStringToRing(str: any, maxSegmentLength: any): {
    ring: any[][];
    pathLength: number;
};
import distanceSquareRoot from "svg-path-commander/src/math/distanceSquareRoot.js";
import midPoint from "svg-path-commander/src/math/midPoint.js";
declare function approximateRing(parsed: any, maxSegmentLength: any): {
    pathLength: number;
    ring: any[][];
    skipBisect: boolean;
};
declare function rotateRing(ring: any, vs: any): void;
import pathToString from "svg-path-commander/src/convert/pathToString.js";
import pathToCurve from "svg-path-commander/src/convert/pathToCurve.js";
import getPathLength from "svg-path-commander/src/util/getPathLength.js";
import getPointAtLength from "svg-path-commander/src/util/getPointAtLength.js";
import getDrawDirection from "svg-path-commander/src/util/getDrawDirection.js";
import roundPath from "svg-path-commander/src/process/roundPath.js";
declare function getSVGMorph(): any;
declare function prepareSVGMorph(tweenProp: any, value: any): any;
import { onStartSVGMorph } from "./svgMorphBase.js";
declare function crossCheckSVGMorph(prop: any): void;
