import { isBoolean, isFloat, isHTMLElement } from './is';
import { cantor, fract, lerp } from './etc';
export const hashu32 = (i) => {
    i = toUint32(i);
    const s = (i >> 3) * 12;
    const k = ~i + ~s;
    i ^= i << 17;
    i ^= i >> 13;
    i ^= i << 5;
    i += (i ^ k) + i * k;
    i *= 1013;
    i ^= i >> 4;
    return toUint32(i * k + i + i * k + k);
};
export const hash21f = (ix, iy, is = 1.98472) => {
    let x = toUint32(ix);
    let y = toUint32(iy);
    const s = toUint32(is);
    const kx = ~x;
    const ky = ~y;
    x = hashu32(x + s * 13);
    y = hashu32(y + s * 13);
    return toUint32(x * 5013 + y * 1013 + (ky * 5013 + kx * 1013)) / 0xffffffff;
};
export const hashAny = (v) => {
    if (isBoolean(v))
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
        const compressed = cantor(ia, ib);
        const idx = (ia + ib) % 2;
        const n = lower[idx] + (compressed % (higher[idx] - lower[idx]));
        const c = String.fromCharCode(n);
        buff += c;
    }
    return buff;
};
export const hashAnyu32 = (v) => {
    const h = isHTMLElement(v)
        ? v.getAttribute('id') ||
            v.getAttribute('data-seed') ||
            v.outerHTML.toString()
        : typeof v === 'string'
            ? v
            : JSON.stringify(v);
    let n = 0;
    for (let i = 0; i < h.length; i++) {
        const c = h.codePointAt(0) || 0;
        n = hashu32(n + hashu32(c) + c);
    }
    return toUint32(n);
};
export const floatBitsToUint = (f) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, f);
    return view.getUint32(0);
};
export const toUint32 = (f) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, isFloat(f) ? floatBitsToUint(f) : f);
    return view.getUint32(0);
};
export const hexToUint32 = (hex) => {
    let stringValue = hex.replace('#', '').replace('0x', '');
    stringValue = stringValue.length < 8 ? `${stringValue}FF` : stringValue;
    stringValue = `0x${stringValue}`;
    return toUint32(parseInt(stringValue, 16));
};
export const nthByte = (val, n) => {
    return (val >> (n * 8)) & 0xff;
};
export const noise2D = (x, y, seed = 1.284715, octaves = 1, freq = 1.0) => {
    const F = (x, y, seed = 1.284715) => {
        const mix = lerp;
        const r = hash21f;
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        let lx = fract(x);
        lx = lx * lx * (3.0 - 2.0 * lx);
        let ly = fract(y);
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
