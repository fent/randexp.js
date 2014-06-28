var ret = require('ret');
var types = ret.types;


/**
 * Returns random number in the range [a, b].
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
function randInt(a, b) {
  return a + Math.floor(Math.random() * (1 + b - a));
}


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
 * Returns subset of [a, b] if [from, to] is in it.
 *
 * @param {Number} a
 * @param {Number} b
 * @param {Number} from
 * @param {Number} to
 * @return {Object|Boolean}
 *   {Number} from
 *   {Number} to
 */
function range(a, b, from, to) {
  return a <= from && from <= b ? { from: from, to: Math.min(b, to) } :
         a <= to   && to   <= b ? { from: Math.max(a, from), to: to } :
         false;
}


/**
 * Returns true if all properties of a are equal to b.
 * a and b are arrays of objects.
 * 
 * @param {Number} a
 * @param {Number} b
 */
function deepEqual(a, b) {
  var i, l, key, obj;
  if ((l = a.length) !== b.length) return false;

  for (i = 0; i < l; i++) {
    obj = a[i];
    for (key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== b[i][key]) {
        return false;
      }
    }
  }

  return true;
}


/**
 * Returns true if negated needle set is inside of sets array.
 * Using deepEqual as comparator.
 *
 * @param {Array.<Object>} sets
 * @param {String} needle
 * @param {Boolean}
 */
function findNotSet(sets, needle) {
  for (var i = 0, l = sets.length; i < l; i++) {
    var cset = sets[i];
    if (cset.not !== needle.not && deepEqual(cset.set, needle.set)) {
      return true;
    }
  }

  return false;
}


/**
 * Returns true if character is in class set.
 *
 * @param {Object} set
 * @param {Number} code
 * @param {Boolean} ignoreCase
 * @return {Boolean}
 */
function inClass(set, code, ignoreCase) {
  var token;
  var v;
  var sets = [];
  var infLoop = false;

  for (var i = 0, l = set.length; i < l; i++) {
    token = set[i];

    switch (token.type) {
      case types.CHAR:
        v = token.value;
        if (v === code || (ignoreCase && toOtherCase(v) === code)) {
          return true;
        }
        break;

      case types.RANGE:
        // If ignoreCase is on, and alphabetic character ranges fall
        // inside this range, check against both cases.
        if (token.from <= code && code <= token.to || (ignoreCase &&
            (((v = range(97, 122, token.from, token.to)) !== false &&
              v.from <= code && code <= v.to) ||
              ((v = range(65, 90, token.from, token.to)) !== false &&
              v.from <= code && code <= v.to)))) {
          return true;
        }
        break;

      case types.SET:
        // Use these to detect an infinite loop with 2 sets
        // that cancel out each other.
        if (sets.length > 0 && findNotSet(sets, token)) {
          infLoop = true;
        } else {
          sets.push(token);
        }

        if (!infLoop &&
            inClass(token.set, code, ignoreCase) !== token.not) {
          return true;
        }
    }
  }

  return false;
}


/**
 * Determines if a character code is alphabetic and decide
 * to switch case randomly.
 *
 * @param {Number} code
 * @param {Boolean} ignoreCase
 * @return {String}
 */
function char(code, ignoreCase) {
  return String.fromCharCode(ignoreCase && Math.random() > 0.5 ?
                             toOtherCase(code) : code);
}


/**
 * Generate random string modeled after given tokens.
 *
 * @param {Object} token
 * @param {Array.<String>} groups
 * @param {Boolean} negate
 * @return {String}
 */
function gen(token, groups, negate) {
  var stack, str, n, i, l, not;

  switch (token.type) {


    case types.ROOT:
    case types.GROUP:
      if (token.notFollowedBy) { return ''; }

      // Insert placeholder until group string is generated.
      if (token.remember && token.groupNumber === undefined) {
        token.groupNumber = groups.push(null) - 1;
      }

      stack = token.options ?
        token.options[Math.floor(Math.random() * token.options.length)] :
        token.stack;

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

      // If this class is an except class, i.e. [^abc],
      // generate a random character until one that isnt in this class
      // is found.
      negate = !!negate;
      not = negate !== token.not;
      if (not) {
        while (true) {
          var c = this.anyRandChar();
          var code = c.charCodeAt(0);

          if (inClass(token.set, code, this.ignoreCase)) { continue; }
          return c;
        }

      // Otherwise, pick a random token in the class set.
      } else {
        if (token.set.length) {
          return gen.call(this,
                 token.set[Math.floor(Math.random() * token.set.length)],
                 groups, not);
        } else {
          return '';
        }
      }
      break;


    case types.RANGE:
      return char(randInt(token.from, token.to), this.ignoreCase);


    case types.REPETITION:
      // Randomly generate number between min and max.
      n = randInt(token.min,
              token.max === Infinity ? token.min + this.max : token.max);

      str = '';
      for (i = 0; i < n; i++) {
        str += gen.call(this, token.value, groups);
      }

      return str;


    case types.REFERENCE:
      return groups[token.value - 1] || '';


    case types.CHAR:
      return char(token.value, this.ignoreCase);
  }
}


/**
 * @constructor
 * @param {RegExp|String} regexp
 * @param {String} m
 */
var RandExp = module.exports = function(regexp, m) {
  if (regexp instanceof RegExp) {
    this.ignoreCase = regexp.ignoreCase;
    this.multiline = regexp.multiline;
    if (typeof regexp.max === 'number') {
      this.max = regexp.max;
    }
    if (typeof regexp.anyRandChar === 'function') {
      this.anyRandChar = regexp.anyRandChar;
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


// Returns any random character.
RandExp.prototype.anyRandChar = function() {
  return String.fromCharCode(randInt(0, 65535));
};


// Generates the random string.
RandExp.prototype.gen = function() {
  return gen.call(this, this.tokens, []);
};


// Enables use of randexp with a shorter call.
// Saves the RandExp object into the regex.
var randexp = RandExp.randexp = function(regexp, m) {
  var randexp;

  if (regexp._randexp === undefined) {
    randexp = new RandExp(regexp, m);
    regexp._randexp = randexp;
  } else {
    randexp = regexp._randexp;
    if (typeof regexp.max === 'number') {
      randexp.max = regexp.max;
    }
    if (typeof regexp.anyRandChar === 'function') {
      randexp.anyRandChar = regexp.anyRandChar;
    }
  }

  return randexp.gen();
};


// This enables sugary /regexp/.gen syntax.
RandExp.sugar = function() {
  /* jshint freeze:false */
  RegExp.prototype.gen = function() {
    return randexp(this);
  };
};
