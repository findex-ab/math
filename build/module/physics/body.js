import { getAABBCenter } from "../aabb";
import { mat4Inverse, mat4MulV4, mat4TranslateMake, matMulMat, quatMat4 } from "../matrix";
import { quatMul, quatNormalize } from "../quat";
import { VEC4 } from "../vector";
export const physicsBodyGetIntegratedRotation = (body, dt) => {
    const vel = body.angularVelocity;
    const body_q = body.rotation;
    let q = body_q.add(quatMul(VEC4(vel.x * dt * 0.5, vel.y * dt * 0.5, vel.z * dt * 0.5, 0.0), body_q));
    q = quatNormalize(q);
    return q;
};
export const physicsBodyGetTranslationMatrix = (body) => {
    return mat4TranslateMake(body.position);
};
export const physicsBodyGetRotationMatrix = (body) => {
    return quatMat4(quatNormalize(body.rotation));
};
export const physicsBodyGetMatrix = (body) => {
    const trans = physicsBodyGetTranslationMatrix(body);
    const rot = physicsBodyGetRotationMatrix(body);
    const c = getAABBCenter(body.bounds);
    const c2 = getAABBCenter(body.bounds).scale(-1);
    const cm = mat4TranslateMake(c);
    const cm2 = mat4TranslateMake(c2);
    return matMulMat(matMulMat(cm2, matMulMat(rot, matMulMat(trans, cm))), cm2);
};
export const physicsBodyPointLocalToGlobal = (body, point) => {
    const matrix = physicsBodyGetMatrix(body);
    return mat4MulV4(matrix, point);
};
export const physicsBodyPointGlobalToLocal = (body, point) => {
    const matrix = mat4Inverse(physicsBodyGetMatrix(body));
    return mat4MulV4(matrix, point);
};
