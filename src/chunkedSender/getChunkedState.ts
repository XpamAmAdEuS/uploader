import createState from '../simple-state';
import type {
  ChunkedSendOptions,
  MandatoryChunkedOptions,
  Chunk,
  ChunkedState,
  ChunkedSenderState,
} from '../types';

const getChunkedState = (
  chunks: Chunk[],
  url: string,
  sendOptions: ChunkedSendOptions,
  chunkedOptions: MandatoryChunkedOptions,
): ChunkedState => {
  const { state, update } = createState<ChunkedSenderState>({
    finished: false,
    aborted: false,
    error: false,
    uploaded: {},
    requests: {},
    responses: [],
    chunkCount: chunks.length,
    startByte: sendOptions.startByte || 0,
    chunks,
    url,
    sendOptions,
    ...chunkedOptions,
  });

  const getState = () => state;

  const updateState = (updater: (arg0: ChunkedSenderState) => void) => {
    update(updater);
  };

  return {
    getState,
    updateState,
  };
};

export default getChunkedState;
