export declare const stringInsertAt: (str: string, index: number, substr: string) => string;
export declare const stringRemoveAt: (str: string, index: number) => string;
export type JaroWinklerOptions = {
    prefixScale?: number;
    maxPrefixLength?: number;
    caseSensitive?: boolean;
};
export declare const jaroWinklerSimilarity: (s1: string, s2: string, options?: JaroWinklerOptions) => number;
export declare const levDist: (a: string, b: string) => number;
export declare const levDistNormalized: (a: string, b: string) => number;
export type LevenshteinSimiliarityOptions = {
    caseSensitive?: boolean;
};
export declare const levenshteinSimilarity: (a: string, b: string, options?: LevenshteinSimiliarityOptions) => number;
export declare const naiveStringSimilarity: (a: string, b: string) => number;
export type CosineStringSimilarityOptions = {
    useGoogleWord2Vec?: boolean;
};
export declare const cosineStringSimilarity: (a: string, b: string, options?: CosineStringSimilarityOptions) => number;
export type StringSimilarityOptions = {
    caseSensitive?: boolean;
    naiveInfluence?: number;
    levenshteinInfluence?: number;
    jaroWinklerInfluence?: number;
    cosineInfluence?: number;
    cosineOptions?: CosineStringSimilarityOptions;
};
export declare const stringSimilarity: (a: string, b: string, options?: StringSimilarityOptions) => number;
