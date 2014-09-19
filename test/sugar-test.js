var assert = require('assert');

require('..').sugar();


describe('Initialize RandExp with global()', function() {
  describe('Create a regular expression', function() {
    var regexp = /.ff something+/;

    it('Should have a `gen` getter', function() {
      assert.equal(true, typeof (regexp.gen) === 'function');
    });

    it('Regexp should match generated string', function() {
      // test if it works more than once
      assert.equal(true, regexp.test(regexp.gen()));;
      assert.equal(true, regexp.test(regexp.gen()));;
    });

    describe('Change its max property', function() {
      it('Generates new sized repetitionals', function() {
        regexp.max = 0;
        assert.equal(regexp.gen().substr(4), 'something');
      });
    });

  });
});
