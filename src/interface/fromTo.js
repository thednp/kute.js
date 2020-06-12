import selector from '../util/selector.js'
import TC from './tc.js'

export default function fromTo(element, startObject, endObject, optionsObj) {
  optionsObj = optionsObj || {}
  return new TC(selector(element), startObject, endObject, optionsObj)
}