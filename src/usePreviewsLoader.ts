import { useState, useCallback, useMemo } from 'react';

import type {
  PreviewItem,
  PreviewOptions,
  PreviewData,
  PreviewBatchItemsMethod,
  PreviewsLoaderHook,
  Batch,
  BatchItem,
} from './types';
import { getFileObjectUrlByType, getWithMandatoryOptions } from './upload-preview.utils';

const getFilePreviewUrl = (file: any) => {
  return getFileObjectUrlByType(file);
};

const getItemProps = (previewComponentProps: any, item: BatchItem, url: string) => {
  return previewComponentProps(item, url);
};

const loadPreviewData = (item: BatchItem): PreviewItem => {
  let data: any;

  if (item.file) {
    data = getFilePreviewUrl(item.file);
  } else {
    data = {
      url: item.url,
      name: item.url,
    };
  }

  return (
    data && {
      ...data,
      id: item.id,
    }
  );
};

const mergePreviewData = (prev: any[], next: any[]) => {
  const newItems: any[] = [];

  //dedupe and merge new with existing
  next.forEach((n) => {
    const existingIndex = prev.findIndex((p) => p.id === n.id);

    if (~existingIndex) {
      prev.splice(existingIndex, 1, n);
    } else {
      newItems.push(n);
    }
  });

  return prev.concat(newItems);
};

const getPreviewsDataWithItemProps = (
  previewsData: any[],
  items: any[],
  previewComponentProps: any,
) => {
  let newData = previewsData;

  if (previewComponentProps) {
    newData = previewsData.map((pd) => ({
      ...pd,
      props: getItemProps(
        previewComponentProps,
        items.find(({ id }) => id === pd.id),
        pd.url,
      ),
    }));
  }

  return newData;
};

const getPreviewsLoaderHook = (batchItemsMethod: PreviewBatchItemsMethod): PreviewsLoaderHook => {
  return (props: PreviewOptions): PreviewData => {
    const previewComponentProps = props.previewComponentProps;
    const [previews, setPreviews] = useState<{ previews: PreviewItem[]; items: BatchItem[] }>({
      previews: [],
      items: [],
    });
    const previewOptions: PreviewOptions = getWithMandatoryOptions(props);

    const clearPreviews = useCallback(() => {
      setPreviews({ previews: [], items: [] });
    }, []);

    batchItemsMethod((batch: Partial<Batch>) => {
      const items: BatchItem[] = previewOptions.loadFirstOnly
        ? batch.items!.slice(0, 1)
        : batch.items!;

      const previewsData = items.map((item) => loadPreviewData(item)).filter(Boolean);

      setPreviews({
        previews: props.rememberPreviousBatches
          ? mergePreviewData(previews.previews, previewsData)
          : previewsData,
        items: props.rememberPreviousBatches ? previews.items.concat(items) : items,
      });
    });

    const previewsWithItemProps = useMemo(
      () => getPreviewsDataWithItemProps(previews.previews, previews.items, previewComponentProps),
      [previews, previewComponentProps],
    );

    return { previews: previewsWithItemProps, clearPreviews };
  };
};

export { getPreviewsLoaderHook };
