//@ts-nocheck
function throttle(fn, interval, options) {
  let timeoutId = null;
  let throttledFn = null;
  let leading = options && options.leading;
  let trailing = options && options.trailing;

  if (leading == null) {
    leading = true; // default
  }

  if (trailing == null) {
    trailing = !leading; //default
  }

  // eslint-disable-next-line eqeqeq
  if (leading == true) {
    trailing = false; // forced because there should be invocation per call
  }

  const cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const flush = function () {
    const call = throttledFn;
    cancel();

    if (call) {
      call();
    }
  };

  const throttleWrapper = function () {
    let callNow = leading && !timeoutId;
    // @ts-ignore
    const context = this;
    const args = arguments;

    throttledFn = function () {
      return fn.apply(context, args);
    };

    if (!timeoutId) {
      timeoutId = setTimeout(function () {
        timeoutId = null;

        if (trailing) {
          return throttledFn();
        }
      }, interval);
    }

    if (callNow) {
      callNow = false;
      return throttledFn();
    }
  };

  throttleWrapper.cancel = cancel;
  throttleWrapper.flush = flush;

  return throttleWrapper;
}
export default throttle;
