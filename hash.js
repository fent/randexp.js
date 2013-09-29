// thank you CD Sanchez from StackOerflow for this HashSearch function
window.HashSearch = (function() {
  var self = {};
  var params = {};
  var hashStr = window.location.hash;
  hashStr = hashStr.substring(1, hashStr.length);
  var hashArray = hashStr.split('&');

  for (var i = 0; i < hashArray.length; i++) {
    var ss = hashArray[i];
    if (ss === '') { continue; }
    var keyVal = ss.split('=');
    var value = typeof keyVal[1] !== 'undefined' ? unescape(keyVal[1]) : true;
    params[unescape(keyVal[0])] = value;
  }

  self.set = function(key, value) {
    params[key] = value;
    self.push();
  };

  self.remove = function(key) {
    delete params[key];
    self.push();
  };

  self.get = function(key) {
    return params[key];
  };

  self.keyExists = function(key) {
    return params.hasOwnProperty(key);
  };

  var timeoutSet = false;
  function updateHash() {
    timeoutSet = false;
    var hashBuilder = [];

    for (var key in params) if (params.hasOwnProperty(key)) {
      var ss = escape(key); // escape(undefined) == "undefined"
      var value = params[key];
      if (typeof value !== 'boolean') {
        ss += '=' + escape(value);
      }
      hashBuilder.push(ss);
    }

    window.location.hash = hashBuilder.join('&');
  }

  self.push = function() {
    if (timeoutSet) { return; }
    timeoutSet = true;
    setTimeout(updateHash);
  };

  return self;
})();
