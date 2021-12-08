// Include a performance.now polyfill.
// source https://github.com/tweenjs/tween.js/blob/master/src/Now.ts
let performanceNow;

// In node.js, use process.hrtime.
// eslint-disable-next-line
// @ts-ignore
if (typeof self === 'undefined' && typeof process !== 'undefined' && process.hrtime) {
  performanceNow = () => {
    // eslint-disable-next-line
		// @ts-ignore
    const time = process.hrtime();

    // Convert [seconds, nanoseconds] to milliseconds.
    return time[0] * 1000 + time[1] / 1000000;
  };
} else if (typeof self !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
  // In a browser, use self.performance.now if it is available.
  // This must be bound, because directly assigning this function
  // leads to an invocation exception in Chrome.
  performanceNow = self.performance.now.bind(self.performance);
} else if (typeof Date !== 'undefined' && Date.now) {
  // Use Date.now if it is available.
  performanceNow = Date.now;
} else {
  // Otherwise, use 'new Date().getTime()'.
  performanceNow = () => new Date().getTime();
}

const now = performanceNow;

export default now;
