"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinkowskiSupportPair = exports.getMinkowskiPoints = exports.minkowskiSimplexPushFront = exports.emptyMinkowskiTriangle = exports.emptyMinkowskiSupportPair = exports.emptyMinkowskiPair = void 0;
const matrix_1 = require("../matrix");
const vector_1 = require("../vector");
exports.emptyMinkowskiPair = {
    closest: (0, vector_1.VEC31)(0),
    furthest: (0, vector_1.VEC31)(0),
    closestDot: 0,
    furthestDot: 0,
    closestLocal: (0, vector_1.VEC31)(0),
    furthestLocal: (0, vector_1.VEC31)(0),
};
exports.emptyMinkowskiSupportPair = {
    a: exports.emptyMinkowskiPair,
    b: exports.emptyMinkowskiPair,
    axis: (0, vector_1.VEC31)(0),
    point: (0, vector_1.VEC31)(0),
    pointLocal: (0, vector_1.VEC31)(0)
};
exports.emptyMinkowskiTriangle = {
    v1: exports.emptyMinkowskiSupportPair,
    v2: exports.emptyMinkowskiSupportPair,
    v3: exports.emptyMinkowskiSupportPair,
    normal: (0, vector_1.VEC31)(0)
};
const minkowskiSimplexPushFront = (simplex, pair) => {
    const p0 = simplex.supports[0];
    const p1 = simplex.supports[1];
    const p2 = simplex.supports[2];
    simplex.supports[0] = pair;
    simplex.supports[1] = p0;
    simplex.supports[2] = p1;
    simplex.supports[3] = p2;
    simplex.length = Math.min(simplex.length + 1, 4);
    return simplex;
};
exports.minkowskiSimplexPushFront = minkowskiSimplexPushFront;
const getMinkowskiPoints = (dir, mesh) => {
    const points = mesh.points;
    if (points.length <= 0)
        return exports.emptyMinkowskiPair;
    dir = dir.clone();
    if (mesh.rotationMatrix) {
        dir.w = 1;
        dir = dir.mulMat4((0, matrix_1.mat4Inverse)(mesh.rotationMatrix));
    }
    let furthest = points[0];
    let closest = points[0];
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        const dot = dir.dot(v);
        if (dot > max) {
            max = dot;
            furthest = v.clone();
        }
        if (dot < min) {
            min = dot;
            closest = v.clone();
        }
    }
    const closestLocal = closest.clone();
    const furthestLocal = furthest.clone();
    furthest.w = 1;
    closest.w = 1;
    closest = mesh.modelMatrix ? closest.mulMat4(mesh.modelMatrix) : closest;
    furthest = mesh.modelMatrix ? furthest.mulMat4(mesh.modelMatrix) : furthest;
    return {
        closest: closest,
        closestLocal: closestLocal,
        furthest: furthest,
        furthestLocal: furthestLocal,
        closestDot: min,
        furthestDot: max,
    };
};
exports.getMinkowskiPoints = getMinkowskiPoints;
const getMinkowskiSupportPair = (a, b, dir) => {
    const sa = (0, exports.getMinkowskiPoints)(dir, a);
    const sb = (0, exports.getMinkowskiPoints)((0, vector_1.vector3_scale)(dir, -1), b);
    const p1 = sa.furthest;
    const p2 = sb.furthest;
    const point = (0, vector_1.vector3_sub)(p1, p2);
    const p1_local = sa.furthestLocal;
    const p2_local = sb.furthestLocal;
    const pointLocal = (0, vector_1.vector3_sub)(p1_local, p2_local);
    return {
        a: sa,
        b: sb,
        point: point,
        pointLocal: pointLocal,
        axis: dir
    };
};
exports.getMinkowskiSupportPair = getMinkowskiSupportPair;
