import { Mesh } from '../mesh';
import { VEC31, Vector, vector3_scale, vector3_sub } from '../vector';

export type MinkowskiPair = {
  closest: Vector;
  closestLocal: Vector;
  closestDot: number;
  furthest: Vector;
  furthestLocal: Vector;
  furthestDot: number;
};

export type MinkowskiSupportPair = {
  a: MinkowskiPair;
  b: MinkowskiPair;
  axis: Vector;
  point: Vector;
  pointLocal: Vector;
};

export type MinkowskiSimplex = {
  supports: MinkowskiSupportPair[];
  dir: Vector;
  support: MinkowskiSupportPair;
  length: number;
};

export type MinkowskiSupportTriangle = {
  v1: MinkowskiSupportPair;
  v2: MinkowskiSupportPair;
  v3: MinkowskiSupportPair;
  normal: Vector;
};


export const emptyMinkowskiPair: MinkowskiPair = {
  closest: VEC31(0),
  furthest: VEC31(0),
  closestDot: 0,
  furthestDot: 0,
  closestLocal: VEC31(0),
  furthestLocal: VEC31(0),
};

export const emptyMinkowskiSupportPair: MinkowskiSupportPair = {
  a: emptyMinkowskiPair,
  b: emptyMinkowskiPair,
  axis: VEC31(0),
  point: VEC31(0),
  pointLocal: VEC31(0)
}

export const emptyMinkowskiTriangle: MinkowskiSupportTriangle = {
  v1: emptyMinkowskiSupportPair,
  v2: emptyMinkowskiSupportPair,
  v3: emptyMinkowskiSupportPair,
  normal: VEC31(0)
}

export const minkowskiSimplexPushFront = (
  simplex: MinkowskiSimplex,
  pair: MinkowskiSupportPair,
): MinkowskiSimplex => {
  const p0 = simplex.supports[0];
  const p1 = simplex.supports[1];
  const p2 = simplex.supports[2];
  simplex.supports[0] = pair;
  simplex.supports[1] = p0;
  simplex.supports[2] = p1;
  simplex.supports[3] = p2;
  simplex.length = Math.min(simplex.length + 1, 4);

  return simplex;
};

export const getMinkowskiPoints = (
  dir: Vector,
  points: Vector[],
): MinkowskiPair => {
  if (points.length <= 0)
    return emptyMinkowskiPair;


  let furthest: Vector = points[0];

  let closest: Vector = points[0];

  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const v = points[i];
    const dot = dir.dot(v)

    if (dot > max) {
      max = dot;
      furthest = v;
    }

    if (dot < min) {
      min = dot;
      closest = v;
    }
  }

  return {
    closest: closest,
    closestLocal: closest,
    furthest: furthest,
    furthestLocal: furthest,
    closestDot: min,
    furthestDot: max,
  };
};

export const getMinkowskiSupportPair = (
  a: Mesh,
  b: Mesh,
  dir: Vector,
): MinkowskiSupportPair => {


  const sa = getMinkowskiPoints(dir, a.points);
  const sb = getMinkowskiPoints(vector3_scale(dir, -1), b.points);

  const p1 = sa.furthest;
  const p2 = sb.furthest;
  const point = vector3_sub(p1, p2);

  const p1_local = sa.furthestLocal;
  const p2_local = sb.furthestLocal;
  const pointLocal = vector3_sub(p1_local, p2_local);



  return {
    a: sa,
    b: sb,
    point: point,
    pointLocal: pointLocal,
    axis: dir
  };
};
