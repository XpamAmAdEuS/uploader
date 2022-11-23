import { merge, hasWindow } from '../shared';
import type { FileLike, ChunkedOptions, MandatoryChunkedOptions } from '../types';
import { CHUNKED_DEFAULT_OPTIONS } from '../defaults';

const getMandatoryOptions = (options: ChunkedOptions): MandatoryChunkedOptions =>
  <MandatoryChunkedOptions>merge({}, CHUNKED_DEFAULT_OPTIONS, options);

let sliceMethod = null as any;

const isChunkingSupported = (): boolean => {
  sliceMethod = null;
  if (hasWindow() && 'Blob' in window) {
    sliceMethod =
      Blob.prototype.slice ||
        (Blob as any).prototype.webkitSlice ||
        (Blob as any).prototype.mozSlice;
  }

  return !!sliceMethod;
};

const CHUNKING_SUPPORT: boolean = isChunkingSupported();

const getChunkDataFromFile = (file: FileLike, start: number, end: number): Blob => {
  const blob = sliceMethod.call(file, start, end, file.type);

  if (blob) {
    blob.name = file.name;
    blob.lastModified = file.lastModified;
  }

  return blob;
};

export {
  CHUNKING_SUPPORT,
  getMandatoryOptions,
  getChunkDataFromFile,
  isChunkingSupported, //for tests
};
