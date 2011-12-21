var  tests = require('./tests.js')
  ,   vows = require('vows')
  , assert = require('assert')
  ;

require('..');


// matcher that will be used in all tests
// all regexps passed to rndexp must match their result
var match = function(regexp, desc) {
  var obj = {
    topic: function() {
      return regexp.gen;
    }
  };

  obj[desc] = function(rndexp) {
    assert.isTrue(regexp.test(rndexp));
  };

  return obj;
};


for (var type in tests) {
  var suite = vows.describe(type),
      batch = {};

  for (var row in tests[type]) {
    var regexp = tests[type][row].regexp,
          desc = tests[type][row].desc;
    batch[row] = match(regexp, desc);
  }

  suite.addBatch(batch);
  suite.export(module);
}
