import { SPHERE_NORMALS } from '../constants';
import { EPA } from './EPA';
import { gilbert } from './gilbert';
export const gilbertEPA = (props) => {
    const { a, b } = props;
    const gilbertProps = {
        a,
        b,
        config: props.gilbert,
    };
    let simplex = gilbert(gilbertProps);
    if (!simplex) {
        for (const norm of SPHERE_NORMALS) {
            simplex = gilbert({
                ...gilbertProps,
                config: { ...(gilbertProps.config || {}), initialAxis: norm },
            });
            if (simplex) {
                break;
            }
        }
    }
    if (!simplex)
        return false;
    return EPA({
        a,
        b,
        simplex,
        config: props.EPA,
    });
};
