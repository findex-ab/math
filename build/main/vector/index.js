"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vector3_tangents_fast = exports.vector3_tangents_slow = exports.vector3_mag = exports.vector3_unit = exports.vector3_scale = exports.vector3_add = exports.vector3_sub = exports.vector3_cross = exports.vector3_dot = exports.samedir = exports.VEC31 = exports.VEC2 = exports.VEC3 = exports.VEC4 = exports.Vector = void 0;
const etc_1 = require("../utils/etc");
const array_1 = require("../utils/array");
const hash_1 = require("../utils/hash");
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
    run(f) {
        return new Vector(f(this.x), f(this.y), f(this.z), f(this.w));
    }
    luma() {
        return this.dot((0, exports.VEC3)(0.299, 0.587, 0.114));
    }
    static fromHex(hex) {
        const val = (0, hash_1.hexToUint32)(hex);
        const numbers = (0, array_1.range)(4)
            .map((n) => (0, hash_1.nthByte)(val, n))
            .reverse();
        return new Vector(...numbers);
    }
    toRGB(precision = 3) {
        return `rgb(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`;
    }
    lerp(b, scale) {
        return new Vector((0, etc_1.lerp)(this.x, b.x, scale), (0, etc_1.lerp)(this.y, b.y, scale), (0, etc_1.lerp)(this.z || 0, b.z || 0, scale), (0, etc_1.lerp)(this.w || 0, b.w || 0, scale));
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
        return (0, exports.VEC3)(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
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
exports.Vector = Vector;
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
