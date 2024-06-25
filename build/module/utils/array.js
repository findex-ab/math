export const range = (n) => (n <= 0 ? [] : Array.from(Array(n).keys()));
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
    try {
        const getId = (item, k) => {
            return typeof k === 'string' ? item[k] : k(item);
        };
        for (const item of arr) {
            const id = getId(item, key);
            const count = nextArr.filter((it) => getId(it, key) === id).length;
            if (count > 0)
                continue;
            nextArr.push(item);
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
