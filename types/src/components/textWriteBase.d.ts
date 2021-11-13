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
import numbers from "../interpolation/numbers.js";
declare const lowerCaseAlpha: string[];
declare const upperCaseAlpha: string[];
declare const nonAlpha: string[];
declare const numeric: string[];
declare const alphaNumeric: string[];
declare const allTypes: string[];
