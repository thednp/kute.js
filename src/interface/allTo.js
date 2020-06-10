import selector from '../util/selector.js'
import TweenCollection from '../tween/tweenCollection.js'

// multiple elements tween objects
export default function allTo(elements, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new TweenCollection(selector(elements,true), endObject, endObject, optionsObj)
}