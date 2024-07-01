import { AABB } from '../aabb';
import { Vector } from '../vector';
type Line = [Vector, Vector];
export type QuadTree = {
    bounds: AABB;
    children: QuadTree[];
    lines: Line[];
};
export declare const quadTreeFromLines: (lines: Line[]) => QuadTree;
export declare const quadTreeSplit: (tree: QuadTree, depth?: number) => QuadTree;
export declare const quadTreeFind: (tree: QuadTree, bound: AABB, depth?: number) => QuadTree | null;
export declare const quadTreeFindLines: (tree: QuadTree, line: Line, depth?: number) => Line[];
export {};
