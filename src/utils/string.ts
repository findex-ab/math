import { insertAt, shiftLeft } from "./array"

export const stringInsertAt = (str: string, index: number, substr: string): string => {
  return insertAt(Array.from(str), index, substr).map(it => it || '').join('')
}

export const stringRemoveAt = (str: string, index: number): string => {
  return shiftLeft(Array.from(str), index).map(it => it || '').join('')
}
