import { BatchItem, SendOptions, UploadData } from '../types';
import { FILE_STATES } from '../consts';

const getUploadMetadata = (sendOptions: SendOptions): string => {
  const keys = sendOptions.params && Object.keys(sendOptions.params);

  // @ts-ignore
  return keys.map((name) => `${name} ${window.btoa(<string>sendOptions.params[name])}`).join(',');
};

const getFileUploadMetadata = (item: BatchItem): string => {
  return `filetype ${window.btoa(item.file.type)},filename ${window.btoa(
    unescape(encodeURIComponent(item.file.name)),
  )}`;
};

const addLocationToResponse = (
  request: Promise<UploadData>,
  location?: string,
): Promise<UploadData> =>
  request.then((data: UploadData) => {
    if (data.state === FILE_STATES.FINISHED) {
      data.response.location = location;
    }

    return data;
  });

export { getUploadMetadata, addLocationToResponse, getFileUploadMetadata };
