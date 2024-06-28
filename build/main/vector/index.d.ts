import { Mat4 } from '../matrix';
export interface IVector {
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class Vector implements IVector {
    _x: number;
    _y: number;
    _z: number;
    _w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    get xy(): Vector;
    get yx(): Vector;
    get xyz(): Vector;
    get yxz(): Vector;
    get yzx(): Vector;
    get zyx(): Vector;
    get xzy(): Vector;
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    set x(value: number);
    set y(value: number);
    set z(value: number);
    set w(value: number);
    scale(s: number): Vector;
    add(b: Vector): Vector;
    sub(b: Vector): Vector;
    mul(b: Vector): Vector;
    mulMat4(matrix: Mat4): Vector;
    static mulMat4(points: Vector[], matrix: Mat4, w?: number): Vector[];
    static sum(vectors: Vector[]): Vector;
    static avg(vectors: Vector[]): Vector;
    rotate(radians: number, axis: Vector): Vector;
    run(f: (v: number, i: number) => number): Vector;
    clamp(min: Vector, max: Vector): Vector;
    luma(): number;
    div(b: Vector): Vector;
    static fromHex(hex: string): Vector;
    static fromArray(arr: number[]): Vector;
    static fromRGB(val: string): Vector;
    static fromColor(val: string): Vector;
    toRGB(precision?: number): string;
    toRGBA(precision?: number, alpha?: number): string;
    lerp(b: Vector, scale: number): Vector;
    distance(b: Vector): number;
    clone(): Vector;
    unit(): Vector;
    mag(): number;
    dot(b: Vector): number;
    cross(b: Vector): Vector;
    str(): string;
    toString(count?: number, separator?: string): string;
    at(index: number): number;
    toArray<T extends number[] = number[]>(n?: number): T;
}
export declare const isVector: (x: any) => x is Vector;
export declare const VEC4: (x: number, y: number, z: number, w: number) => Vector;
export declare const VEC3: (x: number, y: number, z: number) => Vector;
export declare const VEC2: (x: number, y: number) => Vector;
export declare const VEC31: (x: number) => Vector;
export type VectorPair = {
    a: Vector;
    b: Vector;
};
export declare const samedir: (a: Vector, b: Vector) => boolean;
export declare const vector3_dot: (a: Vector, b: Vector) => number;
export declare const vector3_cross: (a: Vector, b: Vector) => Vector;
export declare const vector3_sub: (a: Vector, b: Vector) => Vector;
export declare const vector3_add: (a: Vector, b: Vector) => Vector;
export declare const vector3_scale: (a: Vector, s: number) => Vector;
export declare const vector3_unit: (a: Vector) => Vector;
export declare const vector3_mag: (a: Vector) => number;
export declare const vector3_tangents_slow: (n: Vector) => VectorPair;
export declare const vector3_tangents_fast: (n: Vector) => VectorPair;
export declare const vectorsAverage: (points: Vector[]) => Vector;
export declare const vectorIsUnique: (v: Vector, arr: Vector[], epsilon?: number) => boolean;
