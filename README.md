# randexp.js [![Build Status](https://secure.travis-ci.org/fent/randexp.js.png)](http://travis-ci.org/fent/randexp.js)

randexp will generate a random string that matches a given RegExp Javascript object.


# Usage
```js
var RandExp = require('randexp');

// supports grouping and piping
new RandExp(/hello+ (world|to you)/).gen();
// => hellooooooooooooooooooo world

// sets and ranges and references
new RandExp(/<([a-z]\w{0,20})>foo<\1>/).gen();
// => <m5xhdg>foo<m5xhdg>

// wildcard
new RandExp(/random stuff: .+/).gen();
// => random stuff: 湐箻ໜ䫴␩⶛㳸長���邓蕲뤀쑡篷皇硬剈궦佔칗븛뀃匫鴔事좍ﯣ⭼ꝏ䭍詳蒂䥂뽭

// ignore case
new RandExp(/xxx xtreme dragon warrior xxx/i).gen();
// => xxx xtReME dRAGON warRiOR xXX

// dynamic regexp shortcut
new RandExp('(sun|mon|tue|wednes|thurs|fri|satur)day', 'i');
// is the same as
new RandExp(new RegExp('(sun|mon|tue|wednes|thurs|fri|satur)day', 'i'));
```

If you're only going to use `gen()` once with a regexp and want slightly shorter syntax for it

```js
var randexp = require('randexp').randexp;

randexp(/[1-6]/); // 4
randexp('great|good( job)?|excellent'); // great
```

If you miss the old syntax

```js
require('randexp').sugar();

/yes|no|maybe|i don't know/.gen(); // maybe
```


# Motivation
Regular expressions are used in every language, every programmer is familiar with them. Regex can be used to easily express complex strings. What better way to generate a random string than with a tool you can easily use to express the string any way you want?

Thanks to [String-Random](http://search.cpan.org/~steve/String-Random-0.22/lib/String/Random.pm) for giving me the idea to make this in the first place and [randexp](https://github.com/benburkert/randexp) for the sweet `.gen()` syntax.


# Negated Character Sets
Sets like the `.` character will match anything except a new line. In this case, a character with a random char code between 0 and 65535 will be generated. If you want to overwrite this function you can change the `anyRandChar` function in the randexp object.

```js
var randexp = new RandExp(/./);
randexp.anyRandChar = function() {
  return 'c';
};
```

If using `RandExp.sugar()`

```js
var regexp = /./;
regexp.anyRandChar = function() {
  return 'c';
};
```

# Infinite Repetitionals

Repetitional tokens such as `*`, `+`, and `{3,}` have an infinite max range. In this case, randexp looks at its min and adds 100 to it to get a useable max value. If you want to use another int other than 100 you can change the `max` property in the randexp object.

```js
var randexp = new RandExp(/no{1,}/);
randexp.max = 1000000;
```

With `RandExp.sugar()`

```js
var regexp = /(hi)*/;
regexp.max = 1000000;
```

# Bad Regular Expressions
There are some regular expressions which can never match any string.

* Ones with badly placed positionals such as `/a^/` and `/$c/m`. Randexp will ignore positional tokens.

* Back references to non-existing groups like `/(a)\1\2/`. Randexp will ignore those references, returning an empty string for them. If the group exists only after the reference is used such as in `/\1 (hey)/`, it will too be ignored.

* Custom negated character sets with two sets inside that cancel each other out. Example: `/[^\w\W]/`. If you give this to randexp, it will ignore both set tokens.

Other cancelling out character sets like `/[^\D]/` are bad too. These are the same as `/[\d]/`. Except it will be slow in generating a matching string because it will first generate a random character and then check if it's in the set inside. It will take a while to randomly generate an integer out of 65535 characters.


# Install
### Node.js

    npm install randexp

### Browser

Download the [minified version](https://github.com/fent/randexp.js/releases) from the latest release.


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```


# License
MIT
