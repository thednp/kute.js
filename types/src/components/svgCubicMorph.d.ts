export default svgCubicMorph;
declare namespace svgCubicMorph {
    export const component: string;
    export const property: string;
    export const defaultValue: never[];
    export namespace Interpolate {
        export { numbers };
        export { pathToString };
    }
    export { svgCubicMorphFunctions as functions };
    export namespace Util {
        export { pathToCurve };
        export { pathToAbsolute };
        export { pathToString };
        export { parsePathString };
        export { getRotatedCurve };
        export { getRotations };
        export { equalizeSegments };
        export { reverseCurve };
        export { clonePath };
        export { getDrawDirection };
        export { splitCubic };
        export { getCurveArray };
    }
}
import numbers from "../interpolation/numbers.js";
import pathToString from "svg-path-commander/src/convert/pathToString.js";
declare namespace svgCubicMorphFunctions {
    export { getCubicMorph as prepareStart };
    export { prepareCubicMorph as prepareProperty };
    export { onStartCubicMorph as onStart };
    export { crossCheckCubicMorph as crossCheck };
}
import pathToCurve from "svg-path-commander/src/convert/pathToCurve.js";
import pathToAbsolute from "svg-path-commander/src/convert/pathToAbsolute.js";
import parsePathString from "svg-path-commander/src/process/parsePathString.js";
declare function getRotatedCurve(a: any, b: any): any;
declare function getRotations(a: any): any;
declare function equalizeSegments(path1: any, path2: any, TL: any): any;
import reverseCurve from "svg-path-commander/src/process/reverseCurve.js";
import clonePath from "svg-path-commander/src/process/clonePath.js";
import getDrawDirection from "svg-path-commander/src/util/getDrawDirection.js";
import splitCubic from "svg-path-commander/src/process/splitCubic.js";
declare function getCurveArray(pathString: any): any;
declare function getCubicMorph(): any;
declare function prepareCubicMorph(tweenProp: any, value: any): any;
import { onStartCubicMorph } from "./svgCubicMorphBase.js";
declare function crossCheckCubicMorph(tweenProp: any): void;
