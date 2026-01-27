"use strict";
import { defineConfig } from "rolldown";
const pkg = await import("./package.json", { with: { type: "json" } }).then(
  (m) => m.default
);

let INPUTFILE = process.env.INPUTFILE;
let OUTPUTFILE = process.env.OUTPUTFILE;
const DIST = process.env.DIST; // base|standard|extra
const NAME = DIST.charAt(0).toUpperCase() + DIST.slice(1); // Base|Standard|Extra
const MIN = process.env.MIN === "true"; // true/false|unset
const FORMAT = process.env.FORMAT; // umd|iife|esm

const year = (new Date()).getFullYear();
const banner = `/*!
* KUTE.js ${NAME} v${pkg.version} (${pkg.homepage})
* Copyright 2015-${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/`;
const miniBanner =
  `/*! KUTE.js ${NAME} v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License */`;

INPUTFILE = INPUTFILE
  ? INPUTFILE
  : (DIST === "standard" ? "src/index.js" : "src/index-" + DIST + ".js");
OUTPUTFILE = OUTPUTFILE
  ? OUTPUTFILE
  : ("dist/kute" + (DIST !== "standard" ? "-" + DIST : "") +
    (FORMAT === "esm" ? ".esm" : "") + (MIN ? ".min" : "") + ".js");

/**
 * @typedef {import('rolldown').RolldownOptions} RolldownOptions
 */

/**
 * @type {RolldownOptions["output"]}
 */
const OUTPUT = {
  file: OUTPUTFILE,
  format: FORMAT, // or iife
  minify: MIN === true,
  // sourceMap: FORMAT === "esm"
  // sourceMap: true
};

if (MIN) {
  // PLUGINS.push(terser({output: {preamble: miniBanner}}));
  OUTPUT.banner = miniBanner;
} else {
  OUTPUT.banner = banner;
}

if (FORMAT !== "esm") {
  OUTPUT.name = "KUTE";
}

export default defineConfig(
  {
    input: INPUTFILE,
    output: OUTPUT,
    globalName: "KUTE",    
    target: FORMAT === "esm" ? "esnext" : "es2019",
    external: FORMAT === "esm" ? [
      "@thednp/bezier-easing",
      "@thednp/shorty",
      "svg-path-commander",
    ] : undefined,
    // plugins: PLUGINS,
  },
);
