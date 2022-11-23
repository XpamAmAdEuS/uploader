import { generateUploaderEventHook } from '../hooksUtils';
import { RETRY_EVENT } from '../consts';

const useRetryListener = generateUploaderEventHook(RETRY_EVENT, false);

export default useRetryListener;
