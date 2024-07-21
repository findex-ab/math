"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mix = void 0;
const vector_1 = require("../vector");
const etc_1 = require("./etc");
const is_1 = require("./is");
const mix = (a, b, f) => {
    if ((0, vector_1.isVector)(a) && (0, vector_1.isVector)(b)) {
        const v1 = a;
        const v2 = b;
        return v1.lerp(v2, f);
    }
    if ((0, is_1.isNumber)(a) && (0, is_1.isNumber)(b)) {
        return (0, etc_1.lerp)(a, b, f);
    }
    throw new Error(`mix() cannot be used with types ${typeof a} or ${typeof b}`);
};
exports.mix = mix;
