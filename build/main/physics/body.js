"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.physicsBodyPointGlobalToLocal = exports.physicsBodyPointLocalToGlobal = exports.physicsBodyGetMatrix = exports.physicsBodyGetRotationMatrix = exports.physicsBodyGetTranslationMatrix = exports.physicsBodyGetIntegratedRotation = void 0;
const aabb_1 = require("../aabb");
const matrix_1 = require("../matrix");
const quat_1 = require("../quat");
const vector_1 = require("../vector");
const physicsBodyGetIntegratedRotation = (body, dt) => {
    const vel = body.angularVelocity;
    const body_q = body.rotation;
    let q = body_q.add((0, quat_1.quatMul)((0, vector_1.VEC4)(vel.x * dt * 0.5, vel.y * dt * 0.5, vel.z * dt * 0.5, 0.0), body_q));
    q = (0, quat_1.quatNormalize)(q);
    return q;
};
exports.physicsBodyGetIntegratedRotation = physicsBodyGetIntegratedRotation;
const physicsBodyGetTranslationMatrix = (body) => {
    return (0, matrix_1.mat4TranslateMake)(body.position);
};
exports.physicsBodyGetTranslationMatrix = physicsBodyGetTranslationMatrix;
const physicsBodyGetRotationMatrix = (body) => {
    return (0, matrix_1.quatMat4)((0, quat_1.quatNormalize)(body.rotation));
};
exports.physicsBodyGetRotationMatrix = physicsBodyGetRotationMatrix;
const physicsBodyGetMatrix = (body) => {
    const trans = (0, exports.physicsBodyGetTranslationMatrix)(body);
    const rot = (0, exports.physicsBodyGetRotationMatrix)(body);
    const c = (0, aabb_1.getAABBCenter)(body.bounds);
    const c2 = (0, aabb_1.getAABBCenter)(body.bounds).scale(-1);
    const cm = (0, matrix_1.mat4TranslateMake)(c);
    const cm2 = (0, matrix_1.mat4TranslateMake)(c2);
    return (0, matrix_1.matMulMat)((0, matrix_1.matMulMat)(cm2, (0, matrix_1.matMulMat)(rot, (0, matrix_1.matMulMat)(trans, cm))), cm2);
};
exports.physicsBodyGetMatrix = physicsBodyGetMatrix;
const physicsBodyPointLocalToGlobal = (body, point) => {
    const matrix = (0, exports.physicsBodyGetMatrix)(body);
    return (0, matrix_1.mat4MulV4)(matrix, point);
};
exports.physicsBodyPointLocalToGlobal = physicsBodyPointLocalToGlobal;
const physicsBodyPointGlobalToLocal = (body, point) => {
    const matrix = (0, matrix_1.mat4Inverse)((0, exports.physicsBodyGetMatrix)(body));
    return (0, matrix_1.mat4MulV4)(matrix, point);
};
exports.physicsBodyPointGlobalToLocal = physicsBodyPointGlobalToLocal;
