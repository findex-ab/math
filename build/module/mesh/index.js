import { INF } from '../constants';
export * from './edge';
export * from './triangle';
export * from './line';
export const meshSupport = (mesh, dir) => {
    let furthestDistance = -INF;
    let furthestVertex = mesh.points[0];
    for (const v of mesh.points) {
        let distance = v.dot(dir);
        if (distance > furthestDistance) {
            furthestDistance = distance;
            furthestVertex = v;
        }
    }
    return furthestVertex;
};
