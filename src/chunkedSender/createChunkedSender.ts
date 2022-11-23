import { logger } from '../shared';
import xhrSend from '../sender';
import processChunks from './processChunks';
import type {
  BatchItem,
  ChunkedOptions,
  ChunkedSender,
  ChunkedSendOptions,
  TriggerMethod,
  OnProgress,
  SendResult,
} from '../types';
import { getMandatoryOptions } from '../chunked-sender/utils';

const createChunkedSender = (
  chunkedOptions: ChunkedOptions,
  trigger: TriggerMethod,
): ChunkedSender => {
  const options = getMandatoryOptions(chunkedOptions);

  const send = (
    items: BatchItem[],
    url: string,
    sendOptions: ChunkedSendOptions,
    onProgress: OnProgress,
  ): SendResult => {
    let result;

    if (!options.chunked || items.length > 1 || items[0].url || !items[0].file.size) {
      result = xhrSend(items, url, sendOptions, onProgress);
      logger.debugLog(`chunkedSender: sending items as normal, un-chunked requests`);
    } else {
      logger.debugLog(`chunkedSender: sending file as a chunked request`);
      result = processChunks(items[0], options, url, sendOptions, onProgress, trigger);
    }

    return result;
  };

  return {
    send,
  };
};

export default createChunkedSender;
