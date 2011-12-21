# randexp.js [![Build Status](https://secure.travis-ci.org/fent/randexp.js.png)](http://travis-ci.org/fent/randexp.js)

randexp will generate a random string that matches a given RegExp Javascript object.


# Usage
```js
require('randexp'); // must require if using node

// supports grouping and piping
/hello+ (world|to you)/.gen;
// => hellooooooooooooooooooo world

// classes and ranges and references
/<([a-z]\w{0,20})>foo<\1>/.gen;
// => <m5xhdg>foo<m5xhdg>

// wildcard class
/random stuff: .+/.gen;
// => random stuff: 湐箻ໜ䫴␩⶛㳸長���邓蕲뤀쑡篷皇硬剈궦佔칗븛뀃匫鴔事좍ﯣ⭼ꝏ䭍詳蒂䥂뽭

// ignore case
/xxx xtreme dragon warrior xxx/i.gen;
// => xxx xtReME dRAGON warRiOR xXX
```


# Motivation
Regular expressions are used in every language, every programmer is familiar with them. Regex can be used to easily express complex strings. What better way to generate a random string than with a tool you can easily use to express the string any way you want?

Thanks to [String-Random](http://search.cpan.org/~steve/String-Random-0.22/lib/String/Random.pm) for giving me the idea to make this in the first place and [randexp](https://github.com/benburkert/randexp) for the nifty little `.gen` syntax.


# Limitations
I wish I could say randexp is guaranteed to generate a string that will always match the given regex. But ONE limitation prevents me. Positionals. You can make a regex object that is guaranteed to never match any string. Such as

```js
/a^b/m
```

That will never match any string because it will never be next to the beginning of the expression or a new line character. For now, positionals (`^$\\b\\B`) are ignored. In the above case, randexp will generate the string `ab`.

Classes like the `.` character will match anything except a new line. In this case, a character with a random char code between 0 and 65535 will be generated. If you want to overwrite this function you can do

```js
var r = /./;
r._anyRandChar = function() {
  return the char you want here;
};
```

Ranges like `*`, `+`, and `{3,}` have an infinite max range. In this case, randexp looks at its min and adds 100 to it to get a useable max value. If you want to use another int other than 100 you can do

```js
var r = /(hi)*/;
r._max = 1000000;
```


# Install
### Node.js

    npm install randexp

### Browser

Download the [minified version](http://github.com/fent/randexp.js/raw/master/build/randexp.min.js).


# Tests
Tests are written with [vows](http://vowsjs.org/)

```bash
npm test
```

I should really write browser tests too, sometime.


# License
MIT
