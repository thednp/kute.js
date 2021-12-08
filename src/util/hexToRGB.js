/**
 * hexToRGB
 *
 * Converts a #HEX color format into RGB
 * and returns a color object {r,g,b}.
 *
 * @param {string} hex the degree angle
 * @returns {KUTE.colorObject | null} the radian angle
 */
const hexToRGB = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const hexShorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const HEX = hex.replace(hexShorthand, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(HEX);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};
export default hexToRGB;
