export const awsConfig = {
  endpoint: process.env.REACT_APP_AWS_ENDPOINT || '',
  s3ForcePathStyle:
    Boolean(process.env.REACT_APP_AWS_S3_FORCE_PATH_STYLE) || false,
  apiVersion: process.env.REACT_APP_AWS_API_VERSION || '',
  bucket: process.env.REACT_APP_AWS_BUCKET || '',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION || '',
  identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID || '',
};
