import { lerp as mix } from '../utils/etc';
import { range } from '../utils/array';
import { hexToUint32, nthByte } from '../utils/hash';
export class Vector {
    _x = 0;
    _y = 0;
    _z = 0;
    constructor(x = 0, y = 0, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    get x() {
        return this._x || 0;
    }
    get y() {
        return this._y || 0;
    }
    get z() {
        return this._z || 0;
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
    count() {
        if (typeof this._z === 'number')
            return 3;
        return 2;
    }
    scale(s) {
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(this.x * s, this.y * s);
            case 3:
                return VEC3(this.x * s, this.y * s, this.z * s);
            default:
                throw new Error(`Vector has ${count} components`);
        }
    }
    add(b) {
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(this.x + b.x, this.y + b.y);
            case 3:
                return VEC3(this.x + b.x, this.y + b.y, this.z + b.z);
            default:
                throw new Error(`Vector has ${count} components`);
        }
    }
    sub(b) {
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(this.x - b.x, this.y - b.y);
            case 3:
                return VEC3(this.x - b.x, this.y - b.y, this.z - b.z);
            default:
                throw new Error(`Vector has ${count} components`);
        }
    }
    mul(b) {
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(this.x * b.x, this.y * b.y);
            case 3:
                return VEC3(this.x * b.x, this.y * b.y, this.z * b.z);
            default:
                throw new Error(`Vector has ${count} components`);
        }
    }
    run(f) {
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(f(this.x), f(this.y));
            case 3:
                return VEC3(f(this.x), f(this.y), f(this.z));
            default:
                throw new Error(`Vector has ${count} components`);
        }
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
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(mix(this.x, b.x, scale), mix(this.y, b.y, scale));
            case 3:
                return VEC3(mix(this.x, b.x, scale), mix(this.y, b.y, scale), mix(this.z || 0, b.z || 0, scale));
            default:
                throw new Error(`Vector has ${count} components`);
        }
    }
    distance(b) {
        return Math.sqrt(Math.pow(this.x - b.x, 2.0) + Math.pow(this.y - b.y, 2.0) + Math.pow(this.z - b.z, 2.0));
    }
    clone() {
        const count = this.count();
        switch (count) {
            case 2:
                return VEC2(this.x, this.y);
            case 3:
                return VEC3(this.x, this.y, this.z);
            default:
                throw new Error(`Vector has ${count} components`);
        }
    }
    unit() {
        const mag = this.mag();
        if (mag <= 0.000000001)
            return this.clone().scale(0);
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
    str() {
        const count = this.count();
        switch (count) {
            case 2:
                return `${this.x} ${this.y}`;
            case 3:
                return `${this.x} ${this.y} ${this.z}`;
            default:
                {
                    throw new Error(`Vector has ${count} components.`);
                }
        }
    }
    toString() {
        return this.str();
    }
}
export const VEC3 = (x, y, z) => new Vector(x, y, z);
export const VEC2 = (x, y) => new Vector(x, y);
