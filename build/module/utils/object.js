export const getObjectDiffs = (oldObject, newObject, options = {}) => {
    const getDiffs = (oldObject, newObject, path = '') => {
        const diffs = [];
        const keys = new Set([
            ...Object.keys(oldObject || {}),
            ...Object.keys(newObject || {}),
        ]);
        for (const key of keys) {
            const fullPath = path ? `${path}.${key}` : key;
            const oldValue = oldObject ? oldObject[key] : undefined;
            const newValue = newObject ? newObject[key] : undefined;
            if (options.compareNonNullishOnly) {
                if (typeof newValue === 'undefined' || newValue === null)
                    continue;
            }
            if (oldValue === newValue) {
                continue;
            }
            if (typeof oldValue === 'object' &&
                oldValue !== null &&
                typeof newValue === 'object' &&
                newValue !== null) {
                diffs.push(...getDiffs(oldValue, newValue, fullPath));
            }
            else {
                diffs.push({ path: fullPath, oldValue, newValue });
            }
        }
        return diffs;
    };
    return getDiffs(oldObject, newObject);
};
export const applyObjectDiffs = (targetObject, diffs, clone = (x) => JSON.parse(JSON.stringify(x))) => {
    const resultObject = clone(targetObject);
    for (const { path, newValue } of diffs) {
        const keys = path.split('.');
        let current = resultObject;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        const finalKey = keys[keys.length - 1];
        current[finalKey] = newValue;
    }
    return resultObject;
};
