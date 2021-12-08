/**
 * fromJSON
 *
 * Returns the {valuesStart, valuesEnd} objects
 * from a Tween instance.
 *
 * @param {string} str the JSON string
 * @returns {JSON} the JSON object
 */
const fromJSON = (str) => {
  const obj = JSON.parse(str);
  return {
    valuesStart: obj.valuesStart,
    valuesEnd: obj.valuesEnd,
  };
};
export default fromJSON;
