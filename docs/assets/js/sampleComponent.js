// Component Util
// returns browser prefix
function getPrefix() {
  const prefixes = ['Moz', 'moz', 'Webkit', 'webkit', 'O', 'o', 'Ms', 'ms'];

  let thePrefix;
  for (let i = 0, pfl = prefixes.length; i < pfl; i++) { 
    if (`${prefixes[i]}Transform` in document.body.style) { thePrefix = prefixes[i]; break; }  
  }
  return thePrefix;
}

// returns prefixed property | property
function trueProperty(property) {
  const prefixRequired = (!(property in document.body.style)) ? true : false; // is prefix required for property | prefix

  const prefix = getPrefix();
  return prefixRequired ? prefix + (property.charAt(0).toUpperCase() + property.slice(1)) : property;
}

// some old browsers like to use preffixed properties
var transformProperty = trueProperty('transform');

// value 0 means that browser doesn't support any transform
// value 1 means that browser supports at least 2D transforms
var browserVersion = transformProperty in document.body.style ? 1 : 0                                  

// Component usual imports
var numbers = KUTE.Interpolate.numbers;
var getInlineStyle = KUTE.Process.getInlineStyle;
var scope = window._KUTE;

// Component Functions
function getMove(tweenProp,value){
  var currentTransform = getInlineStyle(this.element);
  var left = this.element.style.left;
  var top = this.element.style.top;
  var x = browserVersion && currentTransform.translate ? currentTransform.translate[0]
                          : isFinite(left*1) ? left
                          : defaultValues.move[0];
  var y = browserVersion && currentTransform.translate ? currentTransform.translate[1]
                          : isFinite(top*1) ? top
                          : defaultValues.move[1];
  return [x,y]
}
function prepareMove(tweenProp,value){
  var x = isFinite(value*1) ? parseInt(value) : parseInt(value[0]) || 0;
  var y = parseInt(value[1]) || 0;
  return [ x, y ]
}
function onStartMove(tweenProp,value){
  if (!scope[tweenProp] && this.valuesEnd[tweenProp]) {
    if (browserVersion){
      scope[tweenProp] = function (elem, a, b, v) {
        elem.style[transformProperty] = 'translate('+numbers(a[0],b[0],v)+'px,'+numbers(a[1],b[1],v)+'px)';
      };
    } else {
      scope[tweenProp] = function (elem, a, b, v) {
        if (a[0]||b[0]) {
            elem.style.left = numbers(a[0],b[0],v)+'px';
        }
        if (a[1]||b[1]) {
            elem.style.top = numbers(a[1],b[1],v)+'px';
        }
      };
    }
  }
}

// the component object
var crossBrowserMoveOptions = {
  component: 'crossBrowserMove',
  property: 'move',
  defaultValue: [0,0],
  Interpolate: numbers,
  functions: {
    prepareStart: getMove,
    prepareProperty: prepareMove,
    onStart: onStartMove
  }
};
KUTE.Components.crossBrowserMove = new KUTE.Animation(crossBrowserMoveOptions)