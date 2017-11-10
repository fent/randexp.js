const gulp       = require('gulp');
const browserify = require('browserify');
const uglify     = require('gulp-uglify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const header     = require('gulp-header');
const insert     = require('gulp-insert');
const pkg        = require('./package.json');

gulp.task('build', () => {
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
      '// ${pkg.license} License\n' +
      '//\n', { pkg: pkg, year: new Date().getFullYear() }))
    .pipe(gulp.dest('build'));
});
