import merge, { isMergeObj } from './merge';

type MergeFn = <T>(target: T, ...sources: T[]) => T;

/**
 * does deep clone to the passed object, returning a new object
 * @param obj
 * @param mergeFn the merge function to use (default: utils/merge)
 * @returns {Object}
 */
const clone = <T>(obj: T, mergeFn: MergeFn = merge): T =>
  isMergeObj(obj) ? (mergeFn(Array.isArray(obj) ? [] : {}, obj as any) as T) : obj;

export default clone;
