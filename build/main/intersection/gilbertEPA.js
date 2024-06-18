"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gilbertEPA = void 0;
const constants_1 = require("../constants");
const EPA_1 = require("./EPA");
const gilbert_1 = require("./gilbert");
const gilbertEPA = (props) => {
    const { a, b } = props;
    const gilbertProps = {
        a,
        b,
        config: props.gilbert,
    };
    let simplex = (0, gilbert_1.gilbert)(gilbertProps);
    if (!simplex) {
        for (const norm of constants_1.SPHERE_NORMALS) {
            simplex = (0, gilbert_1.gilbert)(Object.assign(Object.assign({}, gilbertProps), { config: Object.assign(Object.assign({}, (gilbertProps.config || {})), { initialAxis: norm }) }));
            if (simplex) {
                break;
            }
        }
    }
    if (!simplex)
        return false;
    return (0, EPA_1.EPA)({
        a,
        b,
        simplex,
        config: props.EPA,
    });
};
exports.gilbertEPA = gilbertEPA;
