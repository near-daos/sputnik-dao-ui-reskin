import { getNearConfig } from './near';

export type { NearConfig } from './near';
export const nearConfig = getNearConfig('development'); // only for testing
export { awsConfig } from './aws';

export const appConfig = {
  logoPath: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/',
  AWSuseLocalConf: Boolean(
    JSON.parse(process.env.REACT_APP_AWS_USE_LOCAL_CONF || 'false'),
  ),
};
