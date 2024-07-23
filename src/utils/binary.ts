export const mergeUint8Arrays = (arrays: Array<Uint8Array>): Uint8Array => {
  const totalLength = arrays.reduce((acc, array) => acc + array.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (let array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }

  return result;
};
