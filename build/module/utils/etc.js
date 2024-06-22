import { range } from './array';
import { hashu32, randomFloat, toUint32 } from './hash';
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export const average = (arr) => arr.length <= 0 ? 0 : sum(arr) / arr.length;
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
export const remap = (v, vFrom, vTo) => {
    if (vFrom.min === vTo.min && vFrom.max === vTo.max)
        return clamp(v, vFrom.min, vFrom.max);
    return clamp(vTo.min + (((v - vFrom.min) / (vFrom.max - vFrom.min)) * (vTo.max - vTo.min)), vTo.min, vTo.max);
};
