import { getNearConfig, NEAR_ENV } from './near';

export type { NearConfig } from './near';
export const nearConfig = getNearConfig(
  (process.env.REACT_APP_NEAR_ENV as NEAR_ENV) || 'development',
);
export { awsConfig } from './aws';

export const appConfig = {
  logoPath: 'https://sputnik-dao.s3.eu-central-1.amazonaws.com/',
  awsUseLocalConf: Boolean(
    JSON.parse(process.env.REACT_APP_AWS_USE_LOCAL_CONF || 'false'),
  ),
};
