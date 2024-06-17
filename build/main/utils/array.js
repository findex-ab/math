"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftLeft = exports.insertAt = exports.shiftRight = exports.range = void 0;
const range = (n) => Array.from(Array(n).keys());
exports.range = range;
const shiftRight = (arr, index, insert, replace = false) => {
    const copy = [...arr];
    if (!replace) {
        for (let i = arr.length - 1; i > index - 1; i--) {
            copy[i + 1] = copy[i];
        }
    }
    if (typeof insert !== 'undefined') {
        if (Array.isArray(insert)) {
            const next = copy;
            next[index] = insert;
            return next.flat();
        }
        else {
            copy[index] = insert;
        }
    }
    return copy;
};
exports.shiftRight = shiftRight;
const insertAt = (arr, index, insert, replace = false) => (0, exports.shiftRight)(arr, index, insert, replace);
exports.insertAt = insertAt;
const shiftLeft = (arr, index) => {
    const copy = [...arr];
    for (let i = index; i < arr.length - 1; i++) {
        copy[i] = copy[i + 1];
    }
    return copy.slice(0, copy.length - 1);
};
exports.shiftLeft = shiftLeft;
