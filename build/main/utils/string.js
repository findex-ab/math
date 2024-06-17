"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringRemoveAt = exports.stringInsertAt = void 0;
const array_1 = require("./array");
const stringInsertAt = (str, index, substr) => {
    return (0, array_1.insertAt)(Array.from(str), index, substr).map(it => it || '').join('');
};
exports.stringInsertAt = stringInsertAt;
const stringRemoveAt = (str, index) => {
    return (0, array_1.shiftLeft)(Array.from(str), index).map(it => it || '').join('');
};
exports.stringRemoveAt = stringRemoveAt;
