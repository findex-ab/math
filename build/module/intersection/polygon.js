import { vector3_tangents_fast } from '../vector';
import { VEC2, Vector } from '../vector';
import { findLineIntersection2D, findLineIntersection3D } from './line';
const COMPUTE_NORMAL_FROM_TANGENTS = false;
const findEdges = (points) => {
    const edges = [];
    for (let i = 0; i < points.length; i++) {
        edges.push({ a: i, b: (i + 1) % points.length });
    }
    return edges;
};
const polygonIntersectionPoints = (verticesA, verticesB, is3D) => {
    const points = [];
    const edges1 = findEdges(verticesA);
    const edges2 = findEdges(verticesB);
    const fun = is3D ? findLineIntersection3D : findLineIntersection2D;
    const isUnique = (p) => points.length <= 0 ? true : Math.min(...points.map(pp => pp.point.distance(p))) > 0.1;
    const avgA = Vector.avg(verticesA);
    const avgB = Vector.avg(verticesB);
    const aToB = avgB.sub(avgA);
    for (const e1 of edges1) {
        const a = verticesA[e1.a];
        const b = verticesA[e1.b];
        for (const e2 of edges2) {
            const c = verticesB[e2.a];
            const d = verticesB[e2.b];
            const point = fun({ a: a, b: b }, { a: c, b: d });
            if (point && isUnique(point.point)) {
                if (COMPUTE_NORMAL_FROM_TANGENTS) {
                    const ba = b.sub(a);
                    const dc = c.sub(d);
                    //const dcba = dc.sub(ba).scale(0.5);
                    let t1 = VEC2(-dc.y, dc.x);
                    let t2 = VEC2(-ba.y, ba.x);
                    if (is3D) {
                        const tt1 = vector3_tangents_fast(dc);
                        const tt2 = vector3_tangents_fast(ba);
                        t1 = tt1.a;
                        t2 = tt2.a;
                    }
                    const n = t1.add(t2).scale(0.5).unit().scale(-1);
                    point.normal = n;
                }
                else {
                    point.normal = point.point.sub(avgA).unit(); //aToB.unit();
                }
                points.push(point);
            }
        }
    }
    const depths = [];
    let pointA = points[0];
    if (points.length > 0) {
        for (let i = 1; i < points.length; i++) {
            const pointB = points[i];
            const sep = pointB.point.sub(pointA.point);
            depths.push(Math.sqrt(sep.mag()));
            pointA = pointB;
        }
    }
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const dot = depths.length <= 0 ? 0.0 : depths[i % depths.length];
        point.depth = dot;
        points[i] = point;
    }
    return points;
};
export const findPolygonIntersectionPoints2D = (verticesA, verticesB) => polygonIntersectionPoints(verticesA, verticesB, false);
export const findPolygonIntersectionPoints3D = (verticesA, verticesB) => polygonIntersectionPoints(verticesA, verticesB, true);
