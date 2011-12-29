var pkg = require('./package.json');

// browserify
var b = require('browserify')();
b.addEntry(pkg.main);
var source = b.bundle();


// uglify
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

var ast = jsp.parse(source);
ast = pro.ast_mangle(ast);
ast = pro.ast_squeeze(ast);
source = pro.gen_code(ast);


// add header
source =
  '//\n' +
  '// ' + pkg.name + ' v' + pkg.version + '\n' +
  '// ' + pkg.description + '\n' +
  '// \n' + 
  '// Copyright (C) 2011 by ' + pkg.author + '\n' +
  '// ' + pkg.licenses[0].type + ' License\n' +
  '// ' + pkg.licenses[0].url + '\n' +
  '//\n' +
  source;


// write to file
require('fs')
  .writeFileSync('./build/' + pkg.name + '.min.js', source);
