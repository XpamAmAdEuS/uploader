import { logger } from '../shared';
import createUpload from './createUpload';
import resumeUpload from './resumeUpload';
import type { BatchItem, ChunkedSender, OnProgress, TusState, UploadData } from '../types';
import { retrieveResumable } from '../resumableStore';
import handleTusUpload from '../tusSender/handleTusUpload';

const createStateItemData = (item: BatchItem, tusState: TusState) => {
  tusState.updateState((state) => {
    state.items[item.id] = {
      id: item.id,
      uploadUrl: null as any,
      size: item.file.size,
      offset: 0,
      parallelChunks: [],
    };
  });
};

const initTusUpload = (
  items: BatchItem[],
  url: string,
  sendOptions: any,
  onProgress: OnProgress,
  tusState: TusState,
  chunkedSender: ChunkedSender,
  parallelIdentifier: string = null as any,
): { abort: () => boolean; request: Promise<UploadData> } => {
  const { options } = tusState.getState(),
    //parallel upload when we're seeing the batch item, not the parallel chunk items
    isParallel = +options.parallel! > 1 && !parallelIdentifier,
    item = items[0],
    //we dont use resume for parallelized chunks
    persistedUrl = !isParallel && retrieveResumable(item, options, parallelIdentifier);

  createStateItemData(item, tusState);

  let initCall: any;

  if (isParallel) {
    //we dont need a create call for parallel uploads. Each chunk will have one
    initCall = {
      request: Promise.resolve({
        isNew: true,
      }),
      abort: () => true,
    };
  } else {
    initCall = persistedUrl
      ? //init resumable upload - this file has already started uploading
        resumeUpload(item, persistedUrl, tusState, sendOptions, parallelIdentifier)
      : //init new upload - first time uploading this file
        createUpload(item, url, tusState, sendOptions, parallelIdentifier);
  }

  const uploadRequest = handleTusUpload(
    items,
    url,
    sendOptions,
    onProgress,
    tusState,
    chunkedSender,
    initCall.request,
    !!persistedUrl,
    parallelIdentifier,
  );

  const abort = () => {
    logger.debugLog(`tusSender.handler: abort called for item: ${item.id}`);
    //attempt to abort create/resume call if its still running
    initCall.abort();

    initCall.request.then((data: any) => {
      if (data) {
        logger.debugLog(`tusSender.handler: aborting chunked upload for item:  ${item.id}`);

        const abortChunked = tusState.getState().items[item.id].abort;

        if (abortChunked) {
          abortChunked();
        }
      }
    });

    return true;
  };

  return {
    request: uploadRequest,
    abort,
  };
};

export default initTusUpload;
