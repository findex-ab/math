import { PhysicsBody } from '../physics/body';
import { EPAConfig } from './EPA';
import { GilbertConfig } from './gilbert';
export type GilbertEPAProps = {
    EPA?: EPAConfig;
    gilbert?: GilbertConfig;
    a: PhysicsBody;
    b: PhysicsBody;
};
export declare const gilbertEPA: (props: GilbertEPAProps) => false | import("./EPA").EPAResult | null;
