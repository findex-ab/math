"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aabbFromPoints = exports.getAABBPoints3D = exports.getAABBPoints = exports.pointVSAABB = exports.AABBvsAABB = exports.getAABBSize = exports.getAABBCenter = exports.aabbTranslate = exports.aabbCorrect = exports.aabbFromSize = exports.aabbSub = exports.aabbSlice2D = exports.aabbUniform = void 0;
const constants_1 = require("../constants");
const vector_1 = require("../vector");
const aabbUniform = (bounds) => {
    const size = bounds.max.sub(bounds.min);
    const max = Math.max(...size.toArray());
    return {
        min: bounds.min,
        max: bounds.min.add((0, vector_1.VEC31)(max))
    };
};
exports.aabbUniform = aabbUniform;
const aabbSlice2D = (bounds, epsilon = 0.0001) => {
    const out = [];
    const layout = [
        (0, vector_1.VEC3)(0, 0, 0),
        (0, vector_1.VEC3)(0, 1, 0),
        (0, vector_1.VEC3)(1, 0, 0),
        (0, vector_1.VEC3)(1, 1, 0)
    ];
    const size = bounds.max.sub(bounds.min);
    const half = size.scale(0.5);
    const mid = bounds.min.add(half);
    const min = bounds.min;
    for (let i = 0; i < 4; i++) {
        const comb = layout[i];
        const child = { min: (0, vector_1.VEC2)(0, 0), max: (0, vector_1.VEC2)(0, 0) };
        child.min.x = Math.abs(comb.at(0)) <= epsilon ? min.x : mid.x;
        child.min.y = Math.abs(comb.at(1)) <= epsilon ? min.y : mid.y;
        child.min.z = Math.abs(comb.at(2)) <= epsilon ? min.z : mid.z;
        child.max = child.min.add(half);
        out.push(child);
    }
    return out;
};
exports.aabbSlice2D = aabbSlice2D;
const aabbSub = (a, b) => {
    return {
        min: a.min.sub(b.min),
        max: a.max.sub(b.max)
    };
};
exports.aabbSub = aabbSub;
const aabbFromSize = (size) => {
    const min = (0, vector_1.VEC31)(0);
    const max = size;
    return { min, max };
};
exports.aabbFromSize = aabbFromSize;
const aabbCorrect = (a) => {
    const maxX = Math.max(a.min.x, a.max.x);
    const maxY = Math.max(a.min.y, a.max.y);
    const maxZ = Math.max(a.min.z, a.max.z);
    const minX = Math.min(a.min.x, a.max.x);
    const minY = Math.min(a.min.y, a.max.y);
    const minZ = Math.min(a.min.z, a.max.z);
    const min = (0, vector_1.VEC3)(minX, minY, minZ);
    const max = (0, vector_1.VEC3)(maxX, maxY, maxZ);
    return { min, max };
};
exports.aabbCorrect = aabbCorrect;
const aabbTranslate = (a, v) => {
    const min = a.min.add(v);
    const max = a.max.add(v);
    return (0, exports.aabbCorrect)({
        min,
        max
    });
};
exports.aabbTranslate = aabbTranslate;
const getAABBCenter = (a) => {
    return a.min.add(a.max).scale(0.5);
};
exports.getAABBCenter = getAABBCenter;
const getAABBSize = (a) => {
    return a.max.sub(a.min);
};
exports.getAABBSize = getAABBSize;
const AABBvsAABB = (a, b) => {
    if (a.max.x < b.min.x || a.min.x > b.max.x)
        return false;
    if (a.max.y < b.min.y || a.min.y > b.max.y)
        return false;
    if (a.max.z < b.min.z || a.min.z > b.max.z)
        return false;
    return true;
};
exports.AABBvsAABB = AABBvsAABB;
const pointVSAABB = (point, bounds) => {
    if (point.x < bounds.min.x || point.x > bounds.max.x)
        return false;
    if (point.y < bounds.min.y || point.y > bounds.max.y)
        return false;
    return true;
};
exports.pointVSAABB = pointVSAABB;
const getAABBPoints = (a) => {
    return [
        (0, vector_1.VEC2)(a.min.x, a.min.y),
        (0, vector_1.VEC2)(a.max.x, a.min.y),
        (0, vector_1.VEC2)(a.max.x, a.max.y),
        (0, vector_1.VEC2)(a.min.x, a.max.y)
    ];
};
exports.getAABBPoints = getAABBPoints;
const getAABBPoints3D = (aabb) => {
    const size = (0, vector_1.vector3_sub)(aabb.max, aabb.min);
    const v1 = (0, vector_1.VEC3)(0, size.y, 0);
    const v2 = (0, vector_1.VEC3)(size.x, size.y, 0);
    const v3 = (0, vector_1.VEC3)(size.x, 0, 0);
    const v4 = (0, vector_1.VEC3)(0, 0, 0);
    // left
    const v5 = (0, vector_1.VEC3)(0, size.y, 0);
    const v6 = (0, vector_1.VEC3)(0, size.y, size.z);
    const v7 = (0, vector_1.VEC3)(0, 0, size.z);
    const v8 = (0, vector_1.VEC3)(0, 0, 0);
    // back
    const v9 = (0, vector_1.VEC3)(0, size.y, size.z);
    const v10 = (0, vector_1.VEC3)(size.x, size.y, size.z);
    const v11 = (0, vector_1.VEC3)(size.x, 0, size.z);
    const v12 = (0, vector_1.VEC3)(0, 0, size.z);
    // right
    const v13 = (0, vector_1.VEC3)(size.x, size.y, 0);
    const v14 = (0, vector_1.VEC3)(size.x, size.y, size.z);
    const v15 = (0, vector_1.VEC3)(size.x, 0, size.z);
    const v16 = (0, vector_1.VEC3)(size.x, 0, 0);
    // top
    const v17 = (0, vector_1.VEC3)(0, size.y, 0);
    const v18 = (0, vector_1.VEC3)(0, size.y, size.z);
    const v19 = (0, vector_1.VEC3)(size.x, size.y, size.z);
    const v20 = (0, vector_1.VEC3)(size.x, size.y, 0);
    // bottom
    const v21 = (0, vector_1.VEC3)(0, 0, 0);
    const v22 = (0, vector_1.VEC3)(0, 0, size.z);
    const v23 = (0, vector_1.VEC3)(size.x, 0, size.z);
    const v24 = (0, vector_1.VEC3)(size.x, 0, 0);
    const min = (0, vector_1.VEC31)(0);
    const out = [];
    out[0] = (0, vector_1.vector3_add)(min, v1);
    out[1] = (0, vector_1.vector3_add)(min, v2);
    out[2] = (0, vector_1.vector3_add)(min, v3);
    out[3] = (0, vector_1.vector3_add)(min, v4);
    out[4] = (0, vector_1.vector3_add)(min, v5);
    out[5] = (0, vector_1.vector3_add)(min, v6);
    out[6] = (0, vector_1.vector3_add)(min, v7);
    out[7] = (0, vector_1.vector3_add)(min, v8);
    out[8] = (0, vector_1.vector3_add)(min, v9);
    out[9] = (0, vector_1.vector3_add)(min, v10);
    out[10] = (0, vector_1.vector3_add)(min, v11);
    out[11] = (0, vector_1.vector3_add)(min, v12);
    out[12] = (0, vector_1.vector3_add)(min, v13);
    out[13] = (0, vector_1.vector3_add)(min, v14);
    out[14] = (0, vector_1.vector3_add)(min, v15);
    out[15] = (0, vector_1.vector3_add)(min, v16);
    out[16] = (0, vector_1.vector3_add)(min, v17);
    out[17] = (0, vector_1.vector3_add)(min, v18);
    out[18] = (0, vector_1.vector3_add)(min, v19);
    out[19] = (0, vector_1.vector3_add)(min, v20);
    out[20] = (0, vector_1.vector3_add)(min, v21);
    out[21] = (0, vector_1.vector3_add)(min, v22);
    out[22] = (0, vector_1.vector3_add)(min, v23);
    out[23] = (0, vector_1.vector3_add)(min, v24);
    return out;
};
exports.getAABBPoints3D = getAABBPoints3D;
const aabbFromPoints = (points) => {
    if (points.length <= 0)
        return { min: (0, vector_1.VEC31)(0), max: (0, vector_1.VEC31)(0) };
    const min = (0, vector_1.VEC3)(constants_1.INF, constants_1.INF, constants_1.INF);
    const max = min.scale(-1);
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        min.x = Math.min(min.x, p.x);
        min.y = Math.min(min.y, p.y);
        min.z = Math.min(min.z, p.z);
        max.x = Math.max(max.x, p.x);
        max.y = Math.max(max.y, p.y);
        max.z = Math.max(max.z, p.z);
    }
    return { min, max };
};
exports.aabbFromPoints = aabbFromPoints;
