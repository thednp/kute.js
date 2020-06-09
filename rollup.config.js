'use strict'
import buble from '@rollup/plugin-buble'
import {terser} from 'rollup-plugin-terser'
import node from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import json from '@rollup/plugin-json'
import * as pkg from "./package.json"

const POLYFILL = process.env.POLYFILL === 'true'
const POLYIN = process.env.INPUTFILE
const POLYOUT = process.env.OUTPUTFILE
const DIST = process.env.DIST // base|standard|extra
const NAME = !POLYFILL ? DIST.charAt(0).toUpperCase() + DIST.slice(1):''; // Base|Standard|Extra
const MIN = process.env.MIN === 'true' // true/false|unset
const FORMAT = process.env.FORMAT // umd|iife|esm

const year = (new Date).getFullYear()
const banner = POLYFILL && POLYIN && POLYOUT ? '"use strict";':
`/*!
* KUTE.js ${NAME} v${pkg.version} (${pkg.homepage})
* Copyright 2015-${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/`
const miniBanner = POLYFILL && POLYIN && POLYOUT ? banner :
`// KUTE.js ${NAME} v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License`

const INPUTFILE = POLYFILL && POLYIN || POLYIN ? POLYIN : (DIST === 'standard' ? 'src/index.js' : 'src/index-'+DIST+'.js')
const OUTPUTFILE = POLYFILL && POLYOUT || POLYOUT ? POLYOUT : (DIST === 'standard' ? 'dist/kute'+(FORMAT==='esm'?'.esm':'')+(MIN?'.min':'')+'.js' : 'demo/src/kute-'+DIST+(FORMAT==='esm'?'.esm':'')+(MIN?'.min':'')+'.js')

const OUTPUT = {
  file: OUTPUTFILE,
  format: FORMAT, // or iife
}

const PLUGINS = [
  node({mainFields: ['jsnext', 'module']}),
  json(),
  buble(),
]

if (MIN){
  PLUGINS.push(terser({output: {preamble: miniBanner}}));
} else {
  OUTPUT.banner = banner;
  PLUGINS.push(cleanup());
}

if (FORMAT!=='esm') {
  OUTPUT.name = 'KUTE';
}

export default [
  {
    input: INPUTFILE,
    output: OUTPUT,
    plugins: PLUGINS
  }
]
