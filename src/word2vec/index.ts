import merges from '../data/merges.json';
import vectors from '../data/vectors.json';
import idLists  from '../data/vectors.json';
import { chunkify } from '../utils/array';

const idLookup = idLists as Record<string, number[]>;

const getId = (content: string): number => {
  if (content.length === 1) return content.charCodeAt(0);
  const m = merges as Record<string, number>;
  const id = m[content];
  if (typeof id === 'number') return id;
  return -1;
}

const getIds = (content: string) => {
  const list = idLookup[content];
  if (list && list.length > 0) return list;
  const id = getId(content);
  if (id > 0) return [id];
  const points = Array.from(content).map(it => it.charCodeAt(0));
  const pairs = chunkify(points, 2);
  return pairs.map(([a, b]) => {
    const key = `${a},${b}`;
    const id = getId(key);
    return (id > 0 ? [id] : [a, b]).flat();
  }).flat()
}

export const getWordVectors = (content: string) => {
  const vecs = vectors as Record<string, number[]>;
  const ids = getIds(content);

  const idVectors = ids.map((id) => {
    return vecs[id + ''] || [];
  }).filter(it => !!it && it.length > 0)

  return idVectors;
}
