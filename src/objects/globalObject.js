let globalObject;

if (typeof global !== 'undefined') globalObject = global;
else if (typeof window !== 'undefined') globalObject = window.self;
else globalObject = {};

export default globalObject;
