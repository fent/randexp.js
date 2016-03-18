var assert  = require('assert');
var RandExp = require('..');


var seed;
// This is a simple "good enough" PRNG.
function prng(a, b) {
  seed = Math.pow(seed, 2) % 94906249;
  return seed % (1 + b - a) + a;
}

describe('Modify PRNG', function() {
  it('Should generate the same string with the same the PRNG seed', function() {
    var initialSeed = Math.random() * Math.pow(2, 32) + Date.now();

    var aRE = new RandExp(/.{100}/);
    aRE.randInt = prng;
    seed = initialSeed;
    var a = aRE.gen();

    var bRE = new RandExp(/.{100}/);
    bRE.randInt = prng;
    seed = initialSeed;
    var b = bRE.gen();


    RandExp.prototype.randInt = prng;
    seed = initialSeed;
    var c = RandExp.randexp(/.{100}/);

    assert.equal(a, b, 'same seed should produce same output');
    assert.equal(a, c, 'same seed should produce same output');
  });
});
