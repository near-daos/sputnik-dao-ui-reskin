import { getNearConfig } from './near';

export type { NearConfig } from './near';

export const nearConfig = getNearConfig('development'); // only for testing
