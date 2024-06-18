import { VEC31, Vector } from '../vector';
import { PhysicsBody } from './body';

export const getRelativeVelocity = (
  pointAWorld: Vector,
  pointBWorld: Vector,
  a: PhysicsBody,
  b: PhysicsBody,
) => {
  const can_rotate_a = a.canRotate;
  const can_rotate_b = b.canRotate;
  const can_move_a = a.canMove;
  const can_move_b = b.canMove;

  const a_to_contact = pointAWorld.sub(a.position);
  const b_to_contact = pointBWorld.sub(b.position);

  const lA = can_move_a ? a.linearVelocity : VEC31(0);
  const lB = can_move_b ? b.linearVelocity : VEC31(0);

  const angA = can_rotate_a ? a.angularVelocity : VEC31(0);
  const angB = can_rotate_b ? b.angularVelocity : VEC31(0);

  const cpA = can_move_a ? angA.cross(a_to_contact) : VEC31(0);
  const cpB = can_move_b ? angB.cross(b_to_contact) : VEC31(0);

  const lin = lB.sub(lA);
  const ang = cpB.sub(cpA);

  const rel = lin.add(ang);

  return rel;
};
