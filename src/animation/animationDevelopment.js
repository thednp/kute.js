import prepareProperty from '../objects/prepareProperty';
import prepareStart from '../objects/prepareStart';
import onStart from '../objects/onStart';
import onComplete from '../objects/onComplete';
import crossCheck from '../objects/crossCheck';
import Interpolate from '../objects/interpolate';

import Animation from './animation';

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
  constructor(Component) {
    super(Component);

    const propertyInfo = this;
    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty, Util }
    const Functions = {
      prepareProperty, prepareStart, onStart, onComplete, crossCheck,
    };
    const Category = Component.category;
    const Property = Component.property;
    const Length = (Component.properties && Component.properties.length)
      || (Component.subProperties && Component.subProperties.length);

    // set defaultValues
    if ('defaultValue' in Component) { // value 0 will invalidate
      propertyInfo.supports = `${Property} property`;
      propertyInfo.defaultValue = `${(`${Component.defaultValue}`).length ? 'YES' : 'not set or incorrect'}`;
    } else if (Component.defaultValues) {
      propertyInfo.supports = `${Length || Property} ${Property || Category} properties`;
      propertyInfo.defaultValues = Object.keys(Component.defaultValues).length === Length ? 'YES' : 'Not set or incomplete';
    }

    // set additional options
    if (Component.defaultOptions) {
      propertyInfo.extends = [];

      Object.keys(Component.defaultOptions).forEach((op) => {
        propertyInfo.extends.push(op);
      });

      if (propertyInfo.extends.length) {
        propertyInfo.extends = `with <${propertyInfo.extends.join(', ')}> new option(s)`;
      } else {
        delete propertyInfo.extends;
      }
    }

    // set functions
    if (Component.functions) {
      propertyInfo.interface = [];
      propertyInfo.render = [];
      propertyInfo.warning = [];

      Object.keys(Functions).forEach((fnf) => {
        if (fnf in Component.functions) {
          if (fnf === 'prepareProperty') propertyInfo.interface.push('fromTo()');
          if (fnf === 'prepareStart') propertyInfo.interface.push('to()');
          if (fnf === 'onStart') propertyInfo.render = 'can render update';
        } else {
          if (fnf === 'prepareProperty') propertyInfo.warning.push('fromTo()');
          if (fnf === 'prepareStart') propertyInfo.warning.push('to()');
          if (fnf === 'onStart') propertyInfo.render = 'no function to render update';
        }
      });

      if (propertyInfo.interface.length) {
        propertyInfo.interface = `${Category || Property} can use [${propertyInfo.interface.join(', ')}] method(s)`;
      } else {
        delete propertyInfo.uses;
      }

      if (propertyInfo.warning.length) {
        propertyInfo.warning = `${Category || Property} can't use [${propertyInfo.warning.join(', ')}] method(s) because values aren't processed`;
      } else {
        delete propertyInfo.warning;
      }
    }

    // register Interpolation functions
    if (Component.Interpolate) {
      propertyInfo.uses = [];
      propertyInfo.adds = [];

      Object.keys(Component.Interpolate).forEach((fni) => {
        const compIntObj = Component.Interpolate[fni];
        // register new Interpolation functions
        if (typeof (compIntObj) === 'function') {
          if (!Interpolate[fni]) {
            propertyInfo.adds.push(`${fni}`);
          }
          propertyInfo.uses.push(`${fni}`);
        } else {
          Object.keys(compIntObj).forEach((sfn) => {
            if (typeof (compIntObj[sfn]) === 'function' && !Interpolate[fni]) {
              propertyInfo.adds.push(`${sfn}`);
            }
            propertyInfo.uses.push(`${sfn}`);
          });
        }
      });

      if (propertyInfo.uses.length) {
        propertyInfo.uses = `[${propertyInfo.uses.join(', ')}] interpolation function(s)`;
      } else {
        delete propertyInfo.uses;
      }

      if (propertyInfo.adds.length) {
        propertyInfo.adds = `new [${propertyInfo.adds.join(', ')}] interpolation function(s)`;
      } else {
        delete propertyInfo.adds;
      }
    } else {
      propertyInfo.critical = `For ${Property || Category} no interpolation function[s] is set`;
    }

    // set component util
    if (Component.Util) {
      propertyInfo.hasUtil = Object.keys(Component.Util).join(',');
    }

    return propertyInfo;
  }
}
