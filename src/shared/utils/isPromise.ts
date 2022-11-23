const isPromise = (p: PromiseLike<any>): boolean =>
  !!p && typeof p === 'object' && typeof p.then === 'function';

export default isPromise;
