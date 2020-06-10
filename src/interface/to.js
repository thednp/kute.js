import selector from '../util/selector.js'
import TC from './TC.js'

export default function to(element, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new TC(selector(element), endObject, endObject, optionsObj)
}