import selector from '../util/selector.js'
import TweenConstructor from '../objects/TweenConstructor.js'

export default function fromTo(element, startObject, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  return new TweenConstructor.Tween(selector(element), startObject, endObject, optionsObj)
}