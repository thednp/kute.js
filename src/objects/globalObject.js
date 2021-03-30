let globalObject;

if (typeof (global) !== 'undefined') globalObject = global;
else if (typeof (window.self) !== 'undefined') globalObject = window.self;
else if (typeof (window) !== 'undefined') globalObject = window;
else globalObject = {};

export default globalObject;
