import React, { forwardRef } from 'react';
import asUploadButton from './asUploadButton';

const UploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <button
      ref={ref}
      {...props}
    />
  )),
);

export default UploadButton;
