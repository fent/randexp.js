var assert = require('assert-diff');
var ret    = require('ret');
var types  = ret.types;
var util   = require('../lib/util');


describe('Preprocess tokens', function() {
	describe('No groups', function() {
		it('Returned tokens match original', function() {
			var original = ret('hello');
			var result = util.preprocessGroup(original);
			assert.deepEqual(original, result);
		});
	});

	describe('Group without followed by', function() {
		it('Returned tokens match original', function() {
			var original = ret('a(b)');
			var result = util.preprocessGroup(original);
			assert.deepEqual(original, result);
		});
	});

	describe('Followed by', function() {
		it('Returns token that match the ones following', function() {
			var original = ret('(?=a).');
			var result = util.preprocessGroup(original);
			assert.deepEqual(result.stack, [{
				type: types.CHAR,
				value: 'a'.charCodeAt(0),
			}]);
		});
	});
});
