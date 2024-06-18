"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAT = void 0;
const constants_1 = require("../constants");
const vector_1 = require("../vector");
const SAT = (pointsA, pointsB) => {
    const LARGE = constants_1.INF * 0.5;
    const axises = [(0, vector_1.VEC2)(1, 0), (0, vector_1.VEC2)(0, 1)];
    const project = (axis, points) => {
        let min = constants_1.INF;
        let max = -constants_1.INF;
        for (let j = 0; j < points.length; j++) {
            const v = points[j];
            const dot = axis.dot(v);
            if (dot > max) {
                max = dot;
            }
            if (dot < min) {
                min = dot;
            }
        }
        return (0, vector_1.VEC2)(min, max);
    };
    const checkAxis = (pointsA, pointsB, axis) => {
        const p1 = project(axis, pointsA);
        const p2 = project(axis, pointsB);
        const minA = p1.x;
        const maxA = p1.y;
        const minB = p2.x;
        const maxB = p2.y;
        const sign = minA < minB ? 1.0 : -1.0;
        const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
        return {
            intersects: (minB <= maxA && minA <= maxB) && (p1.x < LARGE && p1.y < LARGE && p2.x < LARGE && p2.y < LARGE),
            sign,
            overlap
        };
    };
    let minOverlap = constants_1.INF;
    let normal = (0, vector_1.VEC2)(0, 0);
    let intersects = false;
    for (let i = 0; i < axises.length; i++) {
        const axis = axises[i];
        const check = checkAxis(pointsA, pointsB, axis);
        if (check.intersects) {
            if (check.overlap < minOverlap) {
                normal = axis.scale(check.sign);
                minOverlap = check.overlap;
                intersects = true;
            }
        }
    }
    if (!intersects)
        return null;
    return {
        depth: minOverlap,
        normal: normal
    };
};
exports.SAT = SAT;
