import { triggerUpdater, createBatchItem, logger, getMerge, pick } from '../shared';
import { unwrap } from '../simple-state';
import xhrSend from '../sender';
import { CHUNK_EVENTS, FILE_STATES } from '../consts';
import type {
  BatchItem,
  Chunk,
  ChunkedState,
  ChunkStartEventData,
  OnProgress,
  SendResult,
  TriggerMethod,
} from '../types';
import ChunkedSendError from './ChunkedSendError';
import { getChunkDataFromFile } from '../chunked-sender/utils';

const getContentRangeValue = (chunk: any, data: any, item: any) =>
  data && `bytes ${chunk.start}-${chunk.start + data.size - 1}/${item.file.size}`;

const mergeWithUndefined = getMerge({ undefinedOverwrites: true });

const getSkippedResult = (): SendResult => ({
  request: Promise.resolve({
    state: FILE_STATES.FINISHED as any,
    response: 'skipping chunk as instructed by CHUNK_START handler',
    status: 200,
  }),
  abort: () => true,
  //passthrough type
  senderType: 'chunk-skipped-sender',
});

const uploadChunkWithUpdatedData = (
  chunk: Chunk,
  chunkedState: ChunkedState,
  item: BatchItem,
  onProgress: OnProgress,
  trigger: TriggerMethod,
): Promise<SendResult> => {
  const state = chunkedState.getState();
  const unwrappedOptions = unwrap(state.sendOptions);
  const sendOptions = {
    ...unwrappedOptions,
    headers: {
      ...unwrappedOptions.headers,
      'Content-Range': getContentRangeValue(chunk, chunk.data, item),
    },
  };
  const chunkItem = createBatchItem((chunk as any).data, chunk.id);

  const onChunkProgress = (e: any) => {
    onProgress(e, [chunk]);
  };

  const chunkIndex = state.chunks.indexOf(chunk);

  return (
    triggerUpdater<ChunkStartEventData>(trigger as any, CHUNK_EVENTS.CHUNK_START, {
      item: unwrap(item),
      chunk: pick(chunk, ['id', 'start', 'end', 'index', 'attempt']),
      chunkItem: { ...chunkItem },
      sendOptions,
      url: state.url,
      chunkIndex,
      remainingCount: state.chunks.length,
      totalCount: state.chunkCount,
      //TODO: should expose chunk_progress event instead of passing callback like this
      onProgress,
    })
        // @ts-ignore
      .then((updatedData: ChunkStartEventData & boolean) => {
        const skipChunk = updatedData === false;

        if (skipChunk) {
          logger.debugLog(
            `chunkedSender.sendChunk: received false from CHUNK_START handler - skipping chunk ${chunkIndex}, item ${item.id}`,
          );
        }

        //upload the chunk to the server
        return skipChunk
          ? getSkippedResult()
          : xhrSend(
              [chunkItem],
              updatedData?.url || state.url,
              mergeWithUndefined({} as any, sendOptions, updatedData?.sendOptions),
              onChunkProgress,
            );
      })
  );
};

const sendChunk = (
  chunk: Chunk,
  chunkedState: ChunkedState,
  item: BatchItem,
  onProgress: OnProgress,
  trigger: TriggerMethod,
): SendResult => {
  if (!chunk.data) {
    //slice the chunk based on bit position
    chunkedState.updateState((state) => {
      chunk.data = getChunkDataFromFile(item.file, chunk.start, chunk.end);
    });
  }

  if (!chunk.data) {
    throw new ChunkedSendError('chunk failure - failed to slice');
  }

  const url = chunkedState.getState().url;

  logger.debugLog(
    `chunkedSender.sendChunk: about to send chunk ${chunk.id} [${chunk.start}-${chunk.end}] to: ${
      url || ''
    }`,
  );

  const chunkXhrRequest = uploadChunkWithUpdatedData(
    chunk,
    chunkedState,
    item,
    onProgress,
    trigger,
  );

  const abort = () => {
    chunkXhrRequest.then(({ abort }) => abort());
    return true;
  };

  return {
    request: chunkXhrRequest.then(({ request }) => request),
    abort,
    //this type isnt relevant because it isnt exposed
    senderType: 'chunk-passthrough-sender',
  };
};

export default sendChunk;
