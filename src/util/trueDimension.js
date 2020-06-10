// trueDimension - returns { v = value, u = unit }
export default function (dimValue, isAngle) {
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