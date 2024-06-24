"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.furthestPointDot = exports.closestPointDot = exports.furthestPointDistance = exports.closestPointDistance = void 0;
const constants_1 = require("../constants");
const closestPointDistance = (p, points) => {
    let minDist = constants_1.INF;
    let closest = points[0];
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        const d = v.distance(p);
        if (d < minDist) {
            minDist = d;
            closest = v;
        }
    }
    return closest;
};
exports.closestPointDistance = closestPointDistance;
const furthestPointDistance = (p, points) => {
    let maxDist = -constants_1.INF;
    let furthest = points[0];
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        const d = v.distance(p);
        if (d > maxDist) {
            maxDist = d;
            furthest = v;
        }
    }
    return furthest;
};
exports.furthestPointDistance = furthestPointDistance;
const closestPointDot = (p, points) => {
    let minDist = constants_1.INF;
    let closest = points[0];
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        const d = v.dot(p);
        if (d < minDist) {
            minDist = d;
            closest = v;
        }
    }
    return closest;
};
exports.closestPointDot = closestPointDot;
const furthestPointDot = (p, points) => {
    let maxDist = -constants_1.INF;
    let furthest = points[0];
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        const d = v.dot(p);
        if (d > maxDist) {
            maxDist = d;
            furthest = v;
        }
    }
    return furthest;
};
exports.furthestPointDot = furthestPointDot;
