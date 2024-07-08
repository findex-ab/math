export const isFunction = (v) => {
    if (!v)
        return false;
    return typeof v === 'function';
};
export const isDate = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return !!x.getDay;
};
export const isNumber = (x) => typeof x === 'number';
export const isSafeNumber = (x) => {
    if (!isNumber(x))
        return false;
    return isFinite(x) && !isNaN(x);
};
export const isFloat = (x) => isNumber(x) && x.toString().includes('.');
export const isString = (x) => typeof x === 'string';
export const isBoolean = (x) => typeof x === 'boolean';
export const isFactor = (x) => isNumber(x) || isString(x) || isBoolean(x) || isDate(x);
export const isUndefined = (x) => typeof x === 'undefined';
export const isDigit = (c) => {
    if (isUndefined(c) || c === null)
        return false;
    const n = c.codePointAt(0) || 0;
    return n >= 48 && n <= 57;
};
export const isAlpha = (c) => {
    const code = c.codePointAt(0);
    if (!code)
        return false;
    return code >= 65 && code <= 122;
};
export const isNumerical = (c) => {
    const digits = Array.from(c).filter(isDigit);
    return digits.length >= c.length;
};
export const isHTMLElement = (x) => {
    if (!x)
        return false;
    return !!x.appendChild;
};
