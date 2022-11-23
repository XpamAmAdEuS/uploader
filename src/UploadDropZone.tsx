import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { getFilesFromDragEvent } from './html-dir-content';
import type { UploadDropZoneProps, UploadOptions } from './types';
import useUploadyContext from './useUploadyContext';
import { markAsUploadOptionsComponent } from './utils';

const UploadDropZone = forwardRef<HTMLDivElement, UploadDropZoneProps>(
  (
    {
      className,
      id,
      children,
      onDragOverClassName,
      dropHandler,
      htmlDirContentParams,
      shouldRemoveDragOver,
      extraProps,
      ...uploadOptions
    },
    ref,
  ) => {
    const { upload } = useUploadyContext();
    const containerRef = useRef(null);
    const dragLeaveTrackerRef = useRef(false);

    useImperativeHandle<HTMLDivElement, any>(ref, () => containerRef.current, []);

    //using ref so upload can stay memoized
    const uploadOptionsRef = useRef<UploadOptions>();
    uploadOptionsRef.current = uploadOptions;

    const handleEnd = useCallback(() => {
      dragLeaveTrackerRef.current = false;

      if (containerRef.current && onDragOverClassName) {
        (containerRef.current as HTMLDivElement).classList.remove(onDragOverClassName);
      }
    }, [onDragOverClassName, containerRef]);

    const dropFileHandler = useCallback(
      (e: React.DragEvent) => {
        return dropHandler
          ? Promise.resolve(dropHandler(e))
          : getFilesFromDragEvent(e, htmlDirContentParams || {});
      },
      [dropHandler, htmlDirContentParams],
    );

    const handleDropUpload = useCallback(
      (e: React.DragEvent) => {
        dropFileHandler(e).then((files: any) => {
          upload(files, uploadOptionsRef.current!);
        });
      },
      [upload, dropFileHandler, uploadOptionsRef],
    );

    const onDragEnter = useCallback(
      (e: any) => {
        dragLeaveTrackerRef.current =
          !dragLeaveTrackerRef.current && e.target === containerRef.current;

        if (containerRef.current && onDragOverClassName) {
          (containerRef.current as HTMLDivElement).classList.add(onDragOverClassName);
        }
      },
      [onDragOverClassName, containerRef],
    );

    const onDragOver = useCallback((e: any) => {
      //must have drag over event handler with preventDefault for drop to work
      e.preventDefault();
    }, []);

    const onDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.persist();

        handleEnd();
        handleDropUpload(e);
      },
      [handleEnd, handleDropUpload],
    );

    const onDragLeave = useCallback(
      (e: any) => {
        if (
          (dragLeaveTrackerRef.current && e.target === containerRef.current) ||
          shouldRemoveDragOver?.(e)
        ) {
          handleEnd();
        }
      },
      [handleEnd, containerRef, shouldRemoveDragOver],
    );

    const onDragEnd = useCallback(
      (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        handleEnd();
      },
      [handleEnd],
    );

    return (
      <div
        id={id}
        className={className}
        ref={containerRef}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        onDragLeave={onDragLeave}
        onDragEnd={onDragEnd}
        {...extraProps}
      >
        {children}
      </div>
    );
  },
);

markAsUploadOptionsComponent(UploadDropZone);

export default UploadDropZone;
