import { PhysicsBody } from '../physics/body';
import { Contact } from '../physics/contact';
import { MinkowskiSimplex } from '../utils/minkowski';
export type EPAConfig = {
    threshold: number;
    maxIterations: number;
};
export declare const defaultEPAConfig: EPAConfig;
export type EPAProps = {
    config?: EPAConfig;
    simplex: MinkowskiSimplex;
    a: PhysicsBody;
    b: PhysicsBody;
};
export type EPAResult = {
    contactA: Contact;
    contactB: Contact;
};
export declare const EPA: (props: EPAProps) => EPAResult | null;
