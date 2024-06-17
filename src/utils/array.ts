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
