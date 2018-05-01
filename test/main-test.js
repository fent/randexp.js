const tests   = require('./tests.js');
const assert  = require('assert');
const RandExp = require('..');
const randexp = require('..').randexp;


var match = (regexp, str, bad) => {
  var err = `Generated string '${str}' ` +
            (bad ? 'matches' : 'does not match') +
            ` regexp '${regexp.source}'`;
  var t = regexp.test(str);
  assert.ok(bad !== t, err);
};


for (let type in tests) {
  describe(type, () => {
    for (let row in tests[type]) {
      let t = tests[type][row];
      it(t.desc, () => {
        var regs = t.regexp;
        if (!Array.isArray(regs)) { regs = [regs]; }

        for (var i = 0, l = regs.length; i < l; i++) {
          var reg = regs[i];
          var rand = new RandExp(reg);

          // Generate several times.
          for (var k = 0; k < 5; k++) {
            match(reg, rand.gen(), t.bad || false);
            match(reg, randexp(reg), t.bad || false);
          }
        }
      });
    }
  });
}

describe('Call with a string', () => {
  it('Returns a correctly generated string', () => {
    var r = new RandExp('\\d{4}');
    assert.equal(r.gen().length, 4);
  });

  describe('With options', () => {
    it('Detects options and sets them', () => {
      var r = new RandExp('hello', 'i');
      assert.ok(r.ignoreCase);
      assert.ok(!r.multiline);
    });
  });
});

describe('Call shorthand randexp method with a string', () => {
  it('Returns a correctly generated string', () => {
    var r = randexp('\\d{4}');
    assert.equal(r.length, 4);
  });
});

describe('Call without a string or regular expression', () => {
  it('Throws an error', () => {
    assert.throws(() => {
      var r = new RandExp({});
      r.gen();
    }, /Expected a regexp or string/);
  });
});

describe('Followed by groups', () => {
  it('Generate nothing, for now', () => {
    assert.equal(randexp(/hi(?= no one)/), 'hi');
    assert.equal(randexp(/hi(?! no one)/), 'hi');
  });
});
