import { Line } from '../mesh';
import { SimpleContact } from '../physics';
import { VEC3, Vector } from '../vector';

const lineIntersection = (
  lineA: Line,
  lineB: Line,
  is3D: boolean,
): SimpleContact | null => {
  const crossScalar = (a: Vector, b: Vector) => {
    if (is3D) return a.cross(b).mag();
    return a.x * b.y - a.y * b.x;
  };

  const { a, b } = lineA;
  const { a: c, b: d } = lineB;

  const r = b.sub(a);
  const s = d.sub(c);
  const rCrossS = crossScalar(r, s);

  if (rCrossS === 0) {
    return null;
  }

  const t = crossScalar(c.sub(a), s) / rCrossS;
  const u = crossScalar(c.sub(a), r) / rCrossS;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    const p = a.add(r.scale(t));

    return {
      point: p,
      depth: 0,
      normal: VEC3(u, t, 0),
    };
  }

  return null;
};

export const findLineIntersection2D = (
  lineA: Line,
  lineB: Line,
): SimpleContact | null => lineIntersection(lineA, lineB, false);
export const findLineIntersection3D = (
  lineA: Line,
  lineB: Line,
): SimpleContact | null => lineIntersection(lineA, lineB, true);

export const findClosestPointOnLine = (point: Vector, line: Line): Vector => {
  const { a: lineStart, b: lineEnd } = line;
  const lineVec = lineEnd.sub(lineStart);
  const pointVec = point.sub(lineStart);
  const lineLenSq = lineVec.dot(lineVec);
  const t = Math.max(0, Math.min(1, pointVec.dot(lineVec) / lineLenSq));
  const closestPoint = lineStart.add(lineVec.scale(t));
  return closestPoint;
};
