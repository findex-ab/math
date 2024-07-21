import { isVector } from "../vector";
import { lerp } from "./etc";
import { isNumber } from "./is";
export const mix = (a, b, f) => {
    if (isVector(a) && isVector(b)) {
        const v1 = a;
        const v2 = b;
        return v1.lerp(v2, f);
    }
    if (isNumber(a) && isNumber(b)) {
        return lerp(a, b, f);
    }
    throw new Error(`mix() cannot be used with types ${typeof a} or ${typeof b}`);
};
