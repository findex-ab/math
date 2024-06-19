"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPolygonIntersectionPoints3D = exports.findPolygonIntersectionPoints2D = void 0;
const vector_1 = require("../vector");
const vector_2 = require("../vector");
const line_1 = require("./line");
const findEdges = (points) => {
    const edges = [];
    for (let i = 0; i < points.length; i++) {
        edges.push({ a: i, b: (i + 1) % points.length });
    }
    return edges;
};
const polygonIntersectionPoints = (verticesA, verticesB, is3D) => {
    const points = [];
    const edges1 = findEdges(verticesA);
    const edges2 = findEdges(verticesB);
    const fun = is3D ? line_1.findLineIntersection3D : line_1.findLineIntersection2D;
    const isUnique = (p) => points.length <= 0 ? true : Math.min(...points.map(pp => pp.point.distance(p))) > 0.1;
    for (const e1 of edges1) {
        for (const e2 of edges2) {
            const a = verticesA[e1.a];
            const b = verticesA[e1.b];
            const c = verticesB[e2.a];
            const d = verticesB[e2.b];
            const point = fun({ a: a, b: b }, { a: c, b: d });
            if (point && isUnique(point.point)) {
                const ba = b.sub(a);
                const dc = c.sub(d);
                //const dcba = dc.sub(ba).scale(0.5);
                let t1 = (0, vector_2.VEC2)(-dc.y, dc.x);
                let t2 = (0, vector_2.VEC2)(-ba.y, ba.x);
                if (is3D) {
                    const tt1 = (0, vector_1.vector3_tangents_fast)(dc);
                    const tt2 = (0, vector_1.vector3_tangents_fast)(ba);
                    t1 = tt1.a;
                    t2 = tt2.a;
                }
                const n = t1.add(t2).scale(0.5).unit().scale(-1);
                point.normal = n;
                points.push(point);
            }
        }
    }
    return points;
};
const findPolygonIntersectionPoints2D = (verticesA, verticesB) => polygonIntersectionPoints(verticesA, verticesB, false);
exports.findPolygonIntersectionPoints2D = findPolygonIntersectionPoints2D;
const findPolygonIntersectionPoints3D = (verticesA, verticesB) => polygonIntersectionPoints(verticesA, verticesB, true);
exports.findPolygonIntersectionPoints3D = findPolygonIntersectionPoints3D;
