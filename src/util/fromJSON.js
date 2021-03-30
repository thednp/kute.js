//  toJSON - returns {valuesStart,valuesEnd} object from JSON STRING
export default (str) => {
  const obj = JSON.parse(str);
  return {
    valuesStart: obj.valuesStart,
    valuesEnd: obj.valuesEnd,
  };
};
