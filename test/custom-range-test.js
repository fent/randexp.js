const assert  = require('assert');
const RandExp = require('..');


const genMaxChar = (re) => {
  let output = re.gen();
  let maxChar = 0;
  for (let i = 0; i < output.length; i++) {
    maxChar = Math.max(maxChar, output.charCodeAt(i));
  }
  return maxChar;
};

describe('Modify Range', () => {
  describe('Globally from prototpye', () => {
    it('Should generate unicode when we expand its range', () => {
      RandExp.prototype.defaultRange.subtract(0, 126);
      RandExp.prototype.defaultRange.add(127, 65535);
      let re = new RandExp(/.{100}/);
      RandExp.prototype.defaultRange.add(0, 126);
      RandExp.prototype.defaultRange.subtract(127, 65535);
      let maxChar = genMaxChar(re);
      assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
    });
  });

  describe('From a regexp instance', () => {
    it('Should generate unicode when we expand its range', () => {
      let r = /[\d\D]{100}/;
      r.defaultRange = RandExp.prototype.defaultRange.clone();
      r.defaultRange.subtract(0, 126);
      r.defaultRange.add(127, 65535);
      let re = new RandExp(r);
      let maxChar = genMaxChar(re);
      assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
    });
  });

  describe('From a randexp instance', () => {
    it('Should generate unicode when we expand its range', () => {
      let re = new RandExp(/[\s\S]{100}/);
      let maxChar = genMaxChar(re);
      assert.ok(maxChar < 127, 'ascii characters should have been generated');
      re.defaultRange.subtract(0, 126);
      re.defaultRange.add(127, 65535);
      maxChar = genMaxChar(re);
      assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
    });

    describe('With a negated set', () => {
      it('Should still generate only ascii', () => {
        let re = new RandExp(/[^a]{100}/);
        let maxChar = genMaxChar(re);
        assert.ok(maxChar < 127, 'ascii characters should have been generated');
        re.defaultRange.subtract(0, 126);
        re.defaultRange.add(127, 65535);
        maxChar = genMaxChar(re);
        assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
      });
    });
  });
});
