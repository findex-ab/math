"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gilbert = void 0;
const body_1 = require("../physics/body");
const minkowski_1 = require("../utils/minkowski");
const vector_1 = require("../vector");
const EPSILON = 0.00000001;
const nextLine = (simplex) => {
    const a = simplex.supports[0];
    const b = simplex.supports[1];
    const ab = (0, vector_1.vector3_sub)(b.point, a.point);
    const ao = (0, vector_1.vector3_scale)(a.point, -1);
    if ((0, vector_1.samedir)(ab, ao)) {
        simplex.dir = (0, vector_1.vector3_cross)((0, vector_1.vector3_cross)(ab, ao), ab);
    }
    else {
        simplex.supports[0] = a;
        simplex.length = 1;
        simplex.dir = ao;
    }
    return null;
};
const gilbert_next_triangle = (simplex, props) => {
    const a = simplex.supports[0];
    const b = simplex.supports[1];
    const c = simplex.supports[2];
    const ab = (0, vector_1.vector3_sub)(b.point, a.point);
    const ac = (0, vector_1.vector3_sub)(c.point, a.point);
    const ao = (0, vector_1.vector3_scale)(a.point, -1);
    const abc = (0, vector_1.vector3_cross)(ab, ac);
    if ((0, vector_1.samedir)((0, vector_1.vector3_cross)(abc, ac), ao)) {
        if ((0, vector_1.samedir)(ac, ao)) {
            simplex.supports[0] = a;
            simplex.supports[1] = c;
            simplex.length = 2;
            simplex.dir = (0, vector_1.vector3_cross)((0, vector_1.vector3_cross)(ac, ao), ac);
        }
        else {
            simplex.supports[0] = a;
            simplex.supports[1] = b;
            simplex.length = 2;
            return gilbert_next(simplex, props);
        }
    }
    else {
        if ((0, vector_1.samedir)((0, vector_1.vector3_cross)(ab, abc), ao)) {
            simplex.supports[0] = a;
            simplex.supports[1] = b;
            simplex.length = 2;
            return gilbert_next(simplex, props);
        }
        else {
            if ((0, vector_1.samedir)(abc, ao)) {
                simplex.dir = abc;
            }
            else {
                simplex.supports[0] = a;
                simplex.supports[1] = c;
                simplex.supports[2] = b;
                simplex.length = 3;
                simplex.dir = (0, vector_1.vector3_scale)(abc, -1);
            }
        }
    }
    return null; //props.config?.skipTetra === false ? gilbert_next_tetra(simplex, props) : simplex;
};
const gilbert_next_tetra = (simplex, props) => {
    const a = simplex.supports[0];
    const b = simplex.supports[1];
    const c = simplex.supports[2];
    const d = simplex.supports[3];
    const ab = (0, vector_1.vector3_sub)(b.point, a.point);
    const ac = (0, vector_1.vector3_sub)(c.point, a.point);
    const ad = (0, vector_1.vector3_sub)(d.point, a.point);
    const ao = (0, vector_1.vector3_scale)(a.point, -1);
    const abc = (0, vector_1.vector3_cross)(ab, ac);
    const acd = (0, vector_1.vector3_cross)(ac, ad);
    const adb = (0, vector_1.vector3_cross)(ad, ab);
    if ((0, vector_1.samedir)(abc, ao)) {
        simplex.supports[0] = a;
        simplex.supports[1] = b;
        simplex.supports[2] = c;
        simplex.length = 3;
        return gilbert_next(simplex, props);
    }
    if ((0, vector_1.samedir)(acd, ao)) {
        simplex.supports[0] = a;
        simplex.supports[1] = c;
        simplex.supports[2] = d;
        simplex.length = 3;
        return gilbert_next(simplex, props);
    }
    if ((0, vector_1.samedir)(adb, ao)) {
        simplex.supports[0] = a;
        simplex.supports[1] = d;
        simplex.supports[2] = b;
        simplex.length = 3;
        return gilbert_next(simplex, props);
    }
    return simplex;
};
const gilbert_next = (simplex, props) => {
    switch (simplex.length) {
        case 2:
            return nextLine(simplex);
        case 3:
            return gilbert_next_triangle(simplex, props);
        case 4:
            return gilbert_next_tetra(simplex, props);
        default: {
            throw new Error('length is: ' + simplex.length);
        }
    }
};
const gilbert = (props) => {
    var _a, _b;
    const initial_axis = ((_a = props.config) === null || _a === void 0 ? void 0 : _a.initialAxis) || (0, vector_1.VEC3)(1, 1, 1);
    const max_iter = ((_b = props.config) === null || _b === void 0 ? void 0 : _b.maxIterations) || 500;
    const { a, b } = props;
    let simplex = {
        supports: [],
        support: minkowski_1.emptyMinkowskiSupportPair,
        dir: initial_axis,
        length: 0,
    };
    const meshA = Object.assign(Object.assign({}, a.mesh), { translationMatrix: (0, body_1.physicsBodyGetTranslationMatrix)(a), modelMatrix: (0, body_1.physicsBodyGetMatrix)(a), rotationMatrix: (0, body_1.physicsBodyGetRotationMatrix)(a) });
    a.mesh = meshA;
    const meshB = Object.assign(Object.assign({}, b.mesh), { translationMatrix: (0, body_1.physicsBodyGetTranslationMatrix)(b), modelMatrix: (0, body_1.physicsBodyGetMatrix)(b), rotationMatrix: (0, body_1.physicsBodyGetRotationMatrix)(b) });
    b.mesh = meshB;
    let pair = (0, minkowski_1.getMinkowskiSupportPair)(meshA, meshB, initial_axis);
    let support = pair.point;
    simplex.support = pair;
    simplex.supports[0] = pair;
    simplex.length = 1;
    let dir = (0, vector_1.vector3_scale)(support, -1);
    simplex.dir = dir;
    if ((0, vector_1.vector3_mag)(dir) <= EPSILON)
        return null;
    for (let i = 0; i < max_iter; i++) {
        pair = (0, minkowski_1.getMinkowskiSupportPair)(meshA, meshB, simplex.dir);
        const support = pair.point;
        if ((0, vector_1.vector3_dot)(support, simplex.dir) <= 0) {
            return null;
        }
        if ((0, vector_1.vector3_mag)(dir) <= EPSILON) {
            return null;
        }
        simplex = (0, minkowski_1.minkowskiSimplexPushFront)(simplex, pair);
        if (gilbert_next(simplex, props)) {
            simplex.support = pair;
            return simplex;
        }
    }
    return null;
};
exports.gilbert = gilbert;
