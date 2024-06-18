import { Vector } from "../vector";
export type AABB = {
    min: Vector;
    max: Vector;
};
export declare const getAABBCenter: (a: AABB) => Vector;
export declare const getAABBSize: (a: AABB) => Vector;
export declare const AABBvsAABB: (a: AABB, b: AABB) => boolean;
export declare const pointVSAABB: (point: Vector, bounds: AABB) => boolean;
export declare const getAABBPoints: (a: AABB) => Vector[];
export declare const getAABBPoints3D: (aabb: AABB) => Vector[];
