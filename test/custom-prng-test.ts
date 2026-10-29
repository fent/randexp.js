import { equal } from 'node:assert';
import RandExp, { type RandRegExp } from '..';

// This is a simple "good enough" PRNG.
const initialSeed = Math.random() * 2 ** 32 + Date.now();
const prng = () => {
  let seed = initialSeed;
  return (a: number, b: number) => {
    seed = seed ** 2 % 94906249;
    return (seed % (1 + b - a)) + a;
  };
};

describe('Modify PRNG', () => {
  it('Should generate the same string with the same the PRNG seed', () => {
    const aRE = new RandExp(/.{100}/);
    aRE.randInt = prng();
    const a = aRE.gen();

    const bRE = new RandExp(/.{100}/);
    bRE.randInt = prng();
    const b = bRE.gen();

    const originalRandInt = RandExp.prototype.randInt;
    RandExp.prototype.randInt = prng();
    const c = RandExp.randexp(/.{100}/);
    RandExp.prototype.randInt = originalRandInt;

    const r = /.{100}/ as RandRegExp;
    r.randInt = prng();
    const d = RandExp.randexp(r);

    equal(a, b, 'same seed should produce same output');
    equal(a, c, 'same seed should produce same output');
    equal(a, d, 'same seed should produce same output');
  });
});
