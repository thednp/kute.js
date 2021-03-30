// build this polyfill for IE9+ browser support
// import 'minifill/src/this.Window.js'
// import 'minifill/src/this.Document.js'
// import 'minifill/src/window.HTMLElement.js'

// import 'minifill/src/Object.defineProperty.js'
// import 'minifill/src/Object.create.js'
import 'minifill/src/Function.prototype.bind.js';

import 'minifill/src/Array.from.js';
import 'minifill/src/Array.prototype.map.js';
import 'minifill/src/Array.prototype.some.js';
import 'minifill/src/Array.prototype.every.js';
import 'minifill/src/Array.prototype.includes.js';
import 'minifill/src/Array.prototype.flat.js';
import 'minifill/src/String.prototype.includes.js';

// IE9+
import 'minifill/src/Date.now.js';
import 'minifill/src/window.performance.now.js';
import 'minifill/src/window.requestAnimationFrame.js';
