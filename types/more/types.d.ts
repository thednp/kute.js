import CubicBezier from "cubic-bezier-easing";
import Tween from "kute.js/src/tween/tween";
import TweenBase from "kute.js/src/tween/tweenBase";
import TweenExtra from "kute.js/src/tween/tweenExtra";

// custom types
export type selectorType = Element | Element[] | HTMLCollection | string;

export type easingFunction = (fn: number) => number;
export type easingOption = string | easingFunction | CubicBezier;

export declare interface tweenOptions {
    /** @default 700 */
    duration?: number;
    /** @default 0 */
    delay?: number;
    /** @default 0 */
    offset?: number;
    /** @default "linear" */
    easing?: easingOption;
    /** @default 0 */
    repeat?: number;
    /** @default 0 */
    repeatDelay?: number;
    /** @default false */
    yoyo?: boolean;
    /** @default null */
    resetStart?: any;
}

export type tweenProps = [string, (string | number | number[])][];
export type tweenParams = [Element, tweenProps, tweenProps, tweenOptions];
export type twCollection = (Tween | TweenBase | TweenExtra)[];
export type chainOption = Tween | TweenBase | twCollection;
export type propValue = number | number[] | [string, number] | [string, number][];
export type rawValue = string | propValue;
export type interpolationFn = (a: propValue, b: propValue, t: number) => void;
export type prepareStartFn = (a?: string, b?: rawValue) => rawValue;
export type preparePropFn = (a?: string, b?: rawValue) => propValue;
export type onStartPropFn = (tweenProp?: string) => void;

export interface fullComponent {
    component: string;
    category?: string;
    property?: string;
    properties?: string[];
    subProperties?: string[];
    defaultValues?: propValue[];
    defaultValue?: propValue;
    defaultOptions?: [string, string | number | number[]][];
    Interpolate?: [string, interpolationFn][];
    functions: {
        prepareStart: prepareStartFn;
        prepareProperty: preparePropFn;
        onStart: () => onStartPropFn;
        onComplete?: () => void;
        crossCheck?: () => void;
    }
}
export interface baseComponent {
    component: string;
    category?: string;
    property?: string;
    properties?: string[];
    subProperties?: string[];
    defaultOptions?: [string, string | number | number[]][];
    Interpolate?: [string, interpolationFn][];
    functions: {
        onStart: onStartPropFn;
    }
}
export interface curveSpecs {
    s: SVGPathCommander.CSegment | SVGPathCommander.MSegment,
    ss: SVGPathCommander.curveArray,
    l: number
}

export interface curveObject {
    curve: SVGPathCommander.curveArray,
    original: string
}

export type polygonMorph = [number, number][];

export type exactPolygon = { polygon: polygonMorph, skipBisect?: boolean } | false;

export interface polygonObject {
    polygon: polygonMorph,
    original: string
}

export declare interface transformFObject {
    perspective?: number;
    translate3d?: number[];
    rotate3d?: number[];
    skew?: number[];
    scale?: number;
  }

export declare interface transformMObject {
    perspective?: number;
    translate3d?: number[];
    rotate3d?: number[];
    scale3d?: number[];
    skew?: number[];
  }


export interface colorObject {
    /** @default 0 */
    r: number,
    /** @default 0 */
    g: number,
    /** @default 0 */
    b: number,
    /** @default 1 */
    a: number | null
}

export interface drawObject {
    s: number,
    e: number,
    l: number
}

export interface transformSVGObject {
    translate?: number | [number, number], 
    rotate?: number, 
    skewX?: number,
    skewY?: number, 
    scale?: number
}

// boxShadow: '0px 0px 0px 0px rgb(0,0,0)',
// h-shadow, v-shadow, blur, spread, color
export type boxShadowObject = [number, number, number, number, colorObject];
// textShadow: '0px 0px 0px rgb(0,0,0)',
// h-shadow, v-shadow, blur, color
export type textShadowObject = [number, number, number, colorObject]
export type shadowObject = boxShadowObject | textShadowObject;

// property: range | default
export interface filterList {
    /** 
     * opacity range [0-100%]
     * opacity unit %
     * @default 100
     */
    opacity: number,
    /** 
     * blur range [0-N]
     * blur unit [em, px, rem]
     * @default 0
     */
    blur: number,
    /** 
     * saturate range [0-N]
     * saturate unit %
     * @default 100
     */
    saturate: number,
    /** 
     * invert range [0-100]
     * invert unit %
     * @default 0
     */
    invert: number,
    /** 
     * grayscale range [0-100]
     * grayscale unit %
     * @default 0
     */
    grayscale: number,
    /** 
     * brightness range [0-100]
     * brightness unit %
     * @default 100
     */
    brightness: number,
    /** 
     * contrast range [0-N]
     * contrast unit %
     * @default 100
     */
    contrast: number,
    /** 
     * sepia range [0-N]
     * sepia unit %
     * @default 0
     */
    sepia: number,
    /** 
     * hue-rotate range [0-N]
     * hue-rotate unit deg
     * @default 0
     */
    hueRotate: number,
    /** 
     * drop-shadow [x,y,spread,color]
     * @default [0,0,0,{r:0,g:0,b:0}]
     */
    dropShadow: [number, number, number, colorObject],
    /** 
     * "url(_URL_)"
     * @default null
     */
    url: string
}