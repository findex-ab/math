import { range } from './array';
import { hashu32, randomFloat, toUint32 } from './hash';

export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const average = (arr: number[]): number =>
  arr.length <= 0 ? 0 : sum(arr) / arr.length;

export const cantor = (k1: number, k2: number) => {
  return ((k1 + k2) * (k1 + k2 + 1)) / 2 + k2;
};

export const decant = (c: number): [number, number] => {
  const w = Math.floor((Math.sqrt(c * 8 + 1) - 1) / 2);
  const y = c - (w * (w + 1)) / 2;
  const x = w - y;
  return [x, y];
};

export const lerp = (vFrom: number, vTo: number, scale: number) => {
  return vFrom + (vTo - vFrom) * scale;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const fract = (x: number) => x - Math.floor(x);

export const smoothstep = (
  edge0: number,
  edge1: number,
  value: number,
): number => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3.0 - 2.0 * x);
};

export const sgt = (a: number, b: number, s: number) => {
  const h = clamp(0.5 + (0.5 * (a - b)) / s, 0.0, 1.0);
  return lerp(0.0, 1.0, h * h * (3.0 - 2.0 * h));
};

export const slt = (a: number, b: number, s: number) => {
  const h = clamp(0.5 + (0.5 * (b - a)) / s, 0.0, 1.0);
  return lerp(0.0, 1.0, h * h * (3.0 - 2.0 * h));
};

export const smin = (a: number, b: number, k: number) => {
  const h = clamp(0.5 + (0.5 * (b - a)) / k, 0.0, 1.0);
  return lerp(b, a, h) - k * h * (1.0 - h);
};

export const smax = (a: number, b: number, k: number) => {
  const h = clamp(0.5 + (0.5 * (b - a)) / k, 0.0, 1.0);
  return lerp(b, a, h) + k * h * (1.0 - h);
};

export const snap = (x: number, s: number): number => Math.floor(x / s) * s;

export const sign = Math.sign;

export const signStr = (n: number): string => (n < 0 ? '-' : '+');

export const mod = (n: number, div: number): number => {
  if (n > div) return 0;
  if (n < 0) return div;
  return n;
};

export const magnitude = (arr: number[]): number => {
  return Math.sqrt(sum(arr.map((x) => x * x)));
};

export const normalize = (
  arr: number[],
  epsilon: number = 0.0000005,
): number[] => {
  const mag = magnitude(arr);
  if (mag <= epsilon) return arr;
  return arr.map((x) => x / mag);
};

export type RandomFloatsOptions = {
  min?: number;
  max?: number;
  seed?: number;
};

export const randomFloats = (
  count: number,
  options: RandomFloatsOptions = {},
): number[] => {
  let seed: number = options.seed || 509813;
  const min = options.min || 0;
  const max = options.max || 1;
  return range(count).map((i) => {
    const f = randomFloat(seed, min, max);
    seed = toUint32(seed + hashu32(seed) + i);
    return f;
  });
};

export function* fibonacci(): Generator<number, number, number> {
    let a = 0, b = 1;
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
}

export const remap = (v: number, vFrom: { min: number, max: number }, vTo: { min: number, max: number }) => {
  if (vFrom.min === vTo.min && vFrom.max === vTo.max) return clamp(v, vFrom.min, vFrom.max);
  return clamp(vTo.min + (((v - vFrom.min) / (vFrom.max - vFrom.min)) * (vTo.max - vTo.min)), vTo.min, vTo.max);
}
