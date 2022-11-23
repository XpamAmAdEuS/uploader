import { isFunction } from './shared';
import type { PreviewOptions, FileLike } from './types';
import { PREVIEW_DEFAULTS } from './upload-preview.defaults';

const getWithMandatoryOptions = (options: PreviewOptions): PreviewOptions => {
  return {
    ...PREVIEW_DEFAULTS,
    ...options,
  };
};

const getFileObjectUrlByType = (file: FileLike): void | { name: any; url: string } => {
  return {
    url: URL.createObjectURL(file as any),
    name: file.name,
  };
};
export { isFunction, getWithMandatoryOptions, getFileObjectUrlByType };
