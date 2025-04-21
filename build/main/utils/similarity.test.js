"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const string_1 = require("./string");
(0, node_test_1.test)("String similarity", async () => {
    await (0, node_test_1.it)("Is similar (cosine)", () => {
        const a = "hello";
        const b = "hello";
        const sim = (0, string_1.cosineStringSimilarity)(a, b);
        (0, node_assert_1.default)(sim > 0.999999);
    });
    await (0, node_test_1.it)("Is not similar (cosine)", () => {
        const a = "hello";
        const b = "horse";
        const sim = (0, string_1.cosineStringSimilarity)(a, b);
        (0, node_assert_1.default)(sim < 0.9);
    });
    await (0, node_test_1.it)("Is similar", () => {
        const a = "quick";
        const b = "brown";
        const sim = (0, string_1.stringSimilarity)(a, b, { naiveInfluence: 0.0, cosineInfluence: 0.5, jaroWinklerInfluence: 0.5 });
        (0, node_assert_1.default)(sim < 0.5);
    });
});
