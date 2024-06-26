"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.physicsBody = exports.physicsBodyPointGlobalToLocal = exports.physicsBodyPointLocalToGlobal = exports.physicsBodyGetMatrix = exports.physicsBodyGetRotationMatrix = exports.physicsBodyGetTranslationMatrix = exports.physicsBodyGetIntegratedRotation = exports.physicsBodyIntegrate = exports.physicsBodyAddImpulse = exports.PhysicsBody = void 0;
const aabb_1 = require("../aabb");
const matrix_1 = require("../matrix");
const mesh_1 = require("../mesh");
const quat_1 = require("../quat");
const vector_1 = require("../vector");
class PhysicsBody {
    constructor(init) {
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
    support(dir) {
        const matrix = (0, exports.physicsBodyGetMatrix)(this);
        const points = this.mesh.points.map(it => it.clone()).map(it => (0, vector_1.VEC4)(it.x, it.y, it.z, 1).mulMat4(matrix));
        return (0, mesh_1.meshSupport)(Object.assign(Object.assign({}, this.mesh), { points }), dir);
    }
    addImpulse(impulse) {
        this.linearVelocity = this.linearVelocity.add(impulse.scale(this.invMass));
    }
    addImpulseAtPoint(impulse, point) {
        this.addImpulse(impulse);
        point = point.clone();
        point = point.sub(this.position).sub(this.center);
        const F = point.cross(impulse).scale(this.invMass).unit().scale(impulse.mag());
        this.angularVelocity = this.angularVelocity.add(F);
    }
    addPseudoImpulse(impulse) {
        this.position = this.position.add(impulse);
    }
    addPseudoImpulseAtPoint(impulse, point, dt = 1) {
        this.position = this.position.add(impulse);
        point = point.clone();
        point = point.sub(this.position).sub(this.center);
        const F = point.cross(impulse).scale(this.invMass);
        this.applyAngularVelocity(F, dt);
    }
    applyAngularVelocity(angularVelocity, dt) {
        const vel = angularVelocity.clone();
        const body_q = this.rotation.clone();
        let q = body_q.add((0, quat_1.quatMul)((0, vector_1.VEC4)(vel.x * dt * 0.5, vel.y * dt * 0.5, vel.z * dt * 0.5, 0.0), body_q));
        q = (0, quat_1.quatNormalize)(q);
        this.rotation = q;
    }
}
exports.PhysicsBody = PhysicsBody;
const physicsBodyAddImpulse = (body, impulse) => {
    body.linearVelocity = body.linearVelocity.add(impulse.scale(body.invMass));
};
exports.physicsBodyAddImpulse = physicsBodyAddImpulse;
const physicsBodyIntegrate = (body, dt) => {
    body.position = body.position.add(body.linearVelocity.scale(dt));
    body.rotation = (0, exports.physicsBodyGetIntegratedRotation)(body, dt);
    body.linearVelocity = body.linearVelocity.lerp((0, vector_1.VEC31)(0), dt * 0.33);
    body.angularVelocity = body.angularVelocity.lerp((0, vector_1.VEC31)(0), dt);
};
exports.physicsBodyIntegrate = physicsBodyIntegrate;
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
const physicsBody = (props) => {
    const mesh = props.mesh || { points: [] };
    const bounds = (0, aabb_1.aabbFromPoints)(mesh.points);
    const mass = props.mass || 1.0;
    const invMass = 1.0 / Math.max(0.0003, mass);
    return new PhysicsBody({
        position: props.position || (0, vector_1.VEC31)(0),
        rotation: props.rotation || (0, vector_1.VEC4)(0, 0, 0, 1),
        angularVelocity: props.angularVelocity || (0, vector_1.VEC31)(0),
        linearVelocity: props.linearVelocity || (0, vector_1.VEC31)(0),
        canMove: props.canMove === false ? false : true,
        canRotate: props.canRotate === false ? false : true,
        mass,
        invMass,
        mesh,
        bounds,
        center: props.center || bounds.min.add(bounds.max).scale(0.5)
    });
};
exports.physicsBody = physicsBody;
