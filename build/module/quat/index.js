import { v4Dot } from "../matrix";
import { Vector } from "../vector";
export const quatNormalize = (q) => {
    const v = q.toArray(4);
    const dot = v4Dot(v, v);
    if (dot <= 0.0) {
        return new Vector(0, 0, 0, 1);
    }
    return q.scale(1.0 / Math.sqrt(dot));
};
export const quatMul = (q1, q2) => {
    const dest = [0, 0, 0, 0];
    const p = [q1.x, q1.y, q1.z, q1.w];
    const q = [q2.x, q2.y, q2.z, q2.w];
    dest[0] = p[3] * q[0] + p[0] * q[3] + p[1] * q[2] - p[2] * q[1];
    dest[1] = p[3] * q[1] - p[0] * q[2] + p[1] * q[3] + p[2] * q[0];
    dest[2] = p[3] * q[2] + p[0] * q[1] - p[1] * q[0] + p[2] * q[3];
    dest[3] = p[3] * q[3] - p[0] * q[0] - p[1] * q[1] - p[2] * q[2];
    return new Vector(dest[0], dest[1], dest[2], dest[3]);
};
