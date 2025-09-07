'use strict'
import buble from '@rollup/plugin-buble'
import {terser} from 'rollup-plugin-terser'
import node from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import * as pkg from "./package.json"


let INPUTFILE = process.env.INPUTFILE
let OUTPUTFILE = process.env.OUTPUTFILE
const DIST = process.env.DIST // base|standard|extra
const NAME = DIST.charAt(0).toUpperCase() + DIST.slice(1); // Base|Standard|Extra
const MIN = process.env.MIN === 'true' // true/false|unset
const FORMAT = process.env.FORMAT // umd|iife|esm

const year = (new Date).getFullYear()
const banner = 
`/*!
* KUTE.js ${NAME} v${pkg.version} (${pkg.homepage})
* Copyright 2025-${year} © ${pkg.author}
* Licensed under MIT (https://github.com/thednp/kute.js/blob/master/LICENSE)
*/`
const miniBanner = `// KUTE.js ${NAME} v${pkg.version} | ${pkg.author} © ${year} | ${pkg.license}-License`

INPUTFILE = INPUTFILE ? INPUTFILE : (DIST === 'standard' ? 'src/index.js' : 'src/index-'+DIST+'.js')
OUTPUTFILE = OUTPUTFILE ? OUTPUTFILE : ('dist/kute'+(DIST!=='standard'?'-'+DIST:'')+(FORMAT==='esm'?'.esm':'')+(MIN?'.min':'')+'.js')

const OUTPUT = {
  file: OUTPUTFILE,
  format: FORMAT, // or iife
}

const PLUGINS = [
  node({mainFields: ['jsnext','module'], dedupe: ['svg-path-commander']}) ,
  json(),
]

if (FORMAT!=='esm'){
  PLUGINS.push(buble({objectAssign: 'Object.assign'}));
}

if (MIN){
  PLUGINS.push(terser({output: {preamble: miniBanner}}));
} else {
  OUTPUT.banner = banner;
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
