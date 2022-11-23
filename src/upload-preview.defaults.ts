import { devFreeze } from './shared';
import type { PreviewOptions } from './types';

export const PREVIEW_DEFAULTS: PreviewOptions = devFreeze({
  rememberPreviousBatches: false,
  loadFirstOnly: false,
  previewComponentProps: undefined,
});
