import { VEC2, VEC3, VEC31, Vector, vector3_add, vector3_sub } from "../vector"

export type AABB = {
  min: Vector
  max: Vector
}

export const getAABBCenter = (a: AABB) => {
  return a.min.add(a.max).scale(0.5);
}

export const getAABBSize = (a: AABB) => {
  return a.max.sub(a.min);
}

export const AABBvsAABB = (a: AABB, b: AABB): boolean => {
  if (a.max.x < b.min.x || a.min.x > b.max.x) return false
  if (a.max.y < b.min.y || a.min.y > b.max.y) return false
  if (a.max.z < b.min.z || a.min.z > b.max.z) return false
  return true
}

export const pointVSAABB = (point: Vector, bounds: AABB): boolean => {
  if (point.x < bounds.min.x || point.x > bounds.max.x) return false
  if (point.y < bounds.min.y || point.y > bounds.max.y) return false
  return true
}

export const getAABBPoints = (a: AABB): Vector[] => {
  return [
    VEC2(a.min.x, a.min.y),
    VEC2(a.max.x, a.min.y),
    VEC2(a.max.y, a.max.y),
    VEC2(a.min.y, a.max.y)
  ]
}

export const getAABBPoints3D = (aabb: AABB): Vector[] => {
  const size = vector3_sub(aabb.max, aabb.min);

  const v1 = VEC3(0, size.y, 0);
  const v2 = VEC3(size.x, size.y, 0);
  const v3 = VEC3(size.x, 0, 0);
  const v4 = VEC3(0, 0, 0);

  // left
  const v5 = VEC3(0, size.y, 0);
  const v6 = VEC3(0, size.y, size.z);
  const v7 = VEC3(0, 0, size.z);
  const v8 = VEC3(0, 0, 0);

  // back
  const v9 = VEC3(0, size.y, size.z);
  const v10 = VEC3(size.x, size.y, size.z);
  const v11 = VEC3(size.x, 0, size.z);
  const v12 = VEC3(0, 0, size.z);

  // right
  const v13 = VEC3(size.x, size.y, 0);
  const v14 = VEC3(size.x, size.y, size.z);
  const v15 = VEC3(size.x, 0, size.z);
  const v16 = VEC3(size.x, 0, 0);

  // top
  const v17 = VEC3(0, size.y, 0);
  const v18 = VEC3(0, size.y, size.z);
  const v19 = VEC3(size.x, size.y, size.z);
  const v20 = VEC3(size.x, size.y, 0);

  // bottom
  const v21 = VEC3(0, 0, 0);
  const v22 = VEC3(0, 0, size.z);
  const v23 = VEC3(size.x, 0, size.z);
  const v24 = VEC3(size.x, 0, 0);

  const min = VEC31(0);

  const out: Vector[] = [];

  out[0] = vector3_add(min, v1);
  out[1] = vector3_add(min, v2);
  out[2] = vector3_add(min, v3);
  out[3] = vector3_add(min, v4);
  out[4] = vector3_add(min, v5);
  out[5] = vector3_add(min, v6);
  out[6] = vector3_add(min, v7);
  out[7] = vector3_add(min, v8);
  out[8] = vector3_add(min, v9);
  out[9] = vector3_add(min, v10);
  out[10] =vector3_add(min, v11);
  out[11] =vector3_add(min, v12);
  out[12] =vector3_add(min, v13);
  out[13] =vector3_add(min, v14);
  out[14] =vector3_add(min, v15);
  out[15] =vector3_add(min, v16);
  out[16] =vector3_add(min, v17);
  out[17] =vector3_add(min, v18);
  out[18] =vector3_add(min, v19);
  out[19] =vector3_add(min, v20);
  out[20] =vector3_add(min, v21);
  out[21] =vector3_add(min, v22);
  out[22] =vector3_add(min, v23);
  out[23] =vector3_add(min, v24);

  return out;
}