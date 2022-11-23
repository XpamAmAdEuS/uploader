import { logger } from '../shared';
import xhrSend from '../sender';
import initTusUpload from '../initTusUpload';
import { TUS_SENDER_TYPE } from '../consts';
import doFeatureDetection from '../featureDetection';
import type { BatchItem, OnProgress, SendMethod, TusState } from '../types';
import { CHUNKING_SUPPORT } from '../chunked-sender/utils';

const doUpload = (
  items: any,
  url: any,
  sendOptions: any,
  onProgress: any,
  tusState: any,
  chunkedSender: any,
  fdRequest: any,
) => {
  let tusAbort: any;

  const callInit = () => {
    const tusResult = initTusUpload(items, url, sendOptions, onProgress, tusState, chunkedSender);
    tusAbort = tusResult.abort;
    return tusResult.request;
  };

  return {
    request: fdRequest ? fdRequest.request.then(callInit, callInit) : callInit(),

    abort: () => (tusAbort ? tusAbort() : fdRequest?.abort() || false),
  };
};

const tusSend = (chunkedSender: any, tusState: TusState): SendMethod => {
  const tusSend = (items: BatchItem[], url: string, sendOptions: any, onProgress: OnProgress) => {
    let result;

    if (!url) {
      throw new Error(TUS_SENDER_TYPE);
    }

    if (items.length > 1 || items[0].url) {
      //ignore this upload - let the chunked sender handle it
      result = chunkedSender.send(items, url, sendOptions, onProgress);
    } else {
      //TUS only supports a single file upload (no grouping)
      logger.debugLog(`tusSender: sending file using TUS protocol`);

      const fdRequest = tusState.getState().options.featureDetection
        ? doFeatureDetection(url, tusState)
        : null;

      const { request, abort } = doUpload(
        items,
        url,
        sendOptions,
        onProgress,
        tusState,
        chunkedSender,
        fdRequest,
      );

      result = {
        request,
        abort,
        senderType: TUS_SENDER_TYPE,
      };
    }

    return result;
  };

  return CHUNKING_SUPPORT ? (tusSend as any) : xhrSend;
};

export default tusSend;
