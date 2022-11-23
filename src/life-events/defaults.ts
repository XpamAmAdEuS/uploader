import { devFreeze } from '../shared';
import type { LifeEventsOptions } from '../types';

const defaults: LifeEventsOptions = devFreeze({
  allowRegisterNonExistent: true,
  canAddEvents: true,
  canRemoveEvents: true,
  collectStats: false,
});

export default defaults;
