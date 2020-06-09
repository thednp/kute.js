// returns browser prefix
export function getPrefix() {
  const prefixes = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'];

  let thePrefix;
  for (let i = 0, pfl = prefixes.length; i < pfl; i++) { 
    if (`${prefixes[i]}Transform` in document.body.style) { thePrefix = prefixes[i]; break; }  
  }
  return thePrefix;
}

// returns prefixed property | property
export function trueProperty(property) {
  const prefixRequired = (!(property in document.body.style)) ? true : false; // is prefix required for property | prefix

  const prefix = getPrefix();
  return prefixRequired ? prefix + (property.charAt(0).toUpperCase() + property.slice(1)) : property;
}

// angle conversion
export const radToDeg = a => a*180/Math.PI
export const degToRad = a => a*Math.PI/180

// true dimension returns { v = value, u = unit }
export function trueDimension(dimValue, isAngle) {
  const intValue = parseInt(dimValue) || 0;

  const mUnits = ['px','%','deg','rad','em','rem','vh','vw'];
  let theUnit;
  for (let mIndex=0; mIndex<mUnits.length; mIndex++) { 
    if ( typeof dimValue === 'string' && dimValue.includes(mUnits[mIndex]) ) { 
      theUnit = mUnits[mIndex]; break; 
    } 
  }
  theUnit = theUnit !== undefined ? theUnit : (isAngle ? 'deg' : 'px');
  return { v: intValue, u: theUnit };
}

// replace transparent and transform any color to rgba()/rgb()
export function trueColor(colorString) {
  if (/rgb|rgba/.test(colorString)) {
    // first check if it's a rgb string
    const vrgb = colorString.replace(/\s|\)/,'').split('(')[1].split(',');

    const colorAlpha = vrgb[3] ? vrgb[3] : null;
    if (!colorAlpha) {
      return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]) };
    } else {
      return { r: parseInt(vrgb[0]), g: parseInt(vrgb[1]), b: parseInt(vrgb[2]), a: parseFloat(colorAlpha) };
    }
  } else if (/^#/.test(colorString)) {
    const fromHex = hexToRGB(colorString); return { r: fromHex.r, g: fromHex.g, b: fromHex.b };
  } else if (/transparent|none|initial|inherit/.test(colorString)) {
    return { r: 0, g: 0, b: 0, a: 0 };
  } else if (!/^#|^rgb/.test(colorString) ) { // maybe we can check for web safe colors
    const siteHead = document.getElementsByTagName('head')[0]; siteHead.style.color = colorString;
    let webColor = getComputedStyle(siteHead,null).color; webColor = /rgb/.test(webColor) ? webColor.replace(/[^\d,]/g, '').split(',') : [0,0,0];
    siteHead.style.color = ''; return { r: parseInt(webColor[0]), g: parseInt(webColor[1]), b: parseInt(webColor[2]) };
  }
}

// transform rgb to hex or vice-versa | webkit browsers ignore HEX, always use RGB/RGBA
export function rgbToHex(r, g, b) {
 return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
export function hexToRGB(hex) {
  const hexShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i; // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  hex = hex.replace(hexShorthand, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// the little gems for light builds
export function toJSON(tween){
  let obj = {
    valuesStart: tween.valuesStart,
    valuesEnd: tween.valuesEnd
  }
  return JSON.stringify(obj)
}
export function fromJSON(str){
  let obj = JSON.parse(str)
  return {
    valuesStart: obj.valuesStart,
    valuesEnd: obj.valuesEnd
  }
}