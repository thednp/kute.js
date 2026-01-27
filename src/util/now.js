let performanceNow = () => performance.now();

if (typeof window === "undefined") {
  // Otherwise, use 'new Date().getTime()'.
  performanceNow = () => new Date().getTime();
}

const now = performanceNow;

export default now;
