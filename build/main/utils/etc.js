"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineDistance = exports.enumerate = exports.onCycle = exports.remap = exports.fibonacci = exports.randomFloats = exports.normalize = exports.magnitude = exports.mod = exports.signStr = exports.sign = exports.snap = exports.smax = exports.smin = exports.slt = exports.sgt = exports.smoothstep = exports.fract = exports.clamp = exports.lerp = exports.decant = exports.cantor = exports.median = exports.average = exports.sum = exports.sigmoidDer = exports.sigmoid = void 0;
const array_1 = require("./array");
const hash_1 = require("./hash");
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
exports.sigmoid = sigmoid;
const sigmoidDer = (x) => (0, exports.sigmoid)(x) * (1 - (0, exports.sigmoid)(x));
exports.sigmoidDer = sigmoidDer;
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
exports.sum = sum;
const average = (arr) => arr.length <= 0 ? 0 : (0, exports.sum)(arr) / arr.length;
exports.average = average;
const median = (numbers) => {
    if (numbers.length === 0) {
        return 0;
    }
    const sortedNumbers = numbers.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedNumbers.length / 2);
    if (sortedNumbers.length % 2 === 0)
        return ((sortedNumbers[(0, exports.clamp)(middleIndex - 1, 0, sortedNumbers.length - 1)] +
            sortedNumbers[middleIndex]) /
            2);
    return sortedNumbers[middleIndex];
};
exports.median = median;
const cantor = (k1, k2) => {
    return ((k1 + k2) * (k1 + k2 + 1)) / 2 + k2;
};
exports.cantor = cantor;
const decant = (c) => {
    const w = Math.floor((Math.sqrt(c * 8 + 1) - 1) / 2);
    const y = c - (w * (w + 1)) / 2;
    const x = w - y;
    return [x, y];
};
exports.decant = decant;
const lerp = (vFrom, vTo, scale) => {
    return vFrom + (vTo - vFrom) * scale;
};
exports.lerp = lerp;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
exports.clamp = clamp;
const fract = (x) => x - Math.floor(x);
exports.fract = fract;
const smoothstep = (edge0, edge1, value) => {
    const x = (0, exports.clamp)((value - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
};
exports.smoothstep = smoothstep;
const sgt = (a, b, s) => {
    const h = (0, exports.clamp)(0.5 + (0.5 * (a - b)) / s, 0.0, 1.0);
    return (0, exports.lerp)(0.0, 1.0, h * h * (3.0 - 2.0 * h));
};
exports.sgt = sgt;
const slt = (a, b, s) => {
    const h = (0, exports.clamp)(0.5 + (0.5 * (b - a)) / s, 0.0, 1.0);
    return (0, exports.lerp)(0.0, 1.0, h * h * (3.0 - 2.0 * h));
};
exports.slt = slt;
const smin = (a, b, k) => {
    const h = (0, exports.clamp)(0.5 + (0.5 * (b - a)) / k, 0.0, 1.0);
    return (0, exports.lerp)(b, a, h) - k * h * (1.0 - h);
};
exports.smin = smin;
const smax = (a, b, k) => {
    const h = (0, exports.clamp)(0.5 + (0.5 * (b - a)) / k, 0.0, 1.0);
    return (0, exports.lerp)(b, a, h) + k * h * (1.0 - h);
};
exports.smax = smax;
const snap = (x, s) => Math.floor(x / s) * s;
exports.snap = snap;
exports.sign = Math.sign;
const signStr = (n) => (n < 0 ? '-' : '+');
exports.signStr = signStr;
const mod = (n, div) => {
    if (n > div)
        return 0;
    if (n < 0)
        return div;
    return n;
};
exports.mod = mod;
const magnitude = (arr) => {
    return Math.sqrt((0, exports.sum)(arr.map((x) => x * x)));
};
exports.magnitude = magnitude;
const normalize = (arr, epsilon = 0.0000005) => {
    const mag = (0, exports.magnitude)(arr);
    if (mag <= epsilon)
        return arr;
    return arr.map((x) => x / mag);
};
exports.normalize = normalize;
const randomFloats = (count, options = {}) => {
    let seed = options.seed || 509813;
    const min = options.min || 0;
    const max = options.max || 1;
    return (0, array_1.range)(count).map((i) => {
        const f = (0, hash_1.randomFloat)(seed, min, max);
        seed = (0, hash_1.toUint32)(seed + (0, hash_1.hashu32)(seed) + i);
        return f;
    });
};
exports.randomFloats = randomFloats;
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}
exports.fibonacci = fibonacci;
const remap = (v, vFrom, vTo, epsilon = 0.000001) => {
    const div = vFrom.max - vFrom.min;
    if ((vFrom.min === vTo.min && vFrom.max === vTo.max) ||
        Math.abs(div) <= epsilon)
        return (0, exports.clamp)(v, vFrom.min, vFrom.max);
    return (0, exports.clamp)(vTo.min + ((v - vFrom.min) / div) * (vTo.max - vTo.min), vTo.min, vTo.max);
};
exports.remap = remap;
const onCycle = (vFrom, vTo, nrSteps, transTime, frame, time) => {
    const cycle = time % (nrSteps + transTime);
    return (0, exports.lerp)(vFrom, vTo, (0, exports.smoothstep)(frame - transTime, frame + transTime, cycle));
};
exports.onCycle = onCycle;
const enumerate = (arr) => {
    return arr.length <= 0 ? [] : (0, array_1.range)(arr.length).map((i) => [i, arr[i]]);
};
exports.enumerate = enumerate;
const cosineDistance = (a, b) => {
    let dot = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        norm1 += a[i] * a[i];
        norm2 += b[i] * b[i];
    }
    return dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
};
exports.cosineDistance = cosineDistance;
