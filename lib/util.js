//
// This file contains many utility functions used by rndexp
// All of these are private and only used by rndexp
// it's assumed that they will always be called with the correct input
//


var types = exports.types = require('./types.js')


// returns random character from string
exports.rndChar = function(str) {
  return str[Math.floor(Math.random() * str.length)];
};


// returns any random character
exports.anyRndChar = function() {
  return String.fromCharCode(exports.rndInt(0, 65535));
};


// finds character representations in str and convert all to
// their respective characters
const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?'
    , SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 }

exports.strToChars = function(str) {
  var chars_regex = /\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]^?])|([0tnvfr]))/g;
  str = str.replace(chars_regex, function(s, a16, b16, c8, dctrl, eslsh) {
    var code = a16   ? parseInt(a16, 16) :
               b16   ? parseInt(b16, 16) :
               c8    ? parseInt(c8,   8) :
               dctrl ? CTRL.indexOf(dctrl)   :
               eslsh ? SLSH[eslsh] : undefined;
    
    var c;
    if (code !== undefined) {
      c = String.fromCharCode(code);
      // escape special regex characters
      c = c.replace(/[[\]{}^$.|?*+()]/g, function(n) {
        return '\\' + n;
      });
    } else {
      c = '\\' + eslsh;
    }

    return c;
  });

  return str;
};


// returns random number in the rane [a, b]
exports.rndInt = function(a, b) {
  return a + Math.floor(Math.random() * (1 + b - a));
};


// returns index of first occurance of b that is not preceeded by a
exports.findChar = function(str) {
  var a = '\\'
    , b = ']'
    , offset = 0
    ;

  while (true) {
    var i = str.indexOf(b);
    if (str[i - 1] === a) {
      str = str.slice(++i);
      offset += i;
    } else {
      return offset + i;
    }
  }
};


// returns characters represented by range
var range = function(match, from, to) {
  var chars = types.WORDS;
  return chars.slice(chars.indexOf(from), chars.indexOf(to) + 1);
};

// changes ranges in class to characters
exports.classRange = function(str) {
  return str.replace(/(\w)-(\w)/g, range);
};


// returns an alphabetic string with both cases of the given char
var toBothCases = function(c) {
    var chars = c;

    // find out if c is lower or upper case
    chars += c['to' + (c === c.toLowerCase() ? 'Upper' : 'Lower') + 'Case']();

    return chars;
};


// adds characters of the other case based on ignoreCase
exports.inCaseClass = function(str, ignoreCase) {
  if (ignoreCase) {
    str = str.replace(/[a-zA-Z]/g, function(c) {
      return toBothCases(c);
    });

    return str;

  } else {
    return str;
  }
};


// if ignoreCase is on, change one character into a class
// to allow for the other case to exist
exports.inCaseChar = function(c, ignoreCase) {
  if (ignoreCase && /[a-zA-Z]/.test(c)) {

    return {
        type: types.CLASS
      , chars: toBothCases(c)
    };

  } else {
    return c;
  }
};


// concactenates continous strings in array
// if it contains one element, returns that one element
// otherwise returns array
exports.flatten = function(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    if (typeof arr[i] === 'string') {
      var k = i + 1;
      while (true) {
        var el = arr[k];
        if (typeof el === 'string') {
          arr[i] += el;
          arr.splice(k, 1);
        } else {
          break;
        }
      }
    }
  }

  return arr.length === 1 ? arr[0] : arr;
};


// reduces a group to a simple form
// if its stack only has one element, make it the stack
// if it doesn't contain a PIPE or is not to be rememebered,
// return just its stack
exports.reduce = function(group) {
  if (group.stack) {
    group.stack = exports.flatten(group.stack)
  } else if (group.options) {
    for (var i = 0, l = group.options.length; i < l; i++) {
      group.options[i] = exports.flatten(group.options[i]);
    }
  }

  return group.options || group.group || group.value ? group : group.stack;
};


// gets index + 1 of next closing paranthesis in str
// that is not cancelled out by an opening one
exports.nextClose = function(str) {
  var n = 0;

  for (var i = 0, l = str.length; i < l; i++) {
    var c = str[i];

    switch (c) {
      case ')':
        if (n === 0) {
          return i + 1;
        }
        n--;
        break;

      case '(':
        n++;
        break;

      // skip escaped characters
      case '\\':
        i++;
        break;

    }
  }
};
