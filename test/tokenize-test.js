var   vows = require('vows')
  , assert = require('assert')
  ,  types = require('../').types
  ;

require('../');


var t = function(r) {
  r.gen;
  return r._randexp;
};

vows.describe('Tokenize')
  .addBatch({
    'No special characters': {
      topic: t(/walnuts/),

      'Tokenize returns a string': function(t) {
        assert.isString(t);
        assert.equal(t, 'walnuts');
      },
      
      'with ignoreCase': {
        topic: t(/foo!/i),
        'Array with both cases for each character in string': function(t) {
          assert.isArray(t);
          assert.deepEqual(t[0], {
            type: types.CLASS,
            chars: 'fF'
          });
          assert.deepEqual(t[1], {
            type: types.CLASS,
            chars: 'oO'
          });
          assert.deepEqual(t[2], {
            type: types.CLASS,
            chars: 'oO'
          });
          assert.equal(t[3], '!');
        }
      }
    },


    'Positionals': {
      '^ and $ in': {
        'one liner': {
          topic: t(/^yes$/),
          'Array with positionals and string': function(t) {
            assert.isArray(t);
            assert.deepEqual(t[0], {
              type: types.POSITION,
              value: '^'
            });
            assert.equal(t[1], 'yes');
            assert.deepEqual(t[2], {
              type: types.POSITION,
              value: '$'
            });
          }
        },

        'multi line string with multiline': {
          'on': {
          },

          'off': {
          }
        }
      },

      '\\b and \\B': {
        topic: t(/\bbeginning/),
        'Array with positional and string': function(t) {
          assert.isArray(t);
          assert.deepEqual(t[0], {
            type: types.POSITION,
            value: 'b'
          });
          assert.equal(t[1], 'beginning');
        }
      }
    },


    'Predefined classes': {
      'that represent a typical date format': {
        topic: t(/\w \d:\d:\d/),

        'Words class': function(t) {
          assert.deepEqual(t[0], {
            type: types.CLASS,
            chars: types.WORDS
          });
        },

        'Followed by a space': function(t) {
          assert.equal(t[1], ' ');
        },

        'Integer classes': function(t) {
          assert.deepEqual(t[2], {
            type: types.CLASS,
            chars: types.INTS
          });
          assert.deepEqual(t[4], {
            type: types.CLASS,
            chars: types.INTS
          });
          assert.deepEqual(t[6], {
            type: types.CLASS,
            chars: types.INTS
          });
        },

        'Colons inbetween': function(t) {
          assert.equal(t[3], ':');
          assert.equal(t[5], ':');
        }
      }
    },


    'Custom classes': {
      'topic': t(/[$!a-z123] thing [^0-9]/),

      'Class contains all characters': function(t) {
        assert.isObject(t[0]);
        assert.deepEqual(t[0], {
          type: types.CLASS,
          chars: '$!abcdefghijklmnopqrstuvwxyz123',
          not: false
        });
      },

      'String in middle of returned array': function(t) {
        assert.isString(t[1]);
        assert.equal(t[1],  ' thing ');
      },

      'Anti class contains integer range': function(t) {
        assert.isObject(t[2]);
        assert.deepEqual(t[2], {
          type: types.CLASS,
          chars: '0123456789',
          not: true
        });
      }
    },


    '| (Pipe)': {
      topic: t(/foo|bar/),

      'Tokenize returns clause object': function(t) {
        assert.isObject(t);
        assert.equal(t.type, types.CLAUSE);
      },

      'Two options available are strings': function(t) {
        assert.isArray(t.options);
        assert.equal(t.options.length, 2);
        assert.equal(t.options[0], 'foo');
        assert.equal(t.options[1], 'bar');
      }
    },


    'Group': {
      'with no special characters': {
        topic: t(/hey (there)/),

        'Returns array': function(t) {
          assert.isArray(t);
        },

        'First element is string': function(t) {
          assert.isString(t[0]);
          assert.equal(t[0], 'hey ');
        },

        'Second element is group object': function(t) {
          assert.isObject(t[1]);
          assert.deepEqual(t[1], {
            type: types.CLAUSE,
            group: true,
            stack: 'there'
          });
        }
      },

      'that is not remembered': {
        topic: t(/(?:loner)/),

        'Does not return the group object': function(t) {
          assert.isString(t);
          assert.equal(t, 'loner');
        }
      },

      'matched previous clause if not followed by this': {
        topic: t(/what(?!ever) man/),

        'Returns only the first part before the group': function(t) {
          assert.isString(t);
          assert.equal(t, 'what man');
        }
      },

      'with subgroup': {
        topic: t(/a(b(c(?:d))!fg) @_@/i),

        'Returns array': function(t) {
          assert.isArray(t);
        },

        'First element is \'a\' class': function(t) {
          assert.isObject(t[0]);
          assert.deepEqual(t[0], {
            type: types.CLASS,
            chars: 'aA'
          });
        },

        'Second element is group with subgroups': function(t) {
          assert.isObject(t[1]);
          assert.deepEqual(t[1], {
            type: types.CLAUSE,
            group: true,
            stack: [
              {type: types.CLASS, chars: 'bB' },

              // subgroup
              {
                type: types.CLAUSE,
                group: true,
                stack: [
                  { type: types.CLASS, chars: 'cC' },
                  { type: types.CLASS, chars: 'dD' }
                ]
              },

              '!',
              { type: types.CLASS, chars: 'fF' },
              { type: types.CLASS, chars: 'gG' },
            ]
          });
        },

        'Third is a string': function(t) {
          assert.isString(t[2]);
          assert.equal(t[2], ' @_@');
        }
      }
    },


    'Custom range with': {
      'exact amount': {
        topic: t(/(?:pika){2}/),

        'Output already generated': function(t) {
          assert.isString(t);
          assert.equal(t, 'pikapika');
        }
      },

      'minimum amount only': {
        topic: t(/node{6,}/),

        'Returns array': function(t) {
          assert.isArray(t);
        },

        'First element is string': function(t) {
          assert.isString(t[0]);
          assert.equal(t[0], 'nod');
        },

        'Second is range object': function(t) {
          assert.isObject(t[1]);
          assert.deepEqual(t[1], {
            type: types.RANGE,
            min: 6,
            max: Infinity,
            value: 'e'
          });
        }
      },

      'both minimum and maximum': {
        topic: t(/pika\.\.\. chu{3,20}!{1,2}/),

        'Return array': function(t) {
          assert.isArray(t);
        },

        'First element is string': function(t) {
          assert.isString(t[0]);
          assert.equal(t[0], 'pika... ch');
        },
        
        'Second element is range': function(t) {
          assert.isObject(t[1]);
          assert.deepEqual(t[1], {
            type: types.RANGE,
            min: 3,
            max: 20,
            value: 'u'
          });
        },

        'Third element is another range': function(t) {
          assert.isObject(t[2]);
          assert.deepEqual(t[2], {
            type: types.RANGE,
            min: 1,
            max: 2,
            value: '!'
          });
        }
      }
    },


    'Predefined ranges': {
      '? (Optional)': {
        topic: t(/come here (?:now)?/),

        'Returns array': function(t) {
          assert.isArray(t);
        },

        'First element is string': function(t) {
          assert.isString(t[0]);
          assert.equal(t[0], 'come here ');
        },

        'Second element is optional': function(t) {
          assert.isObject(t[1]);
          assert.deepEqual(t[1], {
            type: types.RANGE,
            min: 0,
            max: 1,
            value: 'now'
          });
        }
      },

      '+ (At least one)': {
        topic: t(/(no)+/),

        'Returns range object': function(t) {
          assert.isObject(t);
          assert.deepEqual(t, {
            type: types.RANGE,
            min: 1,
            max: Infinity,
            value: {
              type: types.CLAUSE,
              group: true,
              stack: 'no'
            }
          });
        }
      },

      '* (Any amount)': {
        topic: t(/XF*D/),

        'Returns array': function(t) {
          assert.isArray(t);
        },

        'First element is X': function(t) {
          assert.isString(t[0]);
          assert.equal(t[0], 'X');
        },

        'Second element is range object': function(t) {
          assert.isObject(t[1]);
          assert.deepEqual(t[1], {
            type: types.RANGE,
            min: 0,
            max: Infinity,
            value: 'F'
          });
        },

        'Third element is D': function(t) {
          assert.isString(t[2]);
          assert.equal(t[2], 'D');
        }
      }
    },


    'Reference': {
      topic: t(/<(\w+)>\w*<\1>/),

      'Returns array': function(t) {
        assert.isArray(t);
      },

      'First element is <': function(t) {
        assert.isString(t[0]);
        assert.equal(t[0], '<');
      },

      'Second element is group object with range and class': function(t) {
        assert.isObject(t[1]);
        assert.deepEqual(t[1], {
          type: types.CLAUSE,
          group: true,
          stack: {
            type: types.RANGE,
            min: 1,
            max: Infinity,
            value: { type: types.CLASS, chars: types.WORDS }
          }
        });
      },

      'Third element is >': function(t) {
        assert.isString(t[2]);
        assert.equal(t[2], '>');
      },

      'Fourth element is range of words class': function(t) {
        assert.isObject(t[3]);
        assert.deepEqual(t[3], {
          type: types.RANGE,
          min: 0,
          max: Infinity,
          value: { type: types.CLASS, chars: types.WORDS }
        });
      },

      'Fifth element is <': function(t) {
        assert.isString(t[4]);
        assert.equal(t[4], '<');
      },

      'Sixth element is a reference object': function(t) {
        assert.isObject(t[5]);
        assert.deepEqual(t[5], {
          type: types.REFERENCE,
          value: 1
        });
      },

      'Seventh element is >': function(t) {
        assert.isString(t[6]);
        assert.equal(t[6], '>');
      }
    }
  })
  .export(module);
