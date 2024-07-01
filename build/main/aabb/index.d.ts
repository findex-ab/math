import { Vector } from "../vector";
export type AABB = {
    min: Vector;
    max: Vector;
};
export declare const aabbUniform: (bounds: AABB) => {
    min: Vector;
    max: Vector;
};
export declare const aabbSlice2D: (bounds: AABB, epsilon?: number) => AABB[];
export declare const aabbSub: (a: AABB, b: AABB) => {
    min: Vector;
    max: Vector;
};
export declare const aabbFromSize: (size: Vector) => AABB;
export declare const aabbCorrect: (a: AABB) => {
    min: Vector;
    max: Vector;
};
export declare const aabbTranslate: (a: AABB, v: Vector) => AABB;
export declare const getAABBCenter: (a: AABB) => Vector;
export declare const getAABBSize: (a: AABB) => Vector;
export declare const AABBvsAABB: (a: AABB, b: AABB) => boolean;
export declare const pointVSAABB: (point: Vector, bounds: AABB) => boolean;
export declare const getAABBPoints: (a: AABB) => Vector[];
export declare const getAABBPoints3D: (aabb: AABB) => Vector[];
export declare const aabbFromPoints: (points: Vector[]) => AABB;
