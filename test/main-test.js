var tests = require('./tests.js')
  , assert = require('assert')
  , RandExp = require('..')
  , randexp = require('..').randexp


var match = function(regexp, str, bad) {
  var err = 'Generated string \'' + str + '\' ' +
            (bad ? 'matches' : 'does not match') + ' ' +
            'regexp \'' + regexp.source + '\'';
  var t = regexp.test(str);
  assert.ok(!bad !== !t, err);
};

for (var type in tests) {
  if (tests.hasOwnProperty(type)) {
    describe(type, function() {

    for (var row in tests[type]) {
      if (tests[type].hasOwnProperty(row)) {
        (function(test) {

          it(test.desc, function() {
            var regs = test.regexp;
            if (!Array.isArray(regs)) { regs = [regs]; }

            for (var i = 0, l = regs.length; i < l; i++) {
              var reg = regs[i];
              var rand = new RandExp(reg);
              var s, err;

              // generate several times
              for ( var k = 0; k < 5; k++) {
                match(reg, rand.gen(), test.bad);
                match(reg, randexp(reg), test.bad);
              }
            }

          });

        })(tests[type][row]);
      }
    }

    });
  }
}
