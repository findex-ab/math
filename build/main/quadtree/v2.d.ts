import { AABB } from "../aabb";
import { Vector } from "../vector";
type QuadObject = {
    bounds: AABB;
};
type Ray = {
    origin: Vector;
    direction: Vector;
};
export declare class QuadTreeNode<T extends QuadObject> {
    bounds: AABB;
    capacity: number;
    objects: T[];
    divided: boolean;
    northeast: QuadTreeNode<T> | null;
    northwest: QuadTreeNode<T> | null;
    southeast: QuadTreeNode<T> | null;
    southwest: QuadTreeNode<T> | null;
    constructor(bounds: AABB, capacity: number);
    subdivide(): void;
    insert(obj: T): boolean;
    contains(a: AABB, b: AABB): boolean;
    intersects(a: AABB, b: AABB): boolean;
    rayIntersects(ray: Ray, aabb: AABB): boolean;
    queryRay(ray: Ray, found?: T[]): T[];
    query(range: AABB, found?: T[]): T[];
}
export declare class QuadTreeV2<T extends QuadObject> {
    root: QuadTreeNode<T>;
    constructor(bounds: AABB, capacity: number);
    build(objs: T[]): void;
}
type Line = [Vector, Vector];
export type QuadLine = {
    line: Line;
    bounds: AABB;
};
export type QuadTreeWithLines = InstanceType<typeof QuadTreeV2<QuadLine>>;
export type QuadTreeNodeWithLines = InstanceType<typeof QuadTreeNode<QuadLine>>;
export declare const quadTreeFromLinesV2: (lines: Line[]) => QuadTreeV2<QuadLine>;
export {};
