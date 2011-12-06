var   vows = require('vows')
  , assert = require('assert')
  ,  types = require('../').types
  ,   util = require('../').util
  ;


vows.describe('rndChar')
  .addBatch({
    'Get random character from string': {
      'topic': function() {
        var str = 'abcdefg',
            arr = [];

        for (var i = 0; i < 10; i++) {
          arr.push(util.rndChar(str));
        }
        return arr;
      },

      'only abcdefg in generated characters array': function(arr) {
        var str = 'abcdefg';

        for (var i = 0; i < arr.length; i++) {
          assert.isTrue(str.indexOf(arr[i]) !== -1);
        }
      }
    }
  })
  .export(module);


vows.describe('anyRndChar')
  .addBatch({
    'Generate 100 random characters': {
      'topic': function() {
        var arr = [];

        for (var i = 0; i < 100; i++) {
          arr.push(util.anyRndChar());
        }

        return arr;
      },

      'Their char code is in range [0, 65535]': function(arr) {
        for (var i = 0, l = arr.length; i < l; i++) {
          var code = arr[i].charCodeAt(0);
          assert.isTrue(code >= 0);
          assert.isTrue(code <= 65535);
        }
      }
    }
  })
  .export(module);


vows.describe('strToChars')
  .addBatch({
    'Convert escaped chars in str to their unescaped versions': {
      'topic': function() {
        return util.strToChars(
          '\\xFF hellow \\u00A3 \\50 there \\cB \\n \\w');
      },

      'Returned string has converted characters': function(str) {
        assert.equal(str, 
          '\xFF hellow \u00A3 \\( there  \n \\w');
      }
    }
  })
  .export(module);


vows.describe('rndInt')
  .addBatch({
    'generate a random number between 5 and 25': {
      'topic': function() {
        var arr = [];

        for (var i = 0; i < 100; i++) {
          arr.push(util.rndInt(5, 25));
        }
        return arr;
      },

      'only numbers between [5, 25] in array': function(arr) {
        for (var i = 0; i < arr.length; i++) {
          var n = arr[i];
          assert.isTrue(n >= 5);
          assert.isTrue(n <= 25);
        }
      }
    }
  })
  .export(module);


vows.describe('findChar')
  .addBatch({
    'Find correct index in string': {
      'with only the closing bracket': {
        'topic': function() {
          return util.findChar('abcd]e0234');
        },
        
        'index is correct': function(i) {
          assert.equal(i, 4);
        }
      },

      'with one bracket preceeded by a backslash': {
        'topic': function() {
          return util.findChar('abcd\\]e0234]');
        },
        
        'index is correct': function(i) {
          assert.equal(i, 11);
        }
      }
    }
  })
  .export(module);


vows.describe('classRange')
  .addBatch({
    'Get range from a-z': {
      'topic': function() {
        return util.classRange('a-z');
      },

      'returns all characters': function(topic) {
        assert.equal(topic, 'abcdefghijklmnopqrstuvwxyz');
      }
    },

    'Get range from 0-9': {
      'topic': function() {
        return util.classRange('0-9');
      },

      'returns all characters': function(topic) {
        assert.equal(topic, '0123456789');
      }
    },

    'Get hex range': {
      'topic': function() {
        return util.classRange('0-9A-F')
      },

      'returns all characters': function(topic) {
        assert.equal(topic, '0123456789ABCDEF');
      }
    },

    'Get octal range': {
      'topic': function() {
        return util.classRange('octal0-7')
      },

      'returns all characters': function(topic) {
        assert.equal(topic, 'octal01234567');
      }
    },

    'Use a string with no ranges': {
      'topic': function() {
        return util.classRange('hello world!')
      },

      'return the same string': function(topic) {
        assert.equal(topic, 'hello world!');
      }
    }
  })
  .export(module);


vows.describe('inCaseClass')
  .addBatch({
    'str with ignoreCase': {
      'off': {
        'topic': function() {
          return util.inCaseClass('abcdefg', false);
        },
        
        'returns back the same str': function(topic) {
          assert.equal(topic, 'abcdefg');
        }
      },

      'on': {
        'topic': function() {
          return util.inCaseClass('abcdefg123$ LOL', true);
        },
        
        'returns back the str with both cases injected': function(topic) {
          assert.equal(topic, 'aAbBcCdDeEfFgG123$ LlOoLl');
        }
      }
    }
  })
  .export(module);


vows.describe('inCaseChar')
  .addBatch({
    'Alphabetic character with ignoreCase': {
      'off': {
        'topic': function() {
          return util.inCaseChar('a', false);
        },
        
        'returns back the same character': function(topic) {
          assert.equal(topic, 'a');
        }
      },

      'on': {
        'topic': function() {
          return util.inCaseChar('b', true);
        },
        
        'returns back a class with both cases': function(topic) {
          assert.deepEqual(topic, {
              type: types.CLASS
            , chars: 'bB'
          });
        }
      }
    },

    'Non-alphabetic character with ignoreCase': {
      'off': {
        'topic': function() {
          return util.inCaseChar('0', false);
        },
        
        'returns back the same character': function(topic) {
          assert.equal(topic, '0');
        }
      },

      'on': {
        'topic': function() {
          return util.inCaseChar('$', true);
        },
        
        'returns back the same character': function(topic) {
          assert.equal(topic, '$');
        }
      }
    }
  })
  .export(module);


vows.describe('flatten')
  .addBatch({
    'Empty array': {
      'topic': function() {
        return util.flatten([]);
      },

      'Returns same empty array': function(arr) {
        assert.isArray(arr);
        assert.equal(arr.length, 0);
      }
    },

    'Array with one element': {
      'topic': function() {
        return util.flatten(['one']);
      },

      'Returns the one element': function(arr) {
        assert.isString(arr);
        assert.deepEqual(arr, 'one');
      }
    },

    'Array with all strings': {
      'topic': function() {
        return util.flatten(['f', 'o', 'o']);
      },

      'Returns concactenated string of each element in array': function(s) {
        assert.isString(s);
        assert.equal(s, 'foo');
      }
    },

    'Array with some strings': {
      'topic': function() {
        return util.flatten(['f', 'o', 'o', {}, 'bar', 3, 'hello', 'world']);
      },

      'Returns array with string parts concactenated': function(arr) {
        assert.isArray(arr);
        assert.deepEqual(arr, ['foo', {}, 'bar', 3, 'helloworld']);
      }
    }
  })
  .export(module);


vows.describe('reduce')
  .addBatch({
    'Stack included with': {
      'one element': {
        'in a remembered group': {
          'topic': function() {
            return util.reduce({
              stack: ['foo'],
              group: true
            });
          },

          'Get back single element in place of stack and group': function(topic) {
            assert.deepEqual(topic, {
              stack: 'foo',
              group: true
            });
          }
        },

        'in a non-remembered group': {
          'topic': function() {
            return util.reduce({
              stack: ['foo']
            });
          },

          'Get back first element of stack': function(topic) {
            assert.deepEqual(topic, 'foo');
          }
        }
      },

      'more than one element': {
        'in a remembered group': {
          'topic': function() {
            return util.reduce({
              stack: ['foo', 'bar'],
              group: true
            });
          },

          'Get back same stack and group': function(topic) {
            assert.deepEqual(topic, {
              stack: 'foobar',
              group: true
            });
          }
        },

        'in a non-remembered group': {
          'topic': function() {
            return util.reduce({
              stack: ['hello', 2, 'world']
            });
          },

          'Get back just the stack': function(topic) {
            assert.deepEqual(topic, ['hello', 2, 'world']);
          }
        }
      }
    },

    'PIPE group': {
      'topic': function() {
        return util.reduce({
          options: [['a', 'b'], ['hello world'], ['foo', {}]]
        });
      },

      'Get back entire group': function(topic) {
        assert.deepEqual(topic, { options: ['ab', 'hello world', ['foo', {}]] });
      }
    }
  })
  .export(module);


vows.describe('nextClose')
  .addBatch({
    'String with only one closing paranthesis': {
      'topic': function() {
        return util.nextClose('obviously) it\'s here');
      },

      'Get first matching closing paranthesis': function(i) {
        assert.equal(i, 10);
      }
    },

    'One more paranthesis group': {
      'topic': function() {
        return util.nextClose('foo (bar) baz)');
      },

      'Skip the group': function(i) {
        assert.equal(i, 14);
      }
    },

    'Escaped paranthesis': {
      'topic': function() {
        return util.nextClose('foo \\(bar) baz)');
      },

      'Skip the group': function(i) {
        assert.equal(i, 10);
      }
    },

    'Several paranthesis groups': {
      'topic': function() {
        return util.nextClose('() (a(aa))) ))');
      },

      'Get last paranthesis that closes non-existant group': function(i) {
        assert.equal(i, 11);
      }
    }
  })
  .export(module);
