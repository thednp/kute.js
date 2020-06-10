import Tweens from '../objects/Tweens.js'
export default (tw) => { 
  let i = Tweens.indexOf(tw)
  i !== -1 && Tweens.splice(i, 1)
}
