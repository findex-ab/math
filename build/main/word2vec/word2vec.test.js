"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const _1 = require(".");
const node_assert_1 = __importDefault(require("node:assert"));
(0, node_test_1.test)("Get Vectors", () => {
    {
        const vecs = (0, _1.getWordVectors)("hello world");
        node_assert_1.default.notEqual(vecs.length, 0);
        (0, node_assert_1.default)(vecs.length > 0);
    }
    ;
    {
        const vecs = (0, _1.getWordVectors)("my company");
        node_assert_1.default.notEqual(vecs.length, 0);
        (0, node_assert_1.default)(vecs.length > 0);
    }
    ;
    {
        const vecs = (0, _1.getWordVectorsV2W)("cash");
        (0, node_assert_1.default)(vecs.length > 0);
    }
    ;
});
