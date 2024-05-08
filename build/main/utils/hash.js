"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noise2D = exports.nthByte = exports.hexToUint32 = exports.toUint32 = exports.floatBitsToUint = exports.hashAnyu32 = exports.hashAny = exports.hash21f = exports.hashu32 = void 0;
const is_1 = require("./is");
const etc_1 = require("./etc");
const hashu32 = (i) => {
    i = (0, exports.toUint32)(i);
    const s = (i >> 3) * 12;
    const k = ~i + ~s;
    i ^= i << 17;
    i ^= i >> 13;
    i ^= i << 5;
    i += (i ^ k) + i * k;
    i *= 1013;
    i ^= i >> 4;
    return (0, exports.toUint32)(i * k + i + i * k + k);
};
exports.hashu32 = hashu32;
const hash21f = (ix, iy, is = 1.98472) => {
    let x = (0, exports.toUint32)(ix);
    let y = (0, exports.toUint32)(iy);
    const s = (0, exports.toUint32)(is);
    const kx = ~x;
    const ky = ~y;
    x = (0, exports.hashu32)(x + s * 13);
    y = (0, exports.hashu32)(y + s * 13);
    return (0, exports.toUint32)(x * 5013 + y * 1013 + (ky * 5013 + kx * 1013)) / 0xffffffff;
};
exports.hash21f = hash21f;
const hashAny = (v) => {
    if ((0, is_1.isBoolean)(v))
        v = Number(v) * 5013;
    const str = typeof v === 'string' ? v : JSON.stringify(v);
    const chars = Array.from(str);
    let buff = '';
    const lower = [97, 65];
    const higher = [122, 90];
    for (let i = 0; i < chars.length; i += 2) {
        const a = chars[i];
        const b = chars[(i + 1) % chars.length];
        const ia = a.codePointAt(0) || 0;
        const ib = b.codePointAt(0) || 0;
        const compressed = (0, etc_1.cantor)(ia, ib);
        const idx = (ia + ib) % 2;
        const n = lower[idx] + (compressed % (higher[idx] - lower[idx]));
        const c = String.fromCharCode(n);
        buff += c;
    }
    return buff;
};
exports.hashAny = hashAny;
const hashAnyu32 = (v) => {
    const h = (0, is_1.isHTMLElement)(v)
        ? v.getAttribute('id') ||
            v.getAttribute('data-seed') ||
            v.outerHTML.toString()
        : typeof v === 'string'
            ? v
            : JSON.stringify(v);
    let n = 0;
    for (let i = 0; i < h.length; i++) {
        const c = h.codePointAt(0) || 0;
        n = (0, exports.hashu32)(n + (0, exports.hashu32)(c) + c);
    }
    return (0, exports.toUint32)(n);
};
exports.hashAnyu32 = hashAnyu32;
const floatBitsToUint = (f) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, f);
    return view.getUint32(0);
};
exports.floatBitsToUint = floatBitsToUint;
const toUint32 = (f) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, (0, is_1.isFloat)(f) ? (0, exports.floatBitsToUint)(f) : f);
    return view.getUint32(0);
};
exports.toUint32 = toUint32;
const hexToUint32 = (hex) => {
    let stringValue = hex.replace('#', '').replace('0x', '');
    stringValue = stringValue.length < 8 ? `${stringValue}FF` : stringValue;
    stringValue = `0x${stringValue}`;
    return (0, exports.toUint32)(parseInt(stringValue, 16));
};
exports.hexToUint32 = hexToUint32;
const nthByte = (val, n) => {
    return (val >> (n * 8)) & 0xff;
};
exports.nthByte = nthByte;
const noise2D = (x, y, seed = 1.284715, octaves = 1, freq = 1.0) => {
    const F = (x, y, seed = 1.284715) => {
        const mix = etc_1.lerp;
        const r = exports.hash21f;
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        let lx = (0, etc_1.fract)(x);
        lx = lx * lx * (3.0 - 2.0 * lx);
        let ly = (0, etc_1.fract)(y);
        ly = ly * ly * (3.0 - 2.0 * ly);
        const ab = mix(r(ix + 0, iy + 0, seed), r(ix + 1, iy + 0, seed), lx);
        const cd = mix(r(ix + 0, iy + 1, seed), r(ix + 1, iy + 1, seed), lx);
        return mix(ab, cd, ly);
    };
    let n = 0.0;
    let div = 0.0;
    let amp = 1.0;
    let q = freq;
    for (let i = 0; i < octaves; i++) {
        n += amp * F(x * q, y * q, seed);
        div += amp;
        amp *= 0.5;
        q *= 2.0;
    }
    return n / div;
};
exports.noise2D = noise2D;
