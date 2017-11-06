const assert = require('assert');

require('..').sugar();


describe('Initialize RandExp with global()', () => {
  describe('Create a regular expression', () => {
    var regexp = /.ff something+/;

    it('Should have a `gen` getter', () => {
      assert.equal(true, typeof (regexp.gen) === 'function');
    });

    it('Regexp should match generated string', () => {
      // test if it works more than once
      assert.equal(true, regexp.test(regexp.gen()));
      assert.equal(true, regexp.test(regexp.gen()));
    });

    describe('Change its max property', () => {
      it('Generates new sized repetitionals', () => {
        regexp.max = 0;
        assert.equal(regexp.gen().substr(4), 'something');
      });
    });

  });
});
