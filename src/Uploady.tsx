import React from 'react';
import { UploadyProps } from './types';
import NoDomUploady from './NoDomUploady';

const Uploady = (props: UploadyProps): React.ReactElement<typeof NoDomUploady> => {
  const {
    children,
    ...noDomProps
  } = props;

  return (
    <NoDomUploady
      {...noDomProps}
    >
      {children}
    </NoDomUploady>
  );
};

export default Uploady;
