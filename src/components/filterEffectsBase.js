import KEC from '../objects/kute';
import numbers from '../interpolation/numbers';
import colors from '../interpolation/colors';

// Component Interpolation
/**
 * Sets the `drop-shadow` sub-property update function.
 * * disimbiguation `dropshadow` interpolation function and `dropShadow` property
 * @param {string} tweenProp the property name
 */
export function dropshadow(a, b, v) {
  const params = [];
  const unit = 'px';

  for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
    params[i] = ((numbers(a[i], b[i], v) * 100 >> 0) / 100) + unit;
  }
  return `drop-shadow(${params.concat(colors(a[3], b[3], v)).join(' ')})`;
}
// Component Functions
/**
 * Sets the property update function.
 * @param {string} tweenProp the property name
 */
export function onStartFilter(tweenProp) {
  if (this.valuesEnd[tweenProp] && !KEC[tweenProp]) {
    KEC[tweenProp] = (elem, a, b, v) => {
      /* eslint-disable-next-line no-param-reassign -- impossible to satisfy */
      elem.style[tweenProp] = (b.url ? `url(${b.url})` : '')
                            /* eslint-disable no-bitwise -- impossible to satisfy */
                            + (a.opacity || b.opacity ? `opacity(${((numbers(a.opacity, b.opacity, v) * 100) >> 0) / 100}%)` : '')
                            + (a.blur || b.blur ? `blur(${((numbers(a.blur, b.blur, v) * 100) >> 0) / 100}em)` : '')
                            + (a.saturate || b.saturate ? `saturate(${((numbers(a.saturate, b.saturate, v) * 100) >> 0) / 100}%)` : '')
                            + (a.invert || b.invert ? `invert(${((numbers(a.invert, b.invert, v) * 100) >> 0) / 100}%)` : '')
                            + (a.grayscale || b.grayscale ? `grayscale(${((numbers(a.grayscale, b.grayscale, v) * 100) >> 0) / 100}%)` : '')
                            + (a.hueRotate || b.hueRotate ? `hue-rotate(${((numbers(a.hueRotate, b.hueRotate, v) * 100) >> 0) / 100}deg)` : '')
                            + (a.sepia || b.sepia ? `sepia(${((numbers(a.sepia, b.sepia, v) * 100) >> 0) / 100}%)` : '')
                            + (a.brightness || b.brightness ? `brightness(${((numbers(a.brightness, b.brightness, v) * 100) >> 0) / 100}%)` : '')
                            + (a.contrast || b.contrast ? `contrast(${((numbers(a.contrast, b.contrast, v) * 100) >> 0) / 100}%)` : '')
                            + (a.dropShadow || b.dropShadow ? dropshadow(a.dropShadow, b.dropShadow, v) : '');
      /* eslint-enable no-bitwise -- impossible to satisfy */
    };
  }
}

// Base Component
const baseFilter = {
  component: 'baseFilter',
  property: 'filter',
  // opacity function interfere with opacityProperty
  // subProperties: ['blur', 'brightness','contrast','dropShadow',
  //  'hueRotate','grayscale','invert','opacity','saturate','sepia','url'],
  // defaultValue: {
  //   opacity: 100, blur: 0, saturate: 100, grayscale: 0,
  //   brightness: 100, contrast: 100, sepia: 0, invert: 0, hueRotate:0,
  //   dropShadow: [0,0,0,{r:0,g:0,b:0}], url:''
  // },
  Interpolate: {
    opacity: numbers,
    blur: numbers,
    saturate: numbers,
    grayscale: numbers,
    brightness: numbers,
    contrast: numbers,
    sepia: numbers,
    invert: numbers,
    hueRotate: numbers,
    dropShadow: { numbers, colors, dropshadow },
  },
  functions: { onStart: onStartFilter },
};

export default baseFilter;
