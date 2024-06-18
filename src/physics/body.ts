import { AABB, getAABBCenter } from "../aabb";
import { Mat4, mat4Inverse, mat4MulV4, mat4TranslateMake, matMulMat, quatMat4 } from "../matrix";
import { Mesh } from "../mesh";
import { quatMul, quatNormalize } from "../quat";
import { VEC4, Vector } from "../vector"

export type PhysicsBody = {
  position: Vector;
  rotation: Vector;
  linearVelocity: Vector;
  angularVelocity: Vector;
  canMove: boolean;
  canRotate: boolean;
  mesh: Mesh;
  bounds: AABB;
}

export const physicsBodyGetIntegratedRotation = (body: PhysicsBody, dt: number): Vector => {
  const vel = body.angularVelocity;
  const body_q = body.rotation;
  let q = body_q.add(quatMul(VEC4(vel.x * dt * 0.5, vel.y * dt * 0.5, vel.z * dt * 0.5, 0.0), body_q));
  q = quatNormalize(q);
  return q;
}

export const physicsBodyGetTranslationMatrix = (body: PhysicsBody): Mat4 => {
  return mat4TranslateMake(body.position);
}

export const physicsBodyGetRotationMatrix = (body: PhysicsBody): Mat4 => {
  return quatMat4(quatNormalize(body.rotation));
}

export const physicsBodyGetMatrix = (body: PhysicsBody): Mat4 => {
  const trans = physicsBodyGetTranslationMatrix(body);
  const rot = physicsBodyGetRotationMatrix(body);
  const c = getAABBCenter(body.bounds);
  const c2 = getAABBCenter(body.bounds).scale(-1);
  const cm = mat4TranslateMake(c);
  const cm2 = mat4TranslateMake(c2);
  return matMulMat(matMulMat(cm2, matMulMat(rot, matMulMat(trans, cm))), cm2);
}

export const physicsBodyPointLocalToGlobal = (body: PhysicsBody, point: Vector) => {
  const matrix = physicsBodyGetMatrix(body);
  return mat4MulV4(matrix, point);
}

export const physicsBodyPointGlobalToLocal = (body: PhysicsBody, point: Vector) => {
  const matrix = mat4Inverse(physicsBodyGetMatrix(body));
  return mat4MulV4(matrix, point);
}
