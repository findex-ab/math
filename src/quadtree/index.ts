import {
  AABB,
  AABBvsAABB,
  AABBvsAABB2D,
  aabbFromPoints,
  aabbSlice2D,
  aabbUniform,
  getAABBSize,
  pointVSAABB,
} from '../aabb';
import { Vector } from '../vector';

type Line = [Vector, Vector];

export type QuadTree = {
  bounds: AABB;
  children: QuadTree[];
  lines: Line[];
  divided: boolean;
};

export type QuadTreeOptions = {
  maxDepth?: number;
  itemsPerNode?: number;
  insertOnlyOneChild?: boolean;
  minBoundSize?: number;
};

export const quadTreeFromLines = (
  lines: Line[],
  options: QuadTreeOptions = {},
): QuadTree => {
  const points = lines.flat();
  const bounds = aabbUniform(aabbFromPoints(points));

  const tree: QuadTree = {
    bounds,
    children: [],
    lines: [],
    divided: false,
  };

  for (const line of lines) {
    quadTreeInsertLine(tree, line, options);
  }

  return tree;
};

export const quadTreeInsertLine = (
  tree: QuadTree,
  line: Line,
  options: QuadTreeOptions = {},
) => {
  tree.bounds.min.z = 0;
  tree.bounds.max.z = 0;
  const itemsPerNode = options.itemsPerNode || 2;
  const minBoundSize = options.minBoundSize || 0.0025;
  //const maxDepth = options.maxDepth || 4;
  const bound = aabbUniform(aabbFromPoints(line));
  bound.min.z = 0;
  bound.max.z = 0;
  const insert = (tree: QuadTree, depth: number = 0) => {
    //if (maxDepth > 0 && depth >= maxDepth) return false;
    if (!AABBvsAABB2D(tree.bounds, bound)) return false;
    const boundSize = getAABBSize(tree.bounds);
    const boundMag = boundSize.mag();
    
    if (tree.lines.length < itemsPerNode || boundMag < minBoundSize) {
      tree.lines.push(line);
      return true;
    }

    if (!tree.divided) {
      const childBounds = aabbSlice2D(tree.bounds).map((it) => aabbUniform(it));
      tree.children =
        tree.children.length > 0
          ? tree.children
          : childBounds.map((bound): QuadTree => {
              return {
                bounds: bound,
                lines: [],
                children: [],
                divided: false,
              };
            });

      tree.divided = true;
    }

    let didInsert: boolean = false;

    for (const child of tree.children) {
      if (insert(child, depth + 1)) {
        didInsert = true;
        if (options.insertOnlyOneChild === true) {
          return true;
        }
      }
    }

    return didInsert;
  };

  return insert(tree, 0);
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
  const p1 = line[0];
  const p2 = line[1];
  if (pointVSAABB(p1, bound) || pointVSAABB(p2, bound)) return true;

  if (
    (p1.x < bound.min.x || p1.x > bound.max.x) &&
    (p2.x < bound.min.x || p2.x > bound.max.x)
  )
    return false;
  return true;
};

export const quadTreeFindLines = (tree: QuadTree, line: Line): Line[] => {
  const found: Line[] = [];
  const m = new Map<Line, boolean>();

  const find = (tree: QuadTree, found: Line[] = [], depth: number = 0) => {
    if (!lineVSAABB(line, tree.bounds)) return [];

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      const nextLines = find(child, found, depth + 1);
      nextLines.forEach((it) => {
        if (!m.has(it)) {
          m.set(it, true);
          found.push(it);
        }
      });
    }

    return tree.lines || [];
  };

  find(tree, found);

  m.clear();

  if (found.length <= 0 && tree.lines.length > 0) return tree.lines;

  return found;
};
