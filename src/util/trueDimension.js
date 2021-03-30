// trueDimension - returns { v = value, u = unit }
export default function trueDimension(dimValue, isAngle) {
  const intValue = parseInt(dimValue, 10) || 0;
  const mUnits = ['px', '%', 'deg', 'rad', 'em', 'rem', 'vh', 'vw'];
  let theUnit;

  for (let mIndex = 0; mIndex < mUnits.length; mIndex += 1) {
    if (typeof dimValue === 'string' && dimValue.includes(mUnits[mIndex])) {
      theUnit = mUnits[mIndex]; break;
    }
  }
  if (theUnit === undefined) {
    theUnit = isAngle ? 'deg' : 'px';
  }

  return { v: intValue, u: theUnit };
}
