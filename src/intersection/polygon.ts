import { MeshEdge } from '../mesh';
import { SimpleContact } from '../physics';
import { vector3_tangents_fast } from '../vector';
import { VEC2, Vector } from '../vector';
import { findLineIntersection2D, findLineIntersection3D } from './line';

const findEdges = (points: Vector[]) => {
  const edges: MeshEdge[] = [];
  for (let i = 0; i < points.length; i++) {
    edges.push({ a: i, b: (i + 1) % points.length });
  }
  return edges;
};

const polygonIntersectionPoints = (
  verticesA: Vector[],
  verticesB: Vector[],
  is3D: boolean
): SimpleContact[] => {
  const points: SimpleContact[] = [];

  const edges1 = findEdges(verticesA);
  const edges2 = findEdges(verticesB);

  const fun = is3D ? findLineIntersection3D : findLineIntersection2D;

  for (const e1 of edges1) {
    for (const e2 of edges2) {
      const a = verticesA[e1.a];
      const b = verticesA[e1.b];
      const c = verticesB[e2.a];
      const d = verticesB[e2.b];

      const point = fun(
        { a: a, b: b },
        { a: c, b: d },
      );
      if (point) {
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
        points.push(point);
      }
    }
  }

  return points;
};

export const findPolygonIntersectionPoints2D = (
  verticesA: Vector[],
  verticesB: Vector[],
): SimpleContact[] => polygonIntersectionPoints(verticesA, verticesB, false);

export const findPolygonIntersectionPoints3D = (
  verticesA: Vector[],
  verticesB: Vector[],
): SimpleContact[] => polygonIntersectionPoints(verticesA, verticesB, true);
