import { VEC31, vector3_scale, vector3_sub } from '../vector';
export const emptyMinkowskiPair = {
    closest: VEC31(0),
    furthest: VEC31(0),
    closestDot: 0,
    furthestDot: 0,
    closestLocal: VEC31(0),
    furthestLocal: VEC31(0),
};
export const emptyMinkowskiSupportPair = {
    a: emptyMinkowskiPair,
    b: emptyMinkowskiPair,
    axis: VEC31(0),
    point: VEC31(0),
    pointLocal: VEC31(0)
};
export const emptyMinkowskiTriangle = {
    v1: emptyMinkowskiSupportPair,
    v2: emptyMinkowskiSupportPair,
    v3: emptyMinkowskiSupportPair,
    normal: VEC31(0)
};
export const minkowskiSimplexPushFront = (simplex, pair) => {
    const p0 = simplex.supports[0];
    const p1 = simplex.supports[1];
    const p2 = simplex.supports[2];
    simplex.supports[0] = pair;
    simplex.supports[1] = p0;
    simplex.supports[2] = p1;
    simplex.supports[3] = p2;
    simplex.length = Math.min(simplex.length + 1, 4);
    return simplex;
};
export const getMinkowskiPoints = (dir, points) => {
    if (points.length <= 0)
        return emptyMinkowskiPair;
    let furthest = points[0];
    let closest = points[0];
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < points.length; i++) {
        const v = points[i];
        const dot = dir.dot(v);
        if (dot > max) {
            max = dot;
            furthest = v;
        }
        if (dot < min) {
            min = dot;
            closest = v;
        }
    }
    return {
        closest: closest,
        closestLocal: closest,
        furthest: furthest,
        furthestLocal: furthest,
        closestDot: min,
        furthestDot: max,
    };
};
export const getMinkowskiSupportPair = (a, b, dir) => {
    const sa = getMinkowskiPoints(dir, a.points);
    const sb = getMinkowskiPoints(vector3_scale(dir, -1), b.points);
    const p1 = sa.furthest;
    const p2 = sb.furthest;
    const point = vector3_sub(p1, p2);
    const p1_local = sa.furthestLocal;
    const p2_local = sb.furthestLocal;
    const pointLocal = vector3_sub(p1_local, p2_local);
    return {
        a: sa,
        b: sb,
        point: point,
        pointLocal: pointLocal,
        axis: dir
    };
};
