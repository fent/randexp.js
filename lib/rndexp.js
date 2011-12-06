var tokenize = require('./tokenize.js')
  ,      gen = require('./gen.js')
  ,     util = require('./util.js')
  ;


RegExp.prototype.__defineGetter__('gen', function() {
  if (this._rndexp === undefined) {
    this._rndexp = tokenize(this.source, this.ignoreCase, this.multiline);
    this._max = this._max || 100;
    this._anyRndChar = this._anyRndChar || util.anyRndChar;
  }
  return gen(this._rndexp, this._max, this._anyRndChar, []);
});
