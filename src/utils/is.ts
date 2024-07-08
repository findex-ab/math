export const isFunction = (v?: any): v is CallableFunction => {
  if (!v) return false;
  return typeof v === 'function';
};

export const isDate = (x: any): x is Date => {
  if (!x) return false;
  if (typeof x !== 'object') return false;
  return !!x.getDay;
};

export const isNumber = (x: any): x is number => typeof x === 'number';
export const isSafeNumber = (x: any): x is number => {
  if (!isNumber(x)) return false;
  return isFinite(x) && !isNaN(x);
}
export const isFloat = (x: any): x is number =>
  isNumber(x) && x.toString().includes('.');
export const isString = (x: any): x is string => typeof x === 'string';
export const isBoolean = (x: any): x is boolean => typeof x === 'boolean';
export const isFactor = (x: any): x is number | string | boolean | Date =>
  isNumber(x) || isString(x) || isBoolean(x) || isDate(x);
export const isUndefined = (x?: any): x is undefined =>
  typeof x === 'undefined';

export const isDigit = (c: string): boolean => {
  if (isUndefined(c) || c === null) return false;
  const n = c.codePointAt(0) || 0;
  return n >= 48 && n <= 57;
};

export const isAlpha = (c: string): boolean => {
  const code = c.codePointAt(0);
  if (!code) return false;
  return code >= 65 && code <= 122;
};

export const isNumerical = (c: string): boolean => {
  const digits = Array.from(c).filter(isDigit);
  return digits.length >= c.length;
};

export const isHTMLElement = (x: any): x is HTMLElement => {
  if (!x) return false;
  return !!x.appendChild;
};
