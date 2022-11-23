import { logger, hasWindow } from '../shared';
import createState from '../simple-state';
import handleEvents from './handleEvents';
import getTusSend from './tusSend';
import { TriggerMethod, TusOptions, TusState, TusStateData, UploaderType } from '../types';
import { getMandatoryTusOptions } from '../utils';
import createChunkedSender from '../chunkedSender';

const initializeState = (uploader: UploaderType<any>, options: TusOptions): TusState => {
  const { state, update } = createState<TusStateData>({
    options,
    items: {},
    featureDetection: {
      extensions: null,
      version: null,
      processed: false,
    },
  });

  const tusState = {
    getState: (): TusStateData => state,
    updateState: update,
  };

  if (hasWindow() && logger.isDebugOn()) {
    (window as any)[`__rpldy_${uploader.id}_tus_state`] = tusState;
  }

  return tusState;
};

const getResolvedOptions = (options: TusOptions): TusOptions => {
  options = getMandatoryTusOptions(options);

  if ((options.sendDataOnCreate || options.parallel) && options.deferLength) {
    logger.debugLog(
      `tusSender: turning off deferLength - cannot be used when sendDataOnCreate or parallel is enabled`,
    );
    options.deferLength = false;
  }

  //force chunked for TUS
  options.chunked = true;

  return options;
};

const createTusSender = (
  uploader: UploaderType<any>,
  options: TusOptions,
  trigger: TriggerMethod,
): { getOptions: () => TusOptions; send: any } => {
  options = getResolvedOptions(options);
  const chunkedSender = createChunkedSender(options, trigger);

  const tusState = initializeState(uploader, options);
  handleEvents(uploader, tusState, chunkedSender);

  const send = getTusSend(chunkedSender, tusState);

  return {
    send,
    getOptions: () => tusState.getState().options,
  };
};

export default createTusSender;
