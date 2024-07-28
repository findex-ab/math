export declare const sigmoid: (x: number) => number;
export declare const sigmoidDer: (x: number) => number;
export declare const sum: (arr: number[]) => number;
export declare const average: (arr: number[]) => number;
export declare const median: (numbers: number[]) => number;
export declare const cantor: (k1: number, k2: number) => number;
export declare const decant: (c: number) => [number, number];
export declare const lerp: (vFrom: number, vTo: number, scale: number) => number;
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const fract: (x: number) => number;
export declare const smoothstep: (edge0: number, edge1: number, value: number) => number;
export declare const sgt: (a: number, b: number, s: number) => number;
export declare const slt: (a: number, b: number, s: number) => number;
export declare const smin: (a: number, b: number, k: number) => number;
export declare const smax: (a: number, b: number, k: number) => number;
export declare const snap: (x: number, s: number) => number;
export declare const sign: (x: number) => number;
export declare const signStr: (n: number) => string;
export declare const mod: (n: number, div: number) => number;
export declare const magnitude: (arr: number[]) => number;
export declare const normalize: (arr: number[], epsilon?: number) => number[];
export type RandomFloatsOptions = {
    min?: number;
    max?: number;
    seed?: number;
};
export declare const randomFloats: (count: number, options?: RandomFloatsOptions) => number[];
export declare function fibonacci(): Generator<number, number, number>;
export declare const remap: (v: number, vFrom: {
    min: number;
    max: number;
}, vTo: {
    min: number;
    max: number;
}, epsilon?: number) => number;
export declare const onCycle: (vFrom: number, vTo: number, nrSteps: number, transTime: number, frame: number, time: number) => number;
export declare const enumerate: <T = any>(arr: T[]) => Array<[number, T]>;
