import { devFreeze } from './shared';

export const NO_EXT = 'Uploady - tus was not registered. Make sure you used the enhancer';
export const PROXY_SYM = Symbol.for('__rpldy-sstt-proxy__');
export const STATE_SYM = Symbol.for('__rpldy-sstt-state__');
export const DEBUG_LOG_KEY = '__rpldy-logger-debug__';
export const XHR_SENDER_TYPE = 'rpldy-sender';
export const SUCCESS_CODES = [200, 201, 202, 203, 204];
export const BATCH_STATES = {
  PENDING: 'pending',
  ADDED: 'added',
  PROCESSING: 'processing',
  UPLOADING: 'uploading',
  CANCELLED: 'cancelled',
  FINISHED: 'finished',
  ABORTED: 'aborted',
  ERROR: 'error',
};

export const FILE_STATES = {
  PENDING: 'pending',
  ADDED: 'added',
  UPLOADING: 'uploading',
  CANCELLED: 'cancelled',
  FINISHED: 'finished',
  ERROR: 'error',
  ABORTED: 'aborted',
};

export const PreviewCard_STATES = {
  PROGRESS: 'PROGRESS',
  DONE: 'DONE',
  ABORTED: 'ABORTED',
  ERROR: 'ERROR',
} as const;

export const LESYM: symbol = Symbol.for('__le__');

export const LE_PACK_SYM: symbol = Symbol.for('__le__pack__');

export const UPLOADER_EVENTS = devFreeze({
  BATCH_ADD: 'BATCH-ADD',
  BATCH_START: 'BATCH-START',
  BATCH_PROGRESS: 'BATCH_PROGRESS',
  BATCH_FINISH: 'BATCH-FINISH',
  BATCH_ABORT: 'BATCH-ABORT',
  BATCH_CANCEL: 'BATCH-CANCEL',
  BATCH_ERROR: 'BATCH-ERROR',
  BATCH_FINALIZE: 'BATCH-FINALIZE',

  ITEM_START: 'FILE-START',
  ITEM_CANCEL: 'FILE-CANCEL',
  ITEM_PROGRESS: 'FILE-PROGRESS',
  ITEM_FINISH: 'FILE-FINISH',
  ITEM_ABORT: 'FILE-ABORT',
  ITEM_ERROR: 'FILE-ERROR',
  ITEM_FINALIZE: 'FILE-FINALIZE',

  REQUEST_PRE_SEND: 'REQUEST_PRE_SEND',

  ALL_ABORT: 'ALL_ABORT',
});

export const PROGRESS_DELAY = 50;

export const SENDER_EVENTS = devFreeze({
  ITEM_PROGRESS: 'ITEM_PROGRESS',
  BATCH_PROGRESS: 'BATCH_PROGRESS',
});

export const ITEM_FINALIZE_STATES = [
  FILE_STATES.FINISHED,
  FILE_STATES.ERROR,
  FILE_STATES.CANCELLED,
  FILE_STATES.ABORTED,
];

export const CHUNK_EVENTS = devFreeze({
  CHUNK_START: 'CHUNK_START',
  CHUNK_FINISH: 'CHUNK_FINISH',
});

export const CHUNKED_SENDER_TYPE = 'rpldy-chunked-sender';

export const UPLOAD_OPTIONS_COMP = Symbol.for('rpldy_component');

export const TUS_EXT: symbol = Symbol.for('__upldy-tus__');

export const TUS_SENDER_TYPE = 'rpldy-tus-sender';



export const KNOWN_EXTENSIONS = {
  CREATION: 'creation',
  CREATION_WITH_UPLOAD: 'creation-with-upload',
  TERMINATION: 'termination',
  CONCATENATION: 'concatenation',
  CREATION_DEFER_LENGTH: 'creation-defer-length',
};

export const FD_STORAGE_PREFIX = 'rpldy_tus_fd_';
export const RETRY_EXT: symbol = Symbol.for('__upldy-retry__');
export const RETRY_EVENT = 'RETRY_EVENT';
