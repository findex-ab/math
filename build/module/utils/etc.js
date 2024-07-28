import { range } from './array';
import { hashu32, randomFloat, toUint32 } from './hash';
export const sigmoid = (x) => 1 / (1 + Math.exp(-x));
export const sigmoidDer = (x) => sigmoid(x) * (1 - sigmoid(x));
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export const average = (arr) => arr.length <= 0 ? 0 : sum(arr) / arr.length;
export const median = (numbers) => {
    if (numbers.length === 0) {
        return 0;
    }
    const sortedNumbers = numbers.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedNumbers.length / 2);
    if (sortedNumbers.length % 2 === 0)
        return ((sortedNumbers[clamp(middleIndex - 1, 0, sortedNumbers.length - 1)] +
            sortedNumbers[middleIndex]) /
            2);
    return sortedNumbers[middleIndex];
};
export const cantor = (k1, k2) => {
    return ((k1 + k2) * (k1 + k2 + 1)) / 2 + k2;
};
export const decant = (c) => {
    const w = Math.floor((Math.sqrt(c * 8 + 1) - 1) / 2);
    const y = c - (w * (w + 1)) / 2;
    const x = w - y;
    return [x, y];
};
export const lerp = (vFrom, vTo, scale) => {
    return vFrom + (vTo - vFrom) * scale;
};
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const fract = (x) => x - Math.floor(x);
export const smoothstep = (edge0, edge1, value) => {
    const x = clamp((value - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
};
export const sgt = (a, b, s) => {
    const h = clamp(0.5 + (0.5 * (a - b)) / s, 0.0, 1.0);
    return lerp(0.0, 1.0, h * h * (3.0 - 2.0 * h));
};
export const slt = (a, b, s) => {
    const h = clamp(0.5 + (0.5 * (b - a)) / s, 0.0, 1.0);
    return lerp(0.0, 1.0, h * h * (3.0 - 2.0 * h));
};
export const smin = (a, b, k) => {
    const h = clamp(0.5 + (0.5 * (b - a)) / k, 0.0, 1.0);
    return lerp(b, a, h) - k * h * (1.0 - h);
};
export const smax = (a, b, k) => {
    const h = clamp(0.5 + (0.5 * (b - a)) / k, 0.0, 1.0);
    return lerp(b, a, h) + k * h * (1.0 - h);
};
export const snap = (x, s) => Math.floor(x / s) * s;
export const sign = Math.sign;
export const signStr = (n) => (n < 0 ? '-' : '+');
export const mod = (n, div) => {
    if (n > div)
        return 0;
    if (n < 0)
        return div;
    return n;
};
export const magnitude = (arr) => {
    return Math.sqrt(sum(arr.map((x) => x * x)));
};
export const normalize = (arr, epsilon = 0.0000005) => {
    const mag = magnitude(arr);
    if (mag <= epsilon)
        return arr;
    return arr.map((x) => x / mag);
};
export const randomFloats = (count, options = {}) => {
    let seed = options.seed || 509813;
    const min = options.min || 0;
    const max = options.max || 1;
    return range(count).map((i) => {
        const f = randomFloat(seed, min, max);
        seed = toUint32(seed + hashu32(seed) + i);
        return f;
    });
};
export function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}
export const remap = (v, vFrom, vTo, epsilon = 0.000001) => {
    const div = (vFrom.max - vFrom.min);
    if ((vFrom.min === vTo.min && vFrom.max === vTo.max) || (Math.abs(div) <= epsilon))
        return clamp(v, vFrom.min, vFrom.max);
    return clamp(vTo.min + ((v - vFrom.min) / div) * (vTo.max - vTo.min), vTo.min, vTo.max);
};
export const onCycle = (vFrom, vTo, nrSteps, transTime, frame, time) => {
    const cycle = time % (nrSteps + transTime);
    return lerp(vFrom, vTo, smoothstep(frame - transTime, frame + transTime, cycle));
};
export const enumerate = (arr) => {
    return arr.length <= 0 ? [] : range(arr.length).map((i) => ([i, arr[i]]));
};
