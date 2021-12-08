/**
 * trueDimension
 *
 * Returns the string value of a specific CSS property converted into a nice
 * { v = value, u = unit } object.
 *
 * @param {string} dimValue the property string value
 * @param {boolean | number} isAngle sets the utility to investigate angles
 * @returns {{v: number, u: string}} the true {value, unit} tuple
 */
const trueDimension = (dimValue, isAngle) => {
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
};
export default trueDimension;
