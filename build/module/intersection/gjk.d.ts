import { PhysicsBody } from '../physics';
import { Vector } from '../vector';
declare enum EvolveResult {
    NoIntersection = 0,
    FoundIntersection = 1,
    StillEvolving = 2
}
export declare class GJK {
    vertices: Vector[];
    direction: Vector;
    shapeA: PhysicsBody;
    shapeB: PhysicsBody;
    addSupport(dir: Vector): boolean;
    tripleProduct(a: Vector, b: Vector, c: Vector): Vector;
    evolveSimplex(): EvolveResult;
    constructor(shapeA: PhysicsBody, shapeB: PhysicsBody);
    test(): boolean;
}
export {};
