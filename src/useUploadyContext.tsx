import { useContext } from 'react';
import UploadyContext from './UploadyContext';
import assertContext from './assertContext';

import type { UploadyContextType } from './types';

const useUploadyContext = (): UploadyContextType => assertContext(useContext(UploadyContext));

export default useUploadyContext;
