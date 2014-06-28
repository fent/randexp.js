var tests = require('./tests.js');
var assert = require('assert');
var RandExp = require('..');
var randexp = require('..').randexp;


var match = function(regexp, str, bad) {
  var err = 'Generated string \'' + str + '\' ' +
            (bad ? 'matches' : 'does not match') + ' ' +
            'regexp \'' + regexp.source + '\'';
  var t = regexp.test(str);
  assert.ok(bad !== t, err);
};

function createIt(test) {
  return  function() {
    var regs = test.regexp;
    if (!Array.isArray(regs)) { regs = [regs]; }

    for (var i = 0, l = regs.length; i < l; i++) {
      var reg = regs[i];
      var rand = new RandExp(reg);

      // Generate several times.
      for (var k = 0; k < 5; k++) {
        match(reg, rand.gen(), test.bad || false);
        match(reg, randexp(reg), test.bad || false);
      }
    }
  };
}

function createDescribe(test) {
  return function() {
    for (var row in test) {
      if (test.hasOwnProperty(row)) {
        var t = test[row];
        it(t.desc, createIt(t));
      }
    }
  };
}

for (var type in tests) {
  if (tests.hasOwnProperty(type)) {
    describe(type, createDescribe(tests[type]));
  }
}
