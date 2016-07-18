/*jshint maxlen:false */
module.exports = {
  'Pattern Flags': {
    'i': {
      regexp: /hey there/i,
      desc: 'Ignore the case of alphabetic characters',
    },

    'm': {
      regexp: /hip$\nhop/m,
      desc: 'Multiline mode. Causes ^ to match beginning of line or beginning of string. Causes $ to match end of line or end of string.'
    }
  },


  'Position Matching': {
    '^': {
      regexp: /^The/,
      desc: 'Only matdches the beginning of a string.'
    },

    '$': {
      regexp: /and$/,
      desc: 'Only matches the end of a string.'
    },

    '\\b': {
      regexp: /ly\b/,
      desc: 'Matches any word boundary (test characters must exist at the beginning or end of a word within the string)'
    },

    '\\B': {
      regexp: /m\Bore/,
      desc: 'Matches any non-word boundary.'
    },

    'Bad Regexp': {
      regexp: [/a^/m, /b^/, /$c/m, /$d/, /e\bf/, /\Bg/],
      desc: 'A string that matches these regular expressions does not exist.',
      bad: true
    }
  },


  'Characters': {
    'Any character except []{}^$.|?*+()': {
      regexp: /a/,
      desc: 'All charaacters except the listed special characters match a single instane of themselves.'
    },

    '\\ (backslash) followed by any of []{}^$.|?*+()': {
      regexp: /\+/,
      desc: 'A backslash escapes special characters to suppress their special meaning.'
    },

    '\\0': {
      regexp: /nully: \0/,
      desc: 'Matches NUL character.'
    },

    '\\n': {
      regexp: /a new\nline/,
      desc: 'Matches a new line character.'
    },

    '\\f': {
      regexp: /\f/,
      desc: 'Matches a form feed character.'
    },

    '\\t': {
      regexp: /col1\tcol2\tcol3/,
      desc: 'Matches a tab character.'
    },

    '\\v': {
      regexp: /row1\vrow2/,
      desc: 'Matches a vertical tab character.'
    },

    '[\\b]': {
      regexp: /something[\b]/,
      desc: 'Matches a backspace.'
    },

    '\\XXX': {
      regexp: /\50/,
      desc: 'Matches the ASCII character expressed by the octal number XXX.'
    },

    '\\xXX': {
      regexp: /\xA9/,
      desc: 'Matches the ASCII character expressed by the hex number XX.'
    },

    '\\uFFFF': {
      regexp: /\u00A3/,
      desc: 'Matches the ASCII character expressed by the UNICODE XXXX.'
    }
  },


  'Character Sets': {
    '[xyz]': {
      regexp: [/[abcD!]/i, /[a-z]/, /[0-4]/, /[a-zA-Z0-9]/, /[\w]/, /[\d]/, /[\s]/, /[\W]/, /[\D]/, /[\S]/],
      desc: 'Matches any one character enclosed in the character set. You may use a hyphen to denote range.'
    },

    '[^xyz]': {
      regexp: [/[^AN]BC/, /[^\w]/, /[^\d]/, /[^\s]/, /[^\W]/, /[^\D]/, /[^\S]/],
      desc: 'Matches any one characer not enclosed in the character set.'
    },

    'Bad Custom Sets': {
      regexp: [/[^\W\w]/, /[^\D\d]/, /[^\S\s]/, /[]/],
      desc: 'A string that matches these regular expressions does not exist',
      bad: true
    },

    '. (Dot)': {
      regexp: /b.t/,
      desc: 'Matches any character except newline or another Unicode line terminator.'
    },

    '\\w': {
      regexp: /\w/,
      desc: 'Matches any alphanumeric character including the underscore. Equivalent to [a-zA-Z0-9].'
    },

    '\\W': {
      regexp: /\W/,
      desc: 'Matches any single non-word character. Equivalent to [^a-zA-Z0-9].'
    },

    '\\d': {
      regexp: /\d\d\d\d/,
      desc: 'Matches any single digit. Equivalent to [0-9].'
    },

    '\\D': {
      regexp: /\D/,
      desc: 'Matches any non-digit, Equivalent to [^0-9].'
    },

    '\\s': {
      regexp: /in\sbetween/,
      desc: 'Matches any single space character. Equivalent to [ \\f\\n\\r\\t\\v\\u00A0\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u2028\\u2029\\u2028\\u2029\\u202f\\u205f\\u3000].'
    },

    '\\S': {
      regexp: /\S/,
      desc: 'Matches any single non-sace character. Equivalent to [^ \\f\\n\\r\\t\\v\\u00A0\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u2028\\u2029\\u2028\\u2029\\u202f\\u205f\\u3000].'
    }
  },


  'Repetition': {
    '{x}': {
      regexp: /\d{5}/,
      desc: 'Matches exactly x occurrences of a regular expression.'
    },

    '{x,}': {
      regexp: /\s{2,}/,
      desc: 'Matches x or more occurrences of a regular expression.'
    },

    '{x,y}': {
      regexp: /\d{2,4}/,
      desc: 'Matches x to y number of occurrences of a regular expression.'
    },

    '?': {
      regexp: /a\s?b/,
      desc: 'Matches zero or one occurrences. Equivalent to {0,1}.'
    },

    '*': {
      regexp: /we*/,
      desc: 'Matches zero or more occurrences. Equivalent to {0,}.'
    },

    '+': {
      regexp: /fe+d/,
      desc: 'Matches one ore more occurrences. Equivalent to {1,}.'
    }
  },


  'Alternation & Grouping': {
    '()': {
      regexp: /(abc)+(def)/,
      desc: 'Grouping characters together to create a clause. May be nested. Also captures the desired subpattern.'
    },

    '(?:x)': {
      regexp: /(?:.d){2}/,
      desc: 'Matches x but does not capture it.'
    },

    /*
    'x(?=y)': {
      regexp: /George(?= Bush)/,
      desc: 'Positive lookahead: Matches x only if it\'s followed by y. Note that y is not included as part of the match.'
    },

    'x(?!y)': {
      regexp: /^\d(?! years)/,
      desc: 'Negative lookahead: Matches x only if it\'s NOT followed by y. Note that y is not included as part of the match.'
    },
    */

    '| (Pipe)': {
      regexp: /forever|young/,
      desc: 'Matches only one clause on either side of the pipe.'
    }
  },


  'Back References': {
    '()\\x': {
      regexp: [/(\w+)\s+\1/, /(a)(\2\1)/, /(a|b){5}\1/, /(a)(b)\1\2/],
      desc: '"\\x" (where x is a number from 1 to 9) when added to the end of a regular expression pattern allows you to back reference a subpattern within the pattern, so the value of the subpatterns is remembered and used as part of the matching.'
    }
  }
};
