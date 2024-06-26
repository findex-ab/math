import { Mat4 } from '../matrix';
import { Vector } from '../vector';
export * from './edge';
export * from './triangle';
export * from './line';
export type Mesh = {
    points: Vector[];
    modelMatrix?: Mat4;
    translationMatrix?: Mat4;
    rotationMatrix?: Mat4;
};
export declare const meshSupport: (mesh: Mesh, dir: Vector) => Vector;
