// KUTE.js | Minify
// Minify script for the js files in root folder
// Usage: npm run min
// by https://github.com/RyanZim && https://github.com/thednp

var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
console.log('Minified:');

// Helper Functions:
function minify(srcPath, writePath) {
  fs.writeFile(writePath, (uglify.minify(srcPath).code + '\n'), function (err) {
    if (err) return handleError(err);
    console.log(srcPath);
  });
}
function handleError(err) {
  console.error(err);
  process.exit(1);
}

// Minify files
minify('kute-attr.js', 'dist/kute-attr.min.js');
minify('kute-bezier.js', 'dist/kute-bezier.min.js');
minify('kute-css.js', 'dist/kute-css.min.js');
minify('kute-jquery.js', 'dist/kute-jquery.min.js');
minify('kute-physics.js', 'dist/kute-physics.min.js');
minify('kute-svg.js', 'dist/kute-svg.min.js');
minify('kute-text.js', 'dist/kute-text.min.js');
minify('kute.js', 'dist/kute.min.js');
