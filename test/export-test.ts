import assert from 'node:assert';
import RandExp, { RandExp as NamedRandExp } from '..';

describe('Exports', () => {
  it('Exposes class as default and named export', () => {
    assert.strictEqual(RandExp, NamedRandExp);
    assert.strictEqual(RandExp.RandExp, RandExp);
    assert.strictEqual(RandExp.default, RandExp);
  });
});
