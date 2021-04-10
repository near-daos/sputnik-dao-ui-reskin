import { getNearConfig } from './near';

export type { NearConfig } from './near';

export const nearConfig = getNearConfig(process.env.NODE_ENV);
