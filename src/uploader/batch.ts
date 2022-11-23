import { createBatchItem, isPromise } from '../shared';
import { DEFAULT_FILTER } from './defaults';
import { getIsFileList } from './utils';
import type { UploaderCreateOptions, BatchItem, Batch, FileFilterMethod } from '../types';
import { BATCH_STATES } from '../consts';

let bCounter = 0;

const processFiles = (
  batchId: any,
  files: BatchItem | BatchItem[],
  isPending: boolean,
  fileFilter: FileFilterMethod,
): Promise<BatchItem[]> => {
  const filterFn = fileFilter || DEFAULT_FILTER;

  return Promise.all(
    Array.prototype.map.call(files, (f) => {
      // @ts-ignore
      const filterResult = filterFn(f);
      // @ts-ignore
      return isPromise(filterResult)
        ? // @ts-ignore
          filterResult.then((result) => !!result && f)
        : !!filterResult && f;
    }),
    // @ts-ignore
  ).then((filtered) => filtered.filter(Boolean).map((f) => createBatchItem(f, batchId, isPending)));
};

const createBatch = (
  files: BatchItem | BatchItem[],
  uploaderId: string,
  options: UploaderCreateOptions,
): Promise<Batch> => {
  bCounter += 1;
  const id = `batch-${bCounter}`;

  const isFileList = getIsFileList(files);

  files = Array.isArray(files) || isFileList ? files : [files];

  const isPending = !options.autoUpload;

  return processFiles(id, files, isPending, options.fileFilter!).then((items) => {
    return {
      id,
      uploaderId,
      items,
      state: isPending ? BATCH_STATES.PENDING : BATCH_STATES.ADDED,
      completed: 0,
      loaded: 0,
      orgItemCount: items.length,
      additionalInfo: null as any,
    };
  });
};

export default createBatch;
