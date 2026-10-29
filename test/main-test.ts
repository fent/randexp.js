import assert from 'node:assert';
import RandExp from '..';
import tests from './tests';

const match = (regexp: RegExp, str: string, bad: boolean) => {
  const err =
    `Generated string '${str}' ` +
    (bad ? 'matches' : 'does not match') +
    ` regexp '${regexp.source}'`;
  const t = regexp.test(str);
  assert.ok(bad !== t, err);
};

for (const type in tests) {
  describe(type, () => {
    for (const row in tests[type]) {
      const t = tests[type][row];
      it(t.desc, () => {
        let regs = t.regexp;
        if (!Array.isArray(regs)) {
          regs = [regs];
        }

        for (const reg of regs) {
          const rand = new RandExp(reg);

          // Generate several times.
          for (let k = 0; k < 5; k++) {
            match(reg, rand.gen(), t.bad || false);
            match(reg, RandExp.randexp(reg), t.bad || false);
          }
        }
      });
    }
  });
}

describe('Call with a string', () => {
  it('Returns a correctly generated string', () => {
    const r = new RandExp('\\d{4}');
    assert.equal(r.gen().length, 4);
  });

  describe('With options', () => {
    it('Detects options and sets them', () => {
      const r = new RandExp('hello', 'i');
      assert.ok(r.ignoreCase);
      assert.ok(!r.multiline);
    });
  });
});

describe('Call shorthand randexp method with a string', () => {
  it('Returns a correctly generated string', () => {
    const r = RandExp.randexp('\\d{4}');
    assert.equal(r.length, 4);
  });
});

describe('Call without a string or regular expression', () => {
  it('Throws an error', () => {
    assert.throws(() => {
      // @ts-expect-error
      const r = new RandExp({});
      r.gen();
    }, /Expected a regexp or string/);
  });
});

describe('Followed by groups', () => {
  it('Generate nothing, for now', () => {
    assert.equal(RandExp.randexp(/hi(?= no one)/), 'hi');
    assert.equal(RandExp.randexp(/hi(?! no one)/), 'hi');
  });
});
