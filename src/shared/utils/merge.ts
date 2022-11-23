import isPlainObject from './isPlainObject';
import { MergeMethod, MergeOptions } from '../../types';

export const isMergeObj = <T>(obj: T): boolean => isPlainObject(obj) || Array.isArray(obj);

const getKeys = (obj: Object, options: MergeOptions) => {
  const keys = Object.keys(obj);
  // @ts-ignore
  return options.withSymbols ? keys.concat(Object.getOwnPropertySymbols(obj)) : keys;
};

const getMerge = (options: MergeOptions = {}): MergeMethod => {
  const merge = <T>(target: T, ...sources: T[]): T => {
    if (target && sources.length) {
      sources.forEach((source) => {
        if (source) {
          getKeys(source, options).forEach((key) => {
            const prop = (source as any)[key];

            if (!options.predicate || options.predicate(key, prop)) {
              if (typeof prop !== 'undefined' || options.undefinedOverwrites) {
                //object/array - go deeper
                if (isMergeObj(prop)) {
                  if (
                    typeof (target as any)[key] === 'undefined' ||
                    !isPlainObject((target as any)[key])
                  ) {
                    //recreate target prop if doesnt exist or not an object
                    (target as any)[key] = Array.isArray(prop) ? [] : {};
                  }

                  merge((target as any)[key], prop);
                } else {
                  (target as any)[key] = prop;
                }
              }
            }
          });
        }
      });
    }

    return target;
  };

  return merge;
};

/**
 * Does deep merge of simple objects and arrays (only)
 *
 * The first parameter is the target
 * Will only merge objects passed as arguments to this method
 * Any property in a later object will simply override the one in a previous one
 * Undefined properties from sources will be ignored
 *
 * No recursion protection
 */
export default getMerge();

export { getMerge };
