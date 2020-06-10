//  toJSON - returns {valuesStart,valuesEnd} object from JSON STRING
export default (str) => {
  let obj = JSON.parse(str)
  return {
    valuesStart: obj.valuesStart,
    valuesEnd: obj.valuesEnd
  }
}