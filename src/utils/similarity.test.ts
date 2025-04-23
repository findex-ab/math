import { it, test } from "node:test";
import assert from "node:assert";
import { cosineStringSimilarity, stringSimilarity } from "./string";
import { range } from "./array";

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

  await it("google word 2 vec works (cosine)", () => {
    const a = "money";
    const b = "can";
    const sim = cosineStringSimilarity(a, b, {
      useGoogleWord2Vec: true,
    });
    assert(sim > 0.0);
  });

  await it("google word 2 vec works (cosine)", () => {
    const words = [
      'hello',
      'microsoft',
      'fun',
      'funny',
      'car',
      'volvo',
      'doctor',
      'program',
      'application',
      'Microsoft',
      'Car',
      'Hennes & Mauritz',
      "software",
      "Software",
      "color",
      "red",
      "green",
      "blue",
      "colour",
      "fish",
      "news",
      "article",
      "terms",
      "number",
      "math",
      "calculator",
      "calculate",
      "image",
      "picture",
      "photo",
      "tesla",
      "vehicle",
      "legal",
      "computer",
      "icon",
      "logo",
      "brand",
      "watch",
      "rolex",
      "clock",
      "logic",
      "pay",
      "payment",
      "payments",
      "money",
      "price",
      "cost",
      "cash",
      "beauty",
      "beautiful",
      "makeup",
      "boy",
      "girl",
      "woman",
      "man",
      "he",
      "she",
      "they",
      "them",
      "investment",
      "invested",
      "invest",
      "investing",
      "video"
    ].sort(() => Math.random() - Math.random());

    for (const word of words) {
      const scored = words.filter(it => it !== word).map(it => ({
        word: it,
        score: cosineStringSimilarity(word, it, { useGoogleWord2Vec: true })
      })).sort((a, b) => b.score - a.score);

      console.log(word, JSON.stringify(scored.slice(0, 3), undefined, 2));
    }
  });
})
