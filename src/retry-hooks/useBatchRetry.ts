import { BatchRetryMethod, UploadOptions } from '../types';
import useUploadyContext from '../useUploadyContext';
import { RETRY_EXT } from '../consts';

const useBatchRetry = (): BatchRetryMethod => {
  const context = useUploadyContext();
  const ext = context.getExtension(RETRY_EXT);

  return <(batchId: string, options?: UploadOptions) => boolean>ext.retryBatch;
};

export default useBatchRetry;
