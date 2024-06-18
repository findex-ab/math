export declare const range: (n: number) => number[];
export declare const shiftRight: <T = any>(arr: T[], index: number, insert?: T | T[], replace?: boolean) => T[];
export declare const insertAt: <T = any>(arr: T[], index: number, insert: T | T[], replace?: boolean) => T[];
export declare const shiftLeft: <T = any>(arr: T[], index: number) => T[];
export declare const uniqueBy: <T, KV = string>(arr: T[], key: string | ((item: T) => KV)) => T[];
export declare const unique: <T>(arr: T[]) => T[];
