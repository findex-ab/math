import { Vector } from '../vector';

export type Constraint = {
  point: Vector;
  point_avg: Vector;

  point_a_world: Vector;
  point_b_world: Vector;

  point_a_local: Vector;
  point_b_local: Vector;

  a_to_contact: Vector;
  b_to_contact: Vector;

  a_contact_to_normal: Vector;
  b_contact_to_normal: Vector;

  a_contact_to_tangent: Vector;
  b_contact_to_tangent: Vector;

  a_contact_to_normal_scalar: number;
  b_contact_to_normal_scalar: number;

  a_contact_to_tangent_scalar: number;
  b_contact_to_tangent_scalar: number;

  separation: number;
  depth: number;

  normal_impulse: number;
  normal_mass: number;

  tangent_impulse: number;
  tangent_mass: number;

  velocity_and_restitution: number;

  baumgarte: number;
  error: number;

  original_linear_velocity_a: Vector;
  original_linear_velocity_b: Vector;
  original_angular_velocity_a: Vector;
  original_angular_velocity_b: Vector;

  impulse_point_a: Vector;
  impulse_point_b: Vector;

  computed: boolean;
  solved: boolean;
};
