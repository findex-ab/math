import { INF, SPHERE_NORMALS } from '../constants';
import { MeshEdge } from '../mesh/edge';
import { Triangle, triangleBarycentric } from '../mesh/triangle';
import { PhysicsBody, physicsBodyPointLocalToGlobal } from '../physics/body';
import { Contact } from '../physics/contact';
import { getRelativeVelocity } from '../physics/utils';
import {
  MinkowskiSimplex,
  MinkowskiSupportPair,
  MinkowskiSupportTriangle,
  emptyMinkowskiTriangle,
  getMinkowskiSupportPair,
} from '../utils/minkowski';
import {
  VEC3,
  VEC31,
  VEC4,
  Vector,
  samedir,
  vector3_add,
  vector3_cross,
  vector3_dot,
  vector3_mag,
  vector3_scale,
  vector3_sub,
  vector3_tangents_fast,
  vector3_unit,
} from '../vector';

export type EPAConfig = {
  threshold: number;
  maxIterations: number;
};

export const defaultEPAConfig: EPAConfig = {
  threshold: 0.00019,
  maxIterations: 1000,
};

export type EPAProps = {
  config?: EPAConfig;
  simplex: MinkowskiSimplex;
  a: PhysicsBody;
  b: PhysicsBody;
};

const maxNormal = (a: Vector, b: Vector) => (a.mag() > b.mag() ? a : b);

const assert = (expr: boolean, msg: string = 'assert failed') => {
  if (!expr) throw new Error(msg);
};

const brute_force_normals = SPHERE_NORMALS;

const get_normal = (idx: number): Vector => {
  return brute_force_normals[idx % brute_force_normals.length];
};

type FaceData = {
  normals: Vector[];
  tri: MinkowskiSupportTriangle;
  minTriangle: number;
  bestNormal: Vector;
};

const getFaceNormalData = (
  simplex: MinkowskiSupportPair[],
  faces: number[],
): FaceData => {
  let min_distance = INF;
  let min_triangle = 0;

  const data: FaceData = {
    normals: [],
    bestNormal: VEC31(0),
    minTriangle: 0,
    tri: emptyMinkowskiTriangle,
  };

  assert(simplex.length > 0);

  if (faces.length < 3) {
    throw new Error(`faces < 3`);
  }
  for (let i = 0; i < faces.length; i += 3) {
    const idx0 = faces[i];
    const idx1 = faces[i + 1];
    const idx2 = faces[i + 2];

    assert(idx0 >= 0 && idx0 < simplex.length);
    assert(idx1 >= 0 && idx1 < simplex.length);
    assert(idx2 >= 0 && idx2 < simplex.length);

    const a = simplex[idx0 % simplex.length].point;
    const b = simplex[idx1 % simplex.length].point;
    const c = simplex[idx2 % simplex.length].point;

    let normal = vector3_cross(vector3_sub(b, a), vector3_sub(c, a)).unit();
    let distance = vector3_dot(normal, a);

    // bool flip = false;
    if (distance < 0) {
      normal = normal.scale(-1);
      distance *= -1.0;
      //flip = true;
    }

    data.normals.push(VEC4(normal.x, normal.y, normal.z, distance));

    if (distance < min_distance) {
      min_triangle = Math.trunc(i / 3);
      data.minTriangle = min_triangle;
      min_distance = distance;
      data.bestNormal = maxNormal(data.bestNormal, normal);
      data.tri.v1 = simplex[idx0];
      data.tri.v2 = simplex[idx1];
      data.tri.v3 = simplex[idx2];
      data.tri.normal = data.bestNormal;
    }
  }

  data.minTriangle = min_triangle;

  return data;
};

const edgeStr = (e: MeshEdge) => `${e.a}-${e.b}`;

const add_if_unique = (
  edges: MeshEdge[],
  faces: number[],
  a: number,
  b: number,
) => {
  const reversed: MeshEdge = {
    b: faces[a],
    a: faces[b],
  };

  const found = edges.find((it) => edgeStr(it) === edgeStr(reversed));

  if (found) {
    edges = edges.filter((it) => it !== found);
  } else {
    edges = [...edges, { a: faces[a], b: faces[b] }];
  }

  return edges;
};

const extractPoint = (
  tri: MinkowskiSupportTriangle,
  is_a: boolean,
): Vector | null => {
  const max_bary = 1.0002;

  const triangle: Triangle = {
    v1: tri.v1.point,
    v2: tri.v2.point,
    v3: tri.v3.point,
    normal: tri.normal,
  };

  const distanceFromOrigin = tri.normal.dot(tri.v1.point);
  const bary = triangleBarycentric(
    triangle,
    tri.normal.scale(distanceFromOrigin),
  );
  const bary_is_bad =
    Math.abs(bary.x) > max_bary ||
    Math.abs(bary.y) > max_bary ||
    Math.abs(bary.z) > max_bary ||
    isNaN(bary.x) ||
    isNaN(bary.y) ||
    isNaN(bary.z);

  if (bary_is_bad) {
    return null;
  }

  let point = VEC3(0, 0, 0);
  point = vector3_add(
    point,
    is_a ? tri.v1.a.furthest.scale(bary.x) : tri.v1.b.furthest.scale(bary.x),
  );
  point = vector3_add(
    point,
    is_a ? tri.v2.a.furthest.scale(bary.y) : tri.v2.b.furthest.scale(bary.y),
  );
  point = vector3_add(
    point,
    is_a ? tri.v3.a.furthest.scale(bary.z) : tri.v3.b.furthest.scale(bary.z),
  );

  return point;
};

const extractContactData = (tri: MinkowskiSupportTriangle) => {
  const out: Vector[] = [];
  const p1 = extractPoint(tri, true);
  if (p1) out.push(p1);
  const p2 = extractPoint(tri, false);
  if (p2) out.push(p2);
  return out;
};



export type EPAResult = {
  contactA: Contact;
  contactB: Contact;
};

export const EPA = (props: EPAProps): EPAResult | null => {
  const cfg = props.config || defaultEPAConfig;
  const _simplex = props.simplex;
  const { a, b } = props;

  if (_simplex.supports.length <= 0) throw new Error(`No supports!`);
  const simplex: MinkowskiSupportPair[] = _simplex.supports;

  /*
    0, 1, 2,
    0, 3, 1,
    0, 2, 3,
    1, 3, 2
  */

  let faces: number[] = [0, 1, 2, 0, 3, 1, 0, 2, 3, 1, 3, 2];
  let new_faces: number[] = [];

  let normal_data = getFaceNormalData([...simplex], [...faces]);
  let minTriangle = normal_data.minTriangle;
  let min_distance = INF;
  let min_normal = VEC31(0.0);

  let unique_edges: MeshEdge[] = [];
  for (let iter = 0; iter < cfg.maxIterations; iter += 1) {
    assert(normal_data.normals.length > 0);
    assert(minTriangle < normal_data.normals.length);
    assert(minTriangle >= 0);

    let mn = normal_data.normals[minTriangle];
    min_normal = VEC3(mn.x, mn.y, mn.z);

    if (min_normal.mag() <= 0.00000001) {
      console.error('Bad normal!', { min_normal, minTriangle, normal_data });
      return null;
    }

    let point_normal = get_normal(iter);
    min_distance = mn.w;

    let pair1 = getMinkowskiSupportPair(a.mesh, b.mesh, point_normal);
    let point = pair1.point;
    let support = point;
    let s_distance = point.dot(min_normal);

    let next_diff = Math.abs(s_distance - min_distance);

    if (next_diff <= cfg.threshold && min_distance < 1600.0) {
      let pa = pair1.a.furthest;
      let pb = pair1.b.furthest;
      let points = extractContactData(normal_data.tri);
      if (points.length >= 2) {
        pa = points[0];
        pb = points[1];
      }

      const pa_local = physicsBodyPointLocalToGlobal(a, pa);
      const pb_local = physicsBodyPointLocalToGlobal(b, pb);

      const wa = pa;
      const wb = pb;
      let point_depth_a = vector3_dot(vector3_sub(wb, wa), min_normal);
      let point_depth_b = vector3_dot(vector3_sub(wa, wb), min_normal);

      //let sepvel__ = vector3_sub(
      //  b.canMove ? b.linearVelocity : VEC31(0),

      //  a.canMove ? a.linearVelocity : VEC31(0),
      //);

      let sepvel = getRelativeVelocity(wa, wb, a, b);
      let velAlongNormal = vector3_dot(sepvel, min_normal);
      let velTangent = vector3_sub(
        sepvel,
        vector3_scale(min_normal, velAlongNormal),
      );
      let t1 = velTangent;
      let t2 = t1;

      const teps = 0.00000001;
      if (vector3_mag(t1) > teps * teps) {
        t1 = vector3_unit(t1);
        t2 = vector3_cross(min_normal, t1);
      } else {
        const tangents = vector3_tangents_fast(min_normal);
        t1 = vector3_unit(tangents.a);
        t2 = vector3_unit(tangents.b);
      }
      let t1_invalid: boolean = false;
      let t2_invalid: boolean = false;

      if (t1.mag() < teps) {
        t1 = VEC31(0);
        t1_invalid = true;
      }
      if (t2.mag() < teps) {
        t2 = VEC31(0);
        t2_invalid = true;
      }

      const point_avg = vector3_scale(vector3_add(pa, pb), 0.5);

      //const contact_a: EPAContact = {
      //  point: pa,
      //  pointLocal: pa_local,
      //  tangent: t1,
      //  tangent_valid: !t1_invalid,
      //  normal: min_normal,
      //  separation: point_depth_a,
      //  depth: min_distance,
      //  diff: next_diff,
      //};

      //const contact_b: EPAContact = {
      //  point: pb,
      //  pointLocal: pb_local,
      //  tangent: t2,
      //  tangent_valid: !t2_invalid,
      //  normal: min_normal.scale(-1),
      //  separation: point_depth_b,
      //  depth: min_distance,
      //  diff: next_diff,
      //};


      const contact_a: Contact = {
        constraint: {
        point_avg: point_avg,
        point: pa,
        impulse_point_a: pa,
        impulse_point_b: pb,
        point_a_local: pa_local,
        point_b_local: pb_local,
        point_a_world: pa,
        point_b_world: pb,
        separation: point_depth_a,
        depth: min_distance,
        computed: false,
        original_linear_velocity_a: a.linearVelocity,
        original_linear_velocity_b: b.linearVelocity,
        original_angular_velocity_a: a.angularVelocity,
        original_angular_velocity_b: b.angularVelocity,
          a_to_contact: VEC31(0),
          b_to_contact: VEC31(0),
          a_contact_to_normal: VEC31(0),
          b_contact_to_normal: VEC31(0),
          a_contact_to_tangent: VEC31(0),
          b_contact_to_tangent: VEC31(0),
          a_contact_to_normal_scalar: 0,
          b_contact_to_normal_scalar: 0,
          a_contact_to_tangent_scalar: 0,
          b_contact_to_tangent_scalar: 0,
          normal_mass: 0,
          normal_impulse: 0,
          tangent_impulse: 0,
          tangent_mass: 0,
          baumgarte: 0,
          error: 0,
          solved: false,
          velocity_and_restitution: 0
        },
        separation: point_depth_a,
        normal: min_normal,
        tangent: t1,
        invalid_tangent: t1_invalid,
        flipped: false,
        point: pa,
        is_old: false,
        id: -1,
        timestamp: 0,
        previous: {
          point: pa,
          world_points: {
            a: pa,
            b: pb
          },
          local_points: {
            a: pa_local,
            b: pb_local
          }
        }
      }

      const contact_b: Contact = {
        constraint: {
        point_avg: point_avg,
        point: pb,
        impulse_point_a: pb,
        impulse_point_b: pa,
        point_a_local: pb_local,
        point_b_local: pa_local,
        point_a_world: pb,
        point_b_world: pa,
        separation: point_depth_b,
        depth: min_distance,
        computed: false,
        original_linear_velocity_a: b.linearVelocity,
        original_linear_velocity_b: a.linearVelocity,
        original_angular_velocity_a: b.angularVelocity,
        original_angular_velocity_b: a.angularVelocity,
          a_to_contact: VEC31(0),
          b_to_contact: VEC31(0),
          a_contact_to_normal: VEC31(0),
          b_contact_to_normal: VEC31(0),
          a_contact_to_tangent: VEC31(0),
          b_contact_to_tangent: VEC31(0),
          a_contact_to_normal_scalar: 0,
          b_contact_to_normal_scalar: 0,
          a_contact_to_tangent_scalar: 0,
          b_contact_to_tangent_scalar: 0,
          normal_mass: 0,
          normal_impulse: 0,
          tangent_impulse: 0,
          tangent_mass: 0,
          baumgarte: 0,
          error: 0,
          solved: false,
          velocity_and_restitution: 0
        },
        separation: point_depth_b,
        normal: min_normal.scale(-1),
        tangent: t2,
        invalid_tangent: t2_invalid,
        flipped: true,
        point: pb,
        is_old: false,
        id: -1,
        timestamp: 0,
        previous: {
          point: pb,
          world_points: {
            a: pb,
            b: pa
          },
          local_points: {
            a: pb_local,
            b: pa_local
          }
        }
      }

      return {
        contactA: contact_a,
        contactB: contact_b
      }
    } else {
      //simplex.splice(minTriangle, 0, pair1);
      min_distance = INF;

      for (let i = 0; i < normal_data.normals.length; i++) {
        if (i < 0) {
          throw new Error('i < 0');
        }

        let ni = normal_data.normals[i];
        let n = VEC3(ni.x, ni.y, ni.z);
        if (samedir(n, support)) {
          const f = i * 3;

          unique_edges = add_if_unique(unique_edges, faces, f + 0, f + 1);
          unique_edges = add_if_unique(unique_edges, faces, f + 1, f + 2);
          unique_edges = add_if_unique(unique_edges, faces, f + 2, f + 0);

          faces[f + 2] = faces[Math.max(faces.length - 1, 0)];
          faces = faces.slice(0, faces.length - 1);
          //faces.pop();
          faces[f + 1] = faces[Math.max(faces.length - 1, 0)];
          faces = faces.slice(0, faces.length - 1);
          //faces.pop();
          faces[f + 0] = faces[Math.max(faces.length - 1, 0)];
          faces = faces.slice(0, faces.length - 1);
          //faces.pop();
          normal_data.normals[i] =
            normal_data.normals[Math.max(normal_data.normals.length - 1, 0)];
          normal_data.normals.pop();
          i--;
        }
      }

      if (unique_edges.length <= 0) {
        console.log('no unique edges (B) :(');
        return null;
      }

      for (let i = 0; i < unique_edges.length; i++) {
        new_faces.push(unique_edges[i].a);
        new_faces.push(unique_edges[i].b);
        new_faces.push(simplex.length);
      }

      unique_edges = [];
      simplex.push(pair1);

      const new_normal_data = getFaceNormalData([...simplex], [...new_faces]);
      assert(new_normal_data.normals.length > 0);
      normal_data.bestNormal = new_normal_data.bestNormal;

      let new_minTriangle = new_normal_data.minTriangle;
      let old_min_distance = INF;

      for (let i = 0; i < normal_data.normals.length; i++) {
        if (normal_data.normals[i].w < old_min_distance) {
          old_min_distance = normal_data.normals[i].w;
          minTriangle = i;
        }
      }

      if (new_normal_data.normals[new_minTriangle].w < old_min_distance) {
        minTriangle = new_minTriangle + normal_data.normals.length;
      }

      if (new_faces.length > 0) {
        faces = [...faces, ...new_faces];
        new_faces = [];
      }

      if (new_normal_data.normals.length > 0) {
        normal_data.normals = [
          ...normal_data.normals,
          ...new_normal_data.normals,
        ];
        new_normal_data.normals = [];
      }
    }
  }

  return null;
};
