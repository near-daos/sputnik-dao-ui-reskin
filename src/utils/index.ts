import { appConfig } from 'config';

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
  const response = await fetch(`${appConfig.logoPath}${logoName}.png`);

  return response.status !== 404;
};
