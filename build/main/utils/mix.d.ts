import { Vector } from "../vector";
type Mixable = Vector | number;
export declare const mix: <T extends Mixable>(a: T, b: T, f: number) => T;
export {};
