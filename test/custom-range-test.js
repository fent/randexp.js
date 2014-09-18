var assert = require('assert');

var RandExp = require('..');


describe('Modify Range', function() {
  it('Should generate unicode when we expand its range', function() {
    RandExp.defaultRange.add(0,65535);
    var output = RandExp.randexp(/.{100}/);
    var max_char = 0;
    for (var i = 0; i < output.length; i++) {
      max_char = Math.max(max_char, output.charCodeAt(i));
    }
    assert.ok(max_char > 127, 'non-ascii characters should have been generated');
    RandExp.defaultRange.subtract(0, 65535);
    RandExp.defaultRange.add(32, 126);
  });
});
