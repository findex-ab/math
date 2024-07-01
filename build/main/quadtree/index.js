"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadTreeFindLines = exports.quadTreeFind = exports.quadTreeSplit = exports.quadTreeFromLines = void 0;
const aabb_1 = require("../aabb");
const quadTreeFromLines = (lines) => {
    const points = lines.flat();
    const bounds = (0, aabb_1.aabbUniform)((0, aabb_1.aabbFromPoints)(points));
    return {
        bounds,
        children: [],
        lines: lines,
    };
};
exports.quadTreeFromLines = quadTreeFromLines;
const quadTreeSplit = (tree, depth = 0) => {
    if (tree.lines.length <= 2)
        return tree;
    const childBounds = (0, aabb_1.aabbSlice2D)(tree.bounds).map((it) => (0, aabb_1.aabbUniform)(it));
    tree.children = (tree.children.length > 0
        ? tree.children
        : childBounds.map((bound) => {
            return {
                bounds: bound,
                lines: [],
                children: [],
            };
        })).map((child) => {
        const lines = [...tree.lines];
        for (let i = 0; i < lines.length; i++) {
            const next = tree.lines[i];
            const bound = (0, aabb_1.aabbUniform)((0, aabb_1.aabbFromPoints)(next));
            if ((0, aabb_1.AABBvsAABB)(bound, child.bounds)) {
                child.lines.push(next);
            }
        }
        if (child.lines.length > 2 && depth < 4) {
            return (0, exports.quadTreeSplit)(child, depth + 1);
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
exports.quadTreeSplit = quadTreeSplit;
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
    const p = line[1];
    if (p.x < bound.min.x || p.x > bound.max.x)
        return false;
    return true;
};
const quadTreeFindLines = (tree, line, depth = 0) => {
    if (!lineVSAABB(line, tree.bounds))
        return [];
    let lines = [];
    if (depth > 0) {
        lines = tree.lines;
    }
    for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        if (child.lines.length <= 0)
            continue;
        if (!lineVSAABB(line, child.bounds))
            continue;
        lines = [...lines, ...(0, exports.quadTreeFindLines)(child, line, depth + 1)];
    }
    return lines;
};
exports.quadTreeFindLines = quadTreeFindLines;
