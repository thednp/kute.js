/*
 * build this polyfill for IE9+ browser support
 */
// import 'minifill/src/this.Window'
// import 'minifill/src/this.Document'
// import 'minifill/src/window.HTMLElement'

// import 'minifill/src/Object.defineProperty'
// import 'minifill/src/Object.create'
import 'minifill/src/Function.prototype.bind';

import 'minifill/src/Array.from';
import 'minifill/src/Array.prototype.map';
import 'minifill/src/Array.prototype.some';
import 'minifill/src/Array.prototype.every';
import 'minifill/src/Array.prototype.includes';
import 'minifill/src/Array.prototype.flat';
import 'minifill/src/String.prototype.includes';

// IE9+
import 'minifill/src/Date.now';
import 'minifill/src/window.performance.now';
import 'minifill/src/window.requestAnimationFrame';
