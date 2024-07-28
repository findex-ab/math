"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadTreeFindLines = exports.quadTreeFind = exports.quadTreeInsertLine = exports.quadTreeFromLines = void 0;
const aabb_1 = require("../aabb");
const quadTreeFromLines = (lines, options = {}) => {
    const points = lines.flat();
    const bounds = (0, aabb_1.aabbUniform)((0, aabb_1.aabbFromPoints)(points));
    const tree = {
        bounds,
        children: [],
        lines: [],
        divided: false,
    };
    for (const line of lines) {
        (0, exports.quadTreeInsertLine)(tree, line, options);
    }
    return tree;
};
exports.quadTreeFromLines = quadTreeFromLines;
const quadTreeInsertLine = (tree, line, options = {}) => {
    tree.bounds.min.z = 0;
    tree.bounds.max.z = 0;
    const itemsPerNode = options.itemsPerNode || 2;
    const minBoundSize = options.minBoundSize || 0.0025;
    //const maxDepth = options.maxDepth || 4;
    const bound = (0, aabb_1.aabbUniform)((0, aabb_1.aabbFromPoints)(line));
    bound.min.z = 0;
    bound.max.z = 0;
    const insert = (tree, depth = 0) => {
        //if (maxDepth > 0 && depth >= maxDepth) return false;
        if (!(0, aabb_1.AABBvsAABB2D)(tree.bounds, bound))
            return false;
        const boundSize = (0, aabb_1.getAABBSize)(tree.bounds);
        const boundMag = boundSize.mag();
        if (tree.lines.length < itemsPerNode || boundMag < minBoundSize) {
            tree.lines.push(line);
            return true;
        }
        if (!tree.divided) {
            const childBounds = (0, aabb_1.aabbSlice2D)(tree.bounds).map((it) => (0, aabb_1.aabbUniform)(it));
            tree.children =
                tree.children.length > 0
                    ? tree.children
                    : childBounds.map((bound) => {
                        return {
                            bounds: bound,
                            lines: [],
                            children: [],
                            divided: false,
                        };
                    });
            tree.divided = true;
        }
        let didInsert = false;
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
exports.quadTreeInsertLine = quadTreeInsertLine;
const quadTreeFind = (tree, bound, depth = 0) => {
    if (!(0, aabb_1.AABBvsAABB)(bound, tree.bounds))
        return null;
    for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        if (child.lines.length <= 0)
            continue;
        if (!(0, aabb_1.AABBvsAABB)(bound, child.bounds))
            continue;
        const result = (0, exports.quadTreeFind)(child, bound, depth + 1);
        if (result)
            return result;
    }
    if (depth <= 0)
        return null;
    return tree;
};
exports.quadTreeFind = quadTreeFind;
const lineVSAABB = (line, bound) => {
    const p1 = line[0];
    const p2 = line[1];
    if ((0, aabb_1.pointVSAABB)(p1, bound) || (0, aabb_1.pointVSAABB)(p2, bound))
        return true;
    if ((p1.x < bound.min.x || p1.x > bound.max.x) &&
        (p2.x < bound.min.x || p2.x > bound.max.x))
        return false;
    return true;
};
const quadTreeFindLines = (tree, line) => {
    const found = [];
    const m = new Map();
    const find = (tree, found = [], depth = 0) => {
        if (!lineVSAABB(line, tree.bounds))
            return [];
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
    if (found.length <= 0 && tree.lines.length > 0)
        return tree.lines;
    return found;
};
exports.quadTreeFindLines = quadTreeFindLines;
