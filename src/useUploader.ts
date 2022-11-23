import { useEffect, useMemo } from 'react';
import { logger } from './shared';
import createUploader from './uploader';
import type { UploaderListeners, UploadyUploaderType, UploaderCreateOptions } from './types';

const useUploader = (
  options: UploaderCreateOptions,
  listeners: UploaderListeners,
): UploadyUploaderType => {
  //avoid creating new instance of uploader (unless enhancer method changed)
  const uploader = useMemo<UploadyUploaderType>(
    () => {
      logger.debugLog('Uploady creating a new uploader instance', options);
      return createUploader(options);
    },
    //dont recreate the uploader when options changed - we do update later
    [options.enhancer],
  );

  //Forgoing any kind of memoization. Probably not worth the comparison work to save on the options merge
  uploader.update(options);

  useEffect(() => {
    if (listeners) {
      logger.debugLog('Uploady setting event listeners', listeners);
      Object.entries(listeners).forEach(([name, m]: [string, any]) => {
        uploader.on(name, m);
      });
    }

    return () => {
      if (listeners) {
        logger.debugLog('Uploady removing event listeners', listeners);
        Object.entries(listeners).forEach(([name, m]: [string, any]) => uploader.off(name, m));
      }
    };
  }, [listeners, uploader]);

  return uploader;
};

export default useUploader;
