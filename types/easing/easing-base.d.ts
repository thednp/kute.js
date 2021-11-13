export default Easing;
declare namespace Easing {
    function linear(t: any): any;
    function easingQuadraticIn(t: any): number;
    function easingQuadraticOut(t: any): number;
    function easingQuadraticInOut(t: any): number;
    function easingCubicIn(t: any): number;
    function easingCubicOut(t0: any): number;
    function easingCubicInOut(t: any): number;
    function easingCircularIn(t: any): number;
    function easingCircularOut(t0: any): number;
    function easingCircularInOut(t0: any): number;
    function easingBackIn(t: any): number;
    function easingBackOut(t0: any): number;
    function easingBackInOut(t0: any): number;
}
