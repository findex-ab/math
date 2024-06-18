"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLineIntersection3D = exports.findLineIntersection2D = void 0;
const vector_1 = require("../vector");
const lineIntersection = (lineA, lineB, is3D) => {
    const crossScalar = (a, b) => {
        if (is3D)
            return a.cross(b).mag();
        return a.x * b.y - a.y * b.x;
    };
    const { a, b } = lineA;
    const { a: c, b: d } = lineB;
    const r = b.sub(a);
    const s = d.sub(c);
    const rCrossS = crossScalar(r, s);
    if (rCrossS === 0) {
        return null;
    }
    const t = crossScalar(c.sub(a), s) / rCrossS;
    const u = crossScalar(c.sub(a), r) / rCrossS;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const p = a.add(r.scale(t));
        return {
            point: p,
            depth: t,
            normal: (0, vector_1.VEC3)(u, t, 0)
        };
    }
    return null;
};
const findLineIntersection2D = (lineA, lineB) => lineIntersection(lineA, lineB, false);
exports.findLineIntersection2D = findLineIntersection2D;
const findLineIntersection3D = (lineA, lineB) => lineIntersection(lineA, lineB, true);
exports.findLineIntersection3D = findLineIntersection3D;
