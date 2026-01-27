// src/morph/fixPath.ts
// import type { PathArray } from "../types";
import { normalizePath, parsePathString } from "svg-path-commander";

/**
 * @typedef {import("svg-path-commander").PathArray} PathArray
 */

/**
 * Checks a `PathArray` for an unnecessary `Z` segment
 * and returns a new `PathArray` without it.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param {string | PathArray} pathInput the `pathArray` source
 * @return {PathArray} a fixed `PathArray`
 */
export default function fixPath(pathInput) {
  const pathArray = parsePathString(pathInput);
  const normalArray = normalizePath(pathArray);
  const length = pathArray.length;
  const isClosed = normalArray.slice(-1)[0][0] === "Z";
  const segBeforeZ = isClosed ? length - 2 : length - 1;

  const [mx, my] = normalArray[0].slice(1);
  const [x, y] = normalArray[segBeforeZ].slice(-2);

  /* istanbul ignore else */
  if (isClosed && mx === x && my === y) {
    return pathArray.slice(0, -1);
  }
  return pathArray;
}
