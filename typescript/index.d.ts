declare module "src/objects/kute" {
    var _default: {};
    export default _default;
}
declare module "src/objects/tweens" {
    var _default: never[];
    export default _default;
}
declare module "src/objects/globalObject" {
    export default globalObject;
    let globalObject: any;
}
declare module "src/objects/interpolate" {
    var _default: {};
    export default _default;
}
declare module "src/objects/onStart" {
    var _default: {};
    export default _default;
}
declare module "src/objects/now" {
    export default now;
    let now: any;
}
declare module "src/core/render" {
    export function stop(): void;
    export default Render;
    export let Tick: number;
    export function Ticker(time: any): void;
    namespace Render {
        export { Tick };
        export { Ticker };
        export { Tweens };
        export { Time };
    }
    import Tweens from "src/objects/tweens";
    namespace Time {
        export { now };
    }
    import now from "src/objects/now";
}
declare module "src/objects/supportedProperties" {
    var _default: {};
    export default _default;
}
declare module "src/objects/defaultValues" {
    var _default: {};
    export default _default;
}
declare module "src/objects/defaultOptions" {
    export default defaultOptions;
    namespace defaultOptions {
        const duration: number;
        const delay: number;
        const easing: string;
    }
}
declare module "src/objects/prepareProperty" {
    var _default: {};
    export default _default;
}
declare module "src/objects/prepareStart" {
    var _default: {};
    export default _default;
}
declare module "src/objects/crossCheck" {
    var _default: {};
    export default _default;
}
declare module "src/objects/onComplete" {
    var _default: {};
    export default _default;
}
declare module "src/objects/linkProperty" {
    var _default: {};
    export default _default;
}
declare module "src/objects/objects" {
    namespace _default {
        export { supportedProperties };
        export { defaultValues };
        export { defaultOptions };
        export { prepareProperty };
        export { prepareStart };
        export { crossCheck };
        export { onStart };
        export { onComplete };
        export { linkProperty };
    }
    export default _default;
    import supportedProperties from "src/objects/supportedProperties";
    import defaultValues from "src/objects/defaultValues";
    import defaultOptions from "src/objects/defaultOptions";
    import prepareProperty from "src/objects/prepareProperty";
    import prepareStart from "src/objects/prepareStart";
    import crossCheck from "src/objects/crossCheck";
    import onStart from "src/objects/onStart";
    import onComplete from "src/objects/onComplete";
    import linkProperty from "src/objects/linkProperty";
}
declare module "src/objects/util" {
    var _default: {};
    export default _default;
}
declare module "src/core/add" {
    function _default(tw: any): number;
    export default _default;
}
declare module "src/core/remove" {
    function _default(tw: any): void;
    export default _default;
}
declare module "src/core/getAll" {
    function _default(): never[];
    export default _default;
}
declare module "src/core/removeAll" {
    function _default(): void;
    export default _default;
}
declare module "src/core/linkInterpolation" {
    export default function linkInterpolation(): void;
}
declare module "src/core/internals" {
    namespace _default {
        export { add };
        export { remove };
        export { getAll };
        export { removeAll };
        export { stop };
        export { linkInterpolation };
    }
    export default _default;
    import add from "src/core/add";
    import remove from "src/core/remove";
    import getAll from "src/core/getAll";
    import removeAll from "src/core/removeAll";
    import { stop } from "src/core/render";
    import linkInterpolation from "src/core/linkInterpolation";
}
declare module "src/process/getInlineStyle" {
    export default function getInlineStyle(el: any): {};
}
declare module "src/process/getStyleForProperty" {
    export default function getStyleForProperty(elem: any, propertyName: any): any;
}
declare module "src/process/prepareObject" {
    export default function prepareObject(obj: any, fn: any): void;
}
declare module "src/process/getStartValues" {
    export default function getStartValues(): void;
    export default class getStartValues {
        valuesStart: {};
    }
}
declare module "src/process/process" {
    namespace _default {
        export { getInlineStyle };
        export { getStyleForProperty };
        export { getStartValues };
        export { prepareObject };
    }
    export default _default;
    import getInlineStyle from "src/process/getInlineStyle";
    import getStyleForProperty from "src/process/getStyleForProperty";
    import getStartValues from "src/process/getStartValues";
    import prepareObject from "src/process/prepareObject";
}
declare module "src/objects/connect" {
    var _default: {};
    export default _default;
}
declare module "src/easing/easing-bezier" {
    export default Easing;
    namespace Easing {
        const linear: any;
        const easingSinusoidalIn: any;
        const easingSinusoidalOut: any;
        const easingSinusoidalInOut: any;
        const easingQuadraticIn: any;
        const easingQuadraticOut: any;
        const easingQuadraticInOut: any;
        const easingCubicIn: any;
        const easingCubicOut: any;
        const easingCubicInOut: any;
        const easingQuarticIn: any;
        const easingQuarticOut: any;
        const easingQuarticInOut: any;
        const easingQuinticIn: any;
        const easingQuinticOut: any;
        const easingQuinticInOut: any;
        const easingExponentialIn: any;
        const easingExponentialOut: any;
        const easingExponentialInOut: any;
        const easingCircularIn: any;
        const easingCircularOut: any;
        const easingCircularInOut: any;
        const easingBackIn: any;
        const easingBackOut: any;
        const easingBackInOut: any;
    }
}
declare module "src/util/selector" {
    export default function selector(el: any, multi: any): any;
}
declare module "src/core/queueStart" {
    export default function queueStart(): void;
}
declare module "src/tween/tweenBase" {
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
}
declare module "src/tween/tween" {
    export default class Tween extends TweenBase {
        constructor(...args: any[]);
        paused: boolean;
        _pauseTime: any;
        _repeat: any;
        _repeatDelay: any;
        _repeatOption: any;
        valuesRepeat: {};
        _yoyo: any;
        _reversed: boolean;
        resume(): Tween;
        pause(): Tween;
        reverse(): void;
    }
    import TweenBase from "src/tween/tweenBase";
}
declare module "src/tween/tweenCollection" {
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
}
declare module "src/interface/to" {
    export default function to(element: any, endObject: any, optionsObj: any): any;
}
declare module "src/interface/fromTo" {
    export default function fromTo(element: any, startObject: any, endObject: any, optionsObj: any): any;
}
declare module "src/interface/allTo" {
    export default function allTo(elements: any, endObject: any, optionsObj: any): TweenCollection;
    import TweenCollection from "src/tween/tweenCollection";
}
declare module "src/interface/allFromTo" {
    export default function allFromTo(elements: any, startObject: any, endObject: any, optionsObj: any): TweenCollection;
    import TweenCollection from "src/tween/tweenCollection";
}
declare module "src/animation/animation" {
    export default class Animation {
        constructor(Component: any);
        setComponent(Component: any): Animation;
    }
}
declare module "src/util/trueDimension" {
    export default function trueDimension(dimValue: any, isAngle: any): {
        v: number;
        u: string;
    };
}
declare module "src/interpolation/numbers" {
    export default function numbers(a: any, b: any, v: any): number;
}
declare module "src/components/boxModelBase" {
    export function boxModelOnStart(tweenProp: any): void;
    export default baseBoxModel;
    namespace baseBoxModel {
        export const component: string;
        export const category: string;
        export { baseBoxProps as properties };
        export namespace Interpolate {
            export { numbers };
        }
        export namespace functions {
            export { baseBoxOnStart as onStart };
        }
    }
    const baseBoxProps: string[];
    import numbers from "src/interpolation/numbers";
    const baseBoxOnStart: {};
}
declare module "src/components/boxModelEssential" {
    export default essentialBoxModel;
    namespace essentialBoxModel {
        export const component: string;
        export const category: string;
        export { essentialBoxProps as properties };
        export { essentialBoxPropsValues as defaultValues };
        export namespace Interpolate {
            export { numbers };
        }
        export { essentialBoxModelFunctions as functions };
        export namespace Util {
            export { trueDimension };
        }
    }
    const essentialBoxProps: string[];
    namespace essentialBoxPropsValues {
        const top: number;
        const left: number;
        const width: number;
        const height: number;
    }
    import numbers from "src/interpolation/numbers";
    namespace essentialBoxModelFunctions {
        export { getBoxModel as prepareStart };
        export { prepareBoxModel as prepareProperty };
        export { essentialBoxOnStart as onStart };
    }
    import trueDimension from "src/util/trueDimension";
    function getBoxModel(tweenProp: any): any;
    function prepareBoxModel(tweenProp: any, value: any): number;
    const essentialBoxOnStart: {};
}
declare module "src/util/hexToRGB" {
    function _default(hex: any): {
        r: number;
        g: number;
        b: number;
    } | null;
    export default _default;
}
declare module "src/util/trueColor" {
    export default function trueColor(colorString: any): {
        r: number;
        g: number;
        b: number;
        a?: undefined;
    } | {
        r: number;
        g: number;
        b: number;
        a: number;
    } | undefined;
}
declare module "src/interpolation/colors" {
    export default function colors(a: any, b: any, v: any): string;
}
declare module "src/components/colorPropertiesBase" {
    export function onStartColors(tweenProp: any): void;
    export namespace baseColors {
        const component: string;
        const category: string;
        namespace Interpolate {
            export { numbers };
            export { colors };
        }
        namespace functions {
            export { colorsOnStart as onStart };
        }
    }
    export default baseColors;
    import numbers from "src/interpolation/numbers";
    import colors from "src/interpolation/colors";
    const colorsOnStart: {};
}
declare module "src/components/colorProperties" {
    export default colorProperties;
    namespace colorProperties {
        export const component: string;
        export const category: string;
        export { supportedColors as properties };
        export { defaultColors as defaultValues };
        export namespace Interpolate {
            export { numbers };
            export { colors };
        }
        export { colorFunctions as functions };
        export namespace Util {
            export { trueColor };
        }
    }
    const supportedColors: string[];
    const defaultColors: {};
    import numbers from "src/interpolation/numbers";
    import colors from "src/interpolation/colors";
    namespace colorFunctions {
        export { getColor as prepareStart };
        export { prepareColor as prepareProperty };
        export { colorsOnStart as onStart };
    }
    import trueColor from "src/util/trueColor";
    function getColor(prop: any): any;
    function prepareColor(prop: any, value: any): {
        r: number;
        g: number;
        b: number;
        a?: undefined;
    } | {
        r: number;
        g: number;
        b: number;
        a: number;
    } | undefined;
    const colorsOnStart: {};
}
declare module "src/components/htmlAttributesBase" {
    export namespace onStartAttr {
        function attr(tweenProp: any): void;
        function attr(tweenProp: any): void;
        function attributes(tweenProp: any): void;
        function attributes(tweenProp: any): void;
    }
    export default baseAttributes;
    export const attributes: {};
    namespace baseAttributes {
        export { ComponentName as component };
        export const property: string;
        export namespace Interpolate {
            export { numbers };
            export { colors };
        }
        export namespace functions {
            export { onStartAttr as onStart };
        }
    }
    const ComponentName: "baseHTMLAttributes";
    import numbers from "src/interpolation/numbers";
    import colors from "src/interpolation/colors";
}
declare module "src/components/htmlAttributes" {
    export function getAttr(tweenProp: any, value: any): {};
    export function prepareAttr(tweenProp: any, attrObj: any): {};
    export default htmlAttributes;
    namespace htmlAttributes {
        export { ComponentName as component };
        export const property: string;
        export const subProperties: string[];
        export const defaultValue: {
            fill: string;
            stroke: string;
            'stop-color': string;
            opacity: number;
            'stroke-opacity': number;
            'fill-opacity': number;
        };
        export namespace Interpolate {
            export { numbers };
            export { colors };
        }
        export { attrFunctions as functions };
        export namespace Util {
            export { replaceUppercase };
            export { trueColor };
            export { trueDimension };
        }
    }
    const ComponentName: "htmlAttributes";
    import numbers from "src/interpolation/numbers";
    import colors from "src/interpolation/colors";
    namespace attrFunctions {
        export { getAttr as prepareStart };
        export { prepareAttr as prepareProperty };
        export { onStartAttr as onStart };
    }
    function replaceUppercase(a: any): any;
    import trueColor from "src/util/trueColor";
    import trueDimension from "src/util/trueDimension";
    import { onStartAttr } from "src/components/htmlAttributesBase";
}
declare module "src/components/opacityPropertyBase" {
    export function onStartOpacity(tweenProp: any): void;
    export default baseOpacity;
    namespace baseOpacity {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartOpacity as onStart };
        }
    }
    import numbers from "src/interpolation/numbers";
}
declare module "src/components/opacityProperty" {
    export default opacityProperty;
    namespace opacityProperty {
        export const component: string;
        export const property: string;
        export const defaultValue: number;
        export namespace Interpolate {
            export { numbers };
        }
        export { opacityFunctions as functions };
    }
    import numbers from "src/interpolation/numbers";
    namespace opacityFunctions {
        export { getOpacity as prepareStart };
        export { prepareOpacity as prepareProperty };
        export { onStartOpacity as onStart };
    }
    function getOpacity(tweenProp: any): any;
    function prepareOpacity(tweenProp: any, value: any): number;
    import { onStartOpacity } from "src/components/opacityPropertyBase";
}
declare module "src/components/textWriteBase" {
    export namespace onStartWrite {
        function text(tweenProp: any): void;
        function text(tweenProp: any): void;
        function number(tweenProp: any): void;
        function number(tweenProp: any): void;
    }
    export namespace baseTextWrite {
        const component: string;
        const category: string;
        namespace defaultOptions {
            const textChars: string;
        }
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartWrite as onStart };
        }
        namespace Util {
            export { charSet };
        }
    }
    export default baseTextWrite;
    export namespace charSet {
        export { lowerCaseAlpha as alpha };
        export { upperCaseAlpha as upper };
        export { nonAlpha as symbols };
        export { numeric };
        export { alphaNumeric as alphanumeric };
        export { allTypes as all };
    }
    import numbers from "src/interpolation/numbers";
    const lowerCaseAlpha: string[];
    const upperCaseAlpha: string[];
    const nonAlpha: string[];
    const numeric: string[];
    const alphaNumeric: string[];
    const allTypes: string[];
}
declare module "src/components/textWrite" {
    export function createTextTweens(target: any, newText: any, ops: any): false | any[];
    export namespace textWriteFunctions {
        export { getWrite as prepareStart };
        export { prepareText as prepareProperty };
        export { onStartWrite as onStart };
    }
    export namespace textWrite {
        export const component: string;
        export const category: string;
        export const properties: string[];
        export namespace defaultValues {
            const text: string;
            const number: string;
        }
        export namespace defaultOptions {
            const textChars: string;
        }
        export namespace Interpolate {
            export { numbers };
        }
        export { textWriteFunctions as functions };
        export namespace Util {
            export { charSet };
            export { createTextTweens };
        }
    }
    export default textWrite;
    function getWrite(): any;
    function prepareText(tweenProp: any, value: any): any;
    import { onStartWrite } from "src/components/textWriteBase";
    import numbers from "src/interpolation/numbers";
    import { charSet } from "src/components/textWriteBase";
}
declare module "src/interpolation/perspective" {
    export default function perspective(a: any, b: any, u: any, v: any): string;
}
declare module "src/interpolation/translate3d" {
    export default function translate3d(a: any, b: any, u: any, v: any): string;
}
declare module "src/interpolation/rotate3d" {
    export default function rotate3d(a: any, b: any, u: any, v: any): string;
}
declare module "src/interpolation/translate" {
    export default function translate(a: any, b: any, u: any, v: any): string;
}
declare module "src/interpolation/rotate" {
    export default function rotate(a: any, b: any, u: any, v: any): string;
}
declare module "src/interpolation/scale" {
    export default function scale(a: any, b: any, v: any): string;
}
declare module "src/interpolation/skew" {
    export default function skew(a: any, b: any, u: any, v: any): string;
}
declare module "src/components/transformFunctionsBase" {
    export function onStartTransform(tweenProp: any): void;
    export default BaseTransform;
    namespace BaseTransform {
        const component: string;
        const property: string;
        namespace functions {
            export { onStartTransform as onStart };
        }
        namespace Interpolate {
            export { perspective };
            export { translate3d };
            export { rotate3d };
            export { translate };
            export { rotate };
            export { scale };
            export { skew };
        }
    }
    import perspective from "src/interpolation/perspective";
    import translate3d from "src/interpolation/translate3d";
    import rotate3d from "src/interpolation/rotate3d";
    import translate from "src/interpolation/translate";
    import rotate from "src/interpolation/rotate";
    import scale from "src/interpolation/scale";
    import skew from "src/interpolation/skew";
}
declare module "src/components/transformFunctions" {
    export default transformFunctionsComponent;
    namespace transformFunctionsComponent {
        export const component: string;
        export const property: string;
        export { supportedTransformProperties as subProperties };
        export { defaultTransformValues as defaultValues };
        export { transformFunctions as functions };
        export namespace Interpolate {
            export { perspective };
            export { translate3d };
            export { rotate3d };
            export { translate };
            export { rotate };
            export { scale };
            export { skew };
        }
    }
    const supportedTransformProperties: string[];
    namespace defaultTransformValues {
        const perspective_1: number;
        export { perspective_1 as perspective };
        const translate3d_1: number[];
        export { translate3d_1 as translate3d };
        export const translateX: number;
        export const translateY: number;
        export const translateZ: number;
        const translate_1: number[];
        export { translate_1 as translate };
        const rotate3d_1: number[];
        export { rotate3d_1 as rotate3d };
        export const rotateX: number;
        export const rotateY: number;
        export const rotateZ: number;
        const rotate_1: number;
        export { rotate_1 as rotate };
        export const skewX: number;
        export const skewY: number;
        const skew_1: number[];
        export { skew_1 as skew };
        const scale_1: number;
        export { scale_1 as scale };
    }
    namespace transformFunctions {
        export { getTransform as prepareStart };
        export { prepareTransform as prepareProperty };
        export { onStartTransform as onStart };
        export { crossCheckTransform as crossCheck };
    }
    import perspective from "src/interpolation/perspective";
    import translate3d from "src/interpolation/translate3d";
    import rotate3d from "src/interpolation/rotate3d";
    import translate from "src/interpolation/translate";
    import rotate from "src/interpolation/rotate";
    import scale from "src/interpolation/scale";
    import skew from "src/interpolation/skew";
    function getTransform(tweenProperty: any): any;
    function prepareTransform(prop: any, obj: any): {};
    import { onStartTransform } from "src/components/transformFunctionsBase";
    function crossCheckTransform(tweenProp: any): void;
}
declare module "src/components/svgDrawBase" {
    export function onStartDraw(tweenProp: any): void;
    export default baseSVGDraw;
    namespace baseSVGDraw {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartDraw as onStart };
        }
    }
    import numbers from "src/interpolation/numbers";
}
declare module "src/components/svgDraw" {
    export default svgDraw;
    namespace svgDraw {
        export const component: string;
        export const property: string;
        export const defaultValue: string;
        export namespace Interpolate {
            export { numbers };
        }
        export { svgDrawFunctions as functions };
        export namespace Util {
            export { getRectLength };
            export { getPolyLength };
            export { getLineLength };
            export { getCircleLength };
            export { getEllipseLength };
            export { getTotalLength };
            export { resetDraw };
            export { getDraw };
            export { percent };
        }
    }
    import numbers from "src/interpolation/numbers";
    namespace svgDrawFunctions {
        export { getDrawValue as prepareStart };
        export { prepareDraw as prepareProperty };
        export { onStartDraw as onStart };
    }
    function getRectLength(el: any): number;
    function getPolyLength(el: any): number;
    function getLineLength(el: any): number;
    function getCircleLength(el: any): number;
    function getEllipseLength(el: any): number;
    function getTotalLength(el: any): number;
    function resetDraw(elem: any): void;
    function getDraw(element: any, value: any): any;
    function percent(v: any, l: any): number;
    function getDrawValue(): any;
    function prepareDraw(a: any, o: any): any;
    import { onStartDraw } from "src/components/svgDrawBase";
}
declare module "src/interpolation/coords" {
    export default function coords(a: any, b: any, l: any, v: any): never[][];
}
declare module "src/components/svgMorphBase" {
    export function onStartSVGMorph(tweenProp: any): void;
    export default baseSVGMorph;
    namespace baseSVGMorph {
        export const component: string;
        export const property: string;
        export { coords as Interpolate };
        export namespace functions {
            export { onStartSVGMorph as onStart };
        }
    }
    import coords from "src/interpolation/coords";
}
declare module "src/components/svgMorph" {
    export default svgMorph;
    namespace svgMorph {
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
    import coords from "src/interpolation/coords";
    namespace svgMorphFunctions {
        export { getSVGMorph as prepareStart };
        export { prepareSVGMorph as prepareProperty };
        export { onStartSVGMorph as onStart };
        export { crossCheckSVGMorph as crossCheck };
    }
    function addPoints(ring: any, numPoints: any): void;
    function bisect(ring: any, maxSegmentLength?: number): void;
    function normalizeRing(input: any, maxSegmentLength: any): any;
    function validRing(ring: any): boolean;
    function getInterpolationPoints(pathArray1: any, pathArray2: any, precision: any): any[];
    function pathStringToRing(str: any, maxSegmentLength: any): {
        ring: any[][];
        pathLength: number;
    } | {
        pathLength: any;
        ring: any[][];
        skipBisect: boolean;
    };
    function approximateRing(parsed: any, maxSegmentLength: any): {
        pathLength: any;
        ring: any[][];
        skipBisect: boolean;
    };
    function rotateRing(ring: any, vs: any): void;
    function getSVGMorph(): any;
    function prepareSVGMorph(tweenProp: any, value: any): any;
    import { onStartSVGMorph } from "src/components/svgMorphBase";
    function crossCheckSVGMorph(prop: any): void;
}
declare module "src/objects/componentsDefault" {
    export default Components;
    namespace Components {
        export { EssentialBoxModel };
        export { ColorsProperties };
        export { HTMLAttributes };
        export { OpacityProperty };
        export { TextWrite };
        export { TransformFunctions };
        export { SVGDraw };
        export { SVGMorph };
    }
    import EssentialBoxModel from "src/components/boxModelEssential";
    import ColorsProperties from "src/components/colorProperties";
    import HTMLAttributes from "src/components/htmlAttributes";
    import OpacityProperty from "src/components/opacityProperty";
    import TextWrite from "src/components/textWrite";
    import TransformFunctions from "src/components/transformFunctions";
    import SVGDraw from "src/components/svgDraw";
    import SVGMorph from "src/components/svgMorph";
}
declare module "src/index" {
    export default KUTE;
    namespace KUTE {
        export { Animation };
        export { Components };
        export { Tween };
        export { fromTo };
        export { to };
        export { TweenCollection };
        export { allFromTo };
        export { allTo };
        export { Objects };
        export { Util };
        export { Easing };
        export { CubicBezier };
        export { Render };
        export { Interpolate };
        export { Process };
        export { Internals };
        export { Selector };
        export { Version };
    }
    import Animation from "src/animation/animation";
    import Components from "src/objects/componentsDefault";
    import Tween from "src/tween/tween";
    import fromTo from "src/interface/fromTo";
    import to from "src/interface/to";
    import TweenCollection from "src/tween/tweenCollection";
    import allFromTo from "src/interface/allFromTo";
    import allTo from "src/interface/allTo";
    import Objects from "src/objects/objects";
    import Util from "src/objects/util";
    import Easing from "src/easing/easing-bezier";
    import Render from "src/core/render";
    import Interpolate from "src/objects/interpolate";
    import Process from "src/process/process";
    import Internals from "src/core/internals";
    import Selector from "src/util/selector";
    import { version as Version } from "package.json";
}
