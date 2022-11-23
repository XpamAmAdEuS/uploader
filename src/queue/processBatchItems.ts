import processFinishedRequest from './processFinishedRequest';
import { getItemsPrepareUpdater } from './preSendPrepare';
import { FILE_STATES, ITEM_FINALIZE_STATES, UPLOADER_EVENTS } from '../consts';
import {
  BatchItem,
  ItemsSendData,
  ProcessNextMethod,
  QueueState,
  SendResult,
  UploadData,
} from '../types';
import { logger } from '../shared';

const preparePreRequestItems = getItemsPrepareUpdater<BatchItem>(
  UPLOADER_EVENTS.REQUEST_PRE_SEND,
  // @ts-ignore
  (items) => items,
  (items, options) => ({ items, options }),
);

const updateUploadingState = (queue: QueueState, items: BatchItem[], sendResult: SendResult) => {
  queue.updateState((state: any) => {
    items.forEach((bi) => {
      const item = state.items[bi.id];
      item.state = FILE_STATES.UPLOADING;
      state.aborts[bi.id] = sendResult.abort;
    });
  });
};

const sendAllowedItems = (
  queue: QueueState,
  itemsSendData: ItemsSendData,
  next: ProcessNextMethod,
) => {
  const { items, options } = itemsSendData;
  const batch = queue.getState().batches[items[0].batchId]?.batch;

  if (batch) {
    //batch can be removed when using async pre-send/batch-start returning after user abort
    let sendResult: SendResult;

    try {
      sendResult = queue.sender.send(items, batch, options);
    } catch (ex: any) {
      logger.debugLog(`uploader.queue: sender failed with unexpected error`, ex);
      //provide error result so file(s) are marked as failed
      sendResult = {
        // @ts-ignore
        request: Promise.resolve({
          status: 0,
          state: FILE_STATES.ERROR,
          response: ex.message,
        }),
        abort: () => false,
        senderType: 'exception-handler',
      };
    }

    const { request } = sendResult;

    updateUploadingState(queue, items, sendResult);

    request
      //wait for server request to return
      .then((requestInfo: UploadData) => {
        const finishedData = items.map((item) => ({
          id: item.id,
          info: requestInfo,
        }));

        processFinishedRequest(queue, finishedData, next);
      });
  }
};

const reportCancelledItems = (
  queue: QueueState,
  items: BatchItem[],
  cancelledResults: boolean[],
  next: ProcessNextMethod,
): boolean => {
  const cancelledItemsIds: string[] = cancelledResults
    .map((isCancelled: boolean, index: number) => (isCancelled ? items[index].id : (null as any)))
    .filter(Boolean);

  if (cancelledItemsIds.length) {
    const finishedData = cancelledItemsIds.map((id: string) => ({
      id,
      info: { status: 0, state: FILE_STATES.CANCELLED, response: 'cancel' },
    }));

    // @ts-ignore
    processFinishedRequest(queue, finishedData, next); //report about cancelled items
  }

  return !!cancelledItemsIds.length;
};

const reportPreparedError = (
  error: any,
  queue: QueueState,
  items: BatchItem[],
  next: ProcessNextMethod,
) => {
  const finishedData = items.map(({ id }: BatchItem) => ({
    id,
    info: { status: 0, state: FILE_STATES.ERROR, response: error },
  }));

  // @ts-ignore
  processFinishedRequest(queue, finishedData, next); //report about failed items
};

//make sure item is still pending. Something might have changed while waiting for ITEM_START handling. Maybe someone called abort...
const getAllowedItem = (id: string, queue: QueueState) => {
  const item: BatchItem = queue.getState().items[id];
  return item && !ITEM_FINALIZE_STATES.includes(item.state) ? item : undefined;
};

const processAllowedItems = ({ allowedItems, cancelledResults, queue, items, ids, next }: any) => {
  const afterPreparePromise = allowedItems.length
    ? preparePreRequestItems(queue, allowedItems)
    : Promise.resolve();

  return (
    afterPreparePromise
      .catch((err) => {
        logger.debugLog('uploader.queue: encountered error while preparing items for request', err);
        reportPreparedError(err, queue, items, next);
      })
      // @ts-ignore
      .then((itemsSendData: ItemsSendData) => {
        let nextP;
        if (itemsSendData) {
          if (itemsSendData.cancelled) {
            cancelledResults = ids.map(() => true);
          } else {
            //make sure files aren't aborted while async prepare was waiting
            const hasAborted = itemsSendData.items.some((item) =>
              ITEM_FINALIZE_STATES.includes(item.state),
            );

            if (!hasAborted) {
              //we dont need to wait for the response here
              sendAllowedItems(
                queue,
                {
                  items: itemsSendData.items,
                  options: itemsSendData.options,
                },
                next,
              );
            } else {
              logger.debugLog('uploader.queue: send data contains aborted items - not sending');
            }
          }
        }

        //if not cancelled we can go to process more items immediately (and not wait for upload responses)
        if (!reportCancelledItems(queue, items, cancelledResults, next)) {
          nextP = next(queue); //when concurrent is allowed, we can go ahead and process more
        }

        //returning promise for testing purposes
        return nextP;
      })
  );
};

//send group of items to be uploaded
const processBatchItems = (
  queue: QueueState,
  ids: string[],
  next: ProcessNextMethod,
): Promise<void> => {
  const state = queue.getState();
  //ids will have more than one when grouping is allowed
  let items: any[] = Object.values(state.items);
  items = items.filter((item: BatchItem) => !!~ids.indexOf(item.id));

  //allow user code cancel items from start event handler(s)
  //returning promise for testing purposes
  return Promise.all(
    items.map((i: BatchItem) => queue.runCancellable(UPLOADER_EVENTS.ITEM_START, i)),
  )
    .then((cancelledResults) => {
      const allowedItems: BatchItem[] = cancelledResults
        .map(
          (isCancelled: boolean, index: number): BatchItem =>
            isCancelled ? (null as any) : getAllowedItem(items[index].id, queue),
        )
        .filter(Boolean);

      return {
        allowedItems,
        cancelledResults,
        queue,
        items,
        ids,
        next,
      };
    })
    .then(processAllowedItems);
};

export default processBatchItems;
