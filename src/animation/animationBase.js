import supportedProperties from '../objects/supportedProperties';
import defaultOptions from '../objects/defaultOptions';
import onStart from '../objects/onStart';
import onComplete from '../objects/onComplete';
import linkProperty from '../objects/linkProperty';
import Util from '../objects/util';
import Interpolate from '../objects/interpolate';

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
  constructor(Component) {
    const ComponentName = Component.component;
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty }
    const Functions = { onStart, onComplete };
    const Category = Component.category;
    const Property = Component.property;
    // ESLint
    this._ = 0;

    // set supported category/property
    supportedProperties[ComponentName] = Component.properties
      || Component.subProperties || Component.property;

    // set additional options
    if (Component.defaultOptions) {
      // Object.keys(Component.defaultOptions).forEach((op) => {
      //   defaultOptions[op] = Component.defaultOptions[op];
      // });
      Object.assign(defaultOptions, Component.defaultOptions);
    }

    // set functions
    if (Component.functions) {
      Object.keys(Functions).forEach((fn) => {
        if (fn in Component.functions) {
          if (typeof (Component.functions[fn]) === 'function') {
            // if (!Functions[fn][ Category||Property ]) {
            //   Functions[fn][ Category||Property ] = Component.functions[fn];
            // }
            if (!Functions[fn][ComponentName]) Functions[fn][ComponentName] = {};
            if (!Functions[fn][ComponentName][Category || Property]) {
              Functions[fn][ComponentName][Category || Property] = Component.functions[fn];
            }
          } else {
            Object.keys(Component.functions[fn]).forEach((ofn) => {
              // if (!Functions[fn][ofn]) Functions[fn][ofn] = Component.functions[fn][ofn];
              if (!Functions[fn][ComponentName]) Functions[fn][ComponentName] = {};
              if (!Functions[fn][ComponentName][ofn]) {
                Functions[fn][ComponentName][ofn] = Component.functions[fn][ofn];
              }
            });
          }
        }
      });
    }

    // set interpolate
    if (Component.Interpolate) {
      Object.keys(Component.Interpolate).forEach((fni) => {
        const compIntObj = Component.Interpolate[fni];
        if (typeof (compIntObj) === 'function' && !Interpolate[fni]) {
          Interpolate[fni] = compIntObj;
        } else {
          Object.keys(compIntObj).forEach((sfn) => {
            if (typeof (compIntObj[sfn]) === 'function' && !Interpolate[fni]) {
              Interpolate[fni] = compIntObj[sfn];
            }
          });
        }
      });

      linkProperty[ComponentName] = Component.Interpolate;
    }

    // set component util
    if (Component.Util) {
      Object.keys(Component.Util).forEach((fnu) => {
        if (!Util[fnu]) Util[fnu] = Component.Util[fnu];
      });
    }

    return { name: ComponentName };
  }
}
