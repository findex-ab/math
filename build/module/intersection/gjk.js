import { physicsBodyGetMatrix } from '../physics';
import { VEC3, Vector } from '../vector';
var EvolveResult;
(function (EvolveResult) {
    EvolveResult[EvolveResult["NoIntersection"] = 0] = "NoIntersection";
    EvolveResult[EvolveResult["FoundIntersection"] = 1] = "FoundIntersection";
    EvolveResult[EvolveResult["StillEvolving"] = 2] = "StillEvolving";
})(EvolveResult || (EvolveResult = {}));
const meshCenter = (mesh) => Vector.avg(mesh.points);
export class GJK {
    vertices = [];
    direction = VEC3(1, 1, 1);
    shapeA;
    shapeB;
    addSupport(dir) {
        const nextVertex = this.shapeA.support(dir).sub(this.shapeB.support(dir.scale(-1)));
        this.vertices.push(nextVertex);
        return dir.dot(nextVertex) > 0;
    }
    tripleProduct(a, b, c) {
        const A = VEC3(a.x, a.y, 0);
        const B = VEC3(b.x, b.y, 0);
        const C = VEC3(c.x, c.y, 0);
        const first = A.cross(B);
        const second = first.cross(C);
        return second;
    }
    evolveSimplex() {
        switch (this.vertices.length) {
            case 0:
                {
                    this.direction = meshCenter(this.shapeB.mesh).mulMat4(physicsBodyGetMatrix(this.shapeB)).sub(meshCenter(this.shapeA.mesh).mulMat4(physicsBodyGetMatrix(this.shapeA)));
                    const support = this.shapeA.support(this.direction).sub(this.shapeB.support(this.direction.scale(-1)));
                    this.vertices.push(support);
                }
                break;
            case 1:
                {
                    // flip the direction
                    this.direction = this.direction.scale(-1);
                    console.log(this.direction);
                }
                break;
            case 2:
                {
                    const b = this.vertices[1];
                    const c = this.vertices[0];
                    // line cb is the line formed by the first two vertices
                    const cb = b.sub(c);
                    // line c0 is the line from the first vertex to the origin
                    const c0 = c.scale(-1);
                    // use the triple-cross-product to calculate a direction perpendicular
                    // to line cb in the direction of the origin
                    this.direction = this.tripleProduct(cb, c0, cb);
                }
                break;
            case 3: {
                // calculate if the simplex contains the origin
                const a = this.vertices[2];
                const b = this.vertices[1];
                const c = this.vertices[0];
                const a0 = a.scale(-1); //a * -1; // v2 to the origin
                const ab = b.sub(a); //b - a; // v2 to v1
                const ac = c.sub(a); //c - a; // v2 to v0
                const abPerp = this.tripleProduct(ac, ab, ab);
                const acPerp = this.tripleProduct(ab, ac, ac);
                if (abPerp.dot(a0) > 0) {
                    // the origin is outside line ab
                    // get rid of c and add a new support in the direction of abPerp
                    this.vertices = this.vertices.filter((it) => it !== c);
                    this.direction = abPerp;
                }
                else if (acPerp.dot(a0) > 0) {
                    // the origin is outside line ac
                    // get rid of b and add a new support in the direction of acPerp
                    this.vertices = this.vertices.filter((it) => it !== b);
                    this.direction = acPerp;
                }
                else {
                    // the origin is inside both ab and ac,
                    // so it must be inside the triangle!
                    return EvolveResult.FoundIntersection;
                }
            }
        }
        return this.addSupport(this.direction)
            ? EvolveResult.StillEvolving
            : EvolveResult.NoIntersection;
    }
    constructor(shapeA, shapeB) {
        // reset everything
        this.vertices = []; //new Array<Vec2>();
        this.shapeA = shapeA;
        this.shapeB = shapeB;
    }
    test() {
        let iter = 0;
        this.vertices = []; //new Array<Vec2>();
        // do the actual test
        let result = EvolveResult.StillEvolving;
        while (result == EvolveResult.StillEvolving && iter < 500) {
            result = this.evolveSimplex();
            iter += 1;
        }
        return result == EvolveResult.FoundIntersection;
    }
}
