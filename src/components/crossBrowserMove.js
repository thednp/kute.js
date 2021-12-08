import KEC from '../objects/kute';
import getInlineStyle from '../process/getInlineStyle';
import defaultValues from '../objects/defaultValues';
import trueProperty from '../util/trueProperty';
import numbers from '../interpolation/numbers';

// Component Const
const transformProperty = trueProperty('transform');
const supportTransform = transformProperty in document.body.style ? 1 : 0;

// Component Functions
/**
 * Returns the property current style.
 */
function getComponentCurrentValue(/* tweenProp, value */) {
  const currentTransform = getInlineStyle(this.element);
  const { left } = this.element.style;
  const { top } = this.element.style;
  let x = 0;
  let y = 0;

  if (supportTransform && currentTransform.translate) {
    [x, y] = currentTransform.translate;
  } else {
    x = Number.isFinite(left * 1) ? left : defaultValues.move[0];
    y = Number.isFinite(top * 1) ? top : defaultValues.move[1];
  }

  return [x, y];
}
/**
 * Returns the property tween object.
 * @param {string} _ property name
 * @param {string} value property value
 * @returns {number[]} the property tween object
 */
function prepareComponentValue(/* tweenProp */_, value) {
  const x = Number.isFinite(value * 1) ? parseInt(value, 10) : parseInt(value[0], 10) || 0;
  const y = parseInt(value[1], 10) || 0;

  return [x, y];
}

/**
 * Sets the property update function.
 * @param {string} tweenProp the `path` property
 */
export function onStartComponent(tweenProp/* , value */) {
  if (!KEC[tweenProp] && this.valuesEnd[tweenProp]) {
    if (supportTransform) {
      KEC[tweenProp] = (elem, a, b, v) => {
        /* eslint-disable-next-line no-param-reassign -- impossible to satisfy */
        elem.style[transformProperty] = `translate(${numbers(a[0], b[0], v)}px,${numbers(a[1], b[1], v)}px)`;
      };
    } else {
      KEC[tweenProp] = (elem, a, b, v) => {
        if (a[0] || b[0]) {
          /* eslint-disable-next-line no-param-reassign -- impossible to satisfy */
          elem.style.left = `${numbers(a[0], b[0], v)}px`;
        }
        if (a[1] || b[1]) {
          /* eslint-disable-next-line no-param-reassign -- impossible to satisfy */
          elem.style.top = `${numbers(a[1], b[1], v)}px`;
        }
      };
    }
  }
}

// All Component Functions
const componentFunctions = {
  prepareStart: getComponentCurrentValue,
  prepareProperty: prepareComponentValue,
  onStart: onStartComponent,
};

// Base Component
export const baseCrossBrowserMove = {
  component: 'baseCrossBrowserMove',
  property: 'move',
  Interpolate: { numbers },
  functions: { onStart: onStartComponent },
};

// Full Component
const crossBrowserMove = {
  component: 'crossBrowserMove',
  property: 'move',
  defaultValue: [0, 0],
  Interpolate: { numbers },
  functions: componentFunctions,
  Util: { trueProperty },
};

export default crossBrowserMove;
