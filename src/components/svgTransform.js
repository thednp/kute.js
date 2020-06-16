import KUTE from '../objects/kute.js'
import {numbers} from '../objects/interpolate.js'
import Components from '../objects/components.js'
import {svgTransformOnStart} from './svgTransformBase.js'

// const svgTransform = { property : 'svgTransform', subProperties, defaultValue, Interpolate: {numbers}, functions }

// Component Util
function parseStringOrigin (origin, {x, width}) {
  return /[a-zA-Z]/.test(origin) && !/px/.test(origin) 
    ? origin.replace(/top|left/,0).replace(/right|bottom/,100).replace(/center|middle/,50)
    : /%/.test(origin) ? (x + parseFloat(origin) * width / 100) : parseFloat(origin);
} 
// helper function that turns transform value from string to object
function parseTransformString (a) {
  const d = a && /\)/.test(a) ? a.substring(0, a.length-1).split(/\)\s|\)/) : 'none', c = {};

  if (d instanceof Array) {
    for (let j=0, jl = d.length; j<jl; j++){
      const p = d[j].trim().split('('); 
      c[p[0]] = p[1];
    }
  }
  return c;
}
function parseTransformSVG (p,v){
  const svgTransformObject = {};

  // by default the transformOrigin is "50% 50%" of the shape box
  const bb = this.element.getBBox();
  const cx = bb.x + bb.width/2;
  const cy = bb.y + bb.height/2;

  let origin = this._transformOrigin;
  let translation;

  origin = typeof (origin) !== 'undefined' ? (origin.constructor === Array ? origin : origin.split(/\s/)) : [cx,cy];

  origin[0] = typeof origin[0] === 'number' ? origin[0] : parseStringOrigin(origin[0],bb);
  origin[1] = typeof origin[1] === 'number' ? origin[1] : parseStringOrigin(origin[1],bb);

  svgTransformObject.origin = origin;

  for ( const i in v ) { // populate the valuesStart and / or valuesEnd
    if (i === 'rotate'){
      svgTransformObject[i] = typeof v[i] === 'number' ? v[i] : v[i] instanceof Array ? v[i][0] : v[i].split(/\s/)[0]*1;
    } else if (i === 'translate'){
      translation = v[i] instanceof Array ? v[i] : /\,|\s/.test(v[i]) ? v[i].split(',') : [v[i],0];
      svgTransformObject[i] = [translation[0]*1||0, translation[1]*1||0];
    } else if (/skew/.test(i)) {
      svgTransformObject[i] = v[i]*1||0;
    } else if (i === 'scale'){
      svgTransformObject[i] = parseFloat(v[i])||1;
    }
  }
  return svgTransformObject;
}

// Component Functions
function prepareSvgTransform(p,v){
  return parseTransformSVG.call(this,p,v);
}
// returns an obect with current transform attribute value
function getStartSvgTransform (tweenProp,value) { 
  const transformObject = {};
  const currentTransform = parseTransformString(this.element.getAttribute('transform'));
  for (const i in value) { 
    // find a value in current attribute value or add a default value
    transformObject[i] = i in currentTransform ? currentTransform[i] : (i==='scale'?1:0); 
  }
  return transformObject;
}

function svgTransformCrossCheck(prop) {
  if (!this._resetStart) return; // fix since 1.6.1 for fromTo() method

  if ( this.valuesEnd[prop] ) {
    let valuesStart = this.valuesStart[prop];
    let valuesEnd = this.valuesEnd[prop];
    const currentTransform = parseTransformSVG.call(this, prop, parseTransformString(this.element.getAttribute('transform')) );

    // populate the valuesStart first
    for ( const i in currentTransform ) { 
      valuesStart[i] = currentTransform[i]; 
    }

    // now try to determine the REAL translation
    const parentSVG = this.element.ownerSVGElement;
    const startMatrix = parentSVG.createSVGTransformFromMatrix(
      parentSVG.createSVGMatrix()
      .translate(-valuesStart.origin[0],-valuesStart.origin[1]) // - origin
      .translate('translate' in valuesStart ? valuesStart.translate[0] : 0,'translate' in valuesStart ? valuesStart.translate[1] : 0) // the current translate
      .rotate(valuesStart.rotate||0).skewX(valuesStart.skewX||0).skewY(valuesStart.skewY||0).scale(valuesStart.scale||1)// the other functions
      .translate(+valuesStart.origin[0],+valuesStart.origin[1]) // + origin
    );
    valuesStart.translate = [startMatrix.matrix.e,startMatrix.matrix.f]; // finally the translate we're looking for
    // copy existing and unused properties to the valuesEnd
    for ( const i in valuesStart) {
      if ( !(i in valuesEnd) || i==='origin') { 
        valuesEnd[i] = valuesStart[i]; 
      }
    }
  }
}

// All Component Functions
export const svgTransformFunctions = {
  prepareStart: getStartSvgTransform,
  prepareProperty: prepareSvgTransform,
  onStart: svgTransformOnStart,
  crossCheck: svgTransformCrossCheck
}


// Component Full
export const svgTransform = {
  component: 'svgTransformProperty',
  property: 'svgTransform',
  // subProperties: ['translate','rotate','skewX','skewY','scale'],
  defaultOptions: {transformOrigin:'50% 50%'},
  defaultValue: {translate:0, rotate:0, skewX:0, skewY:0, scale:1},
  Interpolate: {numbers},
  functions: svgTransformFunctions,

  // export utils to globals for faster execution
  Util: { parseStringOrigin, parseTransformString, parseTransformSVG }
}

export default svgTransform

Components.SVGTransformProperty = svgTransform
