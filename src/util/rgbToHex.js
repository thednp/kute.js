// rgbToHex - transform rgb to hex or vice-versa | webkit browsers ignore HEX, always use RGB/RGBA
export default (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
