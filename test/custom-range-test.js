var assert = require('assert');

var RandExp = require('..');


describe('Modify Range', function() {
  it('Should generate unicode when we expand its range', function() {
    var re = new RandExp(/.{100}/);
    re.defaultRange.add(0,65535);
    var output = re.gen();
    var max_char = 0;
    for (var i = 0; i < output.length; i++) {
      max_char = Math.max(max_char, output.charCodeAt(i));
    }
    assert.ok(max_char > 127, 'non-ascii characters should have been generated');

    re = new RandExp(/.{100}/);
    output = re.gen();
    max_char = 0;
    for (var i = 0; i < output.length; i++) {
      max_char = Math.max(max_char, output.charCodeAt(i));
    }
    assert.ok(max_char <= 127, 'ascii characters should have been generated (there shouldn\'t be side-effects');
  });
});
