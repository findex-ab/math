import { Mesh } from '../mesh';
import { Vector } from '../vector';
export type MinkowskiPair = {
    closest: Vector;
    closestLocal: Vector;
    closestDot: number;
    furthest: Vector;
    furthestLocal: Vector;
    furthestDot: number;
};
export type MinkowskiSupportPair = {
    a: MinkowskiPair;
    b: MinkowskiPair;
    axis: Vector;
    point: Vector;
    pointLocal: Vector;
};
export type MinkowskiSimplex = {
    supports: MinkowskiSupportPair[];
    dir: Vector;
    support: MinkowskiSupportPair;
    length: number;
};
export type MinkowskiSupportTriangle = {
    v1: MinkowskiSupportPair;
    v2: MinkowskiSupportPair;
    v3: MinkowskiSupportPair;
    normal: Vector;
};
export declare const emptyMinkowskiPair: MinkowskiPair;
export declare const emptyMinkowskiSupportPair: MinkowskiSupportPair;
export declare const emptyMinkowskiTriangle: MinkowskiSupportTriangle;
export declare const minkowskiSimplexPushFront: (simplex: MinkowskiSimplex, pair: MinkowskiSupportPair) => MinkowskiSimplex;
export declare const getMinkowskiPoints: (dir: Vector, points: Vector[]) => MinkowskiPair;
export declare const getMinkowskiSupportPair: (a: Mesh, b: Mesh, dir: Vector) => MinkowskiSupportPair;
