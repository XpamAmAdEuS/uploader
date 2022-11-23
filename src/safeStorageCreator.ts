import { hasWindow } from './shared';
import type { SafeStorage } from './types';

const safeStorageCreator = (storageType: string): SafeStorage => {
  let isSupported = false;

  const checkSupport = () => {
    try {
      if (hasWindow() && storageType in window) {
        const key = '__lsTest';
        (window as any)[storageType].setItem(key, `__test-${Date.now()}`);
        (window as any)[storageType].removeItem(key);
        isSupported = true;
      }
    } catch (ex) {
      //fail silently
    }
  };

  checkSupport();

  const methods: string[] = ['key', 'getItem', 'setItem', 'removeItem', 'clear'];

  const safeStorage: SafeStorage = methods.reduce((res, method) => {
    (res as any)[method] = (...args: any[]) =>
      isSupported ? (window as any)[storageType][method](...args) : undefined;

    return res;
  }, {} as SafeStorage);

  safeStorage.isSupported = isSupported;

  Object.defineProperty(safeStorage, 'length', {
    get() {
      return isSupported ? (window as any)[storageType].length : 0;
    },
  });

  return safeStorage;
};

export default safeStorageCreator;
