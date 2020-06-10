import selector from '../util/selector.js'
import TweenConstructor from '../objects/TweenConstructor.js'


export default function to(element, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new TweenConstructor.Tween(selector(element), endObject, endObject, optionsObj)
}