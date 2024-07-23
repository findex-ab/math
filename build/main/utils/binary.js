"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeUint8Arrays = void 0;
const mergeUint8Arrays = (arrays) => {
    const totalLength = arrays.reduce((acc, array) => acc + array.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (let array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }
    return result;
};
exports.mergeUint8Arrays = mergeUint8Arrays;
