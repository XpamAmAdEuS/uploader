import createTusSender from './tusSender';
import { TUS_EXT } from './consts';
import type { TusOptions, UploaderEnhancer } from './types';

const getTusEnhancer = (options?: TusOptions): UploaderEnhancer<any> => {
  return (uploader, trigger) => {
    const sender = createTusSender(uploader, options!, trigger);
    uploader.update({ send: sender.send });

    uploader.registerExtension(TUS_EXT, {
      getOptions: sender.getOptions,
    });

    return uploader;
  };
};

export default getTusEnhancer;
