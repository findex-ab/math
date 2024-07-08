export const range = (n: number): number[] => (n <= 0 ? [] : Array.from(Array(Math.floor(n)).keys()));

export const shiftRight = <T = any>(
  arr: T[],
  index: number,
  insert?: T | T[],
  replace: boolean = false,
): T[] => {
  const copy = [...arr];

  if (!replace) {
    for (let i = arr.length - 1; i > index - 1; i--) {
      copy[i + 1] = copy[i];
    }
  }

  if (typeof insert !== 'undefined') {
    if (Array.isArray(insert)) {
      const next = copy as T[] | T[][];
      next[index] = insert;
      return next.flat() as T[];
    } else {
      copy[index] = insert;
    }
  }

  return copy;
};

export const insertAt = <T = any>(
  arr: T[],
  index: number,
  insert: T | T[],
  replace: boolean = false,
): T[] => shiftRight<T>(arr, index, insert, replace);

export const shiftLeft = <T = any>(arr: T[], index: number) => {
  const copy = [...arr];

  for (let i = index; i < arr.length - 1; i++) {
    copy[i] = copy[i + 1];
  }

  return copy.slice(0, copy.length - 1);
};

export const uniqueBy = <T, KV = string>(
  arr: T[],
  key: string | ((item: T) => KV),
): T[] => {
  const nextArr: T[] = [];

  try {
    const getId = (item: T, k: string | ((item: T) => KV)): any => {
      return typeof k === 'string' ? (item as any)[k] : k(item);
    };
    for (const item of arr) {
      const id = getId(item, key);
      const count = nextArr.filter((it) => getId(it, key) === id).length;
      if (count > 0) continue;
      nextArr.push(item);
    }
  } catch (e) {
    console.error('uniqueBy() failed.');
    console.error(e);
  }

  return nextArr;
};

export const unique = <T>(arr: T[]): T[] =>
  [...Array.from(new Set(arr))] as T[];

export const chunkify = <T = any>(arr: T[], chunkSize: number = 2): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const part = arr.slice(i, i + chunkSize);
    result.push(part);
  }

  return result;
};

export const join = <T>(
  array: T[],
  options: {
    prefix?: (index: number) => T | null;
    suffix?: (index: number) => T | null;
  },
): T[] => {
  if (array.length === 0) return [];
  if (!options.prefix && !options.suffix) return array;

  const result: T[] = [];
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

export const arrayCount = <T = any>(arr: T[], item: T): number => {
  return arr.filter((it) => it === item).length;
}

export const mostFrequent = <T = any>(arr: T[]): T => {
  let most = arr[0];
  let f: number = -1;

  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    const freq = arrayCount(arr, it);
    if (freq > f) {
      f = freq;
      most = it;
    }
  }

  return most;
}
