import { lerp as mix } from '../utils/etc';
import { range } from '../utils/array';
import { hexToUint32, nthByte } from '../utils/hash';
export class Vector {
    _x = 0;
    _y = 0;
    _z = 0;
    _w = 0;
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this._x = x ?? 0;
        this._y = y ?? 0;
        this._z = z ?? 0;
        this._w = w ?? 0;
    }
    get x() {
        return this._x ?? 0;
    }
    get y() {
        return this._y ?? 0;
    }
    get z() {
        return this._z ?? 0;
    }
    get w() {
        return this._w ?? 0;
    }
    set x(value) {
        this._x = value;
    }
    set y(value) {
        this._y = value;
    }
    set z(value) {
        this._z = value;
    }
    set w(value) {
        this._w = value;
    }
    scale(s) {
        return new Vector(this.x * s, this.y * s, this.z * s, this.w * s);
    }
    add(b) {
        return new Vector(this.x + b.x, this.y + b.y, this.z + b.z, this.w + b.w);
    }
    sub(b) {
        return new Vector(this.x - b.x, this.y - b.y, this.z - b.z, this.w - b.w);
    }
    mul(b) {
        return new Vector(this.x * b.x, this.y * b.y, this.z * b.z, this.w * b.w);
    }
    run(f) {
        return new Vector(f(this.x), f(this.y), f(this.z), f(this.w));
    }
    luma() {
        return this.dot(VEC3(0.299, 0.587, 0.114));
    }
    static fromHex(hex) {
        const val = hexToUint32(hex);
        const numbers = range(4)
            .map((n) => nthByte(val, n))
            .reverse();
        return new Vector(...numbers);
    }
    toRGB(precision = 3) {
        return `rgb(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`;
    }
    lerp(b, scale) {
        return new Vector(mix(this.x, b.x, scale), mix(this.y, b.y, scale), mix(this.z || 0, b.z || 0, scale), mix(this.w || 0, b.w || 0, scale));
    }
    distance(b) {
        return Math.sqrt(Math.pow(this.x - b.x, 2.0) + Math.pow(this.y - b.y, 2.0) + Math.pow(this.z - b.z, 2.0));
    }
    clone() {
        return new Vector(this.x, this.y, this.z, this.w);
    }
    unit() {
        const mag = this.mag();
        if (mag <= 0.000000001)
            return this.clone();
        const invMag = 1.0 / mag;
        return this.scale(invMag);
    }
    mag() {
        return Math.sqrt(Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0) + Math.pow(this.z, 2.0));
    }
    dot(b) {
        const dx = this.x * b.x;
        const dy = this.y * b.y;
        const dz = this.z * b.z;
        return dx + dy + dz;
    }
    cross(b) {
        return VEC3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
    }
    str() {
        return `${this.x} ${this.y} ${this.z} ${this.w}`;
    }
    toString() {
        return this.str();
    }
    toArray(n) {
        switch (n) {
            case 1: return [this.x];
            case 2: return [this.x, this.y];
            case 3: return [this.x, this.y, this.z];
            default:
            case 4: return [this.x, this.y, this.z, this.w];
        }
    }
}
export const VEC4 = (x, y, z, w) => new Vector(x, y, z, w);
export const VEC3 = (x, y, z) => new Vector(x, y, z);
export const VEC2 = (x, y) => new Vector(x, y);
export const VEC31 = (x) => VEC3(x, x, x);
export const samedir = (a, b) => {
    return a.dot(b) > 0;
};
export const vector3_dot = (a, b) => a.dot(b);
export const vector3_cross = (a, b) => a.cross(b);
export const vector3_sub = (a, b) => a.sub(b);
export const vector3_add = (a, b) => a.add(b);
export const vector3_scale = (a, s) => a.scale(s);
export const vector3_unit = (a) => a.unit();
export const vector3_mag = (a) => a.mag();
export const vector3_tangents_slow = (n) => {
    const absX = Math.abs(n.x);
    const absY = Math.abs(n.y);
    const absZ = Math.abs(n.z);
    const axis = VEC3(0.0, 0.0, 0.0);
    if (absX > absY) {
        if (absX > absZ)
            axis.x = 1.0; // X > Y > Z, X > Z > Y
        else
            axis.z = 1.0; // Z > X > Y
    }
    else {
        if (absY > absZ)
            axis.y = 1.0; // Y > X > Z, Y > Z > X
        else
            axis.z = 1.0; // Z > Y > X
    }
    // compute tangents
    const t1 = vector3_unit(vector3_cross(n, axis));
    const t2 = vector3_unit(vector3_cross(n, t1));
    return { a: t1, b: t2 };
};
export const vector3_tangents_fast = (n) => {
    const t1 = vector3_unit(n.x >= 0.57735 ? VEC3(n.y, -n.x, 0.0) : VEC3(0.0, n.z, -n.y));
    const t2 = vector3_cross(n, t1);
    return { a: t1, b: t2 };
};
