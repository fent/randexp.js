var   tests = require('./tests.js')
  ,  assert = require('assert')
  , RandExp = require('..')


for (var type in tests) {
  if (tests.hasOwnProperty(type)) {
    describe(type, function() {

    for (var row in tests[type]) {
      if (tests[type].hasOwnProperty(row)) {
        (function(test) {

          it(test.desc, function() {
            var randexp = new RandExp(test.regexp);

            assert.equal(true, test.regexp.test(randexp.gen()));
            assert.equal(true, test.regexp.test(randexp.gen()));
          });

        })(tests[type][row]);
      }
    }

    });
  }
}
