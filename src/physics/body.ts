import { AABB, aabbFromPoints, getAABBCenter } from '../aabb';
import { INF } from '../constants';
import {
  Mat4,
  mat4Inverse,
  mat4MulV4,
  mat4TranslateMake,
  matMulMat,
  quatMat4,
} from '../matrix';
import { Mesh, meshSupport } from '../mesh';
import { quatMul, quatNormalize } from '../quat';
import { VEC31, VEC4, Vector } from '../vector';

export type IPhysicsBody = {
  position: Vector;
  rotation: Vector;
  linearVelocity: Vector;
  angularVelocity: Vector;
  canMove: boolean;
  canRotate: boolean;
  mesh: Mesh;
  bounds: AABB;
  mass: number;
  invMass: number;
  center: Vector;
};

export type PhysicsBodyProps = Partial<PhysicsBody>;

export class PhysicsBody implements IPhysicsBody {
  position: Vector;
  rotation: Vector;
  linearVelocity: Vector;
  angularVelocity: Vector;
  canMove: boolean;
  canRotate: boolean;
  mesh: Mesh;
  bounds: AABB;
  mass: number;
  invMass: number;
  center: Vector;
  constructor(init: IPhysicsBody) {
    this.position = init.position;
    this.rotation = init.rotation;
    this.linearVelocity = init.linearVelocity;
    this.angularVelocity = init.angularVelocity;
    this.canMove = init.canMove;
    this.canRotate = init.canRotate;
    this.mesh = init.mesh;
    this.bounds = init.bounds;
    this.mass = init.mass;
    this.invMass = init.invMass;
    this.center = init.center;
  }

  support(dir: Vector): Vector {
    const matrix = physicsBodyGetMatrix(this);
    const points = this.mesh.points.map(it => it.clone()).map(it => VEC4(it.x, it.y, it.z, 1).mulMat4(matrix))
    return meshSupport({ ...this.mesh, points }, dir);
  }

  addImpulse(impulse: Vector) {
    this.linearVelocity = this.linearVelocity.add(impulse.scale(this.invMass));
  }

  addImpulseAtPoint(impulse: Vector, point: Vector) {
    this.addImpulse(impulse);
    point = point.clone();
    point = point.sub(this.position).sub(this.center);
    const F = point.cross(impulse).scale(this.invMass).unit().scale(impulse.mag());
    this.angularVelocity = this.angularVelocity.add(F);
  }

  addPseudoImpulse(impulse: Vector) {
    this.position = this.position.add(impulse);
  }

  addPseudoImpulseAtPoint(impulse: Vector, point: Vector, dt: number = 1) {
    this.position = this.position.add(impulse);

    point = point.clone();
    point = point.sub(this.position).sub(this.center);
    const F = point.cross(impulse).scale(this.invMass);
    this.applyAngularVelocity(F, dt);
  }

  applyAngularVelocity(angularVelocity: Vector, dt: number) {
    const vel = angularVelocity.clone();
    const body_q = this.rotation.clone();
    let q = body_q.add(
      quatMul(
        VEC4(vel.x * dt * 0.5, vel.y * dt * 0.5, vel.z * dt * 0.5, 0.0),
        body_q,
      ),
    );
    q = quatNormalize(q);
    this.rotation = q;
  }
}

export const physicsBodyAddImpulse = (body: PhysicsBody, impulse: Vector) => {
  body.linearVelocity = body.linearVelocity.add(impulse.scale(body.invMass));
};

export const physicsBodyIntegrate = (body: PhysicsBody, dt: number) => {
  body.position = body.position.add(body.linearVelocity.scale(dt));
  body.rotation = physicsBodyGetIntegratedRotation(body, dt);

  body.linearVelocity = body.linearVelocity.lerp(VEC31(0), dt*0.33);
  body.angularVelocity = body.angularVelocity.lerp(VEC31(0), dt);
};

export const physicsBodyGetIntegratedRotation = (
  body: PhysicsBody,
  dt: number,
): Vector => {
  const vel = body.angularVelocity;
  const body_q = body.rotation;
  let q = body_q.add(
    quatMul(
      VEC4(vel.x * dt * 0.5, vel.y * dt * 0.5, vel.z * dt * 0.5, 0.0),
      body_q,
    ),
  );
  q = quatNormalize(q);
  return q;
};

export const physicsBodyGetTranslationMatrix = (body: PhysicsBody): Mat4 => {
  return mat4TranslateMake(body.position);
};

export const physicsBodyGetRotationMatrix = (body: PhysicsBody): Mat4 => {
  return quatMat4(quatNormalize(body.rotation));
};

export const physicsBodyGetMatrix = (body: PhysicsBody): Mat4 => {
  const trans = physicsBodyGetTranslationMatrix(body);
  const rot = physicsBodyGetRotationMatrix(body);
  const c = getAABBCenter(body.bounds);
  const c2 = getAABBCenter(body.bounds).scale(-1);
  const cm = mat4TranslateMake(c);
  const cm2 = mat4TranslateMake(c2);
  return matMulMat(matMulMat(cm2, matMulMat(rot, matMulMat(trans, cm))), cm2);
};

export const physicsBodyPointLocalToGlobal = (
  body: PhysicsBody,
  point: Vector,
) => {
  const matrix = physicsBodyGetMatrix(body);
  return mat4MulV4(matrix, point);
};

export const physicsBodyPointGlobalToLocal = (
  body: PhysicsBody,
  point: Vector,
) => {
  const matrix = mat4Inverse(physicsBodyGetMatrix(body));
  return mat4MulV4(matrix, point);
};

export const physicsBody = (props: PhysicsBodyProps): PhysicsBody => {
  const mesh = props.mesh || { points: [] };
  const bounds = aabbFromPoints(mesh.points);
  const mass = props.mass || 1.0;
  const invMass = 1.0 / Math.max(0.0003, mass);

  return new PhysicsBody({
    position: props.position || VEC31(0),
    rotation: props.rotation || VEC4(0, 0, 0, 1),
    angularVelocity: props.angularVelocity || VEC31(0),
    linearVelocity: props.linearVelocity || VEC31(0),
    canMove: props.canMove === false ? false : true,
    canRotate: props.canRotate === false ? false : true,
    mass,
    invMass,
    mesh,
    bounds,
    center: props.center || bounds.min.add(bounds.max).scale(0.5)
  });
};
