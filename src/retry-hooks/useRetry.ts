import { RetryMethod, UploadOptions } from '../types';
import useUploadyContext from '../useUploadyContext';
import { RETRY_EXT } from '../consts';

const useRetry = (): RetryMethod => {
  const context = useUploadyContext();
  const ext = context.getExtension(RETRY_EXT);

  return <(itemId?: string, options?: UploadOptions) => boolean>ext.retry;
};

export default useRetry;
