import selector from '../util/selector.js'
import TweenConstructor from '../objects/TweenConstructor.js'

const TC = TweenConstructor.Tween

export default function to(element, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new TC(selector(element), endObject, endObject, optionsObj)
}