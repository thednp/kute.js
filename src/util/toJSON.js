//  toJSON - returns {valuesStart,valuesEnd} from target Tween in JSON string format
export default (tween) => {
  const obj = {
    valuesStart: tween.valuesStart,
    valuesEnd: tween.valuesEnd,
  };
  return JSON.stringify(obj);
};
