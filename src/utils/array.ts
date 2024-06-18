export const range = (n: number): number[] => Array.from(Array(n).keys());

export const shiftRight = <T = any>(arr: T[], index: number, insert?: T | T[], replace: boolean = false): T[] => {
  const copy = [...arr];

  if (!replace) {
    for (let i = arr.length-1; i > index-1; i--) {
      copy[i+1] = copy[i];
    }
  }

  if (typeof insert !== 'undefined') {
    if (Array.isArray(insert)) {
      const next = copy as (T[] | T[][]);
      next[index] = insert;
      return next.flat() as T[];
    } else {
      copy[index] = insert;
    }
  }

  return copy;
}

export const insertAt = <T = any>(arr: T[], index: number, insert: T | T[], replace: boolean = false): T[] => shiftRight<T>(arr, index, insert, replace);

export const shiftLeft = <T = any>(arr: T[], index: number) => {
  const copy = [...arr];

  for (let i = index; i < arr.length-1; i++) {
    copy[i] = copy[i+1];
  }

  return copy.slice(0, copy.length-1);
}


export const uniqueBy = <T, KV = string>(arr: T[], key: string | ((item: T) => KV)): T[] => {
  const nextArr: T[] = []

  try {
    const getId = (item: T, k: string | ((item: T) => KV)): any => {
      return typeof k === 'string' ? (item as any)[k] : k(item)
    }
    for (const item of arr) {
      const id = getId(item, key)
      const count = nextArr.filter((it) => getId(it, key) === id).length
      if (count > 0) continue
      nextArr.push(item)
    }
  } catch (e) {
    console.error('uniqueBy() failed.')
    console.error(e)
  }

  return nextArr
}

export const unique = <T>(arr: T[]): T[] => [...Array.from(new Set(arr))] as T[]
