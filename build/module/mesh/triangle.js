import { VEC3 } from '../vector';
export const triangleBarycentric = (tri, p) => {
    const a = tri.v1;
    const b = tri.v2;
    const c = tri.v3;
    const v0 = b.sub(a);
    const v1 = c.sub(a);
    const v2 = p.sub(a);
    const d00 = v0.dot(v0);
    const d01 = v0.dot(v1);
    const d11 = v1.dot(v1);
    const d20 = v2.dot(v0);
    const d21 = v2.dot(v1);
    const denom = d00 * d11 - d01 * d01;
    const v = (d11 * d20 - d01 * d21) / denom;
    const w = (d00 * d21 - d01 * d20) / denom;
    const u = 1.0 - v - w;
    return VEC3(u, v, w);
};
