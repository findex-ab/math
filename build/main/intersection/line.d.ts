import { Line } from "../mesh";
import { SimpleContact } from "../physics";
export declare const findLineIntersection2D: (lineA: Line, lineB: Line) => SimpleContact | null;
export declare const findLineIntersection3D: (lineA: Line, lineB: Line) => SimpleContact | null;
