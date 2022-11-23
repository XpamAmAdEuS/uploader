import { isProduction, merge } from './shared';
import { UPLOAD_OPTIONS_COMP } from './consts';
import { ComponentType } from 'react';
import { TusOptions } from './types';
import { TUS_SENDER_DEFAULT_OPTIONS } from './defaults';

const logWarning = (condition: any, msg: string) => {
  if (!isProduction() && !condition) {
    // eslint-disable-next-line no-console
    console.warn(msg);
  }
};

const markAsUploadOptionsComponent = (Component: ComponentType<any>): void => {
  (Component as any)[UPLOAD_OPTIONS_COMP] = true;
};

const getIsUploadOptionsComponent = (Component: any): boolean =>
  Component[UPLOAD_OPTIONS_COMP] === true ||
  Component.target?.[UPLOAD_OPTIONS_COMP] === true ||
  Component.render?.[UPLOAD_OPTIONS_COMP] === true;

export { logWarning, markAsUploadOptionsComponent, getIsUploadOptionsComponent };

const getMandatoryTusOptions = (options?: TusOptions): TusOptions =>
  merge({} as TusOptions, TUS_SENDER_DEFAULT_OPTIONS, options!);

export { getMandatoryTusOptions };
