import KUTE from '../objects/kute.js'
import {numbers} from '../objects/interpolate.js' 
import {colors} from './colorPropertiesBase.js'

// Component Name
let ComponentName = 'baseHTMLAttributes'

// Component Special
let attributes = {};
export {attributes}

export const onStartAttr = {
  attr : function(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
      KUTE[tweenProp] = (elem, vS, vE, v) => {
        for ( const oneAttr in vE ){
          KUTE.attributes[oneAttr](elem,oneAttr,vS[oneAttr],vE[oneAttr],v);
        }
      }
    }
  },
  attributes : function(tweenProp){
    if (!KUTE[tweenProp] && this.valuesEnd.attr) {
      KUTE[tweenProp] = attributes
    }
  }
}

// Component Base
const baseAttributes = {
  component: ComponentName,
  property: 'attr',
  // subProperties: ['fill','stroke','stop-color','fill-opacity','stroke-opacity'], // the Animation class will need some values to validate this Object attribute
  // defaultValue: {fill : 'rgb(0,0,0)', stroke: 'rgb(0,0,0)', 'stop-color': 'rgb(0,0,0)', opacity: 1, 'stroke-opacity': 1,'fill-opacity': 1}, // same here
  Interpolate: { numbers,colors },
  functions: {onStart:onStartAttr}
}

export default baseAttributes