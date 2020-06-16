import KUTE from '../objects/kute.js'
import {numbers} from '../objects/interpolate.js'

// const svgDraw = { property : 'draw', defaultValue, Interpolate: {numbers} }, functions = { prepareStart, prepareProperty, onStart }

// Component Functions
export function onStartDraw(tweenProp){
  if ( tweenProp in this.valuesEnd && !KUTE[tweenProp]) {
    KUTE[tweenProp] = (elem,a,b,v) => {
      let pathLength = (a.l*100>>0)/100,
        start = (numbers(a.s,b.s,v)*100>>0)/100,
        end = (numbers(a.e,b.e,v)*100>>0)/100,
        offset = 0 - start,
        dashOne = end+offset;
      
      elem.style.strokeDashoffset = `${offset}px`;
      elem.style.strokeDasharray = `${((dashOne <1 ? 0 : dashOne)*100>>0)/100}px, ${pathLength}px`;
    }
  }
}

// Component Base
const baseSVGDraw = {
  component: 'baseSVGDraw',
  property: 'draw',
  Interpolate: {numbers},
  functions: {onStart:onStartDraw}
}

export default baseSVGDraw