const assert  = require('assert');
const RandExp = require('..');


function genMaxChar(re) {
  var output = re.gen();
  var maxChar = 0;
  for (var i = 0; i < output.length; i++) {
    maxChar = Math.max(maxChar, output.charCodeAt(i));
  }
  return maxChar;
}

describe('Modify Range', () => {
  describe('Globally from prototpye', () => {
    it('Should generate unicode when we expand its range', () => {
      RandExp.prototype.defaultRange.subtract(0, 126);
      RandExp.prototype.defaultRange.add(127, 65535);
      var re = new RandExp(/.{100}/);
      RandExp.prototype.defaultRange.add(0, 126);
      RandExp.prototype.defaultRange.subtract(127, 65535);
      var maxChar = genMaxChar(re);
      assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
    });
  });

  describe('From a regexp instance', () => {
    it('Should generate unicode when we expand its range', () => {
      var r = /[\d\D]{100}/;
      r.defaultRange = RandExp.prototype.defaultRange.clone();
      r.defaultRange.subtract(0, 126);
      r.defaultRange.add(127, 65535);
      var re = new RandExp(r);
      var maxChar = genMaxChar(re);
      assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
    });
  });

  describe('From a randexp instance', () => {
    it('Should generate unicode when we expand its range', () => {
      var re = new RandExp(/[\s\S]{100}/);
      var maxChar = genMaxChar(re);
      assert.ok(maxChar < 127, 'ascii characters should have been generated');
      re.defaultRange.subtract(0, 126);
      re.defaultRange.add(127, 65535);
      maxChar = genMaxChar(re);
      assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
    });

    describe('With a negated set', () => {
      it('Should still generate only ascii', () => {
        var re = new RandExp(/[^a]{100}/);
        var maxChar = genMaxChar(re);
        assert.ok(maxChar < 127, 'ascii characters should have been generated');
        re.defaultRange.subtract(0, 126);
        re.defaultRange.add(127, 65535);
        maxChar = genMaxChar(re);
        assert.ok(maxChar >= 127, 'non-ascii characters should have been generated');
      });
    });
  });
});
