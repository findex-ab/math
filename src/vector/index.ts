import { clamp, lerp as mix } from '../utils/etc';
import { range } from '../utils/array';
import { hexToUint32, nthByte } from '../utils/hash';

export interface IVector {
  x: number;
  y: number;
  z: number;
  w: number;
}

export class Vector implements IVector {
  _x: number = 0;
  _y: number = 0;
  _z: number = 0;
  _w: number = 0;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this._x = x ?? 0;
    this._y = y ?? 0;
    this._z = z ?? 0;
    this._w = w ?? 0;
  }

  get x(): number {
    return this._x ?? 0;
  }

  get y(): number {
    return this._y ?? 0;
  }

  get z(): number {
    return this._z ?? 0;
  }

  get w(): number {
    return this._w ?? 0;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }

  set z(value: number) {
    this._z = value;
  }

  set w(value: number) {
    this._w = value;
  }

  scale(s: number) {
    return new Vector(this.x * s, this.y * s, this.z * s, this.w * s);
  }

  add(b: Vector) {
    return new Vector(this.x + b.x, this.y + b.y, this.z + b.z, this.w + b.w);
  }

  sub(b: Vector) {
    return new Vector(this.x - b.x, this.y - b.y, this.z - b.z, this.w - b.w);
  }

  mul(b: Vector) {
    return new Vector(this.x * b.x, this.y * b.y, this.z * b.z, this.w * b.w);
  }

  rotate(radians: number, axis: Vector) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);

    const k = axis.unit();
    let v1 = this.scale(c);
    let v2 = k.cross(this).scale(s);

    v1 = v1.add(v2);

    v2 = k.scale(k.dot(this) * (1.0 - c));
    return v1.add(v2);
  }

  run(f: (v: number, i: number) => number) {
    return new Vector(f(this.x, 0), f(this.y, 1), f(this.z, 2), f(this.w, 3));
  }

  clamp(min: Vector, max: Vector) {
    return new Vector(
      clamp(this.x, min.x, max.x),
      clamp(this.y, min.y, max.y),
      clamp(this.z, min.z, max.z),
      clamp(this.w, min.w, max.w)
    );
  }

  luma() {
    return this.dot(VEC3(0.299, 0.587, 0.114));
  }

  div(b: Vector) {
    return new Vector(this.x / b.x, this.y / b.y, this.z / b.z, this.w / b.w);
  }

  static fromHex(hex: string) {
    const val = hexToUint32(hex);
    const numbers = range(4)
      .map((n) => nthByte(val, n))
      .reverse();
    return new Vector(...numbers);
  }

  static fromArray(arr: number[]) {
    return new Vector(arr[0], arr[1], arr[2], arr[3]);
  }

  static fromRGB(val: string) {
    val = val.replace('rgba', '');
    val = val.replace('rgb', '');
    val = val.replace('(', '');
    val = val.replace(')', '');
    const values = val.split(',').map(it => it.trim()).map(it => Number(it));
    return Vector.fromArray(values);
  }

  static fromColor(val: string) {
    if (val.includes('#')) return Vector.fromHex(val);
    if (val.includes('rgb')) return Vector.fromRGB(val);
    return new Vector(0, 0, 0, 0);
  }

  toRGB(precision: number = 3) {
    return `rgb(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)})`;
  }

  toRGBA(precision: number = 3, alpha: number = 0) {
    return `rgba(${this.x.toFixed(precision)}, ${this.y.toFixed(precision)}, ${this.z.toFixed(precision)}, ${(alpha || this.w).toFixed(precision)})`;
  }

  lerp(b: Vector, scale: number) {
    return new Vector(
      mix(this.x, b.x, scale),
      mix(this.y, b.y, scale),
      mix(this.z || 0, b.z || 0, scale),
      mix(this.w || 0, b.w || 0, scale),
    );
  }

  distance(b: Vector) {
    return Math.sqrt(
      Math.pow(this.x - b.x, 2.0) +
        Math.pow(this.y - b.y, 2.0) +
        Math.pow(this.z - b.z, 2.0),
    );
  }

  clone() {
    return new Vector(this.x, this.y, this.z, this.w);
  }

  unit() {
    const mag = this.mag();
    if (mag <= 0.000000001) return this.clone();
    const invMag = 1.0 / mag;
    return this.scale(invMag);
  }

  mag(): number {
    return Math.sqrt(
      Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0) + Math.pow(this.z, 2.0),
    );
  }

  dot(b: Vector) {
    const dx = this.x * b.x;
    const dy = this.y * b.y;
    const dz = this.z * b.z;
    return dx + dy + dz;
  }

  cross(b: Vector) {
    return VEC3(
      this.y * b.z - this.z * b.y,
      this.z * b.x - this.x * b.z,
      this.x * b.y - this.y * b.x,
    );
  }

  str(): string {
    return `${this.x} ${this.y} ${this.z} ${this.w}`;
  }

  toString(count: number = 0, separator: string = ' '): string {
    if (count > 0) {
      return range(count).map(i => this.at(i)).join(separator)
    }
    return this.str();
  }

  at(index: number): number {
    switch (index) {
        case 0: return this.x;
        case 1: return this.y;
        case 2: return this.z;
        case 3: return this.w;
    }
    return 0;
  }


  toArray<T extends number[] = number[]>(n: number = 4): T {
    switch (n) {
      case 1:
        return [this.x] as T;
      case 2:
        return [this.x, this.y] as T;
      case 3:
        return [this.x, this.y, this.z] as T;
      default:
      case 4:
        return [this.x, this.y, this.z, this.w] as T;
    }
  }
}

export const isVector = (x: any): x is InstanceType<typeof Vector> => {
  if (!x) return false;
  if (typeof x !== 'object') return false;
  return (typeof x.x === 'number' && typeof x.y === 'number' && typeof x.z === 'number' && typeof x.w === 'number');
}

export const VEC4 = (x: number, y: number, z: number, w: number) =>
  new Vector(x, y, z, w);
export const VEC3 = (x: number, y: number, z: number) => new Vector(x, y, z);
export const VEC2 = (x: number, y: number) => new Vector(x, y);

export const VEC31 = (x: number) => VEC3(x, x, x);

export type VectorPair = {
  a: Vector;
  b: Vector;
};

export const samedir = (a: Vector, b: Vector) => {
  return a.dot(b) > 0;
};

export const vector3_dot = (a: Vector, b: Vector) => a.dot(b);
export const vector3_cross = (a: Vector, b: Vector) => a.cross(b);
export const vector3_sub = (a: Vector, b: Vector) => a.sub(b);
export const vector3_add = (a: Vector, b: Vector) => a.add(b);
export const vector3_scale = (a: Vector, s: number) => a.scale(s);
export const vector3_unit = (a: Vector) => a.unit();
export const vector3_mag = (a: Vector) => a.mag();

export const vector3_tangents_slow = (n: Vector): VectorPair => {
  const absX = Math.abs(n.x);
  const absY = Math.abs(n.y);
  const absZ = Math.abs(n.z);
  const axis = VEC3(0.0, 0.0, 0.0);
  if (absX > absY) {
    if (absX > absZ)
      axis.x = 1.0; // X > Y > Z, X > Z > Y
    else axis.z = 1.0; // Z > X > Y
  } else {
    if (absY > absZ)
      axis.y = 1.0; // Y > X > Z, Y > Z > X
    else axis.z = 1.0; // Z > Y > X
  }
  // compute tangents
  const t1 = vector3_unit(vector3_cross(n, axis));
  const t2 = vector3_unit(vector3_cross(n, t1));

  return { a: t1, b: t2 };
};

export const vector3_tangents_fast = (n: Vector): VectorPair => {
  const t1 = vector3_unit(
    n.x >= 0.57735 ? VEC3(n.y, -n.x, 0.0) : VEC3(0.0, n.z, -n.y),
  );
  const t2 = vector3_cross(n, t1);

  return { a: t1, b: t2 };
};

export const vectorsAverage = (points: Vector[]): Vector => {
  let p = new Vector(0, 0, 0, 0);
  if (points.length <= 0) return p;

  for (const point of points) {
    p = p.add(point);
  }

  return p.scale(1.0 / points.length);
}
