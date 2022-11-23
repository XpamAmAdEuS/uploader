const OPTS_SYM = 'opts_init', //not using Symbol to avoid polyfill
  BAIL_LEVEL = 1000,
  arrayConcat = Array.prototype.concat;

const initOptions = (options: any) =>
  options[OPTS_SYM] === true
    ? options
    : {
        [OPTS_SYM]: true,
        recursive: options === true || !!options.recursive,
        withFullPath: !!options.withFullPath,
        bail: options.bail && options.bail > 0 ? options.bail : BAIL_LEVEL,
      };

const getFileWithFullPath = (file: any, fullPath: any,options?: any) => {
  const newFile = new File([file], fullPath, { type: file.type, lastModified: file.lastModified });
  //we add "hdcFullPath" prop because firefox converts the path "/" delimiter into ":"
    (newFile as any).hdcFullPath = fullPath;
  return newFile;
};

const getFile = (file: any, fullPath: any, options: any = {}) =>
  options.withFullPath ? getFileWithFullPath(file, fullPath, options) : file;

const getFileFromFileEntry = (entry: any, options: any) =>
  new Promise((resolve, reject) => {
    if (entry.file) {
      entry.file((file: any) => resolve(getFile(file, entry.fullPath, options)), reject);
    } else {
      resolve(null);
    }
  }).catch(() => {
    //swallow errors
    return null;
  });

const isItemFileEntry = (item: any) => item.kind === 'file';

const getAsEntry = (item: any) =>
  item.getAsEntry ? item.getAsEntry() : item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;

const getListAsArray = (
  list: any, //returns a flat array
) => arrayConcat.apply([], list);

export { initOptions, getFileFromFileEntry, isItemFileEntry, getAsEntry, getListAsArray };
