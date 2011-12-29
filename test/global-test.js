var assert = require('assert');

require('..').sugar();


describe('Initialize RandExp with global()', function() {
  describe('Create a regular expression', function() {
    var regexp = /[a-z]ff something/;

    it('Should have a `gen` getter', function() {
      assert(typeof (regexp.gen) === 'string');
    });

    it('Regexp should match generated string', function() {
      assert(regexp.test(regexp.gen));;
    });
  });
});
