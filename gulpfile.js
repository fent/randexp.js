var gulp       = require('gulp');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var header     = require('gulp-header');
var insert     = require('gulp-insert');
var pkg        = require('./package.json');

gulp.task('build', function() {
  return browserify(pkg.main).bundle()
    .pipe(source(pkg.name + '.min.js'))
    .pipe(buffer())
    .pipe(insert.wrap(
      ';!function() {' +
      '  var name = \'RandExp\';' +
      '  var obj = (function() { return ',
      '})()(1);' +
      '  if (typeof define === \'function\' && ' +
      '  typeof define.amd === \'object\') {' +
      '    define(name, function() { return obj; });' +
      '  } else if (typeof window !== \'undefined\') {' +
      '    window[name] = obj;' +
      '  }' +
      '}();'))
    .pipe(uglify())
    .pipe(header(
      '//\n' +
      '// ${pkg.name} v${pkg.version}\n' +
      '// ${pkg.description}\n' +
      '//\n' +
      '// Copyright (C) ${year} by ${pkg.author}\n' +
      '// ${pkg.licenses[0].type} License\n' +
      '// ${pkg.licenses[0].url} \n' +
      '//\n', { pkg: pkg, year: new Date().getFullYear() }))
    .pipe(gulp.dest('build'));
});
