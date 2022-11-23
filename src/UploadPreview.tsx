import React, { useEffect, useImperativeHandle, ReactElement } from 'react';
import { getPreviewsLoaderHook } from './usePreviewsLoader';
import type {
  PreviewProps,
  PreviewData,
  PreviewItem,
  PreviewMethods,
  PreviewBatchItemsMethod,
  UploadPreviewType,
} from './types';
import { useBatchStartListener } from './eventListenerHooks';

const showBasicPreview = (url: any, previewProps: any) => (
  <audio
    key={url}
    src={url}
    controls
    {...previewProps}
  />
);

const usePreviewMethods = (
  previews: any,
  clearPreviews: any,
  previewMethodsRef: any,
  onPreviewsChanged: any,
) => {
  useImperativeHandle<PreviewMethods, any>(previewMethodsRef, () => ({ clear: clearPreviews }), [
    clearPreviews,
  ]);

  useEffect(() => {
    if (onPreviewsChanged) {
      onPreviewsChanged(previews);
    }
  }, [previews, onPreviewsChanged]);
};

const getUploadPreviewForBatchItemsMethod = (
  method: PreviewBatchItemsMethod = useBatchStartListener,
): UploadPreviewType => {
  const usePreviewsLoader = getPreviewsLoaderHook(method);

  return (props: PreviewProps) => {
    const { PreviewComponent, previewMethodsRef, onPreviewsChanged, ...previewOptions } = props;
    const { previews, clearPreviews }: PreviewData = usePreviewsLoader(previewOptions);

    usePreviewMethods(previews, clearPreviews, previewMethodsRef, onPreviewsChanged);

    return previews.map((data: PreviewItem): ReactElement => {
      const { id, url, name, props: previewProps } = data;

      return PreviewComponent ? (
        <PreviewComponent
          key={id + url}
          id={id}
          url={url}
          name={name}
          {...previewProps}
        />
      ) : (
        showBasicPreview(url, previewProps)
      );
    });
  };
};

/**
 * UploadPreview uses Batch start event to display uploading items
 */
const UploadPreview: UploadPreviewType = getUploadPreviewForBatchItemsMethod();

export { getUploadPreviewForBatchItemsMethod };

export default UploadPreview;
