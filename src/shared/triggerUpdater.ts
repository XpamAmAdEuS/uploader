import type { Trigger, Updater } from '../types';

type Outcome<T> = Promise<T> | Updater<T>;

const isEmpty = (val: any) => val === null || val === undefined;

const triggerUpdater = <T>(trigger: Trigger<T>, event?: string, ...args: unknown[]): Outcome<T> => {
  const doTrigger = (event: string, ...args: unknown[]): Promise<T> =>
    new Promise((resolve, reject) => {
      const results: Promise<T>[] = trigger(event, ...args);

      if (results && results.length) {
        Promise.all(results)
          .catch(reject)
          .then((resolvedResults) => {
            let result: any;
            if (resolvedResults) {
              while (isEmpty(result) && resolvedResults.length) {
                result = resolvedResults.pop();
              }
            }

            resolve(isEmpty(result) ? undefined : result);
          });
      } else {
        resolve(undefined as any);
      }
    });

  return event ? doTrigger(event, ...args) : doTrigger;
};

export default triggerUpdater;
