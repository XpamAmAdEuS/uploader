import { useState, useCallback, useEffect } from 'react';
import { isFunction } from './shared';
import useUploadyContext from './useUploadyContext';

type Callback = (...args: any) => any;

const useEventEffect = (event: string, fn: Callback) => {
  const context = useUploadyContext();
  const { on, off } = context;

  useEffect(() => {
    on(event, fn);

    return () => {
      off(event, fn);
    };
  }, [event, fn, on, off]);
};

type WithStateFn = (fn?: Callback, id?: string) => any;

const generateUploaderEventHookWithState =
  <T>(event: string, stateCalculator: (state: T) => any): WithStateFn =>
  (fn?: Callback | string | any, id?: string): any => {
    const [eventState, setEventState] = useState<any[]>(null!);

    if (fn && !isFunction(fn)) {
      id = fn as string;
      fn = undefined;
    }

    const eventCallback = useCallback(
      (eventObj: any, ...args: any) => {
        if (!id || eventObj.id === id) {
          // @ts-ignore
          setEventState(stateCalculator(eventObj, ...args));

          if (isFunction(fn)) {
            fn(eventObj, ...args);
          }
        }
      },
      [fn, id],
    );

    useEventEffect(event, eventCallback);

    return eventState;
  };

const generateUploaderEventHook =
  (event: string, canScope: boolean = true): ((fn: Callback, id?: string) => void) =>
  (fn: Callback, id?: string) => {
    const eventCallback = useCallback(
      (eventObj: any, ...args: any) => {
        return fn! && (!canScope || !id || eventObj.id === id) ? fn(eventObj, ...args) : undefined;
      },
      [fn, id],
    );

    useEventEffect(event, eventCallback);
  };

export { generateUploaderEventHook, generateUploaderEventHookWithState };
