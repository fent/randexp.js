//
// randexp
//
// Copyright (C) 2011 by Roly Fentanes (https://github.com/fent)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE. 
//



(function() {
  var types = exports.types = {
      POSITION  : 0
    , CLASS     : 2
    , RANGE     : 3
    , CLAUSE    : 6
    , REFERENCE : 7

    , INTS: '0123456789'
    , WORDS: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    , WHITESPACE: ' \f\n\r\t\v\u00A0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u2028\u2029\u202f\u205f\u3000'
  };


  //
  // All of these are private and only used by randexp
  // it's assumed that they will always be called with the correct input
  //

  const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?'
      , SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 }

  var util = exports.util = {

    // returns random character from string
    rndChar: function(str) {
      return str[Math.floor(Math.random() * str.length)];
    },


    // returns any random character
    anyRndChar: function() {
      return String.fromCharCode(util.rndInt(0, 65535));
    },


    // finds character representations in str and convert all to
    // their respective characters

    strToChars: function(str) {
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
    },


    // returns random number in the rane [a, b]
    rndInt: function(a, b) {
      return a + Math.floor(Math.random() * (1 + b - a));
    },


    // returns index of first occurance of b that is not preceeded by a
    findChar: function(str) {
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
    },


    // returns characters represented by range
    range: function(match, from, to) {
      var chars = types.WORDS;
      return chars.slice(chars.indexOf(from), chars.indexOf(to) + 1);
    },

    // changes ranges in class to characters
    classRange: function(str) {
      return str.replace(/(\w)-(\w)/g, util.range);
    },


    // returns an alphabetic string with both cases of the given char
    toBothCases: function(c) {
        var chars = c;

        // find out if c is lower or upper case
        chars += c['to' + (c === c.toLowerCase() ? 'Upper' : 'Lower') + 'Case']();

        return chars;
    },


    // adds characters of the other case based on ignoreCase
    inCaseClass: function(str, ignoreCase) {
      if (ignoreCase) {
        str = str.replace(/[a-zA-Z]/g, function(c) {
          return util.toBothCases(c);
        });

        return str;

      } else {
        return str;
      }
    },


    // if ignoreCase is on, change one character into a class
    // to allow for the other case to exist
    inCaseChar: function(c, ignoreCase) {
      if (ignoreCase && /[a-zA-Z]/.test(c)) {

        return {
            type: types.CLASS
          , chars: util.toBothCases(c)
        };

      } else {
        return c;
      }
    },


    // concactenates continous strings in array
    // if it contains one element, returns that one element
    // otherwise returns array
    flatten: function(arr) {
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
    },


    // reduces a group to a simple form
    // if its stack only has one element, make it the stack
    // if it doesn't contain a PIPE or is not to be rememebered,
    // return just its stack
    reduce: function(group) {
      if (group.stack) {
        group.stack = util.flatten(group.stack)
      } else if (group.options) {
        for (var i = 0, l = group.options.length; i < l; i++) {
          group.options[i] = util.flatten(group.options[i]);
        }
      }

      return group.options || group.group || group.value ? group : group.stack;
    },


    // gets index + 1 of next closing paranthesis in str
    // that is not cancelled out by an opening one
    nextClose: function(str) {
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
    }
  };



  // predefined objects
  const
    WORD_BOUNDARY_POSITION = {
          type: types.POSITION
        , value: 'b'
      }
  , NONWORD_BOUNDARY_POSITION = {
          type: types.POSITION
        , value: 'B'
      }
  , BEGIN_POSITION = {
        type: types.POSITION
      , value: '^'
    }
  , END_POSITION = {
        type: types.POSITION
      , value: '$'
    }

  , WORDS_CLASS = {
          type: types.CLASS
        , chars: types.WORDS
      }
  , ANTI_WORDS_CLASS = {
          type: types.CLASS
        , chars: types.WORDS
        , not: true
      }
  , INTS_CLASS = {
          type: types.CLASS
        , chars: types.INTS
      }
  , ANTI_INTS_CLASS = {
          type: types.CLASS
        , chars: types.INTS
        , not: true
      }
  , WHITESPACE_CLASS = {
          type: types.CLASS
        , chars: types.WHITESPACE
      }
  , ANTI_WHITESPACE_CLASS = {
          type: types.CLASS
        , chars: types.WHITESPACE
        , not: true
      }
  , ANY_CHAR_CLASS = {
          type: types.CLASS
        , chars: '\n'
        , not: true
      }
  ;


  // reads regex string and separates everything into tokens
  var tokenize = function(str, ignoreCase, multiline) {
    var i = 0, c,
        start = { type: types.CLAUSE, stack: []},

        // keep track of last clause and stack
        lastGroup = start,
        last = start.stack,
        groupStack = [];


    // decode a few escaped characters
    str = util.strToChars(str);


    // iterate through each character in string
    while (i < str.length) {
      c = str[i++];

      switch (c) {
        // handle escaped characters, inclues a few classes
        case '\\':
          c = str[i++]

          switch (c) {
            case 'b':
              last.push(WORD_BOUNDARY_POSITION);
              break;

            case 'B':
              last.push(NONWORD_BOUNDARY_POSITION);
              break;

            case 'w':
              last.push(WORDS_CLASS);
              break;

            case 'W':
              last.push(ANTI_WORDS_CLASS);
              break;

            case 'd':
              last.push(INTS_CLASS);
              break;

            case 'D':
              last.push(ANTI_INTS_CLASS);
              break;

            case 's':
              last.push(WHITESPACE_CLASS);
              break;

            case 'S':
              last.push(ANTI_WHITESPACE_CLASS);
              break;

            default:
              if (/\d/.test(c)) {
                last.push({
                    type: types.REFERENCE
                  , value: parseInt(c)
                });

              // escaped character
              } else {
                last.push(c);
              }
          }

          break;


        // positionals
        case '^':
            last.push(BEGIN_POSITION);
          break;

        case '$':
            last.push(END_POSITION);
          break;


        // handle classes
        case '[':
          c = str[i];

          if (c === '\\' && str.slice(i + 1).indexOf('b]') === 0) {
            i += 3;
            last.push('\u0008');

          } else {
            var not;
            if (c === '^') {
              not = true;
              i++;
            } else {
              not = false;
            }

            // get all the characters in class
            var strPart = str.slice(i)
              , l = util.findChar(strPart)
              , chars = strPart.substring(0, l)
              ;

            // increase index by length of class
            i += l + 1;
            last.push({
                type: types.CLASS
              , chars: util.inCaseClass(util.classRange(chars), ignoreCase)
              , not: not
            });
          }

          break;


        // class of any character except \n
        case '.':
          last.push(ANY_CHAR_CLASS);
          break;


        // push group onto stack
        case '(':
          c = str[i];
          var remember;

          if (c === '?') {
            c = str[i + 1];
            i += 2;

            // match only if not followed by this
            // skip
            if (c === '!') {
              i += util.nextClose(str.slice(i));
              break;
            }

            remember = false;

          } else {
            remember = true;
          }

          // create group
          var group = {
              type: types.CLAUSE
            , group: remember
            , stack: []
          };

          // insert subgroup into current group stack
          last.push(group);

          // remember the current group for when the group closes
          groupStack.push(lastGroup);

          // make this new group the current group
          lastGroup = group;
          last = group.stack;
          break;


        // pop group out of stack
        case ')':
          lastGroup = groupStack.pop();

          // check if this group has a PIPE
          // to get back the correct last stack
          last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;

          // make sure the last group in the last stack is reduced
          var lasti = last.length - 1;
          last[lasti] = util.reduce(last[lasti]);
          break;


        // use pipe character to give more choices
        case '|':

          // create array where options are if this is the first PIPE
          // in this clause
          if (!lastGroup.options) {
            lastGroup.options = [lastGroup.stack];
            delete lastGroup.stack;
          }

          // create a new stack and add to options for rest of clause
          var stack = [];
          lastGroup.options.push(stack);
          last = stack;
          break;


        // repetition
        // for every repetition, remove last element from last stack
        // then insert back a RANGE object
        // this design is chosen because there could be more than
        // one repetition symbols in a regex i.e. a?+{2,3}
        case '{':
          var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i))
            , min = parseInt(rs[1])
            , max = rs[2] ? rs[3] ? parseInt(rs[3]) : Infinity : min
            ;

          i += rs[0].length;

          var popped = last.pop();

          // if min matches max, pre-generate the output
          if (min === max) {
            for (var k = 0; k < min; k++) {
              last.push(popped);
            }

          } else {
            last.push({
                type: types.RANGE
              , min: min
              , max: max
              , value: popped
            });
          }
          break;

        case '?':
          var popped = last.pop();
          last.push({
              type: types.RANGE
            , min: 0
            , max: 1
            , value: popped
          });
          break;

        case '+':
          var popped = last.pop();
          last.push({
              type: types.RANGE
            , min: 1
            , max: Infinity
            , value: popped
          });
          break;

        case '*':
          var popped = last.pop();
          last.push({
              type: types.RANGE
            , min: 0
            , max: Infinity
            , value: popped
          });
          break;


        // default is a character that is not \[](){}?+*^$
        default:
          // if ignoreCase is on, turn alpha character into a class
          // with both lower and upper case versions of the character
          last.push(util.inCaseChar(c, ignoreCase));
      }

    }


    return util.reduce(start);
  };



  // generate random string modeled after given tokens
  var gen = function(obj, max, anyRndChar, groups) {

    // check if obj is String
    if (typeof obj === 'string') {
      return obj;
    }
    
    // check if obj is Array
    if (obj.length) {
      var str = '';

      for (var i = 0, l = obj.length; i < l; i++) {
        str += gen(obj[i], max, anyRndChar, groups);
      }

      return str;
    }


    // otherwise obj must be an Object
    switch (obj.type) {
      case types.POSITION:
        // do nothing for now
        return '';


      case types.CLASS:

        // if this class is an except class i.e. [^abc]
        // generate a random character until one that isnt in this class
        // is found
        if (obj.not) {
          while (true) {
            var c = anyRndChar();
            if (obj.chars.indexOf(c) === -1) {
              return c;
            }
          }

        // otherwise, generate a random character from the class
        } else {
          return util.rndChar(obj.chars);
        }


      case types.RANGE:
        var n = util.rndInt(obj.min,
                  obj.max === Infinity ? obj.min + max : obj.max)
          , str = ''
          ;

        for (var i = 0; i < n; i++) {
          str += gen(obj.value, max, anyRndChar, groups);
        }

        return str;


      case types.CLAUSE:
        // check if this clause is between a pipe
        if (obj.options) {
          var n = util.rndInt(0, obj.options.length - 1);
          return gen(obj.options[n], max, anyRndChar, groups);


        // otherwise this must be a group
        } else {
          var value = gen(obj.stack, max, anyRndChar, groups);
          groups.push(value);
          return value;
        }


      case types.REFERENCE:
        return groups[obj.value - 1];
    }
  };


  // add randexp to global RegExp prototype
  // this enables sugary //.gen syntax
  RegExp.prototype.__defineGetter__('gen', function() {
    if (this._randexp === undefined) {
      this._randexp = tokenize(this.source, this.ignoreCase, this.multiline);
      this._max = this._max || 100;
      this._anyRndChar = this._anyRndChar || util.anyRndChar;
    }
    return gen(this._randexp, this._max, this._anyRndChar, []);
  });
})();
