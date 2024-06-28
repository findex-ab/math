import { Line } from '../mesh';
import { SimpleContact } from '../physics';
import { Vector } from '../vector';
export declare const findLineIntersection2D: (lineA: Line, lineB: Line) => SimpleContact | null;
export declare const findLineIntersection3D: (lineA: Line, lineB: Line) => SimpleContact | null;
export declare const findClosestPointOnLine: (point: Vector, line: Line) => Vector;
