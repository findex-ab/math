import { INF } from "../constants";
import { clamp } from "../utils/etc";
import { VEC2, VEC3, VEC31, vector3_add, vector3_sub } from "../vector";
export const AABBToLocal = (bounds) => {
    const size = getAABBSize(bounds);
    return {
        min: VEC31(0),
        max: size
    };
};
export const aabbUniform = (bounds) => {
    const size = bounds.max.sub(bounds.min);
    const max = Math.max(...size.toArray());
    return {
        min: bounds.min,
        max: bounds.min.add(VEC31(max))
    };
};
export const aabbSlice2D = (bounds, epsilon = 0.0001) => {
    const out = [];
    const layout = [
        VEC3(0, 0, 0),
        VEC3(0, 1, 0),
        VEC3(1, 0, 0),
        VEC3(1, 1, 0)
    ];
    const size = bounds.max.sub(bounds.min);
    const half = size.scale(0.5);
    const mid = bounds.min.add(half);
    const min = bounds.min;
    for (let i = 0; i < 4; i++) {
        const comb = layout[i];
        const child = { min: VEC2(0, 0), max: VEC2(0, 0) };
        child.min.x = Math.abs(comb.at(0)) <= epsilon ? min.x : mid.x;
        child.min.y = Math.abs(comb.at(1)) <= epsilon ? min.y : mid.y;
        child.min.z = Math.abs(comb.at(2)) <= epsilon ? min.z : mid.z;
        child.max = child.min.add(half);
        out.push(child);
    }
    return out;
};
export const aabbSub = (a, b) => {
    return {
        min: a.min.sub(b.min),
        max: a.max.sub(b.max)
    };
};
export const aabbFromSize = (size) => {
    const min = VEC31(0);
    const max = size;
    return { min, max };
};
export const aabbCorrect = (a) => {
    const maxX = Math.max(a.min.x, a.max.x);
    const maxY = Math.max(a.min.y, a.max.y);
    const maxZ = Math.max(a.min.z, a.max.z);
    const minX = Math.min(a.min.x, a.max.x);
    const minY = Math.min(a.min.y, a.max.y);
    const minZ = Math.min(a.min.z, a.max.z);
    const min = VEC3(minX, minY, minZ);
    const max = VEC3(maxX, maxY, maxZ);
    return { min, max };
};
export const aabbTranslate = (a, v) => {
    const min = a.min.add(v);
    const max = a.max.add(v);
    return aabbCorrect({
        min,
        max
    });
};
export const getAABBCenter = (a) => {
    return a.min.add(a.max).scale(0.5);
};
export const getAABBSize = (a) => {
    return a.max.sub(a.min);
};
export const AABBvsAABB = (a, b) => {
    if (a.max.x < b.min.x || a.min.x > b.max.x)
        return false;
    if (a.max.y < b.min.y || a.min.y > b.max.y)
        return false;
    if (a.max.z < b.min.z || a.min.z > b.max.z)
        return false;
    return true;
};
export const pointVSAABB = (point, bounds) => {
    if (point.x < bounds.min.x || point.x > bounds.max.x)
        return false;
    if (point.y < bounds.min.y || point.y > bounds.max.y)
        return false;
    return true;
};
export const getAABBPoints = (a) => {
    return [
        VEC2(a.min.x, a.min.y),
        VEC2(a.max.x, a.min.y),
        VEC2(a.max.x, a.max.y),
        VEC2(a.min.x, a.max.y)
    ];
};
export const getAABBPoints3D = (aabb) => {
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
    const out = [];
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
    out[10] = vector3_add(min, v11);
    out[11] = vector3_add(min, v12);
    out[12] = vector3_add(min, v13);
    out[13] = vector3_add(min, v14);
    out[14] = vector3_add(min, v15);
    out[15] = vector3_add(min, v16);
    out[16] = vector3_add(min, v17);
    out[17] = vector3_add(min, v18);
    out[18] = vector3_add(min, v19);
    out[19] = vector3_add(min, v20);
    out[20] = vector3_add(min, v21);
    out[21] = vector3_add(min, v22);
    out[22] = vector3_add(min, v23);
    out[23] = vector3_add(min, v24);
    return out;
};
export const aabbFromPoints = (points) => {
    if (points.length <= 0)
        return { min: VEC31(0), max: VEC31(0) };
    const min = VEC3(INF, INF, INF);
    const max = min.scale(-1);
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        min.x = Math.min(min.x, p.x);
        min.y = Math.min(min.y, p.y);
        min.z = Math.min(min.z, p.z);
        max.x = Math.max(max.x, p.x);
        max.y = Math.max(max.y, p.y);
        max.z = Math.max(max.z, p.z);
    }
    return { min, max };
};
const getAABBVolume2D = (a) => {
    return (a.max.x - a.min.x) * (a.max.y - a.min.y);
};
const getAABBIntersectionVolume2D = (a, b) => {
    const x_overlap = Math.max(0, Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x));
    const y_overlap = Math.max(0, Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y));
    return x_overlap * y_overlap;
};
export const smoothAABBvsAABB = (a, b, epsilon = 0.00001) => {
    const interVol = getAABBIntersectionVolume2D(a, b);
    const minVol = Math.min(getAABBVolume2D(a), getAABBVolume2D(b));
    if (Math.abs(minVol) <= epsilon)
        return 0;
    const f = interVol / minVol;
    if (isNaN(f) || !isFinite(f))
        return 1.0;
    return f;
};
export const smoothPointvsAABB2D = (point, aabb) => {
    const closestPoint = VEC2(clamp(point.x, aabb.min.x, aabb.max.x), clamp(point.y, aabb.min.y, aabb.max.y));
    const center = aabb.min.add(aabb.max).scale(0.5);
    const maxDistance = center.distance(aabb.min);
    const pointDistance = point.distance(closestPoint);
    return 1 - clamp(pointDistance / maxDistance, 0, 1);
};
