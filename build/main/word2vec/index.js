"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordVectorsCustom = exports.getWordVectors = void 0;
const merges_json_1 = __importDefault(require("../data/merges.json"));
const vectors_json_1 = __importDefault(require("../data/vectors.json"));
const vectors_json_2 = __importDefault(require("../data/vectors.json"));
const array_1 = require("../utils/array");
const idLookup = vectors_json_2.default;
const getId = (content) => {
    if (content.length === 1)
        return content.charCodeAt(0);
    const m = merges_json_1.default;
    const id = m[content];
    if (typeof id === 'number')
        return id;
    return -1;
};
const getIds = (content) => {
    const list = idLookup[content];
    if (list && list.length > 0)
        return list;
    const id = getId(content);
    if (id > 0)
        return [id];
    const points = Array.from(content).map(it => it.charCodeAt(0));
    const pairs = (0, array_1.chunkify)(points, 2);
    return pairs.map(([a, b]) => {
        const key = `${a},${b}`;
        const id = getId(key);
        return (id > 0 ? [id] : [a, b]).flat();
    }).flat();
};
const getWordVectors = (content) => {
    const vecs = vectors_json_1.default;
    const ids = getIds(content);
    const idVectors = ids.map((id) => {
        return vecs[id + ''] || [];
    }).filter(it => !!it && it.length > 0);
    return idVectors;
};
exports.getWordVectors = getWordVectors;
const getWordVectorsCustom = (content, vecs) => {
    if (!content)
        return [];
    if (content.length <= 0)
        return [];
    const lower = content.toLowerCase();
    if (vecs[content])
        return [vecs[content]];
    if (vecs[lower])
        return [vecs[lower]];
    const half = Math.round(content.length / 2);
    const left = content.slice(0, half);
    const right = content.slice(half, content.length);
    if (vecs[left] && vecs[right]) {
        return [vecs[left], vecs[right]];
    }
    if (vecs[left])
        return [vecs[left]];
    if (vecs[right])
        return [vecs[right]];
    const leftLower = content.slice(0, half).toLowerCase();
    const rightLower = content.slice(half, content.length).toLowerCase();
    if (vecs[leftLower] && vecs[rightLower]) {
        return [vecs[leftLower], vecs[rightLower]];
    }
    if (vecs[leftLower])
        return [vecs[leftLower]];
    if (vecs[rightLower])
        return [vecs[rightLower]];
    if (content.includes(' ')) {
        const parts = content.split(' ');
        return parts.map((part) => {
            return vecs[part] || [];
        }).filter(it => it.length > 0);
    }
    const pairs = (0, array_1.chunkify)(Array.from(lower), 2).map(it => it.join(''));
    return pairs.map((pair) => {
        return vecs[pair] || [];
    }).filter(it => it.length > 0);
};
exports.getWordVectorsCustom = getWordVectorsCustom;
