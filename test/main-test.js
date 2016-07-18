var tests   = require('./tests.js');
var assert  = require('assert');
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

describe('Call with a string', function() {
  it('Returns a correctly generated string', function() {
    var r = new RandExp('\d{4}');
    assert.equal(r.gen().length, 4);
  });

  describe('With options', function() {
    it('Detects options and sets them', function() {
      var r = new RandExp('hello', 'i');
      assert.ok(r.ignoreCase);
      assert.ok(!r.multiline);
    });
  });
});

describe('Call without a string or regular expression', function() {
  it('Throws an error', function() {
    assert.throws(function() {
      var r = new RandExp({});
      r.gen();
    }, /Expected a regexp or string/);
  });
});

describe('Followed by groups', function() {
  it('Generate nothing, for now', function() {
    assert.equal(randexp(/hi(?= no one)/), 'hi');
    assert.equal(randexp(/hi(?! no one)/), 'hi');
  });
});
