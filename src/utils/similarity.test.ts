import { it, test } from "node:test";
import assert from "node:assert";
import { cosineStringSimilarity, stringSimilarity } from "./string";

test("String similarity", async () => {
  await it("Is similar (cosine)", () => {
    const a = "hello";
    const b = "hello";
    const sim = cosineStringSimilarity(a, b);
    assert(sim > 0.999999);
  });

  await it("Is not similar (cosine)", () => {
    const a = "hello";
    const b = "horse";
    const sim = cosineStringSimilarity(a, b);
    assert(sim < 0.9);
  });

  await it("Is similar", () => {
    const a = "quick";
    const b = "brown";
    const sim = stringSimilarity(a, b, { naiveInfluence: 0.0, cosineInfluence: 0.5, jaroWinklerInfluence: 0.5 });
    assert(sim < 0.5);
  });
})
