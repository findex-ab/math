import { test } from "node:test";
import { getWordVectors } from ".";
import assert from "node:assert";

test("Get Vectors", () => {
  {
    const vecs = getWordVectors("hello world");
    assert.notEqual(vecs.length, 0);
    assert(vecs.length > 0);
  };
  {
    const vecs = getWordVectors("my company");
    assert.notEqual(vecs.length, 0);
    assert(vecs.length > 0);
  };
})
