import React, { ElementType, forwardRef, useCallback, useRef } from 'react';
import type { ComponentType } from 'react';
import type { UploadButtonProps, UploadOptions } from './types';
import useUploadyContext from './useUploadyContext';
import { markAsUploadOptionsComponent } from './utils';

const asUploadButton = (Component: ComponentType<any>) => {
  const AsUploadButton = (props: UploadButtonProps, ref: any) => {
    const { showFileUpload } = useUploadyContext();
    const { id, className, text, children, extraProps, onClick, ...uploadOptions } = props;

    //using ref so onButtonClick can stay memoized
    const uploadOptionsRef = useRef<UploadOptions>();
    uploadOptionsRef.current = uploadOptions;

    const onButtonClick = useCallback(
      (e: any) => {
        showFileUpload(uploadOptionsRef.current);
        onClick?.(e);
      },
      [showFileUpload, uploadOptionsRef, onClick],
    );

    return (
      <Component
        ref={ref}
        onClick={onButtonClick}
        id={id}
        className={className}
        children={children || text || 'Upload'}
        {...extraProps}
      />
    );
  };

  markAsUploadOptionsComponent(AsUploadButton);

  return forwardRef<UploadButtonProps, any | ElementType>(AsUploadButton);
};

export default asUploadButton;
