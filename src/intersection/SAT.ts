import { INF } from "../constants";
import { VEC2, Vector } from "../vector";

export type SATResult = {
  depth: number;
  normal: Vector;
}

export const SAT = (pointsA: Vector[], pointsB: Vector[]): SATResult | null => {
  const LARGE = INF * 0.5;
  const axises: Vector[] = [VEC2(1, 0), VEC2(0, 1)]

  const project = (axis: Vector, points: Vector[]) => {
    let min = INF
    let max = -INF
    for (let j = 0; j < points.length; j++) {
      const v = points[j]
      const dot = axis.dot(v)
      if (dot > max) {
        max = dot
      }
      if (dot < min) {
        min = dot
      }
    }
    return VEC2(min, max)
  }

  const checkAxis = (pointsA: Vector[], pointsB: Vector[], axis: Vector) => {
    const p1 = project(axis, pointsA)
    const p2 = project(axis, pointsB)
    const minA = p1.x
    const maxA = p1.y
    const minB = p2.x
    const maxB = p2.y
    const sign = minA < minB ? 1.0 : -1.0
    const overlap = Math.min(maxA, maxB) - Math.max(minA, minB)
    return {
      intersects: (minB <= maxA && minA <= maxB) && (p1.x < LARGE && p1.y < LARGE && p2.x < LARGE && p2.y < LARGE),
      sign,
      overlap
    }
  }

  let minOverlap = INF
  let normal = VEC2(0, 0)
  let intersects: boolean = false

  for (let i = 0; i < axises.length; i++) {
    const axis = axises[i]
    const check = checkAxis(pointsA, pointsB, axis)
    if (check.intersects) {
      if (check.overlap < minOverlap) {
        normal = axis.scale(check.sign);
        minOverlap = check.overlap
        intersects = true
      }
    }
  }

  if (!intersects) return null;

  return {
    depth: minOverlap,
    normal: normal
  }
}
