import merges from '../data/merges.json';
import vectors from '../data/vectors.json';
import w2v from '../data/w2v.json';
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

export const getWordVectorsV2W = (content: string): Array<number[]> => {
  if (!content) return [];
  if (content.length <= 0) return [];
  const lower = content.toLowerCase();
  const vecs = w2v as Record<string, number[]>;

  if (vecs[content]) return [vecs[content]];
  if (vecs[lower]) return [vecs[lower]];

  const half = Math.round(content.length / 2);
  const left = content.slice(0, half);
  const right = content.slice(half, content.length);
  if (vecs[left] && vecs[right]) {
    return [vecs[left], vecs[right]];
  }
  if (vecs[left]) return [vecs[left]];
  if (vecs[right]) return [vecs[right]];

  const leftLower = content.slice(0, half).toLowerCase();
  const rightLower = content.slice(half, content.length).toLowerCase();
  if (vecs[leftLower] && vecs[rightLower]) {
    return [vecs[leftLower], vecs[rightLower]];
  }
  if (vecs[leftLower]) return [vecs[leftLower]];
  if (vecs[rightLower]) return [vecs[rightLower]];

  if (content.includes(' ')) {
    const parts = content.split(' ');
    return parts.map((part) => {
      return vecs[part] || [];
    }).filter(it => it.length > 0)
  }

  const pairs = chunkify(Array.from(lower), 2).map(it => it.join(''));

  return pairs.map((pair) => {
    return vecs[pair] || [];
  }).filter(it => it.length > 0)
  
}
