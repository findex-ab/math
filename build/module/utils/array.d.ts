export declare const range: (n: number) => number[];
export declare const shiftRight: <T = any>(arr: T[], index: number, insert?: T | T[], replace?: boolean) => T[];
export declare const insertAt: <T = any>(arr: T[], index: number, insert: T | T[], replace?: boolean) => T[];
export declare const shiftLeft: <T = any>(arr: T[], index: number) => T[];
export declare const uniqueBy: <T, KV = string>(arr: T[], key: string | ((item: T) => KV)) => T[];
export declare const unique: <T>(arr: T[]) => T[];
export declare const chunkify: <T = any>(arr: T[], chunkSize?: number) => T[][];
export declare const join: <T>(array: T[], options: {
    prefix?: (index: number) => T | null;
    suffix?: (index: number) => T | null;
}) => T[];
export declare const arrayCount: <T = any>(arr: T[], item: T) => number;
export declare const mostFrequent: <T = any>(arr: T[]) => T;
export declare const shuffle: <T = any>(arr: T[], seed?: number) => T[];
export declare const shuffleFast: <T = any>(array: T[], random?: ((i: number) => number)) => T[];
export declare const zip: <S1, S2>(firstCollection: Array<S1>, lastCollection: Array<S2>) => Array<[S1, S2]>;
export declare const zipMax: <S1, S2>(firstCollection: Array<S1>, lastCollection: Array<S2>, pad: [S1, S2]) => Array<[S1, S2]>;
