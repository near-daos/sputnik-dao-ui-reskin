import { awsConfig } from 'config';
import { awsS3 } from 'services/AwsUploader/AwsUploader';

/* eslint-disable no-plusplus */
export const convertDuration = (duration: number): Date => {
  const utcSeconds = duration / 1e9;
  const epoch = new Date(0);

  epoch.setUTCSeconds(utcSeconds);

  return epoch;
};

export const getRandomIntInclusive = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffle = <T>(array: T[]): void => {
  array.sort(() => Math.random() - 0.5);
};

export const checkIfLogoExist = async (logoName: string): Promise<boolean> => {
  const params = {
    Bucket: awsConfig.bucket,
    Key: `${logoName}.png`,
  };

  try {
    await awsS3.headObject(params).promise();

    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }

    return true;
  }
};
