import { INF } from '../constants';
import { Vector } from '../vector';

export const closestPointDistance = (p: Vector, points: Vector[]): Vector => {
  let minDist = INF;
  let closest = points[0];

  for (let i = 0; i < points.length; i++) {
    const v = points[i];
    const d = v.distance(p);
    if (d < minDist) {
      minDist = d;
      closest = v;
    }
  }

  return closest;
};

export const furthestPointDistance = (p: Vector, points: Vector[]): Vector => {
  let maxDist = -INF;
  let furthest = points[0];

  for (let i = 0; i < points.length; i++) {
    const v = points[i];
    const d = v.distance(p);
    if (d > maxDist) {
      maxDist = d;
      furthest = v;
    }
  }

  return furthest;
};


export const closestPointDot = (p: Vector, points: Vector[]): Vector => {
  let minDist = INF;
  let closest = points[0];

  for (let i = 0; i < points.length; i++) {
    const v = points[i];
    const d = v.dot(p);
    if (d < minDist) {
      minDist = d;
      closest = v;
    }
  }

  return closest;
};

export const furthestPointDot = (p: Vector, points: Vector[]): Vector => {
  let maxDist = -INF;
  let furthest = points[0];

  for (let i = 0; i < points.length; i++) {
    const v = points[i];
    const d = v.dot(p);
    if (d > maxDist) {
      maxDist = d;
      furthest = v;
    }
  }

  return furthest;
};
