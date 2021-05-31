import { awsConfig } from 'config';
import { awsS3 } from 'services/AwsUploader/AwsUploader';
import { Proposal, ProposalStatus } from 'types/proposal';

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

export const checkIfNearAuthKeysExist = (): boolean => {
  let isKeysExist = false;
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.indexOf('near-api-js:') !== -1) {
      isKeysExist = true;
    }

    if (key.indexOf('wallet_auth_key') !== -1) {
      isKeysExist = true;
    }
  });

  return isKeysExist;
};

export const clearNearAuth = (): void => {
  // eslint-disable-next-line no-console
  // console.log('Near auth: clear');

  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.indexOf('near-api-js:') !== -1) {
      localStorage.removeItem(key);
    }

    if (key.indexOf('wallet_auth_key') !== -1) {
      localStorage.removeItem(key);
    }
  });
};

export const countProposalsByStatus = (
  proposals: Proposal[],
  status: ProposalStatus,
): number =>
  proposals.filter(
    (item) =>
      convertDuration(item.votePeriodEnd) >= new Date() &&
      item.status === status,
  ).length;

export const countFailedProposals = (proposals: Proposal[]): number =>
  proposals.filter(
    (item) =>
      convertDuration(item.votePeriodEnd) < new Date() ||
      [
        ProposalStatus.Delay,
        ProposalStatus.Fail,
        ProposalStatus.Reject,
      ].includes(item.status),
  ).length;
