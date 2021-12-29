declare module "kute.js/src/objects/supportedProperties" {
    export default supportedProperties;
    const supportedProperties: {};
}
declare module "kute.js/src/objects/defaultValues" {
    export default defaultValues;
    const defaultValues: {};
}
declare module "kute.js/src/objects/defaultOptions" {
    export default defaultOptions;
    namespace defaultOptions {
        const duration: number;
        const delay: number;
        const easing: string;
        const repeat: number;
        const repeatDelay: number;
        const yoyo: boolean;
        const resetStart: boolean;
        const offset: number;
    }
}
declare module "kute.js/src/objects/prepareProperty" {
    export default prepareProperty;
    const prepareProperty: {};
}
declare module "kute.js/src/objects/prepareStart" {
    export default prepareStart;
    const prepareStart: {};
}
declare module "kute.js/src/objects/onStart" {
    export default onStart;
    const onStart: {};
}
declare module "kute.js/src/objects/onComplete" {
    export default onComplete;
    const onComplete: {};
}
declare module "kute.js/src/objects/crossCheck" {
    export default crossCheck;
    const crossCheck: {};
}
declare module "kute.js/src/objects/linkProperty" {
    export default linkProperty;
    const linkProperty: {};
}
declare module "kute.js/src/objects/util" {
    export default Util;
    const Util: {};
}
declare module "kute.js/src/objects/interpolate" {
    export default interpolate;
    const interpolate: {};
}
declare module "kute.js/src/animation/animation" {
    /**
     * Animation Class
     *
     * Registers components by populating KUTE.js objects and makes sure
     * no duplicate component / property is allowed.
     */
    export default class Animation {
        /**
         * @constructor
         * @param {KUTE.fullComponent} Component
         */
        constructor(Component: KUTE.fullComponent);
    }
}
declare module "kute.js/src/animation/animationBase" {
    /**
     * Animation Base Class
     *
     * Registers components by populating KUTE.js objects and makes sure
     * no duplicate component / property is allowed.
     *
     * This class only registers the minimal amount of component information
     * required to enable components animation, which means value processing
     * as well as `to()` and `allTo()` methods are not supported.
     */
    export default class AnimationBase {
        /**
         * @class
         * @param {KUTE.baseComponent} Component
         */
        constructor(Component: KUTE.baseComponent);
        _: number;
    }
}
declare module "kute.js/src/animation/animationDevelopment" {
    /**
     * Animation Development Class
     *
     * Registers components by populating KUTE.js objects and makes sure
     * no duplicate component / property is allowed.
     *
     * In addition to the default class, this one provides more component
     * information to help you with custom component development.
     */
    export default class AnimationDevelopment extends Animation {
        /**
         *
         * @param  {KUTE.fullComponent} args
         */
        constructor(Component: any);
    }
    import Animation from "kute.js/src/animation/animation";
}
declare module "kute.js/src/process/getStyleForProperty" {
    /**
     * getStyleForProperty
     *
     * Returns the computed style property for element for .to() method.
     * Used by for the `.to()` static method.
     *
     * @param {Element} elem
     * @param {string} propertyName
     * @returns {string}
     */
    export default function getStyleForProperty(elem: Element, propertyName: string): string;
}
declare module "kute.js/src/interpolation/numbers" {
    /**
     * Numbers Interpolation Function.
     *
     * @param {number} a start value
     * @param {number} b end value
     * @param {number} v progress
     * @returns {number} the interpolated number
     */
    export default function numbers(a: number, b: number, v: number): number;
}
declare module "kute.js/src/util/trueDimension" {
    export default trueDimension;
    /**
     * trueDimension
     *
     * Returns the string value of a specific CSS property converted into a nice
     * { v = value, u = unit } object.
     *
     * @param {string} dimValue the property string value
     * @param {boolean | number} isAngle sets the utility to investigate angles
     * @returns {{v: number, u: string}} the true {value, unit} tuple
     */
    function trueDimension(dimValue: string, isAngle: boolean | number): {
        v: number;
        u: string;
    };
}
declare module "kute.js/src/objects/kute" {
    export default KEC;
    /**
     * The KUTE.js Execution Context
     */
    const KEC: {};
}
declare module "kute.js/src/components/backgroundPositionBase" {
    /**
     * Sets the property update function.
     * @param {string} prop the property name
     */
    export function onStartBgPos(prop: string): void;
    export default BackgroundPositionBase;
    namespace BackgroundPositionBase {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartBgPos as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
}
declare module "kute.js/src/components/backgroundPosition" {
    export default BackgroundPosition;
    namespace BackgroundPosition {
        export const component: string;
        export const property: string;
        export const defaultValue: number[];
        export namespace Interpolate {
            export { numbers };
        }
        export { bgPositionFunctions as functions };
        export namespace Util {
            export { trueDimension };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    namespace bgPositionFunctions {
        export { getBgPos as prepareStart };
        export { prepareBgPos as prepareProperty };
        export { onStartBgPos as onStart };
    }
    import trueDimension from "kute.js/src/util/trueDimension";
    /**
     * Returns the property computed style.
     * @param {string} prop the property
     * @returns {string} the property computed style
     */
    function getBgPos(prop: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {number[]} the property tween object
     */
    function prepareBgPos(_: string, value: string): number[];
    import { onStartBgPos } from "kute.js/src/components/backgroundPositionBase";
}
declare module "kute.js/src/interpolation/units" {
    /**
     * Units Interpolation Function.
     *
     * @param {number} a start value
     * @param {number} b end value
     * @param {string} u unit
     * @param {number} v progress
     * @returns {string} the interpolated value + unit string
     */
    export default function units(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/components/borderRadiusBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function radiusOnStartFn(tweenProp: string): void;
    export default BorderRadiusBase;
    namespace BorderRadiusBase {
        const component: string;
        const category: string;
        namespace Interpolate {
            export { units };
        }
        namespace functions {
            export { radiusOnStart as onStart };
        }
    }
    import units from "kute.js/src/interpolation/units";
    const radiusOnStart: {};
}
declare module "kute.js/src/components/borderRadius" {
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @returns {string} the property computed style
     */
    export function getRadius(tweenProp: string): string;
    /**
     * Returns the property tween object.
     * @param {string} value the property value
     * @returns {{v: number, u: string}} the property tween object
     */
    export function prepareRadius(_: any, value: string): {
        v: number;
        u: string;
    };
    export namespace radiusFunctions {
        export { getRadius as prepareStart };
        export { prepareRadius as prepareProperty };
        export { radiusOnStart as onStart };
    }
    export default BorderRadius;
    const radiusOnStart: {};
    namespace BorderRadius {
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
    const radiusProps: string[];
    const radiusValues: {};
    import units from "kute.js/src/interpolation/units";
    import trueDimension from "kute.js/src/util/trueDimension";
}
declare module "kute.js/src/components/boxModelBase" {
    /**
     * Sets the update function for the property.
     * @param {string} tweenProp the property name
     */
    export function boxModelOnStart(tweenProp: string): void;
    export default BoxModelBase;
    namespace BoxModelBase {
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
    import numbers from "kute.js/src/interpolation/numbers";
    const baseBoxOnStart: {};
}
declare module "kute.js/src/components/boxModel" {
    export default BoxModel;
    namespace BoxModel {
        export const component: string;
        export const category: string;
        export { boxModelProperties as properties };
        export { boxModelValues as defaultValues };
        export namespace Interpolate {
            export { numbers };
        }
        export { boxModelFunctions as functions };
    }
    const boxModelProperties: string[];
    const boxModelValues: {};
    import numbers from "kute.js/src/interpolation/numbers";
    namespace boxModelFunctions {
        export { getBoxModel as prepareStart };
        export { prepareBoxModel as prepareProperty };
        export { boxPropsOnStart as onStart };
    }
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @returns {string} computed style for property
     */
    function getBoxModel(tweenProp: string): string;
    /**
     * Returns the property tween object.
     * @param {string} tweenProp the property name
     * @param {string} value the property value
     * @returns {number} the property tween object
     */
    function prepareBoxModel(tweenProp: string, value: string): number;
    const boxPropsOnStart: {};
}
declare module "kute.js/src/components/boxModelEssential" {
    export default BoxModelEssential;
    namespace BoxModelEssential {
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
    import numbers from "kute.js/src/interpolation/numbers";
    namespace essentialBoxModelFunctions {
        export { getBoxModel as prepareStart };
        export { prepareBoxModel as prepareProperty };
        export { essentialBoxOnStart as onStart };
    }
    import trueDimension from "kute.js/src/util/trueDimension";
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @returns {string} computed style for property
     */
    function getBoxModel(tweenProp: string): string;
    /**
     * Returns the property tween object.
     * @param {string} tweenProp the property name
     * @param {string} value the property name
     * @returns {number} the property tween object
     */
    function prepareBoxModel(tweenProp: string, value: string): number;
    const essentialBoxOnStart: {};
}
declare module "kute.js/src/components/clipPropertyBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartClip(tweenProp: string): void;
    export default ClipPropertyBase;
    namespace ClipPropertyBase {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartClip as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
}
declare module "kute.js/src/components/clipProperty" {
    export default ClipProperty;
    namespace ClipProperty {
        export const component: string;
        export const property: string;
        export const defaultValue: number[];
        export namespace Interpolate {
            export { numbers };
        }
        export { clipFunctions as functions };
        export namespace Util {
            export { trueDimension };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    namespace clipFunctions {
        export { getClip as prepareStart };
        export { prepareClip as prepareProperty };
        export { onStartClip as onStart };
    }
    import trueDimension from "kute.js/src/util/trueDimension";
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @returns {string | number[]} computed style for property
     */
    function getClip(tweenProp: string): string | number[];
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {number[]} the property tween object
     */
    function prepareClip(_: string, value: string): number[];
    import { onStartClip } from "kute.js/src/components/clipPropertyBase";
}
declare module "kute.js/src/util/hexToRGB" {
    export default hexToRGB;
    /**
     * hexToRGB
     *
     * Converts a #HEX color format into RGB
     * and returns a color object {r,g,b}.
     *
     * @param {string} hex the degree angle
     * @returns {KUTE.colorObject | null} the radian angle
     */
    function hexToRGB(hex: string): KUTE.colorObject | null;
}
declare module "kute.js/src/util/trueColor" {
    export default trueColor;
    /**
     * trueColor
     *
     * Transform any color to rgba()/rgb() and return a nice RGB(a) object.
     *
     * @param {string} colorString the color input
     * @returns {KUTE.colorObject} the {r,g,b,a} color object
     */
    function trueColor(colorString: string): KUTE.colorObject;
}
declare module "kute.js/src/interpolation/colors" {
    /**
     * Color Interpolation Function.
     *
     * @param {KUTE.colorObject} a start color
     * @param {KUTE.colorObject} b end color
     * @param {number} v progress
     * @returns {string} the resulting color
     */
    export default function colors(a: KUTE.colorObject, b: KUTE.colorObject, v: number): string;
}
declare module "kute.js/src/components/colorPropertiesBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartColors(tweenProp: string): void;
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
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
    const colorsOnStart: {};
}
declare module "kute.js/src/components/colorProperties" {
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
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
    namespace colorFunctions {
        export { getColor as prepareStart };
        export { prepareColor as prepareProperty };
        export { colorsOnStart as onStart };
    }
    import trueColor from "kute.js/src/util/trueColor";
    /**
     * Returns the current property computed style.
     * @param {string} prop the property name
     * @returns {string} property computed style
     */
    function getColor(prop: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {KUTE.colorObject} the property tween object
     */
    function prepareColor(_: string, value: string): KUTE.colorObject;
    const colorsOnStart: {};
}
declare module "kute.js/src/process/getInlineStyle" {
    /**
     * getInlineStyle
     * Returns the transform style for element from
     * cssText. Used by for the `.to()` static method.
     *
     * @param {Element} el target element
     * @returns {object}
     */
    export default function getInlineStyle(el: Element): object;
}
declare module "kute.js/src/util/getPrefix" {
    export default getPrefix;
    /**
     * getPrefix
     *
     * Returns browser CSS3 prefix. Keep `for()`
     * for wider browser support.
     *
     * @returns {?string} the browser prefix
     */
    function getPrefix(): string | null;
}
declare module "kute.js/src/util/trueProperty" {
    export default trueProperty;
    /**
     * trueProperty
     *
     * Returns prefixed property name in a legacy browser
     * or the regular name in modern browsers.
     *
     * @param {string} property the property name
     * @returns {string} the right property name for every browser
     */
    function trueProperty(property: string): string;
}
declare module "kute.js/src/components/crossBrowserMove" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the `path` property
     */
    export function onStartComponent(tweenProp: string): void;
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
    import numbers from "kute.js/src/interpolation/numbers";
    namespace crossBrowserMove {
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
    namespace componentFunctions {
        export { getComponentCurrentValue as prepareStart };
        export { prepareComponentValue as prepareProperty };
        export { onStartComponent as onStart };
    }
    import trueProperty from "kute.js/src/util/trueProperty";
    /**
     * Returns the property current style.
     */
    function getComponentCurrentValue(): number[];
    /**
     * Returns the property tween object.
     * @param {string} _ property name
     * @param {string} value property value
     * @returns {number[]} the property tween object
     */
    function prepareComponentValue(_: string, value: string): number[];
}
declare module "kute.js/src/components/filterEffectsBase" {
    /**
     * Sets the `drop-shadow` sub-property update function.
     * * disimbiguation `dropshadow` interpolation function and `dropShadow` property
     * @param {string} tweenProp the property name
     */
    export function dropshadow(a: any, b: any, v: any): string;
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartFilter(tweenProp: string): void;
    export default baseFilter;
    namespace baseFilter {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers as opacity };
            export { numbers as blur };
            export { numbers as saturate };
            export { numbers as grayscale };
            export { numbers as brightness };
            export { numbers as contrast };
            export { numbers as sepia };
            export { numbers as invert };
            export { numbers as hueRotate };
            export namespace dropShadow {
                export { numbers };
                export { colors };
                export { dropshadow };
            }
        }
        namespace functions {
            export { onStartFilter as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
}
declare module "kute.js/src/components/filterEffects" {
    export default filterEffects;
    namespace filterEffects {
        export const component: string;
        export const property: string;
        export namespace defaultValue {
            const opacity: number;
            const blur: number;
            const saturate: number;
            const grayscale: number;
            const brightness: number;
            const contrast: number;
            const sepia: number;
            const invert: number;
            const hueRotate: number;
            const dropShadow: (number | {
                r: number;
                g: number;
                b: number;
            })[];
            const url: string;
        }
        export namespace Interpolate {
            export { numbers as opacity };
            export { numbers as blur };
            export { numbers as saturate };
            export { numbers as grayscale };
            export { numbers as brightness };
            export { numbers as contrast };
            export { numbers as sepia };
            export { numbers as invert };
            export { numbers as hueRotate };
            export namespace dropShadow_1 {
                export { numbers };
                export { colors };
                export { dropshadow };
            }
            export { dropShadow_1 as dropShadow };
        }
        export { filterFunctions as functions };
        export namespace Util {
            export { parseDropShadow };
            export { parseFilterString };
            export { replaceDashNamespace };
            export { trueColor };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
    import { dropshadow } from "kute.js/src/components/filterEffectsBase";
    namespace filterFunctions {
        export { getFilter as prepareStart };
        export { prepareFilter as prepareProperty };
        export { onStartFilter as onStart };
        export { crossCheckFilter as crossCheck };
    }
    /**
     * Returns `drop-shadow` sub-property object.
     * @param {(string | number)[]} shadow and `Array` with `drop-shadow` parameters
     * @returns {KUTE.filterList['dropShadow']} the expected `drop-shadow` values
     */
    function parseDropShadow(shadow: (string | number)[]): KUTE.filterList['dropShadow'];
    /**
     * Returns an array with current filter sub-properties values.
     * @param {string} currentStyle the current filter computed style
     * @returns {{[x: string]: number}} the filter tuple
     */
    function parseFilterString(currentStyle: string): {
        [x: string]: number;
    };
    /**
     * Returns camelCase filter sub-property.
     * @param {string} str source string
     * @returns {string} camelCase property name
     */
    function replaceDashNamespace(str: string): string;
    import trueColor from "kute.js/src/util/trueColor";
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @param {string} value the property value
     * @returns {string} computed style for property
     */
    function getFilter(tweenProp: string, value: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property name
     * @returns {KUTE.filterList} the property tween object
     */
    function prepareFilter(_: string, value: string): KUTE.filterList;
    import { onStartFilter } from "kute.js/src/components/filterEffectsBase";
    /**
     * Adds missing sub-properties in `valuesEnd` from `valuesStart`.
     * @param {string} tweenProp the property name
     */
    function crossCheckFilter(tweenProp: string): void;
}
declare module "kute.js/src/components/htmlAttributesBase" {
    export namespace onStartAttr {
        /**
         * onStartAttr.attr
         *
         * Sets the sub-property update function.
         * @param {string} tweenProp the property name
         */
        function attr(tweenProp: string): void;
        /**
         * onStartAttr.attr
         *
         * Sets the sub-property update function.
         * @param {string} tweenProp the property name
         */
        function attr(tweenProp: string): void;
        /**
         * onStartAttr.attributes
         *
         * Sets the update function for the property.
         * @param {string} tweenProp the property name
         */
        function attributes(tweenProp: string): void;
        /**
         * onStartAttr.attributes
         *
         * Sets the update function for the property.
         * @param {string} tweenProp the property name
         */
        function attributes(tweenProp: string): void;
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
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
}
declare module "kute.js/src/components/htmlAttributes" {
    /**
     * Returns the current attribute value.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {{[x:string]: string}} attribute value
     */
    export function getAttr(_: string, value: string): {
        [x: string]: string;
    };
    /**
     * Returns the property tween object.
     * @param {string} tweenProp the property name
     * @param {string} attrObj the property value
     * @returns {number} the property tween object
     */
    export function prepareAttr(tweenProp: string, attrObj: string): number;
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
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
    namespace attrFunctions {
        export { getAttr as prepareStart };
        export { prepareAttr as prepareProperty };
        export { onStartAttr as onStart };
    }
    /**
     * Returns non-camelcase property name.
     * @param {string} a the camelcase property name
     * @returns {string} the non-camelcase property name
     */
    function replaceUppercase(a: string): string;
    import trueColor from "kute.js/src/util/trueColor";
    import trueDimension from "kute.js/src/util/trueDimension";
    import { onStartAttr } from "kute.js/src/components/htmlAttributesBase";
}
declare module "kute.js/src/components/opacityPropertyBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartOpacity(tweenProp: string): void;
    export default OpacityPropertyBase;
    namespace OpacityPropertyBase {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartOpacity as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
}
declare module "kute.js/src/components/opacityProperty" {
    export default OpacityProperty;
    namespace OpacityProperty {
        export const component: string;
        export const property: string;
        export const defaultValue: number;
        export namespace Interpolate {
            export { numbers };
        }
        export { opacityFunctions as functions };
    }
    import numbers from "kute.js/src/interpolation/numbers";
    namespace opacityFunctions {
        export { getOpacity as prepareStart };
        export { prepareOpacity as prepareProperty };
        export { onStartOpacity as onStart };
    }
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @returns {string} computed style for property
     */
    function getOpacity(tweenProp: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {number} the property tween object
     */
    function prepareOpacity(_: string, value: string): number;
    import { onStartOpacity } from "kute.js/src/components/opacityPropertyBase";
}
declare module "kute.js/src/components/scrollPropertyBase" {
    /**
     * Prevent further scroll events until scroll animation is over.
     * @param {Event} e event object
     */
    export function preventScroll(e: Event): void;
    /**
     * Returns the scroll element / target.
     * @returns {{el: Element, st: Element}}
     */
    export function getScrollTargets(): {
        el: Element;
        st: Element;
    };
    /**
     * Toggles scroll prevention callback on scroll events.
     * @param {string} action addEventListener / removeEventListener
     * @param {Element} element target
     */
    export function toggleScrollEvents(action: string, element: Element): void;
    /**
     * Action performed before scroll animation start.
     */
    export function scrollIn(): void;
    /**
     * Action performed when scroll animation ends.
     */
    export function scrollOut(): void;
    /**
     * * Sets the scroll target.
     * * Adds the scroll prevention event listener.
     * * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartScroll(tweenProp: string): void;
    export class onStartScroll {
        /**
         * * Sets the scroll target.
         * * Adds the scroll prevention event listener.
         * * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        constructor(tweenProp: string);
        element: HTMLElement | undefined;
    }
    /**
     * Removes the scroll prevention event listener.
     */
    export function onCompleteScroll(): void;
    export const scrollContainer: HTMLElement;
    export default ScrollPropertyBase;
    namespace ScrollPropertyBase {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartScroll as onStart };
            export { onCompleteScroll as onComplete };
        }
        namespace Util {
            export { preventScroll };
            export { scrollIn };
            export { scrollOut };
            export { getScrollTargets };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
}
declare module "kute.js/src/components/scrollProperty" {
    export default ScrollProperty;
    namespace ScrollProperty {
        export const component: string;
        export const property: string;
        export const defaultValue: number;
        export namespace Interpolate {
            export { numbers };
        }
        export { scrollFunctions as functions };
        export namespace Util {
            export { preventScroll };
            export { scrollIn };
            export { scrollOut };
            export { getScrollTargets };
            export { toggleScrollEvents };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    namespace scrollFunctions {
        export { getScroll as prepareStart };
        export { prepareScroll as prepareProperty };
        export { onStartScroll as onStart };
        export { onCompleteScroll as onComplete };
    }
    import { preventScroll } from "kute.js/src/components/scrollPropertyBase";
    import { scrollIn } from "kute.js/src/components/scrollPropertyBase";
    import { scrollOut } from "kute.js/src/components/scrollPropertyBase";
    import { getScrollTargets } from "kute.js/src/components/scrollPropertyBase";
    import { toggleScrollEvents } from "kute.js/src/components/scrollPropertyBase";
    /**
     * Returns the current property computed style.
     * @returns {number} computed style for property
     */
    function getScroll(): number;
    class getScroll {
        element: HTMLElement | undefined;
    }
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {number} the property tween object
     */
    function prepareScroll(_: string, value: string): number;
    import { onStartScroll } from "kute.js/src/components/scrollPropertyBase";
    import { onCompleteScroll } from "kute.js/src/components/scrollPropertyBase";
}
declare module "kute.js/src/components/shadowPropertiesBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartShadow(tweenProp: string): void;
    export default ShadowPropertiesBase;
    namespace ShadowPropertiesBase {
        const component: string;
        namespace Interpolate {
            export { numbers };
            export { colors };
        }
        namespace functions {
            export { shadowPropOnStart as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
    const shadowPropOnStart: {};
}
declare module "kute.js/src/components/shadowProperties" {
    /**
     * Returns the current property computed style.
     * @param {string} tweenProp the property name
     * @returns {string} computed style for property
     */
    export function getShadow(tweenProp: string): string;
    /**
     * Returns the property tween object.
     * @param {string} tweenProp the property name
     * @param {string} propValue the property value
     * @returns {KUTE.shadowObject} the property tween object
     */
    export function prepareShadow(tweenProp: string, propValue: string): KUTE.shadowObject;
    export default ShadowProperties;
    namespace ShadowProperties {
        export const component: string;
        export { shadowProps as properties };
        export namespace defaultValues {
            const boxShadow: string;
            const textShadow: string;
        }
        export namespace Interpolate {
            export { numbers };
            export { colors };
        }
        export { shadowFunctions as functions };
        export namespace Util {
            export { processShadowArray };
            export { trueColor };
        }
    }
    const shadowProps: string[];
    import numbers from "kute.js/src/interpolation/numbers";
    import colors from "kute.js/src/interpolation/colors";
    namespace shadowFunctions {
        export { getShadow as prepareStart };
        export { prepareShadow as prepareProperty };
        export { shadowPropOnStart as onStart };
    }
    /**
     * Return the box-shadow / text-shadow tween object.
     * * box-shadow: none | h-shadow v-shadow blur spread color inset|initial|inherit
     * * text-shadow: none | offset-x offset-y blur-radius color |initial|inherit
     * * numbers must be floats and color must be rgb object
     *
     * @param {(number | string)[]} shadow an `Array` with shadow parameters
     * @param {string} tweenProp the property name
     * @returns {KUTE.shadowObject} the property tween object
     */
    function processShadowArray(shadow: (number | string)[], tweenProp: string): KUTE.shadowObject;
    import trueColor from "kute.js/src/util/trueColor";
    const shadowPropOnStart: {};
}
declare module "kute.js/src/components/svgCubicMorphBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the `path` property
     */
    export function onStartCubicMorph(tweenProp: string): void;
    export default baseSvgCubicMorph;
    namespace baseSvgCubicMorph {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
            export { pathToString };
        }
        namespace functions {
            export { onStartCubicMorph as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    import pathToString from "svg-path-commander/src/convert/pathToString";
}
declare module "kute.js/src/util/selector" {
    /**
     * selector
     *
     * A selector utility for KUTE.js.
     *
     * @param {KUTE.selectorType} el target(s) or string selector
     * @param {boolean | number} multi when true returns an array/collection of elements
     * @returns {Element | Element[] | null}
     */
    export default function selector(el: KUTE.selectorType, multi: boolean | number): Element | Element[] | null;
}
declare module "kute.js/src/components/svgCubicMorph" {
    export default svgCubicMorph;
    namespace svgCubicMorph {
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
            export { segmentCubicFactory };
            export { splitCubic };
            export { splitPath };
            export { fixPath };
            export { getCurveArray };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
    import pathToString from "svg-path-commander/src/convert/pathToString";
    namespace svgCubicMorphFunctions {
        export { getCubicMorph as prepareStart };
        export { prepareCubicMorph as prepareProperty };
        export { onStartCubicMorph as onStart };
        export { crossCheckCubicMorph as crossCheck };
    }
    import pathToCurve from "svg-path-commander/src/convert/pathToCurve";
    import pathToAbsolute from "svg-path-commander/src/convert/pathToAbsolute";
    import parsePathString from "svg-path-commander/src/parser/parsePathString";
    /**
     * Returns the `curveArray` rotation for the best morphing animation.
     * @param {SVGPathCommander.curveArray} a the target `curveArray`
     * @param {SVGPathCommander.curveArray} b the reference `curveArray`
     * @returns {SVGPathCommander.curveArray} the best `a` rotation
     */
    function getRotatedCurve(a: import("svg-path-commander").curveArray, b: import("svg-path-commander").curveArray): import("svg-path-commander").curveArray;
    /**
     * Returns all possible path rotations for `curveArray`.
     * @param {SVGPathCommander.curveArray} a the source `curveArray`
     * @returns {SVGPathCommander.curveArray[]} all rotations for source
     */
    function getRotations(a: import("svg-path-commander").curveArray): import("svg-path-commander").curveArray[];
    /**
     * Returns two `curveArray` with same amount of segments.
     * @param {SVGPathCommander.curveArray} path1 the first `curveArray`
     * @param {SVGPathCommander.curveArray} path2 the second `curveArray`
     * @param {number} TL the maximum `curveArray` length
     * @returns {SVGPathCommander.curveArray[]} equalized segments
     */
    function equalizeSegments(path1: import("svg-path-commander").curveArray, path2: import("svg-path-commander").curveArray, TL: number): import("svg-path-commander").curveArray[];
    import reverseCurve from "svg-path-commander/src/process/reverseCurve";
    import clonePath from "svg-path-commander/src/process/clonePath";
    import getDrawDirection from "svg-path-commander/src/util/getDrawDirection";
    import segmentCubicFactory from "svg-path-commander/src/util/segmentCubicFactory";
    import splitCubic from "svg-path-commander/src/process/splitCubic";
    import splitPath from "svg-path-commander/src/process/splitPath";
    import fixPath from "svg-path-commander/src/process/fixPath";
    /**
     * Returns first `pathArray` from multi-paths path.
     * @param {SVGPathCommander.pathArray | string} source the source `pathArray` or string
     * @returns {KUTE.curveSpecs[]} an `Array` with a custom tuple for `equalizeSegments`
     */
    function getCurveArray(source: import("svg-path-commander").pathArray | string): KUTE.curveSpecs[];
    /**
     * Returns the current `d` attribute value.
     * @returns {string}
     */
    function getCubicMorph(): string;
    /**
     * Returns the property tween object.
     * @see KUTE.curveObject
     *
     * @param {string} _ is the `path` property name, not needed
     * @param {string | KUTE.curveObject} value the `path` property value
     * @returns {KUTE.curveObject}
     */
    function prepareCubicMorph(_: string, value: string | KUTE.curveObject): KUTE.curveObject;
    import { onStartCubicMorph } from "kute.js/src/components/svgCubicMorphBase";
    /**
     * Enables the `to()` method by preparing the tween object in advance.
     * @param {string} tweenProp is `path` tween property, but it's not needed
     */
    function crossCheckCubicMorph(tweenProp: string): void;
}
declare module "kute.js/src/components/svgDrawBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartDraw(tweenProp: string): void;
    export default SvgDrawBase;
    namespace SvgDrawBase {
        const component: string;
        const property: string;
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { onStartDraw as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
}
declare module "kute.js/src/components/svgDraw" {
    export default SvgDrawProperty;
    namespace SvgDrawProperty {
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
    import numbers from "kute.js/src/interpolation/numbers";
    namespace svgDrawFunctions {
        export { getDrawValue as prepareStart };
        export { prepareDraw as prepareProperty };
        export { onStartDraw as onStart };
    }
    /**
     * Returns the `<rect>` length.
     * It doesn't compute `rx` and / or `ry` of the element.
     * @see http://stackoverflow.com/a/30376660
     * @param {SVGRectElement} el target element
     * @returns {number} the `<rect>` length
     */
    function getRectLength(el: SVGRectElement): number;
    /**
     * Returns the `<polyline>` / `<polygon>` length.
     * @param {SVGPolylineElement | SVGPolygonElement} el target element
     * @returns {number} the element length
     */
    function getPolyLength(el: SVGPolylineElement | SVGPolygonElement): number;
    /**
     * Returns the `<line>` length.
     * @param {SVGLineElement} el target element
     * @returns {number} the element length
     */
    function getLineLength(el: SVGLineElement): number;
    /**
     * Returns the `<circle>` length.
     * @param {SVGCircleElement} el target element
     * @returns {number} the element length
     */
    function getCircleLength(el: SVGCircleElement): number;
    /**
     * Returns the `<ellipse>` length.
     * @param {SVGEllipseElement} el target element
     * @returns {number} the element length
     */
    function getEllipseLength(el: SVGEllipseElement): number;
    /**
     * Returns the shape length.
     * @param {SVGPathCommander.shapeTypes} el target element
     * @returns {number} the element length
     */
    function getTotalLength(el: SVGPathCommander.shapeTypes): number;
    /**
     * Reset CSS properties associated with the `draw` property.
     * @param {SVGPathCommander.shapeTypes} element target
     */
    function resetDraw(elem: any): void;
    /**
     * Returns the property tween object.
     * @param {SVGPathCommander.shapeTypes} element the target element
     * @param {string | KUTE.drawObject} value the property value
     * @returns {KUTE.drawObject} the property tween object
     */
    function getDraw(element: SVGPathCommander.shapeTypes, value: string | KUTE.drawObject): KUTE.drawObject;
    /**
     * Convert a `<path>` length percent value to absolute.
     * @param {string} v raw value
     * @param {number} l length value
     * @returns {number} the absolute value
     */
    function percent(v: string, l: number): number;
    /**
     * Returns the property tween object.
     * @returns {KUTE.drawObject} the property tween object
     */
    function getDrawValue(): KUTE.drawObject;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string | KUTE.drawObject} value the property value
     * @returns {KUTE.drawObject} the property tween object
     */
    function prepareDraw(_: string, value: string | KUTE.drawObject): KUTE.drawObject;
    import { onStartDraw } from "kute.js/src/components/svgDrawBase";
}
declare module "kute.js/src/interpolation/coords" {
    /**
     * Coordinates Interpolation Function.
     *
     * @param {number[][]} a start coordinates
     * @param {number[][]} b end coordinates
     * @param {string} l amount of coordinates
     * @param {number} v progress
     * @returns {number[][]} the interpolated coordinates
     */
    export default function coords(a: number[][], b: number[][], l: string, v: number): number[][];
}
declare module "kute.js/src/components/svgMorphBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartSVGMorph(tweenProp: string): void;
    export default SVGMorphBase;
    namespace SVGMorphBase {
        export const component: string;
        export const property: string;
        export { coords as Interpolate };
        export namespace functions {
            export { onStartSVGMorph as onStart };
        }
    }
    import coords from "kute.js/src/interpolation/coords";
}
declare module "kute.js/src/components/svgMorph" {
    export default SVGMorph;
    namespace SVGMorph {
        export const component: string;
        export const property: string;
        export const defaultValue: never[];
        export { coords as Interpolate };
        export namespace defaultOptions {
            const morphPrecision: number;
        }
        export { svgMorphFunctions as functions };
        export namespace Util {
            export { addPoints };
            export { bisect };
            export { getPolygon };
            export { validPolygon };
            export { getInterpolationPoints };
            export { pathStringToPolygon };
            export { distanceSquareRoot };
            export { midPoint };
            export { approximatePolygon };
            export { rotatePolygon };
            export { pathToString };
            export { pathToCurve };
            export { getTotalLength };
            export { getPointAtLength };
            export { polygonArea };
            export { roundPath };
        }
    }
    import coords from "kute.js/src/interpolation/coords";
    namespace svgMorphFunctions {
        export { getSVGMorph as prepareStart };
        export { prepareSVGMorph as prepareProperty };
        export { onStartSVGMorph as onStart };
        export { crossCheckSVGMorph as crossCheck };
    }
    /**
     * Sample additional points for a polygon to better match its pair.
     * @param {KUTE.polygonObject} polygon the target polygon
     * @param {number} numPoints the amount of points needed
     */
    function addPoints(polygon: KUTE.polygonObject, numPoints: number): void;
    /**
     * Split segments of a polygon until it reaches a certain
     * amount of points.
     * @param {number[][]} polygon the target polygon
     * @param {number} maxSegmentLength the maximum amount of points
     */
    function bisect(polygon: number[][], maxSegmentLength?: number): void;
    /**
     * Returns a new polygon and its length from string or another `Array`.
     * @param {KUTE.polygonMorph | string} input the target polygon
     * @param {number} maxSegmentLength the maximum amount of points
     * @returns {KUTE.polygonMorph} normalized polygon
     */
    function getPolygon(input: import("kute.js/types").polygonMorph | string, maxSegmentLength: number): import("kute.js/types").polygonMorph;
    /**
     * Checks the validity of a polygon.
     * @param {KUTE.polygonMorph} polygon the target polygon
     * @returns {boolean} the result of the check
     */
    function validPolygon(polygon: import("kute.js/types").polygonMorph): boolean;
    /**
     * Returns two new polygons ready to tween.
     * @param {string} path1 the first path string
     * @param {string} path2 the second path string
     * @param {number} precision the morphPrecision option value
     * @returns {KUTE.polygonMorph[]} the two polygons
     */
    function getInterpolationPoints(path1: string, path2: string, precision: number): import("kute.js/types").polygonMorph[];
    /**
     * Parses a path string and returns a polygon array.
     * @param {string} str path string
     * @param {number} maxLength maximum amount of points
     * @returns {KUTE.exactPolygon} the polygon array we need
     */
    function pathStringToPolygon(str: string, maxLength: number): KUTE.exactPolygon;
    import distanceSquareRoot from "svg-path-commander/src/math/distanceSquareRoot";
    import midPoint from "svg-path-commander/src/math/midPoint";
    /**
     * Returns a new polygon polygon.
     * @param {SVGPathCommander.pathArray} parsed target `pathArray`
     * @param {number} maxLength the maximum segment length
     * @returns {KUTE.exactPolygon} the resulted polygon
     */
    function approximatePolygon(parsed: import("svg-path-commander").pathArray, maxLength: number): KUTE.exactPolygon;
    /**
     * Rotates a polygon to better match its pair.
     * @param {KUTE.polygonMorph} polygon the target polygon
     * @param {KUTE.polygonMorph} vs the reference polygon
     */
    function rotatePolygon(polygon: import("kute.js/types").polygonMorph, vs: import("kute.js/types").polygonMorph): void;
    import pathToString from "svg-path-commander/src/convert/pathToString";
    import pathToCurve from "svg-path-commander/src/convert/pathToCurve";
    import getTotalLength from "svg-path-commander/src/util/getTotalLength";
    import getPointAtLength from "svg-path-commander/src/util/getPointAtLength";
    import polygonArea from "svg-path-commander/src/math/polygonArea";
    import roundPath from "svg-path-commander/src/process/roundPath";
    /**
     * Returns the current `d` attribute value.
     * @returns {string} the `d` attribute value
     */
    function getSVGMorph(): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string | KUTE.polygonObject} value the property value
     * @returns {KUTE.polygonObject} the property tween object
     */
    function prepareSVGMorph(_: string, value: string | KUTE.polygonObject): KUTE.polygonObject;
    import { onStartSVGMorph } from "kute.js/src/components/svgMorphBase";
    /**
     * Enables the `to()` method by preparing the tween object in advance.
     * @param {string} prop the `path` property name
     */
    function crossCheckSVGMorph(prop: string): void;
    /**
     * Returns an existing polygon or false if it's not a polygon.
     * @param {SVGPathCommander.pathArray} pathArray target `pathArray`
     * @returns {KUTE.exactPolygon | false} the resulted polygon
     */
    function exactPolygon(pathArray: import("svg-path-commander").pathArray): KUTE.exactPolygon | false;
}
declare module "kute.js/src/components/svgTransformBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function svgTransformOnStart(tweenProp: string): void;
    export default baseSVGTransform;
    namespace baseSVGTransform {
        const component: string;
        const property: string;
        namespace defaultOptions {
            const transformOrigin: string;
        }
        namespace Interpolate {
            export { numbers };
        }
        namespace functions {
            export { svgTransformOnStart as onStart };
        }
    }
    import numbers from "kute.js/src/interpolation/numbers";
}
declare module "kute.js/src/components/svgTransform" {
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
    /**
     * Returns an object with the current transform attribute value.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {string} current transform object
     */
    function getStartSvgTransform(_: string, value: string): string;
    /**
     * Returns the property tween object.
     * @param {string} prop the property name
     * @param {string} value the property value
     * @returns {KUTE.transformSVGObject} the property tween object
     */
    function prepareSvgTransform(prop: string, value: string): KUTE.transformSVGObject;
    import { svgTransformOnStart } from "kute.js/src/components/svgTransformBase";
    function svgTransformCrossCheck(prop: any): void;
    import numbers from "kute.js/src/interpolation/numbers";
    /**
     * Returns a correct transform origin consistent with the shape bounding box.
     * @param {string} origin transform origin string
     * @param {SVGPathCommander.pathBBox} bbox path bounding box
     * @returns {number}
     */
    function parseStringOrigin(origin: string, bbox: SVGPathCommander.pathBBox): number;
    /**
     * Parse SVG transform string and return an object.
     * @param {string} a transform string
     * @returns {Object<string, (string | number)>}
     */
    function parseTransformString(a: string): {
        [x: string]: (string | number);
    };
    /**
     * Returns the SVG transform tween object.
     * @param {string} _ property name
     * @param {Object<string, (string | number)>} v property value object
     * @returns {KUTE.transformSVGObject} the SVG transform tween object
     */
    function parseTransformSVG(_: string, v: {
        [x: string]: (string | number);
    }): KUTE.transformSVGObject;
}
declare module "kute.js/src/components/textPropertiesBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function textPropOnStart(tweenProp: string): void;
    export default TextPropertiesBase;
    namespace TextPropertiesBase {
        const component: string;
        const category: string;
        namespace Interpolate {
            export { units };
        }
        namespace functions {
            export { textOnStart as onStart };
        }
    }
    import units from "kute.js/src/interpolation/units";
    const textOnStart: {};
}
declare module "kute.js/src/components/textProperties" {
    /**
     * Returns the current property computed style.
     * @param {string} prop the property name
     * @returns {string} computed style for property
     */
    export function getTextProp(prop: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {number} the property tween object
     */
    export function prepareTextProp(_: string, value: string): number;
    export default TextProperties;
    namespace TextProperties {
        export const component: string;
        export const category: string;
        export { textProps as properties };
        export namespace defaultValues {
            const fontSize: number;
            const lineHeight: number;
            const letterSpacing: number;
            const wordSpacing: number;
        }
        export namespace Interpolate {
            export { units };
        }
        export { textPropFunctions as functions };
        export namespace Util {
            export { trueDimension };
        }
    }
    const textProps: string[];
    import units from "kute.js/src/interpolation/units";
    namespace textPropFunctions {
        export { getTextProp as prepareStart };
        export { prepareTextProp as prepareProperty };
        export { textOnStart as onStart };
    }
    import trueDimension from "kute.js/src/util/trueDimension";
    const textOnStart: {};
}
declare module "kute.js/src/objects/connect" {
    export default connect;
    namespace connect {
        const tween: KUTE.TweenBase | KUTE.Tween | KUTE.TweenExtra;
        const processEasing: any;
    }
}
declare module "kute.js/src/components/textWriteBase" {
    export namespace onStartWrite {
        /**
         * onStartWrite.text
         *
         * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        function text(tweenProp: string): void;
        /**
         * onStartWrite.text
         *
         * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        function text(tweenProp: string): void;
        /**
         * onStartWrite.number
         *
         * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        function number(tweenProp: string): void;
        /**
         * onStartWrite.number
         *
         * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        function number(tweenProp: string): void;
    }
    export namespace TextWriteBase {
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
    export default TextWriteBase;
    export namespace charSet {
        export { lowerCaseAlpha as alpha };
        export { upperCaseAlpha as upper };
        export { nonAlpha as symbols };
        export { numeric };
        export { alphaNumeric as alphanumeric };
        export { allTypes as all };
    }
    import numbers from "kute.js/src/interpolation/numbers";
    const lowerCaseAlpha: string[];
    const upperCaseAlpha: string[];
    const nonAlpha: string[];
    const numeric: string[];
    const alphaNumeric: string[];
    const allTypes: string[];
}
declare module "kute.js/src/components/textWrite" {
    export function createTextTweens(target: any, newText: any, ops: any): false | any[];
    export namespace textWriteFunctions {
        export { getWrite as prepareStart };
        export { prepareText as prepareProperty };
        export { onStartWrite as onStart };
    }
    export namespace TextWrite {
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
    export default TextWrite;
    /**
     * Returns the current element `innerHTML`.
     * @returns {string} computed style for property
     */
    function getWrite(): string;
    /**
     * Returns the property tween object.
     * @param {string} tweenProp the property name
     * @param {string} value the property value
     * @returns {number | string} the property tween object
     */
    function prepareText(tweenProp: string, value: string): number | string;
    import { onStartWrite } from "kute.js/src/components/textWriteBase";
    import numbers from "kute.js/src/interpolation/numbers";
    import { charSet } from "kute.js/src/components/textWriteBase";
}
declare module "kute.js/src/interpolation/perspective" {
    /**
     * Perspective Interpolation Function.
     *
     * @param {number} a start value
     * @param {number} b end value
     * @param {string} u unit
     * @param {number} v progress
     * @returns {string} the perspective function in string format
     */
    export default function perspective(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/interpolation/translate3d" {
    /**
     * Translate 3D Interpolation Function.
     *
     * @param {number[]} a start [x,y,z] position
     * @param {number[]} b end [x,y,z] position
     * @param {string} u unit, usually `px` degrees
     * @param {number} v progress
     * @returns {string} the interpolated 3D translation string
     */
    export default function translate3d(a: number[], b: number[], u: string, v: number): string;
}
declare module "kute.js/src/interpolation/rotate3d" {
    /**
     * 3D Rotation Interpolation Function.
     *
     * @param {number} a start [x,y,z] angles
     * @param {number} b end [x,y,z] angles
     * @param {string} u unit, usually `deg` degrees
     * @param {number} v progress
     * @returns {string} the interpolated 3D rotation string
     */
    export default function rotate3d(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/interpolation/translate" {
    /**
     * Translate 2D Interpolation Function.
     *
     * @param {number[]} a start [x,y] position
     * @param {number[]} b end [x,y] position
     * @param {string} u unit, usually `px` degrees
     * @param {number} v progress
     * @returns {string} the interpolated 2D translation string
     */
    export default function translate(a: number[], b: number[], u: string, v: number): string;
}
declare module "kute.js/src/interpolation/rotate" {
    /**
     * 2D Rotation Interpolation Function.
     *
     * @param {number} a start angle
     * @param {number} b end angle
     * @param {string} u unit, usually `deg` degrees
     * @param {number} v progress
     * @returns {string} the interpolated rotation
     */
    export default function rotate(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/interpolation/scale" {
    /**
     * Scale Interpolation Function.
     *
     * @param {number} a start scale
     * @param {number} b end scale
     * @param {number} v progress
     * @returns {string} the interpolated scale
     */
    export default function scale(a: number, b: number, v: number): string;
}
declare module "kute.js/src/interpolation/skew" {
    /**
     * Skew Interpolation Function.
     *
     * @param {number} a start {x,y} angles
     * @param {number} b end {x,y} angles
     * @param {string} u unit, usually `deg` degrees
     * @param {number} v progress
     * @returns {string} the interpolated string value of skew(s)
     */
    export default function skew(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/components/transformFunctionsBase" {
    /**
     * Sets the property update function.
     * * same to svgTransform, htmlAttributes
     * @param {string} tweenProp the property name
     */
    export function onStartTransform(tweenProp: string): void;
    export default TransformFunctionsBase;
    namespace TransformFunctionsBase {
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
    import perspective from "kute.js/src/interpolation/perspective";
    import translate3d from "kute.js/src/interpolation/translate3d";
    import rotate3d from "kute.js/src/interpolation/rotate3d";
    import translate from "kute.js/src/interpolation/translate";
    import rotate from "kute.js/src/interpolation/rotate";
    import scale from "kute.js/src/interpolation/scale";
    import skew from "kute.js/src/interpolation/skew";
}
declare module "kute.js/src/components/transformFunctions" {
    export default TransformFunctions;
    namespace TransformFunctions {
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
    import perspective from "kute.js/src/interpolation/perspective";
    import translate3d from "kute.js/src/interpolation/translate3d";
    import rotate3d from "kute.js/src/interpolation/rotate3d";
    import translate from "kute.js/src/interpolation/translate";
    import rotate from "kute.js/src/interpolation/rotate";
    import scale from "kute.js/src/interpolation/scale";
    import skew from "kute.js/src/interpolation/skew";
    /**
     * Returns the current property inline style.
     * @param {string} tweenProp the property name
     * @returns {string} inline style for property
     */
    function getTransform(tweenProp: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {Object<string, string | number | (string | number)[]>} obj the property value
     * @returns {KUTE.transformFObject} the property tween object
     */
    function prepareTransform(_: string, obj: {
        [x: string]: string | number | (string | number)[];
    }): KUTE.transformFObject;
    import { onStartTransform } from "kute.js/src/components/transformFunctionsBase";
    /**
     * Prepare tween object in advance for `to()` method.
     * @param {string} tweenProp the property name
     */
    function crossCheckTransform(tweenProp: string): void;
}
declare module "kute.js/src/util/transformProperty" {
    export default transformProperty;
    /** the `transform` string for legacy browsers */
    const transformProperty: string;
}
declare module "kute.js/src/process/getInlineStyleLegacy" {
    /**
     * getInlineStyle
     *
     * Returns the transform style for element from cssText.
     * Used by for the `.to()` static method on legacy browsers.
     *
     * @param {Element} el target element
     * @returns {object} a transform object
     */
    export default function getInlineStyleLegacy(el: Element): object;
}
declare module "kute.js/src/util/supportLegacyTransform" {
    export default supportTransform;
    /** check if transform is supported via prefixed property */
    const supportTransform: boolean;
}
declare module "kute.js/src/components/transformLegacyBase" {
    /**
     * Sets the property update function.
     * @param {string} tweenProp the property name
     */
    export function onStartLegacyTransform(tweenProp: string): void;
    export default BaseLegacyTransform;
    namespace BaseLegacyTransform {
        const component: string;
        const property: string;
        namespace functions {
            export { onStartLegacyTransform as onStart };
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
        namespace Util {
            export { transformProperty };
        }
    }
    import perspective from "kute.js/src/interpolation/perspective";
    import translate3d from "kute.js/src/interpolation/translate3d";
    import rotate3d from "kute.js/src/interpolation/rotate3d";
    import translate from "kute.js/src/interpolation/translate";
    import rotate from "kute.js/src/interpolation/rotate";
    import scale from "kute.js/src/interpolation/scale";
    import skew from "kute.js/src/interpolation/skew";
    import transformProperty from "kute.js/src/util/transformProperty";
}
declare module "kute.js/src/components/transformLegacy" {
    export default transformLegacyComponent;
    namespace transformLegacyComponent {
        export const component: string;
        export const property: string;
        export { legacyTransformProperties as subProperties };
        export { legacyTransformValues as defaultValues };
        export { transformLegacyFunctions as functions };
        export namespace Interpolate {
            export { perspective };
            export { translate3d };
            export { rotate3d };
            export { translate };
            export { rotate };
            export { scale };
            export { skew };
        }
        export const Util: string[];
    }
    const legacyTransformProperties: string[];
    namespace legacyTransformValues {
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
    namespace transformLegacyFunctions {
        export { getLegacyTransform as prepareStart };
        export { prepareLegacyTransform as prepareProperty };
        export { onStartLegacyTransform as onStart };
        export { crossCheckLegacyTransform as crossCheck };
    }
    import perspective from "kute.js/src/interpolation/perspective";
    import translate3d from "kute.js/src/interpolation/translate3d";
    import rotate3d from "kute.js/src/interpolation/rotate3d";
    import translate from "kute.js/src/interpolation/translate";
    import rotate from "kute.js/src/interpolation/rotate";
    import scale from "kute.js/src/interpolation/scale";
    import skew from "kute.js/src/interpolation/skew";
    /**
     * Returns the current property inline style.
     * @param {string} tweenProperty the property name
     * @returns {string} inline style for property
     */
    function getLegacyTransform(tweenProperty: string): string;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {Object<string, string | number | (string | number)[]>} obj the property value
     * @returns {KUTE.transformFObject} the property tween object
     */
    function prepareLegacyTransform(_: string, obj: {
        [x: string]: string | number | (string | number)[];
    }): KUTE.transformFObject;
    import { onStartLegacyTransform } from "kute.js/src/components/transformLegacyBase";
    /**
     * Prepare tween object in advance for `to()` method.
     * @param {string} tweenProp the property name
     */
    function crossCheckLegacyTransform(tweenProp: string): void;
}
declare module "kute.js/src/interpolation/arrays" {
    /**
     * Array Interpolation Function.
     *
     * @param {number[]} a start array
     * @param {number[]} b end array
     * @param {number} v progress
     * @returns {number[]} the resulting array
     */
    export default function arrays(a: number[], b: number[], v: number): number[];
}
declare module "kute.js/src/components/transformMatrixBase" {
    export namespace onStartTransform {
        /**
         * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        function transform(tweenProp: string): void;
        /**
         * Sets the property update function.
         * @param {string} tweenProp the property name
         */
        function transform(tweenProp: string): void;
        /**
         * onStartTransform.CSS3Matrix
         *
         * Sets the update function for the property.
         * @param {string} prop the property name
         */
        function CSS3Matrix(prop: string): void;
        /**
         * onStartTransform.CSS3Matrix
         *
         * Sets the update function for the property.
         * @param {string} prop the property name
         */
        function CSS3Matrix(prop: string): void;
    }
    export namespace TransformMatrixBase {
        export { matrixComponent as component };
        export const property: string;
        export namespace functions {
            export { onStartTransform as onStart };
        }
        export namespace Interpolate {
            export { numbers as perspective };
            export { arrays as translate3d };
            export { arrays as rotate3d };
            export { arrays as skew };
            export { arrays as scale3d };
        }
    }
    export default TransformMatrixBase;
    const matrixComponent: "transformMatrixBase";
    import numbers from "kute.js/src/interpolation/numbers";
    import arrays from "kute.js/src/interpolation/arrays";
}
declare module "kute.js/src/components/transformMatrix" {
    export default matrixTransform;
    namespace matrixTransform {
        export { matrixComponent as component };
        export const property: string;
        export namespace defaultValue {
            const perspective: number;
            const translate3d: number[];
            const translateX: number;
            const translateY: number;
            const translateZ: number;
            const rotate3d: number[];
            const rotateX: number;
            const rotateY: number;
            const rotateZ: number;
            const skew: number[];
            const skewX: number;
            const skewY: number;
            const scale3d: number[];
            const scaleX: number;
            const scaleY: number;
            const scaleZ: number;
        }
        export { matrixFunctions as functions };
        export namespace Interpolate {
            export { numbers as perspective };
            export { arrays as translate3d };
            export { arrays as rotate3d };
            export { arrays as skew };
            export { arrays as scale3d };
        }
    }
    const matrixComponent: "transformMatrix";
    namespace matrixFunctions {
        export { getTransform as prepareStart };
        export { prepareTransform as prepareProperty };
        export { onStartTransform as onStart };
        export { onCompleteTransform as onComplete };
        export { crossCheckTransform as crossCheck };
    }
    import numbers from "kute.js/src/interpolation/numbers";
    import arrays from "kute.js/src/interpolation/arrays";
    /**
     * Returns the current transform object.
     * @param {string} _ the property name
     * @param {string} value the property value
     * @returns {KUTE.transformMObject} transform object
     */
    function getTransform(_: string, value: string): KUTE.transformMObject;
    /**
     * Returns the property tween object.
     * @param {string} _ the property name
     * @param {Object<string, string | number | (string | number)[]>} obj the property value
     * @returns {KUTE.transformMObject} the property tween object
     */
    function prepareTransform(_: string, value: any): KUTE.transformMObject;
    import { onStartTransform } from "kute.js/src/components/transformMatrixBase";
    /**
     * Sets the end values for the next `to()` method call.
     * @param {string} tweenProp the property name
     */
    function onCompleteTransform(tweenProp: string): void;
    /**
     * Prepare tween object in advance for `to()` method.
     * @param {string} tweenProp the property name
     */
    function crossCheckTransform(tweenProp: string): void;
}
declare module "kute.js/src/objects/tweens" {
    export default Tweens;
    const Tweens: any[];
}
declare module "kute.js/src/core/add" {
    export default add;
    /**
     * KUTE.add(Tween)
     *
     * @param {KUTE.Tween} tw a new tween to add
     */
    function add(tw: KUTE.Tween): number;
}
declare module "kute.js/src/core/getAll" {
    export default getAll;
    /**
     * KUTE.add(Tween)
     *
     * @return {KUTE.Tween[]} tw a new tween to add
     */
    function getAll(): KUTE.Tween[];
}
declare module "kute.js/src/core/remove" {
    export default remove;
    /**
     * KUTE.remove(Tween)
     *
     * @param {KUTE.Tween} tw a new tween to add
     */
    function remove(tw: KUTE.Tween): void;
}
declare module "kute.js/src/core/removeAll" {
    export default removeAll;
    /**
     * KUTE.removeAll()
     */
    function removeAll(): void;
}
declare module "kute.js/src/objects/globalObject" {
    export default globalObject;
    const globalObject: {};
}
declare module "kute.js/src/util/now" {
    export default now;
    function now(): number;
}
declare module "kute.js/src/core/render" {
    export function stop(): void;
    export default Render;
    export let Tick: number;
    /**
     *
     * @param {number | Date} time
     */
    export function Ticker(time: number | Date): void;
    namespace Render {
        export { Tick };
        export { Ticker };
        export { Tweens };
        export { Time };
    }
    import Tweens from "kute.js/src/objects/tweens";
    namespace Time {
        export { now };
    }
    import now from "kute.js/src/util/now";
}
declare module "kute.js/src/core/linkInterpolation" {
    /**
     * linkInterpolation
     * @this {KUTE.Tween}
     */
    export default function linkInterpolation(): void;
}
declare module "kute.js/src/core/internals" {
    export default internals;
    namespace internals {
        export { add };
        export { remove };
        export { getAll };
        export { removeAll };
        export { stop };
        export { linkInterpolation };
    }
    import add from "kute.js/src/core/add";
    import remove from "kute.js/src/core/remove";
    import getAll from "kute.js/src/core/getAll";
    import removeAll from "kute.js/src/core/removeAll";
    import { stop } from "kute.js/src/core/render";
    import linkInterpolation from "kute.js/src/core/linkInterpolation";
}
declare module "kute.js/src/core/queueStart" {
    export default function queueStart(): void;
}
declare module "kute.js/src/easing/easing-base" {
    export default Easing;
    namespace Easing {
        const linear: KUTE.easingFunction;
        const easingQuadraticIn: KUTE.easingFunction;
        const easingQuadraticOut: KUTE.easingFunction;
        const easingQuadraticInOut: KUTE.easingFunction;
        const easingCubicIn: KUTE.easingFunction;
        const easingCubicOut: KUTE.easingFunction;
        const easingCubicInOut: KUTE.easingFunction;
        const easingCircularIn: KUTE.easingFunction;
        const easingCircularOut: KUTE.easingFunction;
        const easingCircularInOut: KUTE.easingFunction;
        const easingBackIn: KUTE.easingFunction;
        const easingBackOut: KUTE.easingFunction;
        const easingBackInOut: KUTE.easingFunction;
    }
}
declare module "kute.js/src/easing/easing-bezier" {
    export default Easing;
    namespace Easing {
        const linear: CubicBezier;
        const easingSinusoidalIn: CubicBezier;
        const easingSinusoidalOut: CubicBezier;
        const easingSinusoidalInOut: CubicBezier;
        const easingQuadraticIn: CubicBezier;
        const easingQuadraticOut: CubicBezier;
        const easingQuadraticInOut: CubicBezier;
        const easingCubicIn: CubicBezier;
        const easingCubicOut: CubicBezier;
        const easingCubicInOut: CubicBezier;
        const easingQuarticIn: CubicBezier;
        const easingQuarticOut: CubicBezier;
        const easingQuarticInOut: CubicBezier;
        const easingQuinticIn: CubicBezier;
        const easingQuinticOut: CubicBezier;
        const easingQuinticInOut: CubicBezier;
        const easingExponentialIn: CubicBezier;
        const easingExponentialOut: CubicBezier;
        const easingExponentialInOut: CubicBezier;
        const easingCircularIn: CubicBezier;
        const easingCircularOut: CubicBezier;
        const easingCircularInOut: CubicBezier;
        const easingBackIn: CubicBezier;
        const easingBackOut: CubicBezier;
        const easingBackInOut: CubicBezier;
    }
    import CubicBezier from "cubic-bezier-easing";
}
declare module "kute.js/src/easing/easing" {
    export default Easing;
    namespace Easing {
        const linear: KUTE.easingFunction;
        const easingSinusoidalIn: KUTE.easingFunction;
        const easingSinusoidalOut: KUTE.easingFunction;
        const easingSinusoidalInOut: KUTE.easingFunction;
        const easingQuadraticIn: KUTE.easingFunction;
        const easingQuadraticOut: KUTE.easingFunction;
        const easingQuadraticInOut: KUTE.easingFunction;
        const easingCubicIn: KUTE.easingFunction;
        const easingCubicOut: KUTE.easingFunction;
        const easingCubicInOut: KUTE.easingFunction;
        const easingQuarticIn: KUTE.easingFunction;
        const easingQuarticOut: KUTE.easingFunction;
        const easingQuarticInOut: KUTE.easingFunction;
        const easingQuinticIn: KUTE.easingFunction;
        const easingQuinticOut: KUTE.easingFunction;
        const easingQuinticInOut: KUTE.easingFunction;
        const easingCircularIn: KUTE.easingFunction;
        const easingCircularOut: KUTE.easingFunction;
        const easingCircularInOut: KUTE.easingFunction;
        const easingExponentialIn: KUTE.easingFunction;
        const easingExponentialOut: KUTE.easingFunction;
        const easingExponentialInOut: KUTE.easingFunction;
        const easingBackIn: KUTE.easingFunction;
        const easingBackOut: KUTE.easingFunction;
        const easingBackInOut: KUTE.easingFunction;
        const easingElasticIn: KUTE.easingFunction;
        const easingElasticOut: KUTE.easingFunction;
        const easingElasticInOut: KUTE.easingFunction;
        const easingBounceIn: KUTE.easingFunction;
        const easingBounceOut: KUTE.easingFunction;
        const easingBounceInOut: KUTE.easingFunction;
    }
}
declare module "kute.js/src/tween/tweenCollection" {
    /**
     * The static method creates a new `Tween` object for each `HTMLElement`
     * from and `Array`, `HTMLCollection` or `NodeList`.
     */
    export default class TweenCollection {
        /**
         *
         * @param {Element[] | HTMLCollection | NodeList} els target elements
         * @param {KUTE.tweenProps} vS the start values
         * @param {KUTE.tweenProps} vE the end values
         * @param {KUTE.tweenOptions} Options tween options
         * @returns {TweenCollection} the Tween object collection
         */
        constructor(els: Element[] | HTMLCollection | NodeList, vS: import("kute.js/types").tweenProps, vE: import("kute.js/types").tweenProps, Options: KUTE.tweenOptions);
        /** @type {KUTE.twCollection[]} */
        tweens: import("kute.js/types").twCollection[];
        /** @type {number?} */
        length: number | null;
        /**
         * Starts tweening, all targets
         * @param {number?} time the tween start time
         * @returns {TweenCollection} this instance
         */
        start(time: number | null): TweenCollection;
        /**
         * Stops tweening, all targets and their chains
         * @returns {TweenCollection} this instance
         */
        stop(): TweenCollection;
        /**
         * Pause tweening, all targets
         * @returns {TweenCollection} this instance
         */
        pause(): TweenCollection;
        /**
         * Resume tweening, all targets
         * @returns {TweenCollection} this instance
         */
        resume(): TweenCollection;
        /**
         * Schedule another tween or collection to start after
         * this one is complete.
         * @param {number?} args the tween start time
         * @returns {TweenCollection} this instance
         */
        chain(args: number | null): TweenCollection;
        /**
         * Check if any tween instance is playing
         * @param {number?} time the tween start time
         * @returns {TweenCollection} this instance
         */
        playing(): TweenCollection;
        /**
         * Remove all tweens in the collection
         */
        removeTweens(): void;
        /**
         * Returns the maximum animation duration
         * @returns {number} this instance
         */
        getMaxDuration(): number;
    }
}
declare module "kute.js/src/interface/allFromTo" {
    /**
     * The `KUTE.allFromTo()` static method creates a new Tween object
     * for multiple `HTMLElement`s, `HTMLCollection` or `NodeListat`
     * at a given state.
     *
     * @param {Element[] | HTMLCollection | NodeList} elements target elements
     * @param {KUTE.tweenProps} startObject
     * @param {KUTE.tweenProps} endObject
     * @param {KUTE.tweenOptions} optionsObj tween options
     * @returns {TweenCollection} the Tween object collection
     */
    export default function allFromTo(elements: Element[] | HTMLCollection | NodeList, startObject: import("kute.js/types").tweenProps, endObject: import("kute.js/types").tweenProps, optionsObj: KUTE.tweenOptions): TweenCollection;
    import TweenCollection from "kute.js/src/tween/tweenCollection";
}
declare module "kute.js/src/interface/allTo" {
    /**
     * The `KUTE.allTo()` static method creates a new Tween object
     * for multiple `HTMLElement`s, `HTMLCollection` or `NodeListat`
     * at their current state.
     *
     * @param {Element[] | HTMLCollection | NodeList} elements target elements
     * @param {KUTE.tweenProps} endObject
     * @param {KUTE.tweenProps} optionsObj progress
     * @returns {TweenCollection} the Tween object collection
     */
    export default function allTo(elements: Element[] | HTMLCollection | NodeList, endObject: import("kute.js/types").tweenProps, optionsObj: import("kute.js/types").tweenProps): TweenCollection;
    import TweenCollection from "kute.js/src/tween/tweenCollection";
}
declare module "kute.js/src/interface/fromTo" {
    /**
     * The `KUTE.fromTo()` static method returns a new Tween object
     * for a single `HTMLElement` at a given state.
     *
     * @param {Element} element target element
     * @param {KUTE.tweenProps} startObject
     * @param {KUTE.tweenProps} endObject
     * @param {KUTE.tweenOptions} optionsObj tween options
     * @returns {KUTE.Tween} the resulting Tween object
     */
    export default function fromTo(element: Element, startObject: import("kute.js/types").tweenProps, endObject: import("kute.js/types").tweenProps, optionsObj: KUTE.tweenOptions): KUTE.Tween;
}
declare module "kute.js/src/interface/to" {
    /**
     * The `KUTE.to()` static method returns a new Tween object
     * for a single `HTMLElement` at its current state.
     *
     * @param {Element} element target element
     * @param {KUTE.tweenProps} endObject
     * @param {KUTE.tweenOptions} optionsObj tween options
     * @returns {KUTE.Tween} the resulting Tween object
     */
    export default function to(element: Element, endObject: import("kute.js/types").tweenProps, optionsObj: KUTE.tweenOptions): KUTE.Tween;
}
declare module "kute.js/src/interpolation/skewX" {
    /**
     * SkewX Interpolation Function.
     *
     * @param {number} a start angle
     * @param {number} b end angle
     * @param {string} u unit, usually `deg` degrees
     * @param {number} v progress
     * @returns {string} the interpolated skewX
     */
    export default function skewX(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/interpolation/skewY" {
    /**
     * SkewY Interpolation Function.
     *
     * @param {number} a start angle
     * @param {number} b end angle
     * @param {string} u unit, usually `deg` degrees
     * @param {number} v progress
     * @returns {string} the interpolated skewY
     */
    export default function skewY(a: number, b: number, u: string, v: number): string;
}
declare module "kute.js/src/objects/componentsBase" {
    export default Components;
    namespace Components {
        const Transform: Animation;
        const BoxModel: Animation;
        const Opacity: Animation;
    }
    import Animation from "kute.js/src/animation/animationBase";
}
declare module "kute.js/src/objects/componentsDefault" {
    export default Components;
    namespace Components {
        export { EssentialBoxModel };
        export { ColorsProperties };
        export { HTMLAttributes };
        export { OpacityProperty };
        export { TextWriteProp };
        export { TransformFunctions };
        export { SVGDraw };
        export { SVGMorph };
    }
    import EssentialBoxModel from "kute.js/src/components/boxModelEssential";
    import ColorsProperties from "kute.js/src/components/colorProperties";
    import HTMLAttributes from "kute.js/src/components/htmlAttributes";
    import OpacityProperty from "kute.js/src/components/opacityProperty";
    import TextWriteProp from "kute.js/src/components/textWrite";
    import TransformFunctions from "kute.js/src/components/transformFunctions";
    import SVGDraw from "kute.js/src/components/svgDraw";
    import SVGMorph from "kute.js/src/components/svgMorph";
}
declare module "kute.js/src/objects/componentsExtra" {
    export default Components;
    namespace Components {
        export { BackgroundPosition };
        export { BorderRadius };
        export { BoxModel };
        export { ClipProperty };
        export { ColorProperties };
        export { FilterEffects };
        export { HTMLAttributes };
        export { OpacityProperty };
        export { SVGDraw };
        export { SVGCubicMorph };
        export { SVGTransform };
        export { ScrollProperty };
        export { ShadowProperties };
        export { TextProperties };
        export { TextWriteProperties };
        export { MatrixTransform };
    }
    import BackgroundPosition from "kute.js/src/components/backgroundPosition";
    import BorderRadius from "kute.js/src/components/borderRadius";
    import BoxModel from "kute.js/src/components/boxModel";
    import ClipProperty from "kute.js/src/components/clipProperty";
    import ColorProperties from "kute.js/src/components/colorProperties";
    import FilterEffects from "kute.js/src/components/filterEffects";
    import HTMLAttributes from "kute.js/src/components/htmlAttributes";
    import OpacityProperty from "kute.js/src/components/opacityProperty";
    import SVGDraw from "kute.js/src/components/svgDraw";
    import SVGCubicMorph from "kute.js/src/components/svgCubicMorph";
    import SVGTransform from "kute.js/src/components/svgTransform";
    import ScrollProperty from "kute.js/src/components/scrollProperty";
    import ShadowProperties from "kute.js/src/components/shadowProperties";
    import TextProperties from "kute.js/src/components/textProperties";
    import TextWriteProperties from "kute.js/src/components/textWrite";
    import MatrixTransform from "kute.js/src/components/transformMatrix";
}
declare module "kute.js/src/objects/objects" {
    export default Objects;
    namespace Objects {
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
    import supportedProperties from "kute.js/src/objects/supportedProperties";
    import defaultValues from "kute.js/src/objects/defaultValues";
    import defaultOptions from "kute.js/src/objects/defaultOptions";
    import prepareProperty from "kute.js/src/objects/prepareProperty";
    import prepareStart from "kute.js/src/objects/prepareStart";
    import crossCheck from "kute.js/src/objects/crossCheck";
    import onStart from "kute.js/src/objects/onStart";
    import onComplete from "kute.js/src/objects/onComplete";
    import linkProperty from "kute.js/src/objects/linkProperty";
}
declare module "kute.js/src/objects/objectsBase" {
    export default Objects;
    namespace Objects {
        export { defaultOptions };
        export { linkProperty };
        export { onStart };
        export { onComplete };
    }
    import defaultOptions from "kute.js/src/objects/defaultOptions";
    import linkProperty from "kute.js/src/objects/linkProperty";
    import onStart from "kute.js/src/objects/onStart";
    import onComplete from "kute.js/src/objects/onComplete";
}
declare module "kute.js/src/process/prepareObject" {
    /**
     * prepareObject
     *
     * Returns all processed valuesStart / valuesEnd.
     *
     * @param {Element} obj the values start/end object
     * @param {string} fn toggles between the two
     */
    export default function prepareObject(obj: Element, fn: string): void;
}
declare module "kute.js/src/process/getStartValues" {
    /**
     * getStartValues
     *
     * Returns the start values for to() method.
     * Used by for the `.to()` static method.
     *
     * @this {KUTE.Tween} the tween instance
     */
    export default function getStartValues(): void;
    export default class getStartValues {
        valuesStart: {};
    }
}
declare module "kute.js/src/process/process" {
    namespace _default {
        export { getInlineStyle };
        export { getStyleForProperty };
        export { getStartValues };
        export { prepareObject };
    }
    export default _default;
    import getInlineStyle from "kute.js/src/process/getInlineStyle";
    import getStyleForProperty from "kute.js/src/process/getStyleForProperty";
    import getStartValues from "kute.js/src/process/getStartValues";
    import prepareObject from "kute.js/src/process/prepareObject";
}
declare module "kute.js/src/tween/tweenBase" {
    /**
     * The `TweenBase` constructor creates a new `Tween` object
     * for a single `HTMLElement` and returns it.
     *
     * `TweenBase` is meant to be used with pre-processed values.
     */
    export default class TweenBase {
        /**
         * @param {Element} targetElement the target element
         * @param {KUTE.tweenProps} startObject the start values
         * @param {KUTE.tweenProps} endObject the end values
         * @param {KUTE.tweenOptions} opsObject the end values
         * @returns {TweenBase} the resulting Tween object
         */
        constructor(targetElement: Element, startObject: import("kute.js/types").tweenProps, endObject: import("kute.js/types").tweenProps, opsObject: KUTE.tweenOptions);
        element: Element;
        /** @type {boolean} */
        playing: boolean;
        /** @type {number?} */
        _startTime: number | null;
        /** @type {boolean} */
        _startFired: boolean;
        valuesEnd: import("kute.js/types").tweenProps;
        valuesStart: import("kute.js/types").tweenProps;
        _resetStart: any;
        /** @type {KUTE.easingOption} */
        _easing: KUTE.easingOption;
        /** @type {number} */
        _duration: number;
        /** @type {number} */
        _delay: number;
        /**
         * Starts tweening
         * @param {number?} time the tween start time
         * @returns {TweenBase} this instance
         */
        start(time: number | null): TweenBase;
        /**
         * Stops tweening
         * @returns {TweenBase} this instance
         */
        stop(): TweenBase;
        /**
         * Trigger internal completion callbacks.
         */
        close(): void;
        /**
         * Schedule another tween instance to start once this one completes.
         * @param {KUTE.chainOption} args the tween animation start time
         * @returns {TweenBase} this instance
         */
        chain(args: KUTE.chainOption): TweenBase;
        _chain: any;
        /**
         * Stop tweening the chained tween instances.
         */
        stopChainedTweens(): void;
        /**
         * Update the tween on each tick.
         * @param {number} time the tick time
         * @returns {boolean} this instance
         */
        update(time: number): boolean;
    }
}
declare module "kute.js/src/tween/tween" {
    /**
     * The `KUTE.Tween()` constructor creates a new `Tween` object
     * for a single `HTMLElement` and returns it.
     *
     * This constructor adds additional functionality and is the default
     * Tween object constructor in KUTE.js.
     */
    export default class Tween extends TweenBase {
        /** @type {boolean} */
        paused: boolean;
        /** @type {number?} */
        _pauseTime: number | null;
        /** @type {number?} */
        _repeat: number | null;
        /** @type {number?} */
        _repeatDelay: number | null;
        /** @type {number?} */
        _repeatOption: number | null;
        /** @type {KUTE.tweenProps} */
        valuesRepeat: import("kute.js/types").tweenProps;
        /** @type {boolean} */
        _yoyo: boolean;
        /** @type {boolean} */
        _reversed: boolean;
        /**
         * Resume tweening
         * @returns {Tween} this instance
         */
        resume(): Tween;
        /**
         * Pause tweening
         * @returns {Tween} this instance
         */
        pause(): Tween;
        /**
         * Reverses start values with end values
         */
        reverse(): void;
    }
    import TweenBase from "kute.js/src/tween/tweenBase";
}
declare module "kute.js/src/tween/tweenExtra" {
    /**
     * The `KUTE.TweenExtra()` constructor creates a new `Tween` object
     * for a single `HTMLElement` and returns it.
     *
     * This constructor is intended for experiments or testing of new features.
     */
    export default class TweenExtra extends Tween {
        /**
         * Method to add callbacks on the fly.
         * @param {string} name callback name
         * @param {Function} fn callback function
         * @returns {TweenExtra}
         */
        on(name: string, fn: Function): TweenExtra;
        /**
         * Method to set options on the fly.
         * * accepting [repeat,yoyo,delay,repeatDelay,easing]
         *
         * @param {string} option the tick time
         * @param {string | number | number[]} value the tick time
         * @returns {TweenExtra}
         */
        option(option: string, value: string | number | number[]): TweenExtra;
    }
    import Tween from "kute.js/src/tween/tween";
}
declare module "kute.js/src/util/degToRad" {
    export default degToRad;
    /**
     * degToRad
     *
     * Returns the value of a degree angle in radian.
     *
     * @param {number} a the degree angle
     * @returns {number} the radian angle
     */
    function degToRad(a: number): number;
}
declare module "kute.js/src/util/fromJSON" {
    export default fromJSON;
    /**
     * fromJSON
     *
     * Returns the {valuesStart, valuesEnd} objects
     * from a Tween instance.
     *
     * @param {string} str the JSON string
     * @returns {JSON} the JSON object
     */
    function fromJSON(str: string): JSON;
}
declare module "kute.js/src/util/progressBar" {
    /**
     * ProgressBar
     *
     * @class
     * A progress bar utility for KUTE.js that will connect
     * a target `<input type="slider">`. with a Tween instance
     * allowing it to control the progress of the Tween.
     */
    export default class ProgressBar {
        /**
         * @constructor
         * @param {HTMLElement} el target or string selector
         * @param {KUTE.Tween} multi when true returns an array of elements
         */
        constructor(element: any, tween: any);
        element: HTMLInputElement;
        updateBar(): void;
        toggleEvents(action: any): void;
        updateTween(): void;
        moveAction(): void;
        downAction(): void;
        upAction(): void;
    }
}
declare module "kute.js/src/util/radToDeg" {
    export default radToDeg;
    /**
     * radToDeg
     *
     * Returns the value of a radian in degrees.
     *
     * @param {number} a the value in radian
     * @returns {number} the value in degrees
     */
    function radToDeg(a: number): number;
}
declare module "kute.js/src/util/rgbToHex" {
    export default rgbToHex;
    /**
     * rgbToHex
     *
     * Converts an {r,g,b} color `Object` into #HEX string color format.
     * Webkit browsers ignore HEX, always use RGB/RGBA.
     *
     * @param {number} r the red value
     * @param {number} g the green value
     * @param {number} b the blue value
     * @returns {string} the #HEX string
     */
    function rgbToHex(r: number, g: number, b: number): string;
}
declare module "kute.js/src/util/toJSON" {
    export default toJSON;
    /**
     * toJSON
     *
     * Returns the {valuesStart, valuesEnd} objects
     * from a Tween instance in JSON string format.
     *
     * @param {KUTE.Tween} tween the Tween instance
     * @returns {string} the JSON string
     */
    function toJSON(tween: KUTE.Tween): string;
}
declare module "kute.js/src/util/version" {
    export default Version;
    /**
     * A global namespace for library version.
     * @type {string}
     */
    const Version: string;
}
declare module "kute.js/types/more/kute" {
    export { default as Animation } from "kute.js/src/animation/animation";
    export { default as AnimationBase } from "kute.js/src/animation/animationBase";
    export { default as AnimationDevelopment } from "kute.js/src/animation/animationDevelopment";
    export { default as backgroundPosition } from "kute.js/src/components/backgroundPosition";
    export { default as backgroundPositionBase } from "kute.js/src/components/backgroundPositionBase";
    export { default as borderRadius } from "kute.js/src/components/borderRadius";
    export { default as borderRadiusBase } from "kute.js/src/components/borderRadiusBase";
    export { default as boxModel } from "kute.js/src/components/boxModel";
    export { default as boxModelBase } from "kute.js/src/components/boxModelBase";
    export { default as boxModelEssential } from "kute.js/src/components/boxModelEssential";
    export { default as clipProperty } from "kute.js/src/components/clipProperty";
    export { default as clipPropertyBase } from "kute.js/src/components/clipPropertyBase";
    export { default as colorProperties } from "kute.js/src/components/colorProperties";
    export { default as colorPropertiesBase } from "kute.js/src/components/colorPropertiesBase";
    export { default as crossBrowserMove } from "kute.js/src/components/crossBrowserMove";
    export { default as filterEffects } from "kute.js/src/components/filterEffects";
    export { default as filterEffectsBase } from "kute.js/src/components/filterEffectsBase";
    export { default as htmlAttributes } from "kute.js/src/components/htmlAttributes";
    export { default as htmlAttributesBase } from "kute.js/src/components/htmlAttributesBase";
    export { default as opacityProperty } from "kute.js/src/components/opacityProperty";
    export { default as opacityPropertyBase } from "kute.js/src/components/opacityPropertyBase";
    export { default as scrollProperty } from "kute.js/src/components/scrollProperty";
    export { default as scrollPropertyBase } from "kute.js/src/components/scrollPropertyBase";
    export { default as shadowProperties } from "kute.js/src/components/shadowProperties";
    export { default as shadowPropertiesBase } from "kute.js/src/components/shadowPropertiesBase";
    export { default as svgCubicMorph } from "kute.js/src/components/svgCubicMorph";
    export { default as svgCubicMorphBase } from "kute.js/src/components/svgCubicMorphBase";
    export { default as svgDraw } from "kute.js/src/components/svgDraw";
    export { default as svgDrawBase } from "kute.js/src/components/svgDrawBase";
    export { default as svgMorph } from "kute.js/src/components/svgMorph";
    export { default as svgMorphBase } from "kute.js/src/components/svgMorphBase";
    export { default as svgTransform } from "kute.js/src/components/svgTransform";
    export { default as svgTransformBase } from "kute.js/src/components/svgTransformBase";
    export { default as textProperties } from "kute.js/src/components/textProperties";
    export { default as textPropertiesBase } from "kute.js/src/components/textPropertiesBase";
    export { default as textWrite } from "kute.js/src/components/textWrite";
    export { default as textWriteBase } from "kute.js/src/components/textWriteBase";
    export { default as transformFunctions } from "kute.js/src/components/transformFunctions";
    export { default as transformFunctionsBase } from "kute.js/src/components/transformFunctionsBase";
    export { default as transformLegacy } from "kute.js/src/components/transformLegacy";
    export { default as transformLegacyBase } from "kute.js/src/components/transformLegacyBase";
    export { default as transformMatrix } from "kute.js/src/components/transformMatrix";
    export { default as transformMatrixBase } from "kute.js/src/components/transformMatrixBase";
    export { default as add } from "kute.js/src/core/add";
    export { default as getAll } from "kute.js/src/core/getAll";
    export { default as Internals } from "kute.js/src/core/internals";
    export { default as linkInterpolation } from "kute.js/src/core/linkInterpolation";
    export { default as queueStart } from "kute.js/src/core/queueStart";
    export { default as remove } from "kute.js/src/core/remove";
    export { default as removeAll } from "kute.js/src/core/removeAll";
    export { default as Render } from "kute.js/src/core/render";
    export { default as EasingBase } from "kute.js/src/easing/easing-base";
    export { default as EasingBezier } from "kute.js/src/easing/easing-bezier";
    export { default as Easing } from "kute.js/src/easing/easing";
    export { default as allFromTo } from "kute.js/src/interface/allFromTo";
    export { default as allTo } from "kute.js/src/interface/allTo";
    export { default as fromTo } from "kute.js/src/interface/fromTo";
    export { default as to } from "kute.js/src/interface/to";
    export { default as arrays } from "kute.js/src/interpolation/arrays";
    export { default as colors } from "kute.js/src/interpolation/colors";
    export { default as coords } from "kute.js/src/interpolation/coords";
    export { default as numbers } from "kute.js/src/interpolation/numbers";
    export { default as perspective } from "kute.js/src/interpolation/perspective";
    export { default as rotate } from "kute.js/src/interpolation/rotate";
    export { default as rotate3d } from "kute.js/src/interpolation/rotate3d";
    export { default as scale } from "kute.js/src/interpolation/scale";
    export { default as skew } from "kute.js/src/interpolation/skew";
    export { default as skewX } from "kute.js/src/interpolation/skewX";
    export { default as skewY } from "kute.js/src/interpolation/skewY";
    export { default as translate } from "kute.js/src/interpolation/translate";
    export { default as translate3d } from "kute.js/src/interpolation/translate3d";
    export { default as units } from "kute.js/src/interpolation/units";
    export { default as ComponentsBase } from "kute.js/src/objects/componentsBase";
    export { default as ComponentsDefault } from "kute.js/src/objects/componentsDefault";
    export { default as ComponentsExtra } from "kute.js/src/objects/componentsExtra";
    export { default as connect } from "kute.js/src/objects/connect";
    export { default as crossCheck } from "kute.js/src/objects/crossCheck";
    export { default as defaultOptions } from "kute.js/src/objects/defaultOptions";
    export { default as defaultValues } from "kute.js/src/objects/defaultValues";
    export { default as globalObject } from "kute.js/src/objects/globalObject";
    export { default as Interpolate } from "kute.js/src/objects/interpolate";
    export { default as KEC } from "kute.js/src/objects/kute";
    export { default as linkProperty } from "kute.js/src/objects/linkProperty";
    export { default as Objects } from "kute.js/src/objects/objects";
    export { default as ObjectsBase } from "kute.js/src/objects/objectsBase";
    export { default as onComplete } from "kute.js/src/objects/onComplete";
    export { default as onStart } from "kute.js/src/objects/onStart";
    export { default as prepareProperty } from "kute.js/src/objects/prepareProperty";
    export { default as prepareStart } from "kute.js/src/objects/prepareStart";
    export { default as supportedProperties } from "kute.js/src/objects/supportedProperties";
    export { default as Tweens } from "kute.js/src/objects/tweens";
    export { default as Util } from "kute.js/src/objects/util";
    export { default as getInlineStyle } from "kute.js/src/process/getInlineStyle";
    export { default as getInlineStyleLegacy } from "kute.js/src/process/getInlineStyleLegacy";
    export { default as getStartValues } from "kute.js/src/process/getStartValues";
    export { default as getStyleForProperty } from "kute.js/src/process/getStyleForProperty";
    export { default as prepareObject } from "kute.js/src/process/prepareObject";
    export { default as Process } from "kute.js/src/process/process";
    export { default as Tween } from "kute.js/src/tween/tween";
    export { default as TweenBase } from "kute.js/src/tween/tweenBase";
    export { default as TweenCollection } from "kute.js/src/tween/tweenCollection";
    export { default as TweenExtra } from "kute.js/src/tween/tweenExtra";
    export { default as degToRad } from "kute.js/src/util/degToRad";
    export { default as fromJSON } from "kute.js/src/util/fromJSON";
    export { default as getPrefix } from "kute.js/src/util/getPrefix";
    export { default as hexToRGB } from "kute.js/src/util/hexToRGB";
    export { default as now } from "kute.js/src/util/now";
    export { default as ProgressBar } from "kute.js/src/util/progressBar";
    export { default as radToDeg } from "kute.js/src/util/radToDeg";
    export { default as rgbToHex } from "kute.js/src/util/rgbToHex";
    export { default as selector } from "kute.js/src/util/selector";
    export { default as supportLegacyTransform } from "kute.js/src/util/supportLegacyTransform";
    export { default as toJSON } from "kute.js/src/util/toJSON";
    export { default as transformProperty } from "kute.js/src/util/transformProperty";
    export { default as trueColor } from "kute.js/src/util/trueColor";
    export { default as trueDimension } from "kute.js/src/util/trueDimension";
    export { default as trueProperty } from "kute.js/src/util/trueProperty";
    export { default as Version } from "kute.js/src/util/version";
}
