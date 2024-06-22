"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = exports.chunkify = exports.unique = exports.uniqueBy = exports.shiftLeft = exports.insertAt = exports.shiftRight = exports.range = void 0;
const range = (n) => (n <= 0 ? [] : Array.from(Array(n).keys()));
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
const uniqueBy = (arr, key) => {
    const nextArr = [];
    try {
        const getId = (item, k) => {
            return typeof k === 'string' ? item[k] : k(item);
        };
        for (const item of arr) {
            const id = getId(item, key);
            const count = nextArr.filter((it) => getId(it, key) === id).length;
            if (count > 0)
                continue;
            nextArr.push(item);
        }
    }
    catch (e) {
        console.error('uniqueBy() failed.');
        console.error(e);
    }
    return nextArr;
};
exports.uniqueBy = uniqueBy;
const unique = (arr) => [...Array.from(new Set(arr))];
exports.unique = unique;
const chunkify = (arr, chunkSize = 2) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const part = arr.slice(i, i + chunkSize);
        result.push(part);
    }
    return result;
};
exports.chunkify = chunkify;
const join = (array, options) => {
    if (array.length === 0)
        return [];
    if (!options.prefix && !options.suffix)
        return array;
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (options.prefix) {
            const item = options.prefix(i);
            if (item !== null) {
                result.push(item);
            }
        }
        result.push(array[i]);
        if (options.suffix && i < array.length - 1) {
            const item = options.suffix(i);
            if (item !== null) {
                result.push(item);
            }
        }
    }
    return result;
};
exports.join = join;
