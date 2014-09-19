var ret = require('ret');
var DRange = require('discontinuous-range');
var types = ret.types;


/**
 * If code is alphabetic, converts to other case.
 * If not alphabetic, returns back code.
 *
 * @param {Number} code
 * @return {Number}
 */
function toOtherCase(code) {
  return code + (97 <= code && code <= 122 ? -32 :
                 65 <= code && code <= 90  ?  32 : 0);
}


/**
 * @constructor
 * @param {RegExp|String} regexp
 * @param {String} m
 */
var RandExp = module.exports = function(regexp, m) {
  this.defaultRange = this.defaultRange.clone();
  if (regexp instanceof RegExp) {
    this.ignoreCase = regexp.ignoreCase;
    this.multiline = regexp.multiline;
    if (typeof regexp.max === 'number') {
      this.max = regexp.max;
    }
    regexp = regexp.source;

  } else if (typeof regexp === 'string') {
    this.ignoreCase = m && m.indexOf('i') !== -1;
    this.multiline = m && m.indexOf('m') !== -1;
  } else {
    throw new Error('Expected a regexp or string');
  }

  this.tokens = ret(regexp);
};


// When a repetitional token has its max set to Infinite,
// randexp won't actually generate a random amount between min and Infinite
// instead it will see Infinite as min + 100.
RandExp.prototype.max = 100;


// Generates the random string.
RandExp.prototype.gen = function() {
  return gen.call(this, this.tokens, []);
};


// Enables use of randexp with a shorter call.
RandExp.randexp = function(regexp, m) {
  return (new RandExp(regexp, m)).gen();
};


// This enables sugary /regexp/.gen syntax.
RandExp.sugar = function() {
  /* jshint freeze:false */
  RegExp.prototype.gen = function() {
    return RandExp.randexp(this);
  };
};

// This allows expanding to include additional characters
// for instance: RandExp.defaultRange.add(0, 65535);
RandExp.prototype.defaultRange = new DRange(32, 126);






/**
 * Randomly generates and returns a number between a and b (inclusive).
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
RandExp.prototype.randInt = function(a, b) {
  return a + Math.floor(Math.random() * (1 + b - a));
};


/**
 * Randomly returns a true or false value.
 *
 * @return {Boolean}
 */
RandExp.prototype.randBool = function() {
  return !this.randInt(0, 1);
};


/**
 * Randomly selects and returns a value from the array.
 *
 * @param {Array.<Object>} arr
 * @return {Object}
 */
RandExp.prototype.randSelect = function(arr) {
  if (arr instanceof DRange) {
    return arr.index(this.randInt(0, arr.length - 1));
  }
  return arr[this.randInt(0, arr.length - 1)];
};


/**
 * Determines if a character code is alphabetic and decide
 * to switch case randomly.
 *
 * @param {Number} code
 * @param {Boolean} ignoreCase
 * @return {String}
 */
RandExp.prototype.char = function(code, ignoreCase) {
  code = ignoreCase && this.randBool() ? toOtherCase(code) : code;
  return String.fromCharCode(code);
};


/**
 * expands a token to a DiscontinuousRange of characters which has a 
 * length and an index function (for random selecting)
 *
 * @param {Object} token
 * @return {DiscontinuousRange}
 */
RandExp.prototype.expand = function(token) {
  if (token.type === ret.types.CHAR) return new DRange(token.value);
  if (token.type === ret.types.RANGE) return new DRange(token.from, token.to);
  if (token.type === ret.types.SET) {
    var drange = new DRange();
    for (var i = 0; i < token.set.length; i++) {
      drange.add(this.expand(token.set[i]));
    }
    if (token.not) {
      return this.defaultRange.clone().subtract(drange);
    } else {
      return drange;
    }
  }
  throw new Error('unexpandable token type: ' + token.type);
};


/**
 * Generate random string modeled after given tokens.
 *
 * @param {Object} token
 * @param {Array.<String>} groups
 * @return {String}
 */
function gen(token, groups) {
  var stack, str, n, i, l;

  switch (token.type) {


    case types.ROOT:
    case types.GROUP:
      if (token.notFollowedBy) { return ''; }

      // Insert placeholder until group string is generated.
      if (token.remember && token.groupNumber === undefined) {
        token.groupNumber = groups.push(null) - 1;
      }

      stack = token.options ? this.randSelect(token.options) : token.stack;

      str = '';
      for (i = 0, l = stack.length; i < l; i++) {
        str += gen.call(this, stack[i], groups);
      }

      if (token.remember) {
        groups[token.groupNumber] = str;
      }
      return str;


    case types.POSITION:
      // Do nothing for now.
      return '';


    case types.SET:

      var expanded_set = this.expand(token);
      if (!expanded_set.length) return '';
      return this.char(this.randSelect(expanded_set), this.ignoreCase);

    case types.RANGE:
      return this.char(this.randInt(token.from, token.to), this.ignoreCase);


    case types.REPETITION:
      // Randomly generate number between min and max.
      n = this.randInt(token.min,
              token.max === Infinity ? token.min + this.max : token.max);

      str = '';
      for (i = 0; i < n; i++) {
        str += gen.call(this, token.value, groups);
      }

      return str;


    case types.REFERENCE:
      return groups[token.value - 1] || '';


    case types.CHAR:
      return this.char(token.value, this.ignoreCase);
  }
}


