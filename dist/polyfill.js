"use strict";
if (!window.addEventListener||!Window.prototype.addEventListener) {
  window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
    var	element = this,
      type = arguments[0],
      listener = arguments[1];
    if (!element._events) {	element._events = {}; }
    if (!element._events[type]) {
      element._events[type] = function (event) {
        var	list = element._events[event.type].list,
          events = list.slice(),
          index = -1,
          length = events.length,
          eventElement;
        event.preventDefault = function preventDefault() {
          if (event.cancelable !== false) {
            event.returnValue = false;
          }
        };
        event.stopPropagation = function stopPropagation() {
          event.cancelBubble = true;
        };
        event.stopImmediatePropagation = function stopImmediatePropagation() {
          event.cancelBubble = true;
          event.cancelImmediate = true;
        };
        event.currentTarget = element;
        event.relatedTarget = event.fromElement || null;
        event.target = event.target || event.srcElement || element;
        event.timeStamp = new Date().getTime();
        if (event.clientX) {
          event.pageX = event.clientX + document.documentElement.scrollLeft;
          event.pageY = event.clientY + document.documentElement.scrollTop;
        }
        while (++index < length && !event.cancelImmediate) {
          if (index in events) {
            eventElement = events[index];
            if (list.indexOf(eventElement) !== -1 && typeof eventElement === 'function') {
              eventElement.call(element, event);
            }
          }
        }
      };
      element._events[type].list = [];
      if (element.attachEvent) {
        element.attachEvent('on' + type, element._events[type]);
      }
    }
    element._events[type].list.push(listener);
  };
  window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
    var	element = this,
      type = arguments[0],
      listener = arguments[1],
      index;
    if (element._events && element._events[type] && element._events[type].list) {
      index = element._events[type].list.indexOf(listener);
      if (index !== -1) {
        element._events[type].list.splice(index, 1);
        if (!element._events[type].list.length) {
          if (element.detachEvent) {
            element.detachEvent('on' + type, element._events[type]);
          }
          delete element._events[type];
        }
      }
    }
  };
}

if(!Date.now){
  Date.now = function now() {
    return new Date().getTime();
  };
}

if ( !window.performance ) {
  window.performance = {};
}
if ( !window.performance.now ){
  var nowOffset = Date.now();
  window.performance.now = function now(){
    return Date.now() - nowOffset;
  };
}

if (!window.requestAnimationFrame) {
	var	lastTime = Date.now();
	window.requestAnimationFrame = function (callback) {
		if (typeof callback !== 'function') {
			throw new TypeError(callback + 'is not a function');
		}
		var	currentTime = Date.now(),
			delay = 16 + lastTime - currentTime;
		if (delay < 0) { delay = 0;	}
		lastTime = currentTime;
		return setTimeout(function () {
			lastTime = Date.now();
			callback(performance.now());
		}, delay);
	};
	window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}
