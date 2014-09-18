var assert = require('assert');

var RandExp = require('..');

var seed;
//simple "good enough" PRNG
function prng(a, b) {
  seed = Math.pow(seed, 2) % 94906249;
  return seed % (1 + b - a) + a;
}

describe('Modify PRNG', function() {
  it('Should generate the same string when the PRNG is seeded the same way', function() {
    var initial_seed = Math.random() * Math.pow(2, 32) + Date.now();
    RandExp.randInt = prng;
    seed = initial_seed;
    var a = RandExp.randexp(/.{100}/);
    seed = initial_seed;
    var b = RandExp.randexp(/.{100}/);
    assert.equal(a, b, "same seed should produce same output");
  });
});
