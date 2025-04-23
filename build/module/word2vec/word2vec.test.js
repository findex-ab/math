import { test } from "node:test";
import { getWordVectors, getWordVectorsV2W } from ".";
import assert from "node:assert";
test("Get Vectors", () => {
    {
        const vecs = getWordVectors("hello world");
        assert.notEqual(vecs.length, 0);
        assert(vecs.length > 0);
    }
    ;
    {
        const vecs = getWordVectors("my company");
        assert.notEqual(vecs.length, 0);
        assert(vecs.length > 0);
    }
    ;
    {
        const vecs = getWordVectorsV2W("cash");
        assert(vecs.length > 0);
    }
    ;
});
