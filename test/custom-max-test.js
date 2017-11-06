const assert  = require('assert');
const RandExp = require('..');


describe('Modify max', () => {
  it('Should generate infinite repetitionals with new max', () => {
    var re = new RandExp(/.*/);
    re.max = 0;
    var output = re.gen();
    assert.equal(output, '');

    var r = /.*/;
    r.max = 0;
    output = RandExp.randexp(r);
    assert.equal(output, '');

    after(() => {
      delete RandExp.prototype.max;
    });
    RandExp.prototype.max = 0;
    re = new RandExp(/.*/);
    output = re.gen();
    assert.equal(output, '');
  });
});
