import React, { forwardRef, memo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { hasWindow } from './shared';
import useUploadOptions from './useUploadOptions';
import { UploadyProps } from './types';
import NoDomUploady from './NoDomUploady';

type FileInputPortalProps = {
  container: HTMLElement;
  multiple: boolean;
  capture: string;
  accept: string;
  webkitdirectory: boolean;
  id: string;
  style: Object;
  noPortal: boolean;
};
const renderInput = (inputProps: any, instanceOptions: any, ref: any) => (
  <input
    {...inputProps}
    name={instanceOptions.inputFieldName}
    type="file"
    ref={ref}
  />
);

const renderInPortal = (
  container: any,
  isValidContainer: any,
  inputProps: any,
  instanceOptions: any,
  ref: any,
) =>
  container && isValidContainer
    ? ReactDOM.createPortal(renderInput(inputProps, instanceOptions, ref), container)
    : null;

const FileInputField = memo(
  forwardRef(({ container, noPortal, ...inputProps }: FileInputPortalProps, ref) => {
    const instanceOptions = useUploadOptions();
    const isValidContainer = container && container.nodeType === 1;

    // In DEV - SSR React will warn on mismatch between client&server :( -
    // https://github.com/facebook/react/issues/12615
    // https://github.com/facebook/react/issues/13097
    return noPortal
      ? renderInput(inputProps, instanceOptions, ref)
      : renderInPortal(container, isValidContainer, inputProps, instanceOptions, ref);
  }),
);

const Uploady = (props: UploadyProps): React.ReactElement<typeof NoDomUploady> => {
  const {
    multiple = true,
    capture,
    accept,
    webkitdirectory,
    children,
    inputFieldContainer,
    customInput,
    fileInputId,
    noPortal = false,
    ...noDomProps
  } = props;

  const container: HTMLElement = !customInput
    ? (inputFieldContainer as unknown as HTMLElement) ||
      (hasWindow() ? document.body : (null as unknown as HTMLElement))
    : (null as unknown as HTMLElement);

  const internalInputFieldRef = useRef<HTMLInputElement>(null!);

  return (
    <NoDomUploady
      {...noDomProps}
      inputRef={internalInputFieldRef}
    >
      {!customInput ? (
        <FileInputField
          container={container}
          multiple={multiple}
          capture={capture!}
          accept={accept!}
          webkitdirectory={webkitdirectory!}
          style={{ display: 'none' }}
          ref={internalInputFieldRef}
          id={fileInputId!}
          noPortal={noPortal}
        />
      ) : null}

      {children}
    </NoDomUploady>
  );
};

export default Uploady;
