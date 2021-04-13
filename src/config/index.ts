import { getNearConfig } from './near';

export type { NearConfig } from './near';
export const nearConfig = getNearConfig('development'); // only for testing
export { awsConfig } from './aws';

export const appConfig = {
  AWSuseLocalConf: Boolean(
    JSON.parse(process.env.REACT_APP_AWS_USE_LOCAL_CONF || 'false'),
  ),
};
