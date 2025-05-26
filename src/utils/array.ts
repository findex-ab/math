import { clamp } from './etc';
import { hashu32_v1, toUint32 } from './hash';

export const range = (n: number): number[] =>
  n <= 0 || typeof n !== 'number' || isNaN(n) || !isFinite(n)
    ? []
    : Array.from(Array(Math.floor(n)).keys());

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
  const lookup = new Map<any, boolean>();

  try {
    const getId = (item: T, k: string | ((item: T) => KV)): any => {
      return typeof k === 'string' ? (item as any)[k] : k(item);
    };
    for (const item of arr) {
      const id = getId(item, key);
      if (lookup.has(id)) continue;
      nextArr.push(item);
      lookup.set(id, true);
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

  if (arr.length <= 0 || chunkSize <= 0) return result;

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
};

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
};

export const shuffle = <T = any>(arr: T[], seed: number = 5013.18138): T[] => {
  if (arr.length <= 0) return arr;
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

export const shuffleFast = <T = any>(array: T[], random: ((i: number) => number) = () => Math.random()): T[] => {
  const copy = [...array];
  let currentIndex = copy.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(clamp(random(currentIndex), 0.0, 1.0) * currentIndex);
    currentIndex--;
    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex], copy[currentIndex]];
  }
  return copy;
}

export const zip = <S1, S2>(
  firstCollection: Array<S1>,
  lastCollection: Array<S2>,
): Array<[S1, S2]> => {
  const length = Math.min(firstCollection.length, lastCollection.length);
  const zipped: Array<[S1, S2]> = [];

  for (let index = 0; index < length; index++) {
    zipped.push([firstCollection[index], lastCollection[index]]);
  }

  return zipped;
};

export const zipMax = <S1, S2>(
  firstCollection: Array<S1>,
  lastCollection: Array<S2>,
  pad: [S1, S2],
): Array<[S1, S2]> => {
  const length = Math.max(firstCollection.length, lastCollection.length);
  const zipped: Array<[S1, S2]> = [];

  for (let index = 0; index < length; index++) {
    zipped.push([
      index >= firstCollection.length ? pad[0] : firstCollection[index],
      index >= lastCollection.length ? pad[1] : lastCollection[index],
    ]);
  }

  return zipped;
};
