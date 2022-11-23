import hasWindow from './hasWindow';

const supportsIdle = hasWindow() && window.requestIdleCallback;
const scheduler = supportsIdle ? window.requestIdleCallback : setTimeout;
const clear = supportsIdle ? window.cancelIdleCallback : clearTimeout;

type ClearSchedule = () => void;

const scheduleIdleWork = (fn: Function, timeout: number = 0): ClearSchedule => {
  // @ts-ignore
  const handler = scheduler(fn, supportsIdle ? { timeout } : timeout);

  // @ts-ignore
  return () => clear(handler);
};

export default scheduleIdleWork;
