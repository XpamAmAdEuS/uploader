import React, { useMemo } from 'react';
import Uploady from './Uploady';
import type { TusOptions, TusUploadyProps, UploaderCreateOptions, UploaderEnhancer } from './types';
import composeEnhancers from './uploader/composeEnhancers';
import { CHUNKING_SUPPORT } from './chunked-sender/utils';
import { logWarning } from './utils';
import getTusEnhancer from './getTusEnhancer';

const getEnhancer = (options: TusOptions, enhancer: UploaderEnhancer<UploaderCreateOptions>) => {
  const tusEnhancer = getTusEnhancer(options);
  return enhancer ? composeEnhancers(tusEnhancer, enhancer) : tusEnhancer;
};

const TusUploady = (props: TusUploadyProps) => {
  const {
    chunked,
    chunkSize,
    retries,
    parallel,
    version,
    featureDetection,
    featureDetectionUrl,
    onFeaturesDetected,
    resume,
    deferLength,
    overrideMethod,
    sendDataOnCreate,
    storagePrefix,
    lockedRetryDelay,
    forgetOnSuccess,
    ignoreModifiedDateInStorage,
    ...uploadyProps
  } = props;

  const enhancer = useMemo(
    () =>
      CHUNKING_SUPPORT
        ? getEnhancer(
            {
              chunked,
              chunkSize,
              retries,
              parallel,
              version,
              featureDetection,
              featureDetectionUrl,
              onFeaturesDetected,
              resume,
              deferLength,
              overrideMethod,
              sendDataOnCreate,
              storagePrefix,
              lockedRetryDelay,
              forgetOnSuccess,
              ignoreModifiedDateInStorage,
            },
            props.enhancer as any,
          )
        : undefined,
    [
      props.enhancer,
      chunked,
      chunkSize,
      retries,
      parallel,
      version,
      featureDetection,
      featureDetectionUrl,
      onFeaturesDetected,
      resume,
      deferLength,
      overrideMethod,
      sendDataOnCreate,
      storagePrefix,
      lockedRetryDelay,
      forgetOnSuccess,
      ignoreModifiedDateInStorage,
    ],
  );

  return (
    <Uploady
      {...uploadyProps}
      enhancer={enhancer as any}
    />
  );
};

logWarning(
  CHUNKING_SUPPORT,
  "This browser doesn't support chunking. Consider using @rpldy/uploady instead",
);

export default TusUploady;
