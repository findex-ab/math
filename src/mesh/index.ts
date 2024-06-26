import { INF } from '../constants';
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

export const meshSupport = (mesh: Mesh, dir: Vector): Vector => {
  let furthestDistance: number = -INF;
  let furthestVertex: Vector = mesh.points[0];

  for (const v of mesh.points) {
    let distance = v.dot(dir);
    if (distance > furthestDistance) {
      furthestDistance = distance;
      furthestVertex = v;
    }
  }

  return furthestVertex;
};
