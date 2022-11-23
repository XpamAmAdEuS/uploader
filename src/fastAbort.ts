import { AbortsMap, Batch } from './types';

const fastAbortBatch = (batch: Batch, aborts: AbortsMap) => {
  batch.items.forEach(({ id }) => aborts[id]?.());
};

const fastAbortAll = (aborts: AbortsMap) => {
  const runFn = (fn: any) => fn();

  Object.values(aborts).forEach(runFn);
};

export { fastAbortAll, fastAbortBatch };
