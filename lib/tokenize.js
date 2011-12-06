var types = require('./types.js')
  , util = require('./util.js')
  ;


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
module.exports = function(str, ignoreCase, multiline) {
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
