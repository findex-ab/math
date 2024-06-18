import { SPHERE_NORMALS } from '../constants';
import { PhysicsBody } from '../physics/body';
import { EPA, EPAConfig } from './EPA';
import { GilbertConfig, GilbertProps, gilbert } from './gilbert';

export type GilbertEPAProps = {
  EPA?: EPAConfig;
  gilbert?: GilbertConfig;
  a: PhysicsBody;
  b: PhysicsBody;
};

export const gilbertEPA = (props: GilbertEPAProps) => {
  const { a, b } = props;

  const gilbertProps: GilbertProps = {
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
  if (!simplex) return false;
  return EPA({
    a,
    b,
    simplex,
    config: props.EPA,
  });
};
