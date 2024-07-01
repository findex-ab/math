import {
  AABB,
  AABBvsAABB,
  aabbFromPoints,
  aabbSlice2D,
  aabbUniform,
} from '../aabb';
import { Vector } from '../vector';

type Line = [Vector, Vector];

export type QuadTree = {
  bounds: AABB;
  children: QuadTree[];
  lines: Line[];
};

export const quadTreeFromLines = (lines: Line[]): QuadTree => {
  const points = lines.flat();
  const bounds = aabbUniform(aabbFromPoints(points));

  return {
    bounds,
    children: [],
    lines: lines,
  };
};

export const quadTreeSplit = (tree: QuadTree, depth: number = 0): QuadTree => {
  if (tree.lines.length <= 2) return tree;


  const childBounds = aabbSlice2D(tree.bounds).map((it) => aabbUniform(it));
  tree.children = (
    tree.children.length > 0
      ? tree.children
      : childBounds.map((bound): QuadTree => {
          return {
            bounds: bound,
            lines: [],
            children: [],
          };
        })
  ).map((child) => {
    const lines = [...tree.lines];
    for (let i = 0; i < lines.length; i++) {
      const next = tree.lines[i];
      const bound = aabbUniform(aabbFromPoints(next));
      if (AABBvsAABB(bound, child.bounds)) {
        child.lines.push(next);
      }

    }

    if (child.lines.length > 2 && depth < 4) {
      return quadTreeSplit(child, depth + 1);
    }
    return child;
  });

  tree.lines = tree.lines.slice(0, 2);
  tree.children = tree.children.filter(it => it.lines.length > 0);

  if (depth <= 0) {
    tree.lines = [];
  }

  return tree;
};

export const quadTreeFind = (
  tree: QuadTree,
  bound: AABB,
  depth: number = 0,
): QuadTree | null => {
  if (!AABBvsAABB(bound, tree.bounds)) return null;

  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    if (child.lines.length <= 0) continue;
    if (!AABBvsAABB(bound, child.bounds)) continue;
    const result = quadTreeFind(child, bound, depth + 1);
    if (result) return result;
  }

  if (depth <= 0) return null;

  return tree;
};

const lineVSAABB = (line: Line, bound: AABB) => {
  const p = line[1];
  if (p.x < bound.min.x || p.x > bound.max.x) return false;
  return true;
}

export const quadTreeFindLines = (
  tree: QuadTree,
  line: Line,
  depth: number = 0,
): Line[] => {
  if (!lineVSAABB(line, tree.bounds)) return [];

  let lines: Line[] = [];

  if (depth > 0) {
    lines = tree.lines;
  }

  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    if (child.lines.length <= 0) continue;
    if (!lineVSAABB(line, child.bounds)) continue;
    lines = [...lines, ...quadTreeFindLines(child, line, depth + 1)];
  }

  return lines;
}
