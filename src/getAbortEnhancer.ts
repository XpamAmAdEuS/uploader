import { abortAll, abortBatch, abortItem } from './abort';
import { UploaderEnhancer, UploaderType } from './types';

const getAbortEnhancer = <T>(): UploaderEnhancer<T> => {
  /**
   * an uploader enhancer function to add abort functionality
   */
  return (uploader: UploaderType<T>): UploaderType<T> => {
    (uploader as any).update({
      abortAll,
      abortBatch,
      abortItem
    })
    return uploader
  }
}

export default getAbortEnhancer;
