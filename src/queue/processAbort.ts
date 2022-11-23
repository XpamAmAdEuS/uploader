import { BATCH_STATES, UPLOADER_EVENTS } from '../consts';
import processFinishedRequest from './processFinishedRequest';
import processQueueNext from './processQueueNext';
import { getIsBatchFinalized, finalizeBatch } from './batchHelpers';
import type { QueueState, UploadData } from '../types';

const getFinalizeAbortedItem = (queue: any) => (id: string, data: UploadData) =>
  processFinishedRequest(queue, [{ id, info: data }], processQueueNext);

const processAbortItem = (queue: QueueState, id: string): boolean => {
  const abortItemMethod = queue.getOptions().abortItem!;

  const state = queue.getState();

  return abortItemMethod(id, state.items, state.aborts, getFinalizeAbortedItem(queue));
};

const processAbortBatch = (queue: QueueState, id: string): void => {
  const abortBatchMethod = queue.getOptions().abortBatch!;

  const state = queue.getState(),
    batchData = state.batches[id],
    batch = batchData?.batch;

  if (batch && !getIsBatchFinalized(batch)) {
    finalizeBatch(queue, id, UPLOADER_EVENTS.BATCH_ABORT, BATCH_STATES.ABORTED);

    const { isFast } = abortBatchMethod(
      batch,
      batchData.batchOptions,
      state.aborts,
      state.itemQueue,
      getFinalizeAbortedItem(queue),
      queue.getOptions(),
    );

    if (isFast) {
      queue.clearBatchUploads(batch.id);
    }
  }
};

const processAbortAll = (queue: QueueState): void => {
  const abortAllMethod = queue.getOptions().abortAll!;

  queue.trigger(UPLOADER_EVENTS.ALL_ABORT);

  const state = queue.getState();

  const { isFast } = abortAllMethod(
    state.items,
    state.aborts,
    state.itemQueue,
    getFinalizeAbortedItem(queue),
    queue.getOptions(),
  );

  if (isFast) {
    queue.clearAllUploads();
  }
};

export { processAbortItem, processAbortBatch, processAbortAll };
