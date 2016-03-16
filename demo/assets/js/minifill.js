// Document
// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
if (!this.Document){this.Document = this.HTMLDocument; }

// Element
if (!window.HTMLElement) { window.HTMLElement = window.Element; }

// Window
(function(global) {
	if (global.constructor) {
		global.Window = global.constructor;
	} else {
		(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
	}
}(this));

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

// Event
if (!window.Event||!Window.prototype.Event) {
	(function (){
		window.Event = Window.prototype.Event = Document.prototype.Event = Element.prototype.Event = function Event(type, eventInitDict) {
			if (!type) { throw new Error('Not enough arguments'); }
			var event, 
				bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false,
				cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
			if ( 'createEvent' in document ) {
				event = document.createEvent('Event');			
				event.initEvent(type, bubbles, cancelable);
			} else {
				event = document.createEventObject();		
				event.type = type;
				event.bubbles = bubbles;
				event.cancelable = cancelable;	
			}
			return event;
		};
	})();
}

// CustomEvent
if (!('CustomEvent' in window) || !('CustomEvent' in Window.prototype)) {
	(function(){		
		window.CustomEvent = Window.prototype.CustomEvent = Document.prototype.CustomEvent = Element.prototype.CustomEvent = function CustomEvent(type, eventInitDict) {
			if (!type) {
				throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
			}
			var event = new Event(type, eventInitDict);
			event.detail = eventInitDict && eventInitDict.detail || null;
			return event;
		};
		
	})()
}

// addEventListener
if (!window.addEventListener||!Window.prototype.addEventListener) {
	(function (){
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
	})();
}

// Event dispatcher	/ trigger
if (!window.dispatchEvent||!Window.prototype.dispatchEvent||!Document.prototype.dispatchEvent||!Element.prototype.dispatchEvent) {
	(function(){	
		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}
	
			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}
	
			var element = this, type = event.type;
	
			try {
				if (!event.bubbles) {
					event.cancelBubble = true;
	
					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;
	
						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};
	
					this.attachEvent('on' + type, cancelBubbleEvent);
				}
	
				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;
	
				do {
					event.currentTarget = element;
	
					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}
	
					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}
	
					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}
	
			return true;
		};
	})();
}