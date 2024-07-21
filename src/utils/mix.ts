import { isVector, Vector } from "../vector";
import { lerp } from "./etc";
import { isNumber } from "./is";

type Mixable = Vector | number;

export const mix = <T extends Mixable>(a: T, b: T, f: number): T => {
  if (isVector(a) && isVector(b)) {
    const v1 = a as Vector;
    const v2 = b as Vector;
    return v1.lerp(v2, f) as T;
  }
  if (isNumber(a) && isNumber(b)) {
    return lerp(a, b, f) as T;
  }
  throw new Error(`mix() cannot be used with types ${typeof a} or ${typeof b}`);
}
