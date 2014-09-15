//protected helper class
function _SubRange(low, high) {
    this.low = low;
    this.high = high;
    this.length = 1 + high - low;
}

_SubRange.prototype.overlaps = function (range) {
    return !(this.high < range.low || this.low > range.high);
};

//returns inclusive combination of _SubRanges as a _SubRange
_SubRange.prototype.add = function (range) {
    return this.overlaps(range) && new _SubRange(Math.min(this.low, range.low), Math.max(this.high, range.high));
};

//returns subtractive combination of _SubRanges as an array of _SubRanges (there's a case where subtraction divides it in 2)
_SubRange.prototype.subtract = function (range) {
    if (!this.overlaps(range)) return false;
    if (range.low <= this.low && range.high >= this.high) return [];
    if (range.low > this.low && range.high < this.high) return [new _SubRange(this.low, range.low - 1), new _SubRange(range.high + 1, this.high)];
    if (range.low <= this.low) return [new _SubRange(range.high + 1, this.high)];
    return [new _SubRange(this.low, range.low - 1)];
};


_SubRange.prototype.toString = function () {
    if (this.low == this.high) return this.low.toString();
    return this.low + '-' + this.high;
};




function RangeSet(a, b) {
    this.ranges = [];
    this.length = 0;
    if (a !== undefined) this.add(a, b);
}

RangeSet.prototype.add = function (a, b) {
    if (b === undefined) b = a;
    var range = new _SubRange(a, b);
    var new_ranges = [];
    var i = 0;
    while (i < this.ranges.length && !range.overlaps(this.ranges[i])) {
        new_ranges.push(this.ranges[i]);
        i++;
    }
    while (i < this.ranges.length && range.overlaps(this.ranges[i])) {
        range = range.add(this.ranges[i]);
        i++;
    }
    new_ranges.push(range);
    while (i < this.ranges.length) {
        new_ranges.push(this.ranges[i]);
        i++;
    }
    this.ranges = new_ranges;
    this.update_length();
};

RangeSet.prototype.subtract = function (a, b) {
    if (b === undefined) b = a;
    var range = new _SubRange(a, b);
    var new_ranges = [];
    var i = 0;
    while (i < this.ranges.length && !range.overlaps(this.ranges[i])) {
        new_ranges.push(this.ranges[i]);
        i++;
    }
    while (i < this.ranges.length && range.overlaps(this.ranges[i])) {
        new_ranges = new_ranges.concat(this.ranges[i].subtract(range));
        i++;
    }
    while (i < this.ranges.length) {
        new_ranges.push(this.ranges[i]);
        i++;
    }
    this.ranges = new_ranges;
    this.update_length();
};

RangeSet.prototype.update_length = function () {
    this.length = 0;
    for (var i = 0; i < this.ranges.length; i++) {
        this.length += this.ranges[i].length;
    }
};

RangeSet.prototype.index = function (index) {
    var i = 0;
    while (i < this.ranges.length && this.ranges[i].length <= index) {
        index -= this.ranges[i].length;
        i++;
    }
    if (i >= this.ranges.length) return null;
    return this.ranges[i].low + index;
};


RangeSet.prototype.toString = function () {
    return '[' + this.ranges.join(', ') + '] length:' + this.length;
};

module.exports = RangeSet;
