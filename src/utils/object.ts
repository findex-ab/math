type Dict<T = any> = { [key: string | symbol]: T };

export type ObjectDiff<T = unknown> = {
  path: string;
  oldValue: T;
  newValue: T;
};

export type ObjectDiffOptions = {
  compareNonNullishOnly?: boolean;
  keyFilter?: (key: string) => boolean;
}

export const getObjectDiffs = (
  oldObject: Dict,
  newObject: Dict,
  options: ObjectDiffOptions = {}
): ObjectDiff[] => {
  const getDiffs = (
    oldObject: Dict,
    newObject: Dict,
    path: string = '',
  ): ObjectDiff[] => {
    const diffs: ObjectDiff[] = [];

    const keys = new Set([
      ...Object.keys(oldObject || {}),
      ...Object.keys(newObject || {}),
    ]);

    for (const key of keys) {
      if (options.keyFilter && options.keyFilter(key) !== true) continue;
      
      const fullPath = path ? `${path}.${key}` : key;
      const oldValue = oldObject ? oldObject[key] : undefined;
      const newValue = newObject ? newObject[key] : undefined;

      if (options.compareNonNullishOnly) {
        if (typeof newValue === 'undefined' || newValue === null) continue;
      }

      if (oldValue === newValue) {
        continue;
      }

      if (
        typeof oldValue === 'object' &&
        oldValue !== null &&
        typeof newValue === 'object' &&
        newValue !== null
      ) {
        diffs.push(...getDiffs(oldValue, newValue, fullPath));
      } else {
        diffs.push({ path: fullPath, oldValue, newValue });
      }
    }

    return diffs;
  };

  return getDiffs(oldObject, newObject);
};

export const applyObjectDiffs = <T extends Dict>(
  targetObject: T,
  diffs: ObjectDiff[],
  clone: (obj: T) => T = (x) => JSON.parse(JSON.stringify(x)),
): T => {
  const resultObject = clone(targetObject);
  for (const { path, newValue } of diffs) {
    const keys = path.split('.');
    let current = resultObject;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        (current as any)[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    (current as any)[finalKey] = newValue;
  }

  return resultObject;
};
