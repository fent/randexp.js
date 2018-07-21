import * as DRange from "drange";
import * as RandExp from "randexp";

new RandExp(/[a-z]{6}/).gen(); // $ExpectType string

new RandExp(/[a-z]{6}/, "i").gen(); // $ExpectType string

new RandExp("[a-z]{6}").gen(); // $ExpectType string

new RandExp("[a-z]{6}", "i").gen(); // $ExpectType string

RandExp.randexp(/[a-z]{6}/); // $ExpectType string

RandExp.randexp(/[a-z]{6}/, "i"); // $ExpectType string

RandExp.randexp("[a-z]{6}"); // $ExpectType string

RandExp.randexp("[a-z]{6}", "i"); // $ExpectType string

RandExp.sugar(); // $ExpectType void

new RandExp(/[a-z]{6}/).defaultRange; // $ExpectType DRange

// $ExpectType (from: number, to: number) => number
RandExp.prototype.randInt = (from: number, to: number): number =>
    Math.floor(Math.random() * (to - from + 1)) + from;

// $ExpectType (from: number, to: number) => number
new RandExp(/[a-z]{6}/).randInt = (from: number, to: number): number =>
    Math.floor(Math.random() * (to - from + 1)) + from;

let maxLength: number;

maxLength = 100;

RandExp.prototype.max = maxLength; // $ExpectType number

new RandExp(/[a-z]{6}/).max = maxLength; // $ExpectType number
