/**
 * toJSON
 *
 * Returns the {valuesStart, valuesEnd} objects
 * from a Tween instance in JSON string format.
 *
 * @param {KUTE.Tween} tween the Tween instance
 * @returns {string} the JSON string
 */
const toJSON = (tween) => {
  const obj = {
    valuesStart: tween.valuesStart,
    valuesEnd: tween.valuesEnd,
  };
  return JSON.stringify(obj);
};
export default toJSON;
