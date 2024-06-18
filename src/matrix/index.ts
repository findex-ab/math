import { range } from '../utils/array';
import { VEC4, Vector } from '../vector';

export type V2 = [number, number];
export type Mat2 = [V2, V2];

export type V3 = [number, number, number];
export type Mat3 = [V3, V3, V3];

export type V4 = [number, number, number, number];
export type Mat4 = [V4, V4, V4, V4];

export type Matrix = Mat2 | Mat3 | Mat4;

export const MAT4_IDENTITY = (): Mat4 => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export const MAT4_ZERO = (): Mat4 => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const v4MulAdds = (a: V4, s: number) => {
  const dest: V4 = [0, 0, 0, 0];
  dest[0] += a[0] * s;
  dest[1] += a[1] * s;
  dest[2] += a[2] * s;
  dest[3] += a[3] * s;
  return dest;
};

export const v4Dot = (a: V4, b: V4): number => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

export const v4Norm = (v: V4): number => {
  return Math.sqrt(v4Dot(v, v));
};

export const quatMat4 = (quat: Vector): Mat4 => {
  const q = quat.toArray<V4>(4);

  const dest = MAT4_ZERO();
  let w: number = 0;
  let x: number = 0;
  let y: number = 0;
  let z: number = 0;
  let xx: number = 0;
  let yy: number = 0;
  let zz: number = 0;
  let xy: number = 0;
  let yz: number = 0;
  let xz: number = 0;
  let wx: number = 0;
  let wy: number = 0;
  let wz: number = 0;
  let norm: number = 0;
  let s: number = 0;

  norm = v4Norm(q);
  s = norm > 0.0 ? 2.0 / norm : 0.0;

  x = q[0];
  y = q[1];
  z = q[2];
  w = q[3];

  xx = s * x * x;
  xy = s * x * y;
  wx = s * w * x;
  yy = s * y * y;
  yz = s * y * z;
  wy = s * w * y;
  zz = s * z * z;
  xz = s * x * z;
  wz = s * w * z;

  dest[0][0] = 1.0 - yy - zz;
  dest[1][1] = 1.0 - xx - zz;
  dest[2][2] = 1.0 - xx - yy;

  dest[0][1] = xy + wz;
  dest[1][2] = yz + wx;
  dest[2][0] = xz + wy;

  dest[1][0] = xy - wz;
  dest[2][1] = yz - wx;
  dest[0][2] = xz - wy;

  dest[0][3] = 0.0;
  dest[1][3] = 0.0;
  dest[2][3] = 0.0;
  dest[3][0] = 0.0;
  dest[3][1] = 0.0;
  dest[3][2] = 0.0;
  dest[3][3] = 1.0;

  return dest;
};

export const mat4MulMat4 = (m1: Mat4, m2: Mat4): Mat4 => {
  const dest = MAT4_ZERO();
  let a00 = m1[0][0],
    a01 = m1[0][1],
    a02 = m1[0][2],
    a03 = m1[0][3],
    a10 = m1[1][0],
    a11 = m1[1][1],
    a12 = m1[1][2],
    a13 = m1[1][3],
    a20 = m1[2][0],
    a21 = m1[2][1],
    a22 = m1[2][2],
    a23 = m1[2][3],
    a30 = m1[3][0],
    a31 = m1[3][1],
    a32 = m1[3][2],
    a33 = m1[3][3],
    b00 = m2[0][0],
    b01 = m2[0][1],
    b02 = m2[0][2],
    b03 = m2[0][3],
    b10 = m2[1][0],
    b11 = m2[1][1],
    b12 = m2[1][2],
    b13 = m2[1][3],
    b20 = m2[2][0],
    b21 = m2[2][1],
    b22 = m2[2][2],
    b23 = m2[2][3],
    b30 = m2[3][0],
    b31 = m2[3][1],
    b32 = m2[3][2],
    b33 = m2[3][3];

  dest[0][0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  dest[0][1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  dest[0][2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  dest[0][3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  dest[1][0] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  dest[1][1] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  dest[1][2] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  dest[1][3] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  dest[2][0] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  dest[2][1] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  dest[2][2] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  dest[2][3] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  dest[3][0] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  dest[3][1] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  dest[3][2] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  dest[3][3] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

  return dest;
};

export const matMulMat = <T extends Matrix = Matrix>(a: T, b: T): T => {
  const aRowLen = a.length;
  const bRowLen = b.length;
  const aColLen = a[0].length;
  const bColLen = b[0].length;

  if (aRowLen !== bRowLen || aColLen !== bColLen)
    throw new Error(`Dimension mismatch`);

  const m: T = range(aRowLen).map(() => range(aColLen)) as T;

  for (var r = 0; r < aRowLen; ++r) {
    m[r] = range(aColLen) as (typeof a)[0];
    for (var c = 0; c < bColLen; ++c) {
      m[r][c] = 0;
      for (var i = 0; i < aColLen; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
};

export const matMulN = <T extends Matrix = Matrix>(matrices: T[]): T => {
  let a = MAT4_IDENTITY() as T;
  for (let i = 0; i < matrices.length; i++) {
    const b = matrices[i];
    a = matMulMat(a as T, b as T);
  }

  return a as T;
};

export const mat4RotateMake = (angle: number, axis: Vector): Mat4 => {
  const m = MAT4_ZERO();

  const c: number = Math.cos(angle);

  const axisn = axis.unit();
  const v_ = axisn.scale(1.0 - c);
  const vs_ = axisn.scale(1.0 - c).scale(Math.sin(angle));

  const v: V3 = [v_.x, v_.y, v_.z];
  const vs: V3 = [vs_.x, vs_.y, vs_.z];
  m[0] = axisn.scale(v[0]).toArray(3);
  m[1] = axisn.scale(v[1]).toArray(3);
  m[2] = axisn.scale(v[2]).toArray(3);

  m[0][0] += c;
  m[1][0] -= vs[2];
  m[2][0] += vs[1];
  m[0][1] += vs[2];
  m[1][1] += c;
  m[2][1] -= vs[0];
  m[0][2] -= vs[1];
  m[1][2] += vs[0];
  m[2][2] += c;

  m[0][3] = m[1][3] = m[2][3] = m[3][0] = m[3][1] = m[3][2] = 0.0;
  m[3][3] = 1.0;

  return m;
};

// point • matrix
export const mat4MulV4 = (m: Mat4, point: Vector): Vector => {
  const res: V4 = [0, 0, 0, 0];
  const v: V4 = [point.x, point.y, point.z, point.w];
  res[0] = m[0][0] * v[0] + m[1][0] * v[1] + m[2][0] * v[2] + m[3][0] * v[3];
  res[1] = m[0][1] * v[0] + m[1][1] * v[1] + m[2][1] * v[2] + m[3][1] * v[3];
  res[2] = m[0][2] * v[0] + m[1][2] * v[1] + m[2][2] * v[2] + m[3][2] * v[3];
  res[3] = m[0][3] * v[0] + m[1][3] * v[1] + m[2][3] * v[2] + m[3][3] * v[3];
  return VEC4(res[0], res[1], res[2], res[3]);
};

export const mat4Translate = (m: Mat4, t: Vector): Mat4 => {
  const v: V4 = [t.x, t.y, t.z, t.w];
  m[3] = v4MulAdds(m[0], v[0]);
  m[3] = v4MulAdds(m[1], v[1]);
  m[3] = v4MulAdds(m[2], v[2]);
  return m;
};

export const mat4TranslateMake = (t: Vector): Mat4 => {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [t.x, t.y, t.z, 1],
  ];
};

export const mat4ScaleScalar = (m: Mat4, s: number): Mat4 => {
  m[0][0] *= s;
  m[0][1] *= s;
  m[0][2] *= s;
  m[0][3] *= s;
  m[1][0] *= s;
  m[1][1] *= s;
  m[1][2] *= s;
  m[1][3] *= s;
  m[2][0] *= s;
  m[2][1] *= s;
  m[2][2] *= s;
  m[2][3] *= s;
  m[3][0] *= s;
  m[3][1] *= s;
  m[3][2] *= s;
  m[3][3] *= s;
  return m;
};

export const mat4Inverse = (mat: Mat4): Mat4 => {
  const dest = MAT4_ZERO();
  const t: number[] = [0, 0, 0, 0, 0, 0];
  let det: number = 0;
  let a = mat[0][0],
    b = mat[0][1],
    c = mat[0][2],
    d = mat[0][3],
    e = mat[1][0],
    f = mat[1][1],
    g = mat[1][2],
    h = mat[1][3],
    i = mat[2][0],
    j = mat[2][1],
    k = mat[2][2],
    l = mat[2][3],
    m = mat[3][0],
    n = mat[3][1],
    o = mat[3][2],
    p = mat[3][3];

  t[0] = k * p - o * l;
  t[1] = j * p - n * l;
  t[2] = j * o - n * k;
  t[3] = i * p - m * l;
  t[4] = i * o - m * k;
  t[5] = i * n - m * j;

  dest[0][0] = f * t[0] - g * t[1] + h * t[2];
  dest[1][0] = -(e * t[0] - g * t[3] + h * t[4]);
  dest[2][0] = e * t[1] - f * t[3] + h * t[5];
  dest[3][0] = -(e * t[2] - f * t[4] + g * t[5]);

  dest[0][1] = -(b * t[0] - c * t[1] + d * t[2]);
  dest[1][1] = a * t[0] - c * t[3] + d * t[4];
  dest[2][1] = -(a * t[1] - b * t[3] + d * t[5]);
  dest[3][1] = a * t[2] - b * t[4] + c * t[5];

  t[0] = g * p - o * h;
  t[1] = f * p - n * h;
  t[2] = f * o - n * g;
  t[3] = e * p - m * h;
  t[4] = e * o - m * g;
  t[5] = e * n - m * f;

  dest[0][2] = b * t[0] - c * t[1] + d * t[2];
  dest[1][2] = -(a * t[0] - c * t[3] + d * t[4]);
  dest[2][2] = a * t[1] - b * t[3] + d * t[5];
  dest[3][2] = -(a * t[2] - b * t[4] + c * t[5]);

  t[0] = g * l - k * h;
  t[1] = f * l - j * h;
  t[2] = f * k - j * g;
  t[3] = e * l - i * h;
  t[4] = e * k - i * g;
  t[5] = e * j - i * f;

  dest[0][3] = -(b * t[0] - c * t[1] + d * t[2]);
  dest[1][3] = a * t[0] - c * t[3] + d * t[4];
  dest[2][3] = -(a * t[1] - b * t[3] + d * t[5]);
  dest[3][3] = a * t[2] - b * t[4] + c * t[5];

  det =
    1.0 / (a * dest[0][0] + b * dest[1][0] + c * dest[2][0] + d * dest[3][0]);

  mat4ScaleScalar(dest, det);

  return dest;
};

export const mat4Ortho = (
  left: number,
  right: number,
  bottom: number,
  top: number,
  nearZ: number,
  farZ: number,
): Mat4 => {
  const dest = MAT4_ZERO();
  const rl = 1.0 / (right - left);
  const tb = 1.0 / (top - bottom);
  const fn = -1.0 / (farZ - nearZ);

  dest[0][0] = 2.0 * rl;
  dest[1][1] = 2.0 * tb;
  dest[2][2] = 2.0 * fn;
  dest[3][0] = -(right + left) * rl;
  dest[3][1] = -(top + bottom) * tb;
  dest[3][2] = (farZ + nearZ) * fn;
  dest[3][3] = 1.0;

  return dest;
};

export const mat4Perspective = (
  fovy: number,
  aspect: number,
  nearZ: number,
  farZ: number,
): Mat4 => {
  const dest = MAT4_ZERO();

  const f  = 1.0 / Math.tan(fovy * 0.5);
  const fn = 1.0 / (nearZ - farZ);

  dest[0][0] = f / aspect;
  dest[1][1] = f;
  dest[2][2] =-farZ * fn;
  dest[2][3] = 1.0;
  dest[3][2] = nearZ * farZ * fn;

  return dest;
};
