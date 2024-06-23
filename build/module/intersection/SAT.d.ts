import { Vector } from "../vector";
export type SATResult = {
    depth: number;
    normal: Vector;
};
export declare const SAT: (pointsA: Vector[], pointsB: Vector[], axises?: Vector[]) => SATResult | null;
