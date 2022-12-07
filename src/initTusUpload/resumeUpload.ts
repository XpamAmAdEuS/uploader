import { logger, request } from '../shared';
import { BatchItem, InitUploadResult, SendOptions, TusOptions, TusState } from '../types';
import { removeResumable } from '../resumableStore';
import { SUCCESS_CODES } from '../consts';

const handleSuccessfulResumeResponse = (
  item: BatchItem,
  url: string,
  tusState: TusState,
  resumeResponse: XMLHttpRequest,
) => {
  let canResume = false,
    isDone = false;

  logger.debugLog(
    `tusSender.resume - successfully initiated resume for item: ${item.id} - upload url = ${url}`,
  );

  const offset = parseInt(resumeResponse.getResponseHeader('Upload-Offset')!, 10);

  if (!isNaN(offset)) {
    const length = parseInt(resumeResponse.getResponseHeader('Upload-Length')!, 10);

    if (!isNaN(length) || tusState.getState().options.deferLength) {
      isDone = offset === length;
      canResume = !isDone;

      tusState.updateState((state) => {
        //update state with resume response for item
        state.items[item.id].uploadUrl = url;
        state.items[item.id].offset = offset;
      });
    }
  }

  return {
    offset,
    uploadUrl: url,
    isNew: false,
    isDone,
    canResume,
  };
};

const resumeWithDelay = (
  item: BatchItem,
  url: string,
  tusState: TusState,
  sendOptions: SendOptions,
  parallelIdentifier: string,
  attempt: number,
) =>
  new Promise((resolve) => {
    setTimeout(() => {
      makeResumeRequest(item, url, tusState, sendOptions, parallelIdentifier, attempt).request.then(
        resolve,
      );
    }, tusState.getState().options.lockedRetryDelay);
  });

const handleResumeFail = (item: BatchItem, options: TusOptions, parallelIdentifier: string) => {
  removeResumable(item, options, parallelIdentifier);

  return {
    isNew: false,
    canResume: false,
  };
};

const makeResumeRequest = (
  item: BatchItem,
  url: string,
  tusState: TusState,
  sendOptions: SendOptions,
  parallelIdentifier: string,
  attempt: number,
): any => {
  const { options } = tusState.getState();

  logger.debugLog(
    `tusSender.resume - resuming upload for ${item.id}${
      parallelIdentifier ? `-${parallelIdentifier}` : ''
    } at: ${url}`,
  );

  const pXhr = request(url, null as any, {
    method: 'HEAD',
    headers: {
      'tus-resumable': options.version!,
      ...sendOptions.headers,
    },
  });

  let resumeFinished = false;

  const resumeRequest = pXhr
    .then((resumeResponse: XMLHttpRequest) => {
      let result;

      if (resumeResponse && ~SUCCESS_CODES.indexOf(resumeResponse.status)) {
        result = handleSuccessfulResumeResponse(item, url, tusState, resumeResponse);
      } else if (resumeResponse?.status === 423 && attempt === 0) {
        logger.debugLog(
          `tusSender.resume: upload is locked for item: ${
            item.id
          }. Will retry in ${+options.lockedRetryDelay!}`,
          resumeResponse,
        );
        //Make one more attempt at resume
        result = resumeWithDelay(item, url, tusState, sendOptions, parallelIdentifier, 1);
      } else {
        logger.debugLog(
          `tusSender.resume: failed for item: ${item.id}${
            parallelIdentifier ? `-${parallelIdentifier}` : ''
          }`,
          resumeResponse,
        );
        result = handleResumeFail(item, options, parallelIdentifier);
      }

      return result;
    })
    .catch((error) => {
      logger.debugLog(`tusSender.resume: resume upload failed unexpectedly`, error);
      return handleResumeFail(item, options, parallelIdentifier);
    })
    .finally(() => {
      resumeFinished = true;
    });

  const abortResume = () => {
    if (!resumeFinished) {
      logger.debugLog(`tusSender.resume: aborting resume request for item: ${item.id}`);
      (pXhr as any).xhr.abort();
    }

    return !resumeFinished;
  };

  return {
    request: resumeRequest,
    abort: abortResume,
  };
};

const resumeUpload = (
  item: BatchItem,
  url: string,
  tusState: TusState,
  sendOptions: SendOptions,
  parallelIdentifier: string,
): InitUploadResult => {
  return makeResumeRequest(item, url, tusState, sendOptions, parallelIdentifier, 0);
};

export default resumeUpload;
