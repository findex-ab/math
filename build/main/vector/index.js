"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorIsUnique = exports.vectorsAverage = exports.vector3_tangents_fast = exports.vector3_tangents_slow = exports.vector3_mag = exports.vector3_unit = exports.vector3_scale = exports.vector3_add = exports.vector3_sub = exports.vector3_cross = exports.vector3_dot = exports.samedir = exports.VEC31 = exports.VEC2 = exports.VEC3 = exports.VEC4 = exports.isVector = exports.Vector = void 0;
const etc_1 = require("../utils/etc");
const array_1 = require("../utils/array");
const hash_1 = require("../utils/hash");
const matrix_1 = require("../matrix");
const is_1 = require("../utils/is");
class Vector {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._w = 0;
        this._x = x !== null && x !== void 0 ? x : 0;
        this._y = y !== null && y !== void 0 ? y : 0;
        this._z = z !== null && z !== void 0 ? z : 0;
        this._w = w !== null && w !== void 0 ? w : 0;
    }
    get xy() {
        return (0, exports.VEC2)(this.x, this.y);
    }
    get yx() {
        return (0, exports.VEC2)(this.y, this.x);
    }
    get xyz() {
        return (0, exports.VEC3)(this.x, this.y, this.z);
    }
    get yxz() {
        return (0, exports.VEC3)(this.y, this.x, this.z);
    }
    get yzx() {
        return (0, exports.VEC3)(this.y, this.z, this.x);
    }
    get zyx() {
        return (0, exports.VEC3)(this.z, this.y, this.x);
    }
    get xzy() {
        return (0, exports.VEC3)(this.x, this.z, this.y);
    }
    get x() {
        var _a;
        return (_a = this._x) !== null && _a !== void 0 ? _a : 0;
    }
    get y() {
        var _a;
        return (_a = this._y) !== null && _a !== void 0 ? _a : 0;
    }
    get z() {
        var _a;
        return (_a = this._z) !== null && _a !== void 0 ? _a : 0;
    }
    get w() {
        var _a;
        return (_a = this._w) !== null && _a !== void 0 ? _a : 0;
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
    mulMat4(matrix) {
        return (0, matrix_1.mat4MulV4)(matrix, this);
    }
    static mulMat4(points, matrix, w = 1) {
        return points.map(p => (0, exports.VEC4)(p.x, p.y, p.z, w).mulMat4(matrix));
    }
    static sum(vectors) {
        let v = new Vector(0, 0, 0, 0);
        vectors.forEach((b) => v = v.add(b));
        return v;
    }
    static avg(vectors) {
        return Vector.sum(vectors).scale(1.0 / Math.max(1, vectors.length));
    }
    rotate(radians, axis) {
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        const k = axis.unit();
        let v1 = this.scale(c);
        let v2 = k.cross(this).scale(s);
        v1 = v1.add(v2);
        v2 = k.scale(k.dot(this) * (1.0 - c));
        return v1.add(v2);
    }
    run(f) {
        return new Vector(f(this.x, 0), f(this.y, 1), f(this.z, 2), f(this.w, 3));
    }
    clamp(min, max) {
        return new Vector((0, etc_1.clamp)(this.x, min.x, max.x), (0, etc_1.clamp)(this.y, min.y, max.y), (0, etc_1.clamp)(this.z, min.z, max.z), (0, etc_1.clamp)(this.w, min.w, max.w));
    }
    luma() {
        return this.dot((0, exports.VEC3)(0.299, 0.587, 0.114));
    }
    div(b) {
        return new Vector(this.x / b.x, this.y / b.y, this.z / b.z, this.w / b.w);
    }
    static fromHex(hex) {
        const val = (0, hash_1.hexToUint32)(hex);
        const numbers = (0, array_1.range)(4)
            .map((n) => (0, hash_1.nthByte)(val, n))
            .reverse();
        return new Vector(...numbers);
    }
    static fromArray(arr) {
        return new Vector(arr[0], arr[1], arr[2], arr[3]);
    }
    static fromRGB(val) {
        val = val.replace('rgba', '');
        val = val.replace('rgb', '');
        val = val.replace('(', '');
        val = val.replace(')', '');
        const values = val.split(',').map(it => it.trim()).map(it => Number(it));
        return Vector.fromArray(values);
    }
    static fromColor(val) {
        if (val.includes('#'))
            return Vector.fromHex(val);
        if (val.includes('rgb'))
            return Vector.fromRGB(val);
        return new Vector(0, 0, 0, 0);
    }
    toRGB(precision = 3) {
        return `rgb(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`;
    }
    toRGBA(precision = 3, alpha = 0) {
        return `rgba(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)}, ${(alpha || this.w).toFixed(precision)})`;
    }
    lerp(b, scale) {
        return new Vector((0, etc_1.lerp)(this.x, b.x, scale), (0, etc_1.lerp)(this.y, b.y, scale), (0, etc_1.lerp)(this.z || 0, b.z || 0, scale), (0, etc_1.lerp)(this.w || 0, b.w || 0, scale));
    }
    distance(b) {
        return Math.sqrt(Math.pow(this.x - b.x, 2.0) +
            Math.pow(this.y - b.y, 2.0) +
            Math.pow(this.z - b.z, 2.0));
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
        return (0, exports.VEC3)(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
    }
    clampToBound(bound) {
        const x = (0, etc_1.clamp)(this.x, bound.min.x, bound.max.x);
        const y = (0, etc_1.clamp)(this.y, bound.min.y, bound.max.y);
        const z = (0, etc_1.clamp)(this.z, bound.min.z, bound.max.z);
        const w = (0, etc_1.clamp)(this.w, bound.min.w, bound.max.w);
        return new Vector(x, y, z, w);
    }
    str() {
        return `${this.x} ${this.y} ${this.z} ${this.w}`;
    }
    toString(count = 0, separator = ' ') {
        if (count > 0) {
            return (0, array_1.range)(count).map(i => this.at(i)).join(separator);
        }
        return this.str();
    }
    at(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            case 3: return this.w;
        }
        return 0;
    }
    toArray(n = 4) {
        switch (n) {
            case 1:
                return [this.x];
            case 2:
                return [this.x, this.y];
            case 3:
                return [this.x, this.y, this.z];
            default:
            case 4:
                return [this.x, this.y, this.z, this.w];
        }
    }
    isSafe() {
        const items = this.toArray();
        return items.filter(it => (0, is_1.isSafeNumber)(it)).length >= items.length;
    }
}
exports.Vector = Vector;
const isVector = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return (typeof x.x === 'number' && typeof x.y === 'number' && typeof x.z === 'number' && typeof x.w === 'number');
};
exports.isVector = isVector;
const VEC4 = (x, y, z, w) => new Vector(x, y, z, w);
exports.VEC4 = VEC4;
const VEC3 = (x, y, z) => new Vector(x, y, z);
exports.VEC3 = VEC3;
const VEC2 = (x, y) => new Vector(x, y);
exports.VEC2 = VEC2;
const VEC31 = (x) => (0, exports.VEC3)(x, x, x);
exports.VEC31 = VEC31;
const samedir = (a, b) => {
    return a.dot(b) > 0;
};
exports.samedir = samedir;
const vector3_dot = (a, b) => a.dot(b);
exports.vector3_dot = vector3_dot;
const vector3_cross = (a, b) => a.cross(b);
exports.vector3_cross = vector3_cross;
const vector3_sub = (a, b) => a.sub(b);
exports.vector3_sub = vector3_sub;
const vector3_add = (a, b) => a.add(b);
exports.vector3_add = vector3_add;
const vector3_scale = (a, s) => a.scale(s);
exports.vector3_scale = vector3_scale;
const vector3_unit = (a) => a.unit();
exports.vector3_unit = vector3_unit;
const vector3_mag = (a) => a.mag();
exports.vector3_mag = vector3_mag;
const vector3_tangents_slow = (n) => {
    const absX = Math.abs(n.x);
    const absY = Math.abs(n.y);
    const absZ = Math.abs(n.z);
    const axis = (0, exports.VEC3)(0.0, 0.0, 0.0);
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
    const t1 = (0, exports.vector3_unit)((0, exports.vector3_cross)(n, axis));
    const t2 = (0, exports.vector3_unit)((0, exports.vector3_cross)(n, t1));
    return { a: t1, b: t2 };
};
exports.vector3_tangents_slow = vector3_tangents_slow;
const vector3_tangents_fast = (n) => {
    const t1 = (0, exports.vector3_unit)(n.x >= 0.57735 ? (0, exports.VEC3)(n.y, -n.x, 0.0) : (0, exports.VEC3)(0.0, n.z, -n.y));
    const t2 = (0, exports.vector3_cross)(n, t1);
    return { a: t1, b: t2 };
};
exports.vector3_tangents_fast = vector3_tangents_fast;
const vectorsAverage = (points) => {
    let p = new Vector(0, 0, 0, 0);
    if (points.length <= 0)
        return p;
    for (const point of points) {
        p = p.add(point);
    }
    return p.scale(1.0 / points.length);
};
exports.vectorsAverage = vectorsAverage;
const vectorIsUnique = (v, arr, epsilon = 0.00001) => {
    for (let i = 0; i < arr.length; i++) {
        const b = arr[i];
        if (v.distance(b) <= epsilon)
            return false;
    }
    return true;
};
exports.vectorIsUnique = vectorIsUnique;
