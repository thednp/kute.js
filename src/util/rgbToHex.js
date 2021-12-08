/**
 * rgbToHex
 *
 * Converts an {r,g,b} color `Object` into #HEX string color format.
 * Webkit browsers ignore HEX, always use RGB/RGBA.
 *
 * @param {number} r the red value
 * @param {number} g the green value
 * @param {number} b the blue value
 * @returns {string} the #HEX string
 */
// eslint-disable-next-line no-bitwise
const rgbToHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
export default rgbToHex;
