import useUploadyContext from './useUploadyContext';
import { UploaderCreateOptions } from './types';

const useUploadOptions = (options?: UploaderCreateOptions): UploaderCreateOptions => {
  const context = useUploadyContext();

  if (options) {
    context.setOptions(options);
  }

  return context.getOptions();
};

export default useUploadOptions;
