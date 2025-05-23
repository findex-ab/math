import { getWordVectors, getWordVectorsCustom } from '../word2vec';
import { insertAt, range, shiftLeft, zip, zipMax } from './array';
import { clamp, cosineDistance, sum } from './etc';
export const stringInsertAt = (str, index, substr) => {
    return insertAt(Array.from(str), index, substr)
        .map((it) => it || '')
        .join('');
};
export const stringRemoveAt = (str, index) => {
    return shiftLeft(Array.from(str), index)
        .map((it) => it || '')
        .join('');
};
export const jaroWinklerSimilarity = (s1, s2, options = {}) => {
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
export const levDist = (a, b) => {
    if (a.length <= 0 || b.length <= 0)
        return 0;
    const la = a.length;
    const lb = b.length;
    if (la <= 0 || lb <= 0)
        return 0;
    const matrix = range(la + 1).map(() => range(lb + 1).map(() => 0));
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
export const levDistNormalized = (a, b) => {
    const la = a.length;
    const lb = b.length;
    if (la <= 0 || lb <= 0)
        return 0.0;
    if (a == b)
        return 1.0;
    const lev_dist = levDist(a, b);
    return lev_dist / (la + lb);
};
export const levenshteinSimilarity = (a, b, options = {}) => {
    const { caseSensitive = false } = options;
    if (!caseSensitive) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    if (a === b)
        return 1.0;
    const d1 = levDist(a, b);
    const d2 = levDist(b, a);
    return clamp(1.0 / Math.max(0.000001, 0.5 * (d1 + d2)), 0.0, 1.0);
};
export const naiveStringSimilarity = (a, b) => {
    if (a === b)
        return 1.0;
    let score = 0;
    const wordsA = a.split(' ');
    const wordsB = b.split(' ');
    const words = zipMax(wordsA, wordsB, ['_', '_']);
    const invWordsLen = 1.0 / Math.max(1.0, words.length);
    const prefixScale = 0.1 * invWordsLen;
    for (let iw = 0; iw < words.length; iw++) {
        const [wa, wb] = words[iw];
        if (wa === '_' && wb === '_') {
            score -= prefixScale * invWordsLen;
            continue;
        }
        const z1 = zipMax(Array.from(wa), Array.from(wb), ['_', '_']);
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
                clamp(1.0 / Math.max(0.000001, dist), 0.0, 1.0) * invLen * invWordsLen;
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
export const cosineStringSimilarity = (a, b, options = {}) => {
    const vecsA = options.customVectors ? getWordVectorsCustom(a, options.customVectors) : getWordVectors(a);
    const vecsB = options.customVectors ? getWordVectorsCustom(b, options.customVectors) : getWordVectors(b);
    if (vecsA.length <= 0 || vecsB.length <= 0)
        return -1;
    if (vecsA.length === 1 && vecsB.length === 1) {
        return cosineDistance(vecsA[0], vecsB[0]) ?? -1;
    }
    if (vecsA.length === vecsB.length) {
        const all = zip(vecsA, vecsB);
        const tot = sum(all.map(([x, y]) => cosineDistance(x, y))) / Math.max(1, vecsA.length);
        return tot ?? -1;
    }
    const count = vecsA.length * vecsB.length;
    const dist1 = sum(vecsA.map((va) => sum(vecsB.map((vb) => cosineDistance(va, vb)))).flat()) / Math.max(1, count);
    const dist2 = sum(vecsB.map((vb) => sum(vecsA.map((va) => cosineDistance(vb, va)))).flat()) / Math.max(1, count);
    const dist = (dist1 + dist2) * 0.5;
    return dist ?? -1;
};
export const stringSimilarity = (a, b, options = {}) => {
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
    const tot = sum(influence);
    const invTot = 1.0 / Math.max(0.000001, tot);
    const scales = influence.map((x) => x * invTot);
    const naive = naiveInfluence > 0.0 ? naiveStringSimilarity(a, b) : 0.0;
    const cosine = cosineInfluence > 0.0 ? cosineStringSimilarity(a, b, options.cosineOptions) : 0.0;
    const lev = levenshteinInfluence > 0.0 ? levenshteinSimilarity(a, b, options) : 0.0;
    const jar = jaroWinklerInfluence > 0.0 ? jaroWinklerSimilarity(a, b, options) : 0.0;
    return sum([naive, cosine, lev, jar].map((x, i) => x * scales[i]));
};
