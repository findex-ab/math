import { MinkowskiSimplex, MinkowskiSupportTriangle } from "../utils/minkowski";
import { Vector, VectorPair } from "../vector";
import { Constraint } from "./constraint";
export type Contact = {
    constraint: Constraint;
    tri: MinkowskiSupportTriangle;
    simplex: MinkowskiSimplex;
    normal: Vector;
    tangent: Vector;
    separation: number;
    flipped: boolean;
    is_old: boolean;
    invalid_tangent: boolean;
    point: Vector;
    timestamp: number;
    id: number;
    previous: {
        point: Vector;
        world_points: VectorPair;
        local_points: VectorPair;
    };
};
