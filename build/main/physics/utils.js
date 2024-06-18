"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativeVelocity = void 0;
const vector_1 = require("../vector");
const getRelativeVelocity = (pointAWorld, pointBWorld, a, b) => {
    const can_rotate_a = a.canRotate;
    const can_rotate_b = b.canRotate;
    const can_move_a = a.canMove;
    const can_move_b = b.canMove;
    const a_to_contact = pointAWorld.sub(a.position);
    const b_to_contact = pointBWorld.sub(b.position);
    const lA = can_move_a ? a.linearVelocity : (0, vector_1.VEC31)(0);
    const lB = can_move_b ? b.linearVelocity : (0, vector_1.VEC31)(0);
    const angA = can_rotate_a ? a.angularVelocity : (0, vector_1.VEC31)(0);
    const angB = can_rotate_b ? b.angularVelocity : (0, vector_1.VEC31)(0);
    const cpA = can_move_a ? angA.cross(a_to_contact) : (0, vector_1.VEC31)(0);
    const cpB = can_move_b ? angB.cross(b_to_contact) : (0, vector_1.VEC31)(0);
    const lin = lB.sub(lA);
    const ang = cpB.sub(cpA);
    const rel = lin.add(ang);
    return rel;
};
exports.getRelativeVelocity = getRelativeVelocity;
