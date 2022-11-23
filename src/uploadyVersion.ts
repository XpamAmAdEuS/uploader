import { hasWindow } from './shared';

export const GLOBAL_VERSION_SYM: symbol = Symbol.for('_rpldy-version_');

const getVersion = (): string => '1.1.0';

const getRegisteredVersion = (): string => {
  /* istanbul ignore next */
  const global: any = hasWindow() ? window : process;
  return global[GLOBAL_VERSION_SYM];
};

const registerUploadyContextVersion = (): void => {
  const global: any = hasWindow() ? window : process;
  global[GLOBAL_VERSION_SYM] = getVersion();
};

const getIsVersionRegisteredAndDifferent = (): boolean => {
  const registeredVersion = getRegisteredVersion();
  return !!registeredVersion && registeredVersion !== getVersion();
};

export {
  getVersion,
  getRegisteredVersion,
  registerUploadyContextVersion,
  getIsVersionRegisteredAndDifferent,
};
