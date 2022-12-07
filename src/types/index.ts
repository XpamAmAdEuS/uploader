import {BATCH_STATES} from "../consts";
import React, {ReactNode} from "react";

export type PreviewItem = {
    id: string;
    url: string;
    name: string;
    props: Record<string, unknown>;
};

export type PreviewData = {
    previews: PreviewItem[];
    clearPreviews: () => void;
};

export type PreviewComponentPropsMethod = (item: BatchItem, url: string) => Record<string, unknown>;

export type PreviewMethods = {
    clear: () => void;
};

export type PreviewBatchItemsMethod = (cb: (batch: { items: BatchItem[] }) => void) => void;

export interface PreviewOptions {
    rememberPreviousBatches?: boolean;
    loadFirstOnly?: boolean;
    previewComponentProps?: PreviewComponentPropsMethod;
}

export interface PreviewProps extends PreviewOptions {
    PreviewComponent?: any;
    previewMethodsRef?: React.RefObject<PreviewMethods>;
    onPreviewsChanged?: (previews: PreviewItem[]) => void;
}

export type UploadPreviewType = (props: PreviewProps) => any;

export type PreviewsLoaderHook = (props: PreviewOptions) => PreviewData;

export type UploaderCreateOptions = CreateOptionsWithAbort & {
    //the send method to use. Allows overriding the method used to send files to the server for example using a mock (default: @rpldy/sender)
    send?: SendMethod | null;
};

export type ItemsSender = {
    send: (ba: BatchItem[], Batch: any, UploaderCreateOptions: any) => SendResult;
    on: OnAndOnceMethod;
};

export type UploaderProcessor = {
    abort: (id?: string) => void;
    abortBatch: (batchId: string) => void;
    addNewBatch: (
        files: BatchItem | Array<BatchItem>,
        uploaderId: string,
        processOptions: UploaderCreateOptions,
    ) => any;
    clearPendingBatches: () => void;
    process: (batch: Batch, batchOptions?: UploaderCreateOptions) => void;
    processPendingBatches: (uploadOptions: UploadOptions) => void;
    runCancellable: Cancellable;
};

export type UploadyUploaderType = UploaderType<UploaderCreateOptions>;

export type ItemInfo = {
    id: string;
    uploadUrl?: string;
    size: number;
    offset: number;
    abort?: () => boolean;
    parallelChunks: string[];
};

export type InitData = {
    uploadUrl?: string;
    offset?: number;
    isNew?: boolean;
    isDone?: boolean;
    canResume?: boolean;
};

export type InitUploadResult = {
    request: Promise<InitData>;
    abort: () => boolean;
};

export interface TusOptions extends ChunkedOptions {
    version?: string;
    featureDetection?: boolean;
    featureDetectionUrl?: string | null;
    onFeaturesDetected?: (extensions: string[]) => TusOptions | void;
    resume?: boolean;
    deferLength?: boolean;
    overrideMethod?: boolean;
    sendDataOnCreate?: boolean;
    storagePrefix?: string;
    lockedRetryDelay?: number;
    forgetOnSuccess?: boolean;
    ignoreModifiedDateInStorage?: boolean;
}

export type RequestResult<T> = {
    request: Promise<T>;
    abort: () => boolean;
};

export type TusStateData = {
    options: TusOptions;
    items: Record<string, ItemInfo>;
    featureDetection: {
        extensions: string | null | undefined;
        version: string | null | undefined;
        processed: boolean;
    };
};
export type TusState = {
    getState: () => TusStateData;
    updateState: (arg0: (arg0: TusStateData) => void) => TusStateData;
};


export type SimpleState<T> = {
    state: T;
    update: (arg0: (arg0: T) => void) => T;
    unwrap: (arg0: Record<string, any> | null | undefined) => T | Record<string, any>;
};

export type PreSendData = { items: BatchItem[]; options: UploaderCreateOptions };

type EventHook<T> = (cb: (obj: T) => void, id?: string) => void;
type CancellableHook<T> = (cb: (obj: T) => boolean | void, id?: string) => void;
type EventHookWithState<T> = (cb?: (obj: T) => void, id?: string) => T;

export type ItemEventHook = EventHook<BatchItem>;
export type ItemCancellableEventHook = CancellableHook<BatchItem>;
export type ItemEventHookWithState = EventHookWithState<BatchItem>;

export type BatchEventHook = EventHook<Batch>;
export type BatchCancellableEventHook = CancellableHook<Batch>;
export type BatchEventHookWithState = EventHookWithState<Batch>;

export type RefObject<T> = { current: null | void | T };

export type AddUploadFunction = (files: BatchItem | BatchItem[], addOptions: UploadOptions) => void;

export type InputRef = { current: HTMLInputElement };

export type UploadyContextType = {
    hasUploader: () => boolean;
    upload: AddUploadFunction;
    processPending: (uploadOptions?: UploadOptions) => void;
    clearPending: () => void;
    setOptions: (options: UploaderCreateOptions) => void;
    getOptions: () => UploaderCreateOptions;
    on: OnAndOnceMethod;
    once: OnAndOnceMethod;
    off: OffMethod;
    abort: (id?: string) => void;
    abortBatch: (id: string) => void;
    getExtension: (name: string | symbol) => Record<string, unknown>;
};

export type UploaderListeners = { [key: string]: EventCallback };

export type NoDomUploadyProps = UploaderCreateOptions & {
    //whether to set debug flag for extra console logs
    debug?: boolean;
    //map of event name and event handler
    listeners?: UploaderListeners;
    //any part of your React app. Specifically any components that needs access to the uploading flow
    children?: ReactNode;
};

export type UploadyProps = NoDomUploadyProps


export type NonMaybeTypeFunc = <T>(param: T) => NonNullable<T>;

export type Destination = {
    url?: string;
    filesParamName?: string;
    params?: Record<string, unknown>;
    headers?: Record<any, any>;
    method?: string;
};

export type $Values<O extends object> = O[keyof O];

export type BatchState = $Values<typeof BATCH_STATES>;
export type FileState = $Values<typeof FILE_STATES>;

export type ProgressInfo = {
    done: boolean;
    failed: boolean;
    percent: number;
    response: any;
    metadata: Record<string, unknown>;
};

export type UploadData = {
    status: number;
    state: FileState;
    response: any;
};

export type FormatParamGroupNameMethod = (number: any, string: any) => string;

export type Headers = Record<any, any>;

export type FormatServerResponseMethod = (string: any, number: any, Headers: any) => any;

export type IsSuccessfulCall = (xhr: XMLHttpRequest) => boolean;

enum FILE_STATES {
    PENDING = 'pending',
    ADDED = 'added',
    UPLOADING = 'uploading',
    CANCELLED = 'cancelled',
    FINISHED = 'finished',
    ERROR = 'error',
    ABORTED = 'aborted',
}

export type Batch = {
    id: string;
    uploaderId: string;
    items: BatchItem[];
    state: BatchState;
    //average of percentage of upload completed for batch items
    completed: number;
    //sum of bytes uploaded for batch items
    loaded: number;
    //number of items originally added to batch when its created
    orgItemCount: number;
    additionalInfo: string;
};

export type FileFilterMethod = (
    file: File | string,
    index: number,
    files: File[] | string[],
) => boolean | Promise<boolean | undefined> | undefined;

export type UploadOptions = {
    //automatically upload files when they are added (default: true)
    autoUpload?: boolean;
    //clear pending batches on new upload (default: false)
    clearPendingOnAdd?: boolean;
    //destination properties related to the server files will be uploaded to
    destination?: Destination | null;
    //name (attribute) of the file input field (default: "file")
    inputFieldName?: string;
    //optional function to determine the upload field name when more than file is grouped in a single upload
    formatGroupParamName?: FormatParamGroupNameMethod;
    //whether to group multiple files in a single request (default: false)
    grouped?: boolean;
    //The maximum of files to group together in a single request  (default: 5)
    maxGroupSize?: number;
    //optional function to use to filter by filename/url
    fileFilter?: FileFilterMethod;
    //HTTP method to use when uploading (default: POST)
    method?: string;
    //collection of params to pass along with the upload (Destination params take precedence)
    params?: Record<string, unknown>;
    //whether to parse server response as json even if no json content type header found (default: false)
    forceJsonResponse?: boolean;
    //whether to set XHR withCredentials to true (default: false)
    withCredentials?: boolean;
    //whether file/url data will be sent as part of formdata (default: true)
    sendWithFormData?: boolean;
    //whether to include params with undefined value (default: false)
    formDataAllowUndefined?: boolean;
    //optional function to create the batch item's uploadResponse from the raw xhr response
    formatServerResponse?: FormatServerResponseMethod;
    //callback to use to decide whether upload response is successful or not
    isSuccessfulCall?: IsSuccessfulCall;
    //the pending/active item count threshold from which to start using the performant abort mechanism
    fastAbortThreshold?: number;
};

export type Trigger<T> = (string: any, ...args: any[]) => Promise<T>[];

export type Cancellable = (string: any, ...args: any[]) => Promise<boolean>;

export type TriggerCancellableOutcome = Promise<boolean> | Cancellable;

export type Updater<T> = (string: any, ...args: any[]) => Promise<T>;

export type GetExact<T> = T & Partial<T>;

export interface RequestOptions {
    method?: string;
    headers?: Record<string, any>;
    withCredentials?: boolean;
    preSend?: (xhr: XMLHttpRequest) => void;
}

export type MergeFn = <T>(target: T, ...sources: T[]) => T;



export type SendOptions = {
    method: string;
    paramName: string;
    params: Record<string, unknown>;
    headers?: Record<string, unknown>;
    forceJsonResponse: boolean;
    withCredentials: boolean;
    formatGroupParamName: FormatParamGroupNameMethod;
    sendWithFormData?: boolean;
    formDataAllowUndefined?: boolean;
    formatServerResponse?: FormatServerResponseMethod;
    isSuccessfulCall?: IsSuccessfulCall;
};

export type SenderProgressEvent = {
    total: number;
    loaded: number;
};

export type OnProgress = (e: SenderProgressEvent, objs: Record<string, unknown>[]) => void;

export type XhrSendConfig = {
    preRequestHandler: (
        issueRequest: (
            requestUrl?: string,
            requestData?: any,
            requestOptions?: Record<string, unknown>,
        ) => Promise<XMLHttpRequest>,
        items: BatchItem[],
        url: string,
        options: SendOptions,
        onProgress: OnProgress,
        config: XhrSendConfig,
    ) => Promise<XMLHttpRequest>;
    getRequestData: (items: BatchItem[], options: SendOptions) => any;
};

export type SendResult = {
    request: Promise<UploadData>;
    abort: () => boolean;
    senderType: string;
};

export type SendMethod = (
    item: BatchItem[],
    url: string,
    options: SendOptions,
    onProgress: OnProgress,
) => SendResult;

export type SafeStorage = {
    length: number;
    getItem(key: string): string;
    setItem(key: string, data: string): void;
    clear(): void;
    removeItem(key: string): void;
    key(index: number): string;
    isSupported: boolean;
};

export type RetryEventData = {
    items: BatchItem[];
    options: UploadOptions | void;
};

export type RetryEventCallback = (data: RetryEventData) => void;

export type RetryListenerHook = (cb: RetryEventCallback) => void;


export type RetryStateData = {
    batchIdsMap: Record<string, string[]>;
    failed: Record<string, BatchItem>;
};
export type RetryState = {
    updateState: (arg0: (arg0: RetryStateData) => void) => void;
    getState: () => RetryStateData;
};
export type BatchRetryMethod = (batchId: string, options?: UploadOptions) => boolean;
export type RetryMethod = (itemId?: string, options?: UploadOptions) => boolean;


export interface RawCreateOptions extends UploadOptions {
    enhancer?: RawUploaderEnhancer;
    concurrent?: boolean;
    maxConcurrent?: number;
}

export type PendingBatch = {
    batch: Batch;
    uploadOptions: RawCreateOptions;
};

export type UploadAddMethod = (
    files: BatchItem | BatchItem[],
    addOptions?: UploadOptions,
) => Promise<void>;

export type RegisterExtensionMethod = (
    name: unknown,
    methods: { [key: string]: (...args: any[]) => void | unknown },
) => void;

export type RawUploaderType = {
    id: string;
    update: (updateOptions: RawCreateOptions) => RawUploaderType;
    add: UploadAddMethod;
    upload: (uploadOptions?: UploadOptions) => void;
    abort: (id?: string) => void;
    abortBatch: (id: string) => void;
    getOptions: () => RawCreateOptions;
    getPending?: () => PendingBatch[];
    clearPending: () => void;
    on: OnAndOnceMethod;
    once: OnAndOnceMethod;
    off: OffMethod;
    registerExtension: RegisterExtensionMethod;
    getExtension: (name: unknown) => Record<string, unknown>;
};

export type RawUploaderEnhancer = (
    uploader: RawUploaderType,
    trigger: Trigger<any>,
) => RawUploaderType;


export type UploaderEnhancer<T> = (
    uploader: UploaderType<T>,
    trigger: Trigger<unknown>
) => UploaderType<T>

type BatchItemBase = {
    id: string
    batchId: string
    state: FileState
    uploadResponse?: any
    uploadStatus: number
    //percentage of upload completed
    completed: number
    //bytes uploaded
    loaded: number
    recycled: boolean
    previousBatch?: string
}
export type FileLike = {
    name: string
    size: number
    type: string
    lastModified: number
}
type BatchUrl = BatchItemBase & {
    url: string
}
type BatchFile = BatchItemBase & {
    file: FileLike
}
export type BatchItem = BatchUrl & BatchFile
export type UploadInfo = string | Record<string, any> | BatchItem

export type UploaderType<T> = {
    id: string
    update: (updateOptions: T) => UploaderType<T>
    add: (
        files: UploadInfo | UploadInfo[],
        addOptions?: UploadOptions | null | undefined
    ) => Promise<void>
    upload: (uploadOptions?: UploadOptions | null | undefined) => void
    abort: (id?: string) => void
    abortBatch: (id: string) => void
    getOptions: () => T
    clearPending: () => void
    on: OnAndOnceMethod
    once: OnAndOnceMethod
    off: OffMethod
    registerExtension: (arg0: any, arg1: Record<string, any>) => void
    getExtension: (arg0: any) => Record<string, any> | null | undefined
}


export type BatchData = {
    batch: Batch;
    batchOptions: UploaderCreateOptions;
    finishedCounter: number;
};

export type QueueStateData = {
    itemQueue: Record<string, string[]>;
    batchQueue: string[];
    currentBatch: string | null | undefined;
    batches: Record<string, BatchData>;
    items: Record<string, BatchItem>;
    activeIds: Array<string | string[]>;
    aborts: AbortsMap;
};

type UpdateStateMethod = (arg0: (arg0: QueueStateData) => void) => void;
type GetStateMethod = () => QueueStateData;
export type QueueState = {
    uploaderId: string;
    getOptions: () => UploaderCreateOptions;
    getState: GetStateMethod;
    getCurrentActiveCount: () => number;
    updateState: UpdateStateMethod;
    trigger: TriggerMethod;
    runCancellable: Cancellable;
    sender: ItemsSender;
    handleItemProgress: (arg0: BatchItem, arg1: number, arg2: number) => void;
    clearAllUploads: () => void;
    clearBatchUploads: (arg0: string) => void;
};

export type UploaderQueue = {
    updateState: UpdateStateMethod;
    getState: GetStateMethod;
    runCancellable: Cancellable;
    uploadBatch: (batch: Batch, batchOptions: UploaderCreateOptions | null | undefined) => void;
    addBatch: (batch: Batch, batchOptions: UploaderCreateOptions) => Batch;
    abortItem: (id: string) => boolean;
    abortBatch: (id: string) => void;
    abortAll: () => void;
    clearPendingBatches: () => void;
    uploadPendingBatches: (uploadOptions: UploadOptions | null | undefined) => void;
};
export type ProcessNextMethod = (arg0: QueueState) => Promise<void> | void;


export type MergeOptions = {
    undefinedOverwrites?: boolean;
    withSymbols?: boolean;
    predicate?: (unknown: any, mixed: any) => boolean;
};

export type MergeMethod = <T>(target: T, ...sources: Array<T>) => T;

export type EventCallback = (...args: any[]) => unknown | void;

export type OffMethod = (name: unknown, cb?: EventCallback) => void;

export type OnAndOnceMethod = (name: unknown, cb: EventCallback) => OffMethod;

export interface LifeEventsOptions {
    allowRegisterNonExistent?: boolean;
    canAddEvents?: boolean;
    canRemoveEvents?: boolean;
    collectStats?: boolean;
}

export type TriggerMethod = (name: unknown, ...args: unknown[]) => unknown;

export interface WithLife {
    on: OnAndOnceMethod;
    once: OnAndOnceMethod;
    off: OffMethod;
}

export interface LifeEventsAPI<T> {
    target: T & WithLife;
    trigger: TriggerMethod;
    addEvent: (name: unknown) => void;
    removeEvent: (name: unknown) => void;
    hasEvent: (name: unknown) => boolean;
    hasEventRegistrations: (name: unknown) => boolean;
}

export type RegItem = {
    name: any;
    cb: EventCallback;
    once: boolean;
};

export interface LifePack<T> {
    resolve: () => T;
}


export type ItemsSendData = {
    items: BatchItem[];
    options: UploaderCreateOptions;
    cancelled?: boolean;
};

export type Chunk = {
    id: string;
    start: number;
    end: number;
    data: Blob;
    attempt: number;
    uploaded: number;
    index: number;
};

export type ChunkedSenderState = MandatoryChunkedOptions & {
    finished: boolean;
    aborted: boolean;
    error: boolean;
    requests: { [key: string]: { abort: () => boolean } };
    responses: any[];
    chunks: Chunk[];
    uploaded: { [key: string]: number };
    url: string;
    sendOptions: SendOptions;
    chunkCount: number;
    startByte: number;
};

type ChunkedStateUpdateStateMethod = (value: (state: ChunkedSenderState) => void) => void;
type ChunkedStateGetStateMethod = () => ChunkedSenderState;

export type ChunkedState = {
    getState: ChunkedStateGetStateMethod;
    updateState: ChunkedStateUpdateStateMethod;
};

export type ChunksSendResponse = {
    sendPromise: Promise<UploadData>;
    abort: () => boolean;
};

export type FinalizeRequestMethod = (id: string, data: UploadData) => void;

export type AbortMethod = () => boolean;

export type AbortsMap = { [key: string]: AbortMethod };

export type ItemsQueue = { [key: string]: string[] };

export type AbortResult = { isFast: boolean };

export type AbortBatchMethod = (
    batch: Batch,
    batchOptions: UploadOptions,
    aborts: AbortsMap,
    queue: ItemsQueue,
    finalizeItem: FinalizeRequestMethod,
    options: UploadOptions,
) => AbortResult;

export type AbortAllMethod = (
    items: { [p: string]: BatchItem },
    aborts: AbortsMap,
    queue: ItemsQueue,
    finalizeItem: FinalizeRequestMethod,
    options: UploadOptions,
) => AbortResult;

export type AbortItemMethod = (
    id: string,
    items: { [p: string]: BatchItem },
    aborts: AbortsMap,
    finalizeItem: FinalizeRequestMethod,
) => boolean;

export type AbortMethodsOptions = {
    abortAll?: AbortAllMethod;
    abortBatch?: AbortBatchMethod;
    abortItem?: AbortItemMethod;
};

export type ChunkedOptions = {
    //whether to divide the uploaded file into chunks (default: true)
    chunked?: boolean;
    //the maximum chunk size (default: 5242880 bytes)
    chunkSize?: number;
    //the number of times to retry a failed chunk (default: 0)
    retries?: number;
    //the number of chunks to upload in parallel (default: 0)
    parallel?: number;
};

export type ChunkedSendOptions = SendOptions & {
    //the byte to start from (designed for resumable) (default: 0)
    startByte?: number;
};

export type MandatoryChunkedOptions = {
    chunked: boolean;
    chunkSize: number;
    retries: number;
    parallel: number;
};

export type ChunkedSender = {
    send: SendMethod;
};

export type ChunkEventData = {
    id: string;
    start: number;
    end: number;
    index: number;
    attempt: number;
};

export type ChunkStartEventData = {
    item: BatchItem;
    chunk: ChunkEventData;
    chunkItem: BatchItem;
    sendOptions: SendOptions;
    url: string;
    remainingCount: number;
    totalCount: number;
    onProgress: OnProgress;
};

export type ChunkFinishEventData = {
    item: BatchItem;
    chunk: ChunkEventData;
    uploadData: UploadData;
};

export type CreateOptionsWithAbort = RawCreateOptions & AbortMethodsOptions & {};

export type TusUploadyProps = UploadyProps & TusOptions & {};
