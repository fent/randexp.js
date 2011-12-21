var ret = require('ret')
  , types = ret.types


// returns random number in the rane [a, b]
var randInt = function(a, b) {
  return a + Math.floor(Math.random() * (1 + b - a));
};

// returns any random character
var anyRandChar = function() {
  return String.fromCharCode(randInt(0, 65535));
};

// if code is alphabetic, converts to other case
// if not alphabetic, returns back code
var toOtherCase = function(code) {
  return code + (97 <= code && code <= 122 ? -32 :
                 65 <= code && code <= 90  ?  32 : 0)
};

// returns subset of [a, b] if [from, to] is in it
var range = function(a, b, from, to) {
  return a <= from && from <= b ? { from: from, to: Math.min(b, to) } :
         a <= to   && to   <= b ? { from: Math.max(a, from), to: to } :
         false;
};

// returns true if character is in class set
var inClass = function(set, code, ignoreCase) {
  for (var i = 0, l = set.length; i < l; i++) {
    var token = set[i];

    switch (token.type) {
      case types.CHAR:
        var v = token.value;
        if (v === code || (ignoreCase && toOtherCase(v) === code)) {
          return true;
        }
        break;

      case types.RANGE:
        var r;
        if (token.from <= code && code <= token.to || (ignoreCase &&
            (((r = range(97, 122, token.from, token.to)) !== false &&
              r.from <= code && code <= r.to) ||
              ((r = range(65, 90, token.from, token.to)) !== false &&
              r.from <= code && code <= r.to)))) {
          return true;
        }
        break;

      case types.CLASS:
        if (inClass(token.set, code, ignoreCase)) {
          return true;
        }
    }
  }

  return false;
};

// determines if a character code is alphabetic and decide
// to switch case randomly
var char = function(code, ignoreCase) {
  return String.fromCharCode(ignoreCase && Math.random() > 0.5 ?
                             toOtherCase(code) : code);
};


// generate random string modeled after given tokens
var gen = function(token, groups) {
  switch (token.type) {


    case types.ROOT:
    case types.GROUP:
      if (token.notFollowedBy) { return ''; }

      // insert placeholder until group string is generated
      if (token.remember) {
        var groupNumber = groups.push(true) - 1;
      }

      var stack = token.options ?
          token.options[Math.floor(Math.random() * token.options.length)] :
          token.stack;

      var str = '';
      for (var i = 0, l = stack.length; i < l; i++) {
        str += gen.call(this, stack[i], groups);
      }

      if (token.remember) { groups[groupNumber] = str; }
      return str;
      break;


    case types.POSITION:
      // do nothing for now
      return '';


    case types.CLASS:

      // if this class is an except class i.e. [^abc]
      // generate a random character until one that isnt in this class
      // is found
      if (token.not) {
        while (true) {
          var c = this._anyRandChar()
            , code = c.charCodeAt(0)

          if (inClass(token.set, code, this.ignoreCase)) { continue; }
          return c;
        }

      // otherwise, pick a random token in the class set
      } else {
        return gen.call(this,
               token.set[Math.floor(Math.random() * token.set.length)]);
      }


    case types.RANGE:
      return char(randInt(token.from, token.to), this.ignoreCase);
      break;


    case types.REPETITION:
      // randomly generate number between min and max
      var n = randInt(token.min,
              token.max === Infinity ? token.min + this._max : token.max)
        , str = ''

      for (var i = 0; i < n; i++) {
        str += gen.call(this, token.value, groups);
      }

      return str;


    case types.REFERENCE:
      return groups[token.value - 1];


    case types.CHAR:
      return char(token.value, this.ignoreCase);
  }
};


// add randexp to global RegExp prototype
// this enables sugary //.gen syntax
RegExp.prototype.__defineGetter__('gen', function() {
  if (this._randexp === undefined) {
    this._ret = ret(this.source);
    this._max = this._max || 100;
    this._anyRandChar = this._anyRandChar || anyRandChar;
  }
  return gen.call(this, this._ret, []);
});
