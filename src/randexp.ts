import { default as ret, Set, Char, Range, Root, Tokens, types } from "ret";
import DRange = require("drange");

export interface RandRegExp extends RegExp {
  max: number;
  defaultRange: DRange;
  randInt(a: number, b: number): number;
  gen(): string;
}

export default class RandExp {
  public ignoreCase: boolean;
  public multiline: boolean;
  public max: number;

  private _range: DRange;
  private tokens: Root;

  constructor(regexp: RegExp | string, m?: string) {
    this._setDefaults(regexp);
    if (regexp instanceof RegExp) {
      this.ignoreCase = regexp.ignoreCase;
      this.multiline = regexp.multiline;
      regexp = regexp.source;
    } else if (typeof regexp === "string") {
      this.ignoreCase = !!(m && m.indexOf("i") !== -1);
      this.multiline = !!(m && m.indexOf("m") !== -1);
    } else {
      throw Error("Expected a regexp or string");
    }

    this.tokens = ret(regexp);
  }

  /**
   * Checks if some custom properties have been set for this regexp.
   */
  _setDefaults(regexp: RandExp | RegExp | string) {
    // When a repetitional token has its max set to Infinite,
    // randexp won't actually generate a random amount between min and Infinite
    // instead it will see Infinite as min + 100.
    this.max =
      typeof regexp !== "string" && (regexp as RandExp).max != null
        ? (regexp as RandExp).max
        : RandExp.prototype.max != null
          ? RandExp.prototype.max
          : 100;

    // This allows expanding to include additional characters
    // for instance: RandExp.defaultRange.add(0, 65535);
    this.defaultRange =
      typeof regexp !== "string" && (regexp as RandExp).defaultRange
        ? (regexp as RandExp).defaultRange
        : this.defaultRange.clone();

    if (typeof regexp !== "string" && (regexp as RandExp).randInt) {
      this.randInt = (regexp as RandExp).randInt;
    }
  }

  /**
   * Generates the random string.
   */
  gen() {
    return this._gen(this.tokens, []);
  }

  /**
   * Generate random string modeled after given tokens.
   */
  _gen(token: Tokens, groups: (string | null)[]): string {
    switch (token.type) {
      case types.ROOT:
      case types.GROUP:
        if (token.type === types.GROUP) {
          // Ignore lookaheads for now.
          if (token.followedBy || token.notFollowedBy) {
            return "";
          }

          // Insert placeholder until group string is generated.
          if (token.remember && (token as any).groupNumber === undefined) {
            (token as any).groupNumber = groups.push(null) - 1;
          }
        }

        let stack = token.options
          ? this._randSelect(token.options)
          : token.stack!;

        let str = "";
        for (let i = 0, l = stack.length; i < l; i++) {
          str += this._gen(stack[i], groups);
        }

        if (token.type === types.GROUP && token.remember) {
          groups[(token as any).groupNumber] = str;
        }
        return str;

      case types.POSITION:
        // Do nothing for now.
        return "";

      case types.SET:
        const expandedSet = this._expand(token);
        if (!expandedSet.length) {
          return "";
        }
        return String.fromCodePoint(
          expandedSet.index(this.randInt(0, expandedSet.length - 1)),
        );

      case types.REPETITION: {
        // Randomly generate number between min and max.
        const randNumber = this.randInt(
          token.min,
          token.max === Infinity ? token.min + this.max : token.max,
        );

        let str = "";
        for (let i = 0; i < randNumber; i++) {
          str += this._gen(token.value, groups);
        }

        return str;
      }

      case types.REFERENCE:
        return groups[token.value - 1] || "";

      case types.CHAR:
        const code =
          this.ignoreCase && this._randBool()
            ? this._toOtherCase(token.value)
            : token.value;
        return String.fromCodePoint(code);
    }
  }

  /**
   * If code is alphabetic, converts to other case.
   * If not alphabetic, returns back code.
   */
  _toOtherCase(code: number) {
    return (
      code +
      (97 <= code && code <= 122 ? -32 : 65 <= code && code <= 90 ? 32 : 0)
    );
  }

  /**
   * Randomly returns a true or false value.
   */
  _randBool() {
    return !this.randInt(0, 1);
  }

  /**
   * Randomly selects and returns a value from the array.
   */
  _randSelect<T>(arr: T[]) {
    return arr[this.randInt(0, arr.length - 1)];
  }

  /**
   * Expands a token to a DiscontinuousRange of characters which has a
   * length and an index function (for random selecting).
   */
  _expand(token: Set | Char | Range) {
    if (token.type === types.CHAR) {
      return new DRange(token.value);
    } else if (token.type === types.RANGE) {
      return new DRange(token.from, token.to);
    } else {
      let drange = new DRange();
      for (let i = 0; i < token.set.length; i++) {
        let subrange = this._expand(token.set[i]);
        drange.add(subrange);
        if (this.ignoreCase) {
          for (let j = 0; j < subrange.length; j++) {
            let code = subrange.index(j);
            let otherCaseCode = this._toOtherCase(code);
            if (code !== otherCaseCode) {
              drange.add(otherCaseCode);
            }
          }
        }
      }
      if (token.not) {
        return this.defaultRange.clone().subtract(drange);
      } else {
        return this.defaultRange.clone().intersect(drange);
      }
    }
  }

  /**
   * Randomly generates and returns a number between a and b (inclusive).
   */
  randInt(a: number, b: number) {
    return a + Math.floor(Math.random() * (1 + b - a));
  }

  /**
   * Default range of characters to generate from.
   */
  get defaultRange() {
    return (this._range = this._range || new DRange(32, 126));
  }

  set defaultRange(range) {
    this._range = range;
  }

  /**
   * Enables use of randexp with a shorter call.
   */
  static randexp(regexp: RegExp | string, m?: string) {
    let randexp;
    if (typeof regexp === "string") {
      regexp = new RegExp(regexp, m);
    }

    interface MyRegExp extends RegExp {
      _randexp: RandExp;
    }

    if ((regexp as MyRegExp)._randexp === undefined) {
      randexp = new RandExp(regexp, m);
      (regexp as MyRegExp)._randexp = randexp;
    } else {
      randexp = (regexp as MyRegExp)._randexp;
      randexp._setDefaults(regexp);
    }
    return randexp.gen();
  }

  /**
   * Enables sugary /regexp/.gen syntax.
   */
  static sugar() {
    (RegExp.prototype as any).gen = function (this: RegExp) {
      return RandExp.randexp(this);
    };
  }
}

module.exports = RandExp;
