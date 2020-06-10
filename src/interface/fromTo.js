import selector from '../util/selector.js'
import TweenConstructor from '../objects/TweenConstructor.js'

const TC = TweenConstructor.Tween

export default function fromTo(element, startObject, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  return new TC(selector(element), startObject, endObject, optionsObj)
}