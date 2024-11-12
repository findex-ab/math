type Dict<T = any> = {
    [key: string | symbol]: T;
};
export type ObjectDiff<T = unknown> = {
    path: string;
    oldValue: T;
    newValue: T;
};
export type ObjectDiffOptions = {
    compareNonNullishOnly?: boolean;
};
export declare const getObjectDiffs: (oldObject: Dict, newObject: Dict, options?: ObjectDiffOptions) => ObjectDiff[];
export declare const applyObjectDiffs: <T extends Dict<any>>(targetObject: T, diffs: ObjectDiff[], clone?: (obj: T) => T) => T;
export {};
