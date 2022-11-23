import useUploadyContext from './useUploadyContext';
import { TUS_EXT } from './consts';
import { clearResumables } from './resumableStore';

const useClearResumableStore = (): (() => void) => {
  const context = useUploadyContext();
  const ext = context.getExtension(TUS_EXT);
  return () => clearResumables((ext as any).getOptions());
};

export default useClearResumableStore;
