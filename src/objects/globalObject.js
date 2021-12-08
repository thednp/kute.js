let gl0bal;

if (typeof global !== 'undefined') gl0bal = global;
else if (typeof window !== 'undefined') gl0bal = window.self;
else gl0bal = {};

const globalObject = gl0bal;
export default globalObject;
