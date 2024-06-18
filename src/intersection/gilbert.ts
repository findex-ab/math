import { PhysicsBody } from '../physics/body';
import {
  MinkowskiSimplex,
  MinkowskiSupportPair,
  emptyMinkowskiSupportPair,
  getMinkowskiSupportPair,
  minkowskiSimplexPushFront,
} from '../utils/minkowski';
import {
  VEC3,
  Vector,
  samedir,
  vector3_cross,
  vector3_dot,
  vector3_mag,
  vector3_scale,
  vector3_sub,
} from '../vector';
import { EPAConfig } from './EPA';

const EPSILON = 0.00000001;

const nextLine = (simplex: MinkowskiSimplex): MinkowskiSimplex | null => {
  const a = simplex.supports[0];
  const b = simplex.supports[1];
  const ab = vector3_sub(b.point, a.point);
  const ao = vector3_scale(a.point, -1);

  if (samedir(ab, ao)) {
    simplex.dir = vector3_cross(vector3_cross(ab, ao), ab);
  } else {
    simplex.supports[0] = a;
    simplex.length = 1;
    simplex.dir = ao;
  }

  return null;
};

const gilbert_next_triangle = (
  simplex: MinkowskiSimplex,
): MinkowskiSimplex | null => {
  const a = simplex.supports[0];
  const b = simplex.supports[1];
  const c = simplex.supports[2];

  const ab = vector3_sub(b.point, a.point);
  const ac = vector3_sub(c.point, a.point);
  const ao = vector3_scale(a.point, -1);
  const abc = vector3_cross(ab, ac);

  if (samedir(vector3_cross(abc, ac), ao)) {
    if (samedir(ac, ao)) {
      simplex.supports[0] = a;
      simplex.supports[1] = c;

      simplex.length = 2;
      simplex.dir = vector3_cross(vector3_cross(ac, ao), ac);
    } else {
      simplex.supports[0] = a;
      simplex.supports[1] = b;

      simplex.length = 2;
      return gilbert_next(simplex);
    }
  } else {
    if (samedir(vector3_cross(ab, abc), ao)) {
      simplex.supports[0] = a;
      simplex.supports[1] = b;

      simplex.length = 2;
      return gilbert_next(simplex);
    } else {
      if (samedir(abc, ao)) {
        simplex.dir = abc;
      } else {
        simplex.supports[0] = a;
        simplex.supports[1] = c;
        simplex.supports[2] = b;

        simplex.length = 3;
        simplex.dir = vector3_scale(abc, -1);
      }
    }
  }

  return null; // options.ignore_z ? 1 : 0;//options.use_tetra ? 0 : 1;
};

const gilbert_next_tetra = (
  simplex: MinkowskiSimplex,
): MinkowskiSimplex | null => {
  const a = simplex.supports[0];
  const b = simplex.supports[1];
  const c = simplex.supports[2];
  const d = simplex.supports[3];

  const ab = vector3_sub(b.point, a.point);
  const ac = vector3_sub(c.point, a.point);
  const ad = vector3_sub(d.point, a.point);
  const ao = vector3_scale(a.point, -1);

  const abc = vector3_cross(ab, ac);
  const acd = vector3_cross(ac, ad);
  const adb = vector3_cross(ad, ab);

  if (samedir(abc, ao)) {
    simplex.supports[0] = a;
    simplex.supports[1] = b;
    simplex.supports[2] = c;

    simplex.length = 3;
    return gilbert_next(simplex);
  }

  if (samedir(acd, ao)) {
    simplex.supports[0] = a;
    simplex.supports[1] = c;
    simplex.supports[2] = d;

    simplex.length = 3;
    return gilbert_next(simplex);
  }

  if (samedir(adb, ao)) {
    simplex.supports[0] = a;
    simplex.supports[1] = d;
    simplex.supports[2] = b;

    simplex.length = 3;
    return gilbert_next(simplex);
  }

  return simplex;
};

const gilbert_next = (simplex: MinkowskiSimplex): MinkowskiSimplex | null => {
  switch (simplex.length) {
    case 2:
      return nextLine(simplex);
    case 3:
      return gilbert_next_triangle(simplex);
    case 4:
      return gilbert_next_tetra(simplex);
    default: {
      throw new Error('length is: ' + simplex.length);
    }
  }
};

export type GilbertConfig = {
  initialAxis?: Vector;
  maxIterations?: number;
  EPA?: EPAConfig;
};

export type GilbertProps = {
  config?: GilbertConfig;
  a: PhysicsBody;
  b: PhysicsBody;
};

export const gilbert = (props: GilbertProps): MinkowskiSimplex | null => {
  const initial_axis = props.config?.initialAxis || VEC3(1, 1, 1);
  const max_iter = props.config?.maxIterations || 500;
  const { a, b } = props;

  let simplex: MinkowskiSimplex | null = {
    supports: [],
    support: emptyMinkowskiSupportPair,
    dir: initial_axis,
    length: 0,
  };

  let pair: MinkowskiSupportPair = getMinkowskiSupportPair(
    a.mesh,
    b.mesh,
    initial_axis,
  );
  let support = pair.point;
  simplex.support = pair;
  simplex.supports[0] = pair;
  simplex.length = 1;

  let dir = vector3_scale(support, -1);
  simplex.dir = dir;

  if (vector3_mag(dir) <= EPSILON) return null;

  for (let i = 0; i < max_iter; i++) {
    pair = getMinkowskiSupportPair(a.mesh, b.mesh, simplex.dir);
    const support = pair.point;

    if (vector3_dot(support, simplex.dir) <= 0) {
      return null;
    }

    if (vector3_mag(dir) <= EPSILON) {
      return null;
    }

    simplex = minkowskiSimplexPushFront(simplex, pair);

    if (gilbert_next(simplex)) {
      simplex.support = pair;

      return simplex;
    }
  }

  return null;
};
