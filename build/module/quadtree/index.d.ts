import { AABB } from '../aabb';
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
export declare const quadTreeFromLines: (lines: Line[], options?: QuadTreeOptions) => QuadTree;
export declare const quadTreeInsertLine: (tree: QuadTree, line: Line, options?: QuadTreeOptions) => boolean;
export declare const quadTreeFind: (tree: QuadTree, bound: AABB, depth?: number) => QuadTree | null;
export declare const quadTreeFindLines: (tree: QuadTree, line: Line) => Line[];
export {};
