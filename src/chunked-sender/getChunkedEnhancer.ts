import { logger } from '../shared';
import {
  ChunkedOptions,
  TriggerMethod,
  UploaderCreateOptions,
  UploaderEnhancer,
  UploaderType,
} from '../types';
import createChunkedSender from '../chunkedSender';

const getChunkedEnhancer = (options: ChunkedOptions): UploaderEnhancer<UploaderCreateOptions> => {
  //return uploader enhancer
  return (
    uploader: UploaderType<UploaderCreateOptions>,
    trigger: TriggerMethod,
  ): UploaderType<UploaderCreateOptions> => {
    const sender = createChunkedSender(options, trigger);
    logger.debugLog(
      'chunkedSenderEnhancer: Created chunked-sender instance with options: ',
      options,
    );
    uploader.update({ send: sender.send });
    return uploader;
  };
};

export default getChunkedEnhancer;
