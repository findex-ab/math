import { VEC2, Vector } from "../vector";

export const INF = Number.MAX_VALUE;

export type SATResult = {
  depth: number;
  normal: Vector;
}

export const SAT = (pointsA: Vector[], pointsB: Vector[]): SATResult | null => {
  const project = (axis: Vector, points: Vector[]) => {
    let min = INF;
    let max = -INF;
    for (let j = 0; j < points.length; j++) {
      const v = points[j];
      const dot = axis.dot(v);
      if (dot > max) {
        max = dot;
      }
      if (dot < min) {
        min = dot;
      }
    }
    return VEC2(min, max);
  }

  const normalize = (vector: Vector) => {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return VEC2(vector.x / length, vector.y / length);
  }

  const checkAxis = (pointsA: Vector[], pointsB: Vector[], axis: Vector) => {
    axis = normalize(axis);  // Normalize the axis
    const p1 = project(axis, pointsA);
    const p2 = project(axis, pointsB);
    const minA = p1.x;
    const maxA = p1.y;
    const minB = p2.x;
    const maxB = p2.y;
    const sign = minA < minB ? 1.0 : -1.0;
    const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
    return {
      intersects: (minB <= maxA && minA <= maxB),
      sign,
      overlap
    }
  }

  const getAxes = (points: Vector[]) => {
    const axes = [];
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const edge = VEC2(p2.x - p1.x, p2.y - p1.y);
      axes.push(VEC2(-edge.y, edge.x));  // Perpendicular to edge
    }
    return axes;
  }

  const axesA = getAxes(pointsA);
  const axesB = getAxes(pointsB);
  const axises = axesA.concat(axesB);  // Combine axes from both polygons

  let minOverlap = INF;
  let normal = VEC2(0, 0);
  let intersects = true;

  for (let i = 0; i < axises.length; i++) {
    const axis = axises[i];
    const check = checkAxis(pointsA, pointsB, axis);
    if (!check.intersects) {
      intersects = false;
      break;
    } else {
      if (check.overlap < minOverlap) {
        normal = axis.scale(check.sign).unit();
        minOverlap = check.overlap;
      }
    }
  }

  if (!intersects) return null;

  return {
    depth: minOverlap,
    normal: normal
  }
}

