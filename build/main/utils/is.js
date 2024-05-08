"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHTMLElement = exports.isNumerical = exports.isAlpha = exports.isDigit = exports.isUndefined = exports.isFactor = exports.isBoolean = exports.isString = exports.isFloat = exports.isNumber = exports.isDate = exports.isFunction = void 0;
const isFunction = (v) => {
    if (!v)
        return false;
    return typeof v === 'function';
};
exports.isFunction = isFunction;
const isDate = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return !!x.getDay;
};
exports.isDate = isDate;
const isNumber = (x) => typeof x === 'number';
exports.isNumber = isNumber;
const isFloat = (x) => (0, exports.isNumber)(x) && x.toString().includes('.');
exports.isFloat = isFloat;
const isString = (x) => typeof x === 'string';
exports.isString = isString;
const isBoolean = (x) => typeof x === 'boolean';
exports.isBoolean = isBoolean;
const isFactor = (x) => (0, exports.isNumber)(x) || (0, exports.isString)(x) || (0, exports.isBoolean)(x) || (0, exports.isDate)(x);
exports.isFactor = isFactor;
const isUndefined = (x) => typeof x === 'undefined';
exports.isUndefined = isUndefined;
const isDigit = (c) => {
    if ((0, exports.isUndefined)(c) || c === null)
        return false;
    const n = c.codePointAt(0) || 0;
    return n >= 48 && n <= 57;
};
exports.isDigit = isDigit;
const isAlpha = (c) => {
    const code = c.codePointAt(0);
    if (!code)
        return false;
    return code >= 65 && code <= 122;
};
exports.isAlpha = isAlpha;
const isNumerical = (c) => {
    const digits = Array.from(c).filter(exports.isDigit);
    return digits.length >= c.length;
};
exports.isNumerical = isNumerical;
const isHTMLElement = (x) => {
    if (!x)
        return false;
    return !!x.appendChild;
};
exports.isHTMLElement = isHTMLElement;
