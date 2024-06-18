import { Vector } from "../vector"

export type SimpleContact = {
  point: Vector;
  normal: Vector;
  depth: number;
}
