import React from 'react';
import type {
  UploadyContextType,
  UploadOptions,
  UploaderCreateOptions,
  EventCallback,
  UploadyUploaderType,
  BatchItem,
} from './types';

const UploadyContext: React.Context<UploadyContextType> = React.createContext<UploadyContextType>(
  null!,
);

export const createContextApi = (
  uploader: UploadyUploaderType
): UploadyContextType => {


  const upload = (files: BatchItem | BatchItem[], addOptions?: UploadOptions) => {
    uploader.add(files, addOptions);
  };

  const processPending = (uploadOptions?: UploadOptions) => {
    uploader.upload(uploadOptions);
  };

  const clearPending = () => {
    uploader.clearPending();
  };

  const setOptions = (options: UploaderCreateOptions) => {
    uploader.update(options);
  };

  const getOptions = () => {
    return uploader.getOptions();
  };

  const getExtension = (name: string | symbol): Record<string, unknown> => {
    return (uploader as any).getExtension(name);
  };

  const abort = (itemId?: string) => {
    uploader.abort(itemId);
  };

  const abortBatch = (batchId: string) => {
    uploader.abortBatch(batchId);
  };

  const on = (name: unknown, cb: EventCallback) => {
    return uploader.on(name, cb);
  };

  const once = (name: unknown, cb: EventCallback) => {
    return uploader.once(name, cb);
  };

  const off = (name: unknown, cb?: EventCallback) => {
    return uploader.off(name, cb);
  };

  const hasUploader = () => !!uploader;

  return {
    hasUploader,
    upload,
    processPending,
    clearPending,
    setOptions,
    getOptions,
    getExtension,
    abort,
    abortBatch,
    on,
    once,
    off,
  };
};

export default UploadyContext;
