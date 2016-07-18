var assert  = require('assert');
var RandExp = require('..');


describe('Modify Range', function() {
  it('Should generate unicode when we expand its range', function() {
    var re = new RandExp(/.{100}/);
    re.defaultRange.subtract(0, 126);
    re.defaultRange.add(127, 65535);
    var output = re.gen();
    var maxChar = 0;
    for (var i = 0; i < output.length; i++) {
      maxChar = Math.max(maxChar, output.charCodeAt(i));
    }
    assert.ok(maxChar > 127, 'non-ascii characters should have been generated');

    var r = /.{100}/;
    r.defaultRange = RandExp.prototype.defaultRange.clone();
    r.defaultRange.subtract(0, 126);
    r.defaultRange.add(127, 65535);
    output = RandExp.randexp(r);
    maxChar = 0;
    for (i = 0; i < output.length; i++) {
      maxChar = Math.max(maxChar, output.charCodeAt(i));
    }
    assert.ok(maxChar > 127, 'non-ascii characters should have been generated');

    re = new RandExp(/.{100}/);
    output = re.gen();
    maxChar = 0;
    for (i = 0; i < output.length; i++) {
      maxChar = Math.max(maxChar, output.charCodeAt(i));
    }
    assert.ok(maxChar <= 127, 'ascii characters should have been generated');
  });
});
