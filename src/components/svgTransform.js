import KUTE from '../objects/KUTE.js'
import {numbers} from '../objects/Interpolate.js'
import Components from '../objects/Components.js'

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
export function svgTransformOnStart (tweenProp){
  if (!KUTE[tweenProp] && this.valuesEnd[tweenProp]) {
    KUTE[tweenProp] = (l, a, b, v) => {
      let x = 0;
      let y = 0;
      let tmp;
      const deg = Math.PI/180;
      const scale = 'scale' in b ? numbers(a.scale,b.scale,v) : 1;
      const rotate = 'rotate' in b ? numbers(a.rotate,b.rotate,v) : 0;
      const sin = Math.sin(rotate*deg);
      const cos = Math.cos(rotate*deg);
      const skewX = 'skewX' in b ? numbers(a.skewX,b.skewX,v) : 0;
      const skewY = 'skewY' in b ? numbers(a.skewY,b.skewY,v) : 0;
      const complex = rotate||skewX||skewY||scale!==1 || 0;

      // start normalizing the translation, we start from last to first (from last chained translation)
      // the normalized translation will handle the transformOrigin tween option and makes sure to have a consistent transformation
      x -= complex ? b.origin[0] : 0;y -= complex ? b.origin[1] : 0; // we start with removing transformOrigin from translation
      x *= scale;y *= scale; // we now apply the scale
      y += skewY ? x*Math.tan(skewY*deg) : 0;x += skewX ? y*Math.tan(skewX*deg) : 0; // now we apply skews
      tmp = cos*x - sin*y; // apply rotation as well
      y = rotate ? sin*x + cos*y : y;x = rotate ? tmp : x;
      x += 'translate' in b ? numbers(a.translate[0],b.translate[0],v) : 0; // now we apply the actual translation
      y += 'translate' in b ? numbers(a.translate[1],b.translate[1],v) : 0;
      x += complex ? b.origin[0] : 0;y += complex ? b.origin[1] : 0; // normalizing ends with the addition of the transformOrigin to the translation

      // finally we apply the transform attribute value
      l.setAttribute('transform', ( x||y ? (`translate(${(x*1000>>0)/1000}${y ? (`,${(y*1000>>0)/1000}`) : ''})`) : '' )
                                 +( rotate ? `rotate(${(rotate*1000>>0)/1000})` : '' )
                                 +( skewX ? `skewX(${(skewX*1000>>0)/1000})` : '' )
                                 +( skewY ? `skewY(${(skewY*1000>>0)/1000})` : '' )
                                 +( scale !== 1 ? `scale(${(scale*1000>>0)/1000})` : '' ) );
    }
  }
}
export function prepareSvgTransform(p,v){
  return parseTransformSVG.call(this,p,v);
}
// returns an obect with current transform attribute value
export function getStartSvgTransform (tweenProp,value) { 
  const transformObject = {};
  const currentTransform = parseTransformString(this.element.getAttribute('transform'));
  for (const i in value) { 
    // find a value in current attribute value or add a default value
    transformObject[i] = i in currentTransform ? currentTransform[i] : (i==='scale'?1:0); 
  }
  return transformObject;
}

export function svgTransformCrossCheck(prop) {
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

// Component Base
export const baseSVGTransformOps = {
  component: 'svgTransformProperty',
  property: 'svgTransform',
  // subProperties: ['translate','rotate','skewX','skewY','scale'],
  // defaultValue: {translate:0, rotate:0, skewX:0, skewY:0, scale:1},
  defaultOptions: {transformOrigin:'50% 50%'},
  Interpolate: {numbers},
  functions: {onStart:svgTransformOnStart}
}

// Component Full
export const svgTransformOps = {
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

Components.SVGTransformProperty = svgTransformOps
