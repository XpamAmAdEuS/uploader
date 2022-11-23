import { BatchItem, FileLike } from '../types';
import { FILE_STATES } from '../consts';

const BISYM = Symbol.for('__rpldy-bi__');

let iCounter = 0;

const getBatchItemWithUrl = (batchItem: BatchItem, url: string): BatchItem => {
  batchItem.url = url;
  return batchItem;
};

const getBatchItemWithFile = (batchItem: BatchItem, file: FileLike): BatchItem => {
  batchItem.file = file;
  return batchItem;
};

const isLikeFile = (f: BatchItem) =>
  // @ts-ignore
  f && (f instanceof File || f instanceof Blob || (typeof f === 'object' && f.name && f.type));

const createBatchItem = (f: BatchItem, batchId: string, isPending: boolean = false): BatchItem => {
  iCounter += f.id && f.batchId ? 0 : 1;

  //keep existing id for recycled items
  const id = f.id && f.batchId ? f.id : `${batchId}.item-${iCounter}`,
    state = isPending ? FILE_STATES.PENDING : FILE_STATES.ADDED;

  let batchItem = {
    id,
    batchId,
    state,
    uploadStatus: 0,
    completed: 0,
    loaded: 0,
    recycled: false,
    previousBatch: null as any,
  } as any;

  Object.defineProperty(batchItem, BISYM, {
    value: true,
    //need writable to be able to keep prop when unwrapped from simple-state
    writable: true,
  });

  if (typeof f === 'object' && (f as any)[BISYM] === true) {
    //recycling existing batch item
    batchItem.recycled = true;
    batchItem.previousBatch = f.batchId;
    f = (f.file as any) || f.url;
  }

  if (typeof f === 'string') {
    batchItem = getBatchItemWithUrl(batchItem, f);
  } else if (isLikeFile(f)) {
    batchItem = getBatchItemWithFile(batchItem, f as any);
  } else {
    throw new Error(`Unknown type of file added: ${typeof f}`);
  }

  return batchItem;
};

export default createBatchItem;
