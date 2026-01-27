import prepareProperty from "../objects/prepareProperty";
import prepareStart from "../objects/prepareStart";
import onStart from "../objects/onStart";
import onComplete from "../objects/onComplete";
import crossCheck from "../objects/crossCheck";
import Interpolate from "../objects/interpolate";

import Animation from "./animation";

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
   * @param  {KUTE.fullComponent} args
   */
  constructor(Component) {
    super(Component);

    // const Objects = { defaultValues, defaultOptions, Interpolate, linkProperty, Util }
    const Functions = {
      prepareProperty,
      prepareStart,
      onStart,
      onComplete,
      crossCheck,
    };
    const Category = Component.category;
    const Property = Component.property;
    const Length = (Component.properties && Component.properties.length) ||
      (Component.subProperties && Component.subProperties.length);

    // set defaultValues
    if ("defaultValue" in Component) { // value 0 will invalidate
      this.supports = `${Property} property`;
      this.defaultValue = `${
        (`${Component.defaultValue}`).length ? "YES" : "not set or incorrect"
      }`;
    } else if (Component.defaultValues) {
      this.supports = `${Length || Property} ${
        Property || Category
      } properties`;
      this.defaultValues =
        Object.keys(Component.defaultValues).length === Length
          ? "YES"
          : "Not set or incomplete";
    }

    // set additional options
    if (Component.defaultOptions) {
      this.extends = [];

      Object.keys(Component.defaultOptions).forEach((op) => {
        this.extends.push(op);
      });

      if (this.extends.length) {
        this.extends = `with <${this.extends.join(", ")}> new option(s)`;
      } else {
        delete this.extends;
      }
    }

    // set functions
    if (Component.functions) {
      this.interface = [];
      this.render = [];
      this.warning = [];

      Object.keys(Functions).forEach((fnf) => {
        if (fnf in Component.functions) {
          if (fnf === "prepareProperty") this.interface.push("fromTo()");
          if (fnf === "prepareStart") this.interface.push("to()");
          if (fnf === "onStart") this.render = "can render update";
        } else {
          if (fnf === "prepareProperty") this.warning.push("fromTo()");
          if (fnf === "prepareStart") this.warning.push("to()");
          if (fnf === "onStart") this.render = "no function to render update";
        }
      });

      if (this.interface.length) {
        this.interface = `${Category || Property} can use [${
          this.interface.join(", ")
        }] method(s)`;
      } else {
        delete this.uses;
      }

      if (this.warning.length) {
        this.warning = `${Category || Property} can't use [${
          this.warning.join(", ")
        }] method(s) because values aren't processed`;
      } else {
        delete this.warning;
      }
    }

    // register Interpolation functions
    if (Component.Interpolate) {
      this.uses = [];
      this.adds = [];

      Object.keys(Component.Interpolate).forEach((fni) => {
        const compIntObj = Component.Interpolate[fni];
        // register new Interpolation functions
        if (typeof compIntObj === "function") {
          if (!Interpolate[fni]) {
            this.adds.push(`${fni}`);
          }
          this.uses.push(`${fni}`);
        } else {
          Object.keys(compIntObj).forEach((sfn) => {
            if (typeof (compIntObj[sfn]) === "function" && !Interpolate[fni]) {
              this.adds.push(`${sfn}`);
            }
            this.uses.push(`${sfn}`);
          });
        }
      });

      if (this.uses.length) {
        this.uses = `[${this.uses.join(", ")}] interpolation function(s)`;
      } else {
        delete this.uses;
      }

      if (this.adds.length) {
        this.adds = `new [${this.adds.join(", ")}] interpolation function(s)`;
      } else {
        delete this.adds;
      }
    } else {
      this.critical = `For ${
        Property || Category
      } no interpolation function[s] is set`;
    }

    // set component util
    if (Component.Util) {
      this.hasUtil = Object.keys(Component.Util).join(",");
    }

    return this;
  }
}
