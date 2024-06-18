import { Vector } from '../vector';
export type Triangle = {
    v1: Vector;
    v2: Vector;
    v3: Vector;
    normal: Vector;
};
export declare const triangleBarycentric: (tri: Triangle, p: Vector) => Vector;
