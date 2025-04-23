"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringSimilarity = exports.cosineStringSimilarity = exports.naiveStringSimilarity = exports.levenshteinSimilarity = exports.levDistNormalized = exports.levDist = exports.jaroWinklerSimilarity = exports.stringRemoveAt = exports.stringInsertAt = void 0;
const word2vec_1 = require("../word2vec");
const array_1 = require("./array");
const etc_1 = require("./etc");
const stringInsertAt = (str, index, substr) => {
    return (0, array_1.insertAt)(Array.from(str), index, substr)
        .map((it) => it || '')
        .join('');
};
exports.stringInsertAt = stringInsertAt;
const stringRemoveAt = (str, index) => {
    return (0, array_1.shiftLeft)(Array.from(str), index)
        .map((it) => it || '')
        .join('');
};
exports.stringRemoveAt = stringRemoveAt;
const jaroWinklerSimilarity = (s1, s2, options = {}) => {
    const { prefixScale = 0.1, maxPrefixLength = 4, caseSensitive = false, } = options;
    if (!caseSensitive) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
    }
    if (s1 === s2)
        return 1.0;
    if (!s1.length || !s2.length)
        return 0.0;
    const len1 = s1.length;
    const len2 = s2.length;
    const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
    const s1Matches = new Array(len1).fill(false);
    const s2Matches = new Array(len2).fill(false);
    let matches = 0;
    let transpositions = 0;
    for (let i = 0; i < len1; i++) {
        const start = Math.max(0, i - matchDistance);
        const end = Math.min(i + matchDistance + 1, len2);
        for (let j = start; j < end; j++) {
            if (s2Matches[j] || s1[i] !== s2[j])
                continue;
            s1Matches[i] = s2Matches[j] = true;
            matches++;
            break;
        }
    }
    if (matches === 0)
        return 0.0;
    let k = 0;
    for (let i = 0; i < len1; i++) {
        if (!s1Matches[i])
            continue;
        while (!s2Matches[k])
            k++;
        if (s1[i] !== s2[k])
            transpositions++;
        k++;
    }
    const jaro = (matches / len1 +
        matches / len2 +
        (matches - transpositions / 2) / matches) /
        3;
    let prefix = 0;
    for (let i = 0; i < Math.min(maxPrefixLength, len1, len2); i++) {
        if (s1[i] === s2[i])
            prefix++;
        else
            break;
    }
    return jaro + prefix * prefixScale * (1 - jaro);
};
exports.jaroWinklerSimilarity = jaroWinklerSimilarity;
const levDist = (a, b) => {
    if (a.length <= 0 || b.length <= 0)
        return 0;
    const la = a.length;
    const lb = b.length;
    if (la <= 0 || lb <= 0)
        return 0;
    const matrix = (0, array_1.range)(la + 1).map(() => (0, array_1.range)(lb + 1).map(() => 0));
    for (let i = 0; i <= la; i++) {
        for (let j = 0; j <= lb; j++) {
            if (i == 0) {
                matrix[i][j] = j;
            }
            else if (j == 0) {
                matrix[i][j] = i;
            }
            else if (a[i - 1] == b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] =
                    Math.min(matrix[i][j - 1], Math.max(matrix[i - 1][j], matrix[i - 1][j - 1])) + 1;
            }
        }
    }
    return matrix[la][lb];
};
exports.levDist = levDist;
const levDistNormalized = (a, b) => {
    const la = a.length;
    const lb = b.length;
    if (la <= 0 || lb <= 0)
        return 0.0;
    if (a == b)
        return 1.0;
    const lev_dist = (0, exports.levDist)(a, b);
    return lev_dist / (la + lb);
};
exports.levDistNormalized = levDistNormalized;
const levenshteinSimilarity = (a, b, options = {}) => {
    const { caseSensitive = false } = options;
    if (!caseSensitive) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    if (a === b)
        return 1.0;
    const d1 = (0, exports.levDist)(a, b);
    const d2 = (0, exports.levDist)(b, a);
    return (0, etc_1.clamp)(1.0 / Math.max(0.000001, 0.5 * (d1 + d2)), 0.0, 1.0);
};
exports.levenshteinSimilarity = levenshteinSimilarity;
const naiveStringSimilarity = (a, b) => {
    if (a === b)
        return 1.0;
    let score = 0;
    const wordsA = a.split(' ');
    const wordsB = b.split(' ');
    const words = (0, array_1.zipMax)(wordsA, wordsB, ['_', '_']);
    const invWordsLen = 1.0 / Math.max(1.0, words.length);
    const prefixScale = 0.1 * invWordsLen;
    for (let iw = 0; iw < words.length; iw++) {
        const [wa, wb] = words[iw];
        if (wa === '_' && wb === '_') {
            score -= prefixScale * invWordsLen;
            continue;
        }
        const z1 = (0, array_1.zipMax)(Array.from(wa), Array.from(wb), ['_', '_']);
        const invLen = 1.0 / Math.max(1.0, z1.length);
        for (let i = 0; i < z1.length; i++) {
            const [v1, v2] = z1[i];
            if (v1 === '_' && v2 === '_') {
                score -= prefixScale * invWordsLen;
                continue;
            }
            const c1 = v1.charCodeAt(0);
            const c2 = v2.charCodeAt(0);
            const dist = Math.abs(c2 - c1);
            score +=
                (0, etc_1.clamp)(1.0 / Math.max(0.000001, dist), 0.0, 1.0) * invLen * invWordsLen;
        }
    }
    const maxWords = wordsA.length > wordsB.length ? wordsA : wordsB;
    const check = wordsA.length > wordsB.length ? b : a;
    for (const w of maxWords) {
        if (check.includes(w)) {
            score += 1.0;
        }
    }
    return Math.tanh(score);
};
exports.naiveStringSimilarity = naiveStringSimilarity;
const cosineStringSimilarity = (a, b, options = {}) => {
    var _a;
    const vecsA = options.useGoogleWord2Vec ? (0, word2vec_1.getWordVectorsV2W)(a) : (0, word2vec_1.getWordVectors)(a);
    const vecsB = options.useGoogleWord2Vec ? (0, word2vec_1.getWordVectorsV2W)(b) : (0, word2vec_1.getWordVectors)(b);
    if (vecsA.length <= 0 || vecsB.length <= 0)
        return -1;
    if (vecsA.length === 1 && vecsB.length === 1) {
        return (_a = (0, etc_1.cosineDistance)(vecsA[0], vecsB[0])) !== null && _a !== void 0 ? _a : -1;
    }
    if (vecsA.length === vecsB.length) {
        const all = (0, array_1.zip)(vecsA, vecsB);
        const tot = (0, etc_1.sum)(all.map(([x, y]) => (0, etc_1.cosineDistance)(x, y))) / Math.max(1, vecsA.length);
        return tot !== null && tot !== void 0 ? tot : -1;
    }
    const count = vecsA.length * vecsB.length;
    const dist1 = (0, etc_1.sum)(vecsA.map((va) => (0, etc_1.sum)(vecsB.map((vb) => (0, etc_1.cosineDistance)(va, vb)))).flat()) / Math.max(1, count);
    const dist2 = (0, etc_1.sum)(vecsB.map((vb) => (0, etc_1.sum)(vecsA.map((va) => (0, etc_1.cosineDistance)(vb, va)))).flat()) / Math.max(1, count);
    const dist = (dist1 + dist2) * 0.5;
    return dist !== null && dist !== void 0 ? dist : -1;
};
exports.cosineStringSimilarity = cosineStringSimilarity;
const stringSimilarity = (a, b, options = {}) => {
    const { naiveInfluence = 0.25, cosineInfluence = 0.0, levenshteinInfluence = 0.01, jaroWinklerInfluence = 1.0 - 0.25, caseSensitive = false, } = options;
    if (!caseSensitive) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    const influence = [
        naiveInfluence,
        cosineInfluence,
        levenshteinInfluence,
        jaroWinklerInfluence,
    ];
    const tot = (0, etc_1.sum)(influence);
    const invTot = 1.0 / Math.max(0.000001, tot);
    const scales = influence.map((x) => x * invTot);
    const naive = naiveInfluence > 0.0 ? (0, exports.naiveStringSimilarity)(a, b) : 0.0;
    const cosine = cosineInfluence > 0.0 ? (0, exports.cosineStringSimilarity)(a, b, options.cosineOptions) : 0.0;
    const lev = levenshteinInfluence > 0.0 ? (0, exports.levenshteinSimilarity)(a, b, options) : 0.0;
    const jar = jaroWinklerInfluence > 0.0 ? (0, exports.jaroWinklerSimilarity)(a, b, options) : 0.0;
    return (0, etc_1.sum)([naive, cosine, lev, jar].map((x, i) => x * scales[i]));
};
exports.stringSimilarity = stringSimilarity;
