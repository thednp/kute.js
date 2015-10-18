// Document
if (!this.Document){this.Document = this.HTMLDocument; }

// Element
if (!window.HTMLElement) { window.HTMLElement = window.Element; }

// Date.now
if(!Date.now){ Date.now = function now() { return new Date().getTime(); }; }

// performance.now
(function(){
	if ("performance" in window == false) {	window.performance = {}; }
	
	if ("now" in window.performance == false){	
		var nowOffset = Date.now();
		
		window.performance.now = function now(){
			return Date.now() - nowOffset;
		}
	}
})();


// Object.keys
if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}


// Array.prototype.indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function indexOf(searchElement) {
		if (this === undefined || this === null) {
			throw new TypeError(this + 'is not an object');
		}
	
		var	arraylike = this instanceof String ? this.split('') : this,
			length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0,
			index = Number(arguments[1]) || 0;
	
		index = (index < 0 ? Math.max(length + index, 0) : index) - 1;
	
		while (++index < length) {
			if (index in arraylike && arraylike[index] === searchElement) {
				return index;
			}
		}
	
		return -1;
	};
}

// getComputedStyle
if (!('getComputedStyle' in window)) {
	(function(){
		function getComputedStylePixel(element, property, fontSize) {
			
			// Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
			var value = element.document && element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
				size = value[1],
				suffix = value[2],
				rootSize;
	
			fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
			rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;
	
			return suffix == '%' ? size / 100 * rootSize :
				suffix == 'cm' ? size * 0.3937 * 96 :
				suffix == 'em' ? size * fontSize :
				suffix == 'in' ? size * 96 :
				suffix == 'mm' ? size * 0.3937 * 96 / 10 :
				suffix == 'pc' ? size * 12 * 96 / 72 :
				suffix == 'pt' ? size * 96 / 72 :
				size;
		}
	
		function setShortStyleProperty(style, property) {
			var	borderSuffix = property == 'border' ? 'Width' : '',
				t = property + 'Top' + borderSuffix,
				r = property + 'Right' + borderSuffix,
				b = property + 'Bottom' + borderSuffix,
				l = property + 'Left' + borderSuffix;
	
			style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [ style[t] ] :
							style[t] == style[b] && style[l] == style[r] ? [ style[t], style[r] ] :
							style[l] == style[r] ? [ style[t], style[r], style[b] ] :
							[ style[t], style[r], style[b], style[l] ]).join(' ');
		}
	
		// <CSSStyleDeclaration>
		function CSSStyleDeclaration(element) {
			var style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel(element, 'fontSize'),
			unCamelCase = function (match) {
				return '-' + match.toLowerCase();
			},
			property;
	
			for (property in currentStyle) {
				Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));
	
				if (property == 'width') {
					style[property] = element.offsetWidth + 'px';
				} else if (property == 'height') {
					style[property] = element.offsetHeight + 'px';
				} else if (property == 'styleFloat') {
					style.float = currentStyle[property];
				} else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
					style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
				} else if (/^outline/.test(property)) {
					// errors on checking outline
					try {
						style[property] = currentStyle[property];
					} catch (error) {
						style.outlineColor = currentStyle.color;
						style.outlineStyle = style.outlineStyle || 'none';
						style.outlineWidth = style.outlineWidth || '0px';
						style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
					}
				} else {
					style[property] = currentStyle[property];
				}
			}
	
			setShortStyleProperty(style, 'margin');
			setShortStyleProperty(style, 'padding');
			setShortStyleProperty(style, 'border');
	
			style.fontSize = Math.round(fontSize) + 'px';		
		}
		
		CSSStyleDeclaration.prototype = {
			constructor: CSSStyleDeclaration,
			// <CSSStyleDeclaration>.getPropertyPriority
			getPropertyPriority: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			},
			// <CSSStyleDeclaration>.getPropertyValue
			getPropertyValue: function (property) {
				return this[property.replace(/-\w/g, function (match) {
					return match[1].toUpperCase();
				})];
			},
			// <CSSStyleDeclaration>.item
			item: function (index) {
				return this[index];
			},
			// <CSSStyleDeclaration>.removeProperty
			removeProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.setProperty
			setProperty: function () {
				throw new Error('NoModificationAllowedError: DOM Exception 7');
			},
			// <CSSStyleDeclaration>.getPropertyCSSValue
			getPropertyCSSValue: function () {
				throw new Error('NotSupportedError: DOM Exception 9');
			}
		};		
	
		// <Global>.getComputedStyle
		window.getComputedStyle = function getComputedStyle(element) {
			return new CSSStyleDeclaration(element);
		};
	})();
}

// requestAnimationFrame
if (!window.requestAnimationFrame) {

	var	lT = Date.now(); // lastTime
	window.requestAnimationFrame = function (callback) {
		'use strict';
		if (typeof callback !== 'function') {
			throw new TypeError(callback + 'is not a function');
		}
		
		var	cT = Date.now(), // currentTime
			dl = 16 + lT - cT; // delay

		if (dl < 0) { dl = 0;	}

		lT = cT;

		return setTimeout(function () {
			lT = Date.now();
			callback(window.performance.now());
		}, dl);
	};

	window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}


// Event
if (!window.Event||!Window.prototype.Event) {
	(function (){
		window.Event = Window.prototype.Event = Document.prototype.Event = Element.prototype.Event = function Event(t, args) {
			if (!t) { throw new Error('Not enough arguments'); } // t is event.type
			var ev, 
				b = args && args.bubbles !== undefined ? args.bubbles : false,
				c = args && args.cancelable !== undefined ? args.cancelable : false;
			if ( 'createEvent' in document ) {
				ev = document.createEvent('Event');			
				ev.initEvent(t, b, c);
			} else {
				ev = document.createEventObject();		
				ev.type = t;
				ev.bubbles = b;
				ev.cancelable = c;	
			}
			return ev;
		};
	})();
}

// CustomEvent
if (!('CustomEvent' in window) || !('CustomEvent' in Window.prototype)) {
	(function(){		
		window.CustomEvent = Window.prototype.CustomEvent = Document.prototype.CustomEvent = Element.prototype.CustomEvent = function CustomEvent(type, args) {
			if (!type) {
				throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
			}
			var ev = new Event(type, args);
			ev.detail = args && args.detail || null;
			return ev;
		};
		
	})()
}

// addEventListener
if (!window.addEventListener||!Window.prototype.addEventListener) {
	(function (){
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var	el = this, // element
				t = arguments[0], // type
				l = arguments[1]; // listener
	
			if (!el._events) {	el._events = {}; }
	
			if (!el._events[t]) {
				el._events[t] = function (e) {
					var	ls = el._events[e.type].list, evs = ls.slice(), i = -1, lg = evs.length, eE; // list | events | index | length | eventElement

					e.preventDefault = function preventDefault() {
						if (e.cancelable !== false) {
							e.returnValue = false;
						}
					};
	
					e.stopPropagation = function stopPropagation() {
						e.cancelBubble = true;
					};
	
					e.stopImmediatePropagation = function stopImmediatePropagation() {
						e.cancelBubble = true;
						e.cancelImmediate = true;
					};
	
					e.currentTarget = el;
					e.relatedTarget = e.fromElement || null;
					e.target = e.target || e.srcElement || el;
					e.timeStamp = new Date().getTime();
	
					if (e.clientX) {
						e.pageX = e.clientX + document.documentElement.scrollLeft;
						e.pageY = e.clientY + document.documentElement.scrollTop;
					}
	
					while (++i < lg && !e.cancelImmediate) {
						if (i in evs) {
							eE = evs[i];
	
							if (ls.indexOf(eE) !== -1 && typeof eE === 'function') {
								eE.call(el, e);
							}
						}
					}
				};
	
				el._events[t].list = [];
	
				if (el.attachEvent) {
					el.attachEvent('on' + t, el._events[t]);
				}
			}
	
			el._events[t].list.push(l);
		};
	
		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var	el = this, t = arguments[0], l = arguments[1], i; // element // type  // listener // index

			if (el._events && el._events[t] && el._events[t].list) {
				i = el._events[t].list.indexOf(l);
	
				if (i !== -1) {
					el._events[t].list.splice(i, 1);
	
					if (!el._events[t].list.length) {
						if (el.detachEvent) {
							el.detachEvent('on' + t, el._events[t]);
						}
						delete el._events[t];
					}
				}
			}
		};
	})();
}

// Event dispatcher	/ trigger
if (!window.dispatchEvent||!Window.prototype.dispatchEvent||!Document.prototype.dispatchEvent||!Element.prototype.dispatchEvent) {
	(function(){	
		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(e) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}
	
			if (!e || typeof e.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}
	
			var el = this, t = e.type; // element | event type
	
			try {
				if (!e.bubbles) {
					e.cancelBubble = true;
	
					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;
	
						(el || window).detachEvent('on' + t, cancelBubbleEvent);
					};
	
					this.attachEvent('on' + t, cancelBubbleEvent);
				}
	
				this.fireEvent('on' + t, e);
			} catch (error) {
				e.target = el;
	
				do {
					e.currentTarget = el;
	
					if ('_events' in el && typeof el._events[t] === 'function') {
						el._events[t].call(el, e);
					}
	
					if (typeof el['on' + t] === 'function') {
						el['on' + t].call(el, e);
					}
	
					el = el.nodeType === 9 ? el.parentWindow : el.parentNode;
				} while (el && !e.cancelBubble);
			}
	
			return true;
		};
	})();
}