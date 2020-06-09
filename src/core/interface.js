
import selector from '../util/selector.js'
import {TweenConstructor} from './globals.js'
import TweenCollection from '../tween/tweenCollection.js'

const TC = TweenConstructor.Tween

// main methods
export function to(element, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new TC(selector(element), endObject, endObject, optionsObj)
}
export function fromTo(element, startObject, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  return new TC(selector(element), startObject, endObject, optionsObj)
}

// multiple elements tween objects
export function allTo(elements, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  optionsObj.resetStart = endObject
  return new TweenCollection(selector(elements,true), endObject, endObject, optionsObj)
}
export function allFromTo(elements, startObject, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  return new TweenCollection(selector(elements,true), startObject, endObject, optionsObj)
}