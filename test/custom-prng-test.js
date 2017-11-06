const assert  = require('assert');
const RandExp = require('..');


// This is a simple "good enough" PRNG.
var initialSeed = Math.random() * Math.pow(2, 32) + Date.now();
function prng() {
  var seed = initialSeed;
  return (a, b) => {
    seed = Math.pow(seed, 2) % 94906249;
    return seed % (1 + b - a) + a;
  };
}

describe('Modify PRNG', () => {
  it('Should generate the same string with the same the PRNG seed', () => {
    var aRE = new RandExp(/.{100}/);
    aRE.randInt = prng();
    var a = aRE.gen();

    var bRE = new RandExp(/.{100}/);
    bRE.randInt = prng();
    var b = bRE.gen();

    var originalRandInt = RandExp.prototype.randInt;
    RandExp.prototype.randInt = prng();
    var c = RandExp.randexp(/.{100}/);
    RandExp.prototype.randInt = originalRandInt;

    var r = /.{100}/;
    r.randInt = prng();
    var d = RandExp.randexp(r);

    assert.equal(a, b, 'same seed should produce same output');
    assert.equal(a, c, 'same seed should produce same output');
    assert.equal(a, d, 'same seed should produce same output');
  });
});
