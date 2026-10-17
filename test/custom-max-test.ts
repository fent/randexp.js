import assert from "assert";
import RandExp, { RandRegExp } from "..";

describe("Modify max", () => {
  it("Should generate infinite repetitionals with new max", () => {
    let re = new RandExp(/.*/);
    re.max = 0;
    let output = re.gen();
    assert.equal(output, "");

    let r = /.*/ as RandRegExp;
    r.max = 0;
    output = RandExp.randexp(r);
    assert.equal(output, "");

    const originalMax = RandExp.prototype.max;
    after(() => {
      RandExp.prototype.max = originalMax;
    });
    RandExp.prototype.max = 0;
    re = new RandExp(/.*/);
    output = re.gen();
    assert.equal(output, "");
  });
});
