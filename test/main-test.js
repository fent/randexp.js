var   tests = require('./tests.js')
  ,  assert = require('assert')
  , RandExp = require('..')


// matcher that will be used in all tests
// all regexps passed to rndexp must match their result
var match = function(regexp, desc) {
  var obj = {
    topic: function() {
      return new RandExp(regexp).gen();
    }
  };

  obj[desc] = function(rndexp) {
    assert.isTrue(regexp.test(rndexp));
  };

  return obj;
};


for (var type in tests) {
  if (tests.hasOwnProperty(type)) {
    describe(type, function() {

    for (var row in tests[type]) {
      if (tests[type].hasOwnProperty(row)) {
        (function(test) {

          it(test.desc, function() {
            var randstr = new RandExp(test.regexp).gen();
            assert(test.regexp.test(randstr));
          });

        })(tests[type][row]);
      }
    }

    });
  }
}
