import { PhysicsBody } from '../physics/body';
import { MinkowskiSimplex } from '../utils/minkowski';
import { Vector } from '../vector';
import { EPAConfig } from './EPA';
export type GilbertConfig = {
    initialAxis?: Vector;
    maxIterations?: number;
    EPA?: EPAConfig;
};
export type GilbertProps = {
    config?: GilbertConfig;
    a: PhysicsBody;
    b: PhysicsBody;
};
export declare const gilbert: (props: GilbertProps) => MinkowskiSimplex | null;
