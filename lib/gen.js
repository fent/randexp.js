var types = require('./types.js')
  , util = require('./util.js')
  ;


// returns random string based on token stack
var gen = module.exports = function(obj, max, anyRndChar, groups) {

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
