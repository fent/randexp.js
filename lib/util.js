var types = require('ret').types;


/**
 * Iterate through token lists and returns a new list of tokens
 * that either match or not. It's possible that this will return
 * an empty list if a bad regular expression is given.
 *
 * @param {Array.<Object>} prevTokens
 * @param {Array.<Object>} nextTokens
 * @param {Boolean} match
 */
function addTokenList(prevTokens, nextTokens, add) {
  console.log('add', prevTokens, nextTokens, add);
  var union = [];

  var minLength = Math.min(prevTokens.length, nextTokens.length);
  for (var i = 0; i < minLength; i++) {
    var prevToken = prevTokens[i];
    var nextToken = nextTokens[i];
    switch (prevToken.type) {
      case types.SET:
      case types.REPETITION:
      case types.REFERENCE:
      case types.CHAR:
    }
  }

  return union;
}


/**
 * Looks at groups that have either `followedBy` or `notFollowedBy`,
 * combines those groups with tokens in front that match.
 *
 * @param {Array.<Object>} tokens
 * @return {Array.<Object>}
 */
exports.preprocess = function(tokens) {
  var good = [];

  // Traverse tokens in reverse so that tokens in front, which will
  // be used to compare `followedBy` and `notFollowedBy` groups,
  // are already processed.
  for (var i = tokens.length - 1; i >= 0; i--) {
    var token = tokens[i];
    if (token.type === types.GROUP || token.type === types.ROOT) {
      if (token.followedBy || token.notFollowedBy) {
        if (token.options) {
          token.options = token.options.map(exports.preprocess);
          good = [{
            type: types.GROUP,
            options: token.options.map(function(stack) {
              return addTokenList(stack, good, !!token.followedBy);
            }),
          }];
        } else if (token.stack) {
          token.stack = exports.preprocess(token.stack);
          good = addTokenList(token.stack, good, !!token.followedBy);
        }
      } else {
        good.unshift(exports.preprocessGroup(token));
      }

    } else {
      good.unshift(token);
    }
  }
  return good;
};


/**
 * @param {Object} token
 * @return {Object}
 */
exports.preprocessGroup = function(token) {
  if (token.options) {
    token.options = token.options.map(exports.preprocess);
  } else if (token.stack) {
    token.stack = exports.preprocess(token.stack);
  }
  return token;
};
