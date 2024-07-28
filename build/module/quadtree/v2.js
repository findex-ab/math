import { aabbFromPoints, aabbUniform } from "../aabb";
import { VEC2 } from "../vector";
export class QuadTreeNode {
    bounds;
    capacity;
    objects;
    divided;
    northeast;
    northwest;
    southeast;
    southwest;
    constructor(bounds, capacity) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.objects = [];
        this.divided = false;
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
    }
    // Subdivide the node into four children
    subdivide() {
        const { min, max } = this.bounds;
        const midX = (min.x + max.x) / 2;
        const midY = (min.y + max.y) / 2;
        const toVec = ({ x, y }) => VEC2(x, y);
        this.northeast = new QuadTreeNode({ min: toVec({ x: midX, y: min.y }), max: toVec({ x: max.x, y: midY }) }, this.capacity);
        this.northwest = new QuadTreeNode({ min: toVec({ x: min.x, y: min.y }), max: toVec({ x: midX, y: midY }) }, this.capacity);
        this.southeast = new QuadTreeNode({ min: toVec({ x: midX, y: midY }), max: toVec({ x: max.x, y: max.y }) }, this.capacity);
        this.southwest = new QuadTreeNode({ min: toVec({ x: min.x, y: midY }), max: toVec({ x: midX, y: max.y }) }, this.capacity);
        this.divided = true;
    }
    // Insert a game object into the quadtree
    insert(obj) {
        if (!this.contains(this.bounds, obj.bounds)) {
            return false;
        }
        if (this.objects.length < this.capacity) {
            this.objects.push(obj);
            return true;
        }
        if (!this.divided) {
            this.subdivide();
        }
        if (this.northeast.insert(obj))
            return true;
        if (this.northwest.insert(obj))
            return true;
        if (this.southeast.insert(obj))
            return true;
        if (this.southwest.insert(obj))
            return true;
        return false;
    }
    // Check if one AABB contains another AABB
    contains(a, b) {
        return (a.min.x <= b.min.x &&
            a.max.x >= b.max.x &&
            a.min.y <= b.min.y &&
            a.max.y >= b.max.y);
    }
    intersects(a, b) {
        return !(a.max.x < b.min.x ||
            a.min.x > b.max.x ||
            a.max.y < b.min.y ||
            a.min.y > b.max.y);
    }
    rayIntersects(ray, aabb) {
        if (!ray || !aabb)
            return false;
        //    if (ray.origin.x < aabb.min.x || ray.origin.x > aabb.max.x) return false;
        return true;
        //let tmin = (aabb.min.x - ray.origin.x) / ray.direction.x;
        //let tmax = (aabb.max.x - ray.origin.x) / ray.direction.x;
        //if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
        //let tymin = (aabb.min.y - ray.origin.y) / ray.direction.y;
        //let tymax = (aabb.max.y - ray.origin.y) / ray.direction.y;
        //if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
        //if ((tmin > tymax) || (tymin > tmax))
        //  return false;
        //if (tymin > tmin)
        //  tmin = tymin;
        //if (tymax < tmax)
        //  tmax = tymax;
        //return tmax > 0;
    }
    queryRay(ray, found = []) {
        if (!this.rayIntersects(ray, this.bounds)) {
            return [];
        }
        for (let obj of this.objects) {
            if (this.rayIntersects(ray, obj.bounds)) {
                found.push(obj);
            }
        }
        if (this.divided) {
            this.northwest.queryRay(ray, found);
            this.northeast.queryRay(ray, found);
            this.southwest.queryRay(ray, found);
            this.southeast.queryRay(ray, found);
        }
        return found;
    }
    query(range, found = []) {
        if (!this.intersects(this.bounds, range)) {
            return [];
        }
        for (let obj of this.objects) {
            if (this.intersects(obj.bounds, range)) {
                found.push(obj);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }
        return found;
    }
}
// Define the Quadtree class
export class QuadTreeV2 {
    root;
    constructor(bounds, capacity) {
        this.root = new QuadTreeNode(bounds, capacity);
    }
    build(objs) {
        objs.forEach((obj) => {
            this.root.insert(obj);
        });
    }
}
export const quadTreeFromLinesV2 = (lines) => {
    const points = lines.flat();
    const bounds = aabbUniform(aabbFromPoints(points));
    const quadLines = lines.map((line) => {
        return {
            line: line,
            bounds: aabbUniform(aabbFromPoints(line))
        };
    });
    const tree = new QuadTreeV2(bounds, 2);
    tree.build(quadLines);
    return tree;
};
