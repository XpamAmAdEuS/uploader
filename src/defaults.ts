import { devFreeze } from './shared';

export const CHUNKED_DEFAULT_OPTIONS = devFreeze({
  chunked: true,
  chunkSize: 5242880,
  retries: 0,
  parallel: 1,
});

export const TUS_SENDER_DEFAULT_OPTIONS = devFreeze({
  ...CHUNKED_DEFAULT_OPTIONS,
  featureDetection: false,
  featureDetectionUrl: null,
  version: '1.0.0',
  resume: true,
  overrideMethod: false,
  deferLength: false,
  sendDataOnCreate: false,
  storagePrefix: '__rpldy-tus__',
  lockedRetryDelay: 2000,
  forgetOnSuccess: false,
  ignoreModifiedDateInStorage: false,
});
