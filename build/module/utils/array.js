import { clamp } from './etc';
import { hashu32_v1, toUint32 } from './hash';
export const range = (n) => n <= 0 || typeof n !== 'number' || isNaN(n) || !isFinite(n)
    ? []
    : Array.from(Array(Math.floor(n)).keys());
export const shiftRight = (arr, index, insert, replace = false) => {
    const copy = [...arr];
    if (!replace) {
        for (let i = arr.length - 1; i > index - 1; i--) {
            copy[i + 1] = copy[i];
        }
    }
    if (typeof insert !== 'undefined') {
        if (Array.isArray(insert)) {
            const next = copy;
            next[index] = insert;
            return next.flat();
        }
        else {
            copy[index] = insert;
        }
    }
    return copy;
};
export const insertAt = (arr, index, insert, replace = false) => shiftRight(arr, index, insert, replace);
export const shiftLeft = (arr, index) => {
    const copy = [...arr];
    for (let i = index; i < arr.length - 1; i++) {
        copy[i] = copy[i + 1];
    }
    return copy.slice(0, copy.length - 1);
};
export const uniqueBy = (arr, key) => {
    const nextArr = [];
    const lookup = new Map();
    try {
        const getId = (item, k) => {
            return typeof k === 'string' ? item[k] : k(item);
        };
        for (const item of arr) {
            const id = getId(item, key);
            if (lookup.has(id))
                continue;
            nextArr.push(item);
            lookup.set(id, true);
        }
    }
    catch (e) {
        console.error('uniqueBy() failed.');
        console.error(e);
    }
    return nextArr;
};
export const unique = (arr) => [...Array.from(new Set(arr))];
export const chunkify = (arr, chunkSize = 2) => {
    const result = [];
    if (arr.length <= 0 || chunkSize <= 0)
        return result;
    for (let i = 0; i < arr.length; i += chunkSize) {
        const part = arr.slice(i, i + chunkSize);
        result.push(part);
    }
    return result;
};
export const join = (array, options) => {
    if (array.length === 0)
        return [];
    if (!options.prefix && !options.suffix)
        return array;
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (options.prefix) {
            const item = options.prefix(i);
            if (item !== null) {
                result.push(item);
            }
        }
        result.push(array[i]);
        if (options.suffix && i < array.length - 1) {
            const item = options.suffix(i);
            if (item !== null) {
                result.push(item);
            }
        }
    }
    return result;
};
export const arrayCount = (arr, item) => {
    return arr.filter((it) => it === item).length;
};
export const mostFrequent = (arr) => {
    let most = arr[0];
    let f = -1;
    for (let i = 0; i < arr.length; i++) {
        const it = arr[i];
        const freq = arrayCount(arr, it);
        if (freq > f) {
            f = freq;
            most = it;
        }
    }
    return most;
};
export const shuffle = (arr, seed = 5013.18138) => {
    if (arr.length <= 0)
        return arr;
    const indices = range(arr.length).sort((a, b) => {
        const x = hashu32_v1(a + seed);
        seed = toUint32(seed + x);
        const y = hashu32_v1(b + seed);
        seed = toUint32(seed + y);
        const z = (x / 0xffffffff) * 2.0 - 1.0;
        const w = (y / 0xffffffff) * 2.0 - 1.0;
        return z - w;
    });
    return indices.map((i) => arr[i]);
};
export const shuffleFast = (array, random = () => Math.random()) => {
    const copy = [...array];
    let currentIndex = copy.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(clamp(random(currentIndex), 0.0, 1.0) * currentIndex);
        currentIndex--;
        [copy[currentIndex], copy[randomIndex]] = [
            copy[randomIndex], copy[currentIndex]
        ];
    }
    return copy;
};
export const zip = (firstCollection, lastCollection) => {
    const length = Math.min(firstCollection.length, lastCollection.length);
    const zipped = [];
    for (let index = 0; index < length; index++) {
        zipped.push([firstCollection[index], lastCollection[index]]);
    }
    return zipped;
};
export const zipMax = (firstCollection, lastCollection, pad) => {
    const length = Math.max(firstCollection.length, lastCollection.length);
    const zipped = [];
    for (let index = 0; index < length; index++) {
        zipped.push([
            index >= firstCollection.length ? pad[0] : firstCollection[index],
            index >= lastCollection.length ? pad[1] : lastCollection[index],
        ]);
    }
    return zipped;
};
