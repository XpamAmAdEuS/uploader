import { logger, pick } from '../shared';
import { unwrap } from '../simple-state';
import { CHUNK_EVENTS, FILE_STATES } from '../consts';
import { BatchItem, ChunkedState, OnProgress, SendResult, TriggerMethod } from '../types';

const handleChunkRequest = (
  chunkedState: ChunkedState,
  item: BatchItem,
  chunkId: string,
  chunkSendResult: SendResult,
  trigger: TriggerMethod,
  onProgress: OnProgress,
): Promise<void> => {
  chunkedState.updateState((state) => {
    state.requests[chunkId] = {
      id: chunkId,
      abort: chunkSendResult.abort,
    } as any;
  });

  return chunkSendResult.request.then((result) => {
    logger.debugLog(`chunkedSender: request finished for chunk: ${chunkId} - `, result);

    chunkedState.updateState((state: any) => {
      delete state.requests[chunkId];
    });

    const chunks = chunkedState.getState().chunks;
    const index = chunks.findIndex((c) => c.id === chunkId);

    if (~index) {
      if (result.state === FILE_STATES.FINISHED) {
        const finishedChunk = chunks[index];

        chunkedState.updateState((state: any) => {
          //remove chunk so eventually there are no more chunks to send
          state.chunks = state.chunks.slice(0, index).concat(state.chunks.slice(index + 1));
        });

        const chunkSize = finishedChunk.end - finishedChunk.start;

        //issue progress event when chunk finished uploading, so item progress data is updated
        onProgress({ loaded: chunkSize, total: item.file.size }, [finishedChunk]);

        trigger(CHUNK_EVENTS.CHUNK_FINISH, {
          chunk: pick(finishedChunk, ['id', 'start', 'end', 'index', 'attempt']),
          item: unwrap(item),
          uploadData: result,
        });
      } else if (result.state !== FILE_STATES.ABORTED) {
        //increment attempt in case chunk failed (and not aborted)
        chunkedState.updateState((state: any) => {
          state.chunks[index].attempt += 1;
        });
      }

      chunkedState.updateState((state: any) => {
        state.responses.push(result.response);
      });
    }
  });
};

export default handleChunkRequest;
