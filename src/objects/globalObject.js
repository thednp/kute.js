let gl0bal;

if (typeof globalThis !== "undefined") gl0bal = globalThis;
else if (typeof window !== "undefined") gl0bal = globalThis.self;
else gl0bal = {};

const globalObject = gl0bal;
export default globalObject;
