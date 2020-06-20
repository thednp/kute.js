import selector from '../util/selector.js'
import connect from '../objects/connect.js'

export default function fromTo(element, startObject, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  return new connect.tween(selector(element), startObject, endObject, optionsObj)
}