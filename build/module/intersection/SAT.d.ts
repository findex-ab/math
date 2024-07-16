import { Vector } from "../vector";
export declare const INF: number;
export type SATResult = {
    depth: number;
    normal: Vector;
};
export declare const SAT: (pointsA: Vector[], pointsB: Vector[]) => SATResult | null;
