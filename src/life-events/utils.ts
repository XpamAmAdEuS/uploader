import { isFunction } from '../shared';

const validateFunction = (f: Function, name: string) => {
  if (!isFunction(f)) {
    throw new Error(`'${name}' is not a valid function`);
  }
};

const isUndefined = (val: any): boolean => typeof val === 'undefined';

export { validateFunction, isUndefined };
