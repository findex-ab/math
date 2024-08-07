export declare const floatBitsToUint: (f: number) => number;
export declare const floatBitsToUint64: (f: number) => bigint;
export declare const toUint64: (f: number | bigint) => bigint;
export declare const toUint32: (f: number | bigint) => number;
export declare const hashu32: (i: number) => number;
export declare const hashu32f: (i: number) => number;
export declare const hashu32_v1: (i: number, normalize?: boolean) => number;
export declare const hashu32f_v1: (i: number) => number;
export declare const randomFloat: (seed: number, min?: number, max?: number) => number;
export declare const randomInt: (seed: number, min?: number, max?: number) => number;
export declare const hash21f: (ix: number, iy: number, is?: number) => number;
export declare const hashAny: (v: any) => string;
export declare const hashAnyu32: (v: any) => number;
export declare const hexToUint32: (hex: string) => number;
export declare const nthByte: (val: number, n: number) => number;
export declare const noise2D: (x: number, y: number, seed?: number, octaves?: number, freq?: number) => number;
export declare const generateUID: (numChars: number, inputSeed: number) => [number, string];
export type UIDGeneratorConfig = {
    uidLength: number;
};
export type TUIDGenerator = {
    next: () => string;
};
export declare const UIDGenerator: (config: UIDGeneratorConfig, inputSeed?: number) => TUIDGenerator;
export type HashGeneratorConfig = {
    seed?: number;
};
export type HashGenerator = {
    next: () => number;
    nextNormal: () => number;
};
export declare const hashGenerator: (cfg?: HashGeneratorConfig) => HashGenerator;
