import selector from '../util/selector.js'
import connect from '../objects/connect.js'

export default function to(element, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new connect.tween(selector(element), endObject, endObject, optionsObj)
}