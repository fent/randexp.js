var   vows = require('vows')
  , assert = require('assert')
  ;

require('../');


vows.describe('Initialize RndExp')
  .addBatch({
    'Create a regular expression': {
      'topic': function() {
        return /somethign/;
      },

      'that should have a `gen` getter': function(regexp) {
        assert.isString(regexp.gen);
      }
    }
  })
  .export(module);
