import { insertAt, shiftLeft } from "./array";
export const stringInsertAt = (str, index, substr) => {
    return insertAt(Array.from(str), index, substr).map(it => it || '').join('');
};
export const stringRemoveAt = (str, index) => {
    return shiftLeft(Array.from(str), index).map(it => it || '').join('');
};
